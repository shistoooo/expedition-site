"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Wand2,
  Scissors,
  Share2,
  Captions,
  Sparkles,
  Zap,
  Clock,
  Layers,
  Video,
  CheckCircle2,
  Circle,
} from "lucide-react";

const currentFeatures = [
  {
    icon: Wand2,
    title: "Découpage Intelligent",
    description:
      "L'IA analyse votre vidéo et détecte automatiquement les moments clés pour créer des clips.",
  },
  {
    icon: Scissors,
    title: "Recadrage Automatique",
    description:
      "Passez du format 16:9 au 9:16 facilement. L'IA suit le sujet principal.",
  },
  {
    icon: Captions,
    title: "Sous-titres Automatiques",
    description:
      "Génération automatique de sous-titres stylisés avec plusieurs templates tendance.",
  },
  {
    icon: Share2,
    title: "Export Multi-Plateforme",
    description:
      "Exportez directement aux formats optimisés pour TikTok, YouTube Shorts, et Instagram Reels.",
  },
  {
    icon: Zap,
    title: "Traitement Rapide",
    description:
      "Rendu rapide, même sur des vidéos longues.",
  },
];

const upcomingFeatures = [
  {
    title: "Détection des moments clés par IA",
    description: "Analyse pour identifier les passages qui fonctionnent.",
    progress: 75,
  },
  {
    title: "Auto-crop intelligent",
    description: "Recadrage automatique selon le contenu : détecte la cam et le jeu sur les lives Twitch, redimensionne correctement.",
    progress: 50,
  },
  {
    title: "Pipeline YouTube/Twitch complet",
    description: "Téléchargement auto depuis YouTube/Twitch, création de clips, et upload automatique sur YouTube et TikTok.",
    progress: 15,
  },
  {
    title: "Templates Personnalisables",
    description: "Bibliothèque de templates pour sous-titres, transitions et effets visuels.",
    progress: 40,
  },
  {
    title: "Système Multi-POV",
    description: "Synchronisation VOD multijoueurs : détecte qui parle et affiche sa vue automatiquement (style Premiere).",
    progress: 25,
  },
  {
    title: "Compilations Virales",
    description: "Créez un clip viral à partir de plusieurs extraits combinés dynamiquement.",
    progress: 15,
  },
  {
    title: "Correction Transcript par IA",
    description: "Correction automatique des fautes et du contexte des sous-titres via API avancée.",
    progress: 35,
  },
];

export default function ClipForgePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="pt-8 pb-4">
        <div className="container-main">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] opacity-50" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] opacity-50" />
        </div>

        <div className="container-main relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-8">
              <Video className="w-4 h-4" />
              Outil de création
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Clip<span className="gradient-text">Forge</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/60 mb-10 leading-relaxed max-w-2xl mx-auto">
              Transformez vos longues vidéos en clips courts en quelques
              clics. Un outil pensé pour les créateurs de contenu.
            </p>

            <motion.a
              href="https://drive.google.com/uc?export=download&id=1sDTnPth86a4IZveiCsxvOrlbIhh81bSt"
              download
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-lg shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] hover:scale-105 transition-all"
            >
              <Download className="w-6 h-6" />
              Télécharger ClipForge
            </motion.a>

            <p className="text-white/50 text-sm mt-4">
              Windows 10/11 • Version 1.0.0 • Gratuit
            </p>
          </motion.div>
        </div>
      </section>

      {/* Current Features */}
      <section className="py-20 md:py-28">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Fonctionnalités <span className="gradient-text">actuelles</span>
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour créer des clips professionnels.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 hover:bg-white/5 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Features */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />

        <div className="container-main relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm font-medium mb-8">
              <Clock className="w-4 h-4" />
              En développement
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Prochaines <span className="gradient-text">fonctionnalités</span>
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Découvrez ce sur quoi nous travaillons pour les prochaines mises à jour.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {upcomingFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {feature.progress === 100 ? (
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-yellow-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-white/50 text-sm mb-4">
                      {feature.description}
                    </p>
                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${feature.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                      />
                    </div>
                    <p className="text-xs text-white/50 mt-2">
                      {feature.progress}% complété
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-10 md:p-16 text-center max-w-4xl mx-auto"
          >
            <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à créer des clips ?
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
              Rejoignez les créateurs qui utilisent ClipForge
              pour leur contenu.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="https://drive.google.com/uc?export=download&id=1sDTnPth86a4IZveiCsxvOrlbIhh81bSt"
                download
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] hover:scale-105 transition-all"
              >
                <Download className="w-5 h-5" />
                Télécharger maintenant
              </motion.a>
              <Link
                href="https://dsc.gg/expedition"
                target="_blank"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 font-semibold transition-colors"
              >
                Rejoindre la communauté
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="container-main text-center">
          <Link href="/" className="text-xl font-bold gradient-text">
            EXPÉDITION
          </Link>
          <p className="text-white/50 text-sm mt-2">
            © {new Date().getFullYear()} Expédition. Tous droits réservés.
          </p>
        </div>
      </footer>
    </main>
  );
}
