"use client";

import CursorGlow from "@/components/CursorGlow";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ToolsSection from "@/components/ToolsSection";
import TubeForgeSection from "@/components/TubeForgeSection";
import PhilosophySection from "@/components/PhilosophySection";
import MoneySection from "@/components/MoneySection";
import DiscordSection from "@/components/DiscordSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden relative">
      <CursorGlow />
      <Navbar />
      <main className="w-full">
        <Hero />
        <ToolsSection />
        <TubeForgeSection />
        <PhilosophySection />
        <MoneySection />
        <DiscordSection />
      </main>
      <Footer />
    </div>
  );
}
