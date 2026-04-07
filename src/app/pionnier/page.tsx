"use client";

import PageBackground from "@/components/PageBackground";
import PionnierHero from "@/components/pionnier/PionnierHero";
import PionnierMockupSection from "@/components/pionnier/PionnierMockupSection";
import PionnierFeatures from "@/components/pionnier/PionnierFeatures";
import PionnierSuiteTease from "@/components/pionnier/PionnierSuiteTease";
import PionnierPricing from "@/components/pionnier/PionnierPricing";
import PionnierTestimonials from "@/components/pionnier/PionnierTestimonials";
import PionnierFAQ from "@/components/pionnier/PionnierFAQ";
import PionnierFinalCTA from "@/components/pionnier/PionnierFinalCTA";
import PionnierStickyMobileCTA from "@/components/pionnier/PionnierStickyMobileCTA";

// Note: `export const dynamic = "force-dynamic"` lives in layout.tsx (server
// component). Route segment config is ignored on "use client" pages.

export default function PionnierPage() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden relative text-white">
      <PageBackground />

      {/* pb-24 reserves space for the sticky mobile CTA so the footer isn't hidden */}
      <main className="w-full relative z-10 pb-24 md:pb-0">
        <PionnierHero />
        <PionnierMockupSection />
        <PionnierFeatures />
        <PionnierSuiteTease />
        <PionnierPricing />
        <PionnierTestimonials />
        <PionnierFAQ />
        <PionnierFinalCTA />
      </main>

      <PionnierStickyMobileCTA />
    </div>
  );
}
