"use client";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Green glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-400/20 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3" />

      <div className="max-w-6xl mx-auto px-6 py-32 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold text-dark tracking-tight leading-[1.1]">
            Your Airbnb<br />runs itself.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
            HostIQ watches your calendar, dispatches your cleaner, documents damage, and files your AirCover claims. Automatically.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#waitlist"
              className="px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors text-lg"
            >
              Join the Waitlist
            </a>
            <a
              href="#how-it-works"
              className="px-8 py-4 border-2 border-slate-200 text-dark font-semibold rounded-xl hover:border-slate-300 transition-colors text-lg"
            >
              See How It Works
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
