'use client';

import { useState } from 'react';
import { CardItem as CardItemType } from '@/lib/types';
import ShareButton from './ShareButton';
import { formatCardAsText } from '@/lib/shareFormatter';

interface CardItemProps {
  card: CardItemType;
  onSave: (card: CardItemType) => void;
  isSaved: boolean;
}

const typeConfig: Record<
  CardItemType['type'],
  { color: string; bgBorder: string; icon: string }
> = {
  eat: {
    color: 'text-orange-400',
    bgBorder: 'bg-[#1e1612] border-orange-500/25',
    icon: '🍜',
  },
  stay: {
    color: 'text-blue-400',
    bgBorder: 'bg-[#121620] border-blue-500/25',
    icon: '🛏️',
  },
  transport: {
    color: 'text-emerald-400',
    bgBorder: 'bg-[#121a16] border-emerald-500/25',
    icon: '🚌',
  },
  plan: {
    color: 'text-purple-400',
    bgBorder: 'bg-[#181220] border-purple-500/25',
    icon: '📋',
  },
  essentials: {
    color: 'text-amber-400',
    bgBorder: 'bg-[#1e1a10] border-amber-500/25',
    icon: '💡',
  },
};

export default function CardItem({ card, onSave, isSaved }: CardItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const config = typeConfig[card.type];

  return (
    <div className={`rounded-xl border ${config.bgBorder} card-fade-in overflow-hidden`}>
      {/* Header — always visible, tap to expand/collapse */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left active:opacity-70"
      >
        <span className="text-lg flex-shrink-0">{config.icon}</span>
        <div className="flex-1 min-w-0">
          <div className={`text-[10px] font-semibold uppercase tracking-wider ${config.color}`}>
            {card.type}
          </div>
          <h3 className="text-sm font-medium text-[#ececf1] leading-tight">{card.title}</h3>
        </div>
        {/* Chevron rotates when open */}
        <svg
          className={`h-4 w-4 flex-shrink-0 text-[#5a5a72] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable body */}
      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-white/5">
          {card.bullets.length === 0 ? (
            <p className="text-[13px] text-[#5a5a72] italic py-2">No details available</p>
          ) : (
          <ul className="space-y-2 mb-3">
            {card.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-[#c8c8d8] leading-relaxed">
                <span className={`mt-[6px] h-1.5 w-1.5 flex-shrink-0 rounded-full opacity-70 ${config.color.replace('text-', 'bg-')}`} />
                {bullet}
              </li>
            ))}
          </ul>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSave(card)}
              disabled={isSaved}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] transition-all ${
                isSaved
                  ? 'bg-amber-500/15 text-amber-400 cursor-default'
                  : 'bg-[#2a2a3a] text-[#8e8ea0] hover:bg-[#32324a] hover:text-white'
              }`}
            >
              <svg
                className="h-3 w-3"
                fill={isSaved ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {isSaved ? 'Saved' : 'Save'}
            </button>
            <ShareButton content={formatCardAsText(card)} variant="full" />
          </div>
        </div>
      )}
    </div>
  );
}
