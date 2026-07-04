"use client";

import { useState } from "react";
import Sidebar, { type Conversation } from "@/components/dashboard/Sidebar";
import ChatInterface from "@/components/dashboard/ChatInterface";

export default function DashboardShell({
  initialConversations,
  userEmail,
}: {
  initialConversations: Conversation[];
  userEmail: string;
}) {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState<string | null>(null);

  function handleConversationCreated(id: string, title: string) {
    setConversations((prev) => [{ id, title }, ...prev]);
    setActiveId(id);
  }

  return (
    <div className="flex">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onNewChat={() => setActiveId(null)}
        userEmail={userEmail}
      />
      <ChatInterface
        key={activeId ?? "new"}
        conversationId={activeId}
        onConversationCreated={handleConversationCreated}
      />
    </div>
  );
}
