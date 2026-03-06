// === Emergency Numbers ===
export const EMERGENCY_NUMBERS = [
  { label: 'Emergency (Police/Fire/Ambulance)', number: '000', description: 'For life-threatening emergencies' },
  { label: 'Police (Non-Emergency)', number: '131 444', description: 'For non-urgent police matters' },
  { label: 'Lifeline Crisis Support', number: '13 11 14', description: '24/7 crisis support & suicide prevention' },
  { label: 'Sexual Assault Helpline', number: '1800 737 732', description: '24/7 free, confidential support' },
  { label: 'Poisons Information', number: '13 11 26', description: 'For poisoning and bite emergencies' },
  { label: 'SES (Storm/Flood)', number: '132 500', description: 'State Emergency Service' },
];

// === Embassy Data ===
export const EMBASSY_DATA: Record<string, { name: string; city: string; phone: string; emergency: string }> = {
  'United States': { name: 'U.S. Embassy Canberra', city: 'Canberra', phone: '(02) 6214 5600', emergency: '(02) 6214 5600' },
  'United Kingdom': { name: 'British High Commission', city: 'Canberra', phone: '(02) 6270 6666', emergency: '(02) 6270 6666' },
  'Canada': { name: 'Canadian High Commission', city: 'Canberra', phone: '(02) 6270 4000', emergency: '(02) 6270 4000' },
  'Germany': { name: 'German Embassy', city: 'Canberra', phone: '(02) 6270 1911', emergency: '(02) 6270 1911' },
  'France': { name: 'French Embassy', city: 'Canberra', phone: '(02) 6216 0100', emergency: '(02) 6216 0100' },
  'India': { name: 'Indian High Commission', city: 'Canberra', phone: '(02) 6273 3999', emergency: '(02) 6273 3774' },
  'China': { name: 'Chinese Embassy', city: 'Canberra', phone: '(02) 6228 3999', emergency: '(02) 6228 3999' },
  'Japan': { name: 'Japanese Embassy', city: 'Canberra', phone: '(02) 6273 3244', emergency: '(02) 6273 3244' },
  'South Korea': { name: 'Korean Embassy', city: 'Canberra', phone: '(02) 6270 4100', emergency: '(02) 6270 4100' },
  'Ireland': { name: 'Irish Embassy', city: 'Canberra', phone: '(02) 6214 0000', emergency: '(02) 6214 0000' },
  'New Zealand': { name: 'NZ High Commission', city: 'Canberra', phone: '(02) 6270 4211', emergency: '(02) 6270 4211' },
  'Netherlands': { name: 'Dutch Embassy', city: 'Canberra', phone: '(02) 6220 9400', emergency: '+31 247 247 247' },
  'Italy': { name: 'Italian Embassy', city: 'Canberra', phone: '(02) 6273 3333', emergency: '(02) 6273 3333' },
  'Brazil': { name: 'Brazilian Embassy', city: 'Canberra', phone: '(02) 6273 2372', emergency: '(02) 6273 2372' },
  'Thailand': { name: 'Thai Embassy', city: 'Canberra', phone: '(02) 6206 0100', emergency: '(02) 6206 0100' },
  'Malaysia': { name: 'Malaysian High Commission', city: 'Canberra', phone: '(02) 6120 0300', emergency: '(02) 6120 0300' },
  'Singapore': { name: 'Singapore High Commission', city: 'Canberra', phone: '(02) 6271 2000', emergency: '(02) 6271 2000' },
  'Sweden': { name: 'Swedish Embassy', city: 'Canberra', phone: '(02) 6270 2700', emergency: '+46 8 405 5005' },
  'South Africa': { name: 'SA High Commission', city: 'Canberra', phone: '(02) 6272 7300', emergency: '(02) 6272 7300' },
  'Israel': { name: 'Israeli Embassy', city: 'Canberra', phone: '(02) 6215 4500', emergency: '(02) 6215 4500' },
  'Philippines': { name: 'Philippine Embassy', city: 'Canberra', phone: '(02) 6273 2535', emergency: '(02) 6273 2535' },
  'Indonesia': { name: 'Indonesian Embassy', city: 'Canberra', phone: '(02) 6250 8600', emergency: '(02) 6250 8600' },
  'Vietnam': { name: 'Vietnamese Embassy', city: 'Canberra', phone: '(02) 6286 6059', emergency: '(02) 6286 6059' },
};

