"use client";

import { motion } from "framer-motion";
import { Shield, Rocket, Download, Sparkles, Link2, MessageCircle, Users, Zap } from "lucide-react";

const tools = [
  {
    name: "Expedition Launcher",
    icon: Rocket,
    status: "Stable",
    statusColor: "bg-green-500",
    desc: "Installation, mises \u00e0 jour automatiques, gestion des licences.",
  },
  {
    name: "TubeForge",
    icon: Download,
    status: "Stable",
    statusColor: "bg-green-500",
    desc: "T\u00e9l\u00e9chargement, d\u00e9coupage, mode script, biblioth\u00e8que.",
  },
  {
    name: "ClipForge",
    icon: Sparkles,
    status: "Beta",
    statusColor: "bg-amber-500",
    desc: "Clips auto viraux. Am\u00e9lior\u00e9 chaque semaine gr\u00e2ce \u00e0 vos retours.",
  },
  {
    name: "ReviewForge",
    icon: Link2,
    status: "Stable",
    statusColor: "bg-green-500",
    desc: "Partage vid\u00e9o s\u00e9curis\u00e9 avec liens temporaires et dashboard de suivi.",
  },
];

const bentoItems = [
  {
    icon: Zap,
    title: "Prix juste",
    desc: "Pourquoi payer 10x le prix pour les m\u00eames fonctionnalit\u00e9s ? Pas de forfait \u00abPro\u00bb \u00e0 30\u20ac par outil.",
    span: "md:col-span-1",
  },
  {
    icon: Users,
    title: "Co-construit avec vous",
    desc: "Vos retours sur Discord fa\u00e7onnent directement les mises \u00e0 jour. Pas une feuille de route grav\u00e9e dans le marbre.",
    span: "md:col-span-1",
  },
  {
    icon: Shield,
    title: "Transparent",
    desc: "Pas de promesses intenables. On construit, jour apr\u00e8s jour. Vous savez toujours o\u00f9 on en est.",
    span: "md:col-span-1",
  },
  {
    icon: MessageCircle,
    title: "Discord d\u00e9di\u00e9",
    desc: "Signalez un bug, proposez une am\u00e9lioration, votez les prochaines features. Acc\u00e8s direct au d\u00e9veloppeur.",
    span: "md:col-span-1",
  },
];

export default function WhyExpeditionSection() {
  return (
    <section className="py-32 md:py-40 relative">
      {/* Solid bg to hide stars on this dense section */}
      <div className="absolute inset-0 bg-[#06051a]/90 pointer-events-none" />
      <div className="container-main max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            <span>Transparence</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-[-0.03em]">
            L&apos;alternative Accessible &amp; Honn&ecirc;te
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Nos outils existent parfois ailleurs, en version plus avanc&eacute;e.
            Notre mission : les rendre accessibles &agrave; tous, pour une fraction du prix.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {bentoItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`group p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300 ${item.span}`}
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <item.icon className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">{item.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Tool status cards — compact row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tools.map((tool, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
            >
              <tool.icon className="w-4 h-4 text-white/30 shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white/70 truncate">{tool.name}</span>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${tool.statusColor}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
