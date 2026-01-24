"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Users, Calendar, Target, Rocket, ArrowRight, CheckCircle2 } from "lucide-react";

const benefits = [
  {
    icon: Target,
    title: "Stratégie Personnalisée",
    desc: "Analyse de votre chaîne, définition d'objectifs clairs et plan d'action sur 60 jours.",
  },
  {
    icon: Users,
    title: "Groupe Restreint",
    desc: "Rejoignez une escouade de créateurs motivés. Entraide, retours et émulation collective.",
  },
  {
    icon: CheckCircle2,
    title: "Feedback Constant",
    desc: "Retours détaillés sur vos vidéos, miniatures et titres avant publication.",
  },
];

const waves = [
  {
    id: "wave-alpha",
    name: "Vague Alpha",
    date: "En cours",
    status: "active", // active, upcoming, past
    spots: "Complet",
  },
  {
    id: "wave-beta",
    name: "Vague Bêta",
    date: "20 Février 2024",
    status: "upcoming",
    spots: "Candidatures ouvertes",
  },
  {
    id: "wave-gamma",
    name: "Vague Gamma",
    date: "20 Avril 2024",
    status: "future",
    spots: "Bientôt",
  },
];

export default function ExpeditionPage() {
  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section with 3D Rocket */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* GlobalSpace handles the 3D background now */}
        
        <div className="container-main relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-8 backdrop-blur-md">
              <Rocket className="w-4 h-4 animate-pulse" />
              <span>Prochain décollage : 20 Février</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Rejoignez <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                L'Expédition
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              Un accélérateur intensif de 60 jours pour créateurs de contenu ambitieux.
              Stratégie, entraide et passage à l'action.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#candidature"
                className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2"
              >
                Candidater maintenant <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#details"
                className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-lg hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                Comment ça marche ?
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Concept Section */}
      <section id="details" className="py-24 relative">
        <div className="container-main">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 border-t border-white/5 bg-white/[0.02]">
        <div className="container-main">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Le Calendrier des Vagues</h2>
            <p className="text-white/60">Nous embarquons de nouveaux explorateurs tous les 60 jours.</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {waves.map((wave) => (
              <div 
                key={wave.id}
                className={`flex items-center justify-between p-6 rounded-xl border ${
                  wave.status === 'upcoming' 
                    ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.1)]' 
                    : 'bg-white/5 border-white/10 opacity-70'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-3 h-3 rounded-full ${
                    wave.status === 'active' ? 'bg-green-500 animate-pulse' :
                    wave.status === 'upcoming' ? 'bg-purple-500' : 'bg-white/20'
                  }`} />
                  <div>
                    <h3 className="font-bold text-lg">{wave.name}</h3>
                    <p className="text-white/50 text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> {wave.date}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    wave.status === 'upcoming' ? 'bg-purple-500/20 text-purple-300' : 'text-white/40'
                  }`}>
                    {wave.spots}
                  </span>
                  {wave.status === 'upcoming' && (
                    <a href="#candidature" className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-white text-black text-sm font-bold hover:bg-gray-100 transition-colors">
                      Rejoindre
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Application Section */}
      <section id="candidature" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none" />
        
        <div className="container-main text-center max-w-2xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold mb-6">Prêt à décoller ?</h2>
          <p className="text-xl text-white/60 mb-10">
            Les places sont limitées pour garantir la qualité de l'accompagnement.
            Remplissez le formulaire pour postuler à la prochaine vague.
          </p>
          
          <a
            href="https://tally.so/r/w7NE1X" // Remplacez par votre lien Typeform/Tally réel
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25"
          >
            Déposer ma candidature
            <Rocket className="w-5 h-5" />
          </a>
          <p className="mt-4 text-sm text-white/30">
            Temps estimé : 5 minutes. Aucune carte bancaire requise pour postuler.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
