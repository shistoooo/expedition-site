"use client";

import { Play, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SALES_OPEN } from "@/lib/salesConfig";

function scrollToDemo(e: React.MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById("home-demo");
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function HomeHero() {
  return (
    <section className="pt-28 pb-4 md:pt-36 md:pb-6 relative overflow-hidden">
      {/* Nebula ambient — violet core fading to transparent, anchored behind the h1 */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.18) 0%, rgba(99,60,200,0.08) 40%, transparent 75%)",
          filter: "blur(1px)",
        }}
      />
      <div className="container-main flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs md:text-sm font-medium mb-6 backdrop-blur-sm animate-hero-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <span>{SALES_OPEN ? "Vague Pionnier — Places ouvertes" : "Lancement imminent"}</span>
        </div>

        <div className="mb-8 animate-hero-in" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 leading-[1.1] tracking-[-0.02em] text-white/90">
            Tes r&eacute;f&eacute;rences YouTube,
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
            directement dans Premiere Pro
            <br className="hidden lg:block" />
            {" "}&amp; DaVinci Resolve.
          </span>
        </div>

        <p
          className="text-lg md:text-xl text-white/55 mb-4 max-w-2xl leading-relaxed mx-auto animate-hero-in"
          style={{ animationDelay: "0.2s" }}
        >
          Plus jamais 20&nbsp;onglets YouTube ouverts pendant le montage.{" "}
          <span className="text-white/80">
            TubeForge t&eacute;l&eacute;charge, d&eacute;coupe et importe tes r&eacute;f&eacute;rences directement dans ta timeline.
          </span>
        </p>

        <p
          className="text-sm md:text-base text-white/40 italic mb-10 max-w-2xl mx-auto animate-hero-in"
          style={{ animationDelay: "0.25s" }}
        >
          Pour les monteurs freelance et les cr&eacute;ateurs YouTube qui montent sur des outils pro.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 animate-hero-in" style={{ animationDelay: "0.3s" }}>
          <a
            href="#home-demo"
            onClick={scrollToDemo}
            className="group px-8 py-4 rounded-xl bg-white text-black font-bold text-base transition-all duration-200 flex items-center gap-2 border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_24px_rgba(139,92,246,0.25)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_12px_40px_rgba(139,92,246,0.4)] hover:translate-y-[-1px] active:translate-y-[1px] active:shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
          >
            <Play className="w-4 h-4 fill-current" />
            Voir le plugin en action
          </a>
          <Link
            href={SALES_OPEN ? "/pricing" : "/checkout"}
            className="group px-7 py-4 rounded-xl bg-white/5 text-white/85 font-semibold text-base transition-all duration-200 flex items-center gap-2 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
          >
            Voir les tarifs
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </section>
  );
}
