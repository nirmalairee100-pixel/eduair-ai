import { createClient } from "@/lib/supabase/server";
import ChatPageClient from "@/components/dashboard/ChatPageClient";

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, title")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return <ChatPageClient initialConversations={conversations ?? []} />;
}
