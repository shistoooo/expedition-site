"use client";

import { useState, useMemo, type ComponentType } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import TubeForgeMockup from "@/components/mockups/TubeForgeMockup";
import ClipForgeMockup from "@/components/mockups/ClipForgeMockup";
import ReviewForgeMockup from "@/components/mockups/ReviewForgeMockup";
import ScriptForgeMockup from "@/components/mockups/ScriptForgeMockup";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Tool = {
  name: string;
  tagline: string;
  desc: string;
  features: string[];
  status: "live" | "soon";
  statusLabel: string;
  Mockup: ComponentType;
  /** Couleur d'identité de l'outil (cohérente avec le site) — pour tagline, puces, glow, tab actif. */
  color: string;
  color2: string;
};

const TOOLS: Tool[] = [
  {
    name: "TubeForge",
    tagline: "Télécharge, découpe, importe",
    desc: "Récupère n'importe quelle vidéo d'internet et range-la directement dans Premiere ou DaVinci. Tu colles un lien, ça atterrit dans ta timeline.",
    features: ["Télécharge depuis YouTube et 1000+ sites", "Découpe l'extrait avant de télécharger", "Importe ton script, tout se récupère"],
    status: "live",
    statusLabel: "Dispo maintenant",
    Mockup: TubeForgeMockup,
    color: "#ef4444", // red — identité TubeForge
    color2: "#f97316", // orange
  },
  {
    name: "ClipForge",
    tagline: "Tes clips courts, automatiques",
    desc: "Colle une vidéo longue, l'IA trouve les meilleurs moments, recadre en 9:16 et ajoute les sous-titres. Tes clips sont prêts à poster.",
    features: ["L'IA repère tes moments viraux", "Recadrage 9:16 qui suit le visage", "Sous-titres animés, éditables"],
    status: "soon",
    statusLabel: "Bientôt",
    Mockup: ClipForgeMockup,
    color: "#6366f1", // indigo — identité ClipForge
    color2: "#8b5cf6", // violet
  },
  {
    name: "ReviewForge",
    tagline: "Les retours clients, sans le bordel",
    desc: "Partage tes montages en cours, reçois des retours horodatés précis. Sécurisé, temporaire, sans upload cloud.",
    features: ["Tes vidéos restent sur ta machine", "Liens qui expirent automatiquement", "Commentaires horodatés à la seconde"],
    status: "soon",
    statusLabel: "Bientôt",
    Mockup: ReviewForgeMockup,
    color: "#10b981", // emerald — identité ReviewForge
    color2: "#22d3ee", // cyan
  },
  {
    name: "ScriptForge",
    tagline: "Recherche, puis écris",
    desc: "Trouve ton angle, tes sources, tes accroches — puis écris ton script au même endroit, avec l'IA qui t'assiste. Pensé pour ceux qui partent du texte.",
    features: ["Recherche ton sujet et tes meilleures sources", "Écris ton script avec l'assistant IA", "Des accroches qui retiennent dès la 1re seconde"],
    status: "soon",
    statusLabel: "À venir",
    Mockup: ScriptForgeMockup,
    color: "#3b82f6", // blue — identité ScriptForge (proche Fire Writing)
    color2: "#22d3ee", // cyan
  },
];

type SuiteCarouselProps = {
  /** Couleur d'accent principale (hex) — pour le tab actif, le glow, les puces. */
  accentColor?: string;
  /** Couleur d'accent secondaire (hex) — pour les dégradés. */
  accentColor2?: string;
};

