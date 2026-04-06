"use client";

const steps = [
  {
    num: "01",
    title: "Guest checks out",
    desc: "HostIQ detects checkout via your Airbnb calendar instantly.",
  },
  {
    num: "02",
    title: "Cleaner dispatched",
    desc: "Your cleaner gets an SMS with the job link and access code. Backup cleaner queued automatically.",
  },
  {
    num: "03",
    title: "Cleaner documents",
    desc: "Cleaner uploads room-by-room photos through a simple mobile link. No app download.",
  },
  {
    num: "04",
    title: "AI scans for damage",
    desc: "Claude AI analyzes every photo and flags damage, stains, and missing items before the next guest arrives.",
  },
  {
    num: "05",
    title: "Claim generated",
    desc: "One click generates a professional AirCover claim with photos, narrative, and itemized costs. Ready to submit.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-dark text-center">
          The 3-hour window, handled.
        </h2>
        <div className="mt-16 space-y-0">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-6 md:gap-10 group">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {step.num}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px h-full bg-emerald-200 min-h-[60px]" />
                )}
              </div>
              <div className="pb-12">
                <h3 className="text-xl font-semibold text-dark">{step.title}</h3>
                <p className="mt-2 text-slate-600 max-w-md">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
