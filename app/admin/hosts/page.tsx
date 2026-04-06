"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface HostEntry {
  _id: string;
  email: string;
  createdAt: string;
  propertyCount: number;
  jobCount: number;
  properties: { _id: string; name: string }[];
}

export default function AdminHosts() {
  const [hosts, setHosts] = useState<HostEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const secret = sessionStorage.getItem("admin-secret");
    if (!secret) {
      router.push("/admin");
      return;
    }

    fetch("/api/admin/hosts", {
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
        if (data) setHosts(data.hosts);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Hosts</h1>
        <p className="text-sm text-slate-500 mt-1">{hosts.length} total hosts</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-5 py-3 font-medium text-slate-500">Email</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Properties</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Jobs</th>
                <th className="text-left px-5 py-3 font-medium text-slate-500">Date Joined</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {hosts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    No hosts yet
                  </td>
                </tr>
              )}
              {hosts.map((host, i) => (
                <>
                  <tr
                    key={host._id}
                    className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer ${
                      i % 2 === 1 ? "bg-slate-25" : ""
                    }`}
                    onClick={() =>
                      setExpandedId(expandedId === host._id ? null : host._id)
                    }
                  >
                    <td className="px-5 py-3 text-slate-900 font-medium">{host.email}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {host.propertyCount}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                        {host.jobCount}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-400">
                      {new Date(host.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3 text-slate-400">
                      {expandedId === host._id ? "▲" : "▼"}
                    </td>
                  </tr>
                  {expandedId === host._id && (
                    <tr key={`${host._id}-expanded`} className="bg-slate-50/80">
                      <td colSpan={5} className="px-5 py-4">
                        <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                          Properties
                        </p>
                        {host.properties.length === 0 ? (
                          <p className="text-sm text-slate-400">No properties</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {host.properties.map((p) => (
                              <span
                                key={p._id}
                                className="inline-flex items-center px-3 py-1 rounded-lg text-sm bg-white border border-slate-200 text-slate-700"
                              >
                                {p.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
