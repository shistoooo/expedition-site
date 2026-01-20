"use client";

import dynamic from "next/dynamic";
import CursorGlow from "@/components/CursorGlow";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ToolsSection from "@/components/ToolsSection";
import DiscordSection from "@/components/DiscordSection";
import Footer from "@/components/Footer";
import UpcomingTools from "@/components/UpcomingTools";

const ParticlesBackground = dynamic(
  () => import("@/components/ParticlesBackground"),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden relative">
      <ParticlesBackground />
      <CursorGlow />
      <Navbar />
      <main className="w-full">
        <Hero />
        <ToolsSection />
        <UpcomingTools />
        <DiscordSection />
      </main>
      <Footer />
    </div>
  );
}
