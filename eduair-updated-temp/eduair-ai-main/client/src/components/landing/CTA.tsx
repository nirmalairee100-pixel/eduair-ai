import LoginButton from "@/components/landing/LoginButton";

export default function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-600 px-8 py-14 text-center text-white sm:px-16">
        <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <h2 className="relative text-3xl font-bold sm:text-4xl">
          Built for Nepal. Built for You.
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-indigo-100">
          EduAir AI understands your syllabus, your language, and your goals.
          Join thousands of students learning smarter every day.
        </p>
        <div className="relative mt-8 flex justify-center">
          <LoginButton className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50" />
        </div>
      </div>
    </section>
  );
}
