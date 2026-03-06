'use client';

import { useState } from 'react';
import { Expense } from '@/lib/types';

interface BudgetTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  dailyBudget: number;
  spent: number;
  remaining: number;
  expenses: Expense[];
  onSetBudget: (amount: number) => void;
  onAddExpense: (amount: number, category: string, note?: string) => void;
  onRemoveExpense: (id: string) => void;
  onResetDay: () => void;
}

const PRESETS = [50, 80, 100, 150];

const CATEGORIES = [
  { value: 'food', label: 'Food', icon: '🍜' },
  { value: 'accommodation', label: 'Stay', icon: '🛏️' },
  { value: 'transport', label: 'Transport', icon: '🚌' },
  { value: 'activities', label: 'Activities', icon: '📋' },
  { value: 'other', label: 'Other', icon: '💡' },
];

export default function BudgetTracker({
  isOpen,
  onClose,
  dailyBudget,
  spent,
  remaining,
  expenses,
  onSetBudget,
  onAddExpense,
  onRemoveExpense,
  onResetDay,
}: BudgetTrackerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [note, setNote] = useState('');
  const [customBudget, setCustomBudget] = useState('');

  if (!isOpen) return null;

  const percentSpent = dailyBudget > 0 ? Math.min(100, (spent / dailyBudget) * 100) : 0;
  const barColor =
    percentSpent > 75 ? 'bg-red-500' : percentSpent > 50 ? 'bg-amber-500' : 'bg-emerald-500';

  const handleAddExpense = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;
    onAddExpense(num, category, note.trim() || undefined);
    setAmount('');
    setNote('');
    setShowAddForm(false);
  };

  const handleSetCustomBudget = () => {
    const num = parseFloat(customBudget);
    if (isNaN(num) || num <= 0) return;
    onSetBudget(num);
    setCustomBudget('');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-[#1a1a27] shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#2a2a3a] bg-[#1a1a27] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20">
              <span className="text-lg">💰</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Daily Budget</h2>
              <p className="text-xs text-[#6e6e82]">Track your spending today</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#6e6e82] transition-colors hover:bg-[#2a2a3a] hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* Budget Setup */}
          {dailyBudget === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-[#9e9eb2]">Set your daily budget (AUD):</p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => onSetBudget(p)}
                    className="rounded-xl border border-[#3a3a52] bg-[#22223a] px-4 py-2.5 text-sm font-medium text-[#ececf1] transition-colors hover:border-emerald-500/40 hover:bg-[#2a2a4a]"
                  >
                    ${p}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={customBudget}
                  onChange={(e) => setCustomBudget(e.target.value)}
                  placeholder="Custom amount"
                  className="flex-1 rounded-xl border border-[#3a3a52] bg-[#22223a] px-4 py-2.5 text-sm text-[#ececf1] outline-none focus:border-emerald-500/50"
                  style={{ fontSize: '16px' }}
                />
                <button
                  onClick={handleSetCustomBudget}
                  className="rounded-xl bg-emerald-500/20 px-4 py-2.5 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/30"
                >
                  Set
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-white">${remaining.toFixed(0)}</p>
                    <p className="text-xs text-[#6e6e82]">remaining of ${dailyBudget}</p>
                  </div>
                  <p className="text-sm text-[#6e6e82]">${spent.toFixed(0)} spent</p>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-[#22223a]">
                  <div
                    className={`h-full rounded-full ${barColor} transition-all duration-500`}
                    style={{ width: `${percentSpent}%` }}
                  />
                </div>
              </div>

              {/* Add Expense */}
              {showAddForm ? (
                <div className="space-y-3 rounded-xl border border-[#2a2a3a] bg-[#22223a] p-4">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount ($)"
                    className="w-full rounded-lg border border-[#3a3a52] bg-[#1a1a27] px-3 py-2.5 text-sm text-[#ececf1] outline-none focus:border-emerald-500/50"
                    style={{ fontSize: '16px' }}
                    autoFocus
                  />
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setCategory(cat.value)}
                        className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                          category === cat.value
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-[#1a1a27] text-[#8e8ea0] border border-[#3a3a52]'
                        }`}
                      >
                        {cat.icon} {cat.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Note (optional)"
                    className="w-full rounded-lg border border-[#3a3a52] bg-[#1a1a27] px-3 py-2 text-sm text-[#ececf1] outline-none focus:border-emerald-500/50"
                    style={{ fontSize: '16px' }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddExpense}
                      className="flex-1 rounded-lg bg-emerald-500/20 py-2.5 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/30"
                    >
                      Add Expense
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="rounded-lg bg-[#1a1a27] px-4 py-2.5 text-sm text-[#6e6e82] transition-colors hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#3a3a52] bg-[#22223a]/50 py-3 text-sm text-[#8e8ea0] transition-colors hover:border-emerald-500/40 hover:text-emerald-400"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Expense
                </button>
              )}

              {/* Expense List */}
              {expenses.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6e6e82]">Today&apos;s Expenses</h3>
                  {expenses.map((exp) => {
                    const cat = CATEGORIES.find((c) => c.value === exp.category);
                    return (
                      <div key={exp.id} className="flex items-center justify-between rounded-xl bg-[#22223a] px-4 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm">{cat?.icon || '💡'}</span>
                          <div>
                            <p className="text-sm text-[#ececf1]">${exp.amount.toFixed(0)}</p>
                            {exp.note && <p className="text-[11px] text-[#6e6e82]">{exp.note}</p>}
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveExpense(exp.id)}
                          className="rounded p-1 text-[#5a5a72] transition-colors hover:text-red-400"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={onResetDay}
                  className="flex-1 rounded-xl bg-[#22223a] py-2.5 text-sm text-[#6e6e82] transition-colors hover:text-white"
                >
                  New Day
                </button>
                <button
                  onClick={() => { onSetBudget(0); onResetDay(); }}
                  className="flex-1 rounded-xl bg-red-500/10 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/20"
                >
                  Reset Budget
                </button>
              </div>
            </>
          )}
        </div>

        <div className="h-8 safe-bottom" />
      </div>
    </>
  );
}
