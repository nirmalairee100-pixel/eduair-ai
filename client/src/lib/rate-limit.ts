import type { SupabaseClient } from "@supabase/supabase-js";

// Free-tier daily limits per feature, matching what's advertised on the
// /pricing page.
const FREE_DAILY_LIMITS: Record<string, number> = {
  chat: 20,
  "quiz-generate": 5,
  "notes-generate": 5,
  "photo-analyze": 3,
  "pdf-summarize": 10,
  "study-plan-generate": 5,
  "model-questions-generate": 5,
};

// Pro limits are "generous" rather than truly unlimited, so one abusive
// account can't blow through the Gemini free-tier quota and take the
// whole site down for everyone else. Update these (and /pricing's copy)
// together if either changes.
const PRO_DAILY_LIMITS: Record<string, number> = {
  chat: 200,
  "quiz-generate": 50,
  "notes-generate": 50,
  "photo-analyze": 40,
  "pdf-summarize": 60,
  "study-plan-generate": 40,
  "model-questions-generate": 40,
};

const DEFAULT_FREE_LIMIT = 10;
const DEFAULT_PRO_LIMIT = 60;

async function isProUser(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .select("plan, pro_expires_at")
    .eq("id", userId)
    .single();

  // If we can't confirm Pro status, treat as free — never grant elevated
  // limits on a failed/uncertain lookup.
  if (error || !data) return false;
  if (data.plan !== "pro") return false;
  if (!data.pro_expires_at) return false;

  return new Date(data.pro_expires_at).getTime() > Date.now();
}

/**
 * Read-only check: has this user already hit today's limit for this route?
 * Does NOT record usage — call recordUsage() after the AI call actually
 * succeeds, so failed/errored requests don't burn the user's quota.
 */
export async function checkRateLimit(
  supabase: SupabaseClient,
  userId: string,
  route: string
): Promise<{ allowed: boolean; remaining: number; limit: number; isPro: boolean }> {
  const isPro = await isProUser(supabase, userId);
  const limit = isPro
    ? PRO_DAILY_LIMITS[route] ?? DEFAULT_PRO_LIMIT
    : FREE_DAILY_LIMITS[route] ?? DEFAULT_FREE_LIMIT;

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("usage_log")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("route", route)
    .gte("created_at", since);

  // FAIL CLOSED: if we can't verify usage, deny rather than let an
  // unmetered request through to a paid AI API. This is the opposite of
  // the old behavior, on purpose - a false "limit reached" costs you
  // nothing; a broken query letting unlimited requests through costs
  // real Gemini quota / money.
  if (error) {
    console.error("Rate limit check failed (failing closed):", error);
    return { allowed: false, remaining: 0, limit, isPro };
  }

  const used = count ?? 0;
  if (used >= limit) {
    return { allowed: false, remaining: 0, limit, isPro };
  }

  return { allowed: true, remaining: limit - used, limit, isPro };
}

/**
 * Call this AFTER a request has successfully produced an AI response.
 * Keeping this separate from checkRateLimit means a failed Gemini call
 * (network error, bad output, etc.) doesn't cost the user part of their
 * daily quota.
 */
export async function recordUsage(
  supabase: SupabaseClient,
  userId: string,
  route: string
): Promise<void> {
  const { error } = await supabase.from("usage_log").insert({ user_id: userId, route });
  if (error) {
    console.error("Failed to record usage:", error);
  }
}

export function rateLimitMessage(route: string, isPro = false): string {
  const limit = isPro
    ? PRO_DAILY_LIMITS[route] ?? DEFAULT_PRO_LIMIT
    : FREE_DAILY_LIMITS[route] ?? DEFAULT_FREE_LIMIT;

  if (isPro) {
    return `You've hit today's Pro limit of ${limit} for this feature. This resets in 24 hours - message us if you consistently need more.`;
  }
  return `You've hit today's limit of ${limit} for this feature on EduAir AI's free tier. Upgrade to Pro on the pricing page for higher limits, or try again tomorrow.`;
}

// Kept for any callers that haven't switched to the per-route message yet.
export const RATE_LIMIT_MESSAGE =
  "You've hit today's AI usage limit for EduAir AI's free tier. Please try again tomorrow.";
