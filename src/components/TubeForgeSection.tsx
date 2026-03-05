"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Sparkles, ListVideo, ArrowRight, Search, Video, Music, Download, CheckCircle2, Clock, ChevronRight, Scissors, Play, FolderOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

                {/* Download tray — 4 real videos */}
                <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(26,24,64,0.95)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="px-3 py-2 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-1.5">
                      <Download className="w-3 h-3 text-purple-400" />
                      <span className="text-[10px] text-white/50 font-medium">4 t&eacute;l&eacute;chargements</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-white/20 rotate-90" />
                  </div>
                  {[
                    { title: "Pokemon Ultra Soleil mais uniquement avec des Shiny.mp4", duration: "2:34:17", progress: 100, thumb: "/mockups/thumb-pokemon.jpg" },
                    { title: "22 minutes pour sauver l\u2019univers (ok un peu plus).mp4", duration: "22:41", progress: 100, thumb: "/mockups/thumb-fantasy.jpg" },
                    { title: "1H46 pour t\u2019expliquer le jeu qui m\u2019a bris\u00e9.mp4", duration: "1:46:23", progress: 87, thumb: "/mockups/thumb-anime.jpg" },
                    { title: "POKOPIA VA (vraiment) \u00caTRE EXCEPTIONNEL.mp4", duration: "18:32", progress: 45, thumb: "/mockups/thumb-pokopia.jpg" },
                  ].map((dl, i) => (
                    <div key={i} className="px-3 py-2.5 flex items-center gap-3" style={{ borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                      <div className="w-14 aspect-video rounded-md shrink-0 relative overflow-hidden" style={{ background: 'rgba(0,0,0,0.15)' }}>
                        <Image src={dl.thumb} alt="" fill className="object-cover" />
                        <div className="absolute bottom-0 right-0 px-0.5 py-px rounded-tl text-[6px] text-white/80 font-mono" style={{ background: 'rgba(0,0,0,0.75)' }}>
                          {dl.duration}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-white/70 font-medium truncate">{dl.title}</p>
                        <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${dl.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 + i * 0.2, ease: easeOutExpo }}
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[7px] text-white/25">{dl.duration}</span>
                          <span className="text-[7px] text-white/25">MP4 1080p</span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {dl.progress === 100 ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <span className="text-[10px] text-purple-300 font-semibold">{dl.progress}%</span>
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
