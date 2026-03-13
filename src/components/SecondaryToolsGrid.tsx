"use client";

import ToolsSection from "@/components/ToolsSection";
import ReviewForgeSection from "@/components/ReviewForgeSection";

export default function SecondaryToolsGrid() {
  return (
    <section className="pt-8 md:pt-12 pb-16 md:pb-20 relative bg-[#06051a]/80">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          <ToolsSection />
          <ReviewForgeSection />
        </div>
      </div>
    </section>
  );
}
