"use client";

import { useEffect, useState } from "react";
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
  Menu,
  X,
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
  const [isOpen, setIsOpen] = useState(false);

  // Close the drawer automatically whenever the route changes
  // (tapping a nav link on mobile shouldn't leave the drawer open).
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      {/* MOBILE TOP BAR — hamburger trigger, hidden on desktop */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-14 border-b border-slate-900/60 bg-[#030712]/80 backdrop-blur-xl">
        <div className="flex items-center gap-2.5" onClick={() => router.push("/dashboard")}>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 text-white font-black text-xs shadow-md border border-indigo-500/20">
            E
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            EduAir<span className="text-indigo-400">.ai</span>
          </span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-900/60 hover:text-white transition-colors"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* BACKDROP — only shown on mobile while the drawer is open */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:relative top-0 left-0 z-40 flex h-screen w-72 max-w-[85vw] md:w-64 md:max-w-none shrink-0 flex-col border-r border-slate-900/60 bg-[#030712] md:bg-[#030712]/10 backdrop-blur-xl select-none transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* BRAND SYSTEM EMBLEM — desktop only, mobile has its own top bar */}
        <div className="hidden md:flex items-center gap-2.5 px-6 py-6 cursor-pointer" onClick={() => router.push("/dashboard")}>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 text-white font-black text-xs shadow-md border border-indigo-500/20">
            E
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            EduAir<span className="text-indigo-400">.ai</span>
          </span>
        </div>

        {/* MOBILE DRAWER HEADER — close button */}
        <div className="md:hidden flex items-center justify-between px-4 h-14 border-b border-slate-900/60">
          <span className="text-sm font-bold tracking-tight text-white">
            EduAir<span className="text-indigo-400">.ai</span>
          </span>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-900/60 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

      {/* ACTION INDEX ROUTING ITEMS */}
      <nav className="flex-1 space-y-0.5 px-3 pt-3 overflow-y-auto custom-scrollbar">
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
        <Link
          href="/pricing"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-900 bg-slate-900/30 hover:bg-slate-900/50 hover:border-slate-800 transition-all px-3 py-2.5 text-xs font-semibold text-slate-300 group"
        >
          <Crown size={13} className="text-amber-500 group-hover:scale-105 transition-transform" />
          <span>Elevate Premium Engine</span>
        </Link>
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
    </>
  );
}