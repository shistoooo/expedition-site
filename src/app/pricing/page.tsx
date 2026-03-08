"use client";

import Link from "next/link";
import CursorGlow from "@/components/CursorGlow";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Check, Lock, Calendar, AlertCircle, Rocket, Zap, Download, Layers, Sparkles, Terminal } from "lucide-react";

const includedTools = [
  {
    name: "Expedition Launcher",
    desc: "Votre QG de créateur. Mises à jour automatiques, news et accès centralisé.",
    icon: Rocket,
    color: "bg-blue-500/20 text-blue-400"
  },
  {
    name: "TubeForge (Vague 1)",
    desc: "Le téléchargeur ultime. 8K, 60fps, sans pub. Disponible maintenant.",
    icon: Download,
    color: "bg-red-500/20 text-red-400"
  },
  {
    name: "ClipForge (Vague 2)",
    desc: "Transformez vos vidéos YouTube en TikToks/Shorts viraux. Arrive prochainement.",
    icon: Sparkles,
    color: "bg-purple-500/20 text-purple-400"
  },
  {
    name: "ReviewForge (Vague 3)",
    desc: "Partage vidéo sécurisé avec liens temporaires et review en temps réel. Été 2026.",
    icon: Layers,
    color: "bg-green-500/20 text-green-400"
  }
];

export default function PricingPage() {
  const waves = [
    {
      id: 1,
      name: "Vague 1 — TubeForge",
      date: "Disponible",
      price: "11,99€",
      discordPrice: "7,99€",
      period: "/mois",
      status: "open",
      features: [
        "Accès complet au Launcher",
        "Licence TubeForge Pro (8K, sans pub)",
        "Badge Discord 'Pionnier'",
        "Accès garanti aux Vagues 2 et 3",
        "Tarif bloqué tant que vous restez abonné"
      ],
      color: "from-purple-500 to-blue-500",
      glow: "purple"
    },
    {
      id: 2,
      name: "Vague 2 — ClipForge",
      date: "Beta",
      price: "~15€",
      period: "/mois",
      status: "upcoming",
      features: [
        "Tout de la Vague 1",
        "ClipForge — Clips auto 8h + sélection illimitée",
        "Prix plus élevé pour les nouveaux",
        "Pionniers : inclus sans surcoût"
      ],
      color: "from-blue-500 to-cyan-500",
      glow: "blue"
    },
    {
      id: 3,
      name: "Vague 3 — ReviewForge",
      date: "Disponible",
      price: "~25-50€",
      period: "/mois",
      status: "upcoming",
      features: [
        "Tout des Vagues 1 et 2",
        "ReviewForge — Partage vidéo sécurisé",
        "Prix standard final",
        "Pionniers : inclus sans surcoût"
      ],
      color: "from-cyan-500 to-emerald-500",
      glow: "cyan"
    }
  ];

  return (
    <div className="w-full min-h-screen overflow-x-hidden relative bg-[#0a0a0a] text-white">

      <CursorGlow />
      <Navbar />

      <main className="pt-32 pb-24 container-main">
        {/* Header Content */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm font-medium mb-6">
              <Lock className="w-4 h-4" />
              <span>Plus la suite grandit, plus votre offre prend de la valeur</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Un abonnement unique.<br />
              <span className="gradient-text">Une infinité d&apos;outils.</span>
            </h1>
            <p className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
              Rejoignez l&apos;Exp&eacute;dition d&egrave;s maintenant pour profiter du tarif le plus bas — il reste bloqu&eacute; tant que vous restez abonn&eacute;.
              Acc&eacute;dez imm&eacute;diatement &agrave; tous nos outils actuels et futurs.
            </p>
          </motion.div>
        </div>

        {/* Value Stack Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-20">
          {includedTools.map((tool, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors"
            >
              <div className={`p-3 rounded-xl shrink-0 ${tool.color}`}>
                <tool.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{tool.name}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{tool.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto leading-relaxed">
          {waves.map((wave, index) => (
            <motion.div
              key={wave.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative rounded-2xl p-1 overflow-hidden ${wave.status === 'open' ? 'ring-2 ring-purple-500/50 shadow-2xl shadow-purple-500/20' : 'opacity-60 scale-95 grayscale'}`}
            >
              {/* Background Gradient Border */}
              <div className={`absolute inset-0 bg-gradient-to-b ${wave.color} opacity-20`} />

              <div className="relative h-full bg-[#0f0f12] rounded-xl p-8 flex flex-col border border-white/10">
                {wave.status === 'open' && (
                  <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    MEILLEURE OFFRE
                  </div>
                )}
                {wave.status === 'upcoming' && (
                  <div className="absolute top-0 right-0 bg-white/10 text-white/50 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    BIENTOT
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    {wave.date}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{wave.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{wave.price}</span>
                    <span className="text-white/50">{wave.period}</span>
                  </div>
                  {wave.discordPrice && (
                    <p className="text-xs text-green-300 mt-1">{wave.discordPrice}/mois pour les membres Discord</p>
                  )}
                </div>

                <div className="flex-1 space-y-4 mb-8">
                  {wave.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-white/80">
                      <Check className={`w-5 h-5 shrink-0 ${wave.status === 'open' ? 'text-purple-400' : 'text-white/30'}`} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {wave.status === 'open' ? (
                  <Link
                    href="/checkout"
                    className="w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/10"
                  >
                    Sécuriser mon prix
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                  >
                    Pas encore disponible
                  </button>
                )}

                {wave.status === 'open' && (
                  <p className="text-center text-xs text-white/40 mt-3">
                    Annulable à tout moment. Sans engagement.
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Warning / Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="max-w-3xl mx-auto mt-20 p-6 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex gap-4 items-start"
        >
          <AlertCircle className="w-6 h-6 text-orange-400 shrink-0 mt-1" />
          <div>
            <h4 className="text-lg font-bold text-orange-300 mb-2">Pourquoi c&apos;est le meilleur moment pour rejoindre ?</h4>
            <p className="text-white/70 leading-relaxed mb-3">
              La suite Expédition grandit en permanence. À chaque nouvelle &quot;Vague&quot; d&apos;outils, le tarif d&apos;entrée augmente.
            </p>
            <p className="text-white/70 leading-relaxed mb-3">
              <strong className="text-orange-200">Les Pionniers gardent leur tarif d&apos;entr&eacute;e tant qu&apos;ils restent abonn&eacute;s</strong> — m&ecirc;me quand la suite vaudra 25&euro;/mois avec 10+ outils.
              Plus vous rejoignez t&ocirc;t, plus vous &eacute;conomisez sur le long terme.
            </p>
            <p className="text-white/50 text-sm">
              Votre tarif reste le même tant que votre abonnement est actif. Annulable à tout moment.
            </p>
          </div>
        </motion.div>

      </main>
      <Footer />
    </div>
  );
}
