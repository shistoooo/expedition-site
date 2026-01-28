"use client";

import dynamic from "next/dynamic";
import CursorGlow from "@/components/CursorGlow";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Check, Lock, Calendar, AlertCircle } from "lucide-react";

const ParticlesBackground = dynamic(
  () => import("@/components/ParticlesBackground"),
  { ssr: false }
);

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
        "Accès complet à ClipForge",
        "Accès aux outils futurs (vagues 2 & 3)",
        "Support prioritaire Discord",
        "Badge 'Pionnier' exclusif",
        "Prix bloqué à vie"
      ],
      color: "from-purple-500 to-blue-500",
      glow: "purple"
    },
    {
      id: 2,
      name: "Vague Expansion",
      date: "Mai 2024",
      price: "11,99€",
      period: "/mois",
      status: "upcoming",
      features: [
        "Accès complet à ClipForge",
        "Accès aux nouveaux outils de Mai",
        "Accès aux outils futurs (vague 3)",
        "Prix bloqué à vie"
      ],
      color: "from-blue-500 to-cyan-500",
      glow: "blue"
    },
    {
      id: 3,
      name: "Vague Ultime",
      date: "Juillet 2024",
      price: "19,99€",
      period: "/mois",
      status: "upcoming",
      features: [
        "Accès complet à la suite Expédition",
        "Tous les outils débloqués",
        "Accès API (bientôt)",
        "Prix bloqué à vie"
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
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm font-medium mb-6">
              <Lock className="w-4 h-4" />
              <span>Modèle "Grandfathering" : Votre prix ne bougera jamais</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Investissez tôt, <br />
              <span className="gradient-text">économisez pour toujours.</span>
            </h1>
            <p className="text-xl text-white/60 leading-relaxed">
              Expédition fonctionne par vagues. Chaque nouvelle vague apporte de nouveaux outils 
              et augmente le prix pour les nouveaux arrivants.
              <br />
              <span className="text-white font-semibold">Si vous rejoignez maintenant, vous gardez le prix de la Vague 1 à vie, même quand la suite vaudra le double.</span>
            </p>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {waves.map((wave, index) => (
            <motion.div
              key={wave.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative rounded-2xl p-1 overflow-hidden ${wave.status === 'open' ? 'ring-2 ring-purple-500/50 shadow-2xl shadow-purple-500/20' : 'opacity-80'}`}
            >
              {/* Background Gradient Border */}
              <div className={`absolute inset-0 bg-gradient-to-b ${wave.color} opacity-20`} />
              
              <div className="relative h-full bg-[#0f0f12] rounded-xl p-8 flex flex-col border border-white/10">
                {wave.status === 'open' && (
                  <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    OUVERTURE PROCHAINE
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

                <button 
                  disabled={wave.status !== 'open'}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2
                    ${wave.status === 'open' 
                      ? 'bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/10' 
                      : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                    }`}
                >
                  {wave.status === 'open' ? 'Rejoindre la Vague 1' : 'Bientôt disponible'}
                </button>
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
            <h4 className="text-lg font-bold text-orange-300 mb-2">Pourquoi ce système ?</h4>
            <p className="text-white/70 leading-relaxed">
              Nous construisons Expédition en public. Le prix augmente à mesure que la valeur de la suite augmente (nouveaux outils, nouvelles fonctionnalités).
              Ce système récompense ceux qui nous font confiance dès le début (Early Adopters) en leur garantissant le tarif le plus bas possible, pour toujours.
            </p>
          </div>
        </motion.div>

      </main>
      <Footer />
    </div>
  );
}
