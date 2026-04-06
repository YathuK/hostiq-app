"use client";

export default function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="text-lg font-bold text-dark">HostIQ</span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs">
              The AI autopilot for Airbnb hosts. Automated cleaning dispatch, damage detection, and AirCover claims.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div>
              <p className="text-xs font-semibold text-dark uppercase tracking-wider mb-3">Product</p>
              <div className="space-y-2 text-sm text-slate-500">
                <a href="#how-it-works" className="block hover:text-dark transition-colors">How It Works</a>
                <a href="#features" className="block hover:text-dark transition-colors">Features</a>
                <a href="#pricing" className="block hover:text-dark transition-colors">Pricing</a>
                <a href="#faq" className="block hover:text-dark transition-colors">FAQ</a>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-dark uppercase tracking-wider mb-3">Company</p>
              <div className="space-y-2 text-sm text-slate-500">
                <a href="#waitlist" className="block hover:text-dark transition-colors">Join Waitlist</a>
                <a href="mailto:hello@hostiq.app" className="block hover:text-dark transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} HostIQ. All rights reserved.</p>
          <p>Built in Toronto, Canada</p>
        </div>
      </div>
    </footer>
  );
}
