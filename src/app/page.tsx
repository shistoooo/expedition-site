"use client";

import Navbar from "@/components/Navbar";
import PageBackground from "@/components/PageBackground";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import HomeHero from "@/components/HomeHero";
import HomeDemoVideo from "@/components/HomeDemoVideo";
import TubeForgeSection from "@/components/TubeForgeSection";
import HomePersonas from "@/components/HomePersonas";
import HomeYoutuberShowcase from "@/components/HomeYoutuberShowcase";
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
      <WelcomeOverlay />
      <main className="w-full relative z-10">
        <HomeHero />
        <HomeDemoVideo />
        <TubeForgeSection />
        <HomePersonas />
        <HomeYoutuberShowcase />
        <SecondaryToolsGrid />
        <WhyExpeditionSection />
        <HomePricing />
        <TestimonialsMarquee />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
