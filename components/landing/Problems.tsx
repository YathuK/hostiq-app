"use client";

const problems = [
  {
    title: "Chasing cleaners",
    desc: "Texting, calling, hoping they show up. Every single checkout.",
  },
  {
    title: "Missing damage",
    desc: "Evidence disappears before you notice. Airbnb won't pay without proof.",
  },
  {
    title: "Writing claims yourself",
    desc: "Hours spent writing damage reports that should take one click.",
  },
];

export default function Problems() {
  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-dark text-center">
          You&apos;re doing too much.
        </h2>
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {problems.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-8 shadow-sm border border-slate-100"
            >
              <h3 className="text-xl font-semibold text-dark">{p.title}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
