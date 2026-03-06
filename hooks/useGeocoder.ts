'use client';

import { useCallback, useRef } from 'react';

interface GeoResult {
  lat: number;
  lng: number;
}

const cache = new Map<string, GeoResult | null>();
let lastRequestTime = 0;
const MIN_INTERVAL = 1100; // Nominatim requires 1 req/sec

export function useGeocoder(city: string | null) {
  const queueRef = useRef<Array<{ name: string; resolve: (r: GeoResult | null) => void }>>([]);
  const processingRef = useRef(false);

  const processQueue = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;

    while (queueRef.current.length > 0) {
      const item = queueRef.current.shift();
      if (!item) break;

      const cacheKey = `${item.name}|${city || ''}`;
      if (cache.has(cacheKey)) {
        item.resolve(cache.get(cacheKey) || null);
        continue;
      }

      // Rate limiting
      const now = Date.now();
      const wait = MIN_INTERVAL - (now - lastRequestTime);
      if (wait > 0) {
        await new Promise((r) => setTimeout(r, wait));
      }

      try {
        const q = city ? `${item.name}, ${city}, Australia` : `${item.name}, Australia`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1&countrycodes=au`;
        lastRequestTime = Date.now();

        const res = await fetch(url, {
          headers: { 'User-Agent': 'BackpackBuddy-AU/1.0' },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            const result = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
            cache.set(cacheKey, result);
            item.resolve(result);
            continue;
          }
        }
        cache.set(cacheKey, null);
        item.resolve(null);
      } catch {
        item.resolve(null);
      }
    }

    processingRef.current = false;
  }, [city]);

  const geocode = useCallback(
    (name: string): Promise<GeoResult | null> => {
      const cacheKey = `${name}|${city || ''}`;
      if (cache.has(cacheKey)) {
        return Promise.resolve(cache.get(cacheKey) || null);
      }

      return new Promise((resolve) => {
        queueRef.current.push({ name, resolve });
        processQueue();
      });
    },
    [city, processQueue]
  );

  return { geocode };
}
