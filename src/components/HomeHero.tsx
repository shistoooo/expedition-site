"use client";

import { ArrowRight, Bell } from "lucide-react";
import Link from "next/link";
import { SALES_OPEN } from "@/lib/salesConfig";

export default function HomeHero() {
  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 relative">
      {/* Nebula wrapper — clipped so it doesn't overflow horizontally,
          but section stays overflow-visible so CTA shadows can breathe */}
      <div className="absolute inset-0 overflow-x-clip pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px]"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.18) 0%, rgba(99,60,200,0.08) 40%, transparent 72%)',
            filter: 'blur(40px)',
          }}
        />
      </div>
      <div className="container-main flex flex-col items-center text-center relative z-10">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs md:text-sm font-medium mb-6 backdrop-blur-sm animate-hero-in"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <span>{SALES_OPEN ? "14 jours gratuits" : "Lancement imminent"}</span>
        </div>

        <div
          className="mb-8 animate-hero-in"
          style={{ animationDelay: "0.1s" }}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 leading-[1.1] tracking-[-0.02em] text-white/90">
            Les outils pour youtubeurs{" "}
            <br className="hidden md:block" />
            et prestataires.
          </h1>
          <span
            className="block text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.02em] leading-[1.15] text-transparent bg-clip-text animate-text-shimmer"
            style={{
              backgroundImage: "linear-gradient(90deg, #8b5cf6 0%, #a78bfa 25%, #22d3ee 50%, #a78bfa 75%, #8b5cf6 100%)",
              backgroundSize: "200% auto",
              fontStyle: "oblique 10deg",
            }}
          >
            Gagnez des heures{" "}
            <br className="hidden lg:block" />
            chaque semaine.
          </span>
        </div>

        <p
          className="text-lg md:text-xl text-white/55 mb-10 max-w-2xl leading-relaxed mx-auto animate-hero-in"
          style={{ animationDelay: "0.2s" }}
        >
          T&eacute;l&eacute;chargement, clipping, retours vid&eacute;o &mdash; arr&ecirc;tez de jongler entre 5&nbsp;apps.
          <br className="hidden md:block" />
          <span className="text-white/80">Tout est l&agrave;, dans une seule suite.</span>
        </p>

        <div
          className="flex flex-col items-center gap-3 animate-hero-in"
          style={{ animationDelay: "0.3s" }}
        >
          <Link
            href={SALES_OPEN ? "/account?mode=register" : "/checkout"}
            className="group px-8 py-4 rounded-xl bg-white text-black font-bold text-base transition-all duration-200 flex items-center gap-2 border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_24px_rgba(139,92,246,0.25)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_12px_40px_rgba(139,92,246,0.4)] hover:translate-y-[-1px] active:translate-y-[1px] active:shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
          >
            {SALES_OPEN ? "Commencer 14 jours gratuits" : "Être prévenu au lancement"}
            {SALES_OPEN ? (
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
          </Link>
          {SALES_OPEN && (
            <p className="text-sm text-white/40">
              Crée ton compte, puis lance tes 14&nbsp;jours gratuits. Rien n&apos;est prélevé avant la fin de l&apos;essai.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
