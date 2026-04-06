"use client";

const problems = [
  {
    emoji: "📱",
    title: "Chasing cleaners",
    desc: "Texting, calling, hoping they show up. Every single checkout. It's a full-time job you didn't sign up for.",
    stat: "3+",
    statUnit: "hrs/week",
    statLabel: "wasted on coordination",
  },
  {
    emoji: "🔍",
    title: "Missing damage",
    desc: "Evidence disappears before you notice. Next guest checks in. Airbnb won't pay without timestamped proof.",
    stat: "$1.2K",
    statUnit: "/year",
    statLabel: "avg unclaimed damage",
  },
  {
    emoji: "📝",
    title: "Writing claims yourself",
    desc: "Hours spent writing damage reports, organizing photos, calculating costs. A task that should take one click.",
    stat: "45",
    statUnit: "min",
    statLabel: "per claim, manually",
  },
];

export default function Problems() {
  return (
    <section className="py-28 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-red-50/30" />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-20 reveal">
          <p className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-3">The Problem</p>
          <h2 className="text-3xl md:text-5xl font-bold text-dark">
            You&apos;re doing too much.
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            Every checkout creates a cascade of manual tasks. It doesn&apos;t have to.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 stagger">
          {problems.map((p, i) => (
            <article
              key={i}
              className="group bg-white rounded-3xl p-8 border border-slate-100 hover-glow relative overflow-hidden"
            >
              {/* Shimmer overlay on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute inset-0 shimmer" />
              </div>

              <div className="relative">
                <span className="text-4xl block mb-5">{p.emoji}</span>
                <h3 className="text-xl font-bold text-dark">{p.title}</h3>
                <p className="mt-3 text-slate-500 leading-relaxed text-[15px]">{p.desc}</p>
                <div className="mt-8 pt-6 border-t border-slate-50">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-dark">{p.stat}</span>
                    <span className="text-lg font-semibold text-slate-400">{p.statUnit}</span>
                  </div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">{p.statLabel}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
