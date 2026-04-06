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
      <div className="mt-4 flex items-center gap-3">
        <Link
          href={`/property/${property._id}/edit`}
          className="text-sm font-medium text-slate-500 hover:text-dark flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          Edit
        </Link>
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
