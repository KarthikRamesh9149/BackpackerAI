export interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'eat' | 'stay' | 'transport' | 'plan' | 'essentials';
  detail?: string;
  isDefault?: boolean;
}

export const CITY_CENTERS: Record<string, [number, number]> = {
  Sydney: [-33.8688, 151.2093],
  Melbourne: [-37.8136, 144.9631],
  Brisbane: [-27.4705, 153.0260],
  Perth: [-31.9505, 115.8605],
  Adelaide: [-34.9285, 138.6007],
  'Gold Coast': [-28.0167, 153.4000],
  Cairns: [-16.9186, 145.7781],
  Darwin: [-12.4634, 130.8456],
  Hobart: [-42.8821, 147.3272],
  Canberra: [-35.2809, 149.1300],
  Byron: [-28.6474, 153.6020],
  'Byron Bay': [-28.6474, 153.6020],
  Alice: [-23.6980, 133.8807],
  'Alice Springs': [-23.6980, 133.8807],
};

export const MARKER_COLORS: Record<string, string> = {
  eat: '#f59e0b',        // amber
  stay: '#8b5cf6',       // purple
  transport: '#3b82f6',  // blue
  plan: '#10b981',       // emerald
  essentials: '#ef4444', // red
};

// Default popular pins per city — shown when no chat markers exist
const DEFAULT_PINS: Record<string, MapMarker[]> = {
  Sydney: [
    { id: 'd-syd-1', name: 'Sydney Opera House', lat: -33.8568, lng: 151.2153, type: 'plan', detail: 'Iconic landmark — free to walk around outside. Tours from $40.', isDefault: true },
    { id: 'd-syd-2', name: 'Bondi Beach', lat: -33.8914, lng: 151.2767, type: 'plan', detail: 'Sydney\'s most famous beach. Free entry. Catch Bus 380 from Circular Quay.', isDefault: true },
    { id: 'd-syd-3', name: 'Sydney Central YHA', lat: -33.8797, lng: 151.2022, type: 'stay', detail: 'Best backpacker hostel in Sydney CBD. Dorms from ~$40/night.', isDefault: true },
    { id: 'd-syd-4', name: 'Chinatown Sydney', lat: -33.8787, lng: 151.2023, type: 'eat', detail: 'Cheapest eats in the city. Noodles from $10, bubble tea, BBQ pork.', isDefault: true },
    { id: 'd-syd-5', name: 'The Rocks Markets', lat: -33.8599, lng: 151.2090, type: 'eat', detail: 'Weekend market with street food, local produce, and artisan goods.', isDefault: true },
    { id: 'd-syd-6', name: 'Circular Quay Station', lat: -33.8613, lng: 151.2108, type: 'transport', detail: 'Main transport hub — trains, buses, and ferries. Get an Opal card here.', isDefault: true },
    { id: 'd-syd-7', name: 'Surry Hills', lat: -33.8855, lng: 151.2135, type: 'eat', detail: 'Best cafés and brunch spots. Single O, Reuben Hills, Bourke Street Bakery.', isDefault: true },
    { id: 'd-syd-8', name: 'Sydney Harbour Bridge', lat: -33.8523, lng: 151.2108, type: 'plan', detail: 'Walk across for free! Bridge climb costs $174+. Great views from Milsons Point.', isDefault: true },
  ],
  Melbourne: [
    { id: 'd-mel-1', name: 'Queen Victoria Market', lat: -37.8066, lng: 144.9570, type: 'eat', detail: 'Iconic market with cheap fresh food, deli goods, and street food. Open Tue–Sun.', isDefault: true },
    { id: 'd-mel-2', name: 'Federation Square', lat: -37.8180, lng: 144.9690, type: 'plan', detail: 'Free cultural hub. Home to ACMI, NGV, and countless events.', isDefault: true },
    { id: 'd-mel-3', name: 'Lygon Street', lat: -37.8028, lng: 144.9665, type: 'eat', detail: 'Melbourne\'s Little Italy. Cheap pasta, pizza, and great coffee. ~$15 mains.', isDefault: true },
    { id: 'd-mel-4', name: 'Hostel Melbourne Central', lat: -37.8104, lng: 144.9570, type: 'stay', detail: 'Budget hostel near Flagstaff Gardens. Dorms from ~$35/night.', isDefault: true },
    { id: 'd-mel-5', name: 'Flinders Street Station', lat: -37.8183, lng: 144.9671, type: 'transport', detail: 'Melbourne\'s main train station. Get a Myki card here. Trams in CBD are free.', isDefault: true },
    { id: 'd-mel-6', name: 'St Kilda Beach', lat: -37.8678, lng: 144.9756, type: 'plan', detail: 'Famous beachside suburb. Luna Park, Sunday markets, and cheap eats on Acland St.', isDefault: true },
    { id: 'd-mel-7', name: 'Fitzroy', lat: -37.7993, lng: 144.9772, type: 'eat', detail: 'Hipster cafés, street art, and cheap Vietnamese on Victoria Street. Very backpacker-friendly.', isDefault: true },
    { id: 'd-mel-8', name: 'Brighton Beach Boxes', lat: -37.9145, lng: 145.0058, type: 'plan', detail: 'Famous colourful bathing boxes. Free to photograph. 30 min train from CBD.', isDefault: true },
  ],
  Brisbane: [
    { id: 'd-bri-1', name: 'South Bank Parklands', lat: -27.4778, lng: 153.0219, type: 'plan', detail: 'Free outdoor pool, beach, and gardens right in the city. Open daily.', isDefault: true },
    { id: 'd-bri-2', name: 'South Bank Markets', lat: -27.4788, lng: 153.0220, type: 'eat', detail: 'Friday–Sunday night markets with food stalls. Budget-friendly.', isDefault: true },
    { id: 'd-bri-3', name: 'Story Bridge', lat: -27.4644, lng: 153.0333, type: 'plan', detail: 'Brisbane\'s most iconic bridge. Scenic walk on the boardwalk is free.', isDefault: true },
    { id: 'd-bri-4', name: 'Fortitude Valley', lat: -27.4574, lng: 153.0354, type: 'eat', detail: 'Nightlife and food hub. Cheap Asian eats, bars, and cafés.', isDefault: true },
    { id: 'd-bri-5', name: 'Roma Street Parkland', lat: -27.4637, lng: 153.0148, type: 'plan', detail: 'Huge free gardens in the CBD. Great for picnics.', isDefault: true },
    { id: 'd-bri-6', name: 'Brisbane Central Station', lat: -27.4657, lng: 153.0267, type: 'transport', detail: 'Main train hub. Go Cards available at vending machines.', isDefault: true },
  ],
  Perth: [
    { id: 'd-per-1', name: 'Cottesloe Beach', lat: -31.9971, lng: 115.7528, type: 'plan', detail: 'Perth\'s best swimming beach. Calm, clear water. Free entry.', isDefault: true },
    { id: 'd-per-2', name: 'Fremantle Markets', lat: -32.0563, lng: 115.7478, type: 'eat', detail: 'Historic market with cheap street food, local produce, and crafts. Fri–Sun.', isDefault: true },
    { id: 'd-per-3', name: 'Kings Park', lat: -31.9601, lng: 115.8322, type: 'plan', detail: 'One of the world\'s largest inner-city parks. Stunning Swan River views. Free.', isDefault: true },
    { id: 'd-per-4', name: 'Northbridge', lat: -31.9474, lng: 115.8565, type: 'eat', detail: 'Best cheap eats and nightlife. Ramen, Thai, kebabs — all under $15.', isDefault: true },
    { id: 'd-per-5', name: 'Perth City Station', lat: -31.9516, lng: 115.8607, type: 'transport', detail: 'Free CAT buses cover the city. Transperth SmartRider cards here.', isDefault: true },
  ],
  'Gold Coast': [
    { id: 'd-gc-1', name: 'Surfers Paradise Beach', lat: -28.0027, lng: 153.4315, type: 'plan', detail: 'The Gold Coast\'s main beach strip. Free entry, iconic skyline backdrop.', isDefault: true },
    { id: 'd-gc-2', name: 'Cavill Avenue', lat: -28.0023, lng: 153.4305, type: 'eat', detail: 'Main strip with cheap eats, fast food, and cafés. $10 kebabs to $20 mains.', isDefault: true },
    { id: 'd-gc-3', name: 'Burleigh Heads', lat: -28.0867, lng: 153.4480, type: 'plan', detail: 'Best surf break and national park. Quieter than Surfers Paradise.', isDefault: true },
    { id: 'd-gc-4', name: 'Surfers Paradise Backpackers', lat: -28.0011, lng: 153.4289, type: 'stay', detail: 'Central hostel with pool, bar, and social atmosphere. From ~$35/night.', isDefault: true },
  ],
  Cairns: [
    { id: 'd-cai-1', name: 'Cairns Esplanade', lat: -16.9182, lng: 145.7761, type: 'plan', detail: 'Free lagoon pool, boardwalk, and markets. The heart of tourist Cairns.', isDefault: true },
    { id: 'd-cai-2', name: 'Rusty\'s Markets', lat: -16.9226, lng: 145.7762, type: 'eat', detail: 'Best fresh fruit market in the tropics. Fri–Sun, very cheap tropical fruits.', isDefault: true },
    { id: 'd-cai-3', name: 'Great Barrier Reef Tours Pier', lat: -16.9149, lng: 145.7760, type: 'transport', detail: 'Departure point for all reef tours. Compare operators on the esplanade.', isDefault: true },
    { id: 'd-cai-4', name: 'Cairns Central Backpackers', lat: -16.9236, lng: 145.7741, type: 'stay', detail: 'Budget hostel near the train station. Dorms from ~$28/night.', isDefault: true },
  ],
  Hobart: [
    { id: 'd-hob-1', name: 'Salamanca Market', lat: -42.8842, lng: 147.3310, type: 'eat', detail: 'Famous Saturday market. Local food, crafts, street performers. Free entry.', isDefault: true },
    { id: 'd-hob-2', name: 'MONA', lat: -42.8491, lng: 147.2946, type: 'plan', detail: 'World-class controversial art museum. Ferry from Brooke Street Pier. ~$35 entry.', isDefault: true },
    { id: 'd-hob-3', name: 'Mount Wellington Summit', lat: -42.8996, lng: 147.2350, type: 'plan', detail: 'Epic panoramic views over Hobart. Drive or take a tour. Free to visit.', isDefault: true },
    { id: 'd-hob-4', name: 'Battery Point', lat: -42.8866, lng: 147.3330, type: 'eat', detail: 'Historic suburb with cute cafés and restaurants. Perfect for a morning walk.', isDefault: true },
  ],
  Adelaide: [
    { id: 'd-ade-1', name: 'Adelaide Central Market', lat: -34.9314, lng: 138.6024, type: 'eat', detail: 'Best food market in Australia. Cheap produce, cheese, bakeries, and delis.', isDefault: true },
    { id: 'd-ade-2', name: 'Glenelg Beach', lat: -34.9806, lng: 138.5169, type: 'plan', detail: 'Best beach near Adelaide. Catch the tram from city centre — only 30 min.', isDefault: true },
    { id: 'd-ade-3', name: 'Rundle Street', lat: -34.9231, lng: 138.6069, type: 'eat', detail: 'Outdoor dining strip. Loads of options from $12 lunch deals to fine dining.', isDefault: true },
    { id: 'd-ade-4', name: 'Adelaide Railway Station', lat: -34.9226, lng: 138.5994, type: 'transport', detail: 'Adelaide Metro hub. Metrocard available. Free tram in city centre.', isDefault: true },
  ],
  Darwin: [
    { id: 'd-dar-1', name: 'Mindil Beach Sunset Market', lat: -12.4510, lng: 130.8378, type: 'eat', detail: 'Famous Thursday/Sunday evening markets with incredible Asian street food. ~$10–15 a meal.', isDefault: true },
    { id: 'd-dar-2', name: 'Kakadu Day Tours Depart', lat: -12.4634, lng: 130.8456, type: 'transport', detail: 'Tours to Kakadu depart from Darwin CBD. Book ahead — very popular.', isDefault: true },
    { id: 'd-dar-3', name: 'Darwin Waterfront', lat: -12.4706, lng: 130.8434, type: 'plan', detail: 'Wave pool and recreation lagoon. Free to enter the precinct.', isDefault: true },
  ],
  Canberra: [
    { id: 'd-can-1', name: 'Australian War Memorial', lat: -35.2803, lng: 149.1510, type: 'plan', detail: 'World-class museum. Free entry. Emotional and very well curated.', isDefault: true },
    { id: 'd-can-2', name: 'National Museum of Australia', lat: -35.2933, lng: 149.1178, type: 'plan', detail: 'Free entry. Great for understanding Australian history and culture.', isDefault: true },
    { id: 'd-can-3', name: 'Civic (City Centre)', lat: -35.2797, lng: 149.1310, type: 'eat', detail: 'Canberra\'s main dining and nightlife precinct. Burgers, Asian, and cafés from ~$15.', isDefault: true },
  ],
};

export function getDefaultPins(city: string | null): MapMarker[] {
  if (!city) return DEFAULT_PINS.Sydney;
  const lower = city.toLowerCase().trim();
  for (const [key, pins] of Object.entries(DEFAULT_PINS)) {
    if (lower === key.toLowerCase() || lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return pins;
    }
  }
  // Fallback to Sydney
  return DEFAULT_PINS.Sydney;
}

export function extractPlaceName(bullet: string): string | null {
  // Try to extract a place name from a bullet (text before a dash or em-dash)
  const dashMatch = bullet.match(/^([^—–\-]+?)[\s]*[—–\-]/);
  if (dashMatch) {
    const name = dashMatch[1].trim();
    if (name.length > 2 && name.length < 80) return name;
  }
  return null;
}

export function getCityCenter(city: string | null): [number, number] {
  if (!city) return CITY_CENTERS.Sydney;
  if (CITY_CENTERS[city]) return CITY_CENTERS[city];
  const lower = city.toLowerCase();
  for (const [key, coords] of Object.entries(CITY_CENTERS)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return coords;
    }
  }
  return CITY_CENTERS.Sydney;
}
