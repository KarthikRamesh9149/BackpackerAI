export const dynamic = 'force-dynamic';

interface DayForecast {
  date: string;
  dateNum: string;
  icon: string;
  description: string;
  high: number;
  low: number;
  rainChance: number;
  humidity: number;
  windSpeed: number;
}

interface WeatherResponse {
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  visibility?: number;
  forecast?: DayForecast[];
  seasonal?: boolean;
}

interface CachedWeather {
  data: WeatherResponse;
  fetchedAt: number;
}

const cache = new Map<string, CachedWeather>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Seasonal averages for major Australian cities (Southern Hemisphere seasons)
// Months: 0=Jan, 1=Feb, ... 11=Dec
const CITY_SEASONAL: Record<string, {
  temps: number[];
  icons: string[];
  descs: string[];
  humidity: number;
  rainChance: number[];
  windSpeed: number;
}> = {
  sydney: {
    temps: [26, 26, 24, 21, 18, 15, 14, 15, 18, 21, 23, 25],
    icons: ['02d', '02d', '02d', '02d', '03d', '03d', '01d', '01d', '02d', '02d', '02d', '02d'],
    descs: ['partly cloudy', 'partly cloudy', 'partly cloudy', 'partly cloudy', 'cloudy', 'cool and cloudy', 'clear sky', 'clear sky', 'partly cloudy', 'partly cloudy', 'partly cloudy', 'partly cloudy'],
    humidity: 65,
    rainChance: [30, 30, 35, 30, 35, 40, 25, 25, 30, 35, 35, 30],
    windSpeed: 3.5,
  },
  melbourne: {
    temps: [26, 26, 23, 19, 15, 12, 11, 12, 15, 18, 21, 24],
    icons: ['02d', '02d', '02d', '03d', '10d', '10d', '10d', '10d', '03d', '03d', '02d', '02d'],
    descs: ['partly cloudy', 'partly cloudy', 'partly cloudy', 'cloudy', 'showers', 'showers', 'showers', 'showers', 'cloudy', 'partly cloudy', 'partly cloudy', 'partly cloudy'],
    humidity: 60,
    rainChance: [25, 25, 30, 40, 55, 60, 60, 55, 50, 45, 40, 30],
    windSpeed: 4.2,
  },
  brisbane: {
    temps: [30, 30, 28, 26, 22, 19, 18, 19, 23, 26, 28, 30],
    icons: ['10d', '10d', '02d', '01d', '01d', '01d', '01d', '01d', '01d', '02d', '02d', '10d'],
    descs: ['humid and showery', 'humid and showery', 'partly cloudy', 'sunny', 'sunny', 'clear sky', 'clear sky', 'clear sky', 'sunny', 'partly cloudy', 'partly cloudy', 'humid and showery'],
    humidity: 70,
    rainChance: [55, 55, 40, 25, 20, 15, 10, 10, 15, 25, 35, 50],
    windSpeed: 3.0,
  },
  'gold coast': {
    temps: [29, 29, 28, 25, 22, 19, 18, 19, 22, 25, 27, 29],
    icons: ['10d', '10d', '02d', '01d', '01d', '01d', '01d', '01d', '01d', '02d', '02d', '10d'],
    descs: ['warm and humid', 'warm and humid', 'partly cloudy', 'sunny', 'sunny', 'clear sky', 'clear sky', 'clear sky', 'sunny', 'partly cloudy', 'warm', 'warm and humid'],
    humidity: 72,
    rainChance: [50, 50, 38, 22, 18, 12, 10, 10, 15, 22, 32, 45],
    windSpeed: 3.2,
  },
  perth: {
    temps: [31, 32, 29, 25, 20, 17, 16, 17, 19, 22, 26, 29],
    icons: ['01d', '01d', '01d', '01d', '02d', '10d', '10d', '10d', '02d', '01d', '01d', '01d'],
    descs: ['hot and sunny', 'hot and sunny', 'sunny', 'sunny', 'partly cloudy', 'showers', 'showers', 'showers', 'partly cloudy', 'sunny', 'sunny', 'sunny'],
    humidity: 45,
    rainChance: [10, 10, 15, 25, 45, 60, 65, 60, 45, 30, 18, 12],
    windSpeed: 4.5,
  },
  adelaide: {
    temps: [29, 29, 26, 22, 18, 15, 14, 15, 17, 21, 25, 27],
    icons: ['01d', '01d', '01d', '02d', '03d', '10d', '10d', '10d', '03d', '02d', '01d', '01d'],
    descs: ['hot and sunny', 'hot and sunny', 'sunny', 'partly cloudy', 'cool', 'showers', 'showers', 'showers', 'cool', 'partly cloudy', 'sunny', 'sunny'],
    humidity: 50,
    rainChance: [10, 12, 18, 30, 40, 55, 55, 50, 40, 25, 15, 12],
    windSpeed: 4.0,
  },
  cairns: {
    temps: [31, 31, 30, 29, 27, 25, 24, 25, 27, 29, 30, 31],
    icons: ['11d', '11d', '10d', '02d', '01d', '01d', '01d', '01d', '01d', '02d', '10d', '11d'],
    descs: ['tropical storms', 'tropical storms', 'humid and rainy', 'partly cloudy', 'sunny', 'clear sky', 'clear sky', 'clear sky', 'sunny', 'partly cloudy', 'humid', 'tropical storms'],
    humidity: 80,
    rainChance: [70, 70, 60, 35, 15, 10, 8, 8, 12, 25, 45, 65],
    windSpeed: 2.8,
  },
  darwin: {
    temps: [32, 32, 32, 33, 32, 30, 30, 31, 33, 34, 34, 33],
    icons: ['11d', '11d', '11d', '02d', '01d', '01d', '01d', '01d', '01d', '02d', '10d', '11d'],
    descs: ['tropical wet season', 'tropical wet season', 'tropical wet season', 'humid', 'dry season', 'dry season', 'dry season', 'dry season', 'dry season', 'building up', 'humid', 'tropical wet season'],
    humidity: 78,
    rainChance: [75, 72, 65, 30, 8, 5, 3, 3, 5, 20, 50, 70],
    windSpeed: 3.0,
  },
  hobart: {
    temps: [21, 21, 19, 16, 13, 10, 9, 10, 13, 15, 17, 19],
    icons: ['02d', '02d', '02d', '03d', '10d', '10d', '10d', '10d', '03d', '03d', '02d', '02d'],
    descs: ['partly cloudy', 'partly cloudy', 'partly cloudy', 'cloudy', 'cool and rainy', 'cold and rainy', 'cold', 'cold', 'cool', 'partly cloudy', 'partly cloudy', 'partly cloudy'],
    humidity: 65,
    rainChance: [35, 35, 38, 45, 52, 55, 55, 52, 45, 40, 38, 35],
    windSpeed: 4.8,
  },
  canberra: {
    temps: [28, 27, 24, 19, 13, 9, 8, 10, 14, 18, 23, 26],
    icons: ['01d', '01d', '02d', '02d', '10d', '10d', '10d', '10d', '02d', '02d', '01d', '01d'],
    descs: ['hot and sunny', 'hot and sunny', 'partly cloudy', 'partly cloudy', 'cool and rainy', 'cold', 'cold', 'cold', 'cool', 'partly cloudy', 'sunny', 'sunny'],
    humidity: 55,
    rainChance: [25, 25, 30, 35, 40, 40, 38, 35, 32, 30, 25, 22],
    windSpeed: 3.8,
  },
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getSeasonalFallback(city: string): WeatherResponse | null {
  const key = city.toLowerCase().trim();
  // Try exact match first, then partial
  let data = CITY_SEASONAL[key];
  if (!data) {
    for (const [k, v] of Object.entries(CITY_SEASONAL)) {
      if (key.includes(k) || k.includes(key)) {
        data = v;
        break;
      }
    }
  }
  if (!data) return null;

  const month = new Date().getMonth(); // 0-11
  const baseTemp = data.temps[month];
  const baseRain = data.rainChance[month];

  // Build 7-day forecast with slight daily variation using Math.sin(i*1.3)*2
  const forecast: DayForecast[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayMonth = d.getMonth();
    const variation = Math.sin(i * 1.3) * 2;
    const dayTemp = Math.round(baseTemp + variation);
    const dayLow = Math.round(dayTemp - 5 + Math.sin(i * 0.7));
    const dayRain = Math.max(0, Math.min(100, Math.round(baseRain + Math.sin(i * 1.1) * 8)));
    const dayName = i === 0 ? 'Today' : DAY_NAMES[d.getDay()];

    forecast.push({
      date: dayName,
      dateNum: `${d.getDate()} ${MONTH_NAMES[dayMonth]}`,
      icon: data.icons[dayMonth],
      description: data.descs[dayMonth],
      high: dayTemp,
      low: dayLow,
      rainChance: dayRain,
      humidity: data.humidity,
      windSpeed: data.windSpeed,
    });
  }

  return {
    temp: baseTemp,
    feelsLike: baseTemp - 2,
    description: data.descs[month],
    icon: data.icons[month],
    humidity: data.humidity,
    windSpeed: data.windSpeed,
    forecast,
    seasonal: true,
  };
}

interface OWMListItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_max: number;
    temp_min: number;
  };
  weather: Array<{ description: string; icon: string }>;
  wind?: { speed: number };
  pop?: number;
}

