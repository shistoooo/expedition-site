"use client";

import { motion } from "framer-motion";

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

/** Mini-mockup #1 : Navigateur avec onglets YouTube — illustre "20 onglets ouverts" */
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

/** Mini-mockup #2 : Timeline Premiere/DaVinci avec un trou rouge — illustre "media missing" */
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
          <div className="flex-[3] rounded-sm bg-gradient-to-r from-purple-500/30 to-purple-400/20 border border-purple-400/30" />
          <div className="flex-[2] rounded-sm bg-gradient-to-r from-purple-500/30 to-purple-400/20 border border-purple-400/30" />
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
          <div className="flex-[3] rounded-sm bg-gradient-to-r from-purple-500/30 to-purple-400/20 border border-purple-400/30" />
        </div>
        {/* Audio track */}
        <div className="flex gap-0.5 h-5">
          <div className="flex-[3] rounded-sm bg-cyan-500/15 border border-cyan-400/20" />
          <div className="flex-[2] rounded-sm bg-cyan-500/15 border border-cyan-400/20" />
          <div className="flex-[2] rounded-sm bg-cyan-500/15 border border-cyan-400/20" />
          <div className="flex-[3] rounded-sm bg-cyan-500/15 border border-cyan-400/20" />
        </div>
        {/* Playhead label */}
        <div className="mt-1 flex items-center justify-center">
          <span className="text-[9px] font-mono text-red-300/60">
            1 rush manquant &mdash; flow cass&eacute;
          </span>
        </div>
      </div>
    </div>
  );
}

/** Mini-mockup #3 : Conversation messagerie — illustre "T'en es où ?" */
function MessageMockup() {
  return (
    <div className="w-full aspect-[4/3] rounded-xl border border-white/10 overflow-hidden flex flex-col bg-[#0a0a14]">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border-b border-white/5">
        <div className="w-3.5 h-3.5 rounded-full bg-purple-500/40 border border-purple-400/40" />
        <span className="text-[9px] font-mono text-white/50">Client &mdash; Marc</span>
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400" />
      </div>
      {/* Messages */}
      <div className="flex-1 px-3 py-3 flex flex-col gap-2 bg-[#06051a] justify-end">
        <div className="self-start max-w-[80%] px-2.5 py-1.5 rounded-lg rounded-bl-sm bg-white/5 border border-white/5">
          <span className="text-[10px] text-white/65">T&apos;en es o&ugrave; sur le montage ?</span>
        </div>
        <div className="self-start max-w-[80%] px-2.5 py-1.5 rounded-lg rounded-bl-sm bg-white/5 border border-white/5">
          <span className="text-[10px] text-white/65">On peut avoir un preview ce soir&nbsp;?</span>
        </div>
        <div className="self-start max-w-[60%] px-2.5 py-1.5 rounded-lg rounded-bl-sm bg-red-500/15 border border-red-500/30">
          <span className="text-[10px] text-red-200/85">??</span>
        </div>
        {/* Status — encore en train de télécharger */}
        <div className="self-end max-w-[80%] px-2.5 py-1.5 rounded-lg rounded-br-sm bg-white/[0.03] border border-white/5">
          <span className="text-[10px] text-white/40 italic">en train de t&eacute;l&eacute;charger les sources&hellip;</span>
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
