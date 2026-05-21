"use client";

import { motion } from "framer-motion";
import { Zap, Scissors, FileText, Layers } from "lucide-react";

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
    icon: Zap,
    title: "Téléchargez en 4K, en quelques secondes",
    desc: "Pendant que les sites en ligne vous font attendre, TubeForge avale vos liens en quelques secondes. Qualité maximale, sans pub, sans bridage.",
  },
  {
    icon: Layers,
    title: "Téléchargez plusieurs vidéos en même temps",
    desc: "Une playlist de 20 vidéos ? Lancez tout d'un coup. TubeForge gère plusieurs téléchargements en parallèle pendant que vous montez.",
  },
  {
    icon: Scissors,
    title: "Découpez l'extrait exact avant de télécharger",
    desc: "Vous avez repéré 30 secondes utiles dans une vidéo de 2h ? Sélectionnez l'extrait sur la timeline et téléchargez juste ce passage. Pas de retouche après.",
  },
  {
    icon: FileText,
    title: "Importez votre script, tout se télécharge",
    desc: "Vous préparez une vidéo avec des liens YouTube dans vos notes ? Importez votre document : TubeForge détecte chaque lien et télécharge tout en un clic.",
  },
];

export default function DiscordPionnierFeatures() {
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
            Ce que TubeForge fait pour vous
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] max-w-3xl mx-auto leading-[1.05]">
            Tout le workflow YouTube.{" "}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-purple-300">
              Dans une seule fenêtre.
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
              className="group relative p-6 md:p-7 rounded-2xl border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%)",
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-purple-500/15 transition-all duration-300">
                <f.icon className="w-5 h-5 text-purple-300" />
              </div>
              <h3 className="font-bold text-white text-lg md:text-xl mb-2 leading-snug">{f.title}</h3>
              <p className="text-sm md:text-[15px] text-white/45 leading-relaxed">{f.desc}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
