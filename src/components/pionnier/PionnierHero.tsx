"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Bell } from "lucide-react";
import { SALES_OPEN } from "@/lib/salesConfig";
import { usePionnierUtm } from "./usePionnierUtm";
import TubeForgeMockup from "@/components/mockups/TubeForgeMockup";

export default function PionnierHero() {
  const { getDiscordOAuthUrl, fireCtaEvent } = usePionnierUtm();

  // Tag the Clarity session for filtering in dashboard
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.clarity?.("set", "page", "pionnier");
    }
  }, []);

  const ctaHref = SALES_OPEN ? getDiscordOAuthUrl() : "/checkout";
  const ctaLabel = SALES_OPEN ? "Devenir Pionnier — 8,03€/mois" : "Être prévenu au lancement";

  return (
    <section id="pionnier-hero" className="pt-28 md:pt-36 pb-16 md:pb-24 relative overflow-hidden">
      {/* Nebula ambient — violet core fading to transparent */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.18) 0%, rgba(99,60,200,0.08) 40%, transparent 75%)",
          filter: "blur(1px)",
        }}
      />

      <div className="container-main relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* LEFT — Copy */}
          <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono uppercase tracking-widest mb-6 backdrop-blur-sm animate-hero-in"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span>Vague Pionnier · Places limitées</span>
            </div>

            {/* H1 */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-5 leading-[1.05] tracking-[-0.03em] text-white animate-hero-in"
              style={{ animationDelay: "0.1s" }}
            >
              La suite YouTube.{" "}
              <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-purple-300">
                Au tarif Pionnier.
              </span>
            </h1>

            {/* Sub */}
            <p
              className="text-base md:text-lg text-white/55 mb-8 leading-relaxed animate-hero-in max-w-xl mx-auto lg:mx-0"
              style={{ animationDelay: "0.2s" }}
            >
              Téléchargez en 8K, clippez avec l&apos;IA, faites valider vos rendus —{" "}
              <span className="text-white/80">un seul abonnement, dès 8,03€/mois</span>. Bloqué à vie tant que vous restez abonné.
            </p>

            {/* CTA */}
            <div
              className="flex flex-col items-center lg:items-start gap-3 animate-hero-in"
              style={{ animationDelay: "0.3s" }}
            >
              <Link
                href={ctaHref}
                onClick={() => fireCtaEvent("hero")}
                className="group px-8 py-4 rounded-xl bg-white text-black font-bold text-base transition-all duration-200 inline-flex items-center gap-2 border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_24px_rgba(139,92,246,0.3)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_12px_40px_rgba(139,92,246,0.45)] hover:translate-y-[-1px] active:translate-y-[1px]"
              >
                {ctaLabel}
                {SALES_OPEN ? (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </Link>

              {/* Trust micro-row */}
              <p className="text-xs text-white/35 mt-1">
                Annulable 1 clic · Sans engagement · Tarif bloqué à vie
              </p>
            </div>
          </div>

          {/* RIGHT — Mockup (desktop) */}
          <div
            className="flex-1 w-full max-w-md lg:max-w-none relative animate-hero-in"
            style={{ animationDelay: "0.4s" }}
          >
            {/* Red-orange nebula behind mockup */}
            <div
              className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 40%, rgba(239,68,68,0.10) 0%, rgba(249,115,22,0.05) 35%, transparent 70%)",
                filter: "blur(80px)",
              }}
            />
            <TubeForgeMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
