'use client';

import { CardItem } from '@/lib/types';

interface SavedItem extends CardItem {
  savedId: string;
  savedAt: number;
}

interface SavedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: SavedItem[];
  onRemove: (savedId: string) => void;
  onClearAll: () => void;
}

const typeLabels: Record<string, { label: string; icon: string }> = {
  eat: { label: 'Eat', icon: '🍜' },
  stay: { label: 'Stay', icon: '🛏️' },
  transport: { label: 'Transport', icon: '🚌' },
  plan: { label: 'Plan', icon: '📋' },
  essentials: { label: 'Essentials', icon: '💡' },
};

export default function SavedDrawer({
  isOpen,
  onClose,
  savedItems,
  onRemove,
  onClearAll,
}: SavedDrawerProps) {
  const grouped = savedItems.reduce(
    (acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
      return acc;
    },
    {} as Record<string, SavedItem[]>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed right-0 top-0 z-50 h-full w-80 transform bg-[#1a1a27] border-l border-[#2a2a3a] shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[#2a2a3a] px-4 py-3">
            <h2 className="flex items-center gap-2 text-base font-semibold text-white">
              <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Saved
              <span className="text-sm font-normal text-[#6e6e82]">({savedItems.length})</span>
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#6e6e82] transition-colors hover:bg-[#2a2a3a] hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {savedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 pt-12 text-center">
                <span className="text-3xl">📌</span>
                <p className="text-sm text-[#6e6e82]">
                  No saved items yet. Hit &ldquo;Save&rdquo; on any card.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {Object.entries(grouped).map(([type, items]) => (
                  <div key={type}>
                    <h3 className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#6e6e82]">
                      {typeLabels[type]?.icon} {typeLabels[type]?.label || type}
                    </h3>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.savedId} className="rounded-xl bg-[#22223a] p-3">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-medium text-[#ececf1]">{item.title}</h4>
                            <button
                              onClick={() => onRemove(item.savedId)}
                              className="flex-shrink-0 rounded p-1 text-[#5a5a72] transition-colors hover:text-red-400"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <ul className="mt-1.5 space-y-1">
                            {item.bullets.map((b, i) => (
                              <li key={i} className="text-[11px] text-[#8e8ea0] leading-relaxed">
                                · {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {savedItems.length > 0 && (
            <div className="border-t border-[#2a2a3a] px-4 py-3">
              <button
                onClick={onClearAll}
                className="w-full rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
