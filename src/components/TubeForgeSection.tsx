"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Sparkles, ListVideo, ArrowRight, Play, Youtube } from "lucide-react";
import Link from "next/link";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

export default function TubeForgeSection() {
  return (
    <section id="tubeforge" className="py-24 md:py-32 relative overflow-hidden border-t border-white/5 bg-white/[0.01]">
      <div className="container-main">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20"
        >
          {/* Côté Texte */}
          <div className="flex-1 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Version 2.0 Disponible
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Tube<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Forge</span>
            </h2>
            <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed">
              Le téléchargeur ultime. Rapide, sans publicité et conçu pour les créateurs exigeants.
            </p>

            <motion.ul
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6 mb-10"
            >
              {[
                {
                  icon: Zap,
                  title: "Ultra Rapide",
                  desc: "Moteur multithread pour des téléchargements instantanés.",
                },
                {
                  icon: Sparkles,
                  title: "Qualité 8K & 60fps",
                  desc: "Préservez chaque pixel. Extraction audio sans perte.",
                },
                {
                  icon: ListVideo,
                  title: "Playlists & Chaînes",
                  desc: "Téléchargez des séries entières en un seul clic.",
                },
              ].map((item, i) => (
                <motion.li key={i} variants={itemVariants} className="flex gap-5">
                  <div className="mt-1 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <item.icon className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">
                      {item.title}
                    </h3>
                    <p className="text-white/50">{item.desc}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>

            <Link
              href="/pricing"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all duration-300 shadow-lg shadow-white/10"
            >
              Obtenir TubeForge <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Côté Visuel / Mockup */}
          <div className="flex-1 w-full relative">
            <div className="absolute -inset-10 bg-red-500/10 blur-3xl rounded-full opacity-50" />
            <div className="relative glass rounded-2xl border border-white/5 p-2 shadow-2xl">
              <div className="aspect-[4/3] bg-[#0F0F12] rounded-xl overflow-hidden relative border border-white/5 group">
                {/* Header Mockup */}
                <div className="h-10 border-b border-white/5 bg-[#141418] flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20" />
                </div>

                {/* Content Mockup */}
                <div className="p-6 space-y-4">
                  {/* Search Bar */}
                  <div className="h-10 bg-[#1A1A20] rounded-lg border border-white/5 flex items-center px-4">
                    <Youtube className="w-4 h-4 text-red-400/50 mr-3 shrink-0" />
                    <div className="h-2 w-32 bg-white/5 rounded-full" />
                  </div>

                  {/* Download Cards */}
                  {[
                    { title: "w-28", delay: 0 },
                    { title: "w-20", delay: 0.15 },
                    { title: "w-24", delay: 0.3 },
                  ].map((card, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: 20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: card.delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="h-16 bg-[#16161A] rounded border border-white/5 flex items-center p-3 gap-3"
                    >
                      <div className="h-10 w-16 bg-white/5 rounded relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-red-500/10" />
                        <Play className="w-4 h-4 text-white/20" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className={`h-2 ${card.title} bg-white/10 rounded`} />
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <LoopingProgressBar delay={0.5 + card.delay} index={i} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LoopingProgressBar({ delay, index }: { delay: number; index: number }) {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    // Stagger the start of each bar's loop
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setCycle((prev) => prev + 1);
      }, 3000);
      return () => clearInterval(interval);
    }, delay * 1000 + index * 600);

    return () => clearTimeout(startDelay);
  }, [delay, index]);

  return (
    <motion.div
      key={cycle}
      initial={{ width: "0%" }}
      animate={{ width: "100%" }}
      transition={{ duration: 0.8 + index * 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
    />
  );
}
