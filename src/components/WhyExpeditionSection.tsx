"use client";

import { motion } from "framer-motion";
import { Shield, Rocket, Download, Sparkles, Link2, MessageCircle } from "lucide-react";

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

const convictions = [
  {
    label: "01",
    quote: "Pourquoi payer 10x le prix pour les m\u00eames fonctionnalit\u00e9s\u00a0?",
    note: "Prix juste \u2014 pas de forfait \u00abPro\u00bb \u00e0 30\u20ac par outil.",
  },
  {
    label: "02",
    quote: "Vos retours sur Discord fa\u00e7onnent directement les mises \u00e0 jour.",
    note: "Co-construction \u2014 pas une feuille de route grav\u00e9e dans le marbre.",
  },
  {
    label: "03",
    quote: "Pas de promesses intenables. On construit, jour apr\u00e8s jour.",
    note: "Transparence \u2014 vous savez toujours o\u00f9 on en est.",
  },
];

export default function WhyExpeditionSection() {
  return (
    <section className="py-32 md:py-40 relative section-fade-top">
      <div className="container-main max-w-5xl">
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

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left: tool status cards */}
          <div className="flex-1 space-y-3">
            {tools.map((tool, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/15 transition-all duration-300"
              >
                <div className="mt-0.5 w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                  <tool.icon className="w-4 h-4 text-white/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-white text-sm">{tool.name}</h3>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white ${tool.statusColor}`}>
                      {tool.status}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">{tool.desc}</p>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15 flex items-start gap-3"
            >
              <div className="mt-0.5 w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-0.5">Channel Discord d&eacute;di&eacute;</h3>
                <p className="text-xs text-white/40 leading-relaxed">
                  Signalez un bug, proposez une am&eacute;lioration, votez les prochaines features.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: convictions */}
          <div className="flex-1 flex flex-col gap-0 divide-y divide-white/[0.06]">
            {convictions.map(({ label, quote, note }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                className="py-8 first:pt-0 last:pb-0"
              >
                <span className="text-xs font-mono font-bold text-purple-400/50 tracking-[0.15em] uppercase mb-3 block">{label}</span>
                <p className="text-xl md:text-2xl font-semibold text-white leading-snug mb-2">&ldquo;{quote}&rdquo;</p>
                <p className="text-sm text-white/35 font-mono tracking-wide">{note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
