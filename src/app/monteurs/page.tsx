"use client";

import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import PageBackground from "@/components/PageBackground";
import MonteursHero from "@/components/monteurs/MonteursHero";
import MonteursMockupSection from "@/components/monteurs/MonteursMockupSection";
import MonteursFeatures from "@/components/monteurs/MonteursFeatures";
import MonteursROICalculator from "@/components/monteurs/MonteursROICalculator";
import MonteursCompatibility from "@/components/monteurs/MonteursCompatibility";
import PrivacyBlock from "@/components/shared/PrivacyBlock";
import MonteursSuiteTease from "@/components/monteurs/MonteursSuiteTease";
import MonteursPricing from "@/components/monteurs/MonteursPricing";
import MonteursTestimonials from "@/components/monteurs/MonteursTestimonials";
import MonteursFAQ from "@/components/monteurs/MonteursFAQ";
import MonteursFinalCTA from "@/components/monteurs/MonteursFinalCTA";
import MonteursStickyMobileCTA from "@/components/monteurs/MonteursStickyMobileCTA";

// Note: `export const dynamic = "force-dynamic"` lives in layout.tsx (server
// component). Route segment config is ignored on "use client" pages.

export default function MonteursPage() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden relative text-white">
      <PageBackground />
      <Navbar />

      <main className="w-full relative z-10 pb-24 md:pb-0">
        {/* MonteursHero uses useSearchParams → must be wrapped in Suspense */}
        <Suspense fallback={<div className="pt-28 md:pt-36 h-[480px]" />}>
          <MonteursHero />
        </Suspense>
        <MonteursMockupSection />
        <MonteursFeatures />
        <MonteursROICalculator />
        {/* Compatibility lit le tool param → Suspense */}
        <Suspense fallback={<div className="h-[400px]" />}>
          <MonteursCompatibility />
        </Suspense>
        <PrivacyBlock accent="purple" />
        <MonteursSuiteTease />
        <MonteursPricing />
        <MonteursTestimonials />
        <MonteursFAQ />
        <MonteursFinalCTA />
      </main>

      <MonteursStickyMobileCTA />
    </div>
  );
}
