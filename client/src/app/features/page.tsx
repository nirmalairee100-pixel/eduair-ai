import Link from "next/link";

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center text-center">
      <Link href="/" className="text-blue-600 hover:underline mb-4 text-sm">← Back to Home</Link>
      <h1 className="text-4xl font-bold text-gray-900">EduAir AI Features</h1>
      <p className="mt-4 text-gray-600 max-w-md">
        Explore our powerful AI tools tailored for the Nepali school syllabus, including PDF summarization, smart quizzes, and chat tutoring.
      </p>
    </main>
  );
}
