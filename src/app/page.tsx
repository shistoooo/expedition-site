"use client";

import CursorGlow from "@/components/CursorGlow";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SocialProofSection from "@/components/SocialProofSection";
import ToolsSection from "@/components/ToolsSection";
import TubeForgeSection from "@/components/TubeForgeSection";
import ReviewForgeSection from "@/components/ReviewForgeSection";
import TransparencySection from "@/components/TransparencySection";
import HomePricing from "@/components/HomePricing";
import PhilosophySection from "@/components/PhilosophySection";
import DiscordSection from "@/components/DiscordSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden relative">
      <CursorGlow />
      <Navbar />
      <main className="w-full">
        <Hero />
        <SocialProofSection />
        <TubeForgeSection />
        <ToolsSection />
        <ReviewForgeSection />
        <TransparencySection />
        <HomePricing />
        <PhilosophySection />
        <DiscordSection />
      </main>
      <Footer />
    </div>
  );
}
