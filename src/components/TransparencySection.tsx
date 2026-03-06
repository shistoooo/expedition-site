"use client";

import { motion } from "framer-motion";
import { Shield, MessageCircle, Rocket, Download, Sparkles, Link2 } from "lucide-react";

const tools = [
  {
    name: "Expedition Launcher",
    icon: Rocket,
    status: "Stable",
    statusColor: "bg-green-500",
    desc: "Installation, mises \u00e0 jour automatiques, gestion des licences. Fonctionne sans probl\u00e8me sur Mac et Windows.",
  },
  {
    name: "TubeForge",
    icon: Download,
    status: "Stable",
    statusColor: "bg-green-500",
    desc: "T\u00e9l\u00e9chargement, d\u00e9coupage, mode script, biblioth\u00e8que. Toutes les fonctionnalit\u00e9s sont op\u00e9rationnelles.",
  },
  {
    name: "ClipForge",
    icon: Sparkles,
    status: "Beta",
    statusColor: "bg-amber-500",
    desc: "Excellent sur les vid\u00e9os face cam et \u00e0 sujet unique. Le recadrage peut \u00eatre impr\u00e9cis sur les podcasts ou les lives multi-personnes. On am\u00e9liore \u00e7a activement.",
  },
  {
    name: "ReviewForge",
    icon: Link2,
    status: "Bient\u00f4t",
    statusColor: "bg-emerald-500",
    desc: "En cours de d\u00e9veloppement pour la Vague 2. Partage s\u00e9curis\u00e9 de vid\u00e9os avec liens temporaires, tunnel direct et dashboard de suivi.",
  },
];

export default function TransparencySection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden border-t border-white/5">
      <div className="container-main max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            <span>Transparence</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            On pr&eacute;f&egrave;re &ecirc;tre honn&ecirc;tes.
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Exp&eacute;dition est un projet jeune. Certains outils sont plus matures que d&apos;autres.
            Voici o&ugrave; on en est, sans filtre.
          </p>
        </motion.div>

        <div className="space-y-4 mb-10">
          {tools.map((tool, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10"
            >
              <div className="mt-0.5 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                <tool.icon className="w-5 h-5 text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-white">{tool.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${tool.statusColor}`}>
                    {tool.status}
                  </span>
                </div>
                <p className="text-sm text-white/50 leading-relaxed">{tool.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-5 rounded-2xl bg-purple-500/5 border border-purple-500/15 flex items-start gap-4"
        >
          <div className="mt-0.5 w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-white mb-1">Un channel Discord d&eacute;di&eacute; pour vos retours</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Chaque abonn&eacute; a acc&egrave;s &agrave; un channel priv&eacute; o&ugrave; vous pouvez signaler un bug,
              proposer une am&eacute;lioration ou voter pour les prochaines fonctionnalit&eacute;s.
              Vos retours d&eacute;cident directement de ce qu&apos;on d&eacute;veloppe ensuite.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
