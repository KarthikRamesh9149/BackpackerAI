'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage, CardItem as CardItemType } from '@/lib/types';
import CardsPanel from './CardsPanel';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSave: (card: CardItemType) => void;
  isItemSaved: (title: string) => boolean;
  onSuggestionClick: (text: string) => void;
  userCity: string | null;
}

/**
 * Renders assistant_text: splits on • bullet markers and displays
 * the opener sentence + a clean bullet list beneath it.
 */
function AssistantText({ content }: { content: string }) {
  // Split on • or - at start of a segment (after newline or inline)
  const parts = content.split(/\s*•\s*/).filter(Boolean);

  if (parts.length <= 1) {
    // No bullets — just plain text
    return <p className="whitespace-pre-wrap leading-7">{content}</p>;
  }

  const [opener, ...bullets] = parts;

  return (
    <div className="space-y-2">
      {opener.trim() && (
        <p className="leading-7">{opener.trim()}</p>
      )}
      <ul className="space-y-1.5">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400/60" />
            <span className="leading-7">{b.trim()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function getSuggestions(city: string | null): string[] {
  if (city) {
    return [
      `Where to eat cheap in ${city}?`,
      `Best budget hostels in ${city}?`,
      `How do I get around ${city} on public transport?`,
      `What can I do in ${city} for $50?`,
    ];
  }
  return [
    'Where should I eat on a budget in Australia?',
    'Best backpacker hostels in Australia?',
    'How do public transport cards work in Australia?',
    'What are the best cities to visit as a backpacker?',
  ];
}

export default function ChatPanel({
  messages,
  onSave,
  isItemSaved,
  onSuggestionClick,
  userCity,
}: ChatPanelProps) {
  const lastUserMsgRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      prevLengthRef.current = messages.length;
      // Small delay so the DOM has painted before we scroll
      setTimeout(() => {
        lastUserMsgRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, [messages.length]);

  const suggestions = getSuggestions(userCity);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 pb-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15 text-3xl">
            🎒
          </div>
          <h2 className="text-2xl font-semibold text-white">BackpackBuddy AU</h2>
          <p className="max-w-sm text-[15px] text-[#8e8ea0]">
            {userCity
              ? `Your AI travel mate for ${userCity}. Ask me anything.`
              : 'Your AI travel mate for Australia. Ask about food, transport, stays — anything.'}
          </p>
        </div>
        <div className="grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
          {suggestions.map((q) => (
            <button
              key={q}
              onClick={() => onSuggestionClick(q)}
              className="rounded-xl border border-[#3a3a4a] bg-[#2a2a38] px-4 py-3 text-left text-sm text-[#c8c8d8] transition-colors hover:border-[#5a5a7a] hover:bg-[#2f2f40] hover:text-white"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl px-3 py-5 space-y-5 sm:px-4 sm:py-6 sm:space-y-6">
        {messages.map((msg, i) => {
          const isLastUser =
            msg.role === 'user' &&
            !messages.slice(i + 1).some((m) => m.role === 'user');
          return (
          <div key={msg.id} ref={isLastUser ? lastUserMsgRef : undefined}>
            {msg.role === 'user' ? (
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#2f2f3e] px-4 py-3 text-[15px] text-[#ececf1]">
                  {msg.content}
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-base">
                    🎒
                  </div>
                </div>
                <div className="flex-1 min-w-0 space-y-4">
                  <div className="text-[15px] leading-7 text-[#ececf1]">
                    {msg.isStreaming && !msg.content ? (
                      <div className="flex gap-1 pt-1 pb-2">
                        <span className="h-2 w-2 rounded-full bg-[#8e8ea0] animate-bounce [animation-delay:-0.3s]" />
                        <span className="h-2 w-2 rounded-full bg-[#8e8ea0] animate-bounce [animation-delay:-0.15s]" />
                        <span className="h-2 w-2 rounded-full bg-[#8e8ea0] animate-bounce" />
                      </div>
                    ) : (
                      <AssistantText content={msg.content} />
                    )}
                  </div>

                  {msg.cards && msg.cards.length > 0 && (
                    <CardsPanel
                      cards={msg.cards}
                      onSave={onSave}
                      isItemSaved={isItemSaved}
                    />
                  )}

                  {msg.followUp && (
                    <div className="flex items-start gap-2 text-sm text-[#7a7a92]">
                      <span className="flex-shrink-0 mt-0.5">💬</span>
                      <span className="italic">{msg.followUp}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}
