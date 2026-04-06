"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [form, setForm] = useState({ name: "", email: "", propertyCount: "1-3" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="waitlist" className="py-28 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/30 to-white" />
      <div className="max-w-lg mx-auto relative reveal">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Early Access</p>
          <h2 className="text-3xl md:text-4xl font-bold text-dark">
            Be first. Launch is coming.
          </h2>
          <p className="mt-4 text-slate-500">
            Join 200+ hosts on the waitlist. First month free for early access.
          </p>
        </div>

        {submitted ? (
          <div className="p-10 bg-white rounded-3xl border border-emerald-200 text-center shadow-lg shadow-emerald-500/5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-dark">You&apos;re on the list!</h3>
            <p className="mt-2 text-slate-500">We&apos;ll be in touch with early access details.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/30 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">How many properties?</label>
              <select
                value={form.propertyCount}
                onChange={(e) => setForm({ ...form, propertyCount: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
              >
                <option value="1-3">1-3 properties</option>
                <option value="4-10">4-10 properties</option>
                <option value="10+">10+ properties</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all text-lg disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {loading ? "Joining..." : "Join Waitlist"}
            </button>
            <p className="text-center text-xs text-slate-400">No credit card required. We&apos;ll email you when it&apos;s your turn.</p>
          </form>
        )}
      </div>
    </section>
  );
}
