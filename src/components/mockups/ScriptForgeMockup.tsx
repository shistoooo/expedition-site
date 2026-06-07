"use client";

import { motion } from "framer-motion";
import { Search, Sparkles, FileText, TrendingUp } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Mockup conceptuel de ScriptForge — l'outil recherche + écriture de scripts vidéo.
 * Teaser (outil à venir) : une barre de recherche de sujet, des sources trouvées,
 * et un éditeur de script avec suggestions IA. Style cohérent avec les autres mockups.
 */
const sources = [
  { title: "Pourquoi 90% des hooks échouent", meta: "YouTube · 1.2M vues", score: 96 },
  { title: "La structure des vidéos virales 2026", meta: "Article · 8 min", score: 91 },
  { title: "20 accroches qui retiennent", meta: "Étude · récent", score: 88 },
];

export default function ScriptForgeMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative rounded-[20px] overflow-hidden shadow-2xl shadow-indigo-500/10 select-none"
      style={{ background: "#0a0a0f", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Window chrome */}
      <div
        className="h-8 flex items-center px-3 gap-1.5"
        style={{ background: "#12121a", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="text-[10px] text-white/25 ml-2 font-medium tracking-wide">ScriptForge</span>
      </div>

      <div className="p-3.5 space-y-3">
        {/* Barre de recherche de sujet */}
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Search className="w-3.5 h-3.5 text-white/30 shrink-0" />
          <span className="text-[11px] text-white/45 flex-1">Comment faire une bonne accroche YouTube&nbsp;?</span>
          <div className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[9px] font-medium flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            Rechercher
          </div>
        </div>

        {/* Sources trouvées */}
        <div className="space-y-1.5">
          <p className="text-[8px] font-mono uppercase tracking-wider text-white/30 px-1">Sources trouvées</p>
          {sources.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1, ease: easeOutExpo }}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}
              >
                <FileText className="w-3 h-3 text-indigo-300" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] text-white/75 font-medium truncate">{s.title}</p>
                <p className="text-[7px] text-white/30">{s.meta}</p>
              </div>
              <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold flex items-center gap-0.5 bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 text-emerald-400 ring-1 ring-emerald-500/30 shrink-0">
                <TrendingUp className="w-2 h-2" />
                {s.score}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Éditeur de script avec suggestion IA */}
        <div
          className="rounded-xl p-3 space-y-2"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-1.5">
            <FileText className="w-3 h-3 text-white/40" />
            <span className="text-[9px] font-semibold text-white/60">Ton script</span>
            <span className="ml-auto px-1.5 py-0.5 rounded-full text-[7px] font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 flex items-center gap-0.5">
              <Sparkles className="w-2 h-2" />
              Assist&eacute; IA
            </span>
          </div>
          {/* Lignes de script */}
          <div className="space-y-1.5">
            <div className="h-1.5 rounded-full bg-white/15" style={{ width: "92%" }} />
            <div className="h-1.5 rounded-full bg-white/10" style={{ width: "78%" }} />
            <div
              className="h-1.5 rounded-full"
              style={{ width: "85%", background: "linear-gradient(90deg, rgba(99,102,241,0.5), rgba(139,92,246,0.3))" }}
            />
            <div className="h-1.5 rounded-full bg-white/10" style={{ width: "64%" }} />
          </div>
          {/* Suggestion */}
          <div
            className="mt-2 flex items-start gap-1.5 px-2 py-1.5 rounded-lg"
            style={{ background: "rgba(99,102,241,0.08)", border: "1px dashed rgba(99,102,241,0.3)" }}
          >
            <Sparkles className="w-2.5 h-2.5 text-indigo-300 shrink-0 mt-0.5" />
            <span className="text-[8px] text-indigo-200/80 leading-relaxed">
              Suggestion : commence par une question qui crée une tension d&egrave;s la 1re seconde.
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
