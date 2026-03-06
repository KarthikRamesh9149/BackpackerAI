'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'backpackbuddy-home-currency';

export function useCurrency() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [homeCurrency, setHomeCurrency] = useState<string>('USD');
  const [isLoading, setIsLoading] = useState(false);

  // Load home currency from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setHomeCurrency(saved);
  }, []);

  // Fetch rates
  useEffect(() => {
    setIsLoading(true);
    fetch('/api/currency')
      .then((res) => res.json())
      .then((data) => {
        if (data.rates) setRates(data.rates);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const changeHomeCurrency = useCallback((currency: string) => {
    setHomeCurrency(currency);
    localStorage.setItem(STORAGE_KEY, currency);
  }, []);

  const convert = useCallback(
    (audAmount: number): string | null => {
      if (!rates || !rates[homeCurrency]) return null;
      const result = audAmount * rates[homeCurrency];
      // Format nicely
      if (result >= 1000) return result.toFixed(0);
      if (result >= 100) return result.toFixed(0);
      return result.toFixed(2);
    },
    [rates, homeCurrency]
  );

  return { rates, homeCurrency, changeHomeCurrency, convert, isLoading };
}
