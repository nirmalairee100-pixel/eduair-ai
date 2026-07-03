import LoginButton from "@/components/landing/LoginButton";

export default function Hero() {
  return (
    <section className="flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
      <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
        🚀 AI-Powered Learning Platform
      </span>

      <h1 className="mt-8 max-w-5xl text-6xl font-black tracking-tight md:text-8xl">
        Learn Smarter with{" "}
        <span className="text-blue-500">EduMind AI</span>
      </h1>

      <p className="mt-8 max-w-2xl text-lg text-zinc-400">
        One platform for students, teachers, parents and schools.
        Chat with AI, generate quizzes, summarize PDFs, create notes,
        and study faster.
      </p>

      <div className="mt-10 flex gap-4">
        <LoginButton />
      </div>
    </section>
  );
}