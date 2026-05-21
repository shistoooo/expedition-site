"use client";

import { motion } from "framer-motion";
import { Briefcase, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

type Persona = {
  icon: typeof Briefcase;
  tag: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  accent: "purple" | "cyan";
};

const personas: Persona[] = [
  {
    icon: Briefcase,
    tag: "Tu montes pour les autres",
    title: "Pour les monteurs freelance",
    description:
      "Tu montes 5 à 10 vidéos YouTube par mois pour des clients. TubeForge te fait gagner 30 minutes à 1 heure par projet. À ton tarif horaire, l'abonnement est rentabilisé dès le premier mois.",
    href: "/monteurs",
    cta: "Voir la version monteur",
    accent: "purple",
  },
  {
    icon: Sparkles,
    tag: "Tu montes ton propre contenu",
    title: "Pour les créateurs YouTube",
    description:
      "Tu montes toi-même tes vidéos sur Premiere ou DaVinci. TubeForge fluidifie ton workflow et te permet de te concentrer sur ce qui compte vraiment : ton contenu.",
    href: "/createurs",
    cta: "Voir la version créateur",
    accent: "cyan",
  },
];

const accentClasses: Record<Persona["accent"], { glow: string; ring: string; iconBg: string; icon: string; cta: string }> = {
  purple: {
    glow: "from-purple-500/15 via-violet-500/8 to-transparent",
    ring: "hover:border-purple-400/40 hover:shadow-[0_30px_60px_-30px_rgba(139,92,246,0.45)]",
    iconBg: "bg-purple-500/10 border-purple-500/25",
    icon: "text-purple-300",
    cta: "text-purple-200 hover:text-purple-100",
  },
  cyan: {
    glow: "from-cyan-500/15 via-sky-500/8 to-transparent",
    ring: "hover:border-cyan-400/40 hover:shadow-[0_30px_60px_-30px_rgba(34,211,238,0.45)]",
    iconBg: "bg-cyan-500/10 border-cyan-500/25",
    icon: "text-cyan-300",
    cta: "text-cyan-200 hover:text-cyan-100",
  },
};

export default function HomePersonas() {
  return (
    <section className="pt-20 md:pt-28 pb-16 md:pb-20 relative">
      <div className="container-main">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-white/50 mb-3 flex items-center justify-center gap-2">
            <span className="w-3 h-px bg-white/30 inline-block" />
            Pour qui c&apos;est
            <span className="w-3 h-px bg-white/30 inline-block" />
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-[-0.02em] text-white/90 leading-tight">
            Tu te reconnais dans <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">l&apos;un des deux</span>&nbsp;?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {personas.map((p, i) => {
            const cls = accentClasses[p.accent];
            return (
              <motion.div
                key={p.href}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: easeOutExpo }}
                className="group relative"
              >
                {/* Glow background */}
                <div
                  className={`absolute -inset-1 rounded-3xl bg-gradient-to-br ${cls.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                <Link
                  href={p.href}
                  className={`relative flex flex-col h-full p-7 md:p-9 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all duration-300 ${cls.ring}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${cls.iconBg}`}>
                    <p.icon className={`w-5 h-5 ${cls.icon}`} />
                  </div>

                  <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-3">
                    {p.tag}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-black tracking-[-0.02em] text-white mb-4 leading-tight">
                    {p.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed mb-8 flex-1">
                    {p.description}
                  </p>

                  <span
                    className={`inline-flex items-center gap-1.5 text-sm font-semibold ${cls.cta} transition-colors mt-auto`}
                  >
                    {p.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
