"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginButton() {
  const login = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <button
      onClick={login}
      className="rounded-lg bg-black px-5 py-2 text-white transition hover:bg-gray-800"
    >
      Continue with Google
    </button>
  );
}