"use client";

import { motion } from "framer-motion";
import { Clapperboard, Link2, Scissors, Gauge } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];
const AMBER = "#ff6a1f";

const CARD = "rounded-xl border border-white/10 bg-[#0b0b13] transition-colors duration-300 group-hover:border-red-400/35";

/* ── Mini-mockups littéraux (tout en CSS, DA ember) ─────────────────────── */

// 01 — une vraie timeline de montage : règle, pistes V1/A1, playhead, le clip posé
function VizTimeline() {
  return (
    <div className={`${CARD} overflow-hidden`}>
      {/* règle temporelle */}
      <div className="flex items-center justify-between px-3 h-6 border-b border-white/[0.06] bg-white/[0.02]">
        {["00:00", "00:05", "00:10", "00:15", "00:20"].map((t) => (
          <span key={t} className="text-[8px] font-mono text-white/25">{t}</span>
        ))}
      </div>
      <div className="relative p-2.5 space-y-1.5">
        {/* playhead */}
        <div className="absolute top-1 bottom-1 left-[46%] w-px bg-red-400 z-10">
          <span className="absolute -top-1 -left-[3px] w-[7px] h-[7px] rotate-45 bg-red-400" />
        </div>
        {/* piste vidéo V1 avec le clip qui vient d'atterrir */}
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-mono text-white/30 w-4">V1</span>
          <div className="flex-1 h-6 rounded bg-white/[0.03] relative">
            <div
              className="absolute left-[22%] top-0 h-6 w-[50%] rounded flex items-center px-1 gap-[2px] overflow-hidden ring-1 ring-white/20"
              style={{ background: "linear-gradient(135deg, #ff6a1f, #ef3a24)" }}
            >
              {Array.from({ length: 13 }).map((_, i) => (
                <span key={i} className="w-[2px] rounded-full bg-white/60" style={{ height: `${25 + (i % 5) * 13}%` }} />
              ))}
            </div>
          </div>
        </div>
        {/* piste audio A1 */}
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-mono text-white/30 w-4">A1</span>
          <div className="flex-1 h-4 rounded bg-white/[0.03] relative">
            <div className="absolute left-[22%] top-0 h-4 w-[50%] rounded flex items-center px-1 gap-[1px] overflow-hidden bg-emerald-500/20">
              {Array.from({ length: 26 }).map((_, i) => (
                <span key={i} className="flex-1 rounded-full bg-emerald-400/50" style={{ height: `${20 + ((i * 29) % 55)}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="px-3 pb-2 text-[10px] font-mono text-white/30">▸ importé dans Premiere</p>
    </div>
  );
}

// 02 — n'importe quelle plateforme : vrais logos (usage nominatif « sites supportés »)
const PLATFORM_LOGOS: { n: string; svg: React.ReactNode }[] = [
  { n: "YouTube", svg: (<><rect width="28" height="28" rx="7" fill="#FF0000" /><path d="M11.5 9.5v9l7.5-4.5z" fill="#fff" /></>) },
  { n: "TikTok", svg: (<><rect width="28" height="28" rx="7" fill="#010101" /><path d="M17.5 7c.35 1.9 1.55 3.1 3.3 3.35v2.45c-1.15.1-2.2-.25-3.3-.85v4.55a4.55 4.55 0 1 1-4.55-4.55c.25 0 .5.02.75.06v2.5a2.15 2.15 0 1 0 1.5 2.05V7h2.3z" fill="#25F4EE" /></>) },
  { n: "Instagram", svg: (<><rect width="28" height="28" rx="7" fill="url(#igg)" /><rect x="7.5" y="7.5" width="13" height="13" rx="4.2" fill="none" stroke="#fff" strokeWidth="1.7" /><circle cx="14" cy="14" r="3.4" fill="none" stroke="#fff" strokeWidth="1.7" /><circle cx="18.6" cy="9.4" r="1.15" fill="#fff" /><defs><linearGradient id="igg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#F58529" /><stop offset=".5" stopColor="#DD2A7B" /><stop offset="1" stopColor="#8134AF" /></linearGradient></defs></>) },
  { n: "X", svg: (<><rect width="28" height="28" rx="7" fill="#000" /><path d="M9 8.5l10 11M19 8.5L9 19.5" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" /></>) },
  { n: "Twitch", svg: (<><rect width="28" height="28" rx="7" fill="#9146FF" /><path d="M10 8h9v6l-2.5 2.5H14l-2 2v-2h-2V8z" fill="#fff" /><path d="M13 10.5v3M16 10.5v3" stroke="#9146FF" strokeWidth="1.3" strokeLinecap="round" /></>) },
  { n: "Vimeo", svg: (<><rect width="28" height="28" rx="7" fill="#1AB7EA" /><path d="M9 11.5c.6-.9 1.5-1.6 2.4-1.1.9.5.7 2 .4 3-.3 1-.9 2.4-.3 2.6.6.2 1.7-1.5 2.3-2.8.6-1.4 1-3 .3-3.8-.8-.9-2.2-.5-3 .2" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></>) },
  { n: "Facebook", svg: (<><rect width="28" height="28" rx="7" fill="#1877F2" /><path d="M16.5 14.5h2l.4-2.6h-2.4v-1.6c0-.75.35-1.4 1.5-1.4h1V6.7s-.9-.15-1.8-.15c-1.85 0-3 1.1-3 3.1v1.65H10v2.6h2.2V21h2.3v-6.5z" fill="#fff" /></>) },
];
function VizSites() {
  return (
    <div className={`${CARD} p-3.5`}>
      <div className="flex flex-wrap gap-1.5 items-center">
        {PLATFORM_LOGOS.map((p) => (
          <span key={p.n} title={p.n} className="w-7 h-7 rounded-[7px] overflow-hidden">
            <svg viewBox="0 0 28 28" className="w-7 h-7" aria-label={p.n}>{p.svg}</svg>
          </span>
        ))}
        <span className="h-7 px-2 rounded-[7px] inline-flex items-center text-[11px] font-bold" style={{ background: "rgba(255,106,31,0.15)", color: AMBER, border: "1px solid rgba(255,106,31,0.3)" }}>
          +1493
        </span>
      </div>
      <p className="mt-2.5 text-[10px] font-mono text-white/30">…et des centaines d&apos;autres</p>
    </div>
  );
}

// 03 — une pellicule vidéo avec points d'entrée/sortie sur le passage gardé
function VizTrim() {
  return (
    <div className={`${CARD} p-3`}>
      <div className="relative flex gap-[2px] rounded-md overflow-hidden h-12">
        {Array.from({ length: 9 }).map((_, i) => {
          const inSel = i >= 3 && i <= 4;
          return (
            <div
              key={i}
              className="flex-1 rounded-[3px] transition-opacity"
              style={{
                background: `linear-gradient(135deg, hsl(${(i * 40) % 360} 40% ${inSel ? 42 : 22}%), hsl(${(i * 40 + 60) % 360} 35% ${inSel ? 30 : 14}%))`,
                opacity: inSel ? 1 : 0.4,
              }}
            />
          );
        })}
        {/* cadre de sélection IN/OUT */}
        <div className="absolute inset-y-0 rounded-md border-2 pointer-events-none" style={{ left: "33.3%", width: "22.2%", borderColor: AMBER, boxShadow: "0 0 14px rgba(255,106,31,0.35)" }}>
          <span className="absolute -left-[3px] top-1/2 -translate-y-1/2 w-1.5 h-5 rounded-full" style={{ background: AMBER }} />
          <span className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-1.5 h-5 rounded-full" style={{ background: AMBER }} />
        </div>
      </div>
      <div className="flex justify-between mt-2 text-[10px] font-mono">
        <span className="text-white/30">0:00</span>
        <span style={{ color: AMBER }}>0:30 gardées</span>
        <span className="text-white/30">2:14:00</span>
      </div>
    </div>
  );
}

// 04 — plusieurs téléchargements : 3 en parallèle + file d'attente
function VizQueue() {
  const active = [
    { name: "Trailer S2", pct: 72 },
    { name: "Reaction clip", pct: 48 },
    { name: "B-roll ville", pct: 21 },
  ];
  return (
    <div className={`${CARD} p-3.5 space-y-2`}>
      {active.map((d) => (
        <div key={d.name} className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span className="text-[10px] text-white/50 w-[74px] truncate">{d.name}</span>
          <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${d.pct}%`, background: "linear-gradient(90deg,#ff6a1f,#ef3a24)" }} />
          </div>
          <span className="text-[10px] tabular-nums w-8 text-right" style={{ color: AMBER }}>{d.pct}%</span>
        </div>
      ))}
      {/* file d'attente */}
      <div className="pt-1 mt-1 border-t border-white/[0.06] flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
        <span className="text-[10px] font-mono text-white/30">+7 en file, s&apos;enchaînent tout seuls</span>
      </div>
    </div>
  );
}

