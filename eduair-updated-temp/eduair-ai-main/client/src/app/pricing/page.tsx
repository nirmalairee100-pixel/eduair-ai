import Link from "next/link";
import { Check } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: "Rs 0",
    period: "forever",
    tagline: "Get started with the essentials.",
    features: [
      "AI chat tutor",
      "5 quizzes per day",
      "5 notes generations per day",
      "PDF summarizer (up to ~10 pages)",
      "Photo analyzer (limited daily uses)",
    ],
    cta: "Start for free",
    href: "/login",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "Rs 499",
    period: "/ month",
    tagline: "For students studying seriously for exams.",
    features: [
      "Everything in Free",
      "Unlimited quizzes & notes",
      "PDF summarizer (up to ~50 pages)",
      "Unlimited photo analyzer",
      "Full study planner",
      "Priority AI response speed",
    ],
    cta: "Coming soon",
    href: "/contact",
    highlighted: true,
  },
  {
    name: "Schools",
    price: "Custom",
    period: "per institution",
    tagline: "For schools rolling this out to a whole class or campus.",
    features: [
      "Everything in Pro",
      "Bulk student accounts",
      "Usage dashboard for teachers",
      "Curriculum-aligned content",
      "Dedicated support",
    ],
    cta: "Contact us",
    href: "/contact",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-5xl text-center">
        <Link href="/" className="mb-4 inline-block text-sm text-blue-600 hover:underline">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-900">Simple, Affordable Pricing</h1>
        <p className="mx-auto mt-4 max-w-md text-gray-600">
          Choose a plan that fits your learning pace. Built to provide affordable AI learning tools for every student in Nepal.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-3xl border p-8 ${
              plan.highlighted
                ? "border-indigo-300 bg-white shadow-lg shadow-indigo-100 ring-2 ring-indigo-500"
                : "border-slate-200 bg-white"
            }`}
          >
            {plan.highlighted && (
              <span className="mb-3 inline-block w-fit rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                Most popular
              </span>
            )}
            <h2 className="text-xl font-bold text-slate-900">{plan.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{plan.tagline}</p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900">{plan.price}</span>
              <span className="text-sm text-slate-500">{plan.period}</span>
            </div>

            <ul className="mt-6 flex-1 space-y-3 text-left">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                  <Check size={16} className="mt-0.5 shrink-0 text-indigo-600" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href={plan.href}
              className={`mt-8 rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition ${
                plan.highlighted
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "border border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-md text-center text-xs text-slate-400">
        Paid plans are launching soon. Everyone gets full access to the Free tier today — no credit card required.
      </p>
    </main>
  );
}
