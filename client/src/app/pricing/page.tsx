import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center text-center">
      <Link href="/" className="text-blue-600 hover:underline mb-4 text-sm">← Back to Home</Link>
      <h1 className="text-4xl font-bold text-gray-900">Simple, Affordable Pricing</h1>
      <p className="mt-4 text-gray-600 max-w-md">
        Choose a plan that fits your learning pace. Built to provide affordable AI learning tools for every student in Nepal.
      </p>
    </main>
  );
}
