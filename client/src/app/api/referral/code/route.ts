import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("referral_code")
      .eq("id", user.id)
      .single();

    if (error) throw error;

    if (profile.referral_code) {
      return NextResponse.json({ code: profile.referral_code });
    }

    // No code yet — generate one, retrying on the rare collision.
    const admin = createAdminClient();
    let code = generateCode();
    for (let attempt = 0; attempt < 5; attempt++) {
      const { error: updateError } = await admin
        .from("profiles")
        .update({ referral_code: code })
        .eq("id", user.id)
        .is("referral_code", null);

      if (!updateError) break;
      code = generateCode();
    }

    return NextResponse.json({ code });
  } catch (err) {
    console.error("Referral code error:", err);
    return NextResponse.json({ error: "Failed to load referral code" }, { status: 500 });
  }
}
