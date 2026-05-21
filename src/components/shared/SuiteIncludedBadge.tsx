"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, ArrowRight, Download, Scissors, MessageSquare } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Accent = "purple" | "cyan";

const accentClasses: Record<Accent, { border: string; glow: string; ctaText: string; ctaHover: string }> = {
  purple: {
    border: "border-purple-500/20",
    glow: "rgba(139,92,246,0.15)",
    ctaText: "text-purple-300",
    ctaHover: "hover:text-purple-200",
  },
  cyan: {
    border: "border-cyan-500/20",
    glow: "rgba(34,211,238,0.15)",
    ctaText: "text-cyan-300",
    ctaHover: "hover:text-cyan-200",
  },
};

type Status = "dispo" | "dev" | "soon";

const statusClasses: Record<Status, { label: string; dot: string; chip: string }> = {
  dispo: {
    label: "Disponible",
    dot: "bg-emerald-400",
    chip: "text-emerald-300 bg-emerald-500/10 border-emerald-500/25",
  },
  dev: {
    label: "En développement",
    dot: "bg-amber-400",
    chip: "text-amber-300 bg-amber-500/10 border-amber-500/25",
  },
  soon: {
    label: "En conception",
    dot: "bg-violet-400",
    chip: "text-violet-300 bg-violet-500/10 border-violet-500/25",
  },
};

const tools: Array<{
  name: string;
  description: string;
  icon: typeof Download;
  iconColor: string;
  iconBg: string;
  iconBorder: string;
  status: Status;
}> = [
  {
    name: "TubeForge",
    description: "Plugin Premiere & DaVinci",
    icon: Download,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/10",
    iconBorder: "border-red-500/25",
    status: "dispo",
  },
  {
    name: "ClipForge",
    description: "Clips auto IA pour Shorts/TikTok",
    icon: Scissors,
    iconColor: "text-amber-300",
    iconBg: "bg-amber-500/10",
    iconBorder: "border-amber-500/25",
    status: "dev",
  },
  {
    name: "ReviewForge",
    description: "Espace de retour client sécurisé",
    icon: MessageSquare,
    iconColor: "text-violet-300",
    iconBg: "bg-violet-500/10",
    iconBorder: "border-violet-500/25",
    status: "soon",
  },
];

type SuiteIncludedBadgeProps = {
  accent?: Accent;
};

export default function SuiteIncludedBadge({ accent = "purple" }: SuiteIncludedBadgeProps) {
  const cls = accentClasses[accent];

  return (
    <section className="py-12 md:py-16 relative">
      <div className="container-main max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-center mb-8 md:mb-10"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-white/45 mb-3">
            Un abonnement &mdash; toute la suite
          </p>
          <h2 className="text-2xl md:text-4xl font-black tracking-[-0.02em] leading-tight">
            Tu n&apos;ach&egrave;tes pas un outil.{" "}
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accent === "purple" ? "from-purple-300 to-cyan-300" : "from-cyan-300 to-purple-300"}`}>
              Tu rejoins un launcher.
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
          className={`relative rounded-3xl border ${cls.border} bg-white/[0.02] p-5 md:p-8 overflow-hidden`}
          style={{ boxShadow: `0 20px 60px -30px ${cls.glow}` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {tools.map((tool) => {
              const st = statusClasses[tool.status];
              return (
                <div
                  key={tool.name}
                  className="relative flex items-start gap-3 p-4 rounded-xl border border-white/[0.08] bg-white/[0.015]"
                >
                  <div className={`shrink-0 w-10 h-10 rounded-lg ${tool.iconBg} border ${tool.iconBorder} flex items-center justify-center`}>
                    <tool.icon className={`w-4 h-4 ${tool.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white text-sm md:text-base">{tool.name}</h3>
                    </div>
                    <p className="text-xs text-white/45 leading-relaxed mb-2">{tool.description}</p>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-wider ${st.chip}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot} ${tool.status === "dev" ? "animate-pulse" : ""}`} />
                      {st.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-white/[0.05]">
            <p className="text-xs md:text-sm text-white/55 flex items-center gap-2 leading-relaxed">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>
                <strong className="text-white">Tarif Pionnier bloqué à vie.</strong> Quand le catalogue grossit, ton prix ne bouge pas.
              </span>
            </p>
            <Link
              href="/tools"
              className={`group inline-flex items-center gap-1.5 text-sm font-semibold ${cls.ctaText} ${cls.ctaHover} transition-colors whitespace-nowrap`}
            >
              Voir tous les outils de la suite
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
