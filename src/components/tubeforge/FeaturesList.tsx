"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* Palette = celle du wordmark TubeForge (globals.css .tf-forge-flow) :
   ember → rouge, avec le VIOLET du logo en touche rare et signifiante
   (piste audio, file d'attente) — jamais en décor. */
const AMBER = "#ff6a1f";
const RED = "#ef3a24";
const VIOLET = "#8b3dff";

/* ── Mini-mockups : 4 TEXTURES volontairement différentes ─────────────────
   01 pistes horizontales · 02 mosaïque de tuiles · 03 typographique
   04 colonnes verticales. Aucun ne réutilise la silhouette d'un autre. */

// 01 — la timeline de montage : règle, piste vidéo (ember), piste audio (violet)
function VizTimeline() {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        {["00:00", "00:05", "00:10", "00:15", "00:20"].map((t) => (
          <span key={t} className="font-mono text-[9px] text-white/25 tabular-nums">{t}</span>
        ))}
      </div>
      <div className="relative space-y-1.5">
        <div className="absolute top-0 bottom-0 left-[46%] w-px z-10" style={{ background: AMBER }}>
          <span className="absolute -top-1 -left-[3px] w-[7px] h-[7px] rotate-45" style={{ background: AMBER }} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-white/30 w-4">V1</span>
          <div className="flex-1 h-6 bg-white/[0.04] relative">
            <div
              className="absolute left-[22%] top-0 h-6 w-[50%] flex items-center px-1 gap-[2px] overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${AMBER}, ${RED})` }}
            >
              {Array.from({ length: 13 }).map((_, i) => (
                <span key={i} className="w-[2px] bg-white/60" style={{ height: `${25 + (i % 5) * 13}%` }} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-white/30 w-4">A1</span>
          <div className="flex-1 h-4 bg-white/[0.04] relative">
            <div
              className="absolute left-[22%] top-0 h-4 w-[50%] flex items-center px-1 gap-[1px] overflow-hidden"
              style={{ background: "rgba(139,61,255,0.16)" }}
            >
              {Array.from({ length: 26 }).map((_, i) => (
                <span key={i} className="flex-1" style={{ height: `${20 + ((i * 29) % 55)}%`, background: "rgba(160,100,255,0.75)" }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="mt-2.5 font-mono text-[9px] text-white/30">▸ importé dans Premiere</p>
    </div>
  );
}

// 02 — mosaïque : vrais logos de plateformes (couleurs de marque = du réel)
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
    <div>
      <div className="flex flex-wrap gap-1.5 items-center">
        {PLATFORM_LOGOS.map((p) => (
          <span key={p.n} title={p.n} className="w-7 h-7 rounded-[7px] overflow-hidden">
            <svg viewBox="0 0 28 28" className="w-7 h-7" aria-label={p.n}>{p.svg}</svg>
          </span>
        ))}
        <span
          className="h-7 px-2 inline-flex items-center font-mono text-[11px] font-bold tabular-nums"
          style={{ background: "rgba(255,106,31,0.14)", color: AMBER, border: `1px solid rgba(255,106,31,0.28)` }}
        >
          +1493
        </span>
      </div>
      <p className="mt-2.5 font-mono text-[9px] text-white/30">…et des centaines d&apos;autres</p>
    </div>
  );
}

// 03 — TYPOGRAPHIQUE : le rapport 30s / 2h14 dit tout, la piste ne fait que
// le prouver (segment minuscule). Silhouette volontairement non-« barres ».
function VizRatio() {
  return (
    <div>
      <div className="flex items-end gap-2 mb-3">
        <span className="font-black text-4xl leading-none tabular-nums" style={{ color: AMBER }}>0:30</span>
        <span className="font-mono text-[10px] text-white/35 pb-1">gardées</span>
      </div>
      <div className="relative h-1.5 w-full bg-white/[0.06]">
        <span
          className="absolute inset-y-0"
          style={{ left: "34%", width: "4%", background: `linear-gradient(90deg, ${AMBER}, ${RED})` }}
        />
      </div>
      <div className="flex justify-between mt-1.5 font-mono text-[9px] text-white/25 tabular-nums">
        <span>0:00</span>
        <span>2:14:00</span>
      </div>
    </div>
  );
}

// 04 — COLONNES VERTICALES : 3 flux qui se remplissent + file d'attente en
// tuiles fantômes (hairline violette du logo).
function VizParallel() {
  const active = [
    { n: "Trailer S2", p: 72 },
    { n: "Reaction", p: 48 },
    { n: "B-roll", p: 21 },
  ];
  return (
    <div className="flex items-end gap-2.5">
      {active.map((d) => (
        <div key={d.n} className="flex-1 min-w-0">
          <div className="relative h-16 w-full bg-white/[0.04] overflow-hidden">
            <span
              className="absolute inset-x-0 bottom-0"
              style={{ height: `${d.p}%`, background: `linear-gradient(180deg, ${AMBER}, ${RED})` }}
            />
            <span className="absolute inset-x-0 top-1 text-center font-mono text-[9px] text-white tabular-nums">{d.p}%</span>
          </div>
          <p className="mt-1.5 font-mono text-[9px] text-white/35 truncate">{d.n}</p>
        </div>
      ))}
      <div className="flex-1 min-w-0">
        <div className="h-16 flex gap-[3px]">
          {[0, 1, 2].map((i) => (
            <span key={i} className="flex-1 border border-dashed" style={{ borderColor: "rgba(139,61,255,0.35)" }} />
          ))}
        </div>
        <p className="mt-1.5 font-mono text-[9px] text-white/35">+7 en file</p>
      </div>
    </div>
  );
}

/* tag = métadonnée mono façon table de montage. Pas de numérotation : dans un
   bento en deux colonnes l'œil descend la colonne (01 → 03), donc numéroter
   mentirait sur l'ordre de lecture. */
const FEATURES = [
  {
    tag: "V1 · A1",
    title: "Ça atterrit direct sur ta timeline",
    desc: "Pas de dossier à ranger, pas de glisser-déposer. La vidéo apparaît sur Premiere ou DaVinci, prête à couper.",
    Viz: VizTimeline,
  },
  {
    tag: "SRC 1500+",
    title: "1500+ sites, zéro prise de tête",
    desc: "Vimeo, TikTok, X, YouTube… même geste à chaque fois, peu importe d'où ça vient.",
    Viz: VizSites,
  },
  {
    tag: "IN · OUT",
    title: "Juste le passage qui t'intéresse",
    desc: "30 secondes utiles dans une vidéo de 2h ? Tu sélectionnes, tu récupères que ça, pas le reste.",
    Viz: VizRatio,
  },
  {
    tag: "×3 FLUX",
    title: "4K, et autant que tu veux à la chaîne",
    desc: "Lance-en autant que tu veux : 3 se téléchargent en même temps, les autres s'enchaînent tout seuls pendant que tu montes.",
    Viz: VizParallel,
  },
];

// Cellule du bento. La signature de forme (coin coupé + angles vifs) vit dans
// .tf-cell (globals.css) : zéro rounded-2xl, une amorce de découpe en haut à
// droite comme une amorce de pellicule.
function Cell({ f, i, className = "", horizontal = false }: { f: (typeof FEATURES)[number]; i: number; className?: string; horizontal?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.07, ease: easeOutExpo }}
      className={`tf-cell group ${className}`}
    >
      <div className={`tf-cell__in h-full p-6 md:p-7 ${horizontal ? "flex flex-col md:flex-row md:items-center gap-6 md:gap-10" : "flex flex-col"}`}>
        <div className={horizontal ? "md:max-w-sm shrink-0" : ""}>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] mb-4" style={{ color: "rgba(255,106,31,0.85)" }}>{f.tag}</p>
          <h3 className={`font-bold text-white mb-1.5 ${horizontal ? "text-xl md:text-2xl" : "text-lg"}`}>{f.title}</h3>
          <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
        </div>
        <div className={horizontal ? "flex-1 min-w-0" : "mt-6 md:mt-auto md:pt-7"}>
          <f.Viz />
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturesList() {
  const [f1, f2, f3, f4] = FEATURES;
  return (
    // Le titre vit DANS la grille (cellule intro), 01 lui fait face, 02/03 se
    // partagent la rangée du milieu en 2/5–3/5, 04 referme en bandeau.
    <div className="grid md:grid-cols-5 gap-4 md:gap-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className="md:col-span-2 flex flex-col justify-center py-2 md:pr-4"
      >
        <h2 className="text-3xl md:text-4xl font-black tracking-[-0.02em] mb-4">
          Pensé pour le montage <span style={{ color: AMBER }}>sur les réseaux sociaux.</span>
        </h2>
        <p className="text-white/50 text-sm md:text-base leading-relaxed mb-7 max-w-sm">
          Des outils simples, efficaces et pensés pour les créateurs qui veulent aller droit au but.
        </p>
        <div>
          <Link
            href="/tubeforge/checkout?plan=sub&months=12"
            className="inline-flex items-center gap-2 px-5 py-3 font-bold text-sm text-white transition-all hover:brightness-110 active:scale-[0.98]"
            style={{ background: `linear-gradient(118deg, ${AMBER} 0%, ${RED} 58%, ${VIOLET} 155%)` }}
          >
            Essayer gratuitement <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      <Cell f={f1} i={0} className="md:col-span-3" />
      <Cell f={f2} i={1} className="md:col-span-2" />
      <Cell f={f3} i={2} className="md:col-span-3" />
      <Cell f={f4} i={3} className="md:col-span-5" horizontal />
    </div>
  );
}
