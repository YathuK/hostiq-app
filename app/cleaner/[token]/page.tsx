"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface JobInfo {
  _id: string;
  status: string;
  checkoutTime: string;
  property: {
    name: string;
    accessCode: string;
    checklist: string[];
  };
  photos: { _id: string; room: string; imageBase64: string }[];
}

const rooms = ["Living Room", "Bedroom", "Bathroom", "Kitchen", "Other"];

export default function CleanerPage() {
  const params = useParams();
  const token = params.token as string;
  const [job, setJob] = useState<JobInfo | null>(null);
  const [activeRoom, setActiveRoom] = useState("Living Room");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (token) loadJob();
  }, [token]);

  async function loadJob() {
    try {
      const res = await fetch(`/api/cleaner/${token}`);
      if (!res.ok) {
        setError("Invalid or expired link.");
        return;
      }
      const data = await res.json();
      setJob(data);
    } catch {
      setError("Failed to load job.");
    }
  }

  async function handleAction(action: string) {
    await fetch("/api/cleaner-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, action }),
    });
    await loadJob();
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !job) return;
    setUploading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      await fetch("/api/upload-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job._id,
          room: activeRoom,
          imageBase64: base64,
        }),
      });
      await loadJob();
      setUploading(false);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  const roomPhotos = job.photos.filter((p) => p.room === activeRoom);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-primary text-white px-6 py-6">
        <div className="text-sm font-medium opacity-80">HostIQ Cleaning Job</div>
        <h1 className="text-xl font-bold mt-1">{job.property.name}</h1>
        <div className="mt-3 flex gap-4 text-sm">
          <div>
            <span className="opacity-70">Access Code:</span>{" "}
            <span className="font-bold text-lg">{job.property.accessCode}</span>
          </div>
          <div>
            <span className="opacity-70">Checkout:</span>{" "}
            {new Date(job.checkoutTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>

      {/* Status Actions */}
      <div className="px-6 py-6 border-b border-slate-100">
        {job.status === "dispatched" && (
          <button
            onClick={() => handleAction("confirm")}
            className="w-full py-4 bg-primary text-white font-bold rounded-xl text-lg active:scale-[0.98] transition-transform"
          >
            CONFIRM JOB
          </button>
        )}
        {job.status === "confirmed" && (
          <button
            onClick={() => handleAction("start")}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl text-lg active:scale-[0.98] transition-transform"
          >
            START CLEANING
          </button>
        )}
        {job.status === "in_progress" && (
          <button
            onClick={() => handleAction("complete")}
            className="w-full py-4 bg-primary text-white font-bold rounded-xl text-lg active:scale-[0.98] transition-transform"
          >
            JOB COMPLETE
          </button>
        )}
        {(job.status === "complete" || job.status === "damage_flagged") && (
          <div className="text-center py-4 bg-emerald-50 rounded-xl text-primary font-semibold">
            Job Complete - Thank You!
          </div>
        )}
      </div>

      {/* Checklist */}
      {job.property.checklist.length > 0 && (
        <div className="px-6 py-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-dark mb-3">Checklist</h2>
          <ul className="space-y-2">
            {job.property.checklist.map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 rounded accent-primary" />
                <span className="text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Photo Upload */}
      {(job.status === "confirmed" || job.status === "in_progress") && (
        <div className="px-6 py-6">
          <h2 className="text-lg font-semibold text-dark mb-4">Upload Photos</h2>

          {/* Room tabs */}
          <div className="flex gap-2 overflow-x-auto pb-3">
            {rooms.map((room) => (
              <button
                key={room}
                onClick={() => setActiveRoom(room)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap ${
                  activeRoom === room
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {room}
              </button>
            ))}
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {roomPhotos.map((photo) => (
              <div key={photo._id} className="rounded-xl overflow-hidden border border-slate-200">
                <img src={photo.imageBase64} alt={photo.room} className="w-full h-32 object-cover" />
              </div>
            ))}
          </div>

          {/* Upload button */}
          <label className="mt-4 block">
            <div className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-center text-slate-500 font-medium active:bg-slate-50 cursor-pointer">
              {uploading ? "Uploading..." : "Tap to Upload Photo"}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      )}
    </div>
  );
}
