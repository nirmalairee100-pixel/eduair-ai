import type { SupabaseClient } from "@supabase/supabase-js";

// Free-tier daily limits per feature, matching what's advertised on the
// /pricing page. Pro (unlimited quizzes/notes, bigger PDFs, unlimited
// photo analyzer) isn't purchasable yet, so everyone is on these caps
// for now. Update this map (and /pricing) together if either changes.
const DAILY_LIMITS: Record<string, number> = {
  chat: 20,
  "quiz-generate": 5,
  "notes-generate": 5,
  "photo-analyze": 3,
  "pdf-summarize": 10,
  // Not listed under the Free tier on /pricing (it's a Pro-only line
  // item there), but Pro isn't sellable yet - keep it usable with a
  // modest cap rather than blocking it outright.
  "study-plan-generate": 5,
};

const DEFAULT_LIMIT = 10;

export async function checkRateLimit(
  supabase: SupabaseClient,
  userId: string,
  route: string
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const limit = DAILY_LIMITS[route] ?? DEFAULT_LIMIT;
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("usage_log")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("route", route)
    .gte("created_at", since);

  // If the usage_log table isn't set up yet or the count query fails,
  // fail open rather than blocking every AI feature on the site.
  if (error) {
    console.error("Rate limit check failed:", error);
    return { allowed: true, remaining: limit, limit };
  }

  const used = count ?? 0;
  if (used >= limit) {
    return { allowed: false, remaining: 0, limit };
  }

  // Record this request. Not awaited-critical — if it fails we still
  // let the request through, we just won't count it accurately.
  await supabase.from("usage_log").insert({ user_id: userId, route });

  return { allowed: true, remaining: limit - used - 1, limit };
}

export function rateLimitMessage(route: string): string {
  const limit = DAILY_LIMITS[route] ?? DEFAULT_LIMIT;
  return `You've hit today's limit of ${limit} for this feature on EduAir AI's free tier. Please try again tomorrow, or check out Pro on the pricing page.`;
}

// Kept for any callers that haven't switched to the per-route message yet.
export const RATE_LIMIT_MESSAGE =
  "You've hit today's AI usage limit for EduAir AI's free tier. Please try again tomorrow.";
