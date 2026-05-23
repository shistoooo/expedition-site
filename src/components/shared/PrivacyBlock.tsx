"use client";

import { motion } from "framer-motion";
import { ShieldCheck, HardDrive, Eye, RefreshCw } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Accent = "purple" | "cyan";

const accentClasses: Record<Accent, { text: string; bg: string; border: string; gradient: string; glow: string }> = {
  purple: {
    text: "text-purple-300",
    bg: "bg-purple-500/10",
    border: "border-purple-500/25",
    gradient: "from-purple-300 via-violet-200 to-purple-300",
    glow: "rgba(139,92,246,0.16)",
  },
  cyan: {
    text: "text-cyan-300",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/25",
    gradient: "from-cyan-300 via-sky-200 to-cyan-300",
    glow: "rgba(34,211,238,0.16)",
  },
};

type PrivacyBlockProps = {
  accent?: Accent;
};

export default function PrivacyBlock({ accent = "purple" }: PrivacyBlockProps) {
  const cls = accentClasses[accent];

  const items = [
    {
      icon: HardDrive,
      title: "100% local",
      desc: "Tes téléchargements, ton historique et tes projets restent sur ta machine. Aucun upload sur nos serveurs.",
    },
    {
      icon: Eye,
      title: "Zéro tracking de contenu",
      desc: "On ne sait pas quelles vidéos tu télécharges, ni pour quel client, ni pour quelle chaîne.",
    },
    {
      icon: RefreshCw,
      title: "Annulation 1 clic",
      desc: "Pas d'engagement. Tu coupes quand tu veux depuis ton espace compte. Aucune friction.",
    },
  ];

  return (
    <section className="py-16 md:py-20 relative">
      <div className="container-main max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12 overflow-hidden"
        >
          {/* Glow */}
          <div
            className="absolute -top-20 -right-20 w-[400px] h-[400px] pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${cls.glow} 0%, transparent 70%)`,
              filter: "blur(40px)",
            }}
          />

          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10 mb-10">
              <div className={`w-14 h-14 rounded-xl ${cls.bg} border ${cls.border} flex items-center justify-center shrink-0`}>
                <ShieldCheck className={`w-7 h-7 ${cls.text}`} />
              </div>
              <div className="flex-1">
                <p className={`text-xs font-mono uppercase tracking-widest ${cls.text}/70 mb-2`}>
                  Confidentialit&eacute; &amp; libert&eacute;
                </p>
                <h2 className="text-2xl md:text-4xl font-black tracking-[-0.02em] leading-tight mb-3">
                  Tes vid&eacute;os restent{" "}
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${cls.gradient}`}>
                    chez toi.
                  </span>
                </h2>
                <p className="text-base md:text-lg text-white/55 leading-relaxed">
                  Pas de cloud opaque. Pas d&apos;abonnement piège. Pas d&apos;analyse de ce que tu télécharges.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item.title}
                  className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.015]"
                >
                  <div className={`w-9 h-9 rounded-lg ${cls.bg} border ${cls.border} flex items-center justify-center mb-3`}>
                    <item.icon className={`w-4 h-4 ${cls.text}`} />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1.5">{item.title}</h3>
                  <p className="text-xs md:text-[13px] text-white/50 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
