"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import CursorGlow from "@/components/CursorGlow";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Check, Lock, Calendar, AlertCircle, Rocket, Zap, Download, Layers, Sparkles, Terminal } from "lucide-react";

const ParticlesBackground = dynamic(
  () => import("@/components/ParticlesBackground"),
  { ssr: false }
);

const includedTools = [
  {
    name: "Expedition Launcher",
    desc: "Votre QG de créateur. Mises à jour automatiques, news et accès centralisé.",
    icon: Rocket,
    color: "bg-blue-500/20 text-blue-400"
  },
  {
    name: "ClipForge",
    desc: "Transformez vos vidéos YouTube en TikToks/Shorts viraux en quelques clics.",
    icon: Sparkles,
    color: "bg-purple-500/20 text-purple-400"
  },
  {
    name: "TubeForge",
    desc: "Le téléchargeur ultime. 8K, 60fps, sans pub. Archivez le web.",
    icon: Download,
    color: "bg-red-500/20 text-red-400"
  },
  {
    name: "Mises à jour Futures",
    desc: "Accès inclus à ThumbCraft (IA Miniatures) et aux prochains outils de la Vague 1.",
    icon: Layers,
    color: "bg-green-500/20 text-green-400"
  }
];

export default function PricingPage() {
  const waves = [
    {
      id: 1,
      name: "Vague Pionnier",
      date: "20 Février",
      price: "9,99€",
      period: "/mois",
      status: "open", // open, closed, upcoming
      features: [
        "Accès complet au Launcher",
        "Licence ClipForge Illimitée",
        "Licence TubeForge Pro",
        "badge Discord 'Pionnier'",
        "Prix bloqué à vie"
      ],
      color: "from-purple-500 to-blue-500",
      glow: "purple"
    },
    {
      id: 2,
      name: "Vague Expansion",
      date: "Mai 2026",
      price: "14,99€",
      period: "/mois",
      status: "upcoming",
      features: [
        "Tous les outils Vague 1",
        "Nouveaux outils de Mai",
        "Prix plus élevé",
        "Pas de badge Pionnier"
      ],
      color: "from-blue-500 to-cyan-500",
      glow: "blue"
    },
    {
      id: 3,
      name: "Vague Ultime",
      date: "Juillet 2026",
      price: "24,99€",
      period: "/mois",
      status: "upcoming",
      features: [
        "Suite complète (+10 outils)",
        "Accès API",
        "Prix standard final",
        "Support standard"
      ],
      color: "from-cyan-500 to-emerald-500",
      glow: "cyan"
    }
  ];

  return (
    <div className="w-full min-h-screen overflow-x-hidden relative bg-[#0a0a0a] text-white">
      <ParticlesBackground />
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
              <span>Modèle &quot;Grandfathering&quot; : Votre prix ne bougera jamais</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Un abonnement unique.<br />
              <span className="gradient-text">Une infinité d&apos;outils.</span>
            </h1>
            <p className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
              Rejoignez l&apos;Expédition dès maintenant pour bloquer le tarif le plus bas de l&apos;histoire du projet.
              Accédez immédiatement à tous nos outils actuels et futurs.
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
                    Garantie satisfait ou remboursé 14 jours.
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
            <h4 className="text-lg font-bold text-orange-300 mb-2">Pourquoi rejoindre maintenant ?</h4>
            <p className="text-white/70 leading-relaxed">
              Nous construisons Expédition en public. Le prix augmentera à chaque nouvelle &quot;Vague&quot; d&apos;outils.
              <br />
              <strong>Les membres de la Vague Pionnier (vous) ne subiront jamais ces augmentations.</strong>
              Votre tarif de 9,99€ est verrouillé à vie tant que votre abonnement reste actif.
            </p>
          </div>
        </motion.div>

      </main>
      <Footer />
    </div>
  );
}
