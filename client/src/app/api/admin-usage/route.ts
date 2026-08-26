import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Simple email-based admin gate. Set ADMIN_EMAIL in Vercel's env vars
// (comma-separate for multiple admins, e.g. "you@gmail.com,other@x.com").
// There's no is_admin column on profiles yet — this is the fast version;
// swap to a proper role column later if more admins are ever added.
function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // NOTE: uses the service role implicitly via RLS bypass only if your
    // usage_log/profiles policies allow admin reads. If this 500s with a
    // permissions error, you'll need an RLS policy or service-role client
    // for admin-only aggregate reads.
    const [usage24h, usage7d, totalUsers, modelSets] = await Promise.all([
      supabase.from("usage_log").select("route", { count: "exact" }).gte("created_at", since24h),
      supabase.from("usage_log").select("route").gte("created_at", since7d),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("model_question_sets").select("class_level, subject").gte("created_at", since7d),
    ]);

    if (usage24h.error) throw usage24h.error;
    if (usage7d.error) throw usage7d.error;
    if (modelSets.error) throw modelSets.error;

    const routeCounts7d: Record<string, number> = {};
    for (const row of usage7d.data ?? []) {
      routeCounts7d[row.route] = (routeCounts7d[row.route] ?? 0) + 1;
    }

    const subjectCounts7d: Record<string, number> = {};
    for (const row of modelSets.data ?? []) {
      const key = `Class ${row.class_level} · ${row.subject}`;
      subjectCounts7d[key] = (subjectCounts7d[key] ?? 0) + 1;
    }

    return NextResponse.json({
      requests24h: usage24h.count ?? 0,
      requests7d: usage7d.data?.length ?? 0,
      totalUsers: totalUsers.count ?? 0,
      routeCounts7d,
      topModelQuestionSubjects: Object.entries(subjectCounts7d)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
    });
  } catch (err) {
    console.error("Admin usage fetch error:", err);
    return NextResponse.json({ error: "Couldn't load usage stats." }, { status: 500 });
  }
}
