"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface WaitlistEntry {
  _id: string;
  email: string;
  name?: string;
  propertyCount?: string;
  createdAt: string;
}

export default function AdminWaitlist() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const secret = sessionStorage.getItem("admin-secret");
    if (!secret) {
      router.push("/admin");
      return;
    }

    fetch("/api/admin/waitlist", {
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
        if (data) {
          setEntries(data.entries);
          setTotal(data.total);
        }
        setLoading(false);
      });
  }, [router]);

  const filtered = entries
    .filter(
      (e) =>
        e.email.toLowerCase().includes(search.toLowerCase()) ||
        (e.name && e.name.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortAsc ? da - db : db - da;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Waitlist</h1>
          <p className="text-sm text-slate-500 mt-1">{total} total signups</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search by email or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full max-w-sm"
        />
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 shrink-0"
        >
          Date {sortAsc ? "↑" : "↓"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-5 py-3 font-medium text-slate-500">Name</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Email</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Properties</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Date Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                    {search ? "No results found" : "No waitlist entries yet"}
                  </td>
                </tr>
              )}
              {filtered.map((entry, i) => (
                <tr
                  key={entry._id}
                  className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${
                    i % 2 === 1 ? "bg-slate-25" : ""
                  }`}
                >
                  <td className="px-5 py-3 text-slate-900 font-medium">
                    {entry.name || "--"}
                  </td>
                  <td className="px-5 py-3 text-slate-600">{entry.email}</td>
                  <td className="px-5 py-3 text-slate-600">{entry.propertyCount || "--"}</td>
                  <td className="px-5 py-3 text-slate-400">
                    {new Date(entry.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
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
