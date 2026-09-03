import Link from "next/link";

export const metadata = {
  title: "Study Tips for Students | EduAir",
  description: "Practical study tips to help students learn more effectively.",
};

const tips = [
  ["Set a clear goal", "Know what you want to learn, practise or revise before starting."],
  ["Break topics down", "Divide large chapters into smaller, manageable study tasks."],
  ["Test yourself", "Try recalling information or solving questions without looking at your notes."],
  ["Review mistakes", "Mistakes can reveal exactly which concepts need more attention."],
  ["Reduce distractions", "Keep unrelated notifications and activities away while studying."],
  ["Take useful breaks", "Short breaks can help you maintain focus during longer study sessions."],
];

export default function StudyTipsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            EduAir Resources
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            Study Tips for Students
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Simple strategies that can help students organise study time,
            practise effectively and build better learning habits.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {tips.map(([title, text], index) => (
            <article key={title} className="rounded-2xl border p-7">
              <span className="text-sm font-bold text-muted-foreground">
                TIP {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-3 text-2xl font-bold">{title}</h2>
              <p className="mt-4 leading-8 text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold">A simple study session</h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              ["Before", "Choose your topic and prepare the materials you need."],
              ["During", "Focus on understanding and actively practising."],
              ["After", "Review what you learned and note what needs revision."],
            ].map(([title, text]) => (
              <article key={title} className="rounded-2xl border bg-background p-7">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">Learn with technology</h2>
        <p className="mt-5 max-w-3xl leading-8 text-muted-foreground">
          Digital and AI tools can help explain difficult concepts and create
          practice material. Use them to support learning rather than replace
          your own thinking and practice.
        </p>

        <div className="mt-8">
          <Link
            href="/dashboard"
            className="inline-flex rounded-xl border px-5 py-3 font-medium hover:bg-muted"
          >
            Try EduAir →
          </Link>
        </div>
      </section>
    </main>
  );
}
