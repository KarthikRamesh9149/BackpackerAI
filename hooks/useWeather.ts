'use client';

import { useState, useEffect, useRef } from 'react';

export interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
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
}

interface CachedWeather {
  data: WeatherData;
  fetchedAt: number;
}

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export function useWeather(city: string | null) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cacheRef = useRef<Map<string, CachedWeather>>(new Map());

  useEffect(() => {
    if (!city) {
      setWeather(null);
      return;
    }

    const key = city.toLowerCase();
    const cached = cacheRef.current.get(key);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
      setWeather(cached.data);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Weather fetch failed');
        return res.json();
      })
      .then((data: WeatherData) => {
        if (cancelled) return;
        if (data.temp !== undefined) {
          cacheRef.current.set(key, { data, fetchedAt: Date.now() });
          setWeather(data);
        }
      })
      .catch(() => {
        if (!cancelled) setWeather(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [city]);

  return { weather, isLoading };
}
