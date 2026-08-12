import { BookOpenCheck, Sparkles, ShieldCheck, Rocket } from "lucide-react";

const FEATURES = [
  {
    icon: BookOpenCheck,
    title: "Nepali Syllabus Focused",
    desc: "Based on the NEB curriculum for all classes.",
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Learning",
    desc: "Smart explanations, simplified for you.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    desc: "Your data is safe and encrypted.",
    color: "text-violet-600 bg-violet-50",
  },
  {
    icon: Rocket,
    title: "Study Smarter",
    desc: "Save time and boost your results.",
    color: "text-cyan-600 bg-cyan-50",
  },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid grid-cols-1 gap-6 rounded-3xl border border-slate-200 bg-slate-50/60 p-8 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="text-center sm:text-left">
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
              <Icon size={18} />
            </div>
            <h3 className="font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
