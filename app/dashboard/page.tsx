import { Suspense } from "react";
import DashboardContent from "./DashboardContent";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent />
      </Suspense>
    </main>
  );
}

function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-600">Loading dashboard...</p>
    </div>
  );
}
