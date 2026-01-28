"use client";

import dynamic from "next/dynamic";
import CursorGlow from "@/components/CursorGlow";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ToolsSection from "@/components/ToolsSection";
import PhilosophySection from "@/components/PhilosophySection";
import MoneySection from "@/components/MoneySection";
import DiscordSection from "@/components/DiscordSection";
import Footer from "@/components/Footer";

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
        <PhilosophySection />
        <MoneySection />
        <DiscordSection />
      </main>
      <Footer />
    </div>
  );
}
