"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import StatusDot from "@/components/app/StatusDot";
import Link from "next/link";

interface Photo {
  _id: string;
  room: string;
  imageBase64: string;
  damageFlagged: boolean;
  aiNotes: string;
}

interface JobData {
  _id: string;
  status: string;
  checkoutTime: string;
  dispatchedAt: string;
  confirmedAt: string;
  completedAt: string;
  createdAt: string;
}

export default function JobPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;
  const [job, setJob] = useState<JobData | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [activeRoom, setActiveRoom] = useState("all");
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (jobId) loadJob();
  }, [jobId]);

  async function loadJob() {
    const res = await fetch(`/api/job/${jobId}`);
    const data = await res.json();
    setJob(data.job);
    setPhotos(data.photos || []);
  }

  async function runAnalysis() {
    setAnalyzing(true);
    try {
      await fetch("/api/analyze-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      await loadJob();
    } catch {
      alert("Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  }

  const rooms = ["all", ...Array.from(new Set(photos.map((p) => p.room)))];
  const filteredPhotos = activeRoom === "all" ? photos : photos.filter((p) => p.room === activeRoom);
  const damagePhotos = photos.filter((p) => p.damageFlagged);

  if (!job) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-xl font-bold text-primary">HostIQ</div>
          <button onClick={() => router.push("/dashboard")} className="text-sm text-slate-500 hover:text-dark">
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-dark">Job Report</h1>
          <StatusDot status={job.status} />
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-6">
          <h2 className="text-lg font-semibold text-dark mb-4">Timeline</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Checkout</span>
              <span>{new Date(job.checkoutTime).toLocaleString()}</span>
            </div>
            {job.dispatchedAt && (
              <div className="flex justify-between">
                <span className="text-slate-500">Dispatched</span>
                <span>{new Date(job.dispatchedAt).toLocaleString()}</span>
              </div>
            )}
            {job.confirmedAt && (
              <div className="flex justify-between">
                <span className="text-slate-500">Confirmed</span>
                <span>{new Date(job.confirmedAt).toLocaleString()}</span>
              </div>
            )}
            {job.completedAt && (
              <div className="flex justify-between">
                <span className="text-slate-500">Completed</span>
                <span>{new Date(job.completedAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* AI Damage Summary */}
        {damagePhotos.length > 0 && (
          <div className="bg-red-50 rounded-xl p-6 border border-red-200 mb-6">
            <h2 className="text-lg font-semibold text-red-800 mb-3">Damage Detected</h2>
            <ul className="space-y-2">
              {damagePhotos.map((p) => (
                <li key={p._id} className="text-sm text-red-700">
                  <strong>{p.room}:</strong> {p.aiNotes}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Room tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {rooms.map((room) => (
            <button
              key={room}
              onClick={() => setActiveRoom(room)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                activeRoom === room
                  ? "bg-primary text-white"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              {room.charAt(0).toUpperCase() + room.slice(1)}
            </button>
          ))}
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {filteredPhotos.map((photo) => (
            <div
              key={photo._id}
              className={`rounded-xl overflow-hidden border-2 ${
                photo.damageFlagged ? "border-red-400" : "border-slate-100"
              }`}
            >
              <img src={photo.imageBase64} alt={photo.room} className="w-full h-40 object-cover" />
              <div className="p-3">
                <p className="text-xs font-medium text-slate-500">{photo.room}</p>
                {photo.aiNotes && (
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{photo.aiNotes}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          {photos.length > 0 && !photos[0].aiNotes && (
            <button
              onClick={runAnalysis}
              disabled={analyzing}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark disabled:opacity-50"
            >
              {analyzing ? "Analyzing..." : "Run AI Analysis"}
            </button>
          )}
          {job.status === "damage_flagged" && (
            <Link
              href={`/claim/${jobId}`}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700"
            >
              Generate AirCover Claim
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
