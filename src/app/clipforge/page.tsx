"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Play, MessageCircle, Sparkles, TrendingUp, ScanFace, Type } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageBackground from "@/components/PageBackground";
import Footer from "@/components/Footer";
import DemoPlayer from "@/components/DemoPlayer";
import ClipForgeMockup from "@/components/mockups/ClipForgeMockup";
import SuiteRoadmap from "@/components/shared/SuiteRoadmap";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.com/invite/QuV3bYDEYT";

// ID YouTube de la démo ClipForge (https://youtu.be/fFndGIIxUhw).
// Si vide, un encart "démo bientôt" s'affiche à la place.
const CLIPFORGE_VIDEO_ID = "fFndGIIxUhw";

const FEATURES = [
  { icon: Sparkles, title: "L'IA trouve tes meilleurs moments", desc: "Analyse spécialisée selon ton contenu : gaming, podcast, tuto, vlog." },
  { icon: TrendingUp, title: "Score de viralité, hook et rétention", desc: "Chaque clip est noté sur 100. Tu vois quels extraits vont performer." },
  { icon: ScanFace, title: "Recadrage intelligent qui suit le visage", desc: "Le cadrage 9:16 suit ton visage frame par frame, sans saccade." },
  { icon: Type, title: "Sous-titres animés, éditables", desc: "4 styles, couleurs personnalisables, éditeur intégré." },
];

export default function ClipForgePage() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden relative text-white">
      <PageBackground />
      <Navbar />

      <main className="w-full relative z-10">
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="pt-28 md:pt-36 pb-10 md:pb-14 relative">
          <div className="container-main max-w-3xl mx-auto text-center">
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/80 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Toute la suite
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
            >
              <p className="text-xs font-mono uppercase tracking-widest text-indigo-300/70 mb-5 flex items-center justify-center gap-2">
                <span className="w-3 h-px bg-indigo-400/50 inline-block" />
                Vague 2 &mdash; En développement
                <span className="w-3 h-px bg-indigo-400/50 inline-block" />
              </p>

              <h1 className="text-5xl md:text-7xl font-black tracking-[-0.03em] mb-4">
                Clip<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Forge</span>
              </h1>
              <p className="text-sm text-white/35 mb-5 font-mono uppercase tracking-wider">
                L&apos;alternative à OpusClip
              </p>
              <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto mb-8">
                Colle un lien. ClipForge trouve les moments viraux, recadre sur le visage, sous-titre et exporte tes clips prêts à poster.
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-400/25 text-indigo-200 text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
                </span>
                En développement actif &mdash; inclus dans l&apos;abonnement Pionnier
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── VIDÉO ────────────────────────────────────────────────────── */}
        <section className="pt-2 pb-16 md:pb-24 relative">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: easeOutExpo }}
              className="max-w-4xl mx-auto relative"
            >
              <div
                className="absolute -inset-8 pointer-events-none opacity-70"
                style={{
                  background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(99,102,241,0.20) 0%, rgba(139,92,246,0.10) 40%, transparent 75%)",
                  filter: "blur(40px)",
                }}
              />
              <div
                className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40"
                style={{ boxShadow: "0 20px 60px -15px rgba(99,102,241,0.35)" }}
              >
                <div className="aspect-video w-full">
                  {CLIPFORGE_VIDEO_ID ? (
                    <DemoPlayer videoId={CLIPFORGE_VIDEO_ID} title="ClipForge — démo du générateur de clips" />
                  ) : (
                    /* Slot temporaire en attendant l'ID de la vidéo */
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-center px-6">
                      <span className="w-16 h-16 rounded-full bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center">
                        <Play className="w-7 h-7 text-indigo-300 ml-0.5" />
                      </span>
                      <p className="text-white/70 font-semibold">La démo ClipForge arrive très vite</p>
                      <p className="text-white/35 text-sm max-w-sm">
                        On finit le montage. En attendant, le rendu ci-dessous est l&apos;interface réelle.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CE QUE ÇA FAIT (features + mockup réel) ──────────────────── */}
        <section className="pb-16 md:pb-24 relative">
          <div className="container-main">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
              {/* Mockup */}
              <div className="group relative w-full lg:flex-[1.3] transition-all duration-500 hover:-translate-y-1">
                <div
                  className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] rounded-full pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.16) 0%, rgba(139,92,246,0.08) 35%, transparent 70%)",
                    filter: "blur(80px)",
                  }}
                />
                <ClipForgeMockup />
              </div>

              {/* Texte + features */}
              <div className="w-full lg:flex-1 text-left">
                <h2 className="text-2xl md:text-3xl font-black tracking-[-0.02em] mb-6">
                  Ce que ClipForge fait pour toi
                </h2>
                <ul className="space-y-5">
                  {FEATURES.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.08, ease: easeOutExpo }}
                      className="flex gap-3.5"
                    >
                      <div className="mt-0.5 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                        <item.icon className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-base">{item.title}</h3>
                        <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── OÙ ON EN EST (feuille de route) ──────────────────────────── */}
        <SuiteRoadmap highlight="clipforge" />

        {/* ── CTA FINAL ────────────────────────────────────────────────── */}
        <section className="py-16 md:py-24 relative">
          <div className="container-main max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black tracking-[-0.02em] mb-4">
              Bloque ton tarif avant ClipForge
            </h2>
            <p className="text-base md:text-lg text-white/55 leading-relaxed mb-8">
              En rejoignant la Vague Pionnier aujourd&apos;hui, tu profites de TubeForge tout de suite &mdash; et ClipForge te rejoindra sans un centime de plus.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/pricing"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-black font-bold text-sm border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_24px_rgba(99,102,241,0.25)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_12px_40px_rgba(99,102,241,0.4)] transition-all duration-200 hover:translate-y-[-1px] active:translate-y-[1px]"
              >
                Réserver ma place &mdash; tarif bloqué à vie
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#5865F2]/10 text-[#a5b4fc] font-semibold text-sm border border-[#5865F2]/25 hover:bg-[#5865F2]/20 hover:text-white hover:border-[#5865F2]/40 transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4" />
                Une question ? Discord
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
