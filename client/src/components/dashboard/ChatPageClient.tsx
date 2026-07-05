"use client";

import { useState } from "react";
import { Plus, MessageSquare } from "lucide-react";
import ChatInterface from "@/components/dashboard/ChatInterface";

export type Conversation = {
  id: string;
  title: string | null;
};

export default function ChatPageClient({
  initialConversations,
}: {
  initialConversations: Conversation[];
}) {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState<string | null>(null);

  function handleConversationCreated(id: string, title: string) {
    setConversations((prev) => [{ id, title }, ...prev]);
    setActiveId(id);
  }

  return (
    <div className="flex h-screen">
      <div className="w-56 shrink-0 overflow-y-auto border-r border-slate-200 bg-slate-50 p-3">
        <button
          onClick={() => setActiveId(null)}
          className="mb-3 flex w-full items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          <Plus size={15} />
          New chat
        </button>

        <p className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-slate-400">
          Recent
        </p>
        <div className="space-y-0.5">
          {conversations.length === 0 && (
            <p className="px-2 py-2 text-sm text-slate-400">
              No conversations yet
            </p>
          )}
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`flex w-full items-center gap-2 truncate rounded-lg px-2 py-2 text-left text-sm transition-colors ${
                activeId === c.id
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <MessageSquare size={13} className="shrink-0 opacity-60" />
              <span className="truncate">{c.title || "New conversation"}</span>
            </button>
          ))}
        </div>
      </div>

      <ChatInterface
        key={activeId ?? "new"}
        conversationId={activeId}
        onConversationCreated={handleConversationCreated}
      />
    </div>
  );
}
