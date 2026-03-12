"use client";

import { motion } from "framer-motion";
import { Users, MessageSquare, Zap } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "200+",
    label: "Cr\u00e9ateurs sur le Discord",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    icon: Zap,
    value: "3",
    label: "Outils disponibles ou en beta",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    icon: MessageSquare,
    value: "24h",
    label: "Temps de r\u00e9ponse moyen du dev",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
];

export default function SocialProofSection() {
  return (
    <section className="py-24 relative section-fade-top">
      <div className="container-main">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-white/30 uppercase tracking-widest font-medium mb-10"
        >
          La communaut&eacute; en chiffres
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/15 hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(139,92,246,0.08)]"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.bg} border ${stat.border} mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-4xl font-black text-white mb-2">{stat.value}</p>
              <p className="text-sm text-white/50">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
