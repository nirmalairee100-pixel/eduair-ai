"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  MessageSquare,
  FileText,
  Sparkles,
  NotebookPen,
  Library,
  CalendarDays,
  LogOut,
  Crown,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Export the type so DashboardShell can import it safely
export type Conversation = {
  id: string;
  title: string;
};

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/chat", label: "AI Chat", icon: MessageSquare },
  { href: "/dashboard/pdf", label: "PDF Summarizer", icon: FileText },
  { href: "/dashboard/quiz", label: "Quiz Generator", icon: Sparkles },
  { href: "/dashboard/notes", label: "Notes Maker", icon: NotebookPen },
  { href: "/dashboard/library", label: "My Library", icon: Library },
  { href: "/dashboard/planner", label: "Study Planner", icon: CalendarDays },
];

// Made the chat-specific items optional (?) so layout.tsx doesn't crash the build
interface SidebarProps {
  userEmail: string;
  conversations?: Conversation[];
  activeId?: string | null;
  onSelect?: (id: string | null) => void;
  onNewChat?: () => void;
}

export default function Sidebar({
  userEmail,
  conversations = [], // Defaults to an empty list if not provided
  activeId = null,    // Defaults to null if not provided
  onSelect,
  onNewChat,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 text-white">
          🚀
        </div>
        <span className="text-base font-bold text-slate-900">
          EduAir <span className="text-indigo-600">AI</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}

        {/* Displays the chat navigation conditionally if on the chat route */}
        {pathname?.startsWith("/dashboard/chat") && conversations.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Recent Chats
              </span>
              {onNewChat && (
                <button
                  onClick={onNewChat}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  + New
                </button>
              )}
            </div>
            <div className="space-y-1">
              {conversations.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onSelect?.(chat.id)}
                  className={`w-full text-left truncate block rounded-lg px-3 py-2 text-sm transition-colors ${
                    activeId === chat.id
                      ? "bg-slate-100 text-slate-900 font-medium"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {chat.title || "Untitled Chat"}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="px-3 pb-3">
        <button className="flex w-full items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm font-medium text-amber-700">
          <Crown size={16} />
          Upgrade to Pro
        </button>
      </div>

      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-2 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 text-xs font-medium text-white">
            {userEmail?.charAt(0).toUpperCase() || "U"}
          </div>
          <span className="flex-1 truncate text-sm text-slate-700">
            {userEmail}
          </span>
          <button
            onClick={logout}
            aria-label="Log out"
            className="shrink-0 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}