// === City-Specific Scam Warnings ===
export const CITY_SCAMS: Record<string, string[]> = {
  Sydney: [
    'Overpriced "free walking tours" at Circular Quay — tip expected can be $30+',
    'Fake charity collectors around Town Hall and Pitt Street Mall',
    'Unlicensed taxis at the airport — always use the official taxi rank or rideshare',
    'Street shell games near Darling Harbour — you will lose money',
  ],
  Melbourne: [
    'Fake charity collectors on Bourke Street Mall — they are persistent',
    'Overpriced "comedy show" ticket sellers on Swanston Street',
    'Unlicensed rideshares near clubs at night — use the app only',
    'Pickpockets on crowded trams, especially Route 86 and 96',
  ],
  Brisbane: [
    'Unlicensed tour operators at South Bank — book through official sites',
    'Fake rental listings on Facebook Marketplace — never pay before viewing',
    'Overpriced parking near Fortitude Valley clubs — use public transport',
  ],
  Perth: [
    'Overpriced tour packages at Rottnest Island ferry terminal — book online ahead',
    'Fake apartment listings near Northbridge — verify before paying',
    'Unlicensed taxis at Perth Airport — use the official rank',
  ],
  Adelaide: [
    'Overpriced wine tour operators in the Barossa — compare prices first',
    'Fake backpacker job ads asking for upfront fees — legitimate jobs never charge',
  ],
  'Gold Coast': [
    'Timeshare presentations disguised as "free attractions" in Surfers Paradise',
    'Overpriced nightclub entry + drink packages — compare before committing',
    'Fake meter maids — real ones wear gold bikinis and work for the council',
  ],
};

// === Wildlife Safety ===
export const WILDLIFE_SAFETY = [
  {
    animal: 'Box Jellyfish',
    icon: '🪼',
    danger: 'Potentially fatal sting',
    action: 'Pour vinegar on sting. Call 000 immediately. Do NOT rub or use fresh water.',
    region: 'Northern QLD, NT (Oct–May)',
  },
  {
    animal: 'Blue-Ringed Octopus',
    icon: '🐙',
    danger: 'Deadly venom — no antivenom exists',
    action: 'Do NOT touch! If stung, apply pressure bandage, call 000, start CPR if needed.',
    region: 'All Australian coasts',
  },
  {
    animal: 'Snakes',
    icon: '🐍',
    danger: 'Many species are venomous',
    action: 'Stay still, do NOT try to catch it. Apply pressure immobilisation bandage. Call 000.',
    region: 'All of Australia — watch where you step',
  },
  {
    animal: 'Spiders',
    icon: '🕷️',
    danger: 'Funnel-web (Sydney) and Redback (everywhere)',
    action: 'Funnel-web: pressure bandage + 000. Redback: ice pack + seek medical help.',
    region: 'All of Australia',
  },
  {
    animal: 'Crocodiles',
    icon: '🐊',
    danger: 'Saltwater crocs are aggressive and lethal',
    action: 'NEVER swim in unmarked waterways. Obey all warning signs. Stay 5m from water edges.',
    region: 'Northern QLD, NT, northern WA',
  },
  {
    animal: 'Sharks',
    icon: '🦈',
    danger: 'Rare but serious attacks',
    action: 'Always swim between the red and yellow flags. Avoid dusk/dawn. Exit if you see baitfish.',
    region: 'All Australian beaches',
  },
  {
    animal: 'Kangaroos',
    icon: '🦘',
    danger: 'Can kick hard — especially large males',
    action: 'Do NOT approach or feed wild kangaroos. Back away slowly if one approaches you.',
    region: 'All of Australia',
  },
  {
    animal: 'Sun / UV Radiation',
    icon: '☀️',
    danger: 'Australia has the highest UV levels in the world',
    action: 'Wear SPF 50+ sunscreen (reapply every 2 hours), hat, and sunglasses. Seek shade 10am–2pm.',
    region: 'All of Australia, year-round',
  },
];
