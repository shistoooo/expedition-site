"use client";

import { motion } from "framer-motion";
import { Download, Scissors, Eye, Lock } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const tools = [
  {
    name: "TubeForge",
    wave: "Vague 1",
    status: "stable" as const,
    statusLabel: "✓ Disponible",
    icon: Download,
    iconColor: "text-red-300",
    iconBg: "bg-red-500/10 border-red-500/20",
    tagline: "Téléchargement YouTube en 4K, sans bridage. Découpez avant de télécharger, importez vos scripts.",
  },
  {
    name: "ClipForge",
    wave: "Vague 2",
    status: "coming" as const,
    statusLabel: "⏳ Bientôt",
    icon: Scissors,
    iconColor: "text-indigo-300",
    iconBg: "bg-indigo-500/10 border-indigo-500/20",
    tagline: "Clips automatiques par IA, sous-titres animés, Smart Crop 9:16 pour Shorts et Reels.",
  },
  {
    name: "ReviewForge",
    wave: "Vague 3",
    status: "coming" as const,
    statusLabel: "⏳ Bientôt",
    icon: Eye,
    iconColor: "text-cyan-300",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    tagline: "Review vidéo sécurisé pour vos clients. Commentaires timestampés, sans rogner la qualité.",
  },
];

export default function MonteursSuiteTease() {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-[#06051a]/60 pointer-events-none" />

      <div className="container-main max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-purple-400/60 mb-4">
            La suite Expédition
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-[-0.03em] mb-4">
            Un abonnement. Trois outils.{" "}
            <br className="hidden md:block" />
            Un seul prix —{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-purple-300">
              bloqué à vie
            </span>
            .
          </h2>
          <p className="text-base text-white/45 max-w-xl mx-auto">
            Vous n&apos;achetez pas un outil. Vous prenez votre place dans une suite qui grandit.
            Tous les futurs outils sont inclus, sans surcoût.
          </p>
        </motion.div>

        {/* 3 cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10"
        >
          {tools.map((tool, i) => {
            const isAvailable = tool.status === "stable";
            return (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: easeOutExpo }}
                className="group relative p-6 rounded-2xl border transition-all duration-300 flex flex-col"
                style={{
                  background: isAvailable
                    ? "linear-gradient(160deg, rgba(139,92,246,0.07) 0%, rgba(255,255,255,0.02) 100%)"
                    : "rgba(255,255,255,0.025)",
                  borderColor: isAvailable
                    ? "rgba(139,92,246,0.25)"
                    : "rgba(255,255,255,0.08)",
                }}
              >
                {/* Status badge */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center ${tool.iconBg} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <tool.icon className={`w-5 h-5 ${tool.iconColor}`} />
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full ${
                      isAvailable
                        ? "bg-green-500/10 text-green-300 border border-green-500/20"
                        : "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                    }`}
                  >
                    {tool.statusLabel}
                  </span>
                </div>

                {/* Wave label */}
                <p className="text-xs font-mono uppercase tracking-widest text-white/35 mb-2">
                  {tool.wave}
                </p>

                {/* Name */}
                <h3 className="font-bold text-white text-xl mb-3">{tool.name}</h3>

                {/* Tagline */}
                <p className="text-sm text-white/50 leading-relaxed flex-1">{tool.tagline}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Sub-CTA — anchor to pricing */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <a
            href="#monteurs-pricing"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors group"
          >
            <Lock className="w-4 h-4 text-purple-300" />
            <span>
              Voir le tarif Pionnier <span className="ml-0.5 inline-block group-hover:translate-y-0.5 transition-transform">↓</span>
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
