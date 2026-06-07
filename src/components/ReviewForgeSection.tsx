"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Eye, Clock, Link2 } from "lucide-react";
import Link from "next/link";
import ReviewForgeMockup from "@/components/mockups/ReviewForgeMockup";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

type ReviewForgeSectionProps = {
  /** "vertical" (default) = texte au-dessus, mockup en dessous. "horizontal" = texte | mockup côte à côte sur lg+ */
  layout?: "vertical" | "horizontal";
  /** Si true : mockup flouté + overlay "Arrive prochainement" + CTA "Voir plus" vers /tools. Pour la home. */
  blurred?: boolean;
  /** Si fourni : ajoute un bouton secondaire "Découvrir ReviewForge" sous le mockup, vers la page dédiée. */
  detailHref?: string;
};

export default function ReviewForgeSection({ layout = "vertical", blurred = false, detailHref }: ReviewForgeSectionProps = {}) {
  const horizontal = layout === "horizontal";
  return (
    <motion.div
      id="reviewforge"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={
        horizontal
          ? "relative flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16 h-full"
          : "relative flex flex-col h-full"
      }
    >
      {/* Text */}
      <div className={horizontal ? "text-left lg:flex-1" : "text-left mb-8"}>
        <p className="text-xs font-mono uppercase tracking-widest text-emerald-400/60 mb-4 flex items-center gap-2">
          <span className="w-3 h-px bg-emerald-400/50 inline-block" />
          Vague 3 &mdash; Prochainement
        </p>

        <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-[-0.03em]">
          Review<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Forge</span>
        </h2>
        <p className="text-xs text-white/35 mb-4 font-mono uppercase tracking-wider">L&apos;alternative &agrave; Frame.io</p>
        <p className="text-base text-white/60 mb-6 leading-relaxed">
          Partagez vos montages en cours avec vos clients ou votre &eacute;quipe. S&eacute;curis&eacute;, temporaire, sans upload.
        </p>

        <motion.ul
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4 mb-7"
        >
          {[
            { icon: Shield, title: "Vos vid\u00e9os restent sur votre machine", desc: "Tunnel s\u00e9curis\u00e9 direct, pas d\u2019upload cloud." },
            { icon: Clock, title: "Liens qui s\u2019auto-d\u00e9truisent", desc: "Expiration, max de vues, mot de passe." },
            { icon: Eye, title: "Suivi en temps r\u00e9el", desc: "Qui a regard\u00e9, quand, combien de vues." },
            { icon: Link2, title: "Un lien, un clic", desc: "Rien \u00e0 installer c\u00f4t\u00e9 reviewer." },
          ].map((item, i) => (
            <motion.li key={i} variants={itemVariants} className="flex gap-3 group/item">
              <div className="mt-0.5 w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                <item.icon className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                <p className="text-white/45 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        <Link
          href="/pricing"
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-sm border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_24px_rgba(16,185,129,0.2)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_12px_40px_rgba(16,185,129,0.35)] transition-all duration-200 hover:translate-y-[-1px] active:translate-y-[1px]"
        >
          R&eacute;server ma place &mdash; tarif bloqu&eacute; &agrave; vie <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Mockup — taille naturelle, pas de container fixe ni badge floating (statut dans l'eyebrow "Vague 3 — En développement") */}
      <div
        className={`group relative transition-all duration-500 hover:-translate-y-1 ${
          horizontal ? "w-full lg:flex-[1.3]" : "w-full"
        }`}
      >
        {/* Emerald-cyan nebula — ReviewForge identity glow. Intensifies on hover. */}
        <div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] rounded-full pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.12) 0%, rgba(34,211,238,0.05) 40%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Mockup — flou très subtil (2px) sur la home pour signaler "à venir" sans cacher le mockup */}
        <div className={blurred ? "blur-[2px] pointer-events-none select-none transition-all duration-500" : ""}>
          <ReviewForgeMockup />
        </div>
        {/* Badge "Arrive prochainement" — affiché uniquement quand blurred=true */}
        {blurred && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div
              className="px-5 py-2.5 rounded-full text-white font-semibold text-sm shadow-2xl backdrop-blur-xl"
              style={{
                background: "rgba(16,185,129,0.20)",
                border: "1px solid rgba(52,211,153,0.45)",
                boxShadow: "0 0 40px rgba(16,185,129,0.35), 0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              Arrive prochainement
            </div>
          </div>
        )}
      </div>

      {/* Bouton secondaire vers la page dédiée — apparaît seulement si detailHref fourni (grilles d'aperçu) */}
      {detailHref && (
        <Link
          href={detailHref}
          className="group/detail mt-6 inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl border border-emerald-400/25 bg-emerald-500/[0.06] text-emerald-200 font-semibold text-sm hover:bg-emerald-500/15 hover:border-emerald-400/50 hover:text-white transition-all duration-200"
        >
          Découvrir ReviewForge
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/detail:translate-x-1" />
        </Link>
      )}
    </motion.div>
  );
}
