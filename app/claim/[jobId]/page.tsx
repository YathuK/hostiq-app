"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface CostItem {
  item: string;
  cost: number;
}

export default function ClaimPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;

  const [guestName, setGuestName] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [costs, setCosts] = useState<CostItem[]>([{ item: "", cost: 0 }]);
  const [narrative, setNarrative] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const addCostItem = () => setCosts([...costs, { item: "", cost: 0 }]);
  const updateCost = (index: number, field: keyof CostItem, value: string | number) => {
    const updated = [...costs];
    (updated[index] as any)[field] = value;
    setCosts(updated);
  };

  const total = costs.reduce((sum, c) => sum + (Number(c.cost) || 0), 0);

  async function generateClaim() {
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          guestName,
          checkIn,
          checkOut,
          itemizedCosts: costs.filter((c) => c.item),
        }),
      });
      const data = await res.json();
      setNarrative(data.claim?.narrative || "Failed to generate narrative.");
      setGenerated(true);
    } catch {
      alert("Failed to generate claim");
    } finally {
      setGenerating(false);
    }
  }

  function printClaim() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-6 py-4 print:hidden">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="text-xl font-bold text-primary">HostIQ</div>
          <button onClick={() => router.push(`/job/${jobId}`)} className="text-sm text-slate-500 hover:text-dark">
            Back to Job
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-dark mb-8">AirCover Claim</h1>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-4 mb-6">
          <h2 className="text-lg font-semibold text-dark">Guest Details</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Guest Name</label>
            <input
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Check-in Date</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Check-out Date</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-4 mb-6">
          <h2 className="text-lg font-semibold text-dark">Itemized Costs</h2>
          {costs.map((c, i) => (
            <div key={i} className="grid grid-cols-[1fr_120px] gap-4">
              <input
                value={c.item}
                onChange={(e) => updateCost(i, "item", e.target.value)}
                placeholder="Item description"
                className="px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
              <input
                type="number"
                value={c.cost || ""}
                onChange={(e) => updateCost(i, "cost", Number(e.target.value))}
                placeholder="$ Cost"
                className="px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>
          ))}
          <button onClick={addCostItem} className="text-sm text-primary font-medium">
            + Add item
          </button>
          <div className="pt-3 border-t border-slate-100 flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {narrative && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-6">
            <h2 className="text-lg font-semibold text-dark mb-3">Claim Narrative</h2>
            <textarea
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm leading-relaxed"
            />
          </div>
        )}

        <div className="flex gap-4">
          {!generated ? (
            <button
              onClick={generateClaim}
              disabled={generating}
              className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark disabled:opacity-50"
            >
              {generating ? "Generating..." : "Generate Claim"}
            </button>
          ) : (
            <button
              onClick={printClaim}
              className="px-8 py-3 bg-dark text-white font-semibold rounded-xl hover:bg-slate-800"
            >
              Print to PDF
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
