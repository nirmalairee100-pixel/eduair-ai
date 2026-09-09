import Link from "next/link";

const features = [
  {
    icon: "🤖",
    title: "Air — AI Study Tutor",
    text: "A Nepal-aware AI tutor designed to help students understand concepts, revise lessons, and prepare for exams.",
  },
  {
    icon: "📝",
    title: "Model Questions",
    text: "Practice with NEB/SEE-pattern model question sets organized by class, faculty, and subject.",
  },
  {
    icon: "📄",
    title: "Study Materials",
    text: "Turn documents and study materials into summaries, notes, quizzes, and useful revision resources.",
  },
  {
    icon: "📸",
    title: "Photo Analyzer",
    text: "Analyze educational questions, textbook content, diagrams, and other study material with AI vision.",
  },
  {
    icon: "📚",
    title: "Study Plans",
    text: "Build a more organized learning workflow around your subjects, goals, and study sessions.",
  },
  {
    icon: "⚡",
    title: "Reliable AI",
    text: "Gemini is backed by Groq and OpenRouter fallbacks, with retries, timeouts, and usage protection.",
  },
];

const stack = [
  "Next.js",
  "Supabase",
  "Google Gemini",
  "Groq",
  "OpenRouter",
  "Vercel",
  "eSewa",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(198,54,46,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-white/60 transition hover:text-white"
          >
            ← Back to EduAir
          </Link>

          <div className="max-w-4xl pb-20 pt-20 sm:pt-28">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-[#C6362E]">
              Built for Nepal
            </p>

            <h1 className="font-serif text-5xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
              Learning,
              <br />
              <span className="text-white/45">reimagined.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/65 sm:text-xl">
              EduAir is an AI-powered learning platform designed around the
              needs of Nepali students studying under the NEB and SEE system.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-full bg-[#C6362E] px-6 py-3 text-sm font-medium transition hover:bg-[#a92d26]"
              >
                Start learning →
              </Link>

              <Link
                href="/features"
                className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition hover:border-white/30 hover:text-white"
              >
                Explore features
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#C6362E]">
              The idea
            </p>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
              More than a chatbot.
            </h2>
          </div>

          <div className="space-y-6 text-base leading-8 text-white/60 sm:text-lg">
            <p>
              Generic AI tools can answer questions, but students often need
              something much more specific: explanations that fit their
              curriculum, exam-focused practice, useful study materials, and a
              workflow that actually helps them learn.
            </p>

            <p>
              EduAir brings those pieces together in one platform. Students
              can chat with Air, analyze study material, create notes and
              quizzes, practice model questions, and organize their learning.
            </p>

            <p>
              The goal is simple: make powerful AI genuinely useful for
              students in Nepal.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:px-12">
          <div className="mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#C6362E]">
              What&apos;s inside
            </p>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
              Built around the student.
            </h2>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="bg-[#080808] p-7 transition hover:bg-white/[0.045]"
              >
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="mt-6 text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/50">
                  {feature.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#C6362E]">
              Under the hood
            </p>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
              Modern stack.
              <br />
              Practical architecture.
            </h2>

            <p className="mt-6 max-w-xl leading-7 text-white/55">
              EduAir uses a unified Next.js architecture with Supabase for
              authentication and data, while its AI service layer provides
              fallback providers for better resilience.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-7">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
              Technology
            </p>

            <div className="flex flex-wrap gap-2">
              {stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/75"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 border-t border-white/10 pt-6">
              <p className="text-sm leading-6 text-white/50">
                AI provider chain
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-sm">
                <span>Gemini</span>
                <span className="text-[#C6362E]">→</span>
                <span>Groq</span>
                <span className="text-[#C6362E]">→</span>
                <span>OpenRouter</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#C6362E]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:px-12">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-white/60">
            The mission
          </p>

          <h2 className="mt-5 max-w-4xl font-serif text-4xl leading-tight sm:text-6xl">
            Make great learning tools accessible to students in Nepal.
          </h2>

          <p className="mt-7 max-w-2xl leading-7 text-white/75">
            EduAir is being built with a simple belief: AI should not feel
            like a generic technology layer. It should understand the learner,
            the curriculum, and the context in which they study.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center sm:px-8 lg:px-12">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#C6362E]">
          From prototype to product
        </p>

        <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl sm:text-6xl">
          Built, rebuilt, and still evolving.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl leading-7 text-white/50">
          EduAir started as an incomplete project called EduMind AI. It was
          rebuilt into a unified production application, then rebranded as
          EduAir AI. The product continues to evolve around real student needs
          rather than fabricated numbers or placeholder claims.
        </p>

        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex rounded-full border border-white/15 px-6 py-3 text-sm font-medium transition hover:border-white/30"
          >
            Explore EduAir →
          </Link>
        </div>

        <p className="mt-16 font-serif text-2xl text-white/70">
          Built for students. Designed for Nepal. Powered by AI.
        </p>

        <p className="mt-3 text-sm text-white/35">
          Made by Nirmal Airee
        </p>
      </section>
    </main>
  );
}
