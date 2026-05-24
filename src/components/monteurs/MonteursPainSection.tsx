"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const pains = [
  {
    quote: "« 20 onglets ouverts pour 1 montage »",
    text: "Tu cherches tes vidéos de référence. Tu ouvres un onglet. Un autre. Un autre. À la fin du brief, t'as plus de RAM mais t'as pas commencé à monter.",
    mockup: "browser",
  },
  {
    quote: "« Il me manque une vidéo. Encore. »",
    text: "Tu commences à monter. Tu réalises qu'il te manque un rush. Tu sors de ton flux pour aller le chercher. Tu re-perds 15 min à remettre la tête dedans.",
    mockup: "timeline",
  },
  {
    quote: "« T'en es où ? »",
    text: "Le téléchargement, c'est 1-2h par projet. Sur 5 projets/mois, ça fait des jours entiers à attendre. Pendant que ton client trépigne.",
    mockup: "message",
  },
] as const;

/** Mini-mockup #1 : Navigateur avec onglets YouTube + preview vidéo — illustre "20 onglets ouverts" */
function BrowserMockup() {
  return (
    <div
      className="w-full aspect-[4/3] rounded-xl overflow-hidden flex flex-col relative shadow-2xl"
      style={{
        background: "linear-gradient(180deg, #0a0a14 0%, #06051a 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Title bar with traffic lights */}
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/[0.04] border-b border-white/5">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/80" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
          <div className="w-2 h-2 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-auto text-[8px] font-mono text-white/30 tabular-nums">8 onglets</span>
      </div>
      {/* Tabs row */}
      <div className="flex gap-0.5 px-1.5 py-1.5 overflow-hidden bg-white/[0.015] border-b border-white/5">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className={`flex items-center gap-1 px-1.5 py-1 rounded-t-md text-[8px] whitespace-nowrap min-w-0 ${
              i === 0
                ? "bg-white/8 border-t border-x border-white/15"
                : "bg-white/[0.04] hover:bg-white/[0.06]"
            }`}
            style={{ flex: i === 0 ? 2 : 1.2 }}
          >
            <div className="w-1.5 h-1.5 bg-red-500 rounded-[2px] shrink-0" />
            <span className="text-white/45 truncate">YouTube</span>
          </div>
        ))}
        <div className="flex items-center px-1 text-white/25">
          <span className="text-[10px]">+</span>
        </div>
      </div>
      {/* Body — YouTube preview thumbnail */}
      <div className="flex-1 px-3 py-3 flex flex-col items-center justify-center gap-2 relative">
        <div
          className="relative w-full max-w-[140px] aspect-video rounded overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(180,30,30,0.18) 0%, rgba(50,20,30,0.4) 100%)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {/* Mock scanlines */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 3px)",
            }}
          />
          {/* Red play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                boxShadow: "0 4px 12px rgba(239,68,68,0.4)",
              }}
            >
              <div className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[7px] border-l-white ml-0.5" />
            </div>
          </div>
          {/* Duration badge */}
          <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/70 rounded text-[7px] font-mono text-white/90 tabular-nums">
            12:47
          </span>
        </div>
        <span className="text-[9px] font-mono text-red-300/70 tabular-nums tracking-tight">
          2.3 Go RAM &middot; 8 onglets en attente
        </span>
      </div>
    </div>
  );
}

