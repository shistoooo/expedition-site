"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wand2, Scissors, Share2, ArrowRight, FileCheck, Link2, Sparkles, Eye, TrendingUp, Anchor, Download } from "lucide-react";

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
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

export default function ToolsSection() {
  return (
    <section id="clipforge" className="py-24 md:py-32 relative overflow-hidden">
      <div className="container-main">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20"
        >
          {/* Text */}
          <div className="flex-1 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Disponible Maintenant
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Clip<span className="gradient-text">Forge</span>
            </h2>
            <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed">
              Transformez vos longues vid&eacute;os (YouTube, Twitch)
              en formats courts (TikTok, Shorts) facilement.
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
                  icon: Wand2,
                  title: "D\u00e9coupage Intelligent",
                  desc: "L\u2019IA d\u00e9tecte les moments cl\u00e9s de vos vid\u00e9os.",
                },
                {
                  icon: Scissors,
                  title: "Recadrage Auto",
                  desc: "Passez du format 16:9 au 9:16 sans perdre le sujet.",
                },
                {
                  icon: Share2,
                  title: "Sous-titres & Export",
                  desc: "Sous-titres g\u00e9n\u00e9r\u00e9s automatiquement et export 4K.",
                },
                {
                  icon: FileCheck,
                  title: "Correction de Sous-titres",
                  desc: "Importez vos .srt : l\u2019IA corrige l\u2019orthographe et le sens.",
                },
              ].map((item, i) => (
                <motion.li key={i} variants={itemVariants} className="flex gap-5">
                  <div className="mt-1 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <item.icon className="w-5 h-5 text-purple-400" />
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

            <a
              href="/pricing"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-300 shadow-lg shadow-white/10"
            >
              Obtenir ClipForge <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>

          {/* Mockup - Real ClipForge UI */}
          <div className="flex-1 w-full relative">
            <div className="absolute -inset-10 bg-indigo-500/10 blur-3xl rounded-full opacity-50" />
            <div className="relative rounded-2xl border border-white/5 shadow-2xl overflow-hidden" style={{ background: '#0a0a0f' }}>
              {/* Window chrome */}
              <div className="h-8 bg-[#0f0f15] border-b border-white/5 flex items-center px-3 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                <span className="text-[10px] text-white/20 ml-2 font-medium">ClipForge</span>
              </div>

              {/* Main content */}
              <div className="p-5">
                {/* URL Input */}
                <div className="flex gap-2 mb-5">
                  <div className="flex-1 h-10 bg-white/[0.03] rounded-xl border border-white/[0.06] flex items-center px-3 gap-2">
                    <Link2 className="w-3.5 h-3.5 text-white/20" />
                    <span className="text-xs text-white/20">Collez un lien YouTube...</span>
                  </div>
                  <div className="h-10 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-500/25">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs text-white font-semibold">G&eacute;n&eacute;rer</span>
                  </div>
                </div>

                {/* Subtitle style presets */}
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-[10px] text-white/25 uppercase tracking-wider">Style</span>
                  {["Pop", "Smooth", "Glow", "Classique"].map((s, i) => (
                    <div key={s} className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border ${i === 0 ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300' : 'bg-white/[0.03] border-white/5 text-white/30'}`}>
                      {s}
                    </div>
                  ))}
                  <div className="flex gap-1 ml-auto">
                    {['#fff', '#facc15', '#22d3ee', '#ef4444', '#22c55e', '#ec4899', '#fbbf24'].map((c) => (
                      <div key={c} className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ background: c }} />
                    ))}
                  </div>
                </div>

                {/* Results grid - 9:16 clips */}
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { score: 94, title: "Le moment cl\u00e9", duration: "0:42" },
                    { score: 87, title: "R\u00e9action \u00e9pique", duration: "0:31" },
                    { score: 78, title: "Conseil #1", duration: "0:55" },
                  ].map((clip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.15 }}
                      className="rounded-xl overflow-hidden border border-white/5 bg-white/[0.02]"
                    >
                      {/* 9:16 preview */}
                      <div className="aspect-[9/16] bg-gradient-to-b from-indigo-500/5 to-transparent relative flex items-end justify-center">
                        {/* Virality badge */}
                        <div className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-0.5 ${clip.score >= 90 ? 'bg-emerald-500/20 text-emerald-400' : clip.score >= 80 ? 'bg-amber-500/20 text-amber-400' : 'bg-orange-500/20 text-orange-400'}`}>
                          <TrendingUp className="w-2.5 h-2.5" />
                          {clip.score}
                        </div>
                        {/* Duration */}
                        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] text-white/80 font-mono">
                          {clip.duration}
                        </div>
                        {/* Fake subtitle */}
                        <div className="mb-8 px-2">
                          <div className="bg-black/50 backdrop-blur-sm rounded px-2 py-0.5">
                            <span className="text-[9px] text-white font-bold uppercase tracking-wide">REGARDEZ &Ccedil;A</span>
                          </div>
                        </div>
                      </div>
                      {/* Info */}
                      <div className="p-2.5">
                        <p className="text-[10px] text-white/70 font-medium truncate mb-1.5">{clip.title}</p>
                        <div className="flex gap-2">
                          <div className="flex items-center gap-0.5">
                            <Anchor className="w-2.5 h-2.5 text-blue-400/60" />
                            <span className="text-[9px] text-white/30">Hook</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <Eye className="w-2.5 h-2.5 text-pink-400/60" />
                            <span className="text-[9px] text-white/30">R&eacute;tention</span>
                          </div>
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
