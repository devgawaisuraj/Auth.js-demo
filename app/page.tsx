import Link from "next/link";
import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-10 text-center shadow-lg">
        <h1 className="text-4xl font-bold text-gray-900">
          Next.js Auth.js Demo
        </h1>

        <p className="mt-4 text-gray-600">
          Auth.js + MySQL + Google OAuth + Tailwind CSS
        </p>

        {session?.user ? (
          <div className="mt-8">
            <p className="mb-4 text-gray-700">Welcome, {session.user.name}</p>

            <Link
              href="/dashboard"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
