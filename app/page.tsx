import Link from "next/link";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Problems from "@/components/landing/Problems";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import WaitlistForm from "@/components/landing/WaitlistForm";
import Footer from "@/components/landing/Footer";
import ScrollReveal from "@/components/landing/ScrollReveal";

// JSON-LD Structured Data for AI SEO and Google
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "HostIQ",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "HostIQ is an AI-powered autopilot for Airbnb hosts that automates cleaner dispatch, damage documentation, and AirCover insurance claim generation after every guest checkout.",
  url: "https://hostiq-app.vercel.app",
  offers: [
    {
      "@type": "Offer",
      name: "Solo Host",
      price: "39",
      priceCurrency: "CAD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "39",
        priceCurrency: "CAD",
        unitText: "MONTH",
        referenceQuantity: {
          "@type": "QuantitativeValue",
          value: "1",
          unitText: "property",
        },
      },
      description:
        "Full autopilot for solo Airbnb hosts. Includes automated cleaner dispatch, AI damage detection, AirCover claim generator, and unlimited cleans.",
    },
    {
      "@type": "Offer",
      name: "Property Manager",
      price: "29",
      priceCurrency: "CAD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "29",
        priceCurrency: "CAD",
        unitText: "MONTH",
        referenceQuantity: {
          "@type": "QuantitativeValue",
          value: "1",
          unitText: "property",
        },
      },
      description:
        "Volume pricing for property managers with 4+ Airbnb listings. Includes multi-property dashboard and priority support.",
    },
  ],
  featureList: [
    "Airbnb iCal calendar sync with automatic checkout detection",
    "Automated SMS cleaner dispatch with backup cleaner failover",
    "Room-by-room photo documentation with timestamps",
    "AI-powered damage detection using Claude computer vision",
    "One-click AirCover insurance claim generation with PDF export",
    "Mobile-friendly cleaner portal with no app download required",
  ],
  creator: {
    "@type": "Organization",
    name: "HostIQ",
    url: "https://hostiq-app.vercel.app",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toronto",
      addressRegion: "ON",
      addressCountry: "CA",
    },
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is HostIQ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HostIQ is an AI autopilot for Airbnb hosts. It automatically detects guest checkouts from your Airbnb calendar, dispatches your cleaner via SMS, collects room-by-room photo documentation, uses AI to detect damage, and generates professional AirCover insurance claims — all without manual intervention.",
      },
    },
    {
      "@type": "Question",
      name: "How does HostIQ detect when a guest checks out?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HostIQ syncs with your Airbnb iCal calendar feed. When a checkout date arrives, HostIQ automatically triggers the cleaning workflow — dispatching your cleaner, sending them the access code, and starting the documentation process.",
      },
    },
    {
      "@type": "Question",
      name: "How does the AI damage detection work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "After your cleaner uploads room-by-room photos through the mobile portal, HostIQ sends each photo to Claude AI for analysis. The AI identifies damage, stains, broken items, and cleanliness issues, then flags anything that needs attention before the next guest arrives.",
      },
    },
    {
      "@type": "Question",
      name: "How much does HostIQ cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HostIQ offers two plans: Solo Host at $39 CAD/month per property (includes full autopilot, damage documentation, AirCover claims, and unlimited cleans), and Property Manager at $29 CAD/month per property (includes everything in Solo plus multi-property dashboard, volume discount, and priority support).",
      },
    },
    {
      "@type": "Question",
      name: "Does the cleaner need to download an app?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Cleaners receive an SMS with a direct link to the job portal. They can confirm the job, view the checklist, upload photos, and mark the job complete — all from their phone browser. No app download required.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if my primary cleaner doesn't respond?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HostIQ automatically contacts your backup cleaner after 45 minutes if the primary cleaner hasn't confirmed the job. You'll also receive a notification so you're always in the loop.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ScrollReveal />
      <main className="overflow-hidden">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-slate-100/50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="text-lg font-bold text-dark">HostIQ</span>
            </Link>
            <div className="flex items-center gap-8">
              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
                <a href="#how-it-works" className="hover:text-dark transition-colors">How It Works</a>
                <a href="#features" className="hover:text-dark transition-colors">Features</a>
                <a href="#pricing" className="hover:text-dark transition-colors">Pricing</a>
                <a href="#faq" className="hover:text-dark transition-colors">FAQ</a>
              </div>
              <Link
                href="/login"
                className="px-5 py-2 bg-dark text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
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

        {/* FAQ Section for SEO */}
        <section id="faq" className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16 reveal">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">FAQ</p>
              <h2 className="text-3xl md:text-4xl font-bold text-dark">
                Frequently asked questions
              </h2>
            </div>
            <div className="space-y-6 reveal">
              {faqJsonLd.mainEntity.map((faq, i) => (
                <details key={i} className="group bg-white rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
                  <summary className="flex items-center justify-between cursor-pointer px-6 py-5 text-left font-semibold text-dark">
                    {faq.name}
                    <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                    {faq.acceptedAnswer.text}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <WaitlistForm />
        <Footer />
      </main>
    </>
  );
}
