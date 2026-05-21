"use client";

import Navbar from "@/components/Navbar";
import PageBackground from "@/components/PageBackground";
import DiscordPionnierHero from "@/components/discord-pionnier/DiscordPionnierHero";
import DiscordPionnierMockupSection from "@/components/discord-pionnier/DiscordPionnierMockupSection";
import DiscordPionnierFeatures from "@/components/discord-pionnier/DiscordPionnierFeatures";
import DiscordPionnierSuiteTease from "@/components/discord-pionnier/DiscordPionnierSuiteTease";
import DiscordPionnierPricing from "@/components/discord-pionnier/DiscordPionnierPricing";
import DiscordPionnierTestimonials from "@/components/discord-pionnier/DiscordPionnierTestimonials";
import DiscordPionnierFAQ from "@/components/discord-pionnier/DiscordPionnierFAQ";
import DiscordPionnierFinalCTA from "@/components/discord-pionnier/DiscordPionnierFinalCTA";
import DiscordPionnierStickyMobileCTA from "@/components/discord-pionnier/DiscordPionnierStickyMobileCTA";

// Note: `export const dynamic = "force-dynamic"` lives in layout.tsx (server
// component). Route segment config is ignored on "use client" pages.

export default function DiscordPionnierPage() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden relative text-white">
      <PageBackground />
      <Navbar />

      {/* pb-24 reserves space for the sticky mobile CTA so the footer isn't hidden */}
      <main className="w-full relative z-10 pb-24 md:pb-0">
        <DiscordPionnierHero />
        <DiscordPionnierMockupSection />
        <DiscordPionnierFeatures />
        <DiscordPionnierSuiteTease />
        <DiscordPionnierPricing />
        <DiscordPionnierTestimonials />
        <DiscordPionnierFAQ />
        <DiscordPionnierFinalCTA />
      </main>

      <DiscordPionnierStickyMobileCTA />
    </div>
  );
}
