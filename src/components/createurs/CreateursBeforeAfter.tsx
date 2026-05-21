"use client";

import { motion } from "framer-motion";
import { ArrowRight, X, Check } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const before = [
  "20 onglets YouTube ouverts en même temps",
  "4K Video Downloader en arrière-plan",
  "Dossier 'Refs' qui grossit n'importe comment",
  "Aller-retour Finder ↔ Premiere/DaVinci",
  "Tu cherches 'cette vidéo que t'as téléchargée mardi'",
  "Tu perds ton focus toutes les 5 minutes",
];

const after = [
  "Une seule fenêtre : ton outil de montage",
  "Recherche YouTube intégrée dans le plugin",
  "Refs importées directement dans la timeline",
  "Zéro fichier orphelin sur ton disque",
  "Ton script avec liens → tout téléchargé en un clic",
  "Tu restes dans ton flow créatif",
];

export default function CreateursBeforeAfter() {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="container-main max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-center mb-10 md:mb-14"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-cyan-400/60 mb-3">
            Avant / Apr&egrave;s
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05]">
            Ton workflow,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-cyan-300">
              avant qu&apos;il devienne fluide.
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {/* BEFORE */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            className="relative rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6 md:p-8"
          >
            <div className="absolute -inset-px rounded-2xl pointer-events-none opacity-30"
              style={{
                background: "linear-gradient(180deg, rgba(239,68,68,0.1) 0%, transparent 100%)",
              }}
            />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-red-400/70">Avant</p>
                  <h3 className="text-lg md:text-xl font-black text-white">Le chaos quotidien</h3>
                </div>
              </div>

              <ul className="space-y-3">
                {before.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm md:text-[15px] text-white/55 leading-relaxed">
                    <span className="text-red-400/60 mt-1.5 shrink-0 w-1 h-1 rounded-full bg-red-400/60" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* AFTER */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
            className="relative rounded-2xl border border-cyan-400/30 bg-cyan-500/[0.03] p-6 md:p-8"
          >
            <div className="absolute -inset-px rounded-2xl pointer-events-none opacity-40"
              style={{
                background: "linear-gradient(180deg, rgba(34,211,238,0.12) 0%, transparent 100%)",
              }}
            />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center">
                  <Check className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-cyan-300/70">Avec TubeForge</p>
                  <h3 className="text-lg md:text-xl font-black text-white">Le flow retrouv&eacute;</h3>
                </div>
              </div>

              <ul className="space-y-3">
                {after.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm md:text-[15px] text-white/75 leading-relaxed">
                    <Check className="w-3.5 h-3.5 text-cyan-300 shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.3, ease: easeOutExpo }}
          className="text-center text-sm md:text-base text-white/50 italic mt-8 max-w-2xl mx-auto leading-relaxed"
        >
          Ton flow est pr&eacute;cieux. Ne le casse pas pour aller chercher un fichier.
        </motion.p>
      </div>
    </section>
  );
}
