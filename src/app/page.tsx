"use client";

import Navbar from "@/components/Navbar";
import PageBackground from "@/components/PageBackground";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import HomeHero from "@/components/HomeHero";
import TubeForgeSection from "@/components/TubeForgeSection";
import SecondaryToolsGrid from "@/components/SecondaryToolsGrid";
import WhyExpeditionSection from "@/components/WhyExpeditionSection";
import HomePricing from "@/components/HomePricing";
import TestimonialsMarquee from "@/components/TestimonialsMarquee";
import HomeYoutuberShowcase from "@/components/HomeYoutuberShowcase";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden relative text-white">
      <PageBackground />
      <Navbar />
      <WelcomeOverlay />
      <main className="w-full relative z-10">
        <HomeHero />
        <TestimonialsMarquee />
        <HomeYoutuberShowcase />
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
