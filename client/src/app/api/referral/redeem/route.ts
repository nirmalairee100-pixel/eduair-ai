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

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const { code } = await request.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Referral code is required" }, { status: 400 });
    }

    const admin = createAdminClient();

    const { data: me, error: meError } = await admin
      .from("profiles")
      .select("id, referred_by, plan, pro_expires_at")
      .eq("id", user.id)
      .single();
    if (meError) throw meError;

    if (me.referred_by) {
      return NextResponse.json({ error: "You've already redeemed a referral code" }, { status: 400 });
    }

    const { data: referrer, error: referrerError } = await admin
      .from("profiles")
      .select("id, plan, pro_expires_at")
      .eq("referral_code", code.toUpperCase())
      .single();

    if (referrerError || !referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    if (referrer.id === user.id) {
      return NextResponse.json({ error: "You can't refer yourself" }, { status: 400 });
    }

    // Log the redemption first — the unique constraint on referred_id
    // blocks a double-redeem race condition even under concurrent requests.
    const { error: redemptionError } = await admin.from("referral_redemptions").insert({
      referrer_id: referrer.id,
      referred_id: user.id,
    });

    if (redemptionError) {
      return NextResponse.json({ error: "You've already redeemed a referral code" }, { status: 400 });
    }

    await Promise.all([
      admin
        .from("profiles")
        .update({
          referred_by: referrer.id,
          plan: "pro",
          pro_expires_at: extendedExpiry(me.pro_expires_at),
        })
        .eq("id", user.id),
      admin
        .from("profiles")
        .update({
          plan: "pro",
          pro_expires_at: extendedExpiry(referrer.pro_expires_at),
        })
        .eq("id", referrer.id),
    ]);

    return NextResponse.json({ success: true, bonusDays: BONUS_DAYS });
  } catch (err) {
    console.error("Referral redeem error:", err);
    return NextResponse.json({ error: "Failed to redeem referral code" }, { status: 500 });
  }
}
