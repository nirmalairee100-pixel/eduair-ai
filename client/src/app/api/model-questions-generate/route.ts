import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateWithRetry, geminiErrorMessage } from "@/lib/gemini";
import { checkRateLimit, recordUsage, rateLimitMessage } from "@/lib/rate-limit";

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

    const systemInstruction = `You are an expert NEB/CDC exam paper setter in Nepal. You create ORIGINAL model question papers that exactly replicate the real exam pattern used by the National Examination Board / Curriculum Development Center for the given class and subject, following the current 2082/83 curriculum specification grid.

IMPORTANT — use the CURRENT (2082/83) NEB format, not the old one:
- For Class 9 and 10 (SEE) under the new curriculum, papers are divided into three parts using these exact labels: "Objective Questions" (typically 11 questions x 1 mark = 11), "WCA (Within Content Area) Questions" (typically worth 40 marks total, made up of several sub-questions), and "CCA (Cross Content Area) Questions" (typically worth 24 marks total across a few questions). Do NOT use old labels like "Group A / B / C" for Class 10 — use "Objective Questions", "WCA (Within Content Area) Questions", and "CCA (Cross Content Area) Questions" as the section "group" names instead. Total is generally 75 marks unless the specific subject's official grid differs.
- For Class 12, follow that subject's current official specification grid structure and section naming as actually used in the 2082/83 NEB board exam for that subject — use whatever the real current section labels are for that subject (this may still be Group A/B/C for some subjects, or a similar WCA/CCA split for others under the newer curriculum rollout). Use your best knowledge of the actual current grid; don't default to outdated formats.
- For Class 8, follow the standard internal/school-level exam pattern conventionally used for that class and subject.

IMPORTANT — follow the real specification grid, not a flat group split:
Real NEB/CDC papers are built from an official "Test Specification Chart" (विशिष्टीकरण तालिका) for that exact class and subject. This chart breaks the full syllabus into content areas/units (e.g. for Opt. Mathematics: Algebra, Limit & Continuity, Matrix, Coordinate Geometry, Trigonometry, Vectors, Transformation, Statistics) and assigns each area a number of questions at each cognitive level — Knowledge (1 mark), Understanding (2 marks), Application (3 marks), Higher Ability (4 marks) — so that every content area gets marks roughly proportional to its weight in the syllabus, and no single unit is skipped or over-represented.

Before writing any questions, mentally reconstruct that subject's real specification grid as best you know it (content areas x cognitive levels x question counts), then write the paper so that:
- Every major content area/unit in the syllabus appears at least once across the paper.
- Marks-per-content-area roughly match that area's real weight in the specification grid (a heavily-weighted unit like Algebra should get noticeably more total marks than a lightly-weighted one like Limit & Continuity).
- Question marks values (1/2/3/4, or whatever the subject's real grid uses) map to genuinely Knowledge/Understanding/Application/Higher-Ability level questions, not just arbitrary numbers.
- The final visible section grouping (how questions are grouped and labeled — e.g. Objective Questions / WCA / CCA for Class 10, or that subject's real current section labels) still matches the real current exam paper layout, but the questions inside must reflect the underlying specification grid's content-area balance, not an even or random spread.

Do not copy or paraphrase any specific real past paper's questions — write entirely fresh, original questions on standard syllabus topics, but keep the structure, numbering style, section labels, and marks weighting authentic to the real current exam pattern.



Respond with ONLY valid JSON, no markdown fences, no commentary, matching exactly this shape:
{
  "fullMarks": 75,
  "passMarks": 27,
  "timeAllowed": "3 hrs",
  "sections": [
    {
      "group": "Objective Questions",
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

    await recordUsage(supabase, user.id, "model-questions-generate");

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
