import { createClient } from "@/lib/supabase/server";
import LibraryList from "@/components/dashboard/LibraryList";

export default async function LibraryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: documents }, { data: quizzes }, { data: notes }, { data: plans }] =
    await Promise.all([
      supabase
        .from("documents")
        .select("id, file_name, summary, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("quizzes")
        .select("id, topic, score, total, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("notes")
        .select("id, topic, content, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("study_plans")
        .select("id, title, content, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false }),
    ]);

  const items = {
    documents: (documents ?? []).map((d) => ({
      id: d.id,
      title: d.file_name,
      body: d.summary,
      created_at: d.created_at,
    })),
    quizzes: (quizzes ?? []).map((q) => ({
      id: q.id,
      title: q.topic,
      subtitle: q.score !== null ? `Score: ${q.score}/${q.total}` : "Not taken yet",
      body: `_Open the Quiz Generator to retake this topic._`,
      created_at: q.created_at,
    })),
    notes: (notes ?? []).map((n) => ({
      id: n.id,
      title: n.topic,
      body: n.content,
      created_at: n.created_at,
    })),
    plans: (plans ?? []).map((p) => ({
      id: p.id,
      title: p.title,
      body: p.content,
      created_at: p.created_at,
    })),
  };

  return (
    <main className="mx-auto max-w-3xl px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900">My Library</h1>
      <p className="mt-1 text-slate-500">
        Everything you&apos;ve saved across EduAir AI, in one place.
      </p>

      <div className="mt-6">
        <LibraryList items={items} />
      </div>
    </main>
  );
}
