'use client';

import { useState } from 'react';
import { CardItem } from '@/lib/types';
import { ItineraryItem } from '@/hooks/useItinerary';

const TYPE_ICONS: Record<string, string> = {
  eat: '🍴',
  stay: '🏨',
  transport: '🚌',
  plan: '📋',
  essentials: '💡',
};

const TYPE_COLORS: Record<string, string> = {
  eat: 'border-amber-500/30 bg-amber-500/5',
  stay: 'border-purple-500/30 bg-purple-500/5',
  transport: 'border-blue-500/30 bg-blue-500/5',
  plan: 'border-emerald-500/30 bg-emerald-500/5',
  essentials: 'border-red-500/30 bg-red-500/5',
};

interface ItineraryBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  days: number;
  onSetDays: (d: number) => void;
  savedItems: CardItem[];
  onImportFromSaved: (cards: CardItem[]) => void;
  getUnassigned: () => ItineraryItem[];
  getItemsForDay: (day: number) => ItineraryItem[];
  onAssignToDay: (itemId: string, day: number) => void;
  onUnassign: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onMoveUp: (itemId: string) => void;
  onMoveDown: (itemId: string) => void;
  onExport: () => string;
}

function MiniCard({
  item,
  onAssignToDay,
  onUnassign,
  onRemove,
  onMoveUp,
  onMoveDown,
  totalDays,
  isAssigned,
}: {
  item: ItineraryItem;
  onAssignToDay?: (itemId: string, day: number) => void;
  onUnassign?: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onMoveUp?: (itemId: string) => void;
  onMoveDown?: (itemId: string) => void;
  totalDays: number;
  isAssigned: boolean;
}) {
  const [showDayPicker, setShowDayPicker] = useState(false);

  return (
    <div className={`rounded-xl border px-3 py-2.5 ${TYPE_COLORS[item.card.type] || 'border-[#2a2a3a] bg-[#22223a]'}`}>
      <div className="flex items-start gap-2">
        <span className="mt-0.5 text-sm">{TYPE_ICONS[item.card.type] || '📌'}</span>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-white truncate">{item.card.title}</h4>
          <p className="mt-0.5 text-[11px] text-[#8e8ea0] line-clamp-2">
            {item.card.bullets[0]}
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-1">
          {isAssigned && onMoveUp && (
            <button onClick={() => onMoveUp(item.id)} className="rounded p-1 text-[#6e6e82] hover:text-white">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          )}
          {isAssigned && onMoveDown && (
            <button onClick={() => onMoveDown(item.id)} className="rounded p-1 text-[#6e6e82] hover:text-white">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
          {isAssigned && onUnassign ? (
            <button onClick={() => onUnassign(item.id)} className="rounded p-1 text-[#6e6e82] hover:text-amber-400" title="Unassign">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
          ) : onAssignToDay ? (
            <div className="relative">
              <button
                onClick={() => setShowDayPicker(!showDayPicker)}
                className="rounded bg-amber-500/20 px-2 py-1 text-[10px] font-medium text-amber-400 hover:bg-amber-500/30"
              >
                + Day
              </button>
              {showDayPicker && (
                <div className="absolute right-0 top-full z-10 mt-1 rounded-lg border border-[#3a3a52] bg-[#22223a] p-1 shadow-xl">
                  {Array.from({ length: totalDays }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => { onAssignToDay(item.id, i); setShowDayPicker(false); }}
                      className="block w-full rounded px-3 py-1.5 text-left text-xs text-[#c8c8d8] hover:bg-[#2a2a3a] hover:text-white whitespace-nowrap"
                    >
                      Day {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}
          <button onClick={() => onRemove(item.id)} className="rounded p-1 text-[#6e6e82] hover:text-red-400" title="Remove">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ItineraryBuilder({
  isOpen,
  onClose,
  days,
  onSetDays,
  savedItems,
  onImportFromSaved,
  getUnassigned,
  getItemsForDay,
  onAssignToDay,
  onUnassign,
  onRemove,
  onMoveUp,
  onMoveDown,
  onExport,
}: ItineraryBuilderProps) {
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [showExported, setShowExported] = useState(false);

  const unassigned = getUnassigned();
  const hasItems = unassigned.length > 0 || Array.from({ length: days }, (_, i) => getItemsForDay(i)).some((d) => d.length > 0);

  const handleExport = async () => {
    const text = onExport();
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setShowExported(true);
        setTimeout(() => setShowExported(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(text);
      setShowExported(true);
      setTimeout(() => setShowExported(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] overflow-hidden rounded-t-2xl bg-[#1a1a27] shadow-2xl animate-slide-up flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between border-b border-[#2a2a3a] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-lg">
              📅
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Trip Itinerary</h2>
              <p className="text-xs text-[#6e6e82]">{days} day{days !== 1 ? 's' : ''} planned</p>
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

        {/* Trip Duration */}
        <div className="flex-shrink-0 border-b border-[#2a2a3a] px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#6e6e82]">Trip length:</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 5, 7, 10, 14].map((d) => (
                <button
                  key={d}
                  onClick={() => onSetDays(d)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    days === d
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-[#22223a] text-[#6e6e82] hover:text-white'
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {/* Import button */}
          {!hasItems && savedItems.length > 0 && (
            <button
              onClick={() => onImportFromSaved(savedItems)}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 py-4 text-sm text-amber-400 transition-colors hover:bg-amber-500/10"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Import {savedItems.length} saved card{savedItems.length !== 1 ? 's' : ''}
            </button>
          )}

          {!hasItems && savedItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-3xl mb-3">📅</span>
              <p className="text-sm text-[#8e8ea0]">Save some cards first to build your itinerary</p>
              <p className="mt-1 text-xs text-[#5a5a72]">Ask BackpackBuddy for tips, then save the cards you like</p>
            </div>
          )}

          {/* Unassigned Pool */}
          {unassigned.length > 0 && (
            <div className="mb-4">
              <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6e6e82]">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Unassigned ({unassigned.length})
              </h3>
              <div className="space-y-1.5">
                {unassigned.map((item) => (
                  <MiniCard
                    key={item.id}
                    item={item}
                    onAssignToDay={onAssignToDay}
                    onRemove={onRemove}
                    totalDays={days}
                    isAssigned={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Day Columns */}
          {Array.from({ length: days }, (_, dayIndex) => {
            const dayItems = getItemsForDay(dayIndex);
            const isActive = activeDay === dayIndex;

            return (
              <div key={dayIndex} className="mb-4">
                <button
                  onClick={() => setActiveDay(isActive ? null : dayIndex)}
                  className="mb-2 flex w-full items-center justify-between"
                >
                  <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                    📅 Day {dayIndex + 1}
                    <span className="text-[#6e6e82]">({dayItems.length} activit{dayItems.length !== 1 ? 'ies' : 'y'})</span>
                  </h3>
                  <svg
                    className={`h-4 w-4 text-[#6e6e82] transition-transform ${isActive ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isActive && (
                  <div className="space-y-1.5">
                    {dayItems.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-[#3a3a52] py-4 text-center text-xs text-[#5a5a72]">
                        Assign cards from the pool above
                      </div>
                    ) : (
                      dayItems.map((item) => (
                        <MiniCard
                          key={item.id}
                          item={item}
                          onUnassign={onUnassign}
                          onRemove={onRemove}
                          onMoveUp={onMoveUp}
                          onMoveDown={onMoveDown}
                          totalDays={days}
                          isAssigned={true}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom actions */}
        {hasItems && (
          <div className="flex-shrink-0 flex items-center gap-2 border-t border-[#2a2a3a] px-5 py-3 safe-bottom">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500/15 px-4 py-2.5 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-500/25"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {showExported ? 'Copied!' : 'Export'}
            </button>
            {savedItems.length > 0 && hasItems && (
              <button
                onClick={() => onImportFromSaved(savedItems)}
                className="ml-auto rounded-xl bg-[#22223a] px-4 py-2.5 text-sm text-[#6e6e82] transition-colors hover:text-white"
              >
                Re-import Saved
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
