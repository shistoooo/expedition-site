"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLienParrainage } from "@/lib/useParrainage";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];
const AMBER = "#ff6a1f";
const RED = "#ef3a24";
const VIOLET = "#8b3dff";

/* Principe de cette section : BUDGET D'EFFORT INÉGAL, comme un humain.
   UNE cellule riche (une vraie capture d'écran du produit, pas un mockup
   dessiné), les autres restent sobres — logos réels, un chiffre, du texte.
   Pas de tag/numéro systématique par cellule : l'astuce uniforme est un tell. */

// Logos réels des plateformes (couleurs de marque officielles)
const PLATFORM_LOGOS: { n: string; svg: React.ReactNode }[] = [
  { n: "YouTube", svg: (<><rect width="28" height="28" rx="7" fill="#FF0000" /><path d="M11.5 9.5v9l7.5-4.5z" fill="#fff" /></>) },
  { n: "TikTok", svg: (<><rect width="28" height="28" rx="7" fill="#010101" /><path d="M17.5 7c.35 1.9 1.55 3.1 3.3 3.35v2.45c-1.15.1-2.2-.25-3.3-.85v4.55a4.55 4.55 0 1 1-4.55-4.55c.25 0 .5.02.75.06v2.5a2.15 2.15 0 1 0 1.5 2.05V7h2.3z" fill="#25F4EE" /></>) },
  { n: "Instagram", svg: (<><rect width="28" height="28" rx="7" fill="url(#igg)" /><rect x="7.5" y="7.5" width="13" height="13" rx="4.2" fill="none" stroke="#fff" strokeWidth="1.7" /><circle cx="14" cy="14" r="3.4" fill="none" stroke="#fff" strokeWidth="1.7" /><circle cx="18.6" cy="9.4" r="1.15" fill="#fff" /><defs><linearGradient id="igg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#F58529" /><stop offset=".5" stopColor="#DD2A7B" /><stop offset="1" stopColor="#8134AF" /></linearGradient></defs></>) },
  { n: "X", svg: (<><rect width="28" height="28" rx="7" fill="#000" /><path d="M9 8.5l10 11M19 8.5L9 19.5" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" /></>) },
  { n: "Twitch", svg: (<><rect width="28" height="28" rx="7" fill="#9146FF" /><path d="M10 8h9v6l-2.5 2.5H14l-2 2v-2h-2V8z" fill="#fff" /><path d="M13 10.5v3M16 10.5v3" stroke="#9146FF" strokeWidth="1.3" strokeLinecap="round" /></>) },
  { n: "Vimeo", svg: (<><rect width="28" height="28" rx="7" fill="#1AB7EA" /><path d="M9 11.5c.6-.9 1.5-1.6 2.4-1.1.9.5.7 2 .4 3-.3 1-.9 2.4-.3 2.6.6.2 1.7-1.5 2.3-2.8.6-1.4 1-3 .3-3.8-.8-.9-2.2-.5-3 .2" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></>) },
  { n: "Facebook", svg: (<><rect width="28" height="28" rx="7" fill="#1877F2" /><path d="M16.5 14.5h2l.4-2.6h-2.4v-1.6c0-.75.35-1.4 1.5-1.4h1V6.7s-.9-.15-1.8-.15c-1.85 0-3 1.1-3 3.1v1.65H10v2.6h2.2V21h2.3v-6.5z" fill="#fff" /></>) },
];

/* Chaque carte a SES rayons asymétriques et SA micro-inclinaison de repos —
   comme des cartes posées à la main, pas sorties d'un gabarit. Le hover les
   redresse (cf. .tf-cell dans globals.css). */
const LOOKS = [
  { r: "26px 10px 22px 14px", tilt: "-0.7deg" },
  { r: "12px 24px 10px 26px", tilt: "0.6deg" },
  { r: "22px 14px 28px 10px", tilt: "-0.5deg" },
  { r: "14px 26px 12px 22px", tilt: "0.65deg" },
];

function Cell({ children, className = "", delay = 0, look = 0 }: { children: React.ReactNode; className?: string; delay?: number; look?: number }) {
  const { r, tilt } = LOOKS[look % LOOKS.length];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: easeOutExpo }}
      className={`group ${className}`}
    >
      <div className="tf-cell h-full" style={{ "--r": r, "--tilt": tilt } as React.CSSProperties}>
        <div className="h-full p-6 md:p-7 flex flex-col">{children}</div>
      </div>
    </motion.div>
  );
}

