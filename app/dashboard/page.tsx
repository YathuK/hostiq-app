"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PropertyCard from "@/components/app/PropertyCard";
import AppShell from "@/components/app/AppShell";
import Link from "next/link";

interface Property {
  _id: string;
  name: string;
}

interface Job {
  _id: string;
  propertyId: string;
  checkoutTime: string;
  status: string;
}

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      loadData();
    }
  }, [status]);

  async function loadData() {
    try {
      const res = await fetch("/api/properties");
      const data = await res.json();
      setProperties(data.properties || []);
      setJobs(data.jobs || []);
    } catch (e) {
      console.error("Failed to load data:", e);
    } finally {
      setLoading(false);
    }
  }

  async function syncAll() {
    setSyncing(true);
    try {
      for (const prop of properties) {
        try {
          const syncRes = await fetch("/api/sync-calendar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ propertyId: prop._id }),
          });
          const syncData = await syncRes.json();
          if (syncData.jobs) {
            setJobs((prev) => {
              const filtered = prev.filter((j) => j.propertyId !== prop._id);
              return [...filtered, ...syncData.jobs];
            });
          }
        } catch {}
      }
    } finally {
      setSyncing(false);
    }
  }

  const activeJobs = jobs.filter((j) =>
    ["dispatched", "confirmed", "in_progress"].includes(j.status)
  );
  const completedThisMonth = jobs.filter((j) => {
    if (j.status !== "complete" && j.status !== "damage_flagged") return false;
    const d = new Date(j.checkoutTime);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const damageFlagged = jobs.filter((j) => j.status === "damage_flagged");

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
      <div className="px-6 pt-8 pb-12 lg:px-10 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-dark">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Overview of your properties and jobs</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={syncAll}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-dark font-medium rounded-xl hover:bg-slate-50 transition-colors text-sm disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
              {syncing ? "Syncing..." : "Sync All"}
            </button>
            <Link
              href="/setup"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Property
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-dark">{properties.length}</p>
            <p className="text-sm text-slate-500">Total Properties</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-dark">{activeJobs.length}</p>
            <p className="text-sm text-slate-500">Active Jobs</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-dark">{completedThisMonth.length}</p>
            <p className="text-sm text-slate-500">Completed This Month</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-dark">{damageFlagged.length}</p>
            <p className="text-sm text-slate-500">Damage Flagged</p>
          </div>
        </div>

        {/* Properties */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-dark">Properties</h2>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <p className="text-slate-500 text-lg">No properties yet</p>
            <Link href="/setup" className="text-primary font-medium mt-2 inline-block">
              Add your first property
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((prop) => (
              <PropertyCard
                key={prop._id}
                property={prop}
                jobs={jobs.filter((j) => j.propertyId === prop._id)}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
