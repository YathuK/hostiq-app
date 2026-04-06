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

const steps = [
  { key: "confirm", label: "Confirm", statuses: ["dispatched"] },
  { key: "clean", label: "Clean", statuses: ["confirmed", "in_progress"] },
  { key: "photos", label: "Photos", statuses: ["in_progress"] },
  { key: "done", label: "Done", statuses: ["complete", "damage_flagged"] },
];

function getStepIndex(status: string): number {
  if (status === "dispatched") return 0;
  if (status === "confirmed") return 1;
  if (status === "in_progress") return 2;
  if (status === "complete" || status === "damage_flagged") return 3;
  return 0;
}

export default function CleanerPage() {
  const params = useParams();
  const token = params.token as string;
  const [job, setJob] = useState<JobInfo | null>(null);
  const [activeRoom, setActiveRoom] = useState("Living Room");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
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

  function toggleCheck(index: number) {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-dark mb-1">Link Expired</p>
          <p className="text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 animate-spin text-emerald-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  const currentStep = getStepIndex(job.status);
  const roomPhotos = job.photos.filter((p) => p.room === activeRoom);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Green Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white px-6 pt-8 pb-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <span className="text-sm font-medium text-white/80">HostIQ</span>
          </div>

          <h1 className="text-2xl font-bold">{job.property.name}</h1>

          <div className="mt-4 flex items-center gap-6">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3">
              <p className="text-xs text-white/70 mb-0.5">Access Code</p>
              <p className="text-2xl font-bold tracking-wider">{job.property.accessCode || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-white/70 mb-0.5">Checkout</p>
              <p className="text-sm font-medium">
                {new Date(job.checkoutTime).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-lg font-bold">
                {new Date(job.checkoutTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      i <= currentStep
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {i < currentStep ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-medium mt-1.5 ${
                      i <= currentStep ? "text-emerald-700" : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 mt-[-16px] transition-colors ${
                      i < currentStep ? "bg-emerald-600" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1">
        <div className="max-w-lg mx-auto">
          {/* Status Actions */}
          <div className="px-6 py-6">
            {job.status === "dispatched" && (
              <button
                onClick={() => handleAction("confirm")}
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl text-lg active:scale-[0.98] transition-transform shadow-lg shadow-emerald-600/25 min-h-[56px]"
              >
                CONFIRM JOB
              </button>
            )}
            {job.status === "confirmed" && (
              <button
                onClick={() => handleAction("start")}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl text-lg active:scale-[0.98] transition-transform shadow-lg shadow-blue-600/25 min-h-[56px]"
              >
                START CLEANING
              </button>
            )}
            {job.status === "in_progress" && (
              <button
                onClick={() => handleAction("complete")}
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl text-lg active:scale-[0.98] transition-transform shadow-lg shadow-emerald-600/25 min-h-[56px]"
              >
                MARK COMPLETE
              </button>
            )}
            {(job.status === "complete" || job.status === "damage_flagged") && (
              <div className="text-center py-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                <svg className="w-10 h-10 text-emerald-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-emerald-800 font-bold text-lg">Job Complete</p>
                <p className="text-emerald-600 text-sm mt-1">Thank you for your work!</p>
              </div>
            )}
          </div>

          {/* Checklist */}
          {job.property.checklist.length > 0 && (
            <div className="px-6 pb-6">
              <h2 className="text-lg font-bold text-dark mb-4">Cleaning Checklist</h2>
              <div className="space-y-2">
                {job.property.checklist.map((item, i) => (
                  <label
                    key={i}
                    className={`flex items-center gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      checkedItems.has(i)
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-white border-slate-100 hover:border-slate-200"
                    }`}
                    onClick={() => toggleCheck(i)}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all checkbox-animated ${
                        checkedItems.has(i)
                          ? "bg-emerald-600 border-emerald-600"
                          : "border-slate-300"
                      }`}
                    >
                      {checkedItems.has(i) && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-sm transition-all ${
                        checkedItems.has(i) ? "text-emerald-800 line-through" : "text-slate-700"
                      }`}
                    >
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Photo Upload */}
          {(job.status === "confirmed" || job.status === "in_progress") && (
            <div className="px-6 pb-6">
              <h2 className="text-lg font-bold text-dark mb-4">Upload Photos</h2>

              {/* Room pills - horizontal scroll */}
              <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-hide">
                {rooms.map((room) => (
                  <button
                    key={room}
                    onClick={() => setActiveRoom(room)}
                    className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all min-h-[40px] ${
                      activeRoom === room
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {room}
                  </button>
                ))}
              </div>

              {/* Photo grid */}
              <div className="grid grid-cols-3 gap-2.5 mt-4">
                {roomPhotos.map((photo) => (
                  <div key={photo._id} className="rounded-xl overflow-hidden border border-slate-200 aspect-square">
                    <img src={photo.imageBase64} alt={photo.room} className="w-full h-full object-cover" />
                  </div>
                ))}

                {/* Upload button as grid item */}
                <label className="cursor-pointer">
                  <div className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-400 hover:text-emerald-500 transition-colors active:bg-slate-50">
                    {uploading ? (
                      <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <>
                        <svg className="w-7 h-7 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                        </svg>
                        <span className="text-xs font-medium">Add</span>
                      </>
                    )}
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
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center border-t border-slate-100 mt-auto">
        <p className="text-xs text-slate-400">
          Powered by <span className="font-medium text-slate-500">HostIQ</span>
        </p>
      </div>
    </div>
  );
}
