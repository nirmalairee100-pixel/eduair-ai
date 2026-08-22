import Link from "next/link";
import { Check } from "lucide-react";

const WHATSAPP_NUMBER = "9779868748003";
const ESEWA_ID = "9709451225";

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
      "Generous quiz & notes limits",
      "PDF summarizer (up to ~50 pages)",
      "Higher photo analyzer limits",
      "Full study planner",
      "Priority AI response speed",
    ],
    cta: "Get Pro — Rs 499/mo",
    href: "#upgrade",
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
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi! I just paid for EduAir Pro. Here's my payment screenshot and the email I use to log in:"
  )}`;

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

      {/* Manual upgrade flow — no payment gateway integration yet, so Pro
          is activated by hand after a direct eSewa/Khalti transfer. This
          is intentional: don't build billing infra before you've proven
          people will actually pay. Switch to automated checkout once
          you've got a steady stream of these. */}
      <div id="upgrade" className="mx-auto mt-16 max-w-2xl rounded-3xl border border-indigo-200 bg-indigo-50/50 p-8 text-left">
        <h2 className="text-xl font-bold text-slate-900">How to get Pro</h2>
        <ol className="mt-4 space-y-3 text-sm text-slate-700 list-decimal list-inside">
          <li>
            Send <span className="font-semibold">Rs 499</span> via eSewa to <span className="font-mono">{ESEWA_ID}</span>.
          </li>
          <li>
            Message the payment screenshot + the email you use to log into EduAir on{" "}
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold hover:underline">
              WhatsApp
            </a>.
          </li>
          <li>Pro is activated on your account within a few hours (usually much faster).</li>
        </ol>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
        >
          Message on WhatsApp
        </a>
        <p className="mt-4 text-xs text-slate-500">
          Automated checkout is coming later — for now this keeps things simple and lets you talk to real early users.
        </p>
      </div>

      <p className="mx-auto mt-10 max-w-md text-center text-xs text-slate-400">
        Everyone gets full access to the Free tier today — no credit card required.
      </p>
    </main>
  );
}

// === SETUP NOTE FOR NIRMAL ===
// WHATSAPP_NUMBER and ESEWA_ID are filled in above.
// Remember: ESEWA_ID currently points to a friend's eSewa account, not
// your own — make sure you two have a clear agreement on how/when they
// pass along what students send before this goes live.
// Also run supabase-migrations/add_pro_plan.sql in the Supabase SQL editor
// before this goes live, and use the manual-activation query at the bottom
// of that file each time someone pays.
