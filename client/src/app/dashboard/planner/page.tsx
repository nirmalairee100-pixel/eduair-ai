"use client";

import { useState } from "react";
import { CalendarDays, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/client";

type Plan = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

export default function StudyPlannerPage() {
  const [subjects, setSubjects] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("2");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [pastPlans, setPastPlans] = useState<Plan[]>([]);
  const [loadedPast, setLoadedPast] = useState(false);
  const supabase = createClient();

  async function loadPastPlans() {
    if (loadedPast) return;
    const { data } = await supabase
      .from("study_plans")
      .select("id, title, content, created_at")
      .order("created_at", { ascending: false });
    setPastPlans((data as Plan[]) ?? []);
    setLoadedPast(true);
  }

  async function generatePlan() {
    if (!subjects.trim() || loading) return;
    setLoading(true);
    setError(null);
    setContent(null);

    try {
      const res = await fetch("/api/study-plan-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjects, examDate, hoursPerDay }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setContent(data.content);
      setPastPlans((prev) => [
        { id: data.planId, title: data.title, content: data.content, created_at: new Date().toISOString() },
        ...prev,
      ]);
      setLoadedPast(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Study Planner</h1>
      <p className="mt-1 text-slate-500">
        Get a personalized day-by-day plan before your exam.
      </p>

      <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Subjects / topics to cover
          </label>
          <input
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
            placeholder="e.g. Algebra, Chemistry - Chemical Reactions, English Grammar"
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Exam date (optional)
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">
              Hours per day
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        <button
          onClick={generatePlan}
          disabled={loading || !subjects.trim()}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <CalendarDays size={16} />}
          {loading ? "Building your plan…" : "Generate Plan"}
        </button>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>

      {content && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="prose prose-sm max-w-none prose-strong:text-slate-900">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      )}

      <div className="mt-10">
        <button
          onClick={loadPastPlans}
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          {loadedPast ? "Past plans" : "Show past plans"}
        </button>
        {loadedPast && (
          <div className="mt-3 space-y-2">
            {pastPlans.length === 0 && (
              <p className="text-sm text-slate-400">No plans yet.</p>
            )}
            {pastPlans.map((p) => (
              <button
                key={p.id}
                onClick={() => setContent(p.content)}
                className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm hover:bg-slate-50"
              >
                <CalendarDays size={14} className="text-slate-400" />
                <span className="truncate text-slate-700">{p.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
