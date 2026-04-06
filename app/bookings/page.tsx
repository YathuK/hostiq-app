"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/app/AppShell";
import StatusDot from "@/components/app/StatusDot";
import Link from "next/link";

interface Property {
  _id: string;
  name: string;
  primaryCleaner?: { name: string; phone: string };
}

interface Job {
  _id: string;
  propertyId: string;
  checkoutTime: string;
  status: string;
  cleanerPhone?: string;
  dispatchedAt?: string;
}

type FilterTab = "all" | "upcoming" | "in_progress" | "completed";

function groupByDate(jobs: Job[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const groups: { label: string; jobs: Job[] }[] = [
    { label: "Today", jobs: [] },
    { label: "Tomorrow", jobs: [] },
    { label: "This Week", jobs: [] },
    { label: "Later", jobs: [] },
    { label: "Past", jobs: [] },
  ];

  for (const job of jobs) {
    const dt = new Date(job.checkoutTime);
    if (dt >= today && dt < tomorrow) {
      groups[0].jobs.push(job);
    } else if (dt >= tomorrow && dt < new Date(tomorrow.getTime() + 86400000)) {
      groups[1].jobs.push(job);
    } else if (dt >= tomorrow && dt < weekEnd) {
      groups[2].jobs.push(job);
    } else if (dt >= weekEnd) {
      groups[3].jobs.push(job);
    } else {
      groups[4].jobs.push(job);
    }
  }

  return groups.filter((g) => g.jobs.length > 0);
}

export default function BookingsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [dispatching, setDispatching] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") loadData();
  }, [status]);

  async function loadData() {
    try {
      const res = await fetch("/api/properties");
      const data = await res.json();
      setProperties(data.properties || []);
      setJobs(data.jobs || []);
    } catch (e) {
      console.error("Failed to load:", e);
    } finally {
      setLoading(false);
    }
  }

  async function syncAll() {
    setSyncing(true);
    try {
      for (const prop of properties) {
        try {
          const res = await fetch("/api/sync-calendar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ propertyId: prop._id }),
          });
          const data = await res.json();
          if (data.jobs) {
            setJobs((prev) => {
              const filtered = prev.filter((j) => j.propertyId !== prop._id);
              return [...filtered, ...data.jobs];
            });
          }
        } catch {}
      }
    } finally {
      setSyncing(false);
    }
  }

  async function dispatchCleaner(jobId: string) {
    setDispatching(jobId);
    try {
      await fetch("/api/dispatch-cleaner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      await loadData();
    } catch {
      alert("Failed to dispatch cleaner.");
    } finally {
      setDispatching(null);
    }
  }

  const getPropertyName = (propertyId: string) => {
    return properties.find((p) => p._id === propertyId)?.name || "Unknown";
  };

  const getCleanerName = (propertyId: string) => {
    return properties.find((p) => p._id === propertyId)?.primaryCleaner?.name || "";
  };

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === "all") return true;
    if (activeTab === "upcoming") return ["pending", "dispatched", "confirmed"].includes(job.status);
    if (activeTab === "in_progress") return job.status === "in_progress";
    if (activeTab === "completed") return ["complete", "damage_flagged"].includes(job.status);
    return true;
  }).sort((a, b) => new Date(a.checkoutTime).getTime() - new Date(b.checkoutTime).getTime());

  const grouped = groupByDate(filteredJobs);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "upcoming", label: "Upcoming" },
    { key: "in_progress", label: "In Progress" },
    { key: "completed", label: "Completed" },
  ];

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
            <h1 className="text-2xl font-bold text-dark">Bookings</h1>
            <p className="text-sm text-slate-500 mt-1">All cleaning jobs across your properties</p>
          </div>
          <button
            onClick={syncAll}
            disabled={syncing}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors text-sm disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            {syncing ? "Syncing..." : "Sync Calendars"}
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "bg-dark text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings list */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <p className="text-slate-500 text-lg">No bookings found</p>
            <p className="text-slate-400 text-sm mt-1">Sync your calendars to see upcoming checkouts</p>
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map((group) => (
              <div key={group.label}>
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  {group.label}
                </h2>
                <div className="space-y-3">
                  {group.jobs.map((job) => (
                    <div
                      key={job._id}
                      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1.5">
                            <h3 className="font-semibold text-dark truncate">
                              {getPropertyName(job.propertyId)}
                            </h3>
                            <StatusDot status={job.status} />
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {new Date(job.checkoutTime).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </span>
                            {getCleanerName(job.propertyId) && (
                              <span className="flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                                {getCleanerName(job.propertyId)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {job.status === "pending" && (
                            <button
                              onClick={() => dispatchCleaner(job._id)}
                              disabled={dispatching === job._id}
                              className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                            >
                              {dispatching === job._id ? "Sending..." : "Dispatch Cleaner"}
                            </button>
                          )}
                          {(job.status === "complete" || job.status === "damage_flagged") && (
                            <Link
                              href={`/job/${job._id}`}
                              className="px-4 py-2 bg-slate-100 text-dark text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                            >
                              View Report
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
