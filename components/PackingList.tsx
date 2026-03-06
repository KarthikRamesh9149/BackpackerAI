'use client';

import { useState, useMemo } from 'react';
import { PackingItem, PACKING_CATEGORIES } from '@/lib/packingDefaults';

interface PackingListProps {
  isOpen: boolean;
  onClose: () => void;
  items: PackingItem[];
  onToggle: (id: string) => void;
  onAdd: (text: string, category: string) => void;
  onRemove: (id: string) => void;
  onReset: () => void;
  checkedCount: number;
  totalCount: number;
  progress: number;
}

export default function PackingList({
  isOpen,
  onClose,
  items,
  onToggle,
  onAdd,
  onRemove,
  onReset,
  checkedCount,
  totalCount,
  progress,
}: PackingListProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Custom');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category));
    return PACKING_CATEGORIES.filter((c) => cats.has(c));
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!activeCategory) return items;
    return items.filter((i) => i.category === activeCategory);
  }, [items, activeCategory]);

  const grouped = useMemo(() => {
    const groups: Record<string, PackingItem[]> = {};
    for (const item of filteredItems) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [filteredItems]);

  const handleAdd = () => {
    if (newItemText.trim()) {
      onAdd(newItemText, newItemCategory);
      setNewItemText('');
      setShowAddForm(false);
    }
  };

  const progressColor =
    progress >= 80
      ? 'bg-emerald-500'
      : progress >= 50
      ? 'bg-amber-500'
      : 'bg-blue-500';

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] overflow-hidden rounded-t-2xl bg-[#1a1a27] shadow-2xl animate-slide-up flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-[#2a2a3a] px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-lg">
                🎒
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Packing Checklist</h2>
                <p className="text-xs text-[#6e6e82]">
                  {checkedCount}/{totalCount} packed
                </p>
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

          {/* Progress bar */}
          <div className="mt-3">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#22223a]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <p className="text-[11px] text-[#6e6e82]">
                {progress >= 100
                  ? 'All packed! Ready to go!'
                  : progress >= 80
                  ? 'Almost there!'
                  : progress >= 50
                  ? 'Halfway packed'
                  : 'Keep packing...'}
              </p>
              <p className="text-[11px] font-semibold text-amber-400">{Math.round(progress)}%</p>
            </div>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex-shrink-0 flex gap-2 overflow-x-auto px-5 py-3 scrollbar-hide border-b border-[#2a2a3a]">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex-shrink-0 rounded-full px-3 py-1 text-xs transition-colors ${
              !activeCategory
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-[#22223a] text-[#6e6e82] hover:text-white'
            }`}
          >
            All ({totalCount})
          </button>
          {categories.map((cat) => {
            const count = items.filter((i) => i.category === cat).length;
            const checked = items.filter((i) => i.category === cat && i.checked).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`flex-shrink-0 rounded-full px-3 py-1 text-xs transition-colors ${
                  activeCategory === cat
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-[#22223a] text-[#6e6e82] hover:text-white'
                }`}
              >
                {cat} ({checked}/{count})
              </button>
            );
          })}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {Object.entries(grouped).map(([category, catItems]) => (
            <div key={category} className="mb-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#6e6e82]">
                {category}
              </h3>
              <div className="space-y-1">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                      item.checked ? 'bg-[#1e2a1e]' : 'bg-[#22223a]'
                    }`}
                  >
                    <button
                      onClick={() => onToggle(item.id)}
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-colors ${
                        item.checked
                          ? 'border-emerald-500 bg-emerald-500'
                          : 'border-[#4a4a62] hover:border-amber-400'
                      }`}
                    >
                      {item.checked && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span
                      className={`flex-1 text-sm transition-colors ${
                        item.checked ? 'text-[#5a5a72] line-through' : 'text-[#ececf1]'
                      }`}
                    >
                      {item.text}
                    </span>
                    {item.isCustom && (
                      <button
                        onClick={() => onRemove(item.id)}
                        className="flex-shrink-0 rounded p-1 text-[#4a4a62] transition-colors hover:text-red-400"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add Item Form */}
        {showAddForm && (
          <div className="flex-shrink-0 border-t border-[#2a2a3a] px-5 py-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Add custom item..."
                className="flex-1 rounded-xl border border-[#3a3a52] bg-[#22223a] px-3 py-2.5 text-sm text-[#ececf1] outline-none focus:border-amber-500/50"
                style={{ fontSize: '16px' }}
                autoFocus
              />
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="rounded-xl border border-[#3a3a52] bg-[#22223a] px-2 py-2.5 text-xs text-[#c8c8d8] outline-none"
              >
                {PACKING_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="mt-2 flex gap-2">
              <button
                onClick={handleAdd}
                disabled={!newItemText.trim()}
                className="flex-1 rounded-xl bg-amber-500 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-amber-400 disabled:opacity-40"
              >
                Add Item
              </button>
              <button
                onClick={() => { setShowAddForm(false); setNewItemText(''); }}
                className="rounded-xl bg-[#22223a] px-4 py-2 text-sm text-[#8e8ea0] transition-colors hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex-shrink-0 flex items-center gap-2 border-t border-[#2a2a3a] px-5 py-3 safe-bottom">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500/15 px-4 py-2.5 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-500/25"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Custom
          </button>
          {showResetConfirm ? (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-red-400">Reset all?</span>
              <button
                onClick={() => { onReset(); setShowResetConfirm(false); }}
                className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/30"
              >
                Yes
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="rounded-lg bg-[#22223a] px-3 py-1.5 text-xs text-[#8e8ea0]"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="ml-auto rounded-xl bg-[#22223a] px-4 py-2.5 text-sm text-[#6e6e82] transition-colors hover:text-red-400"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </>
  );
}
