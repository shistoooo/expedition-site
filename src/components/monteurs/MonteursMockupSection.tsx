"use client";

import { motion } from "framer-motion";
import TubeForgeMockup from "@/components/mockups/TubeForgeMockup";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function MonteursMockupSection() {
  return (
    <section className="pt-8 pb-16 md:pt-12 md:pb-24 relative section-fade-top">
      <div className="container-main max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-center mb-10"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-red-400/60 mb-4 flex items-center justify-center gap-2">
            <span className="w-3 h-px bg-red-400/50 inline-block" />
            Vague 1 — Disponible maintenant
            <span className="w-3 h-px bg-red-400/50 inline-block" />
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-[-0.03em] mb-4">
            TubeForge,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              l&apos;outil qui remplace 4K Video Downloader
            </span>
            .
          </h2>
          <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Téléchargez en 4K, découpez l&apos;extrait exact, importez votre script.{" "}
            <span className="text-white/75">En quelques secondes.</span>
          </p>
        </motion.div>

        {/* Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: easeOutExpo }}
          className="relative max-w-2xl mx-auto"
        >
          {/* Red-orange nebula glow */}
          <div
            className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[90%] h-[70%] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, rgba(239,68,68,0.14) 0%, rgba(249,115,22,0.07) 35%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <TubeForgeMockup />
        </motion.div>
      </div>
    </section>
  );
}
