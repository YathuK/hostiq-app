"use client";

export default function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center grid-bg pt-16">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-emerald-400/15 via-emerald-300/5 to-transparent rounded-full blur-[100px] -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-500/5 to-transparent rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-6xl mx-auto px-6 py-24 relative z-10 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Now accepting early access hosts</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-dark tracking-tight leading-[1.05]">
            Your Airbnb
            <br />
            <span className="gradient-text">runs itself.</span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-slate-500 max-w-lg leading-relaxed">
            HostIQ watches your calendar, dispatches your cleaner, documents damage, and files your AirCover claims. <strong className="text-slate-700">Automatically.</strong>
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#waitlist"
              className="group px-8 py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary-dark transition-all text-lg inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
            >
              Join the Waitlist
              <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#how-it-works"
              className="px-8 py-4 border border-slate-200 text-dark font-semibold rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition-all text-lg"
            >
              See How It Works
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-14 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[
                "bg-emerald-500", "bg-blue-500", "bg-violet-500", "bg-orange-500", "bg-rose-500"
              ].map((bg, i) => (
                <div key={i} className={`w-10 h-10 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                  {["A", "M", "K", "S", "J"][i]}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-dark">200+ hosts on the waitlist</p>
              <p className="text-sm text-slate-400">First month free for early access</p>
            </div>
          </div>
        </div>

        {/* Hero visual - Floating dashboard preview */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:block w-[420px]">
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-6 glow-emerald rotate-1">
            <div className="flex items-center justify-between mb-5">
              <div className="text-sm font-bold text-dark">Today&apos;s Jobs</div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-primary font-semibold">3 Active</span>
            </div>
            {[
              { name: "Downtown Condo", time: "11:00 AM", status: "complete", color: "bg-green-400" },
              { name: "Waterfront Studio", time: "2:00 PM", status: "in progress", color: "bg-blue-400" },
              { name: "King West Loft", time: "4:00 PM", status: "dispatched", color: "bg-yellow-400" },
            ].map((job, i) => (
              <div key={i} className="flex items-center justify-between py-3.5 border-t border-slate-50">
                <div>
                  <p className="text-sm font-semibold text-dark">{job.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Checkout {job.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${job.color}`} />
                  <span className="text-xs text-slate-500 capitalize">{job.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
