"use client";

import { useEffect } from "react";
import { ArrowRight, Bell } from "lucide-react";
import Link from "next/link";
import { SALES_OPEN } from "@/lib/salesConfig";
import { useCreateursUtm } from "./useCreateursUtm";
import CompatBadge from "@/components/shared/CompatBadge";

export default function CreateursHero() {
  const { fireCtaEvent } = useCreateursUtm();

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.clarity?.("set", "page", "createurs");
  }, []);

  const ctaHref = SALES_OPEN ? "/account?mode=register" : "/checkout";
  const ctaLabel = SALES_OPEN ? "Commencer 3 jours gratuits" : "Être prévenu au lancement";

  return (
    <section
      id="createurs-hero"
      className="pt-28 pb-4 md:pt-36 md:pb-6 relative"
    >
      {/* Nebula wrapper — clipped so it doesn't overflow horizontally,
          but section stays overflow-visible so CTA shadows can breathe */}
      <div className="absolute inset-0 overflow-x-clip pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px]"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(34,211,238,0.20) 0%, rgba(56,189,248,0.10) 40%, transparent 72%)",
            filter: "blur(40px)",
          }}
        />
      </div>
      <div className="container-main flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs md:text-sm font-medium mb-6 backdrop-blur-sm animate-hero-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span>Pour les cr&eacute;ateurs qui montent leur contenu</span>
        </div>

        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-[1.1] tracking-[-0.02em] text-white animate-hero-in max-w-4xl text-balance"
          style={{ animationDelay: "0.1s" }}
        >
          Le plugin qui te fait gagner du temps.{" "}
          <span
            className="text-transparent bg-clip-text animate-text-shimmer inline-block whitespace-nowrap"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #22d3ee 0%, #67e8f9 25%, #a78bfa 50%, #67e8f9 75%, #22d3ee 100%)",
              backgroundSize: "200% auto",
            }}
          >
            Pour sortir plus de vid&eacute;os.
          </span>
        </h1>

        {/* Bandeau compatibilité — Premiere & DaVinci visibles d'emblée */}
        <div className="mb-6 animate-hero-in" style={{ animationDelay: "0.15s" }}>
          <CompatBadge />
        </div>

        <p
          className="text-sm md:text-base text-white/45 italic mb-10 max-w-2xl mx-auto animate-hero-in"
          style={{ animationDelay: "0.2s" }}
        >
          Moins de logistique. Plus de tournage, plus de montage, plus de publications.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center gap-3 animate-hero-in"
          style={{ animationDelay: "0.3s" }}
        >
          <Link
            href={ctaHref}
            onClick={() => fireCtaEvent("hero_primary")}
            className="group px-8 py-4 rounded-xl bg-white text-black font-bold text-base transition-all duration-200 flex items-center gap-2 border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_24px_rgba(34,211,238,0.25)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_12px_40px_rgba(34,211,238,0.4)] hover:translate-y-[-1px] active:translate-y-[1px]"
          >
            {ctaLabel}
            {SALES_OPEN ? (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            ) : (
              <Bell className="w-4 h-4" />
            )}
          </Link>
          <Link
            href="/demo"
            onClick={() => fireCtaEvent("hero_secondary_discord")}
            className="group px-7 py-4 rounded-xl bg-white/5 text-white/85 font-semibold text-base transition-all duration-200 flex items-center gap-2 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
          >
            Voir la d&eacute;mo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </section>
  );
}
