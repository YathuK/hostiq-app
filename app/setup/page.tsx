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
    checkInInstructions: "",
    checkOutInstructions: "",
    wifiName: "",
    wifiPassword: "",
    parkingInfo: "",
    houseRules: "",
    nearbyAttractions: "",
    emergencyContact: "",
    customNotes: "",
    autoRespond: false,
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
          guestContext: {
            checkInInstructions: form.checkInInstructions,
            checkOutInstructions: form.checkOutInstructions,
            wifiName: form.wifiName,
            wifiPassword: form.wifiPassword,
            parkingInfo: form.parkingInfo,
            houseRules: form.houseRules,
            nearbyAttractions: form.nearbyAttractions,
            emergencyContact: form.emergencyContact,
            customNotes: form.customNotes,
          },
          autoRespond: form.autoRespond,
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

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-dark">Guest AI Auto-Responder</h2>
                <p className="text-sm text-slate-500 mt-1">Provide property details so AI can answer guest questions automatically.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.autoRespond}
                  onChange={(e) => setForm({ ...form, autoRespond: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">WiFi Network Name</label>
                <input
                  value={form.wifiName}
                  onChange={(e) => setForm({ ...form, wifiName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="e.g. MyHomeWiFi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">WiFi Password</label>
                <input
                  value={form.wifiPassword}
                  onChange={(e) => setForm({ ...form, wifiPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="e.g. password123"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Check-in Instructions</label>
              <textarea
                value={form.checkInInstructions}
                onChange={(e) => setForm({ ...form, checkInInstructions: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none text-sm"
                placeholder="e.g. Check-in is at 3 PM. Use lockbox code 1234 at the front door..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Check-out Instructions</label>
              <textarea
                value={form.checkOutInstructions}
                onChange={(e) => setForm({ ...form, checkOutInstructions: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none text-sm"
                placeholder="e.g. Check-out by 11 AM. Leave keys on counter..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Parking Info</label>
              <input
                value={form.parkingInfo}
                onChange={(e) => setForm({ ...form, parkingInfo: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="e.g. Free parking in spot #12, underground garage"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">House Rules</label>
              <textarea
                value={form.houseRules}
                onChange={(e) => setForm({ ...form, houseRules: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none text-sm"
                placeholder="e.g. No smoking, no parties, quiet hours 10 PM-8 AM..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nearby Attractions & Recommendations</label>
              <textarea
                value={form.nearbyAttractions}
                onChange={(e) => setForm({ ...form, nearbyAttractions: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none text-sm"
                placeholder="e.g. St. Lawrence Market 5 min walk, CN Tower 10 min..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Contact</label>
              <input
                value={form.emergencyContact}
                onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="e.g. Call 416-555-0123 for emergencies"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Custom Notes</label>
              <textarea
                value={form.customNotes}
                onChange={(e) => setForm({ ...form, customNotes: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none text-sm"
                placeholder="Any other info the AI should know about..."
              />
            </div>
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
