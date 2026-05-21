"use client";

import { useEffect } from "react";
import { Play, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SALES_OPEN } from "@/lib/salesConfig";
import { useMonteursUtm } from "./useMonteursUtm";

type Tool = "premiere" | "davinci" | "both";

function parseTool(raw: string | null): Tool {
  if (raw === "premiere") return "premiere";
  if (raw === "davinci") return "davinci";
  return "both";
}

function toolLabel(tool: Tool): string {
  switch (tool) {
    case "premiere":
      return "Premiere Pro";
    case "davinci":
      return "DaVinci Resolve";
    case "both":
      return "Premiere & DaVinci";
  }
}

function scrollToPricing(e: React.MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById("monteurs-pricing");
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function MonteursHero() {
  const { fireCtaEvent } = useMonteursUtm();
  const searchParams = useSearchParams();
  const tool = parseTool(searchParams.get("tool"));
  const label = toolLabel(tool);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.clarity?.("set", "page", "monteurs");
    window.clarity?.("set", "tool", tool);
  }, [tool]);

  const ctaLabel = SALES_OPEN ? "Devenir Pionnier — 8,03€/mois" : "Être prévenu au lancement";

  return (
    <section
      id="monteurs-hero"
      className="pt-28 pb-4 md:pt-36 md:pb-6 relative overflow-hidden"
    >
      {/* Purple nebula ambient — monteur identity glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.20) 0%, rgba(99,60,200,0.10) 40%, transparent 75%)",
          filter: "blur(1px)",
        }}
      />
      <div className="container-main flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs md:text-sm font-medium mb-6 backdrop-blur-sm animate-hero-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <span>Pour les monteurs freelance YouTube</span>
        </div>

        <div className="mb-8 animate-hero-in" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 leading-[1.1] tracking-[-0.02em] text-white/90">
            Le plugin {label}
          </h1>
          <span
            className="block text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.02em] leading-[1.15] text-transparent bg-clip-text animate-text-shimmer"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #8b5cf6 0%, #a78bfa 25%, #22d3ee 50%, #a78bfa 75%, #8b5cf6 100%)",
              backgroundSize: "200% auto",
              fontStyle: "oblique 10deg",
            }}
          >
            qui te fait gagner 5h par mois
            <br className="hidden lg:block" />
            {" "}sur tes projets YouTube.
          </span>
        </div>

        <p
          className="text-lg md:text-xl text-white/55 mb-4 max-w-2xl leading-relaxed mx-auto animate-hero-in"
          style={{ animationDelay: "0.2s" }}
        >
          Tu montes des vid&eacute;os YouTube pour tes clients&nbsp;? Arr&ecirc;te de jongler entre 20&nbsp;onglets, 4K&nbsp;Video Downloader, et des dossiers de rush.{" "}
          <span className="text-white/80">
            TubeForge int&egrave;gre tout ton workflow r&eacute;f&eacute;rences directement dans {label}.
          </span>
        </p>

        <p
          className="text-sm md:text-base text-white/40 italic mb-10 max-w-2xl mx-auto animate-hero-in"
          style={{ animationDelay: "0.25s" }}
        >
          &Agrave; ton tarif horaire, l&apos;abonnement est rentabilis&eacute; d&egrave;s le premier projet du mois.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center gap-3 animate-hero-in"
          style={{ animationDelay: "0.3s" }}
        >
          <a
            href="#monteurs-pricing"
            onClick={(e) => {
              fireCtaEvent("hero_primary");
              scrollToPricing(e);
            }}
            className="group px-8 py-4 rounded-xl bg-white text-black font-bold text-base transition-all duration-200 flex items-center gap-2 border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_24px_rgba(139,92,246,0.25)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_12px_40px_rgba(139,92,246,0.4)] hover:translate-y-[-1px] active:translate-y-[1px]"
          >
            <Play className="w-4 h-4 fill-current" />
            {ctaLabel}
          </a>
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
