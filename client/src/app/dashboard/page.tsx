import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChatInterface from "@/components/dashboard/ChatInterface";
import LogoutButton from "@/components/dashboard/LogoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-suspenders: middleware already redirects signed-out users,
  // but double-checking here means this page is safe even if middleware
  // config ever changes.
  if (!user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-black px-6 py-10 text-white">
      <div className="mb-8 flex w-full max-w-3xl items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            🚀 EduMind <span className="text-blue-500">AI</span>
          </h1>
          <p className="text-sm text-zinc-500">
            Signed in as {user.email}
          </p>
        </div>
        <LogoutButton />
      </div>

      <ChatInterface />
    </main>
  );
}
