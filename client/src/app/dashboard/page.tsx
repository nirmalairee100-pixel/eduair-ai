import Link from "next/link";
import {
  MessageSquare,
  FileText,
  Sparkles,
  NotebookPen,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const QUICK_ACTIONS = [
  {
    href: "/dashboard/chat",
    icon: MessageSquare,
    label: "AI Chat Tutor",
    desc: "Ask anything, get real explanations",
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    href: "/dashboard/pdf",
    icon: FileText,
    label: "Summarize PDF",
    desc: "Upload notes, get the key points",
    color: "text-blue-600 bg-blue-50",
  },
  {
    href: "/dashboard/quiz",
    icon: Sparkles,
    label: "Quiz Generator",
    desc: "Test yourself on any topic",
    color: "text-violet-600 bg-violet-50",
  },
  {
    href: "/dashboard/notes",
    icon: NotebookPen,
    label: "Notes Maker",
    desc: "Turn a topic into study notes",
    color: "text-cyan-600 bg-cyan-50",
  },
];

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardHome() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ✅ FIX: Protect dashboard if not logged in
  if (!user) {
    redirect("/"); // or "/login" if you have it
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const firstName =
    profile?.full_name?.split(" ")[0] ||
    user.email?.split("@")[0] ||
    "there";

  const { data: recentConvos } = await supabase
    .from("conversations")
    .select("id, title, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <main className="mx-auto max-w-5xl px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900">
        {greeting()}, {firstName}! 👋
      </h1>

      <p className="mt-1 text-slate-500">
        What do you want to learn today?
      </p>

      {/* QUICK ACTIONS */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_ACTIONS.map(({ href, icon: Icon, label, desc, color }) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md cursor-pointer"
          >
            <div
              className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${color}`}
            >
              <Icon size={18} />
            </div>
            <p className="font-semibold text-slate-900">{label}</p>
            <p className="mt-1 text-sm text-slate-500">{desc}</p>
          </Link>
        ))}
      </div>

      {/* CONTINUE LEARNING */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">
            Continue Learning
          </h2>

          <Link
            href="/dashboard/chat"
            className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {recentConvos && recentConvos.length > 0 ? (
          <div className="space-y-2">
            {recentConvos.map((c) => (
              <Link
                key={c.id}
                href="/dashboard/chat"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-slate-50"
              >
                <MessageSquare size={16} className="text-slate-400" />
                <span className="truncate text-slate-700">
                  {c.title || "Untitled conversation"}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            No conversations yet — start one from AI Chat!
          </p>
        )}
      </div>
    </main>
  );
}