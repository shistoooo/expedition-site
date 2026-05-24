"use client";

import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import PageBackground from "@/components/PageBackground";
import HomeYoutuberShowcase from "@/components/HomeYoutuberShowcase";
import LandingDemoSection from "@/components/shared/LandingDemoSection";
import SuitePreviewSection from "@/components/shared/SuitePreviewSection";
import CreateursHero from "@/components/createurs/CreateursHero";
import CreateursPainSection from "@/components/createurs/CreateursPainSection";
import CreateursBeforeAfter from "@/components/createurs/CreateursBeforeAfter";
import CreateursPricing from "@/components/createurs/CreateursPricing";
import CreateursFAQ from "@/components/createurs/CreateursFAQ";
import CreateursFinalCTA from "@/components/createurs/CreateursFinalCTA";
import CreateursStickyMobileCTA from "@/components/createurs/CreateursStickyMobileCTA";

// Note: `export const dynamic = "force-dynamic"` lives in layout.tsx (server
// component). Route segment config is ignored on "use client" pages.

export default function CreateursPage() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden relative text-white">
      <PageBackground />
      <Navbar />

      <main className="w-full relative z-10 pb-24 md:pb-0">
        {/* CreateursHero uses useSearchParams indirectly via useCreateursUtm → Suspense */}
        <Suspense fallback={<div className="pt-28 md:pt-36 h-[480px]" />}>
          <CreateursHero />
        </Suspense>
        <CreateursPainSection />
        <HomeYoutuberShowcase />
        <LandingDemoSection accent="cyan" />
        <CreateursBeforeAfter />
        <SuitePreviewSection accent="cyan" />
        <CreateursPricing />
        <CreateursFAQ />
        <CreateursFinalCTA />
      </main>

      <CreateursStickyMobileCTA />
    </div>
  );
}
