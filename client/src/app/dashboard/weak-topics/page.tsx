"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingDown, TrendingUp, Minus, Loader2, Sparkles } from "lucide-react";
import { apiFetch } from "@/lib/apiFetch";

type TopicStat = {
  topic: string;
  attempts: number;
  totalQuestions: number;
  totalCorrect: number;
  accuracy: number;
};

function AccuracyIcon({ accuracy }: { accuracy: number }) {
  if (accuracy < 50) return <TrendingDown className="text-red-400" size={16} />;
  if (accuracy < 75) return <Minus className="text-amber-400" size={16} />;
  return <TrendingUp className="text-emerald-400" size={16} />;
}

function barColor(accuracy: number) {
  if (accuracy < 50) return "bg-red-500";
  if (accuracy < 75) return "bg-amber-500";
  return "bg-emerald-500";
}

export default function WeakTopicsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topics, setTopics] = useState<TopicStat[] | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch("/api/weak-topics");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        setTopics(data.topics);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 md:px-8">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-500/80">
        Marking Scheme Engine
      </span>
      <h1 className="mt-1 font-serif text-2xl font-bold text-white md:text-3xl">Weak Topics</h1>
      <p className="mt-1 text-sm text-slate-400">
        Aggregated from your completed quizzes — lowest accuracy topics show first, so you know
        exactly what to revise next.
      </p>

      {loading && (
        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-slate-500">
          <Loader2 className="animate-spin" size={16} /> Crunching your quiz history…
        </div>
      )}

      {error && !loading && (
        <p className="mt-6 rounded-xl border border-red-900/40 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {!loading && !error && topics && topics.length === 0 && (
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-950/40 p-6 text-center">
          <p className="text-sm text-slate-400">
            No completed quizzes yet — finish a few quizzes and your weak topics will show up
            here automatically.
          </p>
          <Link
            href="/dashboard/quiz"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-semibold text-white"
          >
            <Sparkles size={14} /> Take a quiz
          </Link>
        </div>
      )}

      {!loading && !error && topics && topics.length > 0 && (
        <div className="mt-6 space-y-3">
          {topics.map((t) => (
            <div key={t.topic} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AccuracyIcon accuracy={t.accuracy} />
                  <span className="text-sm font-medium text-slate-100">{t.topic}</span>
                </div>
                <span className="font-mono text-xs text-slate-400">
                  {t.totalCorrect}/{t.totalQuestions} · {t.accuracy}%
                </span>
              </div>
              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-900">
                <div
                  className={`h-full rounded-full ${barColor(t.accuracy)}`}
                  style={{ width: `${t.accuracy}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-500">
                {t.attempts} quiz{t.attempts !== 1 ? "zes" : ""} attempted
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
