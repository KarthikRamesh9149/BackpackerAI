'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import ChatPanel from '@/components/ChatPanel';
import InputBar from '@/components/InputBar';
import CityModal from '@/components/CityModal';
import SavedDrawer from '@/components/SavedDrawer';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useSavedItems } from '@/hooks/useSavedItems';
import { ChatMessage, AppStatus, LLMResponse, CardItem } from '@/lib/types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Converts price notation to spoken form so TTS reads naturally.
 * e.g. "$35–$45/night" → "35 to 45 dollars a night"
 *      "~$20"          → "around 20 dollars"
 */
function prepareForTTS(text: string): string {
  return text
    // ~$X–$Y/night  or  $X-$Y/night
    .replace(/~?\$(\d+)\s*[–\-]\s*\$?(\d+)\s*\/\s*night/gi, 'around $1 to $2 dollars a night')
    // ~$X–$Y pp  or  $X-$Y per person
    .replace(/~?\$(\d+)\s*[–\-]\s*\$?(\d+)\s*(?:pp|per\s*person)/gi, '$1 to $2 dollars per person')
    // ~$X–$Y  (any other range)
    .replace(/~?\$(\d+)\s*[–\-]\s*\$?(\d+)/gi, 'around $1 to $2 dollars')
    // ~$X/night (single approx, per night)
    .replace(/~\$(\d+)\s*\/\s*night/gi, 'around $1 dollars a night')
    // $X/night
    .replace(/\$(\d+)\s*\/\s*night/gi, '$1 dollars a night')
    // ~$X pp  or  ~$X per person
    .replace(/~\$(\d+)\s*(?:pp|per\s*person)/gi, 'around $1 dollars per person')
    // $X pp  or  $X per person
    .replace(/\$(\d+)\s*(?:pp|per\s*person)/gi, '$1 dollars per person')
    // ~$X  (approximate single amount)
    .replace(/~\$(\d+)/g, 'around $1 dollars')
    // $X  (any remaining dollar amount)
    .replace(/\$(\d+)/g, '$1 dollars');
}

export default function Home() {
  const [sessionId] = useState(() => generateId());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<AppStatus>('ready');
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);
  const [userCity, setUserCity] = useState<string | null>(null);
  // Always show city modal on every page load — session resets anyway
  const [showCityModal, setShowCityModal] = useState(true);

  const abortRef = useRef<AbortController | null>(null);

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: sttSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const { speak, stop: stopSpeaking, isSpeaking, isSupported: ttsSupported } = useSpeechSynthesis();
  const { savedItems, saveItem, removeItem, clearAll, isItemSaved } = useSavedItems();

  useEffect(() => {
    if (isListening) {
      setStatus('listening');
    } else if (isSpeaking) {
      setStatus('speaking');
    } else if (status === 'listening' || status === 'speaking') {
      setStatus('ready');
    }
  }, [isListening, isSpeaking, status]);

  const handleSubmit = useCallback(
    async (userText: string) => {
      if (!userText.trim()) return;

      stopSpeaking();
      resetTranscript();

      const userMsgId = generateId();
      const assistantMsgId = generateId();

      setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: 'user', content: userText.trim() },
        { id: assistantMsgId, role: 'assistant', content: '', isStreaming: true },
      ]);

      setStatus('thinking');

      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch('/api/turn', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            userTranscript: userText.trim(),
            // Send city on every request so it's always in session memory
            ...(userCity ? { locationText: userCity } : {}),
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({ error: 'Request failed' }));
          throw new Error(err.error || `HTTP ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (!data) continue;

            try {
              const event = JSON.parse(data);

              if (event.type === 'chunk') {
                // Raw JSON tokens suppressed — typing dots show instead
              } else if (event.type === 'done') {
                const json: LLMResponse = event.json;

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? {
                          ...msg,
                          content: json.assistant_text,
                          cards: json.cards,
                          followUp: json.follow_up_question,
                          isStreaming: false,
                        }
                      : msg
                  )
                );

                if (ttsSupported && json.assistant_text) {
                  setStatus('speaking');
                  speak(prepareForTTS(json.assistant_text));
                } else {
                  setStatus('ready');
                }
              }
            } catch {
              // ignore malformed SSE
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;

        const errorMsg = err instanceof Error ? err.message : 'Something went wrong';

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  content: `Sorry, I ran into an issue: ${errorMsg}. Please try again.`,
                  isStreaming: false,
                }
              : msg
          )
        );
        setStatus('ready');
      }
    },
    [sessionId, userCity, stopSpeaking, resetTranscript, speak, ttsSupported]
  );

  const handleCityModalComplete = useCallback((city: string | null) => {
    setShowCityModal(false);
    if (city) {
      setUserCity(city);
    }
  }, []);

  const handleSaveCard = useCallback(
    (card: CardItem) => saveItem(card),
    [saveItem]
  );

  return (
    <div className="flex h-screen flex-col bg-[#12121e] text-white">
      {/* City onboarding modal */}
      {showCityModal && <CityModal onComplete={handleCityModalComplete} />}

      <Header
        status={status}
        userCity={userCity}
        onToggleSaved={() => setSavedDrawerOpen(!savedDrawerOpen)}
        savedCount={savedItems.length}
      />

      <ChatPanel
        messages={messages}
        onSave={handleSaveCard}
        isItemSaved={isItemSaved}
        onSuggestionClick={handleSubmit}
        userCity={userCity}
      />

      <InputBar
        isListening={isListening}
        isSupported={sttSupported}
        transcript={transcript}
        interimTranscript={interimTranscript}
        isSpeaking={isSpeaking}
        onStart={startListening}
        onStop={stopListening}
        onSubmit={handleSubmit}
        onStopSpeaking={stopSpeaking}
        disabled={status === 'thinking'}
      />

      <SavedDrawer
        isOpen={savedDrawerOpen}
        onClose={() => setSavedDrawerOpen(false)}
        savedItems={savedItems}
        onRemove={removeItem}
        onClearAll={clearAll}
      />
    </div>
  );
}
