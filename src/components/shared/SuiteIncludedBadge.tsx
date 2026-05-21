"use client";

import { motion } from "framer-motion";
import { Package, Lock } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Accent = "purple" | "cyan";

const accentClasses: Record<Accent, { iconBg: string; iconBorder: string; icon: string; border: string; pingBg: string; pingDot: string; glow: string }> = {
  purple: {
    iconBg: "bg-purple-500/10",
    iconBorder: "border-purple-500/25",
    icon: "text-purple-300",
    border: "border-purple-500/20",
    pingBg: "bg-purple-400",
    pingDot: "bg-purple-500",
    glow: "rgba(139,92,246,0.12)",
  },
  cyan: {
    iconBg: "bg-cyan-500/10",
    iconBorder: "border-cyan-500/25",
    icon: "text-cyan-300",
    border: "border-cyan-500/20",
    pingBg: "bg-cyan-400",
    pingDot: "bg-cyan-500",
    glow: "rgba(34,211,238,0.12)",
  },
};

type SuiteIncludedBadgeProps = {
  accent?: Accent;
};

export default function SuiteIncludedBadge({ accent = "purple" }: SuiteIncludedBadgeProps) {
  const cls = accentClasses[accent];

  return (
    <section className="py-8 md:py-10 relative">
      <div className="container-main max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className={`relative flex flex-col md:flex-row items-center gap-4 md:gap-5 rounded-2xl border ${cls.border} bg-white/[0.02] px-5 py-4 md:px-7 md:py-5 text-left`}
          style={{
            boxShadow: `0 20px 60px -30px ${cls.glow}`,
          }}
        >
          <div className={`shrink-0 w-11 h-11 rounded-xl ${cls.iconBg} border ${cls.iconBorder} flex items-center justify-center`}>
            <Package className={`w-5 h-5 ${cls.icon}`} />
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="text-sm md:text-base font-semibold text-white leading-snug">
              1&nbsp;abonnement &nbsp;=&nbsp; TubeForge <span className="text-white/60">+ tous les futurs outils inclus</span>
            </p>
            <p className="text-xs md:text-sm text-white/45 mt-1 leading-relaxed flex items-center justify-center md:justify-start gap-1.5">
              <Lock className="w-3 h-3 inline" />
              Tarif Pionnier bloqu&eacute; &agrave; vie. Quand le catalogue grossit, ton prix ne bouge pas.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
