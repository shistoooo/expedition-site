"use client";

import { motion } from "framer-motion";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const pains = [
  {
    quote: "« 20 onglets, et j'ai pas encore commencé »",
    text: "Tu prépares ta vidéo, tu accumules les références. À l'heure de monter, t'es perdu dans tes onglets et t'as oublié pourquoi tu avais ouvert celui-là.",
    mockup: "browser",
  },
  {
    quote: "« Je sors de mon flux créatif »",
    text: "T'es dans le flow, t'as les bonnes idées. Tu réalises qu'il te manque un rush, tu sors de ta tête pour aller le chercher. Tu reviens — t'as perdu l'inspiration.",
    mockup: "timeline",
  },
  {
    quote: "« Ma cadence dérape »",
    text: "Tu voulais 2 vidéos par semaine. T'en fais 1. Le téléchargement et le rangement bouffent les heures que tu voulais passer à filmer ou écrire.",
    mockup: "calendar",
  },
] as const;

/** Mini-mockup #1 : Navigateur avec onglets YouTube — illustre les références qui s'accumulent */
function BrowserMockup() {
  return (
    <div className="w-full aspect-[4/3] rounded-xl border border-white/10 overflow-hidden flex flex-col bg-[#0a0a14]">
      {/* Title bar */}
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/[0.03] border-b border-white/5">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
          <div className="w-2 h-2 rounded-full bg-green-500/60" />
        </div>
      </div>
      {/* Tabs row */}
      <div className="flex gap-0.5 px-2 py-1.5 overflow-hidden bg-white/[0.015] border-b border-white/5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-1 px-1.5 py-1 bg-white/5 rounded-t text-[8px] whitespace-nowrap min-w-0 flex-1"
            style={{ minWidth: 0 }}
          >
            <div className="w-1.5 h-1.5 bg-red-500 rounded-[2px] shrink-0" />
            <span className="text-white/40 truncate">YouTube</span>
          </div>
        ))}
      </div>
      {/* Body */}
      <div className="flex-1 px-3 py-3 flex flex-col items-center justify-center gap-2 bg-[#06051a]">
        <div className="w-full max-w-[140px] h-14 rounded bg-white/5 border border-white/5 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-500/70 fill-current">
            <path d="M21.582 7.06a2.51 2.51 0 0 0-1.768-1.769C18.254 5 12 5 12 5s-6.254 0-7.814.291A2.51 2.51 0 0 0 2.418 7.06C2.127 8.62 2.127 12 2.127 12s0 3.38.291 4.94a2.51 2.51 0 0 0 1.768 1.769C5.746 19 12 19 12 19s6.254 0 7.814-.291a2.51 2.51 0 0 0 1.768-1.769c.291-1.56.291-4.94.291-4.94s0-3.38-.291-4.94zM10 15V9l5 3-5 3z" />
          </svg>
        </div>
        <span className="text-[9px] font-mono text-red-300/60 tracking-tight">
          8&nbsp;onglets de plus en attente
        </span>
      </div>
    </div>
  );
}

