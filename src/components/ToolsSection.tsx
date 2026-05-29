"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Download, Edit, Trash2, Play, ScanFace, Type, Sparkles } from "lucide-react";
import ClipForgeMockup from "@/components/mockups/ClipForgeMockup";

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

function SubtitlePreview({ style }: { style: string }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => setVisible(v => !v), 1800);
    return () => clearInterval(interval);
  }, []);

  const animations: Record<string, React.CSSProperties> = {
    Pop: {
      transform: visible ? 'scale(1)' : 'scale(0.85)',
      opacity: visible ? 1 : 0,
      transition: 'transform 0.14s cubic-bezier(0.34,1.56,0.64,1), opacity 0.1s',
      textShadow: '0 1px 3px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.5)',
    },
    Smooth: {
      transform: visible ? 'translateY(0)' : 'translateY(4px)',
      opacity: visible ? 1 : 0,
      transition: 'transform 0.15s ease-out, opacity 0.15s',
      background: 'rgba(0,0,0,0.5)',
      padding: '1px 4px',
      borderRadius: '2px',
    },
    Glow: {
      opacity: visible ? 1 : 0.3,
      transition: 'opacity 0.3s',
      textShadow: '0 0 8px rgba(255,255,255,0.6), 0 0 16px rgba(255,255,255,0.3)',
    },
    Classique: {
      opacity: 1,
      color: '#FACC15',
    },
  };

  return (
    <span
      className="text-[5px] font-bold uppercase tracking-wide text-center whitespace-nowrap"
      style={{ color: '#fff', ...animations[style] }}
    >
      REGARDEZ
    </span>
  );
}

type ToolsSectionProps = {
  /** "vertical" (default) = texte au-dessus, mockup en dessous. "horizontal" = texte | mockup côte à côte sur lg+ */
  layout?: "vertical" | "horizontal";
  /** Si true : mockup flouté + overlay "Arrive prochainement" + CTA "Voir plus" vers /tools. Pour la home. */
  blurred?: boolean;
};

export default function ToolsSection({ layout = "vertical", blurred = false }: ToolsSectionProps = {}) {
  const horizontal = layout === "horizontal";
  return (
    <motion.div
      id="clipforge"
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
        <p className="text-xs font-mono uppercase tracking-widest text-purple-400/60 mb-4 flex items-center gap-2">
          <span className="w-3 h-px bg-purple-400/50 inline-block" />
          Vague 2 &mdash; Prochainement
        </p>

        <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-[-0.03em]">
          Clip<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Forge</span>
        </h2>
        <p className="text-xs text-white/35 mb-4 font-mono uppercase tracking-wider">L&apos;alternative &agrave; OpusClip</p>
        <p className="text-base text-white/60 mb-6 leading-relaxed">
          Collez un lien YouTube. ClipForge trouve les moments viraux, recadre, sous-titre et exporte vos clips pr&ecirc;ts &agrave; poster.
        </p>

        <motion.ul
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4 mb-7"
        >
          {[
            { icon: Sparkles, title: "L\u2019IA trouve vos meilleurs moments", desc: "Analyse sp\u00e9cialis\u00e9e selon votre contenu : gaming, podcast, tuto, vlog." },
            { icon: TrendingUp, title: "Score de viralit\u00e9, hook et r\u00e9tention", desc: "Chaque clip est not\u00e9 sur 100. Voyez quels extraits vont performer." },
            { icon: ScanFace, title: "Recadrage intelligent qui suit le visage", desc: "Le cadrage 9:16 suit votre visage frame par frame, sans saccade." },
            { icon: Type, title: "Sous-titres anim\u00e9s, \u00e9ditables", desc: "4 styles, couleurs personnalisables, \u00e9diteur int\u00e9gr\u00e9." },
          ].map((item, i) => (
            <motion.li key={i} variants={itemVariants} className="flex gap-3 group/item">
              <div className="mt-0.5 w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                <item.icon className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                <p className="text-white/45 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        <a
          href="/pricing"
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-sm border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_24px_rgba(168,85,247,0.2)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_12px_40px_rgba(168,85,247,0.35)] transition-all duration-200 hover:translate-y-[-1px] active:translate-y-[1px]"
        >
          R&eacute;server ma place &mdash; tarif bloqu&eacute; &agrave; vie <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </a>
      </div>

      {/* Mockup — taille naturelle, pas de container fixe ni badge floating (statut dans l'eyebrow "Vague 2 — Prochainement") */}
      <div
        className={`group relative transition-all duration-500 hover:-translate-y-1 ${
          horizontal ? "w-full lg:flex-[1.3]" : "w-full"
        }`}
      >
        {/* Indigo-purple nebula — ClipForge identity. Intensifies on hover. */}
        <div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] rounded-full pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.16) 0%, rgba(139,92,246,0.08) 35%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Mockup — flou très subtil (2px) sur la home pour signaler "à venir" sans cacher le mockup */}
        <div className={blurred ? "blur-[2px] pointer-events-none select-none transition-all duration-500" : ""}>
          <ClipForgeMockup />
        </div>
        {/* Badge "Arrive prochainement" — affiché uniquement quand blurred=true */}
        {blurred && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div
              className="px-5 py-2.5 rounded-full text-white font-semibold text-sm shadow-2xl backdrop-blur-xl"
              style={{
                background: "rgba(99,102,241,0.20)",
                border: "1px solid rgba(139,92,246,0.45)",
                boxShadow: "0 0 40px rgba(139,92,246,0.35), 0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              Arrive prochainement
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
