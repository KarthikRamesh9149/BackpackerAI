'use client';

interface MobileNavProps {
  onToggleSOS: () => void;
  onToggleSaved: () => void;
  savedCount: number;
  onToggleSlang: () => void;
  onToggleCurrency: () => void;
  onToggleBudget: () => void;
  budgetRemaining?: number | null;
  onTogglePacking: () => void;
  packingProgress?: number;
  onToggleMap: () => void;
  mapOpen?: boolean;
  onToggleItinerary: () => void;
  itineraryCount?: number;
  onToggleWeather: () => void;
}

export default function MobileNav({
  onToggleSOS,
  onToggleSaved,
  savedCount,
  onToggleSlang,
  onToggleCurrency,
  onToggleBudget,
  budgetRemaining,
  onTogglePacking,
  packingProgress,
  onToggleMap,
  mapOpen,
  onToggleItinerary,
  itineraryCount,
  onToggleWeather,
}: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 sm:hidden flex items-center justify-around border-t border-[#22223a] bg-[#15152a] px-1 py-2 z-40">
      {/* SOS */}
      <button
        onClick={onToggleSOS}
        className="flex flex-col items-center justify-center gap-0.5 rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-500/10 active:scale-90"
        title="SOS"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[9px]">SOS</span>
      </button>

      {/* Slang 🇦🇺 */}
      <button
        onClick={onToggleSlang}
        className="flex flex-col items-center justify-center gap-0.5 rounded-lg p-1.5 text-[#8e8ea0] transition-colors hover:bg-[#22223a] hover:text-white active:scale-90"
        title="Slang"
      >
        <span className="text-xl">🇦🇺</span>
        <span className="text-[9px]">Slang</span>
      </button>

      {/* Weather */}
      <button
        onClick={onToggleWeather}
        className="flex flex-col items-center justify-center gap-0.5 rounded-lg p-1.5 text-[#8e8ea0] transition-colors hover:bg-[#22223a] hover:text-amber-400 active:scale-90"
        title="Weather"
      >
        <span className="text-lg">☁️</span>
        <span className="text-[9px]">Weather</span>
      </button>

      {/* Currency */}
      <button
        onClick={onToggleCurrency}
        className="flex flex-col items-center justify-center gap-0.5 rounded-lg p-1.5 text-[#8e8ea0] transition-colors hover:bg-[#22223a] hover:text-amber-400 active:scale-90"
        title="Currency"
      >
        <span className="text-lg">💱</span>
        <span className="text-[9px]">Currency</span>
      </button>

      {/* Budget */}
      <button
        onClick={onToggleBudget}
        className="relative flex flex-col items-center justify-center gap-0.5 rounded-lg p-1.5 text-[#8e8ea0] transition-colors hover:bg-[#22223a] hover:text-emerald-400 active:scale-90"
        title="Budget"
      >
        <span className="text-lg">💰</span>
        {budgetRemaining !== undefined && budgetRemaining !== null && budgetRemaining < 10 && (
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
        )}
        <span className="text-[9px]">Budget</span>
      </button>

      {/* Packing */}
      <button
        onClick={onTogglePacking}
        className="relative flex flex-col items-center justify-center gap-0.5 rounded-lg p-1.5 text-[#8e8ea0] transition-colors hover:bg-[#22223a] hover:text-blue-400 active:scale-90"
        title="Packing"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        {packingProgress && packingProgress >= 100 && (
          <span className="absolute top-0 right-0 text-emerald-400 text-[9px] font-bold">✓</span>
        )}
        <span className="text-[9px]">Packing</span>
      </button>

      {/* Map */}
      <button
        onClick={onToggleMap}
        className={`flex flex-col items-center justify-center gap-0.5 rounded-lg p-1.5 transition-colors active:scale-90 ${
          mapOpen ? 'bg-amber-500/20 text-amber-400' : 'text-[#8e8ea0] hover:bg-[#22223a] hover:text-amber-400'
        }`}
        title="Map"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <span className="text-[9px]">Map</span>
      </button>

      {/* Itinerary */}
      <button
        onClick={onToggleItinerary}
        className="relative flex flex-col items-center justify-center gap-0.5 rounded-lg p-1.5 text-[#8e8ea0] transition-colors hover:bg-[#22223a] hover:text-emerald-400 active:scale-90"
        title="Itinerary"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {itineraryCount && itineraryCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-slate-900">
            {itineraryCount > 9 ? '9+' : itineraryCount}
          </span>
        )}
        <span className="text-[9px]">Plans</span>
      </button>

      {/* Saved */}
      <button
        onClick={onToggleSaved}
        className="relative flex flex-col items-center justify-center gap-0.5 rounded-lg p-1.5 text-[#8e8ea0] transition-colors hover:bg-[#22223a] hover:text-white active:scale-90"
        title="Saved"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        {savedCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[8px] font-bold text-slate-900">
            {savedCount}
          </span>
        )}
        <span className="text-[9px]">Saved</span>
      </button>
    </nav>
  );
}
