import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/lib/supabase/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

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
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction:
          "You are EduMind AI, a friendly and encouraging study tutor. Explain things clearly and simply for a student. If you're quizzing the student, remember which question you asked and check their answer against it before moving on.",
      },
    });
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
    return NextResponse.json(
      { error: "Something went wrong talking to the AI. Try again." },
      { status: 500 }
    );
  }
}
