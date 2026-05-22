"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import ToolsSection from "@/components/ToolsSection";
import ReviewForgeSection from "@/components/ReviewForgeSection";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Accent = "purple" | "cyan";

const accentClasses: Record<Accent, { gradient: string; ctaText: string; ctaHover: string }> = {
  purple: {
    gradient: "from-purple-300 to-cyan-300",
    ctaText: "text-purple-300",
    ctaHover: "hover:text-purple-200",
  },
  cyan: {
    gradient: "from-cyan-300 to-purple-300",
    ctaText: "text-cyan-300",
    ctaHover: "hover:text-cyan-200",
  },
};

type SuitePreviewSectionProps = {
  accent?: Accent;
};

export default function SuitePreviewSection({ accent = "purple" }: SuitePreviewSectionProps) {
  const cls = accentClasses[accent];

  return (
    <section className="pt-16 md:pt-24 pb-12 md:pb-16 relative bg-[#06051a]/80">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-center mb-10 md:mb-14 max-w-3xl mx-auto"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-white/50 mb-3">
            Tu n&apos;ach&egrave;tes pas un outil
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-[-0.02em] leading-tight mb-4">
            Tu rejoins{" "}
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${cls.gradient}`}>
              un launcher.
            </span>
          </h2>
          <p className="text-base md:text-lg text-white/55 leading-relaxed">
            TubeForge est dispo aujourd&apos;hui. ClipForge et ReviewForge arrivent dans la foul&eacute;e &mdash;
            <span className="text-white/80"> ton abonnement les couvre d&eacute;j&agrave;.</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          <ToolsSection />
          <ReviewForgeSection />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: easeOutExpo }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center"
        >
          <p className="text-base md:text-lg text-white/65 flex items-center gap-2.5 leading-relaxed">
            <Lock className="w-5 h-5 shrink-0" />
            <span>
              <strong className="text-white">Tarif Pionnier bloqué à vie.</strong> Le catalogue grossit, ton prix ne bouge pas.
            </span>
          </p>
          <Link
            href="/tools"
            className={`group inline-flex items-center gap-2 text-base md:text-lg font-semibold ${cls.ctaText} ${cls.ctaHover} transition-colors whitespace-nowrap`}
          >
            Voir tous les outils
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
