import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const MODELS = ["gemini-3-flash-preview", "gemini-2.5-flash", "gemini-2.5-flash-lite"];

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

// Consistent, friendly error message for the API routes to return.
export function geminiErrorMessage(err: unknown): string {
  const status = (err as { status?: number })?.status;
  return status === 503 || status === 429
    ? "Google's AI servers are overloaded right now. Please wait a moment and try again."
    : "Something went wrong talking to the AI. Try again.";
}
