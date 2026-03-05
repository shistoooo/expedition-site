"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wand2, Scissors, Share2, ArrowRight, FileCheck, Link2, Upload, ArrowRight as Arrow, Focus, Crop, TrendingUp, Anchor, Eye, Download, Edit, Trash2, Play, ScanFace, Type, Layers, Sparkles } from "lucide-react";

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

function SubtitlePreview() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => setVisible(v => !v), 1800);
    return () => clearInterval(interval);
  }, []);
  return (
    <span
      className="text-[7px] font-bold uppercase tracking-wide text-center whitespace-nowrap"
      style={{
        color: '#fff',
        textShadow: '0 1px 2px rgba(0,0,0,0.9)',
        transform: visible ? 'scale(1)' : 'scale(0.85)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.14s cubic-bezier(0.34,1.56,0.64,1), opacity 0.1s',
      }}
    >
      REGARDEZ
    </span>
  );
}

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
              Collez un lien YouTube. ClipForge trouve les moments viraux, recadre, sous-titre et exporte vos clips pr&ecirc;ts &agrave; poster.
            </p>

            <motion.ul
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-5 mb-10"
            >
              {[
                { icon: Sparkles, title: "L\u2019IA trouve vos meilleurs moments", desc: "Analyse sp\u00e9cialis\u00e9e selon votre contenu : gaming, podcast, tuto, vlog. Elle d\u00e9tecte les punchlines, les r\u00e9actions, les fails \u2014 pas juste les silences." },
                { icon: TrendingUp, title: "Score de viralit\u00e9, hook et r\u00e9tention", desc: "Chaque clip est not\u00e9 sur 100. Vous voyez en un coup d\u2019\u0153il quels extraits vont performer et lesquels sont \u00e0 jeter." },
                { icon: ScanFace, title: "Recadrage intelligent qui suit le visage", desc: "Le cadrage 9:16 suit votre visage frame par frame. Smooth, sans saccade, avec un lissage cin\u00e9matographique. Vous restez toujours au centre." },
                { icon: Type, title: "Sous-titres anim\u00e9s, \u00e9ditables", desc: "4 styles d\u2019animation (Pop, Smooth, Glow, Classique), couleurs personnalisables, \u00e9diteur int\u00e9gr\u00e9. Modifiez un mot, reg\u00e9n\u00e9rez le clip en un clic." },
              ].map((item, i) => (
                <motion.li key={i} variants={itemVariants} className="flex gap-4">
                  <div className="mt-1 w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <item.icon className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
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

          {/* Mockup — Faithful to real ClipForge UI */}
          <div className="flex-1 w-full relative">
            <div className="absolute -inset-10 bg-indigo-500/10 blur-3xl rounded-full opacity-40 pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-48 h-48 bg-purple-500/15 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-[20px] overflow-hidden shadow-2xl shadow-indigo-500/10"
              style={{ background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {/* Window chrome */}
              <div className="h-8 flex items-center px-3 gap-1.5" style={{ background: '#12121a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <span className="text-[10px] text-white/25 ml-2 font-medium tracking-wide">ClipForge</span>
              </div>

              <div className="p-5 space-y-4">
                {/* Tab switcher — YouTube | Fichier Local */}
                <div className="flex gap-2">
                  <div className="flex-1 py-2.5 px-4 rounded-xl text-center text-xs font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5" />
                    YouTube
                  </div>
                  <div className="flex-1 py-2.5 px-4 rounded-xl text-center text-xs font-medium text-white/40" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <Upload className="w-3.5 h-3.5 inline mr-1.5" />
                    Fichier Local
                  </div>
                </div>

                {/* URL Input — glass-card style */}
                <div className="flex items-center gap-0 p-[6px] rounded-[20px]" style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex-1 flex items-center px-3 gap-2">
                    <Link2 className="w-4 h-4 text-white/25 shrink-0" />
                    <span className="text-[11px] text-white/25">Collez un lien YouTube...</span>
                  </div>
                  <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[11px] font-medium flex items-center gap-1.5 shadow-lg shadow-indigo-500/25">
                    G&eacute;n&eacute;rer
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Options row — Crop mode + Output dir */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex rounded-xl p-0.5 gap-0.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-indigo-300" style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.35)' }}>
                      <Focus className="w-3 h-3" />
                      Smart Crop
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-white/40 border border-transparent">
                      <Crop className="w-3 h-3" />
                      V&eacute;rification
                    </div>
                  </div>
                </div>

                {/* Subtitle customizer — mini preview + presets + colors */}
                <div className="flex items-center gap-3 p-3 rounded-[20px]" style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {/* Mini 9:16 preview */}
                  <div className="shrink-0 w-[42px] h-[75px] rounded-lg overflow-hidden relative flex items-end justify-center" style={{ background: 'linear-gradient(to bottom, rgba(30,30,40,0.8), #000)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="mb-2.5">
                      <SubtitlePreview />
                    </div>
                  </div>
                  {/* Style + Color */}
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-1 flex-wrap">
                      {[{ label: "Pop", active: true }, { label: "Smooth", active: false }, { label: "Glow", active: false }, { label: "Classique", active: false }].map((s) => (
                        <div key={s.label} className={`px-2 py-0.5 rounded-lg text-[9px] font-medium border ${s.active ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' : 'text-white/35 border-transparent'}`} style={!s.active ? { background: 'rgba(255,255,255,0.03)' } : {}}>
                          {s.label}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1 items-center">
                      {['#FFFFFF', '#FACC15', '#22D3EE', '#EF4444', '#22C55E', '#EC4899', '#FBBF24'].map((c, i) => (
                        <div key={c} className={`w-3.5 h-3.5 rounded-full ${i === 0 ? 'ring-[1.5px] ring-white ring-offset-1 ring-offset-transparent scale-110' : 'opacity-60'}`} style={{ background: c }} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results grid — 3 clip cards */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { score: 94, title: "Le moment cl\u00e9", duration: "0:42", hook: 91, retention: 88 },
                    { score: 87, title: "R\u00e9action \u00e9pique", duration: "0:31", hook: 85, retention: 82 },
                    { score: 78, title: "Conseil #1", duration: "0:55", hook: 72, retention: 80 },
                  ].map((clip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.12, ease: easeOutExpo }}
                      className="rounded-xl overflow-hidden group"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      {/* 9:16 preview area */}
                      <div className="aspect-[9/16] relative flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-black/20" />

                        {/* Play button */}
                        <div className="p-2.5 bg-black/30 rounded-full backdrop-blur-sm">
                          <Play className="w-4 h-4 text-white/70" fill="rgba(255,255,255,0.7)" />
                        </div>

                        {/* Virality badge */}
                        <div className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[8px] font-semibold flex items-center gap-0.5 ring-1 bg-gradient-to-r ${clip.score >= 90 ? 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 ring-emerald-500/30' : clip.score >= 80 ? 'from-amber-500/20 to-amber-500/5 text-amber-400 ring-amber-500/30' : 'from-orange-500/20 to-orange-500/5 text-orange-400 ring-orange-500/30'}`}>
                          <TrendingUp className="w-2 h-2" />
                          {clip.score}
                        </div>

                        {/* Duration badge */}
                        <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[8px] text-white/80 font-medium">
                          {clip.duration}
                        </div>

                        {/* Subtitle overlay */}
                        <div className="absolute bottom-6 inset-x-0 flex justify-center">
                          <span className="text-[7px] font-bold uppercase tracking-wide text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
                            REGARDEZ &Ccedil;A
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-2 space-y-1.5">
                        <p className="text-[9px] text-white/80 font-semibold truncate">{clip.title}</p>
                        {/* Score chips */}
                        <div className="grid grid-cols-2 gap-1">
                          <div className="flex items-center gap-0.5 text-[7px] text-white/50 rounded-md px-1 py-0.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <Anchor className="w-2 h-2 text-blue-400" />
                            <span>Hook: <span className="text-blue-300 font-bold">{clip.hook}</span></span>
                          </div>
                          <div className="flex items-center gap-0.5 text-[7px] text-white/50 rounded-md px-1 py-0.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <Eye className="w-2 h-2 text-pink-400" />
                            <span>Ret: <span className="text-pink-300 font-bold">{clip.retention}</span></span>
                          </div>
                        </div>
                        {/* Actions */}
                        <div className="flex gap-1">
                          <div className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-[8px] font-medium text-white">
                            <Download className="w-2.5 h-2.5" />
                          </div>
                          <div className="p-1 rounded-lg text-white/30" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <Edit className="w-2.5 h-2.5" />
                          </div>
                          <div className="p-1 rounded-lg text-white/20" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <Trash2 className="w-2.5 h-2.5" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
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
