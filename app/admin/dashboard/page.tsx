"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Stats {
  totalWaitlist: number;
  totalHosts: number;
  totalProperties: number;
  totalJobs: number;
  totalPhotos: number;
  totalClaims: number;
  totalMessages: number;
  jobsByStatus: { _id: string; count: number }[];
  signupsThisWeek: number;
  hostsThisWeek: number;
  recentWaitlist: { _id: string; email: string; name?: string; createdAt: string }[];
  recentHosts: { _id: string; email: string; createdAt: string }[];
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    slate: "bg-slate-100 text-slate-600",
    cyan: "bg-cyan-50 text-cyan-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${colorMap[color] || colorMap.slate}`}>
          {icon}
        </div>
        <span className="text-sm text-slate-500 font-medium">{label}</span>
      </div>
      <p className="text-2xl font-semibold text-slate-900">{value.toLocaleString()}</p>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-slate-400",
  dispatched: "bg-blue-500",
  confirmed: "bg-cyan-500",
  in_progress: "bg-amber-500",
  complete: "bg-emerald-500",
  damage_flagged: "bg-rose-500",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const secret = sessionStorage.getItem("admin-secret");
    if (!secret) {
      router.push("/admin");
      return;
    }

    fetch("/api/admin/stats", {
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
        if (data) setStats(data);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (!stats) return null;

  const activeJobs = stats.jobsByStatus
    .filter((s) => s._id !== "complete" && s._id !== "damage_flagged")
    .reduce((a, b) => a + b.count, 0);

  const maxStatusCount = Math.max(...stats.jobsByStatus.map((s) => s.count), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of your HostIQ platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Waitlist" value={stats.totalWaitlist} icon="📋" color="violet" />
        <StatCard label="Hosts" value={stats.totalHosts} icon="🏠" color="emerald" />
        <StatCard label="Properties" value={stats.totalProperties} icon="🏢" color="blue" />
        <StatCard label="Jobs" value={stats.totalJobs} icon="🧹" color="amber" />
        <StatCard label="Photos" value={stats.totalPhotos} icon="📷" color="cyan" />
        <StatCard label="Claims" value={stats.totalClaims} icon="📄" color="rose" />
        <StatCard label="Messages" value={stats.totalMessages} icon="💬" color="slate" />
        <StatCard label="Active Jobs" value={activeJobs} icon="⚡" color="orange" />
      </div>

      {/* Weekly Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Signups this week</p>
          <p className="text-3xl font-semibold text-emerald-600">{stats.signupsThisWeek}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">New hosts this week</p>
          <p className="text-3xl font-semibold text-blue-600">{stats.hostsThisWeek}</p>
        </div>
      </div>

      {/* Jobs by Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-sm font-medium text-slate-500 mb-4">Jobs by Status</h2>
        <div className="space-y-3">
          {stats.jobsByStatus.length === 0 && (
            <p className="text-sm text-slate-400">No jobs yet</p>
          )}
          {stats.jobsByStatus.map((s) => (
            <div key={s._id} className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-600 w-28 shrink-0 capitalize">
                {s._id?.replace("_", " ") || "unknown"}
              </span>
              <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                <div
                  className={`h-full rounded-full ${STATUS_COLORS[s._id] || "bg-slate-400"} transition-all`}
                  style={{ width: `${(s.count / maxStatusCount) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-700 w-10 text-right">
                {s.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-sm font-medium text-slate-500 mb-4">Recent Waitlist Signups</h2>
          <div className="space-y-3">
            {stats.recentWaitlist.length === 0 && (
              <p className="text-sm text-slate-400">No signups yet</p>
            )}
            {stats.recentWaitlist.map((w) => (
              <div key={w._id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">{w.name || w.email}</p>
                  <p className="text-xs text-slate-400">{w.email}</p>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(w.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-sm font-medium text-slate-500 mb-4">Recent Hosts Joined</h2>
          <div className="space-y-3">
            {stats.recentHosts.length === 0 && (
              <p className="text-sm text-slate-400">No hosts yet</p>
            )}
            {stats.recentHosts.map((h) => (
              <div key={h._id} className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-900">{h.email}</p>
                <span className="text-xs text-slate-400">
                  {new Date(h.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
