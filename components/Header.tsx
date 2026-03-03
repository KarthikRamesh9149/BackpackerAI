'use client';

import { AppStatus } from '@/lib/types';

interface HeaderProps {
  status: AppStatus;
  userCity: string | null;
  onToggleSaved: () => void;
  savedCount: number;
}

const statusConfig: Record<AppStatus, { label: string; color: string } | null> = {
  ready: null,
  listening: { label: 'Listening...', color: 'text-red-400' },
  thinking: { label: 'Thinking...', color: 'text-amber-400' },
  speaking: { label: 'Speaking...', color: 'text-blue-400' },
};

export default function Header({ status, userCity, onToggleSaved, savedCount }: HeaderProps) {
  const statusInfo = statusConfig[status];

  return (
    <header className="flex-shrink-0 border-b border-[#22223a] bg-[#15152a]">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎒</span>
            <span className="text-base font-semibold text-white">
              BackpackBuddy <span className="text-amber-400">AU</span>
            </span>
          </div>

          {/* City chip */}
          {userCity && (
            <div className="flex items-center gap-1 rounded-full border border-[#3a3a52] bg-[#22223a] px-2.5 py-1">
              <svg className="h-3 w-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-[#9e9eb2]">{userCity}</span>
            </div>
          )}

          {/* Status indicator */}
          {statusInfo && (
            <span className={`text-xs animate-pulse ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          )}
        </div>

        <button
          onClick={onToggleSaved}
          className="relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-[#8e8ea0] transition-colors hover:bg-[#22223a] hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          Saved
          {savedCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-900">
              {savedCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
