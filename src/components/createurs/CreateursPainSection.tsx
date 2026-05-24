"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Calendar } from "lucide-react";

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

/** Mini-mockup #1 : Navigateur avec onglets YouTube + preview vidéo */
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
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/[0.04] border-b border-white/5">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/80" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
          <div className="w-2 h-2 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-auto text-[8px] font-mono text-white/30 tabular-nums">8 onglets</span>
      </div>
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
      <div className="flex-1 px-3 py-3 flex flex-col items-center justify-center gap-2 relative">
        <div
          className="relative w-full max-w-[140px] aspect-video rounded overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(180,30,30,0.18) 0%, rgba(50,20,30,0.4) 100%)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 3px)",
            }}
          />
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
          <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/70 rounded text-[7px] font-mono text-white/90 tabular-nums">
            12:47
          </span>
        </div>
        <span className="text-[9px] font-mono text-cyan-300/70 tabular-nums tracking-tight">
          2.3 Go RAM &middot; 8 onglets en attente
        </span>
      </div>
    </div>
  );
}

/** Mini-mockup #2 : Timeline avec gap rouge — accent cyan créateur */
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
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border-b border-white/5">
        <span className="text-[9px] font-mono text-white/45 uppercase tracking-wider">Timeline</span>
        <span className="ml-auto text-[8px] font-mono text-white/30 tabular-nums">01:23:45</span>
      </div>
      <div className="flex-1 px-3 py-3 flex flex-col justify-center gap-1.5 relative">
        {/* Playhead */}
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
              background: "linear-gradient(90deg, rgba(34,211,238,0.32) 0%, rgba(34,211,238,0.20) 100%)",
              border: "1px solid rgba(103,232,249,0.35)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          />
          <div
            className="flex-[2] rounded-sm"
            style={{
              background: "linear-gradient(90deg, rgba(34,211,238,0.32) 0%, rgba(34,211,238,0.20) 100%)",
              border: "1px solid rgba(103,232,249,0.35)",
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
              background: "linear-gradient(90deg, rgba(34,211,238,0.32) 0%, rgba(34,211,238,0.20) 100%)",
              border: "1px solid rgba(103,232,249,0.35)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          />
        </div>
        {/* Overlay track */}
        <div className="flex gap-0.5 h-4">
          <div className="flex-[2] rounded-sm" style={{ background: "rgba(34,211,238,0.16)", border: "1px solid rgba(103,232,249,0.2)" }} />
          <div className="flex-[3] rounded-sm" style={{ background: "rgba(34,211,238,0.16)", border: "1px solid rgba(103,232,249,0.2)" }} />
          <div className="flex-[2] rounded-sm" style={{ background: "rgba(34,211,238,0.16)", border: "1px solid rgba(103,232,249,0.2)" }} />
        </div>
        {/* Audio track */}
        <div className="flex gap-0.5 h-4">
          {[3, 2, 2, 3].map((flex, i) => (
            <div
              key={i}
              className="rounded-sm relative overflow-hidden"
              style={{
                flex,
                background: "rgba(139,92,246,0.14)",
                border: "1px solid rgba(167,139,250,0.22)",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-around opacity-70">
                {Array.from({ length: 8 }).map((_, j) => (
                  <div
                    key={j}
                    className="w-px bg-purple-300/60 rounded-full"
                    style={{ height: `${30 + Math.sin((i + j) * 1.7) * 25 + Math.cos(j * 2.3) * 15}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-1 flex items-center justify-center gap-1.5">
          <AlertTriangle className="w-2.5 h-2.5 text-red-300/80" />
          <span className="text-[9px] font-mono text-red-300/80">Flux cass&eacute; &mdash; faut chercher</span>
        </div>
      </div>
    </div>
  );
}

/** Mini-mockup #3 : Calendrier hebdo avec publications décalées — spécifique créateur */
function CalendarMockup() {
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  return (
    <div
      className="w-full aspect-[4/3] rounded-xl overflow-hidden flex flex-col relative shadow-2xl"
      style={{
        background: "linear-gradient(180deg, #0a0a14 0%, #06051a 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border-b border-white/5">
        <Calendar className="w-3 h-3 text-white/45" />
        <span className="text-[9px] font-mono text-white/45 uppercase tracking-wider">Semaine 12</span>
        <span className="ml-auto text-[8px] font-mono text-white/30 tabular-nums">2 prévues</span>
      </div>
      <div className="flex-1 px-3 py-3 flex flex-col justify-center gap-2.5 relative">
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d, i) => (
            <div key={i} className="text-center">
              <div className="text-[8px] font-mono text-white/30 uppercase mb-1">{d}</div>
              <div
                className={`h-9 rounded-md flex items-center justify-center text-[11px] font-bold transition-all ${
                  i === 1
                    ? "text-cyan-100"
                    : i === 4
                    ? "text-red-200"
                    : "text-white/25"
                }`}
                style={
                  i === 1
                    ? {
                        background: "linear-gradient(135deg, rgba(34,211,238,0.28) 0%, rgba(34,211,238,0.15) 100%)",
                        border: "1px solid rgba(103,232,249,0.45)",
                        boxShadow: "0 0 12px rgba(34,211,238,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
                      }
                    : i === 4
                    ? {
                        background: "rgba(239,68,68,0.14)",
                        border: "1px solid rgba(239,68,68,0.4)",
                        boxShadow: "0 0 10px rgba(239,68,68,0.18)",
                      }
                    : {
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }
                }
              >
                {i === 1 ? "✓" : i === 4 ? "✕" : ""}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-sm bg-cyan-400" style={{ boxShadow: "0 0 6px rgba(34,211,238,0.5)" }} />
            <span className="text-[8px] font-mono text-white/55">Mar &mdash; 1 vid&eacute;o sortie</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-sm bg-red-500" style={{ boxShadow: "0 0 6px rgba(239,68,68,0.5)" }} />
            <span className="text-[8px] font-mono text-red-300/80">Ven &mdash; rat&eacute;e</span>
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
      {/* Ambient nebula — subtle red glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(239,68,68,0.10) 0%, transparent 70%)",
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
                  background: "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.01) 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Hover glow — cyan accent for créateurs */}
                <div
                  className="absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 h-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(34,211,238,0.22) 0%, transparent 70%)",
                    filter: "blur(24px)",
                  }}
                />
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    border: "1px solid rgba(103,232,249,0.30)",
                    boxShadow: "0 0 40px rgba(34,211,238,0.10), inset 0 1px 0 rgba(255,255,255,0.05)",
                  }}
                />

                {/* Decorative quote */}
                <span
                  className="absolute top-4 right-4 text-7xl font-serif leading-none select-none pointer-events-none text-cyan-500/[0.07] group-hover:text-cyan-500/[0.12] transition-colors duration-500"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                <div className="relative p-5 md:p-6">
                  <div className="mb-5 transition-transform duration-300 group-hover:scale-[1.01]">
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
