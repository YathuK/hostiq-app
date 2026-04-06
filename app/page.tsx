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
