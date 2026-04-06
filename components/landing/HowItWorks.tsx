"use client";

const steps = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Guest checks out",
    desc: "HostIQ detects checkout via your Airbnb calendar instantly. No manual tracking, no missed turnovers.",
    color: "from-emerald-400 to-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: "Cleaner dispatched",
    desc: "Your cleaner gets an SMS with the job link and access code. Backup cleaner queued automatically if no response in 45 minutes.",
    color: "from-blue-400 to-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Cleaner documents",
    desc: "Room-by-room photos uploaded through a simple mobile link. No app download required — works on any phone browser.",
    color: "from-violet-400 to-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: "AI scans for damage",
    desc: "Claude AI analyzes every photo. Flags damage, stains, broken items, and missing amenities before the next guest arrives.",
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Claim generated",
    desc: "One click generates a professional AirCover claim with photos, narrative, and itemized costs. Export as PDF and submit.",
    color: "from-rose-400 to-rose-600",
    bg: "bg-rose-50",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 reveal">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">How It Works</p>
          <h2 className="text-3xl md:text-5xl font-bold text-dark">
            The 3-hour window, <span className="gradient-text">handled</span>.
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            From checkout to next-guest ready. Five steps, zero manual work.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className={`flex gap-6 md:gap-8 ${i % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}>
              {/* Timeline */}
              <div className="flex flex-col items-center shrink-0">
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg relative`}>
                  {step.icon}
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-white text-[10px] font-bold text-slate-500 flex items-center justify-center shadow-sm border border-slate-100">
                    {i + 1}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 min-h-[40px] bg-gradient-to-b from-slate-200 to-transparent my-3" />
                )}
              </div>
              {/* Content */}
              <div className="pb-12 pt-1">
                <h3 className="text-xl font-bold text-dark">{step.title}</h3>
                <p className="mt-2 text-slate-500 leading-relaxed max-w-md">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
