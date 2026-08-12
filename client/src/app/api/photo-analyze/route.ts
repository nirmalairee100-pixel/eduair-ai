import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateVisionWithRetry, geminiErrorMessage } from "@/lib/gemini";
import { checkRateLimit, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
// Base64 grows an image by ~33% — cap the encoded string so a huge
// photo can't blow past the model's request size or take forever.
const MAX_BASE64_LENGTH = 8_000_000; // ~6MB original image

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const { fileName, mimeType, imageBase64, question } = await request.json();

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json({ error: "No image was provided" }, { status: 400 });
    }

    if (!mimeType || !ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: "Please upload a JPEG, PNG, WEBP, or HEIC image." },
        { status: 400 }
      );
    }

    if (imageBase64.length > MAX_BASE64_LENGTH) {
      return NextResponse.json(
        { error: "That image is too large — try one under ~6MB." },
        { status: 400 }
      );
    }

    const { allowed } = await checkRateLimit(supabase, user.id, "photo-analyze");
    if (!allowed) {
      return NextResponse.json({ error: RATE_LIMIT_MESSAGE }, { status: 429 });
    }

    const userQuestion =
      typeof question === "string" && question.trim().length > 0
        ? question.trim().slice(0, 500)
        : "Explain what's in this image and help me understand it.";

    const result = await generateVisionWithRetry(
      imageBase64,
      mimeType,
      userQuestion,
      "You are EduAir AI's photo analyzer, built to help students with homework photos, diagrams, handwritten notes, textbook pages, and whiteboard shots. Identify what's in the image, explain the underlying concept, and if it's a problem (math, science, etc.) walk through how to solve it step by step rather than just giving the final answer. Use markdown formatting (bold, bullet points, numbered steps) but never use LaTeX or dollar-sign math notation — write equations and formulas in plain text, e.g. 'x^2 + 3x - 4 = 0' or 'F = m * a'."
    );

    const analysis = result.text ?? "Couldn't analyze that image — try again.";

    const { data: photo, error: dbError } = await supabase
      .from("photo_analyses")
      .insert({
        user_id: user.id,
        file_name: fileName || "photo.jpg",
        analysis,
      })
      .select("id")
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ analysis, photoId: photo.id });
  } catch (err) {
    console.error("Photo analyze error:", err);
    return NextResponse.json({ error: geminiErrorMessage(err) }, { status: 500 });
  }
}
