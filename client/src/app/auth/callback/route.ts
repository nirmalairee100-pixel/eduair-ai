import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// This route is hit by Supabase after a user finishes signing in with Google.
// Without it, LoginButton's redirectTo would 404 and the login would silently fail.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong (denied permission, expired code, etc).
  return NextResponse.redirect(`${origin}/?error=auth`);
}
