"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  MessageCircle,
  MousePointerClick,
  Lightbulb,
  Tags,
  Users2,
  CloudUpload,
  Sparkles,
  Rocket,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.com/invite/QuV3bYDEYT";
const REGISTER_URL = "/account?mode=register";
const INSTALL_URL = "https://swipeforge-sync.expedition-studio.workers.dev/download/firefox";

const AMBER = "#FFB627";

const FEATURES = [
  {
    icon: MousePointerClick,
    title: "Capture en 1 clic sur YouTube",
    desc: "Vignette, titre, chaîne, vues — tout est récupéré directement depuis la page que tu regardes, sans copier-coller.",
  },
  {
    icon: Lightbulb,
    title: "Exemples ↔ Leviers",
    desc: "Chaque capture rejoint ta bibliothèque d'exemples. Tu l'associes au levier psychologique qui la fait cliquer : curiosité, urgence, second degré…",
  },
  {
    icon: Tags,
    title: "Tags de forme",
    desc: "Gros visage, gros chiffre, flèche, question — tague ce qui compose la miniature pour retrouver le bon pattern au bon moment.",
  },
  {
    icon: Users2,
    title: "Profils de chaîne & tes propres vidéos",
    desc: "Garde des notes par chaîne que tu suis, et fais le même travail sur tes propres vidéos pour comprendre ce qui a marché ou pas.",
  },
  {
    icon: CloudUpload,
    title: "Sync cloud & collections d'équipe",
    desc: "Connecté avec Discord, ta bibliothèque te suit partout. Crée une collection partagée avec ton équipe, par invitation.",
  },
];

