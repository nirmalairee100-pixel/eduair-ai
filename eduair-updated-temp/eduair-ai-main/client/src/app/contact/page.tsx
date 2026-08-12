import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center text-center">
      <Link href="/" className="text-blue-600 hover:underline mb-4 text-sm">← Back to Home</Link>
      <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
      <p className="mt-4 text-gray-600 max-w-md">
        Have questions, suggestions, or institutional inquiries? Reach out to us anytime, and our team will get back to you shortly.
      </p>
    </main>
  );
}
