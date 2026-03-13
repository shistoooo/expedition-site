"use client";

import Navbar from "@/components/Navbar";
import CursorGlow from "@/components/CursorGlow";
import PageBackground from "@/components/PageBackground";
import Hero from "@/components/Hero";
import ToolsSection from "@/components/ToolsSection";
import TubeForgeSection from "@/components/TubeForgeSection";
import ReviewForgeSection from "@/components/ReviewForgeSection";
import WhyExpeditionSection from "@/components/WhyExpeditionSection";
import HomePricing from "@/components/HomePricing";
import DiscordSection from "@/components/DiscordSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden relative text-white">
      <PageBackground />
      <CursorGlow />
      <Navbar />
      <main className="w-full relative z-10">
        <Hero />
        <TubeForgeSection />
        <ToolsSection />
        <ReviewForgeSection />
        <WhyExpeditionSection />
        <HomePricing />
        <DiscordSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
