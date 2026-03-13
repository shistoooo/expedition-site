"use client";

import Navbar from "@/components/Navbar";
import PageBackground from "@/components/PageBackground";
import Hero from "@/components/Hero";
import TubeForgeSection from "@/components/TubeForgeSection";
import SecondaryToolsGrid from "@/components/SecondaryToolsGrid";
import WhyExpeditionSection from "@/components/WhyExpeditionSection";
import HomePricing from "@/components/HomePricing";
import TestimonialsMarquee from "@/components/TestimonialsMarquee";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden relative text-white">
      <PageBackground />
      <Navbar />
      <main className="w-full relative z-10">
        <Hero />
        <TestimonialsMarquee />
        <TubeForgeSection />
        <SecondaryToolsGrid />
        <WhyExpeditionSection />
        <HomePricing />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