export default function FeaturesList() {
  return (
    <div className="grid md:grid-cols-5 gap-4 md:gap-5">
      {/* Intro : le titre vit dans la grille */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className="md:col-span-2 flex flex-col justify-center py-2 md:pr-4"
      >
        <h2 className="text-3xl md:text-4xl font-black tracking-[-0.02em] mb-4">
          Pensé pour le montage <span style={{ color: AMBER }}>sur les réseaux sociaux.</span>
        </h2>
        <p className="text-white/50 text-sm md:text-base leading-relaxed mb-7 max-w-sm">
          Un lien, un extrait, ta timeline. Le reste, TubeForge s'en occupe.
        </p>
        <div>
          <Link
            data-track="bento-essai"
            href={useLienParrainage("/tubeforge/checkout?plan=lifetime")}
            className="inline-flex items-center gap-2 px-5 py-3 font-bold text-sm text-white transition-all hover:brightness-110 active:scale-[0.98]"
            style={{ background: `linear-gradient(118deg, ${AMBER} 0%, ${RED} 58%, ${VIOLET} 155%)` }}
          >
            Obtenir TubeForge <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* 01 — LA cellule riche : une VRAIE capture (timeline Premiere, clip
          importé par TubeForge). Pas un mockup dessiné : le produit, tel quel. */}
      <Cell className="md:col-span-3" look={0}>
        <h3 className="font-bold text-white text-lg md:text-xl mb-1.5">Tu ne touches plus au Finder</h3>
        <p className="text-white/45 text-sm leading-relaxed mb-5">
          Pas de dossier à ranger, pas de glisser-déposer. La vidéo apparaît sur Premiere ou DaVinci, prête à couper.
        </p>
        <div className="mt-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/tubeforge/real-timeline.jpg"
            alt="Timeline Premiere Pro : le clip téléchargé par TubeForge posé sur les pistes V1/A1"
            className="w-full h-auto border border-white/10 rounded-md"
            loading="lazy"
            width={830}
            height={290}
          />
          <p className="mt-2 font-mono text-[9px] text-white/30">capture réelle · Premiere Pro</p>
        </div>
      </Cell>

      {/* 02 — sobre : les logos (réels) suffisent */}
      <Cell className="md:col-span-3" delay={0.07} look={1}>
        <h3 className="font-bold text-white text-lg mb-1.5">1500+ sites, zéro prise de tête</h3>
        <p className="text-white/45 text-sm leading-relaxed mb-6">
          Vimeo, TikTok, X, YouTube… même geste à chaque fois, peu importe d&apos;où ça vient.
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5 items-center">
          {PLATFORM_LOGOS.map((p) => (
            <span key={p.n} title={p.n} className="w-8 h-8 rounded-[8px] overflow-hidden">
              <svg viewBox="0 0 28 28" className="w-8 h-8" aria-label={p.n}>{p.svg}</svg>
            </span>
          ))}
          <span className="font-mono text-xs text-white/40 pl-1 tabular-nums">+1493 autres</span>
        </div>
      </Cell>

      {/* 03 — sobre : un chiffre, c'est tout */}
      <Cell className="md:col-span-2 md:row-span-2" delay={0.11} look={2}>
        <h3 className="font-bold text-white text-lg md:text-xl mb-1.5">Juste le passage qui t&apos;intéresse</h3>
        <p className="text-white/45 text-sm leading-relaxed mb-6">
          30 secondes utiles dans une vidéo de 2h ? Tu sélectionnes, tu récupères que ça, pas le reste.
        </p>
        <div className="mt-auto w-full max-w-[360px] mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/tubeforge/real-app.jpg"
            alt="TubeForge : téléchargement MP4/MP3, choix du format, et module de découpe avec curseurs début/fin"
            className="w-full h-auto border border-white/10 rounded-lg"
            loading="lazy"
            width={692}
            height={878}
          />
          <p className="mt-2 font-mono text-[9px] text-white/30">capture réelle · TubeForge</p>
        </div>
      </Cell>

      {/* 04 — texte seul : tout n'a pas besoin d'une illustration */}
      <Cell className="md:col-span-3" delay={0.15} look={3}>
        <h3 className="font-bold text-white text-lg md:text-xl mb-1.5">4K, et à la chaîne</h3>
        <p className="text-white/45 text-sm leading-relaxed mb-5">
          Lance-en autant que tu veux : 3 se téléchargent en même temps, les autres s&apos;enchaînent tout seuls pendant que tu montes.
        </p>
        <div className="mt-auto">
          {/* Enregistrement d'écran RÉEL de la file TubeForge (13 téléchargements,
              progressions et débits réels) — boucle muette, 160 Ko. */}
          <video
            src="/tubeforge/real-queue-1.mp4"
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
            width={1594}
            height={226}
            className="w-full h-[150px] object-cover object-left border border-white/10 rounded-md"
            aria-label="File de téléchargements TubeForge : 12 en cours, 2 terminés, progressions en direct"
          />
          <p className="mt-2 font-mono text-[9px] text-white/30">enregistrement réel · TubeForge</p>
        </div>
      </Cell>
    </div>
  );
}