// wide = cellule dominante du bento (2 colonnes, texte à gauche + mockup à
// droite). L'ASYMÉTRIE est volontaire : une grille 2×2 parfaitement régulière
// est le tell « généré » n°1 — un vrai bento a une hiérarchie.
const FEATURES = [
  {
    icon: Clapperboard,
    title: "Ça atterrit direct sur ta timeline",
    desc: "Pas de dossier à ranger, pas de glisser-déposer. La vidéo apparaît sur Premiere ou DaVinci, prête à couper.",
    Viz: VizTimeline,
    wide: true,
  },
  {
    icon: Link2,
    title: "1500+ sites, zéro prise de tête",
    desc: "Vimeo, TikTok, X, YouTube… même geste à chaque fois, peu importe d'où ça vient.",
    Viz: VizSites,
    wide: false,
  },
  {
    icon: Scissors,
    title: "Juste le passage qui t'intéresse",
    desc: "30 secondes utiles dans une vidéo de 2h ? Tu sélectionnes, tu récupères que ça, pas le reste.",
    Viz: VizTrim,
    wide: false,
  },
  {
    icon: Gauge,
    title: "4K, et autant que tu veux à la chaîne",
    desc: "Lance-en autant que tu veux : 3 se téléchargent en même temps, les autres s'enchaînent tout seuls pendant que tu montes.",
    Viz: VizQueue,
    wide: true,
  },
];

