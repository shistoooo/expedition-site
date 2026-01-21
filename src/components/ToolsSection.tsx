"use client";

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
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative glass rounded-2xl border border-white/10 p-4 shadow-2xl"
            >
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
                      <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                      <div className="h-2 w-32 bg-white/10 rounded-full mb-2" />
                      <div className="h-2 w-20 bg-white/10 rounded-full" />
                    </div>
                    {/* Timeline fictive */}
                    <div className="absolute bottom-6 left-6 right-6 h-12 bg-white/5 rounded-lg border border-white/5 flex items-center px-2 gap-1">
                      <div className="h-8 w-1/4 bg-purple-500/20 rounded border border-purple-500/30" />
                      <div className="h-8 w-1/3 bg-blue-500/20 rounded border border-blue-500/30" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
