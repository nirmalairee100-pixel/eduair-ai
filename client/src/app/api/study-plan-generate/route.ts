import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateWithRetry, geminiErrorMessage } from "@/lib/gemini";
import { checkRateLimit, recordUsage, rateLimitMessage } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const { subjects, examDate, hoursPerDay } = await request.json();

    if (!subjects || typeof subjects !== "string") {
      return NextResponse.json(
        { error: "Please list at least one subject" },
        { status: 400 }
      );
    }

    if (subjects.length > 300) {
      return NextResponse.json(
        { error: "That subject list is too long — try trimming it down." },
        { status: 400 }
      );
    }

    const { allowed, isPro } = await checkRateLimit(supabase, user.id, "study-plan-generate");
    if (!allowed) {
      return NextResponse.json({ error: rateLimitMessage("study-plan-generate", isPro) }, { status: 429 });
    }

    const prompt = `Create a day-by-day study plan.
Subjects to cover: ${subjects}
Exam date: ${examDate || "not specified — assume 2 weeks from now"}
Study time available: ${hoursPerDay || "2"} hours per day

Break the plan into days, allocate time per subject/topic each day, and include short breaks and a light review day before the exam.`;

    const result = await generateWithRetry(
      prompt,
      "You are EduAir AI's study planner. Create a realistic, well-structured day-by-day plan using markdown headings and bullet points. Never use LaTeX or dollar-sign math notation."
    );

    const content = result.text ?? "Couldn't generate a plan — try again.";
    const title = `${subjects.slice(0, 40)} study plan`;

    const { data: plan, error: dbError } = await supabase
      .from("study_plans")
      .insert({ user_id: user.id, title, content })
      .select("id")
      .single();

    if (dbError) throw dbError;

    await recordUsage(supabase, user.id, "study-plan-generate");

    return NextResponse.json({ content, title, planId: plan.id });
  } catch (err) {
    console.error("Study plan generate error:", err);
    return NextResponse.json({ error: geminiErrorMessage(err) }, { status: 500 });
  }
}