function buildForecastFromOWM(list: OWMListItem[]): DayForecast[] {
  // Groups 3-hourly OWM data by day
  const dayMap = new Map<string, {
    highs: number[];
    lows: number[];
    icons: string[];
    descs: string[];
    pops: number[];
    humidities: number[];
    windSpeeds: number[];
    dateObj: Date;
  }>();

  for (const item of list) {
    const d = new Date(item.dt * 1000);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!dayMap.has(key)) {
      dayMap.set(key, {
        highs: [],
        lows: [],
        icons: [],
        descs: [],
        pops: [],
        humidities: [],
        windSpeeds: [],
        dateObj: d,
      });
    }
    const entry = dayMap.get(key)!;
    entry.highs.push(item.main.temp_max ?? item.main.temp);
    entry.lows.push(item.main.temp_min ?? item.main.temp);
    entry.icons.push(item.weather[0]?.icon || '01d');
    entry.descs.push(item.weather[0]?.description || '');
    entry.pops.push((item.pop ?? 0) * 100);
    entry.humidities.push(item.main.humidity);
    entry.windSpeeds.push(item.wind?.speed ?? 0);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result: DayForecast[] = [];
  for (const [, entry] of dayMap) {
    if (result.length >= 7) break;
    const d = new Date(entry.dateObj);
    d.setHours(0, 0, 0, 0);
    const diffDays = Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const dayName = diffDays === 0 ? 'Today' : DAY_NAMES[d.getDay()];

    result.push({
      date: dayName,
      dateNum: `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`,
      icon: entry.icons[Math.floor(entry.icons.length / 2)] || entry.icons[0],
      description: entry.descs[Math.floor(entry.descs.length / 2)] || entry.descs[0],
      high: Math.round(Math.max(...entry.highs)),
      low: Math.round(Math.min(...entry.lows)),
      rainChance: Math.round(Math.max(...entry.pops)),
      humidity: Math.round(entry.humidities.reduce((a, b) => a + b, 0) / entry.humidities.length),
      windSpeed: Math.round((entry.windSpeeds.reduce((a, b) => a + b, 0) / entry.windSpeeds.length) * 10) / 10,
    });
  }

  return result;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  if (!city) {
    return new Response(JSON.stringify({ error: 'city parameter required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check cache
  const cacheKey = city.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return new Response(JSON.stringify(cached.data), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  // Try live API if key is configured
  if (apiKey) {
    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},AU&appid=${apiKey}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)},AU&appid=${apiKey}&units=metric`),
      ]);

      if (currentRes.ok) {
        const data = await currentRes.json();
        let forecast: DayForecast[] | undefined;

        if (forecastRes.ok) {
          const forecastData = await forecastRes.json();
          forecast = buildForecastFromOWM(forecastData.list || []);
        }

        const weather: WeatherResponse = {
          temp: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          description: data.weather[0]?.description || 'unknown',
          icon: data.weather[0]?.icon || '01d',
          humidity: data.main.humidity,
          windSpeed: data.wind?.speed || 0,
          visibility: data.visibility ? Math.round(data.visibility / 1000) : undefined,
          forecast,
        };
        cache.set(cacheKey, { data: weather, fetchedAt: Date.now() });
        return new Response(JSON.stringify(weather), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      // API returned error (e.g. 401 key not active yet) — fall through to seasonal
    } catch {
      // Network error — fall through to seasonal
    }
  }

  // Fallback: seasonal averages for Australian cities
  const fallback = getSeasonalFallback(city);
  if (fallback) {
    // Cache seasonal data for 1 hour
    cache.set(cacheKey, { data: fallback, fetchedAt: Date.now() });
    return new Response(JSON.stringify(fallback), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'Weather data unavailable' }), {
    status: 502,
    headers: { 'Content-Type': 'application/json' },
  });
}
