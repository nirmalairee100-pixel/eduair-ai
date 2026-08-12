import Link from "next/link";

export default function SchoolsPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center text-center">
      <Link href="/" className="text-blue-600 hover:underline mb-4 text-sm">← Back to Home</Link>
      <h1 className="text-4xl font-bold text-gray-900">EduAir AI for Schools</h1>
      <p className="mt-4 text-gray-600 max-w-md">
        Bring smart AI tutoring resources to your classroom. Discover how institutional packages help schools across Nepal bridge the learning gap.
      </p>
    </main>
  );
}
