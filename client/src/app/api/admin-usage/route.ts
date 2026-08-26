import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail || user.email !== adminEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const admin = createAdminClient();

    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
      { count: totalUsers },
      { count: requests24h },
      { data: routes7d },
      { data: modelQuestionSets7d },
    ] = await Promise.all([
      admin.from("profiles").select("id", { count: "exact", head: true }),
      admin
        .from("usage_log")
        .select("id", { count: "exact", head: true })
        .gte("created_at", since24h),
      admin.from("usage_log").select("route").gte("created_at", since7d),
      admin
        .from("model_question_sets")
        .select("subject")
        .gte("created_at", since7d),
    ]);

    const requests7d = routes7d?.length ?? 0;

    const routeCounts7d: Record<string, number> = {};
    for (const row of routes7d ?? []) {
      routeCounts7d[row.route] = (routeCounts7d[row.route] ?? 0) + 1;
    }

    const subjectCounts: Record<string, number> = {};
    for (const row of modelQuestionSets7d ?? []) {
      if (row.subject) {
        subjectCounts[row.subject] = (subjectCounts[row.subject] ?? 0) + 1;
      }
    }
    const topModelQuestionSubjects: [string, number][] = Object.entries(subjectCounts).sort(
      (a, b) => b[1] - a[1]
    );

    return NextResponse.json({
      requests24h: requests24h ?? 0,
      requests7d,
      totalUsers: totalUsers ?? 0,
      routeCounts7d,
      topModelQuestionSubjects,
    });
  } catch (err) {
    console.error("Admin usage error:", err);
    return NextResponse.json({ error: "Failed to load usage stats" }, { status: 500 });
  }
}
