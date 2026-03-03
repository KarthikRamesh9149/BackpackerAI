import { SessionMemory, Preferences } from './types';

const SESSION_TTL = 60 * 60 * 1000; // 1 hour
const sessions = new Map<string, SessionMemory>();

export function getSession(sessionId: string): SessionMemory {
  const existing = sessions.get(sessionId);
  if (existing) {
    existing.lastAccessed = Date.now();
    return existing;
  }

  const newSession: SessionMemory = {
    lastLocation: '',
    budgetMode: 'normal',
    vibeMode: 'social',
    walkingPref: 'transit',
    conversationHistory: [],
    lastAccessed: Date.now(),
  };
  sessions.set(sessionId, newSession);
  return newSession;
}

export function updateSessionPreferences(
  sessionId: string,
  preferences: Preferences
): void {
  const session = getSession(sessionId);
  session.budgetMode = preferences.budget;
  session.vibeMode = preferences.vibe;
  session.walkingPref = preferences.walking;
}

export function addToHistory(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string
): void {
  const session = getSession(sessionId);
  session.conversationHistory.push({ role, content });
  // Keep last 10 messages
  if (session.conversationHistory.length > 10) {
    session.conversationHistory = session.conversationHistory.slice(-10);
  }
}

export function updateLocation(sessionId: string, location: string): void {
  if (location) {
    const session = getSession(sessionId);
    session.lastLocation = location;
  }
}

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.lastAccessed > SESSION_TTL) {
      sessions.delete(id);
    }
  }
}, 5 * 60 * 1000); // Check every 5 minutes
