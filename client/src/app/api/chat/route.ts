import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/lib/supabase/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Gemini's free tier occasionally returns 503 "high demand" errors that
// clear up within seconds. Retry a few times with a short, increasing
// delay before giving up, and fall back to a lighter model on the last
// attempt in case the specific model is the one under strain.
async function generateWithRetry(
  contents: { role: string; parts: { text: string }[] }[],
  systemInstruction: string
) {
  const models = ["gemini-2.5-flash", "gemini-2.5-flash", "gemini-2.5-flash-lite"];
  let lastError: unknown;

  for (let attempt = 0; attempt < models.length; attempt++) {
    try {
      return await ai.models.generateContent({
        model: models[attempt],
        contents,
        config: { systemInstruction },
      });
    } catch (err) {
      lastError = err;
      const status = (err as { status?: number })?.status;
      // Only retry on transient server-side errors, not on bad requests/auth.
      if (status !== 503 && status !== 429) throw err;
      if (attempt < models.length - 1) {
        await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const { message, conversationId } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get or create the conversation this message belongs to.
    let convoId = conversationId as string | undefined;
    if (!convoId) {
      const { data: convo, error: convoError } = await supabase
        .from("conversations")
        .insert({ user_id: user.id, title: message.slice(0, 60) })
        .select("id")
        .single();

      if (convoError) throw convoError;
      convoId = convo.id;
    }

    // Save the user's message.
    await supabase.from("messages").insert({
      conversation_id: convoId,
      role: "user",
      content: message,
    });

    // Pull the full conversation so far (including the message we just
    // saved) so Gemini has context instead of treating every message as
    // a brand new conversation.
    const { data: history, error: historyError } = await supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", convoId)
      .order("created_at", { ascending: true });

    if (historyError) throw historyError;

    const contents = (history ?? []).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content as string }],
    }));

    // Ask Gemini for a reply, with the full conversation as context.
    // Retries automatically on temporary 503/429 errors from Google's side.
    const result = await generateWithRetry(
      contents,
      "You are EduAir AI, a friendly and encouraging study tutor. Explain things clearly and simply for a student. If you're quizzing the student, remember which question you asked and check their answer against it before moving on. Formatting rules: you may use markdown (bold, bullet lists, numbered lists), but never use LaTeX or dollar-sign math notation like $x+1$ or \\rightarrow — write equations and chemistry in plain readable text instead, e.g. 'CaCO3 -> CaO + CO2' or 'x + 5 = 12', using normal characters only."
    );
    const reply = result.text ?? "Sorry, I didn't get a response — try again.";

    // Save the AI's reply.
    await supabase.from("messages").insert({
      conversation_id: convoId,
      role: "assistant",
      content: reply,
    });

    return NextResponse.json({ reply, conversationId: convoId });
  } catch (err) {
    console.error("Chat error:", err);
    const status = (err as { status?: number })?.status;
    const message =
      status === 503 || status === 429
        ? "Google's AI servers are overloaded right now. Please wait a moment and try again."
        : "Something went wrong talking to the AI. Try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
