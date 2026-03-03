'use client';

import { useState, useCallback, useEffect } from 'react';
import { CardItem } from '@/lib/types';

const STORAGE_KEY = 'backpackbuddy-saved-items';

interface SavedItem extends CardItem {
  savedId: string;
  savedAt: number;
}

interface SavedItemsResult {
  savedItems: SavedItem[];
  saveItem: (card: CardItem) => void;
  removeItem: (savedId: string) => void;
  clearAll: () => void;
  isItemSaved: (title: string) => boolean;
}

export function useSavedItems(): SavedItemsResult {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedItems(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist to localStorage on change
  const persist = useCallback((items: SavedItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, []);

  const saveItem = useCallback(
    (card: CardItem) => {
      setSavedItems((prev) => {
        // Don't save duplicates
        if (prev.some((item) => item.title === card.title)) return prev;

        const newItem: SavedItem = {
          ...card,
          savedId: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          savedAt: Date.now(),
        };
        const updated = [...prev, newItem];
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const removeItem = useCallback(
    (savedId: string) => {
      setSavedItems((prev) => {
        const updated = prev.filter((item) => item.savedId !== savedId);
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const clearAll = useCallback(() => {
    setSavedItems([]);
    persist([]);
  }, [persist]);

  const isItemSaved = useCallback(
    (title: string) => savedItems.some((item) => item.title === title),
    [savedItems]
  );

  return { savedItems, saveItem, removeItem, clearAll, isItemSaved };
}
