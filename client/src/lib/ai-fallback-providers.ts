// Fallback AI providers used only when Gemini (the primary provider,
// see lib/gemini.ts) fails on every key/model in its own fallback chain.
// Both providers here have permanent free tiers (no credit card, no
// paid plan needed) — Groq and OpenRouter. Each is optional: if its
// API key isn't set in the environment, it's silently skipped rather
// than treated as an error, so the app keeps working with whichever
// keys are actually configured.
//
// To enable a provider, add its key to .env.local (and to Vercel's
// environment variables for production):
//   GROQ_API_KEY=...        (https://console.groq.com — free, no card)
//   OPENROUTER_API_KEY=...  (https://openrouter.ai/keys — free, no card)
//
// NOTE on model names: free-tier model lineups on both platforms
// change often (models get deprecated or delisted with little
// notice). The constants below were current as of August 2026 — if a
// request starts failing with a "model not found"/decommissioned
// error, check console.groq.com/docs/models or openrouter.ai/models
// and swap the string here. Nothing else needs to change.
const GROQ_TEXT_MODEL = "openai/gpt-oss-120b";
const GROQ_VISION_MODEL = "qwen/qwen3.6-27b"; // Groq marks this a preview model
const OPENROUTER_TEXT_MODEL = "meta-llama/llama-3.3-70b-instruct:free";
const OPENROUTER_VISION_MODEL = "google/gemma-4-31b-it:free";

export type AiResult = { text: string };

// ---------- Groq ----------
// OpenAI-compatible chat completions API.

export async function generateWithGroq(
  contents: { role: string; parts: { text: string }[] }[] | string,
  systemInstruction: string,
  responseMimeType?: "application/json"
): Promise<AiResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not configured");

  const messages = [
    { role: "system", content: systemInstruction },
    ...toOpenAiStyleMessages(contents),
  ];

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_TEXT_MODEL,
      messages,
      ...(responseMimeType === "application/json"
        ? { response_format: { type: "json_object" } }
        : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Groq request failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? "";
  return { text };
}

export async function generateVisionWithGroq(
  imageBase64: string,
  mimeType: string,
  prompt: string,
  systemInstruction: string
): Promise<AiResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not configured");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_VISION_MODEL,
      messages: [
        { role: "system", content: systemInstruction },
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${imageBase64}` },
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Groq vision request failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? "";
  return { text };
}

// ---------- OpenRouter ----------
// Also OpenAI-compatible; routes to whichever provider hosts the
// requested model. ":free" model IDs cost nothing but are rate-limited
// (roughly 20 requests/min, 50/day on a free account).

export async function generateWithOpenRouter(
  contents: { role: string; parts: { text: string }[] }[] | string,
  systemInstruction: string,
  responseMimeType?: "application/json"
): Promise<AiResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured");

  const messages = [
    { role: "system", content: systemInstruction },
    ...toOpenAiStyleMessages(contents),
  ];

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://eduair-ai.vercel.app",
      "X-Title": "EduAir AI",
    },
    body: JSON.stringify({
      model: OPENROUTER_TEXT_MODEL,
      messages,
      ...(responseMimeType === "application/json"
        ? { response_format: { type: "json_object" } }
        : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`OpenRouter request failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? "";
  return { text };
}

export async function generateVisionWithOpenRouter(
  imageBase64: string,
  mimeType: string,
  prompt: string,
  systemInstruction: string
): Promise<AiResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://eduair-ai.vercel.app",
      "X-Title": "EduAir AI",
    },
    body: JSON.stringify({
      model: OPENROUTER_VISION_MODEL,
      messages: [
        { role: "system", content: systemInstruction },
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${imageBase64}` },
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`OpenRouter vision request failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? "";
  return { text };
}

// ---------- shared helpers ----------

function toOpenAiStyleMessages(
  contents: { role: string; parts: { text: string }[] }[] | string
) {
  if (typeof contents === "string") {
    return [{ role: "user", content: contents }];
  }
  return contents.map((c) => ({
    // Gemini uses "model" for the assistant role; OpenAI-style APIs
    // (which both Groq and OpenRouter mimic) expect "assistant".
    role: c.role === "model" ? "assistant" : c.role,
    content: c.parts.map((p) => p.text).join("\n"),
  }));
}
