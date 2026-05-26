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

/** Mockup #1 — Navigateur épuré */
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
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.04]">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-white/15" />
          <div className="w-2 h-2 rounded-full bg-white/15" />
          <div className="w-2 h-2 rounded-full bg-white/15" />
        </div>
      </div>
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
      <div className="flex-1 flex items-center justify-center px-6 py-4">
        <div
          className="relative w-full max-w-[150px] aspect-video rounded-lg overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(20,20,30,0.6) 60%, rgba(8,8,16,1) 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
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
      <div className="px-3 pb-3 flex items-center justify-center">
        <span className="text-[10px] font-mono text-white/30 tabular-nums">
          8 onglets en attente
        </span>
      </div>
    </div>
  );
}

/** Mockup #2 — Timeline épurée (accent cyan créateur) */
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
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.04]">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-white/15" />
          <div className="w-2 h-2 rounded-full bg-white/15" />
          <div className="w-2 h-2 rounded-full bg-white/15" />
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-3 px-6 py-6">
        <div className="flex gap-1 h-6">
          <div
            className="flex-[3] rounded-md"
            style={{
              background: "linear-gradient(90deg, rgba(34,211,238,0.30), rgba(34,211,238,0.18))",
            }}
          />
          <div
            className="flex-[2] rounded-md"
            style={{
              background: "linear-gradient(90deg, rgba(34,211,238,0.30), rgba(34,211,238,0.18))",
            }}
          />
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
              background: "linear-gradient(90deg, rgba(34,211,238,0.30), rgba(34,211,238,0.18))",
            }}
          />
        </div>
        <div className="flex gap-1 h-4">
          <div className="flex-[3] rounded-md" style={{ background: "rgba(139,92,246,0.15)" }} />
          <div className="flex-[2] rounded-md" style={{ background: "rgba(139,92,246,0.15)" }} />
          <div className="flex-[2] rounded-md" style={{ background: "rgba(139,92,246,0.15)" }} />
          <div className="flex-[3] rounded-md" style={{ background: "rgba(139,92,246,0.15)" }} />
        </div>
      </div>
      <div className="px-3 pb-3 flex items-center justify-center">
        <span className="text-[10px] font-mono text-white/30">flux cass&eacute;</span>
      </div>
    </div>
  );
}

/** Mockup #3 — Calendrier hebdo épuré */
function CalendarMockup() {
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  return (
    <div
      className="w-full aspect-[4/3] rounded-xl overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(180deg, rgba(15,15,22,0.95) 0%, rgba(8,8,16,0.95) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.04]">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-white/15" />
          <div className="w-2 h-2 rounded-full bg-white/15" />
          <div className="w-2 h-2 rounded-full bg-white/15" />
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-3 px-5 py-5">
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d, i) => (
            <div key={i} className="text-center">
              <div className="text-[8px] font-mono text-white/25 uppercase mb-1.5">{d}</div>
              <div
                className="h-9 rounded-md flex items-center justify-center text-[11px] font-bold"
                style={
                  i === 1
                    ? {
                        background: "rgba(34,211,238,0.20)",
                        border: "1px solid rgba(103,232,249,0.35)",
                        color: "rgb(165, 243, 252)",
                      }
                    : i === 4
                    ? {
                        background: "rgba(239,68,68,0.08)",
                        border: "1px dashed rgba(239,68,68,0.45)",
                        color: "rgba(252, 165, 165, 0.8)",
                      }
                    : {
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.04)",
                        color: "rgba(255,255,255,0.20)",
                      }
                }
              >
                {i === 1 ? "✓" : i === 4 ? "✕" : ""}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-3 pb-3 flex items-center justify-center">
        <span className="text-[10px] font-mono text-white/30">1 sortie sur 2 pr&eacute;vues</span>
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
    <section className="pt-4 md:pt-6 pb-16 md:pb-24 relative">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] pointer-events-none opacity-25"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(239,68,68,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
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
                      "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(34,211,238,0.18) 0%, transparent 70%)",
                    filter: "blur(24px)",
                  }}
                />
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    border: "1px solid rgba(103,232,249,0.25)",
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
