import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const MODELS = ["gemini-3-flash-preview", "gemini-2.5-flash", "gemini-2.5-flash-lite"];

// Vision-capable models only — used for photo analysis. Kept as a
// separate list since a future text-only fallback model might not
// support image inputs.
const VISION_MODELS = ["gemini-3-flash-preview", "gemini-2.5-flash"];

// Caps how many most-recent messages get sent as context on each chat
// request. Without this, a long-running conversation resends its full
// history every turn and eventually exceeds the model's context window
// (and gets more expensive with every message).
const MAX_HISTORY_MESSAGES = 20;

export function trimHistory<T>(messages: T[]): T[] {
  if (messages.length <= MAX_HISTORY_MESSAGES) return messages;
  return messages.slice(messages.length - MAX_HISTORY_MESSAGES);
}

// Gemini's free tier occasionally returns 503 "high demand" errors that
// clear up within seconds. Retry a few times with a short, increasing
// delay before giving up, and fall back to a lighter model on the last
// attempt in case the specific model is the one under strain.
export async function generateWithRetry(
  contents: { role: string; parts: { text: string }[] }[] | string,
  systemInstruction: string,
  responseMimeType?: "application/json"
) {
  let lastError: unknown;

  for (let attempt = 0; attempt < MODELS.length; attempt++) {
    try {
      return await ai.models.generateContent({
        model: MODELS[attempt],
        contents,
        config: {
          systemInstruction,
          ...(responseMimeType ? { responseMimeType } : {}),
        },
      });
    } catch (err) {
      lastError = err;
      const status = (err as { status?: number })?.status;
      // Only retry on transient server-side errors, not on bad requests/auth.
      if (status !== 503 && status !== 429) throw err;
      if (attempt < MODELS.length - 1) {
        await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

// Analyze an image (homework photo, diagram, handwritten notes, etc.)
// with a text prompt. Same 503/429 retry + fallback behavior as
// generateWithRetry, but restricted to models that accept image input.
export async function generateVisionWithRetry(
  imageBase64: string,
  mimeType: string,
  prompt: string,
  systemInstruction: string
) {
  let lastError: unknown;

  for (let attempt = 0; attempt < VISION_MODELS.length; attempt++) {
    try {
      return await ai.models.generateContent({
        model: VISION_MODELS[attempt],
        contents: [
          {
            role: "user",
            parts: [
              { inlineData: { mimeType, data: imageBase64 } },
              { text: prompt },
            ],
          },
        ],
        config: { systemInstruction },
      });
    } catch (err) {
      lastError = err;
      const status = (err as { status?: number })?.status;
      if (status !== 503 && status !== 429) throw err;
      if (attempt < VISION_MODELS.length - 1) {
        await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

// Consistent, friendly error message for the API routes to return.
export function geminiErrorMessage(err: unknown): string {
  const status = (err as { status?: number })?.status;
  return status === 503 || status === 429
    ? "Google's AI servers are overloaded right now. Please wait a moment and try again."
    : "Something went wrong talking to the AI. Try again.";
}
