"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageBackground from "@/components/PageBackground";
import TubeForgeSection from "@/components/TubeForgeSection";
import ToolsSection from "@/components/ToolsSection";
import ReviewForgeSection from "@/components/ReviewForgeSection";
import HomePricing from "@/components/HomePricing";
import Footer from "@/components/Footer";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ToolsShowcasePage() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden relative text-white">
      <PageBackground />
      <Navbar />

      <main className="w-full relative z-10">
        {/* Hero */}
        <section className="pt-28 pb-12 md:pt-36 md:pb-16 relative overflow-hidden">
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.18) 0%, rgba(34,211,238,0.08) 40%, transparent 75%)",
              filter: "blur(2px)",
            }}
          />
          <div className="container-main relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs md:text-sm font-medium mb-6 backdrop-blur-sm">
                <Rocket className="w-3 h-3" />
                <span>La suite Exp&eacute;dition &mdash; en construction</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] leading-[1.05] mb-6">
                Tous les outils.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-cyan-300">
                  Un seul abonnement.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/55 leading-relaxed max-w-2xl mx-auto">
                TubeForge est le premier outil dispo. ClipForge et ReviewForge arrivent dans la foul&eacute;e.
                Ton abonnement les couvre d&eacute;j&agrave; &mdash; et ton tarif reste bloqu&eacute; &agrave; vie.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/pricing"
                  className="group px-7 py-3.5 rounded-xl bg-white text-black font-bold text-base transition-all duration-200 flex items-center gap-2 border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_24px_rgba(139,92,246,0.25)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_12px_40px_rgba(139,92,246,0.4)] hover:translate-y-[-1px]"
                >
                  Voir les tarifs
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  href="/demo"
                  className="group px-6 py-3.5 rounded-xl bg-white/5 text-white/85 font-semibold text-base transition-all duration-200 flex items-center gap-2 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
                >
                  Voir la d&eacute;mo TubeForge
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* TubeForge */}
        <TubeForgeSection />

        {/* ClipForge + ReviewForge */}
        <section className="pt-8 md:pt-12 pb-16 md:pb-20 relative bg-[#06051a]/80">
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
                Vague 2 &mdash; En cours de d&eacute;veloppement
                <span className="w-3 h-px bg-white/30 inline-block" />
              </p>
              <h2 className="text-3xl md:text-5xl font-black tracking-[-0.02em] leading-tight">
                Les{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-cyan-300">
                  deux prochains
                </span>{" "}
                outils de la suite.
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              <ToolsSection />
              <ReviewForgeSection />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <HomePricing />
      </main>

      <Footer />
    </div>
  );
}
