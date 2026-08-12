import LoginButton from "@/components/landing/LoginButton";
import { Star, MessageSquare, FileText, Sparkles, NotebookPen } from "lucide-react";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-20 pt-36 lg:grid-cols-2 lg:pt-44">
      <div>
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            🇳🇵 Made for Nepal
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            Based on Nepali School Syllabus
          </span>
        </div>

        <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl">
          Study{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
            Smarter.
          </span>
          <br />
          Achieve{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
            More.
          </span>
          <br />
          With EduAir AI
        </h1>

        <p className="mt-6 max-w-lg text-lg text-slate-600">
          Your all-in-one AI learning assistant. Chat with AI, generate
          quizzes, summarize PDFs, create notes, and understand your Nepali
          school syllabus better.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <LoginButton />
          <a
            href="#features"
            className="text-sm font-semibold text-slate-700 hover:text-indigo-600"
          >
            Explore Features →
          </a>
        </div>

        <div className="mt-10 flex items-center gap-3">
          <div className="flex -space-x-2">
            {["bg-indigo-400", "bg-blue-400", "bg-violet-400", "bg-cyan-400", "bg-indigo-300"].map(
              (c, i) => (
                <div
                  key={i}
                  className={`h-8 w-8 rounded-full border-2 border-white ${c}`}
                />
              )
            )}
          </div>
          <div>
            <div className="flex gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Trusted by students across Nepal — 10,000+ learners and growing
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-900">
              🚀 EduAir AI
            </span>
            <div className="h-7 w-7 rounded-full bg-indigo-100" />
          </div>
          <p className="mb-1 text-base font-semibold text-slate-900">
            Good morning, Sushant! 👋
          </p>
          <p className="mb-4 text-xs text-slate-500">
            What do you want to learn today?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: MessageSquare, label: "AI Chat Tutor", color: "text-indigo-600 bg-indigo-50" },
              { icon: FileText, label: "Summarize PDF", color: "text-blue-600 bg-blue-50" },
              { icon: Sparkles, label: "Quiz Generator", color: "text-violet-600 bg-violet-50" },
              { icon: NotebookPen, label: "Notes Maker", color: "text-cyan-600 bg-cyan-50" },
            ].map(({ icon: Icon, label, color }) => (
              <div
                key={label}
                className="rounded-xl border border-slate-100 p-3 text-left"
              >
                <div className={`mb-2 flex h-7 w-7 items-center justify-center rounded-lg ${color}`}>
                  <Icon size={14} />
                </div>
                <p className="text-xs font-medium text-slate-700">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 p-3">
            <p className="mb-1 text-xs font-medium text-slate-600">
              Continue Learning
            </p>
            <p className="mb-2 text-xs text-slate-400">
              Chemical Reactions and Equations
            </p>
            <div className="h-1.5 w-full rounded-full bg-slate-200">
              <div className="h-1.5 w-2/3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