export default function SwipeForgePage() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden relative text-white">
      {/* Fond ambre — scopé à cette page (ne touche pas PageBackground global) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[2]" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,182,39,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,182,39,0.35) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[150px]"
          style={{ background: "rgba(255,182,39,0.09)" }}
        />
        {/* Les vraies étoiles animées viennent de GlobalSpace (densité réduite pour /swipeforge) */}
        {/* Assombrit légèrement le fond (~30%) pour calmer le décor derrière le contenu */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

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
              <div className="flex justify-center mb-6">
                <Image src="/logos/swipeforge.svg" alt="SwipeForge" width={64} height={64} className="rounded-2xl" priority />
              </div>

              <p
                className="text-xs font-mono uppercase tracking-widest mb-5 flex items-center justify-center gap-2"
                style={{ color: "rgba(255,182,39,0.75)" }}
              >
                <span className="w-3 h-px inline-block" style={{ background: "rgba(255,182,39,0.5)" }} />
                Extension Firefox &mdash; Gratuite
                <span className="w-3 h-px inline-block" style={{ background: "rgba(255,182,39,0.5)" }} />
              </p>

              <h1 className="text-5xl md:text-7xl font-black tracking-[-0.03em] mb-4">
                Swipe<span style={{ color: AMBER }}>Forge</span>
              </h1>
              <p className="text-sm text-white/35 mb-5 font-mono uppercase tracking-wider">
                Ton swipe file de packaging YouTube
              </p>
              <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto mb-8">
                Collecte vignettes, titres et chaînes en un clic pendant que tu regardes YouTube.
                Comprends ce qui fait cliquer, retrouve-le pour ton prochain packaging.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={INSTALL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm border shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-all duration-200 hover:translate-y-[-1px] active:translate-y-[1px]"
                  style={{
                    background: AMBER,
                    color: "#2a1c00",
                    borderColor: "rgba(255,182,39,0.6)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 8px 24px rgba(255,182,39,0.25)",
                  }}
                >
                  <Download className="w-4 h-4" />
                  T&eacute;l&eacute;charger SwipeForge
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </a>
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#5865F2]/10 text-[#a5b4fc] font-semibold text-sm border border-[#5865F2]/25 hover:bg-[#5865F2]/20 hover:text-white hover:border-[#5865F2]/40 transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  Rejoindre le Discord
                </a>
              </div>
              <p className="text-xs text-white/30 mt-4">
                Installe l&apos;extension, connecte-toi avec Discord &mdash; c&apos;est tout.{" "}
                <Link href="/account" className="underline underline-offset-2 hover:text-white/50 transition-colors">
                  D&eacute;j&agrave; abonn&eacute; Exp&eacute;dition ?
                </Link>
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── CE QUE ÇA FAIT ───────────────────────────────────────────── */}
        <section className="pb-16 md:pb-24 relative">
          <div className="container-main max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black tracking-[-0.02em] mb-10 text-center">
              Ce que SwipeForge fait pour toi
            </h2>
            <ul className="space-y-6">
              {FEATURES.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: easeOutExpo }}
                  className="flex gap-4"
                >
                  <div
                    className="mt-0.5 w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border"
                    style={{ background: "rgba(255,182,39,0.08)", borderColor: "rgba(255,182,39,0.25)" }}
                  >
                    <item.icon className="w-4.5 h-4.5" style={{ color: AMBER }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base mb-1">{item.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── ACCÈS & PRIX ─────────────────────────────────────────────── */}
        <section className="pb-16 md:pb-24 relative">
          <div className="container-main max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
              className="rounded-2xl border p-8 md:p-10 text-center"
              style={{ borderColor: "rgba(255,182,39,0.25)", background: "rgba(255,182,39,0.04)" }}
            >
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-5"
                style={{ background: "rgba(255,182,39,0.15)", color: AMBER }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Gratuit
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-[-0.02em] mb-4">
                Gratuit pour les premiers membres du Discord
              </h2>
              <p className="text-white/55 leading-relaxed mb-2">
                SwipeForge est offert aux 30 premiers membres actifs du Discord Expédition. La place se prend en
                rejoignant le serveur et en te connectant avec ton compte Discord &mdash; aucune carte requise.
              </p>
              <p className="text-white/55 leading-relaxed mb-6">
                Une fois les places prises, les nouveaux arrivants passent en liste d&apos;attente et sont notifiés
                dès qu&apos;une place se libère. <strong className="text-white/80">Les abonnés Expédition, eux, ont un accès
                illimité immédiat</strong> &mdash; sans rien payer de plus.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#5865F2] text-white font-semibold text-sm hover:bg-[#4752C4] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Rejoindre le Discord
                </a>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 text-white/70 hover:text-white hover:border-white/30 font-semibold text-sm transition-colors"
                >
                  Voir les abonnements Expédition
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CTA FINAL ────────────────────────────────────────────────── */}
        <section className="py-16 md:py-24 relative">
          <div className="container-main max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black tracking-[-0.02em] mb-4">
              Installe SwipeForge et commence &agrave; collecter
            </h2>
            <p className="text-base md:text-lg text-white/55 leading-relaxed mb-8">
              Deux minutes d&apos;installation, et ta biblioth&egrave;que de packaging d&eacute;marre pendant que tu
              regardes YouTube normalement.
            </p>
            <a
              href={INSTALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm border shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-all duration-200 hover:translate-y-[-1px] active:translate-y-[1px]"
              style={{
                background: AMBER,
                color: "#2a1c00",
                borderColor: "rgba(255,182,39,0.6)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 8px 24px rgba(255,182,39,0.25)",
              }}
            >
              <Download className="w-4 h-4" />
              T&eacute;l&eacute;charger SwipeForge
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
          </div>
        </section>

        {/* ── CROSS-SELL TUBEFORGE (discret, hors chemin critique) ──────── */}
        <section className="pb-16 md:pb-24 relative">
          <div className="container-main max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-6 py-5">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <Rocket className="w-5 h-5 text-purple-400 shrink-0" />
                <p className="text-sm text-white/50">
                  Tu es sur Exp&eacute;dition ? Essaie aussi{" "}
                  <span className="text-white/80 font-semibold">TubeForge</span> &mdash; 3 jours gratuits, sans carte.
                </p>
              </div>
              <Link
                href={REGISTER_URL}
                className="shrink-0 text-sm font-semibold text-purple-300 hover:text-purple-200 transition-colors inline-flex items-center gap-1"
              >
                D&eacute;couvrir
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
