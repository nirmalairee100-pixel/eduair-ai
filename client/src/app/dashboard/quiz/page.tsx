"use client";

import { useState } from "react";
import { Sparkles, Loader2, CheckCircle2, XCircle, History } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Question = {
  question: string;
  options: string[];
  correctIndex: number;
};

type PastQuiz = {
  id: string;
  topic: string;
  score: number | null;
  total: number | null;
  created_at: string;
};

export default function QuizGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [pastQuizzes, setPastQuizzes] = useState<PastQuiz[]>([]);
  const [loadedPast, setLoadedPast] = useState(false);
  const supabase = createClient();

  async function loadPastQuizzes() {
    if (loadedPast) return;
    const { data } = await supabase
      .from("quizzes")
      .select("id, topic, score, total, created_at")
      .order("created_at", { ascending: false });
    setPastQuizzes((data as PastQuiz[]) ?? []);
    setLoadedPast(true);
  }

  async function generateQuiz() {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setError(null);
    setQuestions(null);
    setSubmitted(false);

    try {
      const res = await fetch("/api/quiz-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, numQuestions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setQuizId(data.quizId);
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(null));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function submitQuiz() {
    if (!questions || !quizId) return;
    const score = questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0),
      0
    );
    setSubmitted(true);
    await supabase
      .from("quizzes")
      .update({ score, total: questions.length })
      .eq("id", quizId);
    setPastQuizzes((prev) => [
      { id: quizId, topic, score, total: questions.length, created_at: new Date().toISOString() },
      ...prev.filter((q) => q.id !== quizId),
    ]);
    setLoadedPast(true);
  }

  const score = questions
    ? questions.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0)
    : 0;

  return (
    <main className="mx-auto max-w-3xl px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Quiz Generator</h1>
      <p className="mt-1 text-slate-500">
        Test yourself on any topic with an instant multiple-choice quiz.
      </p>

      {!questions && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <label className="text-sm font-medium text-slate-700">Topic</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Photosynthesis, World War 2, Basic Algebra"
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />

          <label className="mt-4 block text-sm font-medium text-slate-700">
            Number of questions: {numQuestions}
          </label>
          <input
            type="range"
            min={3}
            max={10}
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="mt-1.5 w-full accent-indigo-600"
          />

          <button
            onClick={generateQuiz}
            disabled={loading || !topic.trim()}
            className="mt-5 flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            {loading ? "Generating…" : "Generate Quiz"}
          </button>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      )}

      {questions && (
        <div className="mt-6 space-y-4">
          {submitted && (
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 text-center">
              <p className="text-lg font-bold text-indigo-700">
                You scored {score} / {questions.length}
              </p>
            </div>
          )}

          {questions.map((q, qi) => (
            <div key={qi} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="font-medium text-slate-900">
                {qi + 1}. {q.question}
              </p>
              <div className="mt-3 space-y-2">
                {q.options.map((opt, oi) => {
                  const isSelected = answers[qi] === oi;
                  const isCorrect = q.correctIndex === oi;
                  let style = "border-slate-200 hover:bg-slate-50";
                  if (submitted && isCorrect) style = "border-green-300 bg-green-50";
                  else if (submitted && isSelected && !isCorrect) style = "border-red-300 bg-red-50";
                  else if (isSelected) style = "border-indigo-300 bg-indigo-50";

                  return (
                    <button
                      key={oi}
                      disabled={submitted}
                      onClick={() =>
                        setAnswers((prev) => {
                          const next = [...prev];
                          next[qi] = oi;
                          return next;
                        })
                      }
                      className={`flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-left text-sm transition ${style}`}
                    >
                      {opt}
                      {submitted && isCorrect && <CheckCircle2 size={16} className="text-green-600" />}
                      {submitted && isSelected && !isCorrect && <XCircle size={16} className="text-red-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {!submitted ? (
            <button
              onClick={submitQuiz}
              disabled={answers.some((a) => a === null)}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-3 text-sm font-medium text-white disabled:opacity-40"
            >
              Submit Answers
            </button>
          ) : (
            <button
              onClick={() => {
                setQuestions(null);
                setTopic("");
              }}
              className="w-full rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Generate Another Quiz
            </button>
          )}
        </div>
      )}

      <div className="mt-10">
        <button
          onClick={loadPastQuizzes}
          className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:underline"
        >
          <History size={14} />
          {loadedPast ? "Past quizzes" : "Show past quizzes"}
        </button>
        {loadedPast && (
          <div className="mt-3 space-y-2">
            {pastQuizzes.length === 0 && (
              <p className="text-sm text-slate-400">No quizzes yet.</p>
            )}
            {pastQuizzes.map((q) => (
              <div
                key={q.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
              >
                <span className="truncate text-slate-700">{q.topic}</span>
                <span className="shrink-0 text-slate-400">
                  {q.score !== null ? `${q.score}/${q.total}` : "Not taken"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
