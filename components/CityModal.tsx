'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';

interface CityModalProps {
  onComplete: (city: string | null) => void;
}

const CITY_SUGGESTIONS = ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast'];

export default function CityModal({ onComplete }: CityModalProps) {
  const [city, setCity] = useState('');
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => {
      setVisible(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }, 80);
    return () => clearTimeout(t);
  }, []);

  const close = (cityValue: string | null) => {
    setVisible(false);
    setTimeout(() => onComplete(cityValue), 280);
  };

  const handleSubmit = () => close(city.trim() || null);
  const handleSkip = () => close(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') handleSkip();
  };

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleSkip} />

      <div
        className={`relative z-10 w-full max-w-sm rounded-2xl border border-[#3a3a52] bg-[#1a1a2e] p-7 shadow-2xl transition-all duration-300 ${
          visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-5'
        }`}
      >
        <button
          onClick={handleSkip}
          className="absolute right-4 top-4 rounded-lg p-1 text-[#5a5a72] transition-colors hover:text-[#9e9eb2]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6 text-center">
          <div className="mb-3 text-4xl">🗺️</div>
          <h2 className="text-xl font-semibold text-white">G&apos;day, traveller!</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#8e8ea0]">
            Which city are you exploring? I&apos;ll tailor my recommendations to your location.
          </p>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Melbourne, Sydney, Brisbane..."
          className="w-full rounded-xl border border-[#3a3a52] bg-[#23233a] px-4 py-3 text-[15px] text-white placeholder-[#5a5a72] outline-none transition-colors focus:border-amber-500/60"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {CITY_SUGGESTIONS.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`rounded-full border px-3 py-1 text-xs transition-all ${
                city === c
                  ? 'border-amber-500/60 bg-amber-500/15 text-amber-400'
                  : 'border-[#3a3a52] text-[#6e6e82] hover:border-[#5a5a72] hover:text-[#9e9eb2]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-5 w-full rounded-xl bg-amber-500 py-3 text-[15px] font-semibold text-slate-900 transition-all hover:bg-amber-400 active:scale-[0.98]"
        >
          {city.trim() ? `Explore ${city.trim()} →` : "Let's go!"}
        </button>

        <button
          onClick={handleSkip}
          className="mt-2 w-full py-2 text-sm text-[#5a5a72] transition-colors hover:text-[#8e8ea0]"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
