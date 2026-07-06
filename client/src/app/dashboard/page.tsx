import Link from "next/link";
import {
  MessageSquare,
  FileText,
  Sparkles,
  NotebookPen,
  ArrowRight,
  Clock,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const QUICK_ACTIONS = [
  {
    href: "/dashboard/chat",
    icon: MessageSquare,
    label: "AI Chat Tutor",
    desc: "Ask anything, get real explanations based on NEB criteria",
  },
  {
    href: "/dashboard/pdf",
    icon: FileText,
    label: "Summarize PDF",
    desc: "Upload local textbooks & distill chapter notes",
  },
  {
    href: "/dashboard/quiz",
    icon: Sparkles,
    label: "Quiz Generator",
    desc: "Construct mock evaluation papers instantly",
  },
  {
    href: "/dashboard/notes",
    icon: NotebookPen,
    label: "Notes Maker",
    desc: "Convert loose topics into study matrix cards",
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

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const firstName =
    profile?.full_name?.split(" ")[0] ||
    user.email?.split("@")[0] ||
    "Explorer";

  const { data: recentConvos } = await supabase
    .from("conversations")
    .select("id, title, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 font-sans antialiased selection:bg-indigo-500/30 relative overflow-hidden pb-16">
      
      {/* STEALTH MATRIX BACKGROUND GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_0.8px,transparent_0.8px),linear-gradient(to_bottom,#0f172a_0.8px,transparent_0.8px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-30" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-indigo-500/[0.02] rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-8 pt-12">
        
        {/* HEADER AREA */}
        <header className="border-b border-slate-900 pb-6 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{greeting()}, {firstName}.</span>
            </h1>
            <p className="mt-1 text-xs text-slate-500 font-mono uppercase tracking-wider">
              System Console // Active Learning Session
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-center px-3 py-1.5 bg-slate-900/40 border border-slate-900 rounded-xl font-mono text-[10px] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span>EduAir Protocol Active</span>
          </div>
        </header>

        {/* CORE QUICK ACTION CARDS */}
        <section className="mb-10">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-4">// System Drivers</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_ACTIONS.map(({ href, icon: Icon, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="group relative rounded-2xl border border-slate-900 bg-slate-900/20 p-5 transition-all duration-200 hover:border-slate-800 hover:bg-slate-900/40 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Uniform Monochromatic Stealth Icon */}
                  <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-indigo-400 shadow-sm group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all">
                    <Icon size={15} />
                  </div>
                  <p className="font-semibold text-slate-200 text-sm tracking-tight group-hover:text-white transition-colors">{label}</p>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-normal">{desc}</p>
                </div>
                <div className="mt-5 flex items-center justify-end text-slate-600 group-hover:text-indigo-400 transition-colors">
                  <ArrowRight size={13} className="translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* HISTORICAL WORKFLOW LIST */}
        <section className="rounded-2xl border border-slate-900 bg-slate-900/10 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={13} className="text-slate-600" />
              <h2 className="font-bold text-xs tracking-wider text-slate-400 uppercase font-mono">
                // Recent Context Indexes
              </h2>
            </div>

            <Link
              href="/dashboard/chat"
              className="flex items-center gap-1 text-xs font-mono text-slate-500 hover:text-indigo-400 transition-colors"
            >
              <span>[ index list ]</span>
            </Link>
          </div>

          {recentConvos && recentConvos.length > 0 ? (
            <div className="space-y-1.5">
              {recentConvos.map((c) => (
                <Link
                  key={c.id}
                  href={`/dashboard/chat?id=${c.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-900/30 bg-slate-950/40 px-4 py-3 text-xs transition-all hover:border-slate-800 hover:bg-slate-900/20 group"
                >
                  <div className="flex items-center gap-3 truncate max-w-[80%]">
                    <MessageSquare size={13} className="text-slate-600 group-hover:text-indigo-400 shrink-0 transition-colors" />
                    <span className="truncate text-slate-400 group-hover:text-slate-200 transition-colors">
                      {c.title || "Untitled context session"}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 shrink-0">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Online'}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-slate-900 rounded-xl bg-slate-950/20">
              <p className="text-xs text-slate-600 font-mono">
                No indexed execution traces found.
              </p>
            </div>
          )}
        </section>

        {/* FOOTER CODES */}
        <div className="mt-12 text-center border-t border-slate-900/40 pt-6">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            EduAir Matrix v1.0 // Engineered by Nirmal Airee
          </p>
        </div>

      </div>
    </main>
  );
}