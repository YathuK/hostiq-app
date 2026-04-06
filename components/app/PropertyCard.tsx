"use client";

import StatusDot from "./StatusDot";
import Link from "next/link";

interface Job {
  _id: string;
  checkoutTime: string;
  status: string;
}

interface PropertyCardProps {
  property: {
    _id: string;
    name: string;
  };
  jobs: Job[];
}

export default function PropertyCard({ property, jobs }: PropertyCardProps) {
  const nextJob = jobs
    .filter((j) => new Date(j.checkoutTime) >= new Date())
    .sort((a, b) => new Date(a.checkoutTime).getTime() - new Date(b.checkoutTime).getTime())[0];

  const latestJob = jobs.sort(
    (a, b) => new Date(b.checkoutTime).getTime() - new Date(a.checkoutTime).getTime()
  )[0];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-dark">{property.name}</h3>
      {nextJob && (
        <p className="mt-2 text-sm text-slate-500">
          Next checkout:{" "}
          {new Date(nextJob.checkoutTime).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      )}
      {latestJob && (
        <div className="mt-3">
          <StatusDot status={latestJob.status} />
        </div>
      )}
      <div className="mt-4 flex gap-3">
        {latestJob && (latestJob.status === "complete" || latestJob.status === "damage_flagged") && (
          <Link
            href={`/job/${latestJob._id}`}
            className="text-sm font-medium text-primary hover:text-primary-dark"
          >
            View Report
          </Link>
        )}
      </div>
    </div>
  );
}
