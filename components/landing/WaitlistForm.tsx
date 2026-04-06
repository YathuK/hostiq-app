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
    <section id="waitlist" className="py-24 px-6">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-dark">
          Be first. Launch is coming.
        </h2>
        <p className="mt-4 text-slate-600 text-lg">
          Join 200+ hosts on the waitlist. First month free for early access.
        </p>

        {submitted ? (
          <div className="mt-10 p-8 bg-emerald-50 rounded-xl border border-emerald-200">
            <p className="text-lg font-semibold text-primary">
              You&apos;re on the list. We&apos;ll be in touch.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                How many properties?
              </label>
              <select
                value={form.propertyCount}
                onChange={(e) => setForm({ ...form, propertyCount: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
              >
                <option value="1-3">1-3</option>
                <option value="4-10">4-10</option>
                <option value="10+">10+</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors text-lg disabled:opacity-50"
            >
              {loading ? "Joining..." : "Join Waitlist"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
