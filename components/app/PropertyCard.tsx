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
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-dark">{property.name}</h3>
        {latestJob && <StatusDot status={latestJob.status} />}
      </div>

      {nextJob && (
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          Next:{" "}
          {new Date(nextJob.checkoutTime).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </div>
      )}

      <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
        <Link
          href={`/property/${property._id}/edit`}
          className="text-sm font-medium text-slate-500 hover:text-dark flex items-center gap-1.5 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          Edit
        </Link>
        {latestJob && (latestJob.status === "complete" || latestJob.status === "damage_flagged") && (
          <Link
            href={`/job/${latestJob._id}`}
            className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            View Report
          </Link>
        )}
      </div>
    </div>
  );
}
