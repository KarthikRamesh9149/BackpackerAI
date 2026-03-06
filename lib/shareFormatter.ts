import { CardItem } from './types';

const TYPE_EMOJI: Record<string, string> = {
  eat: '🍜',
  stay: '🛏️',
  transport: '🚌',
  plan: '📋',
  essentials: '💡',
};

const TYPE_LABEL: Record<string, string> = {
  eat: 'EAT',
  stay: 'STAY',
  transport: 'TRANSPORT',
  plan: 'PLAN',
  essentials: 'ESSENTIALS',
};

export function formatCardAsText(card: CardItem): string {
  const emoji = TYPE_EMOJI[card.type] || '📌';
  const bullets = card.bullets.map((b) => `  • ${b}`).join('\n');
  return `${emoji} ${card.title}\n${bullets}\n\nShared via BackpackBuddy AU`;
}

export function formatSavedItemsAsText(
  items: Array<CardItem & { savedId: string }>,
  city?: string | null
): string {
  if (items.length === 0) return 'No saved items yet.';

  const header = `🎒 My BackpackBuddy AU Trip${city ? ` — ${city}` : ''}`;

  // Group by type
  const grouped: Record<string, Array<CardItem>> = {};
  for (const item of items) {
    if (!grouped[item.type]) grouped[item.type] = [];
    grouped[item.type].push(item);
  }

  const sections = Object.entries(grouped)
    .map(([type, cards]) => {
      const emoji = TYPE_EMOJI[type] || '📌';
      const label = TYPE_LABEL[type] || type.toUpperCase();
      const cardTexts = cards
        .map((c) => {
          const bullets = c.bullets.map((b) => `  • ${b}`).join('\n');
          return `${c.title}\n${bullets}`;
        })
        .join('\n\n');
      return `${emoji} ${label}\n━━━━━\n${cardTexts}`;
    })
    .join('\n\n');

  return `${header}\n\n${sections}\n\n—\nShared via BackpackBuddy AU`;
}

export function canNativeShare(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}