/** Mini-mockup #2 : Timeline Premiere/DaVinci avec gap rouge — illustre "media missing" */
function TimelineMockup() {
  return (
    <div
      className="w-full aspect-[4/3] rounded-xl overflow-hidden flex flex-col relative shadow-2xl"
      style={{
        background: "linear-gradient(180deg, #0a0a14 0%, #06051a 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border-b border-white/5">
        <span className="text-[9px] font-mono text-white/45 uppercase tracking-wider">Timeline</span>
        <span className="ml-auto text-[8px] font-mono text-white/30 tabular-nums">01:23:45</span>
      </div>
      {/* Tracks */}
      <div className="flex-1 px-3 py-3 flex flex-col justify-center gap-1.5 relative">
        {/* Playhead vertical line */}
        <div
          className="absolute top-2 bottom-2 w-px pointer-events-none z-10"
          style={{
            left: "53%",
            background: "linear-gradient(180deg, rgba(239,68,68,0.8), rgba(239,68,68,0.4))",
            boxShadow: "0 0 8px rgba(239,68,68,0.5)",
          }}
        >
          <div
            className="absolute -top-1 -left-[3px] w-1.5 h-1.5 rotate-45"
            style={{ background: "rgba(239,68,68,0.9)" }}
          />
        </div>
        {/* Video track 1 */}
        <div className="flex gap-0.5 h-6">
          <div
            className="flex-[3] rounded-sm"
            style={{
              background: "linear-gradient(90deg, rgba(139,92,246,0.35) 0%, rgba(139,92,246,0.22) 100%)",
              border: "1px solid rgba(167,139,250,0.35)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          />
          <div
            className="flex-[2] rounded-sm"
            style={{
              background: "linear-gradient(90deg, rgba(139,92,246,0.35) 0%, rgba(139,92,246,0.22) 100%)",
              border: "1px solid rgba(167,139,250,0.35)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          />
          {/* GAP — media missing */}
          <div
            className="flex-[2] rounded-sm relative overflow-hidden"
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.55)",
              boxShadow: "0 0 12px rgba(239,68,68,0.25)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(239,68,68,0.35) 3px, rgba(239,68,68,0.35) 5px)",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center gap-0.5">
              <AlertTriangle className="w-2 h-2 text-red-300" />
              <span className="text-[7px] font-mono text-red-200 font-bold tracking-wide">OFFLINE</span>
            </div>
          </div>
          <div
            className="flex-[3] rounded-sm"
            style={{
              background: "linear-gradient(90deg, rgba(139,92,246,0.35) 0%, rgba(139,92,246,0.22) 100%)",
              border: "1px solid rgba(167,139,250,0.35)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          />
        </div>
        {/* Video track 2 — overlay */}
        <div className="flex gap-0.5 h-4">
          <div className="flex-[2] rounded-sm" style={{ background: "rgba(139,92,246,0.18)", border: "1px solid rgba(167,139,250,0.2)" }} />
          <div className="flex-[3] rounded-sm" style={{ background: "rgba(139,92,246,0.18)", border: "1px solid rgba(167,139,250,0.2)" }} />
          <div className="flex-[2] rounded-sm" style={{ background: "rgba(139,92,246,0.18)", border: "1px solid rgba(167,139,250,0.2)" }} />
        </div>
        {/* Audio track */}
        <div className="flex gap-0.5 h-4">
          {[3, 2, 2, 3].map((flex, i) => (
            <div
              key={i}
              className="rounded-sm relative overflow-hidden"
              style={{
                flex,
                background: "rgba(34,211,238,0.12)",
                border: "1px solid rgba(34,211,238,0.22)",
              }}
            >
              {/* Mini waveform */}
              <div className="absolute inset-0 flex items-center justify-around opacity-70">
                {Array.from({ length: 8 }).map((_, j) => (
                  <div
                    key={j}
                    className="w-px bg-cyan-300/60 rounded-full"
                    style={{ height: `${30 + Math.sin((i + j) * 1.7) * 25 + Math.cos(j * 2.3) * 15}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-1 flex items-center justify-center gap-1.5">
          <AlertTriangle className="w-2.5 h-2.5 text-red-300/80" />
          <span className="text-[9px] font-mono text-red-300/80">1 rush manquant &mdash; flow cass&eacute;</span>
        </div>
      </div>
    </div>
  );
}

/** Mini-mockup #3 : Conversation messagerie avec client impatient — illustre "T'en es où ?" */
function MessageMockup() {
  return (
    <div
      className="w-full aspect-[4/3] rounded-xl overflow-hidden flex flex-col relative shadow-2xl"
      style={{
        background: "linear-gradient(180deg, #0a0a14 0%, #06051a 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border-b border-white/5">
        <div
          className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)" }}
        >
          M
        </div>
        <span className="text-[9px] font-mono text-white/55">Marc &mdash; Client</span>
        <span className="ml-auto flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[7px] font-mono text-green-400/70">en ligne</span>
        </span>
      </div>
      {/* Messages */}
      <div className="flex-1 px-3 py-3 flex flex-col gap-1.5 justify-end relative">
        <div className="self-start max-w-[80%]">
          <div
            className="px-2.5 py-1.5 rounded-lg rounded-bl-sm"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span className="text-[10px] text-white/75">T&apos;en es o&ugrave; sur le montage ?</span>
          </div>
          <span className="text-[7px] font-mono text-white/25 ml-1">14:23</span>
        </div>
        <div className="self-start max-w-[80%]">
          <div
            className="px-2.5 py-1.5 rounded-lg rounded-bl-sm"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span className="text-[10px] text-white/75">On peut avoir un preview ce soir&nbsp;?</span>
          </div>
          <span className="text-[7px] font-mono text-white/25 ml-1">14:25</span>
        </div>
        <div className="self-start max-w-[40%]">
          <div
            className="px-2.5 py-1.5 rounded-lg rounded-bl-sm"
            style={{
              background: "rgba(239,68,68,0.18)",
              border: "1px solid rgba(239,68,68,0.4)",
              boxShadow: "0 0 12px rgba(239,68,68,0.2)",
            }}
          >
            <span className="text-[11px] text-red-100 font-bold">??</span>
          </div>
          <span className="text-[7px] font-mono text-red-300/50 ml-1">14:32</span>
        </div>
        {/* Status — encore en train de télécharger */}
        <div className="self-end max-w-[80%] flex items-center gap-1.5 mt-1 px-2.5 py-1.5 rounded-lg rounded-br-sm" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex gap-0.5">
            <span className="w-1 h-1 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: "0ms" }} />
            <span className="w-1 h-1 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: "150ms" }} />
            <span className="w-1 h-1 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-[9px] text-white/40 italic">en train de t&eacute;l&eacute;charger les sources&hellip;</span>
        </div>
      </div>
    </div>
  );
}

const MockupComponents = {
  browser: BrowserMockup,
  timeline: TimelineMockup,
  message: MessageMockup,
};

export default function MonteursPainSection() {
  return (
    <section className="py-16 md:py-24 relative">
      {/* Ambient nebula behind the section — subtle red glow for "pain" */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(239,68,68,0.10) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="container-main max-w-6xl relative z-10">
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
                className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.01) 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Hover glow — top accent */}
                <div
                  className="absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 h-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.22) 0%, transparent 70%)",
                    filter: "blur(24px)",
                  }}
                />
                {/* Hover border accent */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    border: "1px solid rgba(167,139,250,0.30)",
                    boxShadow: "0 0 40px rgba(139,92,246,0.10), inset 0 1px 0 rgba(255,255,255,0.05)",
                  }}
                />

                {/* Decorative quote mark in background */}
                <span
                  className="absolute top-4 right-4 text-7xl font-serif leading-none select-none pointer-events-none text-purple-500/[0.07] group-hover:text-purple-500/[0.12] transition-colors duration-500"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                <div className="relative p-5 md:p-6">
                  {/* Mockup */}
                  <div className="mb-5 transition-transform duration-300 group-hover:scale-[1.01]">
                    <Mockup />
                  </div>

                  {/* Quote */}
                  <p className="font-bold text-base md:text-lg text-white mb-2 leading-snug">
                    {pain.quote}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-white/55 leading-relaxed">{pain.text}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
