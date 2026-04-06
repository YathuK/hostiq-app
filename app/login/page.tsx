"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const verify = searchParams.get("verify");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("email", { email, callbackUrl: "/dashboard" });
  };

  if (verify) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="max-w-sm w-full text-center">
          <div className="text-3xl font-bold text-primary mb-4">HostIQ</div>
          <div className="bg-emerald-50 rounded-xl p-8 border border-emerald-200">
            <h2 className="text-xl font-semibold text-dark">Check your email</h2>
            <p className="mt-2 text-slate-600">
              We sent you a magic link. Click it to sign in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-primary">HostIQ</div>
          <p className="mt-2 text-slate-500">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Sending link..." : "Sign in with Email"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          We&apos;ll send you a magic link to sign in.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-primary text-xl">Loading...</div></div>}>
      <LoginForm />
    </Suspense>
  );
}
