import type { SupabaseClient } from "@supabase/supabase-js";

// Free-tier daily limits per feature, matching what's advertised on the
// /pricing page.
const FREE_LIMITS: Record<string, number> = {
  chat: 20,
  "quiz-generate": 5,
  "notes-generate": 5,
  "photo-analyze": 3,
  "pdf-summarize": 10,
  "study-plan-generate": 5,
  "model-questions-generate": 5,
};

// Pro-tier daily limits. Bump these as you like — these are just
// generous multiples of the free tier, still capped so the free
// Gemini quota can't get nuked by one user.
const PRO_LIMITS: Record<string, number> = {
  chat: 200,
  "quiz-generate": 50,
  "notes-generate": 50,
  "photo-analyze": 30,
  "pdf-summarize": 100,
  "study-plan-generate": 50,
  "model-questions-generate": 50,
};

const DEFAULT_FREE_LIMIT = 10;
const DEFAULT_PRO_LIMIT = 100;

export async function checkRateLimit(
  supabase: SupabaseClient,
  userId: string,
  route: string
): Promise<{ allowed: boolean; remaining: number; limit: number; isPro: boolean }> {
  // Look up plan status. Fail closed to "free" if this errors -
  // never silently give someone Pro limits on a lookup failure.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_pro")
    .eq("id", userId)
    .single();

  if (profileError) {
    console.error("Profile lookup failed for rate limit check:", profileError);
  }

  const isPro = profile?.is_pro === true;
  const limitMap = isPro ? PRO_LIMITS : FREE_LIMITS;
  const defaultLimit = isPro ? DEFAULT_PRO_LIMIT : DEFAULT_FREE_LIMIT;
  const limit = limitMap[route] ?? defaultLimit;

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
    return { allowed: true, remaining: limit, limit, isPro };
  }

  const used = count ?? 0;
  if (used >= limit) {
    return { allowed: false, remaining: 0, limit, isPro };
  }

  // Record this request. Not awaited-critical — if it fails we still
  // let the request through, we just won't count it accurately.
  await supabase.from("usage_log").insert({ user_id: userId, route });

  return { allowed: true, remaining: limit - used - 1, limit, isPro };
}

export function rateLimitMessage(route: string, isPro: boolean = false): string {
  const limitMap = isPro ? PRO_LIMITS : FREE_LIMITS;
  const defaultLimit = isPro ? DEFAULT_PRO_LIMIT : DEFAULT_FREE_LIMIT;
  const limit = limitMap[route] ?? defaultLimit;

  if (isPro) {
    return `You've hit today's Pro limit of ${limit} for this feature. Please try again tomorrow.`;
  }
  return `You've hit today's limit of ${limit} for this feature on EduAir AI's free tier. Please try again tomorrow, or check out Pro on the pricing page.`;
}

// Kept for any callers that haven't switched to the per-route message yet.
export const RATE_LIMIT_MESSAGE =
  "You've hit today's AI usage limit for EduAir AI's free tier. Please try again tomorrow.";
