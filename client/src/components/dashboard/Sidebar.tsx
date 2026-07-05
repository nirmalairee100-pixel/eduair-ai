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

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/chat", label: "AI Chat", icon: MessageSquare },
  { href: "/dashboard/pdf", label: "PDF Summarizer", icon: FileText },
  { href: "/dashboard/quiz", label: "Quiz Generator", icon: Sparkles },
  { href: "/dashboard/notes", label: "Notes Maker", icon: NotebookPen },
  { href: "/dashboard/library", label: "My Library", icon: Library },
  { href: "/dashboard/planner", label: "Study Planner", icon: CalendarDays },
];

export default function Sidebar({ userEmail }: { userEmail: string }) {
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

      <nav className="flex-1 space-y-1 px-3">
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
            {userEmail.charAt(0).toUpperCase()}
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
