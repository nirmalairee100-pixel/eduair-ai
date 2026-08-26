"use client";

import { useState, useMemo } from "react";
import { Sparkles, Loader2, FileCheck2, RotateCcw } from "lucide-react";

type MQQuestion = { number: string; text: string; marks: number; options?: string[] };
type MQSection = { group: string; instructions: string; questions: MQQuestion[] };
type MQResult = {
  setId: string;
  classLevel: string;
  faculty: string | null;
  subject: string;
  fullMarks: number;
  passMarks?: number;
  timeAllowed?: string;
  sections: MQSection[];
};

const SUBJECTS: Record<string, string[]> = {
  "8": [
    "Nepali",
    "English",
    "Mathematics",
    "Science",
    "Social Studies",
    "Health, Population and Environment",
    "Optional Mathematics",
    "Computer Science",
  ],
  "10": [
    "Nepali",
    "English",
    "Mathematics",
    "Science",
    "Social Studies",
    "Health, Population and Environment",
    "Optional Mathematics",
    "Computer Science",
    "Account",
  ],
  "12-Science": ["Physics", "Chemistry", "Biology", "Mathematics", "English", "Nepali", "Computer Science"],
  "12-Management": [
    "Accountancy",
    "Business Studies",
    "Economics",
    "English",
    "Nepali",
    "Marketing and Salesmanship",
    "Computer Science",
  ],
  "12-Humanities": [
    "Sociology",
    "Psychology",
    "Economics",
    "English",
    "Nepali",
    "Political Science",
    "History",
  ],
};

export default function ModelQuestionsPage() {
  const [classLevel, setClassLevel] = useState<"8" | "10" | "12">("10");
  const [faculty, setFaculty] = useState<"Science" | "Management" | "Humanities">("Science");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MQResult | null>(null);

  const subjectKey = classLevel === "12" ? `12-${faculty}` : classLevel;
  const subjects = useMemo(() => SUBJECTS[subjectKey] ?? [], [subjectKey]);

  async function generate() {
    if (!subject || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/model-questions-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classLevel,
          faculty: classLevel === "12" ? faculty : undefined,
          subject,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 md:px-8">
      <div className="mb-1 flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-500/80">
          Marking Scheme Engine
        </span>
      </div>
      <h1 className="font-serif text-2xl font-bold text-white md:text-3xl">Model Question Sets</h1>
      <p className="mt-1 text-sm text-slate-400">
        AI-generated, NEB/SEE exam-pattern model papers — same structure, marks distribution, and
        groups as the real thing, fresh questions every time.
      </p>

      {!result && (
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-6 backdrop-blur-xl">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Class</label>
          <div className="mt-2 flex gap-2">
            {(["8", "10", "12"] as const).map((c) => (
              <button
                key={c}
                onClick={() => {
                  setClassLevel(c);
                  setSubject("");
                }}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  classLevel === c
                    ? "border-red-500/40 bg-red-500/10 text-red-400"
                    : "border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                Class {c} {c === "10" ? "(SEE)" : ""}
              </button>
            ))}
          </div>

          {classLevel === "12" && (
            <>
              <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-slate-400">
                Faculty
              </label>
              <div className="mt-2 flex gap-2">
                {(["Science", "Management", "Humanities"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFaculty(f);
                      setSubject("");
                    }}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      faculty === f
                        ? "border-red-500/40 bg-red-500/10 text-red-400"
                        : "border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </>
          )}

          <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-slate-400">
            Subject
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-red-500/40"
          >
            <option value="">Select subject</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={generate}
            disabled={loading || !subject}
            className="mt-5 flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(198,54,46,0.25)] transition-opacity disabled:opacity-40"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            {loading ? "Setting the paper…" : "Generate Model Set"}
          </button>

          {error && (
            <p className="mt-4 rounded-xl border border-red-900/40 bg-red-950/30 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-5">
          <button
            onClick={() => setResult(null)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            <RotateCcw size={13} /> Generate another
          </button>

          {/* ADMIT-CARD STYLE PAPER HEADER */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 font-mono">
            <div className="flex items-center justify-between border-b border-dashed border-slate-800 pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-red-500/80">
                  {result.classLevel === "10" ? "SEE" : "NEB"} Model Question Paper
                </p>
                <h2 className="mt-1 font-serif text-lg font-bold text-white">
                  Class {result.classLevel}
                  {result.faculty ? ` — ${result.faculty}` : ""} · {result.subject}
                </h2>
              </div>
              <FileCheck2 className="text-red-500/60" size={28} />
            </div>
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-1 text-xs text-slate-400">
              <span>Full Marks: <span className="text-slate-200">{result.fullMarks}</span></span>
              {result.passMarks && (
                <span>Pass Marks: <span className="text-slate-200">{result.passMarks}</span></span>
              )}
              {result.timeAllowed && (
                <span>Time: <span className="text-slate-200">{result.timeAllowed}</span></span>
              )}
            </div>
          </div>

          {/* SECTIONS */}
          {result.sections.map((section, si) => (
            <div key={si} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
              <h3 className="font-serif text-base font-bold text-red-400">{section.group}</h3>
              <p className="mt-1 text-xs italic text-slate-500">{section.instructions}</p>
              <div className="mt-4 space-y-3">
                {section.questions.map((q, qi) => (
                  <div key={qi} className="flex gap-3 text-sm text-slate-200">
                    <span className="shrink-0 font-mono text-slate-500">{q.number}.</span>
                    <div className="flex-1">
                      <p>{q.text}</p>
                      {q.options && q.options.length > 0 && (
                        <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                          {q.options.map((opt, oi) => (
                            <span
                              key={oi}
                              className="rounded-md border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-xs text-slate-300"
                            >
                              {String.fromCharCode(97 + oi)}) {opt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="shrink-0 font-mono text-xs text-red-400/80">[{q.marks}]</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
