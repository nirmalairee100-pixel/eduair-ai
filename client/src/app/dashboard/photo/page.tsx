"use client";

import { useState, useRef } from "react";
import { Camera, ImageIcon, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/client";

type Photo = {
  id: string;
  file_name: string;
  analysis: string;
  created_at: string;
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // reader.result is a data URL like "data:image/png;base64,AAAA...";
      // strip the prefix so we only send the raw base64 payload.
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function PhotoAnalyzerPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pastPhotos, setPastPhotos] = useState<Photo[]>([]);
  const [loadedPast, setLoadedPast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function loadPastPhotos() {
    if (loadedPast) return;
    const { data } = await supabase
      .from("photo_analyses")
      .select("id, file_name, analysis, created_at")
      .order("created_at", { ascending: false });
    setPastPhotos((data as Photo[]) ?? []);
    setLoadedPast(true);
  }

  async function handleFile(file: File) {
    setError(null);
    setAnalysis(null);
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));

    if (!["image/jpeg", "image/png", "image/webp", "image/heic"].includes(file.type)) {
      setError("Please upload a JPEG, PNG, WEBP, or HEIC image.");
      return;
    }

    setAnalyzing(true);
    try {
      const imageBase64 = await fileToBase64(file);
      const res = await fetch("/api/photo-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          imageBase64,
          question,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setAnalysis(data.analysis);
      setPastPhotos((prev) => [
        {
          id: data.photoId,
          file_name: file.name,
          analysis: data.analysis,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setLoadedPast(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Photo Analyzer</h1>
      <p className="mt-1 text-slate-500">
        Snap a homework problem, diagram, or handwritten notes and get a step-by-step explanation.
      </p>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Optional: ask something specific, e.g. 'Solve question 3' or 'Explain this diagram'"
        rows={2}
        maxLength={500}
        className="mt-6 w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-700 outline-none focus:border-indigo-400"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-10 text-center transition hover:border-indigo-400 hover:bg-indigo-50/30"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Selected"
            className="mb-3 max-h-48 rounded-lg object-contain"
          />
        ) : (
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
            <Camera className="text-blue-600" size={22} />
          </div>
        )}
        <p className="font-medium text-slate-700">
          {preview ? "Click to choose a different photo" : "Click to upload a photo"}
        </p>
        <p className="mt-1 text-sm text-slate-400">JPEG, PNG, WEBP, or HEIC — up to ~6MB</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {analyzing && (
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="animate-spin" size={16} />
          Analyzing your photo…
        </div>
      )}

      {error && (
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      {analysis && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-3 flex items-center gap-2">
            <ImageIcon size={16} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-500">{fileName}</span>
          </div>
          <div className="prose prose-sm max-w-none prose-strong:text-slate-900">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis}</ReactMarkdown>
          </div>
        </div>
      )}

      <div className="mt-10">
        <button
          onClick={loadPastPhotos}
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          {loadedPast ? "Past analyses" : "Show past analyses"}
        </button>
        {loadedPast && (
          <div className="mt-3 space-y-2">
            {pastPhotos.length === 0 && (
              <p className="text-sm text-slate-400">No analyses yet.</p>
            )}
            {pastPhotos.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setAnalysis(p.analysis);
                  setFileName(p.file_name);
                  setPreview(null);
                }}
                className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm hover:bg-slate-50"
              >
                <ImageIcon size={14} className="text-slate-400" />
                <span className="truncate text-slate-700">{p.file_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
