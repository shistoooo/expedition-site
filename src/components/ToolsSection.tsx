"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Video, Wand2, Scissors, Share2, ArrowRight } from "lucide-react";

export default function ToolsSection() {
  return (
    <section id="clipforge" className="py-24 md:py-32 relative overflow-hidden">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20"
        >
          {/* Côté Texte */}
          <div className="flex-1 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Disponible Maintenant
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Clip<span className="gradient-text">Forge</span>
            </h2>
            <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed">
              Transformez vos longues vidéos (YouTube, Twitch)
              en formats courts (TikTok, Shorts) facilement.
            </p>

            <ul className="space-y-6 mb-10">
              {[
                {
                  icon: Wand2,
                  title: "Découpage Intelligent",
                  desc: "L'IA détecte les moments clés de vos vidéos.",
                },
                {
                  icon: Scissors,
                  title: "Recadrage Auto",
                  desc: "Passez du format 16:9 au 9:16 sans perdre le sujet.",
                },
                {
                  icon: Share2,
                  title: "Sous-titres & Export",
                  desc: "Sous-titres générés automatiquement et export 4K.",
                },
              ].map((item, i) => (
                <li key={i} className="flex gap-5">
                  <div className="mt-1 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <item.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">
                      {item.title}
                    </h3>
                    <p className="text-white/50">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <a
              href="/clipforge"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg shadow-white/10"
            >
              En savoir plus <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Côté Visuel / Mockup */}
          <div className="flex-1 w-full relative">
            <div className="absolute -inset-10 bg-gradient-to-tr from-purple-500/20 via-blue-500/20 to-pink-500/20 blur-3xl rounded-full opacity-50" />
            <div className="relative glass rounded-2xl border border-white/10 p-4 shadow-2xl">
              <div className="aspect-video bg-[#0a0a0a] rounded-xl overflow-hidden relative border border-white/5 flex items-center justify-center group">
                {/* Simulation d'interface */}
                <div className="absolute inset-0 flex">
                  {/* Sidebar */}
                  <div className="w-16 border-r border-white/10 flex flex-col items-center py-4 gap-4 bg-[#0f0f12]">
                    <div className="w-8 h-8 rounded-full bg-white/10" />
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20" />
                    <div className="w-8 h-8 rounded-lg bg-white/5" />
                  </div>
                  {/* Main Content */}
                  <div className="flex-1 p-6 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1], boxShadow: ["0 10px 15px -3px rgba(147, 51, 234, 0.3)", "0 20px 25px -5px rgba(147, 51, 234, 0.5)", "0 10px 15px -3px rgba(147, 51, 234, 0.3)"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30"
                      >
                        <Video className="w-8 h-8 text-white" />
                      </motion.div>
                      <motion.div 
                        animate={{ opacity: [0.5, 1, 0.5], width: ["8rem", "9rem", "8rem"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="h-2 w-32 bg-white/10 rounded-full mb-2" 
                      />
                      <motion.div 
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="h-2 w-20 bg-white/10 rounded-full" 
                      />
                    </div>
                    {/* Timeline fictive */}
                    <div className="absolute bottom-6 left-6 right-6 h-12 bg-white/5 rounded-lg border border-white/5 flex items-center px-2 gap-2 overflow-hidden">
                      {/* Clip Violet (Cut animation) */}
                      <motion.div 
                        animate={{ 
                          width: ["40%", "20%", "20%", "40%"],
                          x: [0, 0, 100, 0] // Simulation de déplacement
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="h-8 bg-purple-500/20 rounded border border-purple-500/30 backdrop-blur-sm" 
                      />
                      
                      {/* Clip Bleu (Reposition animation) */}
                      <motion.div 
                        animate={{ 
                          width: ["30%", "30%", "50%", "30%"],
                          x: [0, 0, -50, 0] // Simulation de déplacement inverse/swap
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="h-8 bg-blue-500/20 rounded border border-blue-500/30 backdrop-blur-sm" 
                      />

                      {/* Clip Additionnel (Apparition) */}
                      <motion.div 
                        animate={{ 
                          width: ["0%", "20%", "0%", "0%"],
                          opacity: [0, 1, 0, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="h-8 bg-white/10 rounded border border-white/20 backdrop-blur-sm" 
                      />

                      {/* Playhead qui parcourt */}
                      <motion.div
                        animate={{ left: ["0%", "100%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 bottom-0 w-0.5 bg-white/50 z-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TimelineAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Séquence : 0 (Initial) -> 1 (Cut/Trim) -> 2 (Reposition/Swap) -> 0
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 2500); // Change toutes les 2.5 secondes
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <motion.div 
        layout
        initial={false}
        animate={{ 
          width: step === 0 ? "40%" : "25%", // Se réduit au step 1 (Cut)
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="h-8 bg-purple-500/20 rounded border border-purple-500/30 backdrop-blur-sm" 
        style={{ order: step === 2 ? 1 : 0 }} // Change d'ordre au step 2 (Reposition)
      />
      
      <motion.div 
        layout
        initial={false}
        animate={{ 
          width: step === 0 ? "30%" : "35%", // S'agrandit légèrement
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="h-8 bg-blue-500/20 rounded border border-blue-500/30 backdrop-blur-sm" 
        style={{ order: step === 2 ? 0 : 1 }} // Change d'ordre au step 2
      />

      {/* Playhead */}
      <motion.div
        animate={{ left: ["0%", "100%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 bottom-0 w-0.5 bg-white/50 z-10 pointer-events-none"
      />
    </>
  );
}
