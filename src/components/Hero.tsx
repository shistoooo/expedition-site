"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="pt-32 pb-40 md:pt-48 md:pb-56 relative overflow-hidden">
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
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight"
        >
          Tous vos outils de cr&eacute;ation.
          <br />
          <span className="gradient-text">Un seul abonnement.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-white/60 mb-4 max-w-2xl leading-relaxed mx-auto"
        >
          Aujourd&apos;hui 1 outil. Demain 3, puis 10.
          <br className="hidden md:block" />
          <span className="text-white/80">Votre prix reste bloqu&eacute; tant que vous restez abonn&eacute;.</span> M&ecirc;me quand la suite aura 10 outils.
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
          <span className="text-3xl md:text-4xl font-bold text-green-400">9,99&euro;</span>
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
            href="/checkout"
            className="px-8 py-4 rounded-xl bg-white text-black font-bold transition-all flex items-center gap-2 shadow-lg shadow-white/10 hover:bg-gray-100"
          >
            Commencer maintenant
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="#clipforge"
            className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold transition-all backdrop-blur-sm"
          >
            D&eacute;couvrir les outils
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
