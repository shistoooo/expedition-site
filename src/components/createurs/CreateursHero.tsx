"use client";

import { useEffect } from "react";
import { ArrowRight, Bell } from "lucide-react";
import Link from "next/link";
import { SALES_OPEN } from "@/lib/salesConfig";
import { useCreateursUtm } from "./useCreateursUtm";

export default function CreateursHero() {
  const { getDiscordOAuthUrl, fireCtaEvent } = useCreateursUtm();

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.clarity?.("set", "page", "createurs");
  }, []);

  const ctaHref = SALES_OPEN ? getDiscordOAuthUrl() : "/checkout";
  const ctaLabel = SALES_OPEN ? "Devenir Pionnier — 8,03€/mois" : "Être prévenu au lancement";

  return (
    <section
      id="createurs-hero"
      className="pt-28 pb-4 md:pt-36 md:pb-6 relative overflow-hidden"
    >
      {/* Cyan nebula ambient — createur identity glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(34,211,238,0.20) 0%, rgba(56,189,248,0.10) 40%, transparent 75%)",
          filter: "blur(1px)",
        }}
      />
      <div className="container-main flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs md:text-sm font-medium mb-6 backdrop-blur-sm animate-hero-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span>Pour les cr&eacute;ateurs YouTube qui montent leur contenu</span>
        </div>

        <div className="mb-8 animate-hero-in" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 leading-[1.1] tracking-[-0.02em] text-white/90">
            Ton workflow YouTube,
          </h1>
          <span
            className="block text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.02em] leading-[1.15] text-transparent bg-clip-text animate-text-shimmer"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #22d3ee 0%, #67e8f9 25%, #a78bfa 50%, #67e8f9 75%, #22d3ee 100%)",
              backgroundSize: "200% auto",
              fontStyle: "oblique 10deg",
            }}
          >
            enfin fluide dans Premiere
            <br className="hidden lg:block" />
            {" "}&amp; DaVinci Resolve.
          </span>
        </div>

        <p
          className="text-lg md:text-xl text-white/55 mb-4 max-w-2xl leading-relaxed mx-auto animate-hero-in"
          style={{ animationDelay: "0.2s" }}
        >
          Tu montes toi-m&ecirc;me tes vid&eacute;os. Tu te perds entre les r&eacute;f&eacute;rences &agrave; t&eacute;l&eacute;charger, les fichiers &agrave; ranger, les onglets YouTube qui s&apos;accumulent.{" "}
          <span className="text-white/80">
            TubeForge unifie tout dans ton outil de montage.
          </span>
        </p>

        <p
          className="text-sm md:text-base text-white/40 italic mb-10 max-w-2xl mx-auto animate-hero-in"
          style={{ animationDelay: "0.25s" }}
        >
          Plus de stress logistique. Plus de temps pour ce qui compte vraiment&nbsp;: ton contenu.
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
