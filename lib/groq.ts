import Groq from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY environment variable is not set');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: 25000,   // 25s hard timeout — Vercel kills at 60s, gives plenty of room
  maxRetries: 0,    // Handle retries manually in route.ts
});

export default groq;
