import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type TopicStat = {
  topic: string;
  attempts: number;
  totalQuestions: number;
  totalCorrect: number;
  accuracy: number; // 0-100
};

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    // Only quizzes that have actually been scored (score is null until the
    // user finishes and submits) count toward the weak-topic breakdown.
    const { data: quizzes, error } = await supabase
      .from("quizzes")
      .select("topic, total, score")
      .eq("user_id", user.id)
      .not("score", "is", null);

    if (error) throw error;

    const byTopic = new Map<string, { attempts: number; totalQuestions: number; totalCorrect: number }>();

    for (const q of quizzes ?? []) {
      const topic = q.topic || "Untitled";
      const total = typeof q.total === "number" ? q.total : 0;
      const score = typeof q.score === "number" ? q.score : 0;
      if (total <= 0) continue;

      const existing = byTopic.get(topic) ?? { attempts: 0, totalQuestions: 0, totalCorrect: 0 };
      existing.attempts += 1;
      existing.totalQuestions += total;
      existing.totalCorrect += score;
      byTopic.set(topic, existing);
    }

    const stats: TopicStat[] = Array.from(byTopic.entries()).map(([topic, s]) => ({
      topic,
      attempts: s.attempts,
      totalQuestions: s.totalQuestions,
      totalCorrect: s.totalCorrect,
      accuracy: s.totalQuestions > 0 ? Math.round((s.totalCorrect / s.totalQuestions) * 100) : 0,
    }));

    // Weakest topics first — lowest accuracy at the top so students see
    // what to focus on immediately.
    stats.sort((a, b) => a.accuracy - b.accuracy);

    return NextResponse.json({ topics: stats });
  } catch (err) {
    console.error("Weak topics fetch error:", err);
    return NextResponse.json({ error: "Couldn't load your topic breakdown." }, { status: 500 });
  }
}
