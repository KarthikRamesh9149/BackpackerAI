export const dynamic = 'force-dynamic';

interface CachedRates {
  rates: Record<string, number>;
  fetchedAt: number;
}

let cache: CachedRates | null = null;
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

export async function GET() {
  // Check cache
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL) {
    return new Response(JSON.stringify({ rates: cache.rates }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  if (!apiKey) {
    // Fallback with hardcoded approximate rates
    const fallbackRates: Record<string, number> = {
      USD: 0.65, EUR: 0.60, GBP: 0.52, JPY: 97.5, INR: 54.2,
      CAD: 0.89, NZD: 1.09, SGD: 0.87, KRW: 870, THB: 22.5,
      CNY: 4.7, MYR: 2.9, IDR: 10200, PHP: 36.5, VND: 16200,
      SEK: 6.8, NOK: 7.0, DKK: 4.5, CHF: 0.58, BRL: 3.2,
      ZAR: 12.0, HKD: 5.1, TWD: 20.5, AED: 2.4, ILS: 2.4,
    };
    return new Response(JSON.stringify({ rates: fallbackRates, fallback: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/AUD`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('Exchange rate API error');
    }

    const data = await res.json();
    const rates = data.conversion_rates as Record<string, number>;

    // Remove AUD from rates
    delete rates.AUD;

    cache = { rates, fetchedAt: Date.now() };

    return new Response(JSON.stringify({ rates }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    // Return cached data if available, even if expired
    if (cache) {
      return new Response(JSON.stringify({ rates: cache.rates, stale: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: 'Failed to fetch rates' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
