'use client';

import { WeatherData } from '@/hooks/useWeather';
import { getWeatherEmoji } from '@/lib/weatherIcons';

interface WeatherChipProps {
  weather: WeatherData | null;
  isLoading: boolean;
}

export default function WeatherChip({ weather, isLoading }: WeatherChipProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-1 rounded-full border border-[#3a3a52] bg-[#22223a] px-2.5 py-1">
        <div className="h-3 w-3 animate-pulse rounded-full bg-[#3a3a52]" />
        <div className="h-3 w-8 animate-pulse rounded bg-[#3a3a52]" />
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="flex items-center gap-1 rounded-full border border-[#3a3a52] bg-[#22223a] px-2.5 py-1">
      <span className="text-xs">{getWeatherEmoji(weather.icon)}</span>
      <span className="text-xs text-[#9e9eb2]">
        {Math.round(weather.temp)}°C
      </span>
    </div>
  );
}
