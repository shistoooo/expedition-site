"use client";

import { motion } from "framer-motion";
import { Rocket, Lock, Sparkles, Palette, Languages, Youtube, FileCheck, Brain } from "lucide-react";

const upcomingTools = [
  {
    icon: FileCheck,
    name: "Correction de Sous-titres",
    description: "Importez vos .srt : l'IA corrige l'orthographe et reformule les phrases mal comprises.",
    status: "Bientôt disponible",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Brain,
    name: "Optimiseur de Titres",
    description: "Analyse vos titres via des leviers psychologiques et compare avec les meilleures vidéos de votre niche pour optimiser l'impact.",
    status: "En conception",
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: Languages,
    name: "TikTok Repurpose",
    description: "Importez des TikToks, traduction FR automatique, analyse des facteurs de succès et création de contenus.",
    status: "En développement",
    color: "from-pink-500 to-purple-500",
  },
  {
    icon: Youtube,
    name: "YouTube Repurpose",
    description: "Les mêmes fonctionnalités pour YouTube : traduction, analyse et création de contenus.",
    status: "En conception",
    color: "from-red-500 to-orange-500",
  },
  {
    icon: Palette,
    name: "ThumbCraft",
    description: "Créez des miniatures avec l'aide de l'IA pour améliorer vos taux de clics.",
    status: "Bientôt disponible",
    color: "from-blue-500 to-cyan-500",
  },
];

export default function UpcomingTools() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="container-main relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8">
            <Rocket className="w-4 h-4" />
            Coming Soon
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prochains <span className="gradient-text">outils</span>
          </h2>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Découvrez en avant-première les outils sur lesquels nous travaillons
            pour révolutionner votre création de contenu.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {upcomingTools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="glass rounded-2xl p-6 h-full border border-white/5 hover:border-white/10 transition-all relative overflow-hidden">
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-15 transition-opacity`}
                />

                {/* Lock badge */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 text-xs text-white/50">
                    <Lock className="w-3 h-3" />
                    {tool.status}
                  </div>
                </div>

                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} opacity-20 flex items-center justify-center mb-5 group-hover:opacity-100 transition-opacity`}
                >
                  <tool.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  {tool.name}
                  <Sparkles className="w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>

                <p className="text-white/50 leading-relaxed">
                  {tool.description}
                </p>

                {/* Teaser line */}
                <div className="mt-5 pt-5 border-t border-white/5">
                  <p className="text-sm text-white/30 italic">
                    Plus d'infos bientôt...
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-white/50">
            Rejoignez notre{" "}
            <a
              href="https://dsc.gg/expedition"
              target="_blank"
              className="text-primary hover:underline"
            >
              Discord
            </a>{" "}
            pour être informé des sorties en avant-première.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
