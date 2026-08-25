import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateWithRetry, geminiErrorMessage } from "@/lib/gemini";
import { checkRateLimit, rateLimitMessage } from "@/lib/rate-limit";

type MQQuestion = {
  number: string;      // e.g. "1", "2(a)"
  text: string;
  marks: number;
};

type MQSection = {
  group: string;        // e.g. "Group A", "Group B", "Group C"
  instructions: string; // e.g. "Answer all questions. Each question carries 1 mark."
  questions: MQQuestion[];
};

const VALID_CLASSES = ["8", "10", "12"] as const;
const VALID_FACULTIES = ["Science", "Management", "Humanities"] as const;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const { classLevel, faculty, subject } = await request.json();

    if (!classLevel || !VALID_CLASSES.includes(classLevel)) {
      return NextResponse.json({ error: "Invalid class level" }, { status: 400 });
    }
    if (classLevel === "12" && (!faculty || !VALID_FACULTIES.includes(faculty))) {
      return NextResponse.json({ error: "Faculty is required for Class 12" }, { status: 400 });
    }
    if (!subject || typeof subject !== "string" || subject.length > 80) {
      return NextResponse.json({ error: "Invalid subject" }, { status: 400 });
    }

    const { allowed, isPro } = await checkRateLimit(supabase, user.id, "model-questions-generate");
    if (!allowed) {
      return NextResponse.json(
        { error: rateLimitMessage("model-questions-generate", isPro) },
        { status: 429 }
      );
    }

    const examLabel =
      classLevel === "10" ? "SEE (Secondary Education Examination)" : "NEB board exam";
    const facultyLine = classLevel === "12" ? ` (${faculty} faculty)` : "";

    const prompt = `Generate one complete model question paper for Class ${classLevel}${facultyLine}, subject: ${subject}, for the ${examLabel} in Nepal.`;

    const systemInstruction = `You are an expert NEB/CDC exam paper setter in Nepal. You create ORIGINAL model question papers that exactly replicate the real exam pattern used by the National Examination Board / Curriculum Development Center for the given class and subject — same group structure (Group A / B / C), same question types per group (objective, short answer, long answer), same number of questions per group, and the same official marks distribution and full marks for that class and subject. Do not copy or paraphrase any specific real past paper's questions — write entirely fresh, original questions on standard syllabus topics, but keep the structure, numbering style, and marks weighting authentic to the real exam pattern.

Respond with ONLY valid JSON, no markdown fences, no commentary, matching exactly this shape:
{
  "fullMarks": 75,
  "passMarks": 27,
  "timeAllowed": "3 hrs",
  "sections": [
    {
      "group": "Group A",
      "instructions": "Answer all questions. Each question carries 1 mark. [1x11=11]",
      "questions": [
        { "number": "1", "text": "question text here", "marks": 1 }
      ]
    }
  ]
}
Use realistic Nepali NEB conventions (e.g. "[5x2=10]" style marks notation in group instructions). Write plain text only, no LaTeX or dollar-sign math notation — use plain symbols instead (e.g. x^2, sqrt(x)).`;

    const result = await generateWithRetry(prompt, systemInstruction, "application/json");

    const raw = result.text ?? "{}";
    let sections: MQSection[];
    let fullMarks: number;
    let passMarks: number | undefined;
    let timeAllowed: string | undefined;
    try {
      const parsed = JSON.parse(raw);
      sections = parsed.sections;
      fullMarks = Number(parsed.fullMarks) || 0;
      passMarks = parsed.passMarks ? Number(parsed.passMarks) : undefined;
      timeAllowed = typeof parsed.timeAllowed === "string" ? parsed.timeAllowed : undefined;
      if (!Array.isArray(sections) || sections.length === 0) {
        throw new Error("empty");
      }
    } catch {
      return NextResponse.json(
        { error: "Couldn't generate a valid model question set — try again." },
        { status: 500 }
      );
    }

    const { data: set, error: dbError } = await supabase
      .from("model_question_sets")
      .insert({
        user_id: user.id,
        class_level: classLevel,
        faculty: classLevel === "12" ? faculty : null,
        subject,
        sections,
        full_marks: fullMarks,
        pass_marks: passMarks,
        time_allowed: timeAllowed,
      })
      .select("id")
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({
      setId: set.id,
      classLevel,
      faculty: classLevel === "12" ? faculty : null,
      subject,
      fullMarks,
      passMarks,
      timeAllowed,
      sections,
    });
  } catch (err) {
    console.error("Model question generate error:", err);
    return NextResponse.json({ error: geminiErrorMessage(err) }, { status: 500 });
  }
}
