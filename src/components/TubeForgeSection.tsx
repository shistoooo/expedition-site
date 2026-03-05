"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Sparkles, ListVideo, ArrowRight, Search, Video, Music, Download, CheckCircle2, Clock, ChevronRight, Scissors, Play, FolderOpen } from "lucide-react";
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
                { icon: Zap, title: "Ultra Rapide", desc: "Moteur multithread pour des t\u00e9l\u00e9chargements instantan\u00e9s." },
                { icon: Sparkles, title: "Qualit\u00e9 8K & 60fps", desc: "Pr\u00e9servez chaque pixel. Extraction audio sans perte." },
                { icon: ListVideo, title: "Playlists & Cha\u00eenes", desc: "T\u00e9l\u00e9chargez des s\u00e9ries enti\u00e8res en un seul clic." },
              ].map((item, i) => (
                <motion.li key={i} variants={itemVariants} className="flex gap-5">
                  <div className="mt-1 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <item.icon className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">{item.title}</h3>
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

          {/* Mockup — Faithful to real TubeForge UI */}
          <div className="flex-1 w-full relative">
            <div className="absolute -inset-10 bg-purple-500/8 blur-3xl rounded-full opacity-40 pointer-events-none" />
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[50%] rounded-full blur-[120px] opacity-25 pointer-events-none" style={{ background: '#2e1065' }} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-[20px] overflow-hidden shadow-2xl shadow-purple-500/10"
              style={{ background: '#0f0e17', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              {/* Window chrome */}
              <div className="h-8 flex items-center px-3 gap-1.5" style={{ background: '#13122a', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <span className="text-[10px] text-white/25 ml-2 font-medium tracking-wide">TubeForge</span>
              </div>

              {/* Header bar */}
              <div className="px-5 pt-4 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/20" />
                  <span className="text-sm font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">TubeForge</span>
                </div>
                {/* Tab nav */}
                <div className="flex gap-0.5 p-0.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="px-3.5 py-1.5 rounded-lg text-[10px] font-medium text-white shadow-sm" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <Download className="w-3 h-3 inline mr-1" />Download
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg text-[10px] text-white/40 font-medium">
                    <FolderOpen className="w-3 h-3 inline mr-1" />Library
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 space-y-3">
                {/* Search input — gradient border from real app */}
                <div className="relative group">
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-amber-500 via-orange-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative flex items-center gap-2 p-2 pl-5 rounded-2xl shadow-2xl backdrop-blur-xl" style={{ background: 'rgba(30,27,75,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Search className="w-4 h-4 text-white/20 shrink-0" />
                    <span className="flex-1 text-[11px] text-white/20">T&eacute;l&eacute;chargez sans limites...</span>
                    {/* Quality dropdown */}
                    <div className="px-2 py-1 rounded-lg text-[9px] text-white/50 font-medium" style={{ background: 'rgba(30,27,75,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      1080p
                    </div>
                    <div className="px-4 py-2.5 rounded-2xl text-white text-[11px] font-medium flex items-center gap-1.5 shadow-lg" style={{ background: '#4c1d95', boxShadow: '0 10px 25px rgba(76,29,149,0.5)' }}>
                      <Search className="w-3 h-3" />
                      Rechercher
                    </div>
                  </div>
                </div>

                {/* Mode toggle */}
                <div className="flex gap-1.5">
                  {[
                    { label: "URL", active: true },
                    { label: "Recherche", active: false },
                    { label: "Script", active: false },
                  ].map((m) => (
                    <div key={m.label} className={`px-3 py-1.5 rounded-xl text-[10px] font-medium ${m.active ? 'text-white shadow-sm' : 'text-white/30'}`} style={{ background: m.active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid rgba(255,255,255,${m.active ? '0.08' : '0.03'})` }}>
                      {m.label}
                    </div>
                  ))}
                </div>

                {/* Video info card — like URL mode result */}
                <div className="rounded-2xl p-3 backdrop-blur-md" style={{ background: 'rgba(30,27,75,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <div className="w-24 aspect-video rounded-lg shrink-0 relative overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white/20" />
                      </div>
                      <div className="absolute bottom-0.5 right-0.5 px-1 py-0.5 rounded text-[7px] text-white/70 font-mono" style={{ background: 'rgba(0,0,0,0.7)' }}>
                        <Clock className="w-1.5 h-1.5 inline mr-0.5" />14:32
                      </div>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-white/90 font-bold leading-tight line-clamp-2 mb-1">Comment j&apos;ai cr&eacute;&eacute; ma cha&icirc;ne YouTube en partant de z&eacute;ro</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-white/35">14:32</span>
                        <span className="px-1.5 py-0.5 rounded text-[8px] text-white/40 font-medium" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.03)' }}>YouTube</span>
                      </div>
                    </div>
                  </div>

                  {/* Download buttons — MP4 cyan / MP3 pink */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="flex items-center gap-2 p-2.5 rounded-xl transition-all" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <Video className="w-4 h-4 text-cyan-400" />
                      <div>
                        <p className="text-[10px] text-white/90 font-bold">T&eacute;l&eacute;charger MP4</p>
                        <p className="text-[8px] text-white/30">Qualit&eacute;: 1080p</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl transition-all" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <Music className="w-4 h-4 text-pink-400" />
                      <div>
                        <p className="text-[10px] text-white/90 font-bold">T&eacute;l&eacute;charger MP3</p>
                        <p className="text-[8px] text-white/30">Audio haute fid&eacute;lit&eacute;</p>
                      </div>
                    </div>
                  </div>

                  {/* Trim toggle */}
                  <div className="mt-2 flex items-center justify-between px-2 py-1.5 rounded-lg" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
                    <div className="flex items-center gap-1.5">
                      <Scissors className="w-3 h-3 text-orange-400" />
                      <span className="text-[9px] text-orange-400 font-medium">D&eacute;couper avant t&eacute;l&eacute;chargement</span>
                    </div>
                    <div className="text-[8px] text-orange-300/60 font-mono">00:30 &rarr; 05:12</div>
                  </div>
                </div>

                {/* Download tray */}
                <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(26,24,64,0.95)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="px-3 py-2 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-1.5">
                      <Download className="w-3 h-3 text-purple-400" />
                      <span className="text-[10px] text-white/50 font-medium">2 t&eacute;l&eacute;chargements</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-white/20 rotate-90" />
                  </div>
                  {[
                    { title: "Comment j\u2019ai cr\u00e9\u00e9 ma cha\u00eene.mp4", progress: 100 },
                    { title: "Setup tour 2026.mp4", progress: 72 },
                  ].map((dl, i) => (
                    <div key={i} className="px-3 py-2 flex items-center gap-2.5" style={{ borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(0,0,0,0.15)' }}>
                        <Video className="w-3 h-3 text-white/15" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-white/60 truncate">{dl.title}</p>
                        <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${dl.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.6 + i * 0.3, ease: easeOutExpo }}
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
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
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
