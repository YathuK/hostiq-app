"use client";

const items = [
  "Calendar Sync",
  "Auto-Dispatch SMS",
  "Backup Cleaner Failover",
  "Photo Documentation",
  "AI Damage Detection",
  "AirCover Claims",
  "Mobile Cleaner Portal",
  "PDF Export",
  "Multi-Property Dashboard",
  "Unlimited Cleans",
];

export default function Marquee() {
  return (
    <section className="py-8 bg-dark overflow-hidden">
      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="mx-8 text-sm font-medium text-white/60 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
