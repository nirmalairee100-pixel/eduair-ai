"use client";

import { useEffect, useState } from "react";
import { Loader2, Users, Activity, BarChart3 } from "lucide-react";
import { apiFetch } from "@/lib/apiFetch";

type UsageData = {
  requests24h: number;
  requests7d: number;
  totalUsers: number;
  routeCounts7d: Record<string, number>;
  topModelQuestionSubjects: [string, number][];
};

export default function AdminUsagePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<UsageData | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch("/api/admin-usage");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Not authorized");
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-slate-500" size={20} />
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <p className="rounded-xl border border-red-900/40 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error || "Couldn't load usage stats."}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 md:px-8">
      <h1 className="font-serif text-2xl font-bold text-white">Usage Overview</h1>
      <p className="mt-1 text-sm text-slate-400">Internal analytics — not visible to regular users.</p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <Activity className="text-red-400" size={16} />
          <p className="mt-2 text-2xl font-bold text-white">{data.requests24h}</p>
          <p className="text-xs text-slate-500">AI calls, 24h</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <BarChart3 className="text-red-400" size={16} />
          <p className="mt-2 text-2xl font-bold text-white">{data.requests7d}</p>
          <p className="text-xs text-slate-500">AI calls, 7d</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <Users className="text-red-400" size={16} />
          <p className="mt-2 text-2xl font-bold text-white">{data.totalUsers}</p>
          <p className="text-xs text-slate-500">Total users</p>
        </div>
      </div>

      <h2 className="mt-8 font-serif text-lg font-semibold text-white">Requests by feature (7d)</h2>
      <div className="mt-3 space-y-2">
        {Object.entries(data.routeCounts7d)
          .sort((a, b) => b[1] - a[1])
          .map(([route, count]) => (
            <div key={route} className="flex items-center justify-between text-sm">
              <span className="text-slate-300">{route}</span>
              <span className="font-mono text-slate-500">{count}</span>
            </div>
          ))}
        {Object.keys(data.routeCounts7d).length === 0 && (
          <p className="text-sm text-slate-500">No usage logged in the last 7 days.</p>
        )}
      </div>

      <h2 className="mt-8 font-serif text-lg font-semibold text-white">
        Top Model Question sets (7d)
      </h2>
      <div className="mt-3 space-y-2">
        {data.topModelQuestionSubjects.map(([label, count]) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className="text-slate-300">{label}</span>
            <span className="font-mono text-slate-500">{count}</span>
          </div>
        ))}
        {data.topModelQuestionSubjects.length === 0 && (
          <p className="text-sm text-slate-500">No model question sets generated in the last 7 days.</p>
        )}
      </div>
    </main>
  );
}
