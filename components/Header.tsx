'use client';

import { AppStatus } from '@/lib/types';
import WeatherChip from './WeatherChip';
import { WeatherData } from '@/hooks/useWeather';

interface HeaderProps {
  status: AppStatus;
  userCity: string | null;
  onToggleSaved: () => void;
  savedCount: number;
  onToggleSOS: () => void;
  weather?: WeatherData | null;
  weatherLoading?: boolean;
  onToggleBudget?: () => void;
  budgetRemaining?: number | null;
  dailyBudget?: number | null;
  onToggleSlang?: () => void;
  onToggleCurrency?: () => void;
  onTogglePacking?: () => void;
  packingProgress?: number;
  onToggleMap?: () => void;
  mapOpen?: boolean;
  onToggleItinerary?: () => void;
  itineraryCount?: number;
  onChangeCity?: () => void;
  onToggleWeather?: () => void;
}

const statusConfig: Record<AppStatus, { label: string; color: string } | null> = {
  ready: null,
  listening: { label: 'Listening...', color: 'text-red-400' },
  thinking: { label: 'Thinking...', color: 'text-amber-400' },
  speaking: { label: 'Speaking...', color: 'text-blue-400' },
};

export default function Header({ status, userCity, onToggleSaved, savedCount, onToggleSOS, weather, weatherLoading, onToggleBudget, budgetRemaining, dailyBudget, onToggleSlang, onToggleCurrency, onTogglePacking, packingProgress, onToggleMap, mapOpen, onToggleItinerary, itineraryCount, onChangeCity, onToggleWeather }: HeaderProps) {
  const statusInfo = statusConfig[status];

  return (
    <header className="flex-shrink-0 border-b border-[#22223a] bg-[#15152a]">
      {/* Desktop header — hidden on mobile */}
      <div className="hidden sm:flex mx-auto items-center justify-between px-4 py-3 max-w-3xl">
        <div className="flex items-center gap-3">
          {/* SOS Button */}
          <button
            onClick={onToggleSOS}
            className="flex h-7 items-center gap-1 rounded-full bg-red-500/15 px-2.5 text-[10px] font-bold uppercase tracking-wider text-red-400 transition-colors hover:bg-red-500/25 active:scale-95"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            SOS
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xl">🎒</span>
            <span className="text-base font-semibold text-white">
              BackpackBuddy <span className="text-amber-400">AU</span>
            </span>
          </div>

          {/* City + Weather chips */}
          {userCity && (
            <div className="flex items-center gap-1.5">
              <button onClick={onChangeCity} className="flex items-center gap-1 rounded-full border border-[#3a3a52] bg-[#22223a] px-2.5 py-1 transition-colors hover:border-amber-400/50 hover:bg-[#2a2a3e] active:scale-95" title="Change city">
                <svg className="h-3 w-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-[#9e9eb2]">{userCity}</span>
              </button>
              <button onClick={onToggleWeather} className="rounded-full transition-all hover:ring-1 hover:ring-amber-400/50 active:scale-95" title="Weather forecast">
                <WeatherChip weather={weather || null} isLoading={weatherLoading || false} />
              </button>
            </div>
          )}

          {/* Status indicator */}
          {statusInfo && (
            <span className={`text-xs animate-pulse ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
          {/* Slang Guide button */}
          {onToggleSlang && (
            <button
              onClick={onToggleSlang}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm transition-colors hover:bg-[#22223a]"
              title="Aussie Slang Guide"
            >
              🇦🇺
            </button>
          )}

          {/* Currency button */}
          {onToggleCurrency && (
            <button
              onClick={onToggleCurrency}
              className="flex h-8 flex-shrink-0 items-center gap-0.5 rounded-lg px-1.5 text-[#8e8ea0] transition-colors hover:bg-[#22223a] hover:text-amber-400"
              title="Currency Converter"
            >
              <span className="text-sm">💱</span>
            </button>
          )}

          {/* Budget button */}
          {onToggleBudget && (
            <button
              onClick={onToggleBudget}
              className="flex h-8 flex-shrink-0 items-center gap-0.5 rounded-lg px-1.5 text-[#8e8ea0] transition-colors hover:bg-[#22223a] hover:text-emerald-400"
              title="Budget Tracker"
            >
              <span className="text-sm">💰</span>
              {dailyBudget && dailyBudget > 0 && (
                <span className="text-[10px] font-medium text-emerald-400">${budgetRemaining?.toFixed(0)}</span>
              )}
            </button>
          )}

          {/* Packing button */}
          {onTogglePacking && (
            <button
              onClick={onTogglePacking}
              className="relative flex h-8 flex-shrink-0 items-center gap-0.5 rounded-lg px-1.5 text-[#8e8ea0] transition-colors hover:bg-[#22223a] hover:text-blue-400"
              title="Packing Checklist"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              {packingProgress !== undefined && packingProgress > 0 && packingProgress < 100 && (
                <span className="text-[10px] font-medium text-blue-400">{Math.round(packingProgress)}%</span>
              )}
              {packingProgress !== undefined && packingProgress >= 100 && (
                <span className="text-[10px] text-emerald-400">✓</span>
              )}
            </button>
          )}

          {/* Map toggle */}
          {onToggleMap && (
            <button
              onClick={onToggleMap}
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                mapOpen
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'text-[#8e8ea0] hover:bg-[#22223a] hover:text-amber-400'
              }`}
              title="Map View"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </button>
          )}

          {/* Itinerary button */}
          {onToggleItinerary && (
            <button
              onClick={onToggleItinerary}
              className="relative flex h-8 flex-shrink-0 items-center gap-0.5 rounded-lg px-1.5 text-[#8e8ea0] transition-colors hover:bg-[#22223a] hover:text-emerald-400"
              title="Itinerary Builder"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {itineraryCount !== undefined && itineraryCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-slate-900">
                  {itineraryCount > 9 ? '9+' : itineraryCount}
                </span>
              )}
            </button>
          )}

          {/* Saved button */}
          <button
            onClick={onToggleSaved}
            className="relative flex h-8 flex-shrink-0 items-center gap-1 rounded-lg px-1.5 text-sm text-[#8e8ea0] transition-colors hover:bg-[#22223a] hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="hidden sm:inline text-xs">Saved</span>
            {savedCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-900">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile header — compact top bar */}
      <div className="flex sm:hidden items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎒</span>
          <span className="text-sm font-semibold text-white">BackpackBuddy</span>
        </div>
        <div className="flex items-center gap-1">
          {userCity && (
            <button onClick={onChangeCity} className="flex items-center gap-0.5 rounded-full border border-[#3a3a52] bg-[#22223a] px-1.5 py-0.5 transition-colors active:scale-95" title="Change city">
              <svg className="h-2.5 w-2.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-[10px] text-[#9e9eb2]">{userCity}</span>
            </button>
          )}
          {statusInfo && (
            <span className={`text-[10px] animate-pulse ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
