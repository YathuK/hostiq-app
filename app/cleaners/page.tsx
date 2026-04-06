"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/app/AppShell";

interface CleanerItem {
  _id: string;
  name: string;
  phone: string;
  email: string;
  rating: number;
  jobsCompleted: number;
  status: string;
  createdAt: string;
}

export default function CleanersPage() {
  const { status } = useSession();
  const router = useRouter();
  const [cleaners, setCleaners] = useState<CleanerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") loadCleaners();
  }, [status]);

  async function loadCleaners() {
    try {
      const res = await fetch("/api/cleaners");
      const data = await res.json();
      setCleaners(data.cleaners || []);
    } catch (e) {
      console.error("Failed to load cleaners:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/cleaners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ name: "", phone: "", email: "" });
      setShowModal(false);
      await loadCleaners();
    } catch {
      alert("Failed to add cleaner.");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-screen">
          <p className="text-slate-500">Loading...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="px-6 pt-8 pb-12 lg:px-10 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-dark">Cleaners</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your cleaning team</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Cleaner
          </button>
        </div>

        {/* Cleaners grid */}
        {cleaners.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <p className="text-slate-500 text-lg">No cleaners yet</p>
            <p className="text-slate-400 text-sm mt-1">Add your first cleaner to get started</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors text-sm"
            >
              Add Cleaner
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cleaners.map((cleaner) => (
              <div
                key={cleaner._id}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-emerald-700">
                        {cleaner.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark">{cleaner.name}</h3>
                      <p className="text-sm text-slate-500">{cleaner.phone}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      cleaner.status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {cleaner.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
                {cleaner.email && (
                  <p className="text-sm text-slate-400 mb-3 truncate">{cleaner.email}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {cleaner.rating.toFixed(1)}
                  </span>
                  <span>{cleaner.jobsCompleted} jobs</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Cleaner Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-dark">Add Cleaner</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-dark hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="e.g. Maria Santos"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">Phone</label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-1.5">Email (optional)</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="maria@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {saving ? "Adding..." : "Add Cleaner"}
              </button>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
