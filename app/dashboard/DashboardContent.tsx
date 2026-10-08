import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardContent() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {session.user.name}
        </h1>

        <p className="mt-3 text-gray-600">
          You are successfully authenticated.
        </p>

        <div className="mt-8 rounded-xl bg-gray-50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            User Information
          </h2>

          <div className="space-y-2 text-gray-700">
            <p>
              <strong>ID:</strong> {session.user.id}
            </p>

            <p>
              <strong>Name:</strong> {session.user.name}
            </p>

            <p>
              <strong>Email:</strong> {session.user.email}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    </section>
  );
}
