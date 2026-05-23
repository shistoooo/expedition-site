"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Bell, ChevronDown } from "lucide-react";
import { SALES_OPEN } from "@/lib/salesConfig";
import { useDiscordPionnierUtm } from "./useDiscordPionnierUtm";

export default function DiscordPionnierHero() {
  const { getDiscordOAuthUrl, fireCtaEvent } = useDiscordPionnierUtm();

  // Tag the Clarity session for filtering in dashboard
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.clarity?.("set", "page", "discord-pionnier");
    }
  }, []);

  const ctaHref = SALES_OPEN ? getDiscordOAuthUrl() : "/checkout";
  const ctaLabel = SALES_OPEN ? "Devenir Pionnier — 8,03€/mois" : "Être prévenu au lancement";

  return (
    <section
      id="discord-pionnier-hero"
      className="min-h-[88vh] md:min-h-[92vh] pt-32 md:pt-44 pb-20 md:pb-24 relative flex flex-col items-center justify-center"
    >
      {/* Nebula wrapper — clipped so it doesn't overflow horizontally,
          but section stays overflow-visible so CTA shadows can breathe */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[700px]"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.20) 0%, rgba(99,60,200,0.09) 40%, transparent 75%)",
            filter: "blur(1px)",
          }}
        />
      </div>

      <div className="container-main relative z-10 flex flex-col items-center text-center">
        {/* Eyebrow */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono uppercase tracking-widest mb-8 backdrop-blur-sm animate-hero-in"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <span>Vague Pionnier · Places limitées</span>
        </div>

        {/* H1 — centré sur le lock-in pricing (audit copy-sales-expert) */}
        <h1
          className="text-4xl md:text-5xl lg:text-[3.75rem] font-black mb-6 leading-[1.1] tracking-[-0.025em] text-white animate-hero-in max-w-4xl"
          style={{ animationDelay: "0.1s" }}
        >
          8,03&euro;/mois.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-purple-300">
            Bloqu&eacute; &agrave; vie.
          </span>
          <br />
          Tant que tu restes abonn&eacute;.
        </h1>

        {/* Sub — explique le lock-in et le futur prix d'entrée */}
        <p
          className="text-base md:text-xl text-white/60 mb-10 leading-relaxed animate-hero-in max-w-2xl"
          style={{ animationDelay: "0.2s" }}
        >
          TubeForge dispo, ClipForge et ReviewForge arrivent. Quand on lancera les prochains outils,{" "}
          <span className="text-white/85 font-semibold">le tarif d&apos;entr&eacute;e montera &mdash; le tien reste fig&eacute;</span>.
        </p>

        {/* CTA */}
        <div
          className="flex flex-col items-center gap-4 animate-hero-in"
          style={{ animationDelay: "0.3s" }}
        >
          <Link
            href={ctaHref}
            onClick={() => fireCtaEvent("hero")}
            className="group px-10 py-5 rounded-xl bg-white text-black font-bold text-base md:text-lg transition-all duration-200 inline-flex items-center gap-2.5 border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_12px_32px_rgba(139,92,246,0.35)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_16px_48px_rgba(139,92,246,0.55)] hover:translate-y-[-2px] active:translate-y-[1px]"
          >
            {ctaLabel}
            {SALES_OPEN ? (
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
          </Link>

          {/* Trust micro-row */}
          <p className="text-xs text-white/40">
            Annulable 1 clic · Sans engagement · Tarif bloqué à vie
          </p>
        </div>

        {/* Scroll cue — invites the user to discover the demo below */}
        <div
          className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-white/30 animate-hero-in"
          style={{ animationDelay: "0.5s" }}
        >
          <span className="text-[10px] font-mono uppercase tracking-widest">Voir l&apos;outil</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
