"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bell } from "lucide-react";
import Link from "next/link";
import { SALES_OPEN } from "@/lib/salesConfig";

export default function Hero() {
  return (
    <section className="pt-36 pb-48 md:pt-56 md:pb-64 relative overflow-hidden">
      {/* Bottom fade — smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-[#06051a] pointer-events-none z-[1]" />
      {/* Nebula ambient — violet core fading to transparent, anchored behind the h1 */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.18) 0%, rgba(99,60,200,0.08) 40%, transparent 75%)',
          filter: 'blur(1px)',
        }}
      />
      <div className="container-main flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs md:text-sm font-medium mb-6 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <span>{SALES_OPEN ? "Vague Pionnier — Places ouvertes" : "Lancement imminent"}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.95] tracking-[-0.04em]"
        >
          Les outils des cr&eacute;ateurs YouTube.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400">Un seul abonnement.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-white/55 mb-10 max-w-2xl leading-relaxed mx-auto"
        >
          T&eacute;l&eacute;chargement, clipping, retours vid&eacute;o &mdash; arr&ecirc;tez de jongler entre 5&nbsp;apps.
          <br className="hidden md:block" />
          <span className="text-white/80">Tout est l&agrave;, dans une seule suite.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center"
        >
          <Link
            href={SALES_OPEN ? "/pricing" : "/checkout"}
            className="group px-8 py-4 rounded-xl bg-white text-black font-bold text-base transition-all duration-200 flex items-center gap-2 border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_24px_rgba(139,92,246,0.25)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_12px_40px_rgba(139,92,246,0.4)] hover:translate-y-[-1px] active:translate-y-[1px] active:shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
          >
            {SALES_OPEN ? "Voir les offres" : "\u00catre pr\u00e9venu au lancement"}
            {SALES_OPEN ? (
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
