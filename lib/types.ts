// === LLM Output Schema ===
export interface CardItem {
  type: 'eat' | 'stay' | 'transport' | 'plan' | 'essentials';
  title: string;
  bullets: string[];
}

export interface LLMResponse {
  spoken_script: string;
  assistant_text: string;
  cards: CardItem[];
  follow_up_question: string;
}

// === SSE Event Types ===
export interface SSEChunkEvent {
  type: 'chunk';
  content: string;
}

export interface SSEDoneEvent {
  type: 'done';
  json: LLMResponse;
}

export interface SSEErrorEvent {
  type: 'error';
  message: string;
}

export type SSEEvent = SSEChunkEvent | SSEDoneEvent | SSEErrorEvent;

// === Session Memory ===
export interface SessionMemory {
  lastLocation: string;
  budgetMode: 'tight' | 'normal' | 'comfortable';
  vibeMode: 'social' | 'chill';
  walkingPref: 'walk' | 'transit';
  tripDuration?: string;
  dates?: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  lastAccessed: number;
}

// === API Request ===
export interface Preferences {
  budget: 'tight' | 'normal' | 'comfortable';
  vibe: 'social' | 'chill';
  walking: 'walk' | 'transit';
}

export interface TurnRequest {
  sessionId: string;
  userTranscript: string;
  preferences: Preferences;
  locationText?: string;
}

// === Frontend Chat ===
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  cards?: CardItem[];
  spokenScript?: string;
  followUp?: string;
  isStreaming?: boolean;
}

export type AppStatus = 'ready' | 'listening' | 'thinking' | 'speaking';
