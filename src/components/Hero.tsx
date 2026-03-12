"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="pt-36 pb-48 md:pt-56 md:pb-64 relative overflow-hidden">
      {/* Nebula ambient — violet core fading to transparent, anchored behind the h1 */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.18) 0%, rgba(99,60,200,0.08) 40%, transparent 75%)',
          filter: 'blur(1px)',
        }}
      />
      {/* Secondary cyan nebula — lower right, echoes space depth */}
      <div
        className="absolute bottom-0 right-1/4 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 60% at 70% 80%, rgba(6,182,212,0.09) 0%, transparent 65%)',
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
          <span>Vague Pionnier — Places ouvertes</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.95] tracking-[-0.04em]"
        >
          Tous vos outils de cr&eacute;ation.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400">Un seul abonnement.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-white/55 mb-4 max-w-2xl leading-relaxed mx-auto"
        >
          Aujourd&apos;hui 1 outil. Demain 10.
          <br className="hidden md:block" />
          <span className="text-white/80">Votre prix ne bouge pas.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex items-center gap-3 mb-10"
        >
          <span className="text-3xl md:text-4xl font-bold text-white">11,99&euro;</span>
          <span className="text-white/40 text-sm">/mois</span>
          <span className="ml-3 text-sm text-white/40 line-through">ou</span>
          <span className="text-3xl md:text-4xl font-bold text-green-400">7,99&euro;</span>
          <span className="text-white/40 text-sm">/mois</span>
          <span className="ml-2 px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300 text-xs font-medium">avec Discord</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/pricing"
            className="group px-8 py-4 rounded-xl bg-white text-black font-bold transition-all duration-300 flex items-center gap-2 shadow-[0_0_40px_rgba(139,92,246,0.3),0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_0_70px_rgba(139,92,246,0.55),0_12px_40px_rgba(0,0,0,0.5)] hover:scale-[1.04] active:scale-[0.98]"
          >
            Rejoindre la Vague Pionnier
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
          </Link>
          <Link
            href="#tubeforge"
            className="px-8 py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 hover:border-white/20 font-semibold transition-all duration-300 backdrop-blur-sm hover:scale-[1.02]"
          >
            D&eacute;couvrir les outils
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
