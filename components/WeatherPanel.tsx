'use client';

import { useState, useRef, useEffect } from 'react';
import { WeatherData } from '@/hooks/useWeather';
import { getWeatherEmoji } from '@/lib/weatherIcons';

interface WeatherPanelProps {
  isOpen: boolean;
  onClose: () => void;
  weather: WeatherData | null;
  isLoading: boolean;
  city: string | null;
  onChangeCity: (city: string) => void;
}

const AU_CITIES = [
  'Sydney',
  'Melbourne',
  'Brisbane',
  'Gold Coast',
  'Perth',
  'Adelaide',
  'Cairns',
  'Darwin',
  'Hobart',
  'Canberra',
  'Byron Bay',
  'Alice Springs',
];

export default function WeatherPanel({
  isOpen,
  onClose,
  weather,
  isLoading,
  city,
  onChangeCity,
}: WeatherPanelProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Cast weather to access extended fields
  const w = weather as (WeatherData & {
    forecast?: Array<{
      date: string;
      dateNum: string;
      icon: string;
      description: string;
      high: number;
      low: number;
      rainChance: number;
      humidity: number;
      windSpeed: number;
    }>;
    seasonal?: boolean;
    visibility?: number;
  }) | null;

  const filteredCities = searchQuery.trim().length > 0
    ? AU_CITIES.filter((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : AU_CITIES;

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    if (!isOpen) {
      setShowSearch(false);
      setSearchQuery('');
    }
  }, [isOpen]);

  function handleSelectCity(selectedCity: string) {
    onChangeCity(selectedCity);
    setShowSearch(false);
    setSearchQuery('');
  }

  if (!isOpen) return null;

  const forecast = w?.forecast ?? [];
  const isSeasonalData = w?.seasonal === true;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg mx-auto bg-[#1a1a27] rounded-t-2xl max-h-[92vh] overflow-y-auto animate-slide-up"
        style={{ boxShadow: '0 -4px 32px rgba(0,0,0,0.5)' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#8e8ea0]/40" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {showSearch ? (
              <div className="flex-1 relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Australian city..."
                  className="w-full bg-[#22223a] text-[#ececf1] placeholder-[#8e8ea0] rounded-xl px-4 py-2 text-sm outline-none border border-[#8e8ea0]/20 focus:border-amber-400/50"
                />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-[#ececf1] truncate">
                  {city ?? 'Select a city'}
                </h2>
                <button
                  onClick={() => setShowSearch(true)}
                  className="text-[#8e8ea0] hover:text-amber-400 transition-colors flex-shrink-0"
                  aria-label="Change location"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.232 5.232l3.536 3.536M9 11l6.364-6.364a2 2 0 112.828 2.828L11.828 13.828a2 2 0 01-1.414.586H8v-2.414a2 2 0 01.586-1.414z"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 ml-3">
            {showSearch && (
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                }}
                className="text-[#8e8ea0] hover:text-[#ececf1] text-sm transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#22223a] flex items-center justify-center text-[#8e8ea0] hover:text-[#ececf1] hover:bg-[#2d2d4a] transition-colors"
              aria-label="Close weather panel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* City search suggestions */}
        {showSearch && (
          <div className="px-5 pb-4">
            <div className="bg-[#22223a] rounded-xl overflow-hidden border border-[#8e8ea0]/10">
              {filteredCities.length === 0 ? (
                <div className="px-4 py-3 text-[#8e8ea0] text-sm">No cities found</div>
              ) : (
                filteredCities.map((c, idx) => (
                  <button
                    key={c}
                    onClick={() => handleSelectCity(c)}
                    className={`w-full text-left px-4 py-3 text-[#ececf1] text-sm hover:bg-[#2d2d4a] transition-colors flex items-center gap-2 ${
                      idx < filteredCities.length - 1 ? 'border-b border-[#8e8ea0]/10' : ''
                    }`}
                  >
                    <span className="text-[#8e8ea0]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    {c}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="px-5 pb-8 flex flex-col items-center justify-center gap-3 min-h-[200px]">
            <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            <p className="text-[#8e8ea0] text-sm">Loading weather...</p>
          </div>
        )}

        {/* No data state */}
        {!isLoading && !w && !showSearch && (
          <div className="px-5 pb-8 flex flex-col items-center justify-center gap-3 min-h-[200px]">
            <span className="text-4xl">🌤️</span>
            <p className="text-[#8e8ea0] text-sm text-center">
              {city ? 'Weather data unavailable' : 'Select a city to see weather'}
            </p>
          </div>
        )}

        {/* Main weather content */}
        {!isLoading && w && !showSearch && (
          <div className="px-5 pb-8 space-y-5">
            {/* Hero section */}
            <div className="flex flex-col items-center text-center py-4">
              <div className="text-6xl font-thin text-[#ececf1] tracking-tight">
                {w.temp}°C
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-3xl" role="img" aria-label={w.description}>
                  {getWeatherEmoji(w.icon)}
                </span>
                <span className="text-[#ececf1] text-lg capitalize">{w.description}</span>
              </div>
              <p className="text-[#8e8ea0] text-sm mt-1">
                Feels like {w.feelsLike}°C
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: '💧', label: 'Humidity', value: `${w.humidity}%` },
                { icon: '💨', label: 'Wind', value: `${w.windSpeed} m/s` },
                {
                  icon: '👁️',
                  label: 'Visibility',
                  value: w.visibility !== undefined ? `${w.visibility} km` : '—',
                },
                { icon: '🌡️', label: 'Feels like', value: `${w.feelsLike}°C` },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#22223a] rounded-xl p-3 flex flex-col items-center gap-1"
                >
                  <span className="text-xl">{stat.icon}</span>
                  <span className="text-[#ececf1] text-xs font-medium text-center">{stat.value}</span>
                  <span className="text-[#8e8ea0] text-[10px] text-center">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* 7-Day Forecast */}
            {forecast.length > 0 && (
              <div className="bg-[#22223a] rounded-2xl overflow-hidden">
                <div className="px-4 pt-3 pb-2 border-b border-[#8e8ea0]/10">
                  <p className="text-[#8e8ea0] text-xs font-semibold tracking-wider uppercase">
                    7-Day Forecast
                  </p>
                </div>
                <div>
                  {forecast.map((day, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center px-4 py-3 gap-3 ${
                        idx < forecast.length - 1 ? 'border-b border-[#8e8ea0]/10' : ''
                      }`}
                    >
                      {/* Day name + date */}
                      <div className="w-16 flex-shrink-0">
                        <p className="text-[#ececf1] text-sm font-medium">{day.date}</p>
                        <p className="text-[#8e8ea0] text-xs">{day.dateNum}</p>
                      </div>

                      {/* Weather emoji */}
                      <div className="flex-shrink-0 w-8 text-center">
                        <span className="text-xl" role="img" aria-label={day.description}>
                          {getWeatherEmoji(day.icon)}
                        </span>
                      </div>

                      {/* Rain chance */}
                      <div className="flex-1 flex items-center gap-1">
                        <span className="text-xs">💧</span>
                        <span
                          className={`text-xs font-medium ${
                            day.rainChance > 20 ? 'text-blue-400' : 'text-[#8e8ea0]'
                          }`}
                        >
                          {day.rainChance}%
                        </span>
                      </div>

                      {/* High/Low temps */}
                      <div className="flex-shrink-0 text-right">
                        <span className="text-[#ececf1] text-sm font-medium">
                          {day.high}°
                        </span>
                        <span className="text-[#8e8ea0] text-sm"> / {day.low}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rain probability bar chart */}
            {forecast.length > 0 && (
              <div className="bg-[#22223a] rounded-2xl p-4">
                <p className="text-[#8e8ea0] text-xs font-semibold tracking-wider uppercase mb-4">
                  Rain Chance This Week
                </p>
                <div className="flex items-end justify-between gap-1 h-16">
                  {forecast.map((day, idx) => {
                    const barHeightPct = Math.max(4, day.rainChance);
                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center gap-1 flex-1"
                      >
                        <div className="flex-1 w-full flex items-end">
                          <div
                            className="w-full rounded-t-sm bg-blue-500/70"
                            style={{ height: `${barHeightPct}%` }}
                          />
                        </div>
                        <span className="text-[#8e8ea0] text-[9px] truncate w-full text-center">
                          {day.date === 'Today' ? 'Now' : day.date.slice(0, 2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Seasonal notice */}
            {isSeasonalData && (
              <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl px-4 py-3 flex items-start gap-2">
                <span className="text-amber-400 text-sm flex-shrink-0">⚠️</span>
                <p className="text-amber-400 text-xs leading-relaxed">
                  Seasonal estimates — live data activates when API key is verified
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
