import Link from "next/link";

export const metadata = {
  title: "SEE Preparation Guide | EduAir",
  description: "A practical SEE preparation guide for students in Nepal.",
};

const steps = [
  ["Learn", "Understand the concepts and chapters before moving to intensive practice."],
  ["Practise", "Solve textbook exercises, model questions and other suitable practice questions."],
  ["Review", "Return to older topics regularly so important concepts stay fresh."],
  ["Analyse", "Identify mistakes and spend extra time on topics that need improvement."],
];

export default function SeePreparationPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Exam Preparation
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            SEE Preparation Guide
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Build a practical preparation routine around understanding,
            practice, revision and learning from mistakes.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">A simple preparation cycle</h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {steps.map(([title, text], index) => (
            <article key={title} className="rounded-2xl border p-7">
              <span className="text-sm font-bold text-muted-foreground">
                STEP {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-2xl font-bold">{title}</h3>
              <p className="mt-4 leading-8 text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold">Use practice papers effectively</h2>

          <div className="mt-8 rounded-2xl border bg-background p-8">
            <ol className="space-y-5 leading-8">
              <li><strong>1.</strong> Attempt the questions independently.</li>
              <li><strong>2.</strong> Check your answers after completing the attempt.</li>
              <li><strong>3.</strong> Identify the reason behind mistakes.</li>
              <li><strong>4.</strong> Revisit the topic and practise again later.</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">More EduAir resources</h2>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/resources/class-10"
            className="rounded-xl border px-5 py-3 font-medium hover:bg-muted"
          >
            Class 10 Guide →
          </Link>

          <Link
            href="/resources/study-tips"
            className="rounded-xl border px-5 py-3 font-medium hover:bg-muted"
          >
            Study Tips →
          </Link>
        </div>
      </section>
    </main>
  );
}
