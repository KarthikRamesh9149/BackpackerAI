'use client';

interface VoiceBarProps {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  isSpeaking: boolean;
  onStart: () => void;
  onStop: () => void;
  onSubmit: (transcript: string) => void;
  onStopSpeaking: () => void;
  disabled: boolean;
}

export default function VoiceBar({
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
}: VoiceBarProps) {
  const displayText = (transcript + (interimTranscript ? ' ' + interimTranscript : '')).trim();

  const handleMicClick = () => {
    if (disabled) return;
    if (isListening) {
      onStop();
      const finalText = (transcript + ' ' + interimTranscript).trim();
      if (finalText) {
        setTimeout(() => onSubmit(finalText), 100);
      }
    } else {
      onStart();
    }
  };

  if (!isSupported) {
    return (
      <div className="flex-shrink-0 border-t border-[#2a2a38] bg-[#1a1a27] px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-red-800/40 bg-red-900/20 px-4 py-3 text-center text-sm text-red-400">
            Speech recognition requires Chrome or Edge browser.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 border-t border-[#2a2a38] bg-[#1a1a27] px-4 py-4">
      <div className="mx-auto max-w-3xl">
        {/* Main voice input bar */}
        <div
          className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200 ${
            isListening
              ? 'border-red-500/50 bg-[#2a1a1a] shadow-lg shadow-red-500/10'
              : 'border-[#3a3a4a] bg-[#23233a] hover:border-[#4a4a5a]'
          }`}
        >
          {/* Speaking indicator / Stop button */}
          {isSpeaking ? (
            <button
              onClick={onStopSpeaking}
              className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-blue-500/15 px-2.5 py-1.5 text-xs text-blue-400 transition-colors hover:bg-blue-500/25"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
              Stop
            </button>
          ) : (
            <div className="w-6 flex-shrink-0" />
          )}

          {/* Transcript or placeholder */}
          <div className="flex-1 min-w-0">
            {isListening && displayText ? (
              <p className="text-[15px] text-[#ececf1]">
                {transcript}
                {interimTranscript && (
                  <span className="text-[#6e6e82] italic"> {interimTranscript}</span>
                )}
              </p>
            ) : (
              <p className={`text-[15px] select-none ${
                isListening
                  ? 'text-red-400 animate-pulse'
                  : disabled
                  ? 'text-[#5a5a72]'
                  : 'text-[#5a5a72]'
              }`}>
                {isListening
                  ? 'Listening — tap mic to send...'
                  : disabled
                  ? 'Thinking...'
                  : 'Tap the mic and speak'}
              </p>
            )}
          </div>

          {/* Mic button */}
          <button
            onClick={handleMicClick}
            disabled={disabled}
            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
              disabled
                ? 'cursor-not-allowed bg-[#2a2a38] opacity-40'
                : isListening
                ? 'bg-red-500 shadow-md shadow-red-500/30 hover:bg-red-600 mic-pulse'
                : 'bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/20'
            }`}
          >
            {isListening ? (
              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              <svg className="h-4 w-4 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            )}
          </button>
        </div>

        <p className="mt-2 text-center text-[11px] text-[#4a4a5a]">
          Estimates only — verify exact fares/times on local transit apps
        </p>
      </div>
    </div>
  );
}
