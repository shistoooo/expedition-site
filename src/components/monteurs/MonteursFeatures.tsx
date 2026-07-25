"use client";

import { motion } from "framer-motion";
import { Layers, Search, FileText, Scissors, Puzzle } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

const features = [
  {
    icon: Layers,
    title: "Plugin Premiere Pro & DaVinci Resolve",
    desc: "Colle un lien depuis l’onglet TubeForge directement dans ta timeline. Plus de Finder, plus de copier-coller. 5 à 10 minutes gagnées par référence.",
  },
  {
    icon: Search,
    title: "Recherche YouTube sans quitter l’app",
    desc: "Tu cherches une ref en plein montage&nbsp;? Tape ta query dans TubeForge, prévisualise les résultats, télécharge. Plus jamais d’aller-retour au navigateur.",
  },
  {
    icon: FileText,
    title: "Import du script du client",
    desc: "Ton client t’envoie un Google Doc avec 20 liens YouTube&nbsp;? Importe-le dans TubeForge, tous les liens sont détectés et téléchargés en un clic. Gain typique&nbsp;: 30 minutes par projet.",
  },
  {
    icon: Scissors,
    title: "Découpe avant téléchargement",
    desc: "Une vidéo de 2h dont tu n’as besoin que de 30 secondes&nbsp;? Sélectionne le passage sur la timeline et télécharge juste ça. Économie de stockage et de temps de coupe.",
  },
  {
    icon: Puzzle,
    title: "Extension navigateur : YouTube → Premiere en 1 clic",
    desc: "Tu tombes sur une vidéo YouTube en sourcing&nbsp;? L’extension Chrome/Firefox TubeForge envoie la vidéo <strong class=\"text-white/65\">directement</strong> vers Premiere Pro ou DaVinci Resolve. Plus de download manuel, plus de Finder, plus de fichiers qui traînent. <span class=\"text-white/35\">Installable depuis l’app TubeForge en 1 clic.</span>",
    highlight: true,
  },
];

export default function MonteursFeatures() {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="container-main max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-purple-400/60 mb-4">
            Ce que TubeForge fait pour toi quand tu montes
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] max-w-3xl mx-auto leading-[1.05]">
            Chaque heure gagn&eacute;e est{" "}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-purple-300">
              une heure facturable.
            </span>
          </h2>
        </motion.div>

        <motion.ul
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {features.map((f, i) => (
            <motion.li
              key={i}
              variants={itemVariants}
              className={`group relative p-6 md:p-7 rounded-2xl border transition-all duration-300 ${
                f.highlight
                  ? "md:col-span-2 border-purple-500/25 hover:border-purple-500/45"
                  : "border-white/[0.08] hover:border-white/[0.18]"
              }`}
              style={{
                background: f.highlight
                  ? "linear-gradient(135deg, rgba(168,85,247,0.06) 0%, rgba(255,255,255,0.01) 100%)"
                  : "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%)",
              }}
            >
              {/* Petit badge "Nouveau" sur l'item highlighted — uniquement la
                  feature extension, comme un "ne loupe pas ça" subtil. */}
              {f.highlight && (
                <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-[10px] font-mono uppercase tracking-wider text-purple-300">
                  Nouveau
                </span>
              )}
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-purple-500/15 transition-all duration-300">
                <f.icon className="w-5 h-5 text-purple-300" />
              </div>
              <h3 className="font-bold text-white text-lg md:text-xl mb-2 leading-snug">{f.title}</h3>
              <p
                className="text-sm md:text-[15px] text-white/45 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: f.desc }}
              />
            </motion.li>
          ))}
        </motion.ul>

        <p className="text-xs text-white/35 mt-10 text-center font-mono">
          + multi-DL parall&egrave;le &middot; qualit&eacute; 4K &middot; mises &agrave; jour hebdomadaires
        </p>
      </div>
    </section>
  );
}
