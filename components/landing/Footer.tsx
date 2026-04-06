"use client";

export default function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-slate-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-xl font-bold text-primary">HostIQ</div>
          <p className="text-sm text-slate-500 mt-1">Your Airbnb on autopilot.</p>
        </div>
        <div className="flex gap-8 text-sm text-slate-600">
          <a href="#how-it-works" className="hover:text-dark transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-dark transition-colors">Pricing</a>
          <a href="#waitlist" className="hover:text-dark transition-colors">Contact</a>
        </div>
        <div className="text-sm text-slate-400">
          <p>Built in Toronto, Canada</p>
          <p>&copy; {new Date().getFullYear()} HostIQ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
