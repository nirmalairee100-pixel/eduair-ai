import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BONUS_DAYS = 7;

function extendedExpiry(currentExpiry: string | null): string {
  const base =
    currentExpiry && new Date(currentExpiry).getTime() > Date.now()
      ? new Date(currentExpiry)
      : new Date();
  base.setDate(base.getDate() + BONUS_DAYS);
  return base.toISOString();
}

// Attempts to auto-redeem a referral code right after a brand-new (or
// existing) session is created. Never throws — a bad/missing code should
// never block someone from logging in.
async function tryAutoRedeemReferral(userId: string, code: string) {
  try {
    const admin = createAdminClient();

    const { data: me } = await admin
      .from("profiles")
      .select("id, referred_by, pro_expires_at")
      .eq("id", userId)
      .single();

    if (!me || me.referred_by) return; // already redeemed once, skip silently

    const { data: referrer } = await admin
      .from("profiles")
      .select("id, pro_expires_at")
      .eq("referral_code", code.toUpperCase())
      .single();

    if (!referrer || referrer.id === userId) return; // invalid code or self-referral

    const { error: redemptionError } = await admin.from("referral_redemptions").insert({
      referrer_id: referrer.id,
      referred_id: userId,
    });
    if (redemptionError) return; // already redeemed (race/dup), skip silently

    await Promise.all([
      admin
        .from("profiles")
        .update({
          referred_by: referrer.id,
          plan: "pro",
          pro_expires_at: extendedExpiry(me.pro_expires_at),
        })
        .eq("id", userId),
      admin
        .from("profiles")
        .update({
          plan: "pro",
          pro_expires_at: extendedExpiry(referrer.pro_expires_at),
        })
        .eq("id", referrer.id),
    ]);
  } catch (err) {
    console.error("Auto-redeem referral failed (non-blocking):", err);
  }
}

// This route is hit by Supabase after a user finishes signing in with Google.
// Without it, LoginButton's redirectTo would 404 and the login would silently fail.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const ref = searchParams.get("ref");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (ref) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          await tryAutoRedeemReferral(user.id, ref);
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong (denied permission, expired code, etc).
  return NextResponse.redirect(`${origin}/?error=auth`);
}
