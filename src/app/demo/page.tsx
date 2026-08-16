"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageBackground from "@/components/PageBackground";
import DemoPlayer from "@/components/DemoPlayer";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function DemoPage() {
  return (
    <div className="w-full min-h-screen overflow-x-clip relative text-white">
      <PageBackground />
      <Navbar />

      <main className="w-full relative z-10 pt-28 md:pt-36 pb-20 md:pb-28">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            className="max-w-5xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-10 md:mb-14">
              <p className="text-xs font-mono uppercase tracking-widest text-purple-300/70 mb-3 flex items-center justify-center gap-2">
                <span className="w-3 h-px bg-purple-300/50 inline-block" />
                La vid&eacute;o de d&eacute;mo
                <span className="w-3 h-px bg-purple-300/50 inline-block" />
              </p>
              <h1 className="text-3xl md:text-5xl font-black tracking-[-0.02em] text-white/90 leading-tight mb-4">
                Tu colles un lien.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
                  &Ccedil;a atterrit dans ta timeline.
                </span>
              </h1>
              <p className="text-base md:text-lg text-white/55 max-w-2xl mx-auto leading-relaxed">
                T&eacute;l&eacute;charge directement toutes les vid&eacute;os d&apos;internet dont t&apos;as besoin pour tes montages, dans Premiere et DaVinci. Et plus encore &mdash; 7 minutes pour voir comment.
              </p>
            </div>

            {/* Player */}
            <div className="relative mb-12">
              {/* Glow nebula behind the player */}
              <div
                className="absolute -inset-10 pointer-events-none opacity-70"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(139,92,246,0.25) 0%, rgba(34,211,238,0.12) 40%, transparent 75%)",
                  filter: "blur(40px)",
                }}
              />

              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_80px_-20px_rgba(139,92,246,0.45)] bg-black/40">
                <div className="aspect-video w-full">
                  <DemoPlayer videoId="XEPdAhDYkB8" autoplay />
                </div>
              </div>
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: easeOutExpo }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Link
                href="/pricing"
                className="group px-8 py-4 rounded-xl bg-white text-black font-bold text-base transition-all duration-200 flex items-center gap-2 border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_24px_rgba(139,92,246,0.25)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_12px_40px_rgba(139,92,246,0.4)] hover:translate-y-[-1px] active:translate-y-[1px]"
              >
                Voir les tarifs
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                href="/"
                className="group px-7 py-4 rounded-xl bg-white/5 text-white/85 font-semibold text-base transition-all duration-200 flex items-center gap-2 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                Retour &agrave; la home
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
