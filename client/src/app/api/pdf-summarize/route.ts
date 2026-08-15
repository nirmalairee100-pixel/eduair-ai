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

    const { fileName, text, pageCount } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "No text was extracted from that PDF" },
        { status: 400 }
      );
    }

    const FREE_PAGE_LIMIT = 10;
    if (typeof pageCount === "number" && pageCount > FREE_PAGE_LIMIT) {
      return NextResponse.json(
        {
          error: `Free tier supports PDFs up to ${FREE_PAGE_LIMIT} pages. This one has ${pageCount} — upgrade to Pro for up to 50 pages.`,
        },
        { status: 413 }
      );
    }

    const { allowed } = await checkRateLimit(supabase, user.id, "pdf-summarize");
    if (!allowed) {
      return NextResponse.json({ error: rateLimitMessage("pdf-summarize") }, { status: 429 });
    }

    // Cap input length so a huge PDF doesn't blow past the model's context
    // or take forever - a few thousand words is plenty for a summary.
    const trimmedText = text.slice(0, 20000);

    const result = await generateWithRetry(
      `Summarize the following document for a student studying it. Give:\n1. A short overview (2-3 sentences)\n2. The key points as a bulleted list\n3. Any important definitions or formulas mentioned\n\nDocument:\n${trimmedText}`,
      "You are EduAir AI's document summarizer. Be clear, organized, and focus on what a student actually needs to remember for studying. Use markdown formatting (bold, bullet points) but never use LaTeX or dollar-sign math notation - write formulas in plain text."
    );

    const summary = result.text ?? "Couldn't generate a summary — try again.";

    await recordUsage(supabase, user.id, "pdf-summarize");

    const { data: doc, error: dbError } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        file_name: fileName || "Untitled.pdf",
        summary,
      })
      .select("id")
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ summary, documentId: doc.id });
  } catch (err) {
    console.error("PDF summarize error:", err);
    return NextResponse.json({ error: geminiErrorMessage(err) }, { status: 500 });
  }
}
