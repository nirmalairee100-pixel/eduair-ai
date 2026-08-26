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
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const [
      { count: totalUsers },
      { count: aiCallsLast24h },
      { data: topRoutes },
    ] = await Promise.all([
      admin.from("profiles").select("id", { count: "exact", head: true }),
      admin
        .from("usage_log")
        .select("id", { count: "exact", head: true })
        .gte("created_at", since),
      admin
        .from("usage_log")
        .select("route")
        .gte("created_at", since),
    ]);

    const routeCounts: Record<string, number> = {};
    for (const row of topRoutes ?? []) {
      routeCounts[row.route] = (routeCounts[row.route] ?? 0) + 1;
    }
    const topRoutesSorted = Object.entries(routeCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([route, count]) => ({ route, count }));

    return NextResponse.json({
      totalUsers: totalUsers ?? 0,
      aiCallsLast24h: aiCallsLast24h ?? 0,
      topRoutes: topRoutesSorted,
    });
  } catch (err) {
    console.error("Admin usage error:", err);
    return NextResponse.json({ error: "Failed to load usage stats" }, { status: 500 });
  }
}
