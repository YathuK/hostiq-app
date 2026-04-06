"use client";

const problems = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
    title: "Chasing cleaners",
    desc: "Texting, calling, hoping they show up. Every single checkout. It's a full-time job you didn't sign up for.",
    stat: "3+ hours/week",
    statLabel: "wasted on coordination",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Missing damage",
    desc: "Evidence disappears before you notice. Next guest checks in. Airbnb won't pay without timestamped proof.",
    stat: "$1,200",
    statLabel: "avg unclaimed damage/year",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: "Writing claims yourself",
    desc: "Hours spent writing damage reports, organizing photos, calculating costs. A task that should take one click.",
    stat: "45 min",
    statLabel: "per claim, manually",
  },
];

export default function Problems() {
  return (
    <section className="py-28 px-6 bg-slate-50/50">
      <div className="max-w-6xl mx-auto">
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
              className="bg-white rounded-2xl p-8 border border-slate-100 hover-lift"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-6">
                {p.icon}
              </div>
              <h3 className="text-xl font-bold text-dark">{p.title}</h3>
              <p className="mt-3 text-slate-500 leading-relaxed">{p.desc}</p>
              <div className="mt-6 pt-6 border-t border-slate-50">
                <p className="text-2xl font-bold text-dark">{p.stat}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">{p.statLabel}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
