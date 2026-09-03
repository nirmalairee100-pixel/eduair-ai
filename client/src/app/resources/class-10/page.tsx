import Link from "next/link";

export const metadata = {
  title: "Class 10 Study Guide | EduAir",
  description: "Free Class 10 study guidance for Nepali students.",
};

const subjects = [
  ["Mathematics", "Algebra, geometry, statistics, probability and regular problem solving."],
  ["Science", "Physics, chemistry, biology and environmental science concepts."],
  ["English", "Reading, grammar, vocabulary and writing practice."],
  ["Nepali", "व्याकरण, साहित्य, लेखन र पाठको अभ्यास।"],
];

export default function ClassTenPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            EduAir Resources
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            Class 10 Study Guide
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Practical study guidance for Class 10 students preparing for their
            school examinations and SEE.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">How to study effectively</h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            ["01", "Understand first", "Focus on understanding concepts instead of relying only on memorisation."],
            ["02", "Study consistently", "Regular study sessions are more effective than leaving everything until the final weeks."],
            ["03", "Practise questions", "Solve questions regularly to discover which concepts need more work."],
            ["04", "Review mistakes", "Use mistakes as feedback and revisit the underlying concept."],
          ].map(([number, title, text]) => (
            <article key={number} className="rounded-2xl border p-6">
              <span className="text-sm font-bold text-muted-foreground">{number}</span>
              <h3 className="mt-3 text-xl font-bold">{title}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold">Subject guidance</h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {subjects.map(([title, text]) => (
              <article key={title} className="rounded-2xl border bg-background p-7">
                <h3 className="text-2xl font-bold">{title}</h3>
                <p className="mt-4 leading-8 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">Continue preparing</h2>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/resources/see-preparation"
            className="rounded-xl border px-5 py-3 font-medium hover:bg-muted"
          >
            SEE Preparation →
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
