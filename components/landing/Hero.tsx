"use client";

export default function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center grid-bg pt-16 overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-[120px] animate-blob" />
      <div className="absolute top-40 right-60 w-[400px] h-[400px] bg-emerald-300/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
      <div className="absolute bottom-20 left-10 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] animate-blob animation-delay-4000" />

      {/* Decorative spinning ring */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] hidden lg:block">
        <div className="w-full h-full rounded-full border border-dashed border-emerald-200/30 spin-slow" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-24 relative z-10 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="hero-badge inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white border border-emerald-100 shadow-sm mb-8">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            <span className="text-sm font-medium text-slate-600">Now accepting early access hosts</span>
          </div>

          <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-dark tracking-tight leading-[1.05]">
            Your Airbnb
            <br />
            <span className="gradient-text-animated">runs itself.</span>
          </h1>

          <p className="hero-subtitle mt-8 text-lg md:text-xl text-slate-500 max-w-lg leading-relaxed">
            HostIQ watches your calendar, dispatches your cleaner, documents damage, and files your AirCover claims. <strong className="text-slate-700">Automatically.</strong>
          </p>

          <div className="hero-buttons mt-10 flex flex-wrap gap-4">
            <a
              href="#waitlist"
              className="btn-shine group px-8 py-4 bg-primary text-white font-semibold rounded-2xl hover:bg-primary-dark transition-all text-lg inline-flex items-center gap-2.5 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              Join the Waitlist
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#how-it-works"
              className="px-8 py-4 bg-white border border-slate-200 text-dark font-semibold rounded-2xl hover:border-slate-300 hover:shadow-lg transition-all text-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              See How It Works
            </a>
          </div>

          {/* Social proof */}
          <div className="hero-social mt-14 flex items-center gap-5">
            <div className="flex -space-x-3">
              {[
                "bg-gradient-to-br from-emerald-400 to-emerald-600",
                "bg-gradient-to-br from-blue-400 to-blue-600",
                "bg-gradient-to-br from-violet-400 to-violet-600",
                "bg-gradient-to-br from-orange-400 to-orange-600",
                "bg-gradient-to-br from-rose-400 to-rose-600",
              ].map((bg, i) => (
                <div key={i} className={`avatar-pop w-10 h-10 rounded-full ${bg} border-[3px] border-white flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                  {["A", "M", "K", "S", "J"][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm font-semibold text-dark">200+ hosts on the waitlist</p>
            </div>
          </div>
        </div>

        {/* Floating dashboard preview */}
        <div className="hero-dashboard absolute right-0 top-1/2 -translate-y-1/2 hidden xl:block w-[440px]">
          <div className="hero-dashboard-idle bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-100 p-6 relative">
            {/* Glow behind card */}
            <div className="absolute -inset-4 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-[2rem] blur-xl -z-10" />

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-dark">Today&apos;s Jobs</span>
              </div>
              <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-primary font-bold">3 Active</span>
            </div>
            {[
              { name: "Downtown Condo", time: "11:00 AM", status: "Complete", color: "bg-green-400", ring: "ring-green-100" },
              { name: "Waterfront Studio", time: "2:00 PM", status: "In Progress", color: "bg-blue-400", ring: "ring-blue-100" },
              { name: "King West Loft", time: "4:00 PM", status: "Dispatched", color: "bg-yellow-400", ring: "ring-yellow-100" },
            ].map((job, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-t border-slate-50 group">
                <div>
                  <p className="text-sm font-semibold text-dark group-hover:text-primary transition-colors">{job.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Checkout {job.time}</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${job.color} ring-4 ${job.ring}`} />
                  <span className="text-xs text-slate-500 font-medium">{job.status}</span>
                </div>
              </div>
            ))}
            {/* Mini action bar */}
            <div className="mt-2 pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-400">Last synced 2 min ago</span>
              <div className="flex items-center gap-1 text-xs text-primary font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Live
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
