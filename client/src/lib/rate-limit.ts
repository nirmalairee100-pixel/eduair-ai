import type { SupabaseClient } from "@supabase/supabase-js";

// Free-tier Gemini quota is shared across every user of the site, so a
// single active user (or a bot) can otherwise burn through the whole
// day's quota. This caps how many AI requests one signed-in user can
// make in a rolling 24h window, counted from the usage_log table.
const DAILY_LIMIT = 40;

export async function checkRateLimit(
  supabase: SupabaseClient,
  userId: string,
  route: string
): Promise<{ allowed: boolean; remaining: number }> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("usage_log")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since);

  // If the usage_log table isn't set up yet or the count query fails,
  // fail open rather than blocking every AI feature on the site.
  if (error) {
    console.error("Rate limit check failed:", error);
    return { allowed: true, remaining: DAILY_LIMIT };
  }

  const used = count ?? 0;
  if (used >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  // Record this request. Not awaited-critical — if it fails we still
  // let the request through, we just won't count it accurately.
  await supabase.from("usage_log").insert({ user_id: userId, route });

  return { allowed: true, remaining: DAILY_LIMIT - used - 1 };
}

export const RATE_LIMIT_MESSAGE =
  "You've hit today's AI usage limit for EduAir AI's free tier. Please try again tomorrow.";
