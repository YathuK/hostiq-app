import Link from "next/link";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Problems from "@/components/landing/Problems";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import WaitlistForm from "@/components/landing/WaitlistForm";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold text-primary">HostIQ</div>
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="text-sm text-slate-600 hover:text-dark hidden sm:block">How It Works</a>
            <a href="#pricing" className="text-sm text-slate-600 hover:text-dark hidden sm:block">Pricing</a>
            <Link
              href="/login"
              className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>
      <Hero />
      <HowItWorks />
      <Problems />
      <Features />
      <Pricing />
      <WaitlistForm />
      <Footer />
    </main>
  );
}
