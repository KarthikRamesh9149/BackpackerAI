'use client';

import { useState, useEffect, useCallback } from 'react';
import { Expense } from '@/lib/types';

const STORAGE_KEY = 'backpackbuddy-budget';

interface StoredBudget {
  dailyBudget: number;
  expenses: Expense[];
  date: string;
}

export function useBudget() {
  const [dailyBudget, setDailyBudget] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const stored: StoredBudget = JSON.parse(raw);
      const today = new Date().toDateString();

      if (stored.date === today) {
        setDailyBudget(stored.dailyBudget);
        setExpenses(stored.expenses);
      } else {
        // New day — keep budget amount, reset expenses
        setDailyBudget(stored.dailyBudget);
        setExpenses([]);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (dailyBudget === 0 && expenses.length === 0) return;
    const data: StoredBudget = {
      dailyBudget,
      expenses,
      date: new Date().toDateString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [dailyBudget, expenses]);

  const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = Math.max(0, dailyBudget - spent);

  const setBudget = useCallback((amount: number) => {
    setDailyBudget(amount);
  }, []);

  const addExpense = useCallback((amount: number, category: string, note?: string) => {
    const expense: Expense = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      amount,
      category,
      note,
      timestamp: Date.now(),
    };
    setExpenses((prev) => [...prev, expense]);
  }, []);

  const removeExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const resetDay = useCallback(() => {
    setExpenses([]);
  }, []);

  // Generate context string for AI
  const budgetContextString = dailyBudget > 0
    ? (() => {
        const categoryTotals: Record<string, number> = {};
        for (const e of expenses) {
          categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
        }
        const breakdown = Object.entries(categoryTotals)
          .map(([cat, total]) => `$${total} ${cat}`)
          .join(', ');
        return `Daily budget: $${dailyBudget} AUD. Spent so far: $${spent}${breakdown ? ` (${breakdown})` : ''}. Remaining: $${remaining}.`;
      })()
    : undefined;

  return {
    dailyBudget,
    spent,
    remaining,
    expenses,
    setBudget,
    addExpense,
    removeExpense,
    resetDay,
    budgetContextString,
  };
}
