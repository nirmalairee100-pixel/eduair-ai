import type { SupabaseClient } from "@supabase/supabase-js";

const FREE_LIMITS: Record<string, number> = {
  chat: 20,
  "quiz-generate": 5,
  "notes-generate": 5,
  "photo-analyze": 3,
  "pdf-summarize": 10,
  "study-plan-generate": 5,
};

const PRO_LIMITS: Record<string, number> = {
  chat: 200,
  "quiz-generate": 50,
  "notes-generate": 50,
  "photo-analyze": 30,
  "pdf-summarize": 100,
  "study-plan-generate": 50,
};

const DEFAULT_FREE_LIMIT = 10;
const DEFAULT_PRO_LIMIT = 100;

export async function checkRateLimit(
  supabase: SupabaseClient,
  userId: string,
  route: string
): Promise<{ allowed: boolean; remaining: number; limit: number; isPro: boolean }> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("plan, pro_expires_at")
    .eq("id", userId)
    .single();

  if (profileError) {
    console.error("Profile lookup failed for rate limit:", profileError);
  }

  const now = Date.now();
  const expires = profile?.pro_expires_at
    ? new Date(profile.pro_expires_at).getTime()
    : null;
  const isPro =
    profile?.plan === "pro" && (expires === null || expires > now);

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

  // Fail CLOSED – if usage_log is broken, do not allow unlimited use
  if (error) {
    console.error("Rate limit check failed:", error);
    return { allowed: false, remaining: 0, limit, isPro };
  }

  const used = count ?? 0;
  if (used >= limit) {
    return { allowed: false, remaining: 0, limit, isPro };
  }

  await supabase.from("usage_log").insert({ user_id: userId, route });

  return { allowed: true, remaining: limit - used - 1, limit, isPro };
}

// KEEP this export – every API route imports it
export function rateLimitMessage(route: string, isPro: boolean = false): string {
  const limitMap = isPro ? PRO_LIMITS : FREE_LIMITS;
  const defaultLimit = isPro ? DEFAULT_PRO_LIMIT : DEFAULT_FREE_LIMIT;
  const limit = limitMap[route] ?? defaultLimit;

  if (isPro) {
    return `You've hit today's Pro limit of ${limit} for this feature. Please try again tomorrow.`;
  }
  return `You've hit today's limit of ${limit} for this feature on EduAir AI's free tier. Please try again tomorrow, or check out Pro on the pricing page.`;
}

export const RATE_LIMIT_MESSAGE =
  "You've hit today's AI usage limit for EduAir AI's free tier. Please try again tomorrow.";


export async function recordUsage(supabase: SupabaseClient, userId: string, route: string): Promise<void> {
  const { error } = await supabase.from("usage_log").insert({ user_id: userId, route });
  if (error) console.error("Usage logging failed:", error);
}
