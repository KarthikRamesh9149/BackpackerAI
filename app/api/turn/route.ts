import groq from '@/lib/groq';
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
export const maxDuration = 60; // Allow up to 60s on Vercel (covers full LLM stream)

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
  // Try parsing the whole text first
  try {
    return JSON.parse(text);
  } catch {
    // Try to find JSON object in text
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

async function fixJSON(rawText: string): Promise<LLMResponse | null> {
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
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
    });
    const fixed = response.choices[0]?.message?.content;
    if (!fixed) return null;
    const parsed = extractJSON(fixed);
    return validateLLMResponse(parsed);
  } catch {
    return null;
  }
}

/** Filter out any cards with empty bullets */
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
          'Try rephrasing your question if this keeps happening',
          'Make sure to mention which city or area you\'re in',
          'Specific questions get better answers than broad ones',
        ],
      },
    ],
    follow_up_question: 'What would you like to know about your trip in Australia?',
  };
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

  // Rate limit check
  if (!checkRateLimit(sessionId)) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please wait a moment.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Update session
  const session = getSession(sessionId);
  if (preferences) {
    updateSessionPreferences(sessionId, preferences);
  }
  if (locationText) {
    updateLocation(sessionId, locationText);
  }

  // Add user message to history
  addToHistory(sessionId, 'user', userTranscript);

  // Build messages for Groq
  const systemPrompt = buildSystemPrompt({
    memory: session,
    weatherContext: weatherContext as string | undefined,
    budgetContext: budgetContext as string | undefined,
    geoContext: geoContext as { lat: number; lng: number; suburb?: string } | undefined,
  });
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
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

      // Helper: attempt one Groq call, returns full accumulated text
      async function attemptGroqCall(): Promise<string> {
        const groqStream = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages,
          stream: true,
          temperature: 0.7,
          max_tokens: 4096,
        });
        let text = '';
        for await (const chunk of groqStream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            text += content;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content })}\n\n`)
            );
          }
        }
        return text;
      }

      try {
        // First attempt
        try {
          fullText = await attemptGroqCall();
        } catch (firstErr) {
          // Log the real error so it shows in Vercel Runtime Logs
          console.error('[turn] Groq first attempt failed:', firstErr instanceof Error ? firstErr.message : firstErr);
          // Wait 1.5s then retry once
          await new Promise((r) => setTimeout(r, 1500));
          console.log('[turn] Retrying Groq call...');
          fullText = await attemptGroqCall();
          console.log('[turn] Retry succeeded');
        }

        // Try to parse the full response
        let parsed = extractJSON(fullText);
        let validated = validateLLMResponse(parsed);

        // If invalid, retry with fix prompt
        if (!validated) {
          validated = await fixJSON(fullText);
        }

        // If still invalid, use fallback
        if (!validated) {
          validated = fallbackResponse('Could not parse response');
        }

        // Remove any cards with empty bullets
        validated.cards = cleanCards(validated.cards);

        // Update session with assistant response
        addToHistory(sessionId, 'assistant', validated.assistant_text);

        // Send final done event
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'done', json: validated })}\n\n`
          )
        );
      } catch (err) {
        // Both attempts failed — log full error for Vercel debugging
        console.error('[turn] Groq failed after retry:', err instanceof Error ? err.message : err);
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        const fallback = fallbackResponse(errorMsg);

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'done', json: fallback })}\n\n`
          )
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
