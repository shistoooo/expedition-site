"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="pt-32 pb-40 md:pt-48 md:pb-56 relative overflow-hidden">
      <div className="container-main flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs md:text-sm font-medium mb-6 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>L&apos;AVENTURE COMMENCE ICI</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight"
        >
          Votre prochaine <br />
          <span className="gradient-text">EXPÉDITION</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl leading-relaxed mx-auto"
        >
          Les outils essentiels pour les créateurs de contenu.
          <br className="hidden md:block" />
          Pensés par la communauté, pour la communauté.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/pricing"
            className="px-8 py-4 rounded-xl bg-white text-black font-bold transition-all flex items-center gap-2 shadow-lg shadow-white/10 hover:bg-gray-100"
          >
            Voir les tarifs
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href={process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || "https://discord.gg/expedition"}
            target="_blank"
            className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold transition-all backdrop-blur-sm"
          >
            Rejoindre Discord
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
