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
  Camera,
  LogOut,
  Crown,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export type Conversation = {
  id: string;
  title: string;
};

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/chat", label: "AI Chat", icon: MessageSquare },
  { href: "/dashboard/pdf", label: "PDF Summarizer", icon: FileText },
  { href: "/dashboard/photo", label: "Photo Analyzer", icon: Camera },
  { href: "/dashboard/quiz", label: "Quiz Generator", icon: Sparkles },
  { href: "/dashboard/notes", label: "Notes Maker", icon: NotebookPen },
  { href: "/dashboard/library", label: "My Library", icon: Library },
  { href: "/dashboard/planner", label: "Study Planner", icon: CalendarDays },
];

interface SidebarProps {
  userEmail: string;
  conversations?: Conversation[];
  activeId?: string | null;
  onSelect?: (id: string | null) => void;
  onNewChat?: () => void;
}

export default function Sidebar({
  userEmail,
  conversations = [],
  activeId = null,
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
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-900/60 bg-[#030712]/10 backdrop-blur-xl select-none">
      
      {/* BRAND SYSTEM EMBLEM */}
      <div className="flex items-center gap-2.5 px-6 py-6 cursor-pointer" onClick={() => router.push("/dashboard")}>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 text-white font-black text-xs shadow-md border border-indigo-500/20">
          E
        </div>
        <span className="text-sm font-bold tracking-tight text-white">
          EduAir<span className="text-indigo-400">.ai</span>
        </span>
      </div>

      {/* ACTION INDEX ROUTING ITEMS */}
      <nav className="flex-1 space-y-0.5 px-3 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-150 ${
                active
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.05)]"
                  : "text-slate-400 border border-transparent hover:bg-slate-900/30 hover:text-slate-200"
              }`}
            >
              <Icon size={14} className={active ? "text-indigo-400" : "text-slate-500"} />
              <span>{label}</span>
            </Link>
          );
        })}

        {/* DYNAMIC SUBSYSTEM CHAT HISTORY INDEX */}
        {pathname?.startsWith("/dashboard/chat") && conversations.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-900/60">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                Recent Indexes
              </span>
              {onNewChat && (
                <button
                  onClick={onNewChat}
                  className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  [+ New]
                </button>
              )}
            </div>
            <div className="space-y-1">
              {conversations.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onSelect?.(chat.id)}
                  className={`w-full text-left truncate block rounded-lg px-3 py-1.5 text-xs transition-colors ${
                    activeId === chat.id
                      ? "bg-slate-900 text-slate-200 border border-slate-800 font-medium"
                      : "text-slate-500 hover:bg-slate-900/20 hover:text-slate-300"
                  }`}
                >
                  {chat.title || "Untitled context"}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* PRO CONSOLE SUBSCRIPTION MODULE */}
      <div className="px-3 pb-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-900 bg-slate-900/30 hover:bg-slate-900/50 hover:border-slate-800 transition-all px-3 py-2.5 text-xs font-semibold text-slate-300 group">
          <Crown size={13} className="text-amber-500 group-hover:scale-105 transition-transform" />
          <span>Elevate Premium Engine</span>
        </button>
      </div>

      {/* USER ID SESSION GATEWAY ENTRY */}
      <div className="border-t border-slate-900/60 p-3 bg-slate-950/20">
        <div className="flex items-center gap-2.5 rounded-xl px-2 py-1.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-slate-400 uppercase">
            {userEmail?.charAt(0) || "U"}
          </div>
          <span className="flex-1 truncate text-xs text-slate-400 font-medium">
            {userEmail}
          </span>
          <button
            onClick={logout}
            aria-label="Terminate Session"
            className="shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-900 hover:text-red-400"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}