"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface JobEntry {
  _id: string;
  propertyId: { _id: string; name: string } | null;
  checkoutTime: string;
  status: string;
  cleanerPhone?: string;
  dispatchedAt?: string;
  completedAt?: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-slate-100 text-slate-700",
  dispatched: "bg-blue-50 text-blue-700",
  confirmed: "bg-cyan-50 text-cyan-700",
  in_progress: "bg-amber-50 text-amber-700",
  complete: "bg-emerald-50 text-emerald-700",
  damage_flagged: "bg-rose-50 text-rose-700",
};

export default function AdminJobs() {
  const [jobs, setJobs] = useState<JobEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const secret = sessionStorage.getItem("admin-secret");
    if (!secret) {
      router.push("/admin");
      return;
    }

    fetch("/api/admin/jobs", {
      headers: { "x-admin-secret": secret },
    })
      .then((r) => {
        if (!r.ok) {
          sessionStorage.removeItem("admin-secret");
          router.push("/admin");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setJobs(data.jobs);
        setLoading(false);
      });
  }, [router]);

  const filtered =
    statusFilter === "all"
      ? jobs
      : jobs.filter((j) => j.status === statusFilter);

  const statuses = ["all", "pending", "dispatched", "confirmed", "in_progress", "complete", "damage_flagged"];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Jobs</h1>
        <p className="text-sm text-slate-500 mt-1">Recent 50 jobs</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              statusFilter === s
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-5 py-3 font-medium text-slate-500">Property</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Checkout</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Status</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Cleaner</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Dispatched</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Completed</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    No jobs found
                  </td>
                </tr>
              )}
              {filtered.map((job, i) => (
                <tr
                  key={job._id}
                  className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${
                    i % 2 === 1 ? "bg-slate-25" : ""
                  }`}
                >
                  <td className="px-5 py-3 text-slate-900 font-medium">
                    {job.propertyId?.name || "Unknown"}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {new Date(job.checkoutTime).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    {new Date(job.checkoutTime).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        STATUS_STYLES[job.status] || STATUS_STYLES.pending
                      }`}
                    >
                      {job.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-600 font-mono text-xs">
                    {job.cleanerPhone || "--"}
                  </td>
                  <td className="px-5 py-3 text-slate-400 text-xs">
                    {job.dispatchedAt
                      ? new Date(job.dispatchedAt).toLocaleDateString()
                      : "--"}
                  </td>
                  <td className="px-5 py-3 text-slate-400 text-xs">
                    {job.completedAt
                      ? new Date(job.completedAt).toLocaleDateString()
                      : "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