export default function SuiteCarousel({
  accentColor = "#8b5cf6",
  accentColor2 = "#22d3ee",
}: SuiteCarouselProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduce = useReducedMotion();

  const active = TOOLS[index];

  const goTo = (next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex((next + TOOLS.length) % TOOLS.length);
  };

  // Variants — slide horizontal (ou simple fade si reduced-motion).
  const slideVariants = useMemo(
    () => ({
      enter: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir * 48 }),
      center: { opacity: 1, x: 0 },
      exit: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir * -48 }),
    }),
    [reduce]
  );

  return (
    <section className="py-16 md:py-24 relative bg-[#06051a]/60">
      {/* Ambient nebula aux couleurs du partenaire */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] pointer-events-none opacity-40"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${accentColor}1f 0%, ${accentColor2}10 45%, transparent 75%)`,
          filter: "blur(70px)",
        }}
      />

      <div className="container-main max-w-5xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-center mb-10"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-3">
            La suite
          </p>
          <h2 className="text-2xl md:text-4xl font-black tracking-[-0.02em] leading-tight">
            Une suite qui{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(90deg, ${accentColor}, ${accentColor2})` }}
            >
              s&apos;agrandit.
            </span>
          </h2>
        </motion.div>

        {/* Tabs — les 3 outils + statut */}
        <div className="flex items-center justify-center gap-2 md:gap-3 mb-8 flex-wrap">
          {TOOLS.map((tool, i) => {
            const isActive = i === index;
            const live = tool.status === "live";
            return (
              <button
                key={tool.name}
                onClick={() => goTo(i)}
                aria-pressed={isActive}
                className="group relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2"
                style={
                  isActive
                    ? {
                        background: `${tool.color}1f`,
                        border: `1px solid ${tool.color}66`,
                        color: "#fff",
                      }
                    : {
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        color: "rgba(255,255,255,0.55)",
                      }
                }
              >
                {tool.name}
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                    live ? "text-emerald-200" : "text-white/45"
                  }`}
                  style={
                    live
                      ? { background: "rgba(16,185,129,0.15)" }
                      : { background: "rgba(255,255,255,0.05)" }
                  }
                >
                  {live ? <Check className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                  <span className="hidden sm:inline">{tool.statusLabel}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Panneau actif — slide */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active.name}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: easeOutExpo }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
            >
              {/* Description (gauche desktop) */}
              <div className="text-center lg:text-left order-2 lg:order-1">
                <h3 className="text-2xl md:text-3xl font-black tracking-[-0.02em] mb-2">
                  {active.name}
                </h3>
                <p
                  className="text-sm font-mono uppercase tracking-wider mb-4"
                  style={{ color: active.color2 }}
                >
                  {active.tagline}
                </p>
                <p className="text-white/60 leading-relaxed mb-6 max-w-md mx-auto lg:mx-0">
                  {active.desc}
                </p>
                <ul className="space-y-2.5 max-w-md mx-auto lg:mx-0">
                  {active.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-left">
                      <span
                        className="mt-1 w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: `${active.color}26`, border: `1px solid ${active.color}4d` }}
                      >
                        <Check className="w-2.5 h-2.5" style={{ color: active.color2 }} />
                      </span>
                      <span className="text-white/75 text-sm leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mockup (droite desktop) — hauteur uniforme entre tous les outils,
                  alignée en haut + fade-out en bas pour les mockups qui débordent (TubeForge). */}
              <div className="relative order-1 lg:order-2">
                {/* glow derrière le mockup — couleur de l'outil actif */}
                <div
                  className="absolute -inset-6 pointer-events-none opacity-60 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(ellipse 60% 60% at 50% 40%, ${active.color}26 0%, ${active.color2}12 45%, transparent 75%)`,
                    filter: "blur(45px)",
                  }}
                />
                {/* Conteneur de hauteur fixe commune → uniformité, zéro saut entre outils */}
                <div className="relative h-[440px] md:h-[520px] overflow-hidden rounded-[20px]">
                  <div className={`${active.status === "soon" ? "blur-[2px] select-none pointer-events-none" : ""}`}>
                    <active.Mockup />
                  </div>
                  {/* fade-out bas — masque élégamment la coupe des mockups hauts */}
                  <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#06051a] to-transparent pointer-events-none z-10" />
                </div>
                {/* Badge "Arrive prochainement" sur les outils soon */}
                {active.status === "soon" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <div
                      className="px-4 py-2 rounded-full text-white font-semibold text-xs shadow-2xl backdrop-blur-xl"
                      style={{
                        background: `${active.color}33`,
                        border: `1px solid ${active.color}66`,
                        boxShadow: `0 0 30px ${active.color}40`,
                      }}
                    >
                      Arrive prochainement
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Flèches desktop — navigation alternative */}
          <button
            onClick={() => goTo(index - 1)}
            aria-label="Outil précédent"
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 w-10 h-10 rounded-full items-center justify-center bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => goTo(index + 1)}
            aria-label="Outil suivant"
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 w-10 h-10 rounded-full items-center justify-center bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots indicateurs (mobile surtout) */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {TOOLS.map((tool, i) => (
            <button
              key={tool.name}
              onClick={() => goTo(i)}
              aria-label={`Voir ${tool.name}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === index ? 24 : 8,
                background: i === index ? tool.color : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>

        {/* Clôture — le deal */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center text-white/60 text-sm md:text-base mt-10 max-w-xl mx-auto leading-relaxed"
        >
          <strong className="text-white">Tous inclus dans ton abonnement.</strong> Plus le catalogue grossit, plus tu y gagnes &mdash; et ton tarif Pionnier ne bouge pas.
        </motion.p>
      </div>
    </section>
  );
}
