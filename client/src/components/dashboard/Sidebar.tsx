"use client";

import { Plus, MessageSquare, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export type Conversation = {
  id: string;
  title: string | null;
};

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  userEmail,
}: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  userEmail: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="p-3">
        <div className="mb-3 flex items-center gap-2 px-2 py-1">
          <span className="text-lg">🚀</span>
          <span className="text-sm font-semibold text-zinc-100">
            EduAir <span className="text-blue-500">AI</span>
          </span>
        </div>

        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 transition-colors hover:bg-zinc-800"
        >
          <Plus size={16} />
          New chat
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-1">
        <p className="px-2 py-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
          Recent
        </p>
        <div className="space-y-0.5">
          {conversations.length === 0 && (
            <p className="px-2 py-2 text-sm text-zinc-600">
              No conversations yet
            </p>
          )}
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`flex w-full items-center gap-2 truncate rounded-lg px-2 py-2 text-left text-sm transition-colors ${
                activeId === c.id
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <MessageSquare size={14} className="shrink-0 opacity-60" />
              <span className="truncate">{c.title || "New conversation"}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="border-t border-zinc-800 p-3">
        <div className="flex items-center gap-2 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <span className="flex-1 truncate text-sm text-zinc-300">
            {userEmail}
          </span>
          <button
            onClick={logout}
            aria-label="Log out"
            className="shrink-0 rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
