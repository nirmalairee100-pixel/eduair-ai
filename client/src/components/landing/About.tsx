export default function About() {
  return (
    <section id="about" className="mx-auto max-w-4xl px-6 py-16 text-center">
      <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
        About Us
      </span>
      <h2 className="mt-4 text-3xl font-bold text-slate-900">
        Why EduAir AI?
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-slate-600">
        EduAir AI was built to give students in Nepal a study companion that
        actually understands their syllabus — not a generic, one-size-fits-all
        chatbot. Every feature, from the AI tutor to the quiz generator, is
        designed around how Nepali students actually learn and revise.
      </p>

      <div className="mx-auto mt-8 flex max-w-sm items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 text-lg font-semibold text-white">
          N
        </div>
        <div>
          <p className="font-semibold text-slate-900">Nirmal Airee</p>
          <p className="text-sm text-slate-500">Founder, EduAir AI</p>
        </div>
      </div>
    </section>
  );
}
