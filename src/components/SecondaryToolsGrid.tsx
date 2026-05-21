"use client";

import { motion } from "framer-motion";
import ToolsSection from "@/components/ToolsSection";
import ReviewForgeSection from "@/components/ReviewForgeSection";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function SecondaryToolsGrid() {
  return (
    <section className="pt-20 md:pt-28 pb-16 md:pb-20 relative bg-[#06051a]/80">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-center mb-12 md:mb-16 max-w-3xl mx-auto"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-white/50 mb-3 flex items-center justify-center gap-2">
            <span className="w-3 h-px bg-white/30 inline-block" />
            L&apos;aventure ne s&apos;arr&ecirc;te pas l&agrave;
            <span className="w-3 h-px bg-white/30 inline-block" />
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-[-0.02em] text-white/90 leading-tight mb-5">
            La <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-cyan-300">suite Exp&eacute;dition</span> grandit chaque semaine.
          </h2>
          <p className="text-base md:text-lg text-white/55 leading-relaxed">
            TubeForge est le premier outil de la suite. ClipForge et ReviewForge arrivent dans la foul&eacute;e&nbsp;&mdash; et ton abonnement les couvre d&eacute;j&agrave;.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          <ToolsSection />
          <ReviewForgeSection />
        </div>
      </div>
    </section>
  );
}
