"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const defaultChecklist = [
  "Vacuum all floors",
  "Mop hard surfaces",
  "Clean kitchen counters and appliances",
  "Sanitize bathrooms",
  "Change all bed linens",
  "Replace towels",
  "Take out trash and recycling",
  "Check for guest damage",
];

export default function SetupPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    icalUrl: "",
    accessCode: "",
    cleaningFee: "",
    primaryCleanerName: "",
    primaryCleanerPhone: "",
    backupCleanerName: "",
    backupCleanerPhone: "",
    checklist: defaultChecklist,
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          icalUrl: form.icalUrl,
          accessCode: form.accessCode,
          cleaningFee: Number(form.cleaningFee),
          primaryCleaner: { name: form.primaryCleanerName, phone: form.primaryCleanerPhone },
          backupCleaner: { name: form.backupCleanerName, phone: form.backupCleanerPhone },
          checklist: form.checklist.filter(Boolean),
        }),
      });
      router.push("/dashboard");
    } catch {
      alert("Failed to save property.");
    } finally {
      setLoading(false);
    }
  };

  const updateChecklist = (index: number, value: string) => {
    const updated = [...form.checklist];
    updated[index] = value;
    setForm({ ...form, checklist: updated });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="text-xl font-bold text-primary">HostIQ</div>
          <button onClick={() => router.push("/dashboard")} className="text-sm text-slate-500 hover:text-dark">
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-dark mb-8">Add Property</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg font-semibold text-dark">Property Details</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Property Nickname</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="e.g. Downtown Condo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Airbnb iCal URL</label>
              <input
                required
                value={form.icalUrl}
                onChange={(e) => setForm({ ...form, icalUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="https://www.airbnb.com/calendar/ical/..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Access Code</label>
                <input
                  value={form.accessCode}
                  onChange={(e) => setForm({ ...form, accessCode: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="e.g. 1234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cleaning Fee (CAD)</label>
                <input
                  type="number"
                  value={form.cleaningFee}
                  onChange={(e) => setForm({ ...form, cleaningFee: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="e.g. 120"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg font-semibold text-dark">Primary Cleaner</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  value={form.primaryCleanerName}
                  onChange={(e) => setForm({ ...form, primaryCleanerName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  value={form.primaryCleanerPhone}
                  onChange={(e) => setForm({ ...form, primaryCleanerPhone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="+1234567890"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg font-semibold text-dark">Backup Cleaner</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  value={form.backupCleanerName}
                  onChange={(e) => setForm({ ...form, backupCleanerName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  value={form.backupCleanerPhone}
                  onChange={(e) => setForm({ ...form, backupCleanerPhone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="+1234567890"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg font-semibold text-dark">Cleaning Checklist</h2>
            {form.checklist.map((item, i) => (
              <input
                key={i}
                value={item}
                onChange={(e) => updateChecklist(i, e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
              />
            ))}
            <button
              type="button"
              onClick={() => setForm({ ...form, checklist: [...form.checklist, ""] })}
              className="text-sm text-primary font-medium"
            >
              + Add item
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors text-lg disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Property"}
          </button>
        </form>
      </main>
    </div>
  );
}
