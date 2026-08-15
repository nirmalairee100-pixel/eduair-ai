// Fallback AI providers used only when Gemini (the primary provider,
// see lib/gemini.ts) fails on every model in its own fallback chain.
// Each provider here is optional — if its API key isn't set in the
// environment, it's silently skipped rather than treated as an error,
// so the app keeps working with whichever keys are actually configured.
//
// To enable a provider, add its key to .env.local (and to Vercel's
// environment variables for production):
//   OPENAI_API_KEY=sk-...       (https://platform.openai.com/api-keys)
//   ANTHROPIC_API_KEY=sk-ant-... (https://console.anthropic.com/settings/keys)

export type AiResult = { text: string };

// ---------- OpenAI ----------

export async function generateWithOpenAI(
  contents: { role: string; parts: { text: string }[] }[] | string,
  systemInstruction: string,
  responseMimeType?: "application/json"
): Promise<AiResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const messages = [
    { role: "system", content: systemInstruction },
    ...toOpenAiMessages(contents),
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      ...(responseMimeType === "application/json"
        ? { response_format: { type: "json_object" } }
        : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`OpenAI request failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? "";
  return { text };
}

export async function generateVisionWithOpenAI(
  imageBase64: string,
  mimeType: string,
  prompt: string,
  systemInstruction: string
): Promise<AiResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
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
    throw new Error(`OpenAI vision request failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? "";
  return { text };
}

function toOpenAiMessages(
  contents: { role: string; parts: { text: string }[] }[] | string
) {
  if (typeof contents === "string") {
    return [{ role: "user", content: contents }];
  }
  return contents.map((c) => ({
    // Gemini uses "model" for the assistant role; OpenAI expects "assistant".
    role: c.role === "model" ? "assistant" : c.role,
    content: c.parts.map((p) => p.text).join("\n"),
  }));
}

// ---------- Anthropic (Claude) ----------

export async function generateWithAnthropic(
  contents: { role: string; parts: { text: string }[] }[] | string,
  systemInstruction: string,
  // Anthropic has no native JSON-mode equivalent; accepted here only so
  // this function has the same signature as generateWithOpenAI and can
  // be used interchangeably in the fallback chain.
  _responseMimeType?: "application/json"
): Promise<AiResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const messages = toAnthropicMessages(contents);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      system: systemInstruction,
      messages,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Anthropic request failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  const text =
    data?.content?.filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("\n") ?? "";
  return { text };
}

export async function generateVisionWithAnthropic(
  imageBase64: string,
  mimeType: string,
  prompt: string,
  systemInstruction: string
): Promise<AiResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      system: systemInstruction,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mimeType, data: imageBase64 },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Anthropic vision request failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  const text =
    data?.content?.filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("\n") ?? "";
  return { text };
}

function toAnthropicMessages(
  contents: { role: string; parts: { text: string }[] }[] | string
) {
  if (typeof contents === "string") {
    return [{ role: "user", content: contents }];
  }
  return contents.map((c) => ({
    role: c.role === "model" ? "assistant" : "user",
    content: c.parts.map((p) => p.text).join("\n"),
  }));
}
