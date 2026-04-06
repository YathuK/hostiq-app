"use client";

const features = [
  {
    title: "Calendar Sync",
    desc: "Connects to your Airbnb iCal. Detects every checkout automatically.",
  },
  {
    title: "Auto-Dispatch",
    desc: "SMS your cleaner the moment checkout happens.",
  },
  {
    title: "Backup Cleaner",
    desc: "Primary MIA? Backup gets texted in 45 minutes. You get notified.",
  },
  {
    title: "Photo Documentation",
    desc: "Every clean documented with timestamped room-by-room photos.",
  },
  {
    title: "AI Damage Detection",
    desc: "Claude scans every photo and flags issues before the next guest arrives.",
  },
  {
    title: "AirCover Claims",
    desc: "Professional claim narrative generated in one click. Export as PDF.",
  },
];

export default function Features() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-dark text-center">
          Everything in one autopilot.
        </h2>
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-8 rounded-xl border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all"
            >
              <h3 className="text-lg font-semibold text-dark">{f.title}</h3>
              <p className="mt-3 text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
