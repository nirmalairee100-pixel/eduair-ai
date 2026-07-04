import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";

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

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, title")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <DashboardShell
      initialConversations={conversations ?? []}
      userEmail={user.email ?? ""}
    />
  );
}
