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

/** Mockup #1 — Navigateur : minimaliste, focus sur la vidéo centrale */
function BrowserMockup() {
  return (
    <div
      className="w-full aspect-[4/3] rounded-xl overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(180deg, rgba(15,15,22,0.95) 0%, rgba(8,8,16,0.95) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.04]">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-white/15" />
          <div className="w-2 h-2 rounded-full bg-white/15" />
          <div className="w-2 h-2 rounded-full bg-white/15" />
        </div>
      </div>
      {/* Tabs — épurés, espacés */}
      <div className="flex gap-1 px-3 pt-3 pb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full"
            style={{
              background: i === 0 ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.06)",
            }}
          />
        ))}
      </div>
      {/* Body — vidéo centrale, focus */}
      <div className="flex-1 flex items-center justify-center px-6 py-4">
        <div
          className="relative w-full max-w-[150px] aspect-video rounded-lg overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(20,20,30,0.6) 60%, rgba(8,8,16,1) 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Play icon — subtil */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(239,68,68,0.85)",
                boxShadow: "0 4px 16px rgba(239,68,68,0.25)",
              }}
            >
              <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[8px] border-l-white ml-0.5" />
            </div>
          </div>
        </div>
      </div>
      {/* Footer compteur — discret */}
      <div className="px-3 pb-3 flex items-center justify-center">
        <span className="text-[10px] font-mono text-white/30 tabular-nums">
          8 onglets en attente
        </span>
      </div>
    </div>
  );
}

/** Mockup #2 — Timeline : 2 tracks épurées, gap minimaliste */
function TimelineMockup() {
  return (
    <div
      className="w-full aspect-[4/3] rounded-xl overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(180deg, rgba(15,15,22,0.95) 0%, rgba(8,8,16,0.95) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.04]">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-white/15" />
          <div className="w-2 h-2 rounded-full bg-white/15" />
          <div className="w-2 h-2 rounded-full bg-white/15" />
        </div>
      </div>
      {/* Tracks — espacés, doux */}
      <div className="flex-1 flex flex-col justify-center gap-3 px-6 py-6">
        {/* Track 1 : video */}
        <div className="flex gap-1 h-6">
          <div
            className="flex-[3] rounded-md"
            style={{
              background: "linear-gradient(90deg, rgba(139,92,246,0.30), rgba(139,92,246,0.18))",
            }}
          />
          <div
            className="flex-[2] rounded-md"
            style={{
              background: "linear-gradient(90deg, rgba(139,92,246,0.30), rgba(139,92,246,0.18))",
            }}
          />
          {/* GAP — outline rouge subtil, sans stripes */}
          <div
            className="flex-[2] rounded-md flex items-center justify-center"
            style={{
              border: "1px dashed rgba(239,68,68,0.5)",
              background: "rgba(239,68,68,0.05)",
            }}
          >
            <span className="text-[8px] font-mono text-red-300/80 tracking-wide">manquant</span>
          </div>
          <div
            className="flex-[3] rounded-md"
            style={{
              background: "linear-gradient(90deg, rgba(139,92,246,0.30), rgba(139,92,246,0.18))",
            }}
          />
        </div>
        {/* Track 2 : audio (simple barres, pas de waveform) */}
        <div className="flex gap-1 h-4">
          <div className="flex-[3] rounded-md" style={{ background: "rgba(34,211,238,0.15)" }} />
          <div className="flex-[2] rounded-md" style={{ background: "rgba(34,211,238,0.15)" }} />
          <div className="flex-[2] rounded-md" style={{ background: "rgba(34,211,238,0.15)" }} />
          <div className="flex-[3] rounded-md" style={{ background: "rgba(34,211,238,0.15)" }} />
        </div>
      </div>
      {/* Footer — discret */}
      <div className="px-3 pb-3 flex items-center justify-center">
        <span className="text-[10px] font-mono text-white/30">
          1 rush manquant
        </span>
      </div>
    </div>
  );
}

/** Mockup #3 — Messagerie : 2 messages, propre, sans timestamps */
function MessageMockup() {
  return (
    <div
      className="w-full aspect-[4/3] rounded-xl overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(180deg, rgba(15,15,22,0.95) 0%, rgba(8,8,16,0.95) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Header — avatar + nom seulement */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.04]">
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white/80"
          style={{ background: "rgba(139,92,246,0.20)", border: "1px solid rgba(167,139,250,0.25)" }}
        >
          M
        </div>
        <span className="text-[10px] font-medium text-white/55">Marc</span>
      </div>
      {/* Messages — espacés, épurés */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-2.5 justify-end">
        <div className="self-start max-w-[80%] px-3 py-2 rounded-2xl rounded-bl-md" style={{ background: "rgba(255,255,255,0.04)" }}>
          <span className="text-[11px] text-white/75">T&apos;en es o&ugrave; sur le montage&nbsp;?</span>
        </div>
        <div className="self-start max-w-[35%] px-3 py-2 rounded-2xl rounded-bl-md" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}>
          <span className="text-[12px] text-red-200/90 font-bold">??</span>
        </div>
      </div>
      {/* Status discret en bas */}
      <div className="px-4 pb-3 flex items-center justify-center gap-1.5">
        <div className="flex gap-0.5">
          <span className="w-1 h-1 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: "0ms" }} />
          <span className="w-1 h-1 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: "150ms" }} />
          <span className="w-1 h-1 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: "300ms" }} />
        </div>
        <span className="text-[10px] font-mono text-white/30 italic">téléchargement&hellip;</span>
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
    <section className="pt-4 md:pt-6 pb-16 md:pb-24 relative">
      {/* Ambient subtil */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] pointer-events-none opacity-25"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(239,68,68,0.08) 0%, transparent 70%)",
          display: "none",
        }}
      />

      <div className="container-main max-w-6xl relative z-10">
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
                  background: "rgba(255,255,255,0.018)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 h-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.18) 0%, transparent 70%)",
                    display: "none",
                  }}
                />
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    border: "1px solid rgba(167,139,250,0.25)",
                  }}
                />

                <div className="relative p-6 md:p-7">
                  <div className="mb-6 transition-transform duration-300 group-hover:scale-[1.01]">
                    <Mockup />
                  </div>
                  <p className="font-bold text-base md:text-lg text-white mb-2 leading-snug">
                    {pain.quote}
                  </p>
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
