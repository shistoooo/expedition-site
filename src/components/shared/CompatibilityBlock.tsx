"use client";

import { motion } from "framer-motion";
import { Check, Apple, Monitor, Cpu } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Tool = "premiere" | "davinci" | "both";
type Accent = "purple" | "cyan";

const accentClasses: Record<Accent, { text: string; bg: string; border: string; gradient: string }> = {
  purple: {
    text: "text-purple-300",
    bg: "bg-purple-500/10",
    border: "border-purple-500/25",
    gradient: "from-purple-300 via-violet-200 to-purple-300",
  },
  cyan: {
    text: "text-cyan-300",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/25",
    gradient: "from-cyan-300 via-sky-200 to-cyan-300",
  },
};

type CompatibilityBlockProps = {
  accent?: Accent;
  tool?: Tool;
};

export default function CompatibilityBlock({ accent = "purple", tool = "both" }: CompatibilityBlockProps) {
  const cls = accentClasses[accent];

  const premiereSection = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-lg ${cls.bg} border ${cls.border} flex items-center justify-center`}>
          <span className={`text-sm font-black ${cls.text}`}>Pr</span>
        </div>
        <h3 className="text-xl font-black tracking-[-0.02em] text-white">Adobe Premiere Pro</h3>
      </div>
      <ul className="space-y-3 text-sm md:text-[15px] text-white/65 leading-relaxed">
        <li className="flex gap-2.5">
          <Check className={`w-4 h-4 ${cls.text} shrink-0 mt-0.5`} />
          <span>Versions <strong className="text-white">CC&nbsp;2023, 2024, 2025</strong></span>
        </li>
        <li className="flex gap-2.5">
          <Check className={`w-4 h-4 ${cls.text} shrink-0 mt-0.5`} />
          <span>Plugin natif via le panneau Extensions</span>
        </li>
        <li className="flex gap-2.5">
          <Check className={`w-4 h-4 ${cls.text} shrink-0 mt-0.5`} />
          <span>Compatible Adobe Media Encoder (AME)</span>
        </li>
        <li className="flex gap-2.5">
          <Check className={`w-4 h-4 ${cls.text} shrink-0 mt-0.5`} />
          <span>Aucun conflit avec After Effects Dynamic Link</span>
        </li>
      </ul>
    </div>
  );

  const davinciSection = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-lg ${cls.bg} border ${cls.border} flex items-center justify-center`}>
          <span className={`text-sm font-black ${cls.text}`}>DV</span>
        </div>
        <h3 className="text-xl font-black tracking-[-0.02em] text-white">DaVinci Resolve</h3>
      </div>
      <ul className="space-y-3 text-sm md:text-[15px] text-white/65 leading-relaxed">
        <li className="flex gap-2.5">
          <Check className={`w-4 h-4 ${cls.text} shrink-0 mt-0.5`} />
          <span>Versions <strong className="text-white">18.x, 19.x, 20.x</strong> (Studio &amp; Free)</span>
        </li>
        <li className="flex gap-2.5">
          <Check className={`w-4 h-4 ${cls.text} shrink-0 mt-0.5`} />
          <span>Import dans le Media Pool sans dérégler ton organisation</span>
        </li>
        <li className="flex gap-2.5">
          <Check className={`w-4 h-4 ${cls.text} shrink-0 mt-0.5`} />
          <span>N&apos;interfère ni avec Color, Fusion ni Fairlight</span>
        </li>
        <li className="flex gap-2.5">
          <Check className={`w-4 h-4 ${cls.text} shrink-0 mt-0.5`} />
          <span>Pensé DaVinci-first, pas un port de Premiere</span>
        </li>
      </ul>
    </div>
  );

  const systemSection = (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="flex items-start gap-3 p-5 rounded-xl border border-white/[0.08] bg-white/[0.015]">
        <Apple className={`w-5 h-5 ${cls.text} shrink-0 mt-0.5`} />
        <div>
          <p className="font-semibold text-white text-sm mb-0.5">macOS</p>
          <p className="text-xs text-white/45 leading-relaxed">Apple Silicon natif (M1, M2, M3, M4) &amp; Intel</p>
        </div>
      </div>
      <div className="flex items-start gap-3 p-5 rounded-xl border border-white/[0.08] bg-white/[0.015]">
        <Monitor className={`w-5 h-5 ${cls.text} shrink-0 mt-0.5`} />
        <div>
          <p className="font-semibold text-white text-sm mb-0.5">Windows</p>
          <p className="text-xs text-white/45 leading-relaxed">10 &amp; 11, x64</p>
        </div>
      </div>
      <div className="flex items-start gap-3 p-5 rounded-xl border border-white/[0.08] bg-white/[0.015]">
        <Cpu className={`w-5 h-5 ${cls.text} shrink-0 mt-0.5`} />
        <div>
          <p className="font-semibold text-white text-sm mb-0.5">Léger</p>
          <p className="text-xs text-white/45 leading-relaxed">~80&nbsp;Mo RAM en idle, GPU optionnel</p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 md:py-20 relative">
      <div className="container-main max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-center mb-10 md:mb-14"
        >
          <p className={`text-xs font-mono uppercase tracking-widest ${cls.text}/70 mb-3`}>
            Compatibilit&eacute;
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05]">
            On marche avec{" "}
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${cls.gradient}`}>
              ta config exacte.
            </span>
          </h2>
          <p className="text-base md:text-lg text-white/55 mt-4 max-w-2xl mx-auto leading-relaxed">
            Pas de surprise &agrave; l&apos;installation. Versions support&eacute;es list&eacute;es, OS d&eacute;tect&eacute; automatiquement.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
          className="space-y-5"
        >
          {(tool === "premiere" || tool === "both") && premiereSection}
          {(tool === "davinci" || tool === "both") && davinciSection}
          {systemSection}
        </motion.div>
      </div>
    </section>
  );
}
