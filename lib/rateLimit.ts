const rateLimits = new Map<string, { count: number; resetTime: number }>();

const MAX_REQUESTS = 20;
const WINDOW_MS = 60 * 1000; // 1 minute

export function checkRateLimit(sessionId: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(sessionId);

  if (!entry || now > entry.resetTime) {
    rateLimits.set(sessionId, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  entry.count++;
  return true;
}
