import { buildSystemPrompt } from '@/lib/systemPrompt';
import {
  getSession,
  updateSessionPreferences,
  addToHistory,
  updateLocation,
} from '@/lib/sessionMemory';
import { checkRateLimit } from '@/lib/rateLimit';
import { TurnRequest, LLMResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

function validateLLMResponse(obj: unknown): LLMResponse | null {
  if (!obj || typeof obj !== 'object') return null;
  const o = obj as Record<string, unknown>;

  if (typeof o.spoken_script !== 'string') return null;
  if (typeof o.assistant_text !== 'string') return null;
  if (typeof o.follow_up_question !== 'string') return null;
  if (!Array.isArray(o.cards)) return null;

  const validTypes = ['eat', 'stay', 'transport', 'plan', 'essentials'];
  for (const card of o.cards) {
    if (!card || typeof card !== 'object') return null;
    if (typeof card.type !== 'string' || !validTypes.includes(card.type)) return null;
    if (typeof card.title !== 'string') return null;
    if (!Array.isArray(card.bullets) || card.bullets.some((b: unknown) => typeof b !== 'string'))
      return null;
  }

  return obj as LLMResponse;
}

function extractJSON(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

// Use native fetch to call Groq — non-streaming, for JSON repair
async function fixJSONViaFetch(rawText: string, apiKey: string): Promise<LLMResponse | null> {
  try {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: `Fix the following text into valid JSON matching this exact schema. Return ONLY the JSON, nothing else:
{
  "spoken_script": string,
  "assistant_text": string,
  "cards": [{"type": "eat"|"stay"|"transport"|"plan"|"essentials", "title": string, "bullets": string[]}],
  "follow_up_question": string
}`,
          },
          { role: 'user', content: rawText },
        ],
        temperature: 0,
        stream: false,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const fixed = data.choices?.[0]?.message?.content;
    if (!fixed) return null;
    return validateLLMResponse(extractJSON(fixed));
  } catch {
    return null;
  }
}

function cleanCards(cards: LLMResponse['cards']): LLMResponse['cards'] {
  return cards.filter((c) => c.bullets && c.bullets.length > 0);
}

function fallbackResponse(errorMsg: string): LLMResponse {
  return {
    spoken_script:
      "Sorry mate, I hit a snag there. Could you try asking again? Sometimes I need a sec to get my thoughts together.",
    assistant_text: `Apologies — I ran into a technical issue: ${errorMsg}. Please try asking your question again, and I'll do my best to help!`,
    cards: [
      {
        type: 'essentials',
        title: 'Quick Tip While You Wait',
        bullets: [
          "Try rephrasing your question if this keeps happening",
          "Make sure to mention which city or area you're in",
          "Specific questions get better answers than broad ones",
        ],
      },
    ],
    follow_up_question: 'What would you like to know about your trip in Australia?',
  };
}

type Message = { role: 'system' | 'user' | 'assistant'; content: string };

// Stream Groq using native fetch + SSE parsing
async function streamGroq(
  messages: Message[],
  apiKey: string,
  onChunk: (content: string) => void
): Promise<string> {
  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Groq API error ${res.status}: ${errText}`);
  }

  if (!res.body) throw new Error('No response body from Groq');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') break;
      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) {
          fullText += content;
          onChunk(content);
        }
      } catch {
        // skip malformed SSE line
      }
    }
  }

  return fullText;
}

export async function POST(request: Request) {
  let body: TurnRequest;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { sessionId, userTranscript, preferences, locationText, weatherContext, budgetContext, geoContext } = body;

  if (!sessionId || !userTranscript) {
    return new Response(
      JSON.stringify({ error: 'sessionId and userTranscript are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!checkRateLimit(sessionId)) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please wait a moment.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GROQ_API_KEY not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const session = getSession(sessionId);
  if (preferences) updateSessionPreferences(sessionId, preferences);
  if (locationText) updateLocation(sessionId, locationText);

  addToHistory(sessionId, 'user', userTranscript);

  const systemPrompt = buildSystemPrompt({
    memory: session,
    weatherContext: weatherContext as string | undefined,
    budgetContext: budgetContext as string | undefined,
    geoContext: geoContext as { lat: number; lng: number; suburb?: string } | undefined,
  });

  const messages: Message[] = [
    { role: 'system', content: systemPrompt },
    ...session.conversationHistory.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
  ];

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let fullText = '';

      try {
        // First attempt
        try {
          fullText = await streamGroq(messages, apiKey, (content) => {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content })}\n\n`)
            );
          });
        } catch (firstErr) {
          console.error('[turn] Groq attempt 1 failed:', firstErr instanceof Error ? firstErr.message : firstErr);
          // Wait 2s then retry
          await new Promise((r) => setTimeout(r, 2000));
          fullText = await streamGroq(messages, apiKey, (content) => {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content })}\n\n`)
            );
          });
        }

        const parsed = extractJSON(fullText);
        let validated = validateLLMResponse(parsed);

        if (!validated) {
          validated = await fixJSONViaFetch(fullText, apiKey);
        }
        if (!validated) {
          validated = fallbackResponse('Could not parse response');
        }

        validated.cards = cleanCards(validated.cards);
        addToHistory(sessionId, 'assistant', validated.assistant_text);

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'done', json: validated })}\n\n`)
        );
      } catch (err) {
        console.error('[turn] Groq failed after retry:', err instanceof Error ? err.message : err);
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'done', json: fallbackResponse(errorMsg) })}\n\n`)
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
