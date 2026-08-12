import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateWithRetry, geminiErrorMessage, trimHistory } from "@/lib/gemini";
import { checkRateLimit, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";

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

    // Cap message length so one paste can't blow past the model's
    // context window or rack up an outsized token bill.
    if (message.length > 4000) {
      return NextResponse.json(
        { error: "That message is too long — try breaking it up." },
        { status: 400 }
      );
    }

    const { allowed } = await checkRateLimit(supabase, user.id, "chat");
    if (!allowed) {
      return NextResponse.json({ error: RATE_LIMIT_MESSAGE }, { status: 429 });
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

    // Only send the most recent messages as context so long-running
    // conversations don't eventually exceed the model's context window.
    const trimmed = trimHistory(history ?? []);
    const contents = trimmed.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content as string }],
    }));

    // Ask Gemini for a reply, with the full conversation as context.
    // Retries automatically on temporary 503/429 errors from Google's side.
    const result = await generateWithRetry(
      contents,
      "You are EduAir AI, a knowledgeable and encouraging study tutor. Give real, substantive answers with enough depth and detail to actually teach the concept — don't oversimplify or water things down. Use concrete examples, explain the reasoning behind things, and go a level deeper than a one-line definition unless the student explicitly asks for a quick summary. Match your depth to what the student seems to need: more detail for complex topics, concise answers for simple factual questions. If you're quizzing the student, remember which question you asked and check their answer against it before moving on. Formatting rules: you may use markdown (bold, bullet lists, numbered lists), but never use LaTeX or dollar-sign math notation like $x+1$ or \\rightarrow — write equations and chemistry in plain readable text instead, e.g. 'CaCO3 -> CaO + CO2' or 'x + 5 = 12', using normal characters only."
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
    return NextResponse.json({ error: geminiErrorMessage(err) }, { status: 500 });
  }
}
