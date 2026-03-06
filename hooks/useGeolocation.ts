'use client';

import { useState, useCallback, useRef } from 'react';

interface Position {
  lat: number;
  lng: number;
}

export function useGeolocation() {
  const [position, setPosition] = useState<Position | null>(null);
  const [suburb, setSuburb] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<{ position: Position; suburb: string | null; time: number } | null>(null);

  const isSupported = typeof navigator !== 'undefined' && 'geolocation' in navigator;

  const requestLocation = useCallback(async (): Promise<{ position: Position; suburb: string | null } | null> => {
    if (!isSupported) {
      setError('Geolocation not supported by your browser');
      return null;
    }

    // Check cache (5 min)
    if (cacheRef.current && Date.now() - cacheRef.current.time < 5 * 60 * 1000) {
      setPosition(cacheRef.current.position);
      setSuburb(cacheRef.current.suburb);
      return { position: cacheRef.current.position, suburb: cacheRef.current.suburb };
    }

    setIsLoading(true);
    setError(null);

    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        });
      });

      const coords: Position = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      setPosition(coords);

      // Reverse geocode via Nominatim
      let sub: string | null = null;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`,
          { headers: { 'User-Agent': 'BackpackBuddy-AU/1.0' } }
        );
        if (res.ok) {
          const data = await res.json();
          sub =
            data.address?.suburb ||
            data.address?.neighbourhood ||
            data.address?.city_district ||
            data.address?.town ||
            data.address?.city ||
            null;
          setSuburb(sub);
        }
      } catch {
        // Geocoding failed but we still have coordinates
      }
      cacheRef.current = { position: coords, suburb: sub, time: Date.now() };
      return { position: coords, suburb: sub };
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. Please enable location in your browser settings.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Could not determine your location.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out.');
            break;
        }
      } else {
        setError('Failed to get location');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  return { position, suburb, isLoading, error, requestLocation, isSupported };
}
