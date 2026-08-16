"use client";

import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import PageBackground from "@/components/PageBackground";
import HomeYoutuberShowcase from "@/components/HomeYoutuberShowcase";
import LandingDemoSection from "@/components/shared/LandingDemoSection";
import SuitePreviewSection from "@/components/shared/SuitePreviewSection";
import MonteursHero from "@/components/monteurs/MonteursHero";
import MonteursPainSection from "@/components/monteurs/MonteursPainSection";
import MonteursROICalculator from "@/components/monteurs/MonteursROICalculator";
import MonteursPricing from "@/components/monteurs/MonteursPricing";
import MonteursFAQ from "@/components/monteurs/MonteursFAQ";
import MonteursFinalCTA from "@/components/monteurs/MonteursFinalCTA";
import MonteursStickyMobileCTA from "@/components/monteurs/MonteursStickyMobileCTA";

// Note: `export const dynamic = "force-dynamic"` lives in layout.tsx (server
// component). Route segment config is ignored on "use client" pages.

export default function MonteursPage() {
  return (
    <div className="w-full min-h-screen overflow-x-clip relative text-white">
      <PageBackground />
      <Navbar />

      <main className="w-full relative z-10 pb-24 md:pb-0">
        {/* MonteursHero uses useSearchParams → must be wrapped in Suspense */}
        <Suspense fallback={<div className="pt-28 md:pt-36 h-[480px]" />}>
          <MonteursHero />
        </Suspense>
        <HomeYoutuberShowcase />
        <MonteursPainSection />
        <LandingDemoSection accent="purple" videoId="SXES1dO68G8" showCtas />
        <MonteursROICalculator />
        <SuitePreviewSection accent="purple" />
        <MonteursPricing />
        <MonteursFAQ />
        <MonteursFinalCTA />
      </main>

      <MonteursStickyMobileCTA />
    </div>
  );
}