/** Mini-mockup #2 : Timeline avec un trou rouge — illustre la rupture du flux créatif */
function TimelineMockup() {
  return (
    <div className="w-full aspect-[4/3] rounded-xl border border-white/10 overflow-hidden flex flex-col bg-[#0a0a14]">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border-b border-white/5">
        <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider">Timeline</span>
      </div>
      {/* Tracks */}
      <div className="flex-1 px-3 py-3 flex flex-col justify-center gap-1.5 bg-[#06051a]">
        {/* Video track */}
        <div className="flex gap-0.5 h-7">
          <div className="flex-[3] rounded-sm bg-gradient-to-r from-cyan-500/30 to-cyan-400/20 border border-cyan-400/30" />
          <div className="flex-[2] rounded-sm bg-gradient-to-r from-cyan-500/30 to-cyan-400/20 border border-cyan-400/30" />
          {/* GAP — media missing */}
          <div className="flex-[2] rounded-sm border border-red-500/50 bg-red-500/10 relative overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(239,68,68,0.3) 3px, rgba(239,68,68,0.3) 5px)",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[7px] font-mono text-red-300/90 font-bold tracking-wide">
                MEDIA OFFLINE
              </span>
            </div>
          </div>
          <div className="flex-[3] rounded-sm bg-gradient-to-r from-cyan-500/30 to-cyan-400/20 border border-cyan-400/30" />
        </div>
        {/* Audio track */}
        <div className="flex gap-0.5 h-5">
          <div className="flex-[3] rounded-sm bg-purple-500/15 border border-purple-400/20" />
          <div className="flex-[2] rounded-sm bg-purple-500/15 border border-purple-400/20" />
          <div className="flex-[2] rounded-sm bg-purple-500/15 border border-purple-400/20" />
          <div className="flex-[3] rounded-sm bg-purple-500/15 border border-purple-400/20" />
        </div>
        {/* Playhead label */}
        <div className="mt-1 flex items-center justify-center">
          <span className="text-[9px] font-mono text-red-300/60">
            Flux cass&eacute; &mdash; faut tout rechercher
          </span>
        </div>
      </div>
    </div>
  );
}

/** Mini-mockup #3 : Mini calendrier hebdo avec publications qui dérapent — illustre cadence ratée */
function CalendarMockup() {
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  return (
    <div className="w-full aspect-[4/3] rounded-xl border border-white/10 overflow-hidden flex flex-col bg-[#0a0a14]">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border-b border-white/5">
        <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider">Cadence de publication</span>
      </div>
      {/* Days grid */}
      <div className="flex-1 px-3 py-3 flex flex-col justify-center gap-2 bg-[#06051a]">
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => (
            <div key={i} className="text-center">
              <div className="text-[7px] font-mono text-white/30 uppercase mb-0.5">{d}</div>
              <div
                className={`h-7 rounded flex items-center justify-center text-[7px] font-bold ${
                  i === 1
                    ? "bg-cyan-500/25 border border-cyan-400/40 text-cyan-200"
                    : i === 4
                    ? "bg-red-500/15 border border-red-500/30 text-red-300"
                    : "bg-white/[0.02] border border-white/5 text-white/30"
                }`}
              >
                {i === 1 ? "✓" : i === 4 ? "✕" : ""}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-3 mt-1">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-sm bg-cyan-400/60" />
            <span className="text-[8px] font-mono text-white/50">1 sortie</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-sm bg-red-500/60" />
            <span className="text-[8px] font-mono text-red-300/70">1 d&eacute;cal&eacute;e</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const MockupComponents = {
  browser: BrowserMockup,
  timeline: TimelineMockup,
  calendar: CalendarMockup,
};

export default function CreateursPainSection() {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="container-main max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4 flex items-center justify-center gap-2">
            <span className="w-8 h-px bg-white/20" />
            Difficult&eacute;s
            <span className="w-8 h-px bg-white/20" />
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05]">
            Tu rencontres ces probl&egrave;mes&nbsp;?
          </h2>
        </motion.div>

        {/* Pains grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {pains.map((pain, i) => {
            const Mockup = MockupComponents[pain.mockup];
            return (
              <motion.div
                key={pain.mockup}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: easeOutExpo }}
                className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 md:p-6 hover:border-white/[0.16] hover:bg-white/[0.035] transition-all duration-300"
              >
                {/* Mockup */}
                <div className="mb-5 transition-transform duration-300 group-hover:-translate-y-0.5">
                  <Mockup />
                </div>

                {/* Quote */}
                <p className="font-bold text-base md:text-lg text-white mb-2 leading-snug">
                  {pain.quote}
                </p>

                {/* Description */}
                <p className="text-sm text-white/55 leading-relaxed">
                  {pain.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
