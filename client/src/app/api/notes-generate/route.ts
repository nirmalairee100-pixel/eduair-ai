import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateWithRetry, geminiErrorMessage } from "@/lib/gemini";
import { checkRateLimit, rateLimitMessage, recordUsage } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const { topic } = await request.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    if (topic.length > 300) {
      return NextResponse.json(
        { error: "Topic is too long — try a shorter phrase." },
        { status: 400 }
      );
    }

    const { allowed } = await checkRateLimit(supabase, user.id, "notes-generate");
    if (!allowed) {
      return NextResponse.json({ error: rateLimitMessage("notes-generate") }, { status: 429 });
    }

    const result = await generateWithRetry(
      `Create clear, well-organized study notes on: ${topic}`,
      "You are EduAir AI's notes maker. Produce study notes with clear headings, bullet points, and, where useful, a short summary at the end. Be thorough enough to actually help a student revise, not just a one-paragraph overview. Use markdown formatting but never use LaTeX or dollar-sign math notation - write formulas and equations in plain text."
    );

    const content = result.text ?? "Couldn't generate notes — try again.";

    await recordUsage(supabase, user.id, "notes-generate");

    const { data: note, error: dbError } = await supabase
      .from("notes")
      .insert({ user_id: user.id, topic, content })
      .select("id")
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ content, noteId: note.id });
  } catch (err) {
    console.error("Notes generate error:", err);
    return NextResponse.json({ error: geminiErrorMessage(err) }, { status: 500 });
  }
}
