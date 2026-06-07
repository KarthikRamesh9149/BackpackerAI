# 🎒 BackpackBuddy AU

**A voice-first AI travel companion built exclusively for backpackers exploring Australia.**

Ask anything out loud. Get instant, localised recommendations — hostels, eats, activities, transport — all tailored to your city, budget, and the weather right now.

![Built with Next.js 16](https://img.shields.io/badge/Built%20with-Next.js%2016-black?style=flat-square&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06b6d4?style=flat-square&logo=tailwindcss) ![Groq](https://img.shields.io/badge/LLM-Groq%20Llama%203.3-orange?style=flat-square)

---

## What It Does

BackpackBuddy AU is a real-time, voice-activated travel assistant. You speak — it listens, thinks, and speaks back. Every response is grounded in your actual location, current weather, and remaining daily budget.

### Core Experience
- **Voice in, voice out** — tap mic, ask your question, hear the answer read aloud
- **Smart cards** — recommendations appear as tappable cards (save, share, pin on map)
- **Context-aware** — every reply factors in your city, live weather, and budget remaining

---

## Features

### 1. SOS Emergency Panel
Tap the red **SOS** button anytime for instant safety info — works offline.
- One-tap call to **000** (Emergency), **131 444** (Police), **1800 022 222** (Nurse on Call)
- Embassy contacts for **20+ nationalities**
- City-specific scam warnings and tourist trap alerts
- Australian wildlife safety tips
- Nearest hospital via Google Maps
- **100% offline** — all data bundled, no API needed

### 2. Live Weather + 7-Day Forecast
- Real-time weather via **OpenWeatherMap** (temp, feels like, humidity, wind, visibility)
- Full **7-day forecast** with rain probability and daily high/low
- Apple Weather-style panel with rain probability bar chart
- City search inside the weather panel
- **Seasonal fallback** — accurate monthly estimates for 10 AU cities when key is not set

### 3. Daily Budget Tracker
- Set a daily budget ($50 / $80 / $100 / $150 presets or custom)
- Log expenses by category (Food, Transport, Activities, Accommodation, Other)
- Progress bar: green → amber → red as you approach the limit
- **AI-integrated** — assistant automatically suggests affordable options when budget is tight
- Auto-resets at midnight; persists across page reloads via localStorage

### 4. Interactive Map View
- All AI-recommended places geocoded and plotted as **colored pins** by category
- **Default popular-place pins** for 9 major cities shown before any chat
- Tap any pin to see place details and a save button
- "View on Map" link appears in chat after location-based queries
- Map always stays mounted in the background — no tile reload on tab switch

### 5. GPS Near Me
- Tap the **compass button** to detect your current location
- Reverse-geocoded to suburb level via **Nominatim** (OpenStreetMap, free, no key needed)
- Auto-submits "What's near me? I'm at [suburb]" to the AI
- Walking-distance recommendations with estimated times

### 6. Smart Itinerary Builder
- Organise saved cards into a **day-by-day trip plan**
- Set trip duration (1–14 days)
- Move cards up/down to reorder within each day
- **Export** your full itinerary as formatted text to share
- Import all saved cards in one tap

### 7. Aussie Slang & Culture Guide
- **67 slang terms** with meaning and example sentence
- Categories: Greetings, Food & Drink, Places, General Slang, Culture Tips
- Real-time search filter — type "arvo" → instantly see "Afternoon"
- Culture section: tipping norms, driving side, thongs, shouting rounds, etc.
- Fully offline — all data bundled

### 8. Currency Quick-Convert
- Set your **home currency** once (30+ currencies, saved in localStorage)
- Type any AUD amount — see instant conversion
- Quick-glance view: USD, EUR, GBP, JPY, INR all at once
- Live exchange rates via **ExchangeRate-API**, cached 6 hours server-side

### 9. Shareable Trip Cards
- Every recommendation card has a **Share** button
- Uses `navigator.share()` (native mobile share sheet) with clipboard fallback
- **Share All** button in the Saved drawer — exports your entire saved list as formatted text

### 10. Smart Packing Checklist
- **44 Australia-specific default items** (Type I power adapter, SPF50+ sunscreen, reef-safe sunscreen for QLD, thongs, insect repellent, etc.)
- Categorised: Documents, Clothing, Toiletries, Tech, Australia-Specific
- Check off items as you pack; progress bar shows "12/25 packed"
- Add custom items; persists across sessions via localStorage

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| LLM | Groq Cloud — Llama 3.3 70B Versatile (SSE streaming) |
| Voice Input | Web Speech API (SpeechRecognition) |
| Voice Output | Web Speech API (SpeechSynthesis) |
| Map | react-leaflet + Leaflet + OpenStreetMap tiles |
| Weather | OpenWeatherMap API |
| Geocoding | Nominatim (OpenStreetMap — free, no key) |
| Exchange Rates | ExchangeRate-API (free tier) |
| Persistence | localStorage (no database) |

**Zero database. Zero auth. Zero backend infrastructure** — just three Next.js API routes acting as secure server-side proxies.

---

## Project Structure

```
backpacker/
├── app/
│   ├── api/
│   │   ├── turn/route.ts        # LLM streaming proxy (Groq)
│   │   ├── weather/route.ts     # Weather proxy + 7-day forecast builder
│   │   └── currency/route.ts   # Exchange rate proxy (6hr server cache)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # Main app — all state + layout
│
├── components/
│   ├── Header.tsx               # Nav bar with all action buttons
│   ├── ChatPanel.tsx            # Message thread + card renderer
│   ├── InputBar.tsx             # Mic + text input + NearMe button
│   ├── CardItem.tsx             # Recommendation card component
│   ├── CityModal.tsx            # City picker (onboarding + city change)
│   ├── WeatherChip.tsx          # Compact weather display in header
│   ├── WeatherPanel.tsx         # Apple Weather-style 7-day forecast panel
│   ├── MapView.tsx              # Leaflet map with geocoded + default pins
│   ├── MapViewWrapper.tsx       # Dynamic import wrapper (SSR disabled)
│   ├── SOSPanel.tsx             # Emergency contacts panel
│   ├── BudgetTracker.tsx        # Daily budget UI
│   ├── SlangGuide.tsx           # Aussie slang dictionary
│   ├── CurrencyConverter.tsx    # AUD converter widget
│   ├── PackingList.tsx          # Packing checklist UI
│   ├── ItineraryBuilder.tsx     # Day-by-day trip planner
│   ├── SavedDrawer.tsx          # Saved cards side drawer
│   └── ShareButton.tsx          # Share card component
│
├── hooks/
│   ├── useSpeechRecognition.ts  # Web Speech API wrapper
│   ├── useSpeechSynthesis.ts    # TTS wrapper
│   ├── useSavedItems.ts         # localStorage saved cards
│   ├── useWeather.ts            # Weather fetch + client cache
│   ├── useBudget.ts             # Budget state + auto-reset
│   ├── useGeolocation.ts        # GPS + Nominatim reverse geocode
│   ├── useGeocoder.ts           # Place-name geocoding for map pins
│   ├── useCurrency.ts           # Exchange rate fetch + conversion
│   ├── usePackingList.ts        # Packing checklist state
│   └── useItinerary.ts          # Itinerary day-assignment state
│
└── lib/
    ├── systemPrompt.ts          # AI prompt builder (injects all context)
    ├── types.ts                 # Shared TypeScript interfaces
    ├── emergencyData.ts         # SOS static data (embassies, scams, wildlife)
    ├── slangData.ts             # 67 slang terms + culture tips
    ├── packingDefaults.ts       # 44 default packing items
    ├── mapUtils.ts              # Markers, default pins, place-name extractor
    ├── shareFormatter.ts        # Card-to-text formatter for sharing
    └── weatherIcons.ts          # OWM icon code → emoji + weather advice text
```

---

## Getting Started

### Prerequisites
- Node.js 20.9+ (Node 20.19 is pinned in `.nvmrc`)
- A free [Groq Cloud](https://console.groq.com) API key (required)
- *(Optional)* [OpenWeatherMap](https://openweathermap.org/api) API key — free tier; seasonal fallback works without it
- *(Optional)* [ExchangeRate-API](https://www.exchangerate-api.com) key — free tier; app works without it

### Installation

```bash
git clone https://github.com/KarthikRamesh9149/BackpackerAI.git
cd BackpackerAI
npm install
```

### Environment Variables

Create `.env.local` at the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
OPENWEATHERMAP_API_KEY=your_owm_key_here
EXCHANGE_RATE_API_KEY=your_exchange_rate_key_here
```

> Only `GROQ_API_KEY` is required. The app falls back to seasonal weather estimates and cached rates without the other keys.

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — allow microphone access when prompted.

### Build for Production

```bash
npm run build
npm start
```

### Quality Checks

```bash
npm run lint
npm run typecheck
npm run build
```

`npm run check` runs all three commands in the same order used by CI.

---

## How It Works

### Voice Flow
1. User taps the mic → `SpeechRecognition` starts capturing audio
2. Live transcript shown as the user speaks
3. On silence / tap stop → transcript sent to `/api/turn`
4. Groq streams back a structured JSON response (text + recommendation cards)
5. `SpeechSynthesis` reads the assistant text aloud
6. Cards appear in the chat thread below the response

### AI Context Injection
Every LLM request includes all available context:

```
City:    "You are helping a backpacker currently in Melbourne."
Weather: "Currently 18°C and overcast. Suggest warm indoor spots or covered venues."
Budget:  "Daily budget $80. Spent $55. Remaining $25. Prioritise free or cheap options."
GPS:     "User is at Fitzroy, Melbourne (-37.79, 144.98). Recommend walking-distance places."
History: Full conversation history for coherent multi-turn dialogue.
```

### Map Architecture
The map and chat panels are **both always mounted** in the DOM using absolute CSS stacking (`z-index` + `opacity` + `pointer-events: none`). This prevents Leaflet's tile-loading failure that occurs when a container is initialised inside `display: none`. The user sees an instant tab switch; Leaflet never knows the map was "hidden".

### API Routes (Server-Side Proxies)
All external API keys stay server-side. Three thin proxy routes:
- `/api/turn` — streams Groq LLM responses as SSE
- `/api/weather` — fetches OWM current + 5-day forecast, builds 7-day summary, caches 30 min
- `/api/currency` — fetches exchange rates, caches 6 hours

---

## Deployment

### Vercel (Recommended)

```bash
npx vercel
```

Add your three environment variables in **Vercel Dashboard → Settings → Environment Variables**.

The app deploys as a standard Next.js serverless application. No additional configuration required.

---

## Browser Compatibility

| Feature | Chrome | Edge | Safari (iOS) | Firefox |
|---|---|---|---|---|
| Voice Input | ✅ | ✅ | ✅ | ❌ |
| Voice Output | ✅ | ✅ | ✅ | ✅ |
| GPS / Near Me | ✅ | ✅ | ✅ | ✅ |
| Map | ✅ | ✅ | ✅ | ✅ |
| Share Sheet | ✅ Mobile | ✅ Mobile | ✅ | ❌ (clipboard fallback) |

> Voice input (SpeechRecognition) is not supported in Firefox. All other features work across modern browsers.

---

## Known Limitations

- **Estimates only** — all costs, travel times, and schedules are approximate. Always verify with official sources (Opal, myki, go card for transit; venue websites for hours/prices).
- **No real-time transit data** — the assistant uses general knowledge, not live GTFS feeds.
- **In-memory LLM session** — conversation history lives in the server process; server restarts clear it. Client-side chat history persists in component state for the browser session.

---

## License

MIT — do whatever you like with it.

---

*Made for the backpackers who ask "what's near me?" before opening Google Maps.*
