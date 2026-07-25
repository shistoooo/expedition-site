"use client";

import { motion } from "framer-motion";
import {
  X,
  Check,
  AppWindow,
  Download,
  FolderX,
  Repeat,
  Search,
  AlertTriangle,
  Layout,
  Sparkles,
  Link2,
  HardDriveDownload,
  FileText,
  Maximize2,
} from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Item = {
  icon: typeof X;
  text: string;
};

const before: Item[] = [
  { icon: AppWindow, text: "20 onglets YouTube ouverts en même temps" },
  { icon: Download, text: "4K Video Downloader qui tourne dans le coin" },
  { icon: FolderX, text: "Un dossier 'Refs' qui devient un dépotoir" },
  { icon: Repeat, text: "Aller-retour entre Finder et ton logiciel" },
  { icon: Search, text: "Tu cherches 'cette vidéo que t'as téléchargée mardi'" },
  { icon: AlertTriangle, text: "Tu perds le fil toutes les 5 minutes" },
];

const after: Item[] = [
  { icon: Maximize2, text: "Tu restes dans ton logiciel de montage" },
  { icon: Search, text: "Tu cherches sur YouTube sans changer d'onglet" },
  { icon: Link2, text: "Tes vidéos arrivent direct dans ta timeline" },
  { icon: HardDriveDownload, text: "Plus de fichiers qui traînent partout" },
  { icon: FileText, text: "Tu importes ton script, tout se télécharge tout seul" },
  { icon: Sparkles, text: "Tu restes concentré sur ta vidéo" },
];

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0 },
};

export default function CreateursBeforeAfter() {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="container-main max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-white/45 mb-3 flex items-center justify-center gap-2">
            <span className="w-3 h-px bg-white/30 inline-block" />
            Avant &mdash; Apr&egrave;s
            <span className="w-3 h-px bg-white/30 inline-block" />
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05]">
            Tes montages,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-cyan-300">
              avant et apr&egrave;s TubeForge.
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6 relative">
          {/* BEFORE */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            className="relative group"
          >
            {/* Red glow nebula behind the card — intensifies on hover */}
            <div
              className="absolute -inset-4 rounded-3xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 30% 30%, rgba(239,68,68,0.22) 0%, transparent 65%)",
                display: "none",
              }}
              aria-hidden="true"
            />

            <div className="relative rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/[0.05] to-red-500/[0.01] p-6 md:p-8 h-full backdrop-blur-sm transition-all duration-500 group-hover:border-red-400/45 group-hover:-translate-y-1 group-hover:shadow-[0_25px_70px_-20px_rgba(239,68,68,0.30)]">
              {/* Header */}
              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                  <X className="w-5 h-5 text-red-400" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-red-400/70">
                    Avant
                  </p>
                  <h3 className="text-lg md:text-xl font-black text-white tracking-[-0.01em]">
                    Le chaos quotidien
                  </h3>
                </div>
              </div>

              {/* Items */}
              <motion.ul
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                transition={{ staggerChildren: 0.05 }}
                className="space-y-3.5"
              >
                {before.map((item, i) => (
                  <motion.li
                    key={i}
                    variants={itemVariants}
                    transition={{ duration: 0.4, ease: easeOutExpo }}
                    className="flex items-start gap-3 text-sm md:text-[15px] text-white/60 leading-relaxed"
                  >
                    <div className="shrink-0 mt-0.5 w-7 h-7 rounded-lg bg-red-500/5 border border-red-500/15 flex items-center justify-center">
                      <item.icon className="w-3.5 h-3.5 text-red-400/80" />
                    </div>
                    <span className="pt-1">{item.text}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>

          {/* AFTER */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: easeOutExpo }}
            className="relative group"
          >
            {/* Cyan glow nebula — plus puissant, c'est la card "winning". Intensifies on hover */}
            <div
              className="absolute -inset-4 rounded-3xl pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 70% 30%, rgba(34,211,238,0.28) 0%, rgba(139,92,246,0.10) 50%, transparent 75%)",
                display: "none",
              }}
              aria-hidden="true"
            />

            <div
              className="relative rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/[0.07] to-cyan-500/[0.02] p-6 md:p-8 h-full backdrop-blur-sm transition-all duration-500 group-hover:border-cyan-300/55 group-hover:-translate-y-1 group-hover:shadow-[0_30px_80px_-20px_rgba(34,211,238,0.35)]"
              style={{
                boxShadow: "0 20px 60px -20px rgba(34,211,238,0.15)",
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-cyan-300" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-cyan-300/80">
                    Avec TubeForge
                  </p>
                  <h3 className="text-lg md:text-xl font-black text-white tracking-[-0.01em]">
                    Tout se simplifie
                  </h3>
                </div>
              </div>

              {/* Items */}
              <motion.ul
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
                className="space-y-3.5"
              >
                {after.map((item, i) => (
                  <motion.li
                    key={i}
                    variants={itemVariants}
                    transition={{ duration: 0.4, ease: easeOutExpo }}
                    className="flex items-start gap-3 text-sm md:text-[15px] text-white/80 leading-relaxed"
                  >
                    <div className="shrink-0 mt-0.5 w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center">
                      <item.icon className="w-3.5 h-3.5 text-cyan-300" />
                    </div>
                    <span className="pt-1">{item.text}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>

          {/* Arrow connector — visible only on desktop, between the 2 cards */}
          <div className="hidden md:flex absolute inset-y-0 left-1/2 -translate-x-1/2 items-center justify-center pointer-events-none z-10">
            <div
              className="w-11 h-11 rounded-full bg-[#06051a] border border-white/15 flex items-center justify-center shadow-[0_8px_24px_rgba(34,211,238,0.25)]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M3 8h10m0 0L9 4m4 4L9 12"
                  stroke="rgb(103, 232, 249)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.3, ease: easeOutExpo }}
          className="text-center text-sm md:text-base text-white/50 italic mt-10 max-w-2xl mx-auto leading-relaxed"
        >
          Ton temps de cr&eacute;ation est pr&eacute;cieux. Ne le perds pas &agrave; aller chercher un fichier.
        </motion.p>
      </div>
    </section>
  );
}
