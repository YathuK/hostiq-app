"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PropertyCard from "@/components/app/PropertyCard";
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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

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

      // Sync calendars for all properties
      for (const prop of data.properties || []) {
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
    } catch (e) {
      console.error("Failed to load data:", e);
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-xl font-bold text-primary">HostIQ</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{session?.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-slate-500 hover:text-dark"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-dark">Properties</h1>
          <Link
            href="/setup"
            className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors text-sm"
          >
            Add Property
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">No properties yet.</p>
            <Link href="/setup" className="text-primary font-medium mt-2 inline-block">
              Add your first property
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <PropertyCard
                key={prop._id}
                property={prop}
                jobs={jobs.filter((j) => j.propertyId === prop._id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
