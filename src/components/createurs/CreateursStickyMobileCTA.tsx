"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bell } from "lucide-react";
import { SALES_OPEN } from "@/lib/salesConfig";
import { useCreateursUtm } from "./useCreateursUtm";

export default function CreateursStickyMobileCTA() {
  const { fireCtaEvent } = useCreateursUtm();
  // Always visible on mobile EXCEPT when the in-page pricing card is on screen
  // (avoid double CTAs). IntersectionObserver is more reliable than scroll listeners.
  const [pricingInView, setPricingInView] = useState(false);

  useEffect(() => {
    const pricing = document.getElementById("createurs-pricing");
    if (!pricing) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPricingInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(pricing);
    return () => observer.disconnect();
  }, []);

  const shouldShow = !pricingInView;
  const ctaHref = SALES_OPEN ? "/account?mode=register" : "/checkout";

  return (
    <div
      aria-hidden={!shouldShow}
      className="fixed bottom-0 inset-x-0 z-40 md:hidden glass border-t border-white/10 transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom), 0.75rem)",
        transform: shouldShow ? "translateY(0)" : "translateY(120%)",
        opacity: shouldShow ? 1 : 0,
        pointerEvents: shouldShow ? "auto" : "none",
      }}
    >
      <div className="px-4 pt-3 flex items-center justify-between gap-3">
        {/* Left: price + tagline */}
        <div className="min-w-0 flex-shrink">
          <p className="text-base font-bold text-white whitespace-nowrap">
            8,03€<span className="text-xs text-white/50 font-normal">/mois</span>
          </p>
          <p className="text-[10px] text-cyan-300/80 font-mono uppercase tracking-wider truncate">
            Bloqué à vie
          </p>
        </div>

        {/* Right: CTA */}
        <Link
          href={ctaHref}
          onClick={() => fireCtaEvent("sticky")}
          tabIndex={shouldShow ? 0 : -1}
          className="group inline-flex items-center gap-1.5 px-5 py-3 rounded-xl text-white font-bold text-sm shadow-lg whitespace-nowrap"
          style={{
            background:
              "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)",
            boxShadow:
              "0 6px 20px rgba(139,92,246,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          {SALES_OPEN ? "3 jours gratuits" : "Être prévenu"}
          {SALES_OPEN ? (
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          ) : (
            <Bell className="w-4 h-4" />
          )}
        </Link>
      </div>
    </div>
  );
}
