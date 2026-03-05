"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Sparkles, ListVideo, ArrowRight, Search, Video, Music, Download, CheckCircle2, Loader2, Clock, ChevronRight } from "lucide-react";
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
          {/* Text */}
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
              Le t&eacute;l&eacute;chargeur ultime. Rapide, sans publicit&eacute; et con&ccedil;u pour les cr&eacute;ateurs exigeants.
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
                  desc: "Moteur multithread pour des t\u00e9l\u00e9chargements instantan\u00e9s.",
                },
                {
                  icon: Sparkles,
                  title: "Qualit\u00e9 8K & 60fps",
                  desc: "Pr\u00e9servez chaque pixel. Extraction audio sans perte.",
                },
                {
                  icon: ListVideo,
                  title: "Playlists & Cha\u00eenes",
                  desc: "T\u00e9l\u00e9chargez des s\u00e9ries enti\u00e8res en un seul clic.",
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

          {/* Mockup - Real TubeForge UI */}
          <div className="flex-1 w-full relative">
            <div className="absolute -inset-10 bg-purple-500/10 blur-3xl rounded-full opacity-50" />
            <div className="relative rounded-2xl border border-white/5 shadow-2xl overflow-hidden" style={{ background: '#0f0e17' }}>
              {/* Window chrome */}
              <div className="h-8 bg-[#0f0e20] border-b border-white/5 flex items-center px-3 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                <span className="text-[10px] text-white/20 ml-2 font-medium">TubeForge</span>
              </div>

              {/* Header bar */}
              <div className="px-5 pt-4 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/20" />
                  <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">TubeForge</span>
                </div>
                {/* Tab nav */}
                <div className="flex gap-1 p-0.5 rounded-lg bg-white/5 border border-white/10">
                  <div className="px-3 py-1 rounded-md bg-white/10 text-[10px] text-white font-medium shadow-sm">Download</div>
                  <div className="px-3 py-1 rounded-md text-[10px] text-white/50">Library</div>
                </div>
              </div>

              <div className="px-5 pb-5">
                {/* Search input with gradient border */}
                <div className="relative mb-4">
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-amber-500 via-orange-600 to-purple-600 rounded-xl opacity-30" />
                  <div className="relative flex gap-2 p-1 rounded-xl" style={{ background: '#1e1b4b' }}>
                    <div className="flex-1 h-9 flex items-center px-3 gap-2">
                      <Search className="w-3.5 h-3.5 text-white/20" />
                      <span className="text-xs text-white/20">T&eacute;l&eacute;chargez sans limites...</span>
                    </div>
                    <div className="h-9 px-4 rounded-lg flex items-center gap-1.5 shadow-lg shadow-purple-900/50" style={{ background: '#4c1d95' }}>
                      <Search className="w-3 h-3 text-white" />
                      <span className="text-[10px] text-white font-semibold">Rechercher</span>
                    </div>
                  </div>
                </div>

                {/* Mode toggle */}
                <div className="flex gap-1.5 mb-4">
                  {["URL", "Recherche", "Script"].map((m, i) => (
                    <div key={m} className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border ${i === 0 ? 'bg-white/10 border-white/10 text-white' : 'bg-white/[0.03] border-white/5 text-white/30'}`}>
                      {m}
                    </div>
                  ))}
                </div>

                {/* Search results grid */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { title: "Comment j\u2019ai cr\u00e9\u00e9 ma cha\u00eene", duration: "14:32" },
                    { title: "Mes 5 erreurs de d\u00e9butant", duration: "8:47" },
                    { title: "Setup tour 2026", duration: "11:05" },
                  ].map((video, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.12 }}
                      className="rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-colors"
                      style={{ background: 'rgba(30, 27, 75, 0.4)' }}
                    >
                      {/* Thumbnail */}
                      <div className="aspect-video bg-black/30 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
                        {/* Duration badge */}
                        <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/70 text-[8px] text-white/80 font-mono flex items-center gap-0.5">
                          <Clock className="w-2 h-2" />
                          {video.duration}
                        </div>
                      </div>
                      {/* Title */}
                      <div className="p-2">
                        <p className="text-[10px] text-white/80 font-medium leading-tight line-clamp-2">{video.title}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Format buttons */}
                <div className="flex gap-2 mt-3">
                  <div className="flex-1 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center gap-1.5">
                    <Video className="w-3 h-3 text-cyan-400" />
                    <span className="text-[10px] font-semibold text-cyan-400">MP4</span>
                  </div>
                  <div className="flex-1 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center gap-1.5">
                    <Music className="w-3 h-3 text-pink-400" />
                    <span className="text-[10px] font-semibold text-pink-400">MP3</span>
                  </div>
                </div>

                {/* Download tray */}
                <div className="mt-3 rounded-xl border border-white/5 overflow-hidden" style={{ background: '#1a1840' }}>
                  <div className="px-3 py-2 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-1.5">
                      <Download className="w-3 h-3 text-purple-400" />
                      <span className="text-[10px] text-white/60 font-medium">2 en cours</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-white/20 rotate-90" />
                  </div>
                  {/* Download items */}
                  {[
                    { title: "Comment j\u2019ai cr\u00e9\u00e9 ma cha\u00eene.mp4", progress: 100 },
                    { title: "Setup tour 2026.mp4", progress: 67 },
                  ].map((dl, i) => (
                    <div key={i} className="px-3 py-2 flex items-center gap-2.5 border-b border-white/5 last:border-0">
                      <div className="w-6 h-6 rounded bg-black/20 flex items-center justify-center shrink-0">
                        <Video className="w-3 h-3 text-white/15" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-white/60 truncate">{dl.title}</p>
                        <div className="mt-1 h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${dl.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5 + i * 0.3, ease: easeOutExpo }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          />
                        </div>
                      </div>
                      <div className="shrink-0">
                        {dl.progress === 100 ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <span className="text-[9px] text-purple-300 font-medium">{dl.progress}%</span>
                        )}
                      </div>
                    </div>
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
