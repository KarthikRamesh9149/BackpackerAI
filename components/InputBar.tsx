'use client';

import { useRef, useState, KeyboardEvent, useEffect, useLayoutEffect } from 'react';

// SSR-safe hook — only returns true after first client paint
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => { setMounted(true); }, []);
  return mounted;
}

interface InputBarProps {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  isSpeaking: boolean;
  onStart: () => void;
  onStop: () => void;
  onSubmit: (text: string) => void;
  onStopSpeaking: () => void;
  disabled: boolean;
  onNearMe?: () => void;
  nearMeLoading?: boolean;
  nearMeSuburb?: string | null;
}

export default function InputBar({
  isListening,
  isSupported,
  transcript,
  interimTranscript,
  isSpeaking,
  onStart,
  onStop,
  onSubmit,
  onStopSpeaking,
  disabled,
  onNearMe,
  nearMeLoading,
  nearMeSuburb,
}: InputBarProps) {
  const [textValue, setTextValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mounted = useMounted();

  // Auto-resize textarea
  const resize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 180) + 'px';
  };

  useEffect(() => {
    resize();
  }, [textValue]);

  // While listening, live transcript is shown in the textarea (read-only)
  const displayValue = isListening
    ? transcript + (interimTranscript ? ' ' + interimTranscript : '')
    : textValue;

  const hasText = textValue.trim().length > 0;
  const canSend = hasText && !isListening && !disabled;

  const submitText = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTextValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    onSubmit(trimmed);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend) submitText(textValue);
    }
  };

  const handleMicClick = () => {
    if (disabled) return;
    if (isListening) {
      onStop();
      const finalText = (transcript + ' ' + interimTranscript).trim();
      if (finalText) {
        setTimeout(() => onSubmit(finalText), 100);
      }
    } else {
      setTextValue('');
      onStart();
    }
  };

  return (
    <div className="flex-shrink-0 px-3 pb-20 pt-2 bg-[#12121e] sm:pb-4 safe-bottom sm:px-4 sm:pt-3">
      <div className="mx-auto max-w-3xl">
        <div
          className={`relative flex items-end gap-2 rounded-2xl border px-4 py-3 shadow-lg transition-all duration-200 ${
            isListening
              ? 'border-red-500/40 bg-[#1e1414] shadow-red-900/20'
              : disabled
              ? 'border-[#2a2a3a] bg-[#1c1c2a] opacity-70'
              : 'border-[#32324a] bg-[#1c1c2a] hover:border-[#42425a]'
          }`}
        >
          {/* Near Me button — only after mount to avoid SSR/client mismatch */}
          {mounted && onNearMe && !isListening && !isSpeaking && (
            <button
              onClick={onNearMe}
              disabled={disabled || nearMeLoading}
              className={`mb-0.5 flex flex-shrink-0 items-center gap-1 self-end rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                nearMeSuburb
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-[#2a2a3a] text-[#8e8ea0] hover:text-emerald-400'
              } ${nearMeLoading ? 'animate-pulse' : ''}`}
            >
              <svg className={`h-3 w-3 ${nearMeLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden sm:inline">{nearMeSuburb || 'Near Me'}</span>
              <span className="sm:hidden">📍</span>
            </button>
          )}

          {/* Stop speaking pill — inline on the left */}
          {isSpeaking && !isListening && (
            <button
              onClick={onStopSpeaking}
              className="mb-0.5 flex flex-shrink-0 items-center gap-1.5 self-end rounded-lg bg-blue-500/15 px-2.5 py-1.5 text-xs text-blue-400 transition-colors hover:bg-blue-500/25"
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
              <span className="hidden sm:inline">Stop</span>
            </button>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={displayValue}
            onChange={(e) => {
              if (!isListening) setTextValue(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            disabled={disabled || isListening}
            rows={1}
            placeholder={
              isListening
                ? 'Listening...'
                : disabled
                ? 'Thinking...'
                : 'Message BackpackBuddy or tap the mic...'
            }
            inputMode="text"
            enterKeyHint="send"
            className="min-h-[28px] flex-1 resize-none bg-transparent leading-7 text-[#ececf1] placeholder-[#4a4a62] outline-none disabled:cursor-default"
            style={{ maxHeight: '180px', fontSize: '16px' }}
          />

          {/* Send OR Mic button */}
          {canSend ? (
            <button
              onClick={() => submitText(textValue)}
              className="mb-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center self-end rounded-xl bg-amber-500 text-slate-900 shadow-sm transition-all hover:bg-amber-400 active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleMicClick}
              disabled={disabled && !isListening}
              className={`mb-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center self-end rounded-xl transition-all duration-200 active:scale-95 ${
                disabled && !isListening
                  ? 'cursor-not-allowed bg-[#2a2a3a] opacity-40'
                  : isListening
                  ? 'bg-red-500 shadow-md shadow-red-500/30 hover:bg-red-600 mic-pulse'
                  : 'bg-[#2e2e46] text-[#8e8ea0] hover:bg-[#38384e] hover:text-amber-400'
              }`}
            >
              {isListening ? (
                <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              )}
            </button>
          )}
        </div>

        {!isSupported && (
          <p className="mt-1.5 text-center text-xs text-red-400/80">
            Voice input requires Chrome or Edge
          </p>
        )}
        <p className="mt-1.5 text-center text-[11px] text-[#3a3a52]">
          Estimates only — verify fares on local transit apps
        </p>
      </div>
    </div>
  );
}
