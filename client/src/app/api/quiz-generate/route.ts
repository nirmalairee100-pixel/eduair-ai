import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateWithRetry, geminiErrorMessage } from "@/lib/gemini";

type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const { topic, numQuestions } = await request.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const count = Math.min(Math.max(Number(numQuestions) || 5, 3), 10);

    const result = await generateWithRetry(
      `Create a ${count}-question multiple-choice quiz on: ${topic}`,
      `You are a quiz generator. Respond with ONLY valid JSON, no markdown fences, no commentary, matching exactly this shape:
{"questions": [{"question": "string", "options": ["string", "string", "string", "string"], "correctIndex": 0}]}
Each question must have exactly 4 options and correctIndex must be the 0-based index of the correct option. Write plain text only, no LaTeX or dollar-sign math notation.`,
      "application/json"
    );

    const raw = result.text ?? "{}";
    let questions: QuizQuestion[];
    try {
      const parsed = JSON.parse(raw);
      questions = parsed.questions;
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("empty");
      }
    } catch {
      return NextResponse.json(
        { error: "Couldn't generate a valid quiz — try again." },
        { status: 500 }
      );
    }

    const { data: quiz, error: dbError } = await supabase
      .from("quizzes")
      .insert({
        user_id: user.id,
        topic,
        questions,
        total: questions.length,
      })
      .select("id")
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ quizId: quiz.id, topic, questions });
  } catch (err) {
    console.error("Quiz generate error:", err);
    return NextResponse.json({ error: geminiErrorMessage(err) }, { status: 500 });
  }
}
