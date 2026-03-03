'use client';

import { CardItem as CardItemType } from '@/lib/types';
import CardItem from './CardItem';

interface CardsPanelProps {
  cards: CardItemType[];
  onSave: (card: CardItemType) => void;
  isItemSaved: (title: string) => boolean;
}

export default function CardsPanel({ cards, onSave, isItemSaved }: CardsPanelProps) {
  if (!cards || cards.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, i) => (
        <CardItem
          key={`${card.title}-${i}`}
          card={card}
          onSave={onSave}
          isSaved={isItemSaved(card.title)}
        />
      ))}
    </div>
  );
}
