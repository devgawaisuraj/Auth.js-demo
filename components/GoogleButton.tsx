"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function GoogleButton() {
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    setLoading(true);

    await signIn("google", {
      callbackUrl: "/dashboard",
    });
  }

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50"
    >
      {loading ? "Redirecting..." : "Continue with Google"}
    </button>
  );
}
