export interface PackingItem {
  id: string;
  text: string;
  category: string;
  checked: boolean;
  isCustom?: boolean;
}

export const PACKING_CATEGORIES = [
  'Documents',
  'Clothing',
  'Toiletries',
  'Tech',
  'Australia-Specific',
  'Health & Safety',
  'Accessories',
  'Custom',
];

export const DEFAULT_PACKING_ITEMS: Omit<PackingItem, 'id' | 'checked'>[] = [
  // Documents
  { text: 'Passport (valid 6+ months)', category: 'Documents' },
  { text: 'Visa / ETA confirmation', category: 'Documents' },
  { text: 'Travel insurance documents', category: 'Documents' },
  { text: 'Printed booking confirmations', category: 'Documents' },
  { text: 'Emergency contacts list', category: 'Documents' },
  { text: 'Copies of passport (digital + paper)', category: 'Documents' },

  // Clothing
  { text: 'Lightweight t-shirts (4-5)', category: 'Clothing' },
  { text: 'Quick-dry shorts (2-3)', category: 'Clothing' },
  { text: 'Light hoodie / fleece', category: 'Clothing' },
  { text: 'Rain jacket (packable)', category: 'Clothing' },
  { text: 'Swimsuit', category: 'Clothing' },
  { text: 'Thongs / flip-flops', category: 'Clothing' },
  { text: 'Comfortable walking shoes', category: 'Clothing' },
  { text: 'Underwear & socks (5-7 pairs)', category: 'Clothing' },
  { text: 'Sleepwear', category: 'Clothing' },

  // Toiletries
  { text: 'Toothbrush & toothpaste', category: 'Toiletries' },
  { text: 'Deodorant', category: 'Toiletries' },
  { text: 'Shampoo & conditioner (travel size)', category: 'Toiletries' },
  { text: 'Razor', category: 'Toiletries' },
  { text: 'Prescription medications', category: 'Toiletries' },
  { text: 'Basic first aid (bandaids, paracetamol)', category: 'Toiletries' },

  // Tech
  { text: 'Phone + charger', category: 'Tech' },
  { text: 'Type I power adapter (Australia)', category: 'Tech' },
  { text: 'Portable power bank', category: 'Tech' },
  { text: 'Earphones / headphones', category: 'Tech' },
  { text: 'Camera (optional)', category: 'Tech' },

  // Australia-Specific
  { text: 'Sunscreen SPF 50+ (Australian sun is intense)', category: 'Australia-Specific' },
  { text: 'Wide-brim hat or cap', category: 'Australia-Specific' },
  { text: 'Reef-safe sunscreen (if visiting QLD/GBR)', category: 'Australia-Specific' },
  { text: 'Insect repellent (tropical areas)', category: 'Australia-Specific' },
  { text: 'Reusable water bottle (free refills everywhere)', category: 'Australia-Specific' },
  { text: 'Good quality sunglasses (UV rated)', category: 'Australia-Specific' },
  { text: 'Padlock for hostel lockers', category: 'Australia-Specific' },
  { text: 'Microfiber towel', category: 'Australia-Specific' },
  { text: 'Earplugs + sleep mask (hostel essentials)', category: 'Australia-Specific' },

  // Health & Safety
  { text: 'After-sun / aloe vera gel', category: 'Health & Safety' },
  { text: 'Antihistamines (for bites/stings)', category: 'Health & Safety' },
  { text: 'Hand sanitizer', category: 'Health & Safety' },
  { text: 'Motion sickness tablets (for boats/buses)', category: 'Health & Safety' },

  // Accessories
  { text: 'Day pack / small backpack', category: 'Accessories' },
  { text: 'Dry bag (for beach/water activities)', category: 'Accessories' },
  { text: 'Travel laundry bag', category: 'Accessories' },
  { text: 'Zip-lock bags (for organization)', category: 'Accessories' },
];
