import Link from "next/link";

const contactOptions = [
  {
    title: "Email us",
    description: "Questions, feedback, partnerships, or anything else.",
    value: "eduair.mail@gmail.com",
    href: "mailto:eduair.mail@gmail.com",
    icon: "✉",
  },
  {
    title: "Product feedback",
    description: "Found something we can improve? We'd love to hear it.",
    value: "Send feedback",
    href: "mailto:eduair.mail@gmail.com?subject=EduAir%20Feedback",
    icon: "💡",
  },
  {
    title: "Partnerships",
    description: "Interested in working with EduAir or bringing it to students?",
    value: "Let's talk",
    href: "mailto:eduair.mail@gmail.com?subject=EduAir%20Partnership",
    icon: "🤝",
  },
];

const faqs = [
  {
    question: "What can I contact EduAir about?",
    answer:
      "You can contact us about questions, feedback, technical issues, suggestions, partnerships, or anything related to EduAir.",
  },
  {
    question: "How should I report a problem?",
    answer:
      "Send us an email with a short description of the problem and, if possible, the page or feature where it happened.",
  },
  {
    question: "Can schools or organizations work with EduAir?",
    answer:
      "Yes. For institutional or partnership inquiries, email us and tell us a little about what you'd like to build together.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/40 text-slate-900">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
        >
          <span aria-hidden="true">←</span>
          Back to Home
        </Link>

        <section className="relative mt-8 overflow-hidden rounded-3xl border border-blue-100 bg-white px-6 py-12 shadow-sm sm:px-10 sm:py-16 lg:px-16">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-indigo-100/60 blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl shadow-lg shadow-blue-200">
              💬
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              EduAir Support
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              We&apos;d love to hear from you.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Have a question, found something that needs fixing, or have an
              idea that could make EduAir better? Reach out and let us know.
            </p>

            <a
              href="mailto:eduair.mail@gmail.com"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:shadow-xl"
            >
              Email EduAir
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {contactOptions.map((option) => (
            <a
              key={option.title}
              href={option.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                {option.icon}
              </div>

              <h2 className="mt-5 text-lg font-bold">{option.title}</h2>

              <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                {option.description}
              </p>

              <span className="mt-5 inline-flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                {option.value}
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </a>
          ))}
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Frequently asked
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Before you reach out
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Here are a few quick answers. If you still need help, our inbox
              is open.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <summary className="cursor-pointer list-none font-semibold text-slate-900">
                  <span className="flex items-center justify-between gap-4">
                    {faq.question}
                    <span className="text-xl text-blue-600 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>

                <p className="mt-3 pr-6 text-sm leading-6 text-slate-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-slate-900 px-6 py-10 text-center text-white shadow-xl sm:px-10">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Have an idea for EduAir?
          </h2>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-300">
            EduAir is built to make learning easier. Your feedback can help us
            make it even better.
          </p>

          <a
            href="mailto:eduair.mail@gmail.com?subject=EduAir%20Idea"
            className="mt-6 inline-flex rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-blue-50"
          >
            Share your idea
          </a>
        </section>

        <footer className="py-10 text-center text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} EduAir. Built for better learning.
          </p>
          <p className="mt-2">
            <a
              href="mailto:eduair.mail@gmail.com"
              className="font-medium text-blue-600 hover:underline"
            >
              eduair.mail@gmail.com
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