export default function FeaturesList() {
  return (
    // Bento asymétrique : 01 (timeline) domine en haut sur 2 colonnes, 02/03
    // se partagent la rangée du milieu, 04 (file d'attente) referme en large.
    // Les cellules larges couchent le texte à gauche du mockup ; les étroites
    // empilent — deux layouts internes, pas un gabarit unique.
    <div className="grid md:grid-cols-2 gap-4 md:gap-5">
      {FEATURES.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.07, ease: easeOutExpo }}
          className={`group relative rounded-2xl border border-white/[0.08] bg-[#0b0a14] transition-colors duration-300 hover:bg-[#12111c] hover:border-white/[0.14] ${f.wide ? "md:col-span-2" : ""}`}
        >
          <div className={`h-full p-6 md:p-7 ${f.wide ? "flex flex-col md:flex-row md:items-center gap-6 md:gap-10" : "flex flex-col"}`}>
            <div className={f.wide ? "md:max-w-sm shrink-0" : ""}>
              <div className="flex items-baseline gap-3 mb-5">
                <span className="font-mono text-sm tabular-nums" style={{ color: "#ff6a1f" }}>{String(i + 1).padStart(2, "0")}</span>
                <span className={`h-px bg-white/[0.07] ${f.wide ? "w-16" : "flex-1"}`} />
              </div>
              <h3 className={`font-bold text-white mb-1.5 ${f.wide ? "text-xl md:text-2xl" : "text-lg"}`}>{f.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
            </div>
            <div className={f.wide ? "flex-1 min-w-0" : "mt-6 md:mt-auto md:pt-6"}>
              <f.Viz />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
