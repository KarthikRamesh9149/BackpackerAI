'use client';

import { useState, useEffect, useCallback } from 'react';
import { PackingItem, DEFAULT_PACKING_ITEMS } from '@/lib/packingDefaults';

const STORAGE_KEY = 'backpackbuddy-packing';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function initializeDefaultItems(): PackingItem[] {
  return DEFAULT_PACKING_ITEMS.map((item) => ({
    ...item,
    id: generateId(),
    checked: false,
  }));
}

export function usePackingList() {
  const [items, setItems] = useState<PackingItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as PackingItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          setInitialized(true);
          return;
        }
      }
    } catch {}
    // Initialize with defaults
    const defaults = initializeDefaultItems();
    setItems(defaults);
    setInitialized(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (initialized && items.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, initialized]);

  const toggleItem = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  }, []);

  const addItem = useCallback((text: string, category: string) => {
    if (!text.trim()) return;
    setItems((prev) => [
      ...prev,
      { id: generateId(), text: text.trim(), category, checked: false, isCustom: true },
    ]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const resetAll = useCallback(() => {
    const defaults = initializeDefaultItems();
    setItems(defaults);
  }, []);

  const checkedCount = items.filter((i) => i.checked).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return {
    items,
    toggleItem,
    addItem,
    removeItem,
    resetAll,
    checkedCount,
    totalCount,
    progress,
  };
}
