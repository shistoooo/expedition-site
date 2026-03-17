"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Download, Rocket, Layers, Sparkles, Terminal, Hammer, Palette, Brain, FileCheck, Languages, Youtube, ArrowRight, RefreshCw, Shield, Scissors, Captions, Video, Wand2, Zap, ListVideo, Search, FolderOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import DownloadButtons from "@/components/DownloadButtons";

// Status visual config — each state has its own color language so users
// immediately parse the roadmap without reading the label.
const STATUS_CONFIG: Record<string, { label: string; dotColor: string; badgeBg: string; badgeBorder: string; badgeText: string; barColor: string; barWidth: string }> = {
  "En développement": {
    label: "En développement",
    dotColor: "bg-amber-400",
    badgeBg: "bg-amber-500/10",
    badgeBorder: "border-amber-500/30",
    badgeText: "text-amber-400",
    barColor: "bg-amber-400/60",
    barWidth: "w-2/3",
  },
  "En conception": {
    label: "En conception",
    dotColor: "bg-blue-400",
    badgeBg: "bg-blue-500/10",
    badgeBorder: "border-blue-500/30",
    badgeText: "text-blue-400",
    barColor: "bg-blue-400/60",
    barWidth: "w-1/3",
  },
  "Concept": {
    label: "Concept",
    dotColor: "bg-white/30",
    badgeBg: "bg-white/5",
    badgeBorder: "border-white/10",
    badgeText: "text-white/30",
    barColor: "bg-white/20",
    barWidth: "w-[15%]",
  },
  "Bientôt disponible": {
    label: "Bientôt disponible",
    dotColor: "bg-green-400",
    badgeBg: "bg-green-500/10",
    badgeBorder: "border-green-500/30",
    badgeText: "text-green-400",
    barColor: "bg-green-400/60",
    barWidth: "w-5/6",
  },
};

const roadmapTools = [
  {
    name: "Correction de Sous-titres",
    desc: "Importez vos .srt : l'IA corrige l'orthographe et reformule les phrases mal comprises.",
    status: "Bientôt disponible",
    icon: FileCheck,
    color: "text-emerald-400"
  },
  {
    name: "Optimiseur de Titres",
    desc: "Analyse vos titres via des leviers psychologiques et compare avec les meilleures vidéos de votre niche.",
    status: "En conception",
    icon: Brain,
    color: "text-purple-400"
  },
  {
    name: "TikTok Repurpose",
    desc: "Importez des TikToks, traduction FR automatique, analyse des facteurs de succès et création de contenus.",
    status: "En développement",
    icon: Languages,
    color: "text-pink-400"
  },
  {
    name: "YouTube Repurpose",
    desc: "Les mêmes fonctionnalités pour YouTube : traduction, analyse et création de contenus.",
    status: "En conception",
    icon: Youtube,
    color: "text-orange-400"
  },
  {
    name: "ThumbCraft",
    desc: "Créez des miniatures avec l'aide de l'IA pour améliorer vos taux de clics.",
    status: "Bientôt disponible",
    icon: Palette,
    color: "text-blue-400"
  },
  {
    name: "AssetStore",
    desc: "Bibliothèque partagée de sons, musiques et overlays libres de droits.",
    status: "Concept",
    icon: Layers,
    color: "text-orange-400"
  }
];

const sellingPoints = [
  {
    icon: RefreshCw,
    title: "Mises à jour automatiques",
    description: "Vos outils se mettent à jour en arrière-plan. Toujours la dernière version, sans effort."
  },
  {
    icon: Layers,
    title: "Tous vos outils, un seul endroit",
    description: "TubeForge, ClipForge, ReviewForge et tous les futurs outils accessibles depuis une interface unique."
  },
  {
    icon: Shield,
    title: "Licence unifiée",
    description: "Un seul abonnement pour tout débloquer. Connectez-vous et c'est parti."
  }
];

// Easing used project-wide: easeOutExpo — tuple type required by framer-motion
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function LauncherPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen text-white selection:bg-blue-500/30 font-sans relative">
      <PageBackground />
      <Navbar />

      <main className="relative z-10 overflow-hidden pt-24">

        {/* ─── Hero Section ──────────────────────────────────────────────────── */}
        <section className="relative pt-24 pb-32 md:pt-36 md:pb-40 container-main">

          {/* Ambient nebula — blue glow anchored to hero, bleeds into next section */}
          <div
            aria-hidden="true"
            className="absolute -top-32 -right-48 w-[700px] h-[700px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(37,99,235,0.18) 0%, rgba(37,99,235,0.06) 40%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="flex-1 text-left z-10"
            >
              {/* Status badge */}
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-8"
              >
                <Terminal className="w-3 h-3" />
                <span>SYSTEM_READY_V1.0.0</span>
                {/* Blinking status dot */}
                <span
                  aria-hidden="true"
                  className="w-1.5 h-1.5 rounded-full bg-blue-400 ml-1"
                  style={{ animation: shouldReduceMotion ? "none" : "launcher-blink 1.4s ease-in-out infinite" }}
                />
              </motion.div>

              {/* Title — pushed to text-8xl on desktop for maximum dramatic weight */}
              <h1
                className="font-bold mb-6 tracking-tighter leading-[0.92] font-display"
                style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)" }}
              >
                COMMAND{" "}
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(105deg, #60a5fa 0%, #38bdf8 50%, #93c5fd 100%)" }}
                >
                  CENTER
                </span>
              </h1>

              <p className="text-lg text-white/45 mb-12 max-w-xl leading-relaxed">
                Centralisez votre flux de production. Accédez à tous les outils Expedition, gérez vos mises à jour et découvrez les nouveautés depuis une interface unique.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <DownloadButtons 
                  macUrl="https://api.clipapp.uk/downloads/launcher-install/macos"
                  windowsUrl="https://api.clipapp.uk/downloads/launcher-install/windows"
                  macFallbackPath=""
                  windowsFallbackPath=""
                  accentColor="blue"
                />
              </div>
            </motion.div>

            {/* Right Mockup — Command Center */}
            <motion.div
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.94, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8, ease: EASE }}
              className="flex-1 w-full relative"
            >
              {/* Outer glow ring — gives mockup a floating-in-space quality */}
              <div
                aria-hidden="true"
                className="absolute -inset-8 rounded-2xl pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at 60% 40%, rgba(37,99,235,0.18) 0%, transparent 60%)",
                  filter: "blur(24px)",
                }}
              />

              <div
                className="relative rounded-xl border overflow-hidden aspect-[4/3]"
                style={{
                  background: "#0F1115",
                  borderColor: "rgba(37,99,235,0.22)",
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(37,99,235,0.1)",
                }}
              >
                {/* Title bar */}
                <div
                  className="h-10 flex items-center px-4 justify-between"
                  style={{ background: "#13151A", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/30" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                    {/* Green dot with pulse — system "online" indicator */}
                    <div className="w-3 h-3 rounded-full bg-green-500/60 relative">
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-green-400"
                        style={{ animation: shouldReduceMotion ? "none" : "launcher-pulse-ring 2s ease-out infinite" }}
                      />
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-white/15 tracking-widest">EXPEDITION_OS_KERNEL</div>
                  {/* Live latency badge */}
                  <div className="text-[9px] font-mono text-green-400/50 flex items-center gap-1">
                    <span
                      className="w-1 h-1 rounded-full bg-green-400/60 inline-block"
                      style={{ animation: shouldReduceMotion ? "none" : "launcher-blink 1.8s ease-in-out infinite 0.4s" }}
                    />
                    24ms
                  </div>
                </div>

                <div className="flex h-full">
                  {/* Sidebar */}
                  <div
                    className="w-16 flex flex-col items-center py-4 gap-4"
                    style={{ background: "#0D0F13", borderRight: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    {/* Active nav item */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-blue-400 relative"
                      style={{ background: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.3)" }}
                    >
                      <Rocket className="w-5 h-5" />
                      {/* Active indicator stripe */}
                      <span
                        className="absolute -left-[1px] top-2 bottom-2 w-0.5 rounded-r"
                        style={{ background: "rgba(37,99,235,0.8)" }}
                      />
                    </div>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white/15" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <Layers className="w-5 h-5" />
                    </div>
                    <div className="mt-auto w-8 h-8 rounded-full" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }} />
                  </div>

                  {/* Main Area */}
                  <div className="flex-1 p-5 overflow-hidden" style={{ background: "#0F1115" }}>

                    {/* Welcome Banner */}
                    <div
                      className="mb-4 p-4 rounded-xl flex justify-between items-center"
                      style={{
                        background: "linear-gradient(100deg, rgba(37,99,235,0.12) 0%, rgba(139,92,246,0.08) 100%)",
                        border: "1px solid rgba(37,99,235,0.15)",
                      }}
                    >
                      <div>
                        <h3 className="text-sm font-semibold text-blue-200 mb-0.5">Bienvenue, Créateur</h3>
                        <p className="text-[11px] text-white/35">Tous les systèmes sont opérationnels.</p>
                      </div>
                      {/* Pulsing ONLINE badge */}
                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono text-green-400"
                        style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"
                          style={{ animation: shouldReduceMotion ? "none" : "launcher-blink 1.4s ease-in-out infinite" }}
                        />
                        ONLINE
                      </div>
                    </div>

                    {/* App Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* ClipForge Widget */}
                      <Link
                        href="/pricing"
                        className="p-4 rounded-xl transition-colors block relative overflow-hidden group/card"
                        style={{ background: "#16181D", border: "1px solid rgba(255,255,255,0.05)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(139,92,246,0.35)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.05)"; }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="p-1.5 rounded text-purple-400" style={{ background: "rgba(139,92,246,0.12)" }}>
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          {/* Active green dot with ring pulse */}
                          <div className="relative flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-green-500 relative z-10" />
                            <span
                              className="absolute w-4 h-4 rounded-full bg-green-500/20"
                              style={{ animation: shouldReduceMotion ? "none" : "launcher-pulse-ring 2.5s ease-out infinite" }}
                            />
                          </div>
                        </div>
                        <h4 className="font-semibold text-sm text-white/80 mb-0.5">ClipForge</h4>
                        <p className="text-[10px] text-white/25">v1.2.4 &bull; Installed</p>
                        <div className="mt-3 h-0.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full w-full rounded-full" style={{ background: "linear-gradient(90deg, #8b5cf6, #a78bfa)" }} />
                        </div>
                      </Link>

                      {/* TubeForge Widget */}
                      <Link
                        href="/pricing"
                        className="p-4 rounded-xl transition-colors block group/card"
                        style={{ background: "#16181D", border: "1px solid rgba(255,255,255,0.05)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(239,68,68,0.3)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.05)"; }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="p-1.5 rounded text-red-400" style={{ background: "rgba(239,68,68,0.1)" }}>
                            <Download className="w-3.5 h-3.5" />
                          </div>
                          <div className="relative flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-green-500 relative z-10" />
                            <span
                              className="absolute w-4 h-4 rounded-full bg-green-500/20"
                              style={{ animation: shouldReduceMotion ? "none" : "launcher-pulse-ring 2.5s ease-out infinite 0.6s" }}
                            />
                          </div>
                        </div>
                        <h4 className="font-semibold text-sm text-white/80 mb-0.5">TubeForge</h4>
                        <p className="text-[10px] text-white/25">v2.0.1 &bull; Installed</p>
                        <div className="mt-3 h-0.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full w-3/4 rounded-full" style={{ background: "linear-gradient(90deg, #ef4444, #f97316)" }} />
                        </div>
                      </Link>
                    </div>

                    {/* Console Log */}
                    <div
                      className="mt-4 p-3 rounded-lg font-mono text-[10px] leading-[1.7]"
                      style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <p className="text-white/25">&gt; Initializing core services...</p>
                      <p className="text-white/25">&gt; Connected to Expedition Network (ms: 24)</p>
                      <p style={{ color: "rgba(96,165,250,0.7)" }}>&gt; Updates found: ClipForge (patch_1.2.5)</p>
                      {/* Blinking cursor — the signature "alive" detail */}
                      <p className="text-white/40 flex items-center gap-px">
                        <span>&gt;</span>
                        <span
                          className="inline-block w-[7px] h-[12px] bg-blue-400/70 ml-1 rounded-sm"
                          style={{ animation: shouldReduceMotion ? "none" : "launcher-cursor 1.1s step-end infinite" }}
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Gradient fade transition — replaces hard border-t */}
        <div
          aria-hidden="true"
          className="w-full h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(37,99,235,0.2) 30%, rgba(139,92,246,0.15) 60%, transparent 100%)" }}
        />

        {/* ─── Selling Points ─────────────────────────────────────────────────── */}
        <section className="py-28 relative" style={{ background: "rgba(255,255,255,0.005)" }}>
          {/* Ambient left nebula */}
          <div
            aria-hidden="true"
            className="absolute top-0 -left-24 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(37,99,235,0.08) 0%, transparent 70%)", filter: "blur(32px)" }}
          />

          <div className="container-main relative">
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              className="text-center mb-16"
            >
              <p className="text-xs font-mono uppercase tracking-widest text-blue-400/60 mb-5 flex items-center justify-center gap-2">
                <span className="w-4 h-px bg-blue-400/40 inline-block" />
                Hub de contrôle
                <span className="w-4 h-px bg-blue-400/40 inline-block" />
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Pourquoi le Launcher ?</h2>
              <p className="text-white/45">Un hub centralisé pour tous vos outils de création.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {sellingPoints.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
                  className="p-7 rounded-2xl transition-all duration-300 group relative overflow-hidden"
                  style={{
                    background: "#0F0F14",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "rgba(37,99,235,0.3)";
                    el.style.boxShadow = "0 0 40px rgba(37,99,235,0.08)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "rgba(255,255,255,0.05)";
                    el.style.boxShadow = "none";
                  }}
                >
                  {/* Subtle card corner glow on hover */}
                  <div
                    aria-hidden="true"
                    className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse, rgba(37,99,235,0.12) 0%, transparent 70%)" }}
                  />
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-blue-400 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)" }}
                  >
                    <point.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white/90">{point.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{point.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gradient fade transition */}
        <div
          aria-hidden="true"
          className="w-full h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.15) 40%, rgba(37,99,235,0.12) 70%, transparent 100%)" }}
        />

        {/* ─── Available Tools ─────────────────────────────────────────────────── */}
        {/* These cards must dominate visually — they are the hero products.
            Approach: larger text, stronger border glow, gradient-tinted backgrounds,
            prominent CTA pill instead of a bare text link. */}
        <section className="py-28 relative">
          {/* Centered nebula behind the cards */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-96 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse, rgba(37,99,235,0.07) 0%, rgba(139,92,246,0.04) 40%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <div className="container-main relative">
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              className="text-center mb-16"
            >
              <p className="text-xs font-mono uppercase tracking-widest text-blue-400/60 mb-5 flex items-center justify-center gap-2">
                <span className="w-4 h-px bg-blue-400/40 inline-block" />
                Arsenal actif
                <span className="w-4 h-px bg-blue-400/40 inline-block" />
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Disponible maintenant</h2>
              <p className="text-white/45">TubeForge disponible maintenant, ClipForge et ReviewForge arrivent prochainement.</p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">

              {/* ClipForge — dominant card */}
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, ease: EASE }}
                className="p-8 rounded-2xl relative overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(15,15,18,1) 50%)",
                  border: "1px solid rgba(139,92,246,0.2)",
                  boxShadow: "0 0 60px rgba(139,92,246,0.06)",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(139,92,246,0.4)";
                  el.style.boxShadow = "0 0 80px rgba(139,92,246,0.12)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(139,92,246,0.2)";
                  el.style.boxShadow = "0 0 60px rgba(139,92,246,0.06)";
                }}
              >
                {/* Corner nebula */}
                <div
                  aria-hidden="true"
                  className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none transition-opacity duration-500"
                  style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.18) 0%, transparent 70%)", filter: "blur(20px)" }}
                />

                <div className="flex items-center gap-4 mb-6 relative">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-purple-400 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)" }}
                  >
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-0.5">ClipForge</h3>
                    <p className="text-sm text-purple-400/80">Clips verticaux en quelques clics</p>
                  </div>
                </div>

                <p className="text-white/50 text-sm mb-7 leading-relaxed">
                  Transformez vos vidéos longues en clips courts prêts pour TikTok, Shorts et Reels.
                  Collez un lien YouTube ou importez un fichier, l&apos;IA fait le reste.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    { icon: Wand2, text: "Détection des moments clés par IA" },
                    { icon: Scissors, text: "Recadrage auto 16:9 vers 9:16" },
                    { icon: Captions, text: "Sous-titres générés et stylisés" },
                    { icon: Video, text: "Export MP4 vertical optimisé" },
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 p-3 rounded-lg"
                      style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.1)" }}
                    >
                      <feature.icon className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-white/55">{feature.text}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 group/btn"
                  style={{
                    background: "rgba(139,92,246,0.15)",
                    border: "1px solid rgba(139,92,246,0.3)",
                    color: "#c4b5fd",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "rgba(139,92,246,0.25)";
                    el.style.borderColor = "rgba(139,92,246,0.5)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "rgba(139,92,246,0.15)";
                    el.style.borderColor = "rgba(139,92,246,0.3)";
                  }}
                >
                  En savoir plus
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </Link>
              </motion.div>

              {/* TubeForge — dominant card */}
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
                className="p-8 rounded-2xl relative overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, rgba(239,68,68,0.05) 0%, rgba(15,15,18,1) 50%)",
                  border: "1px solid rgba(239,68,68,0.18)",
                  boxShadow: "0 0 60px rgba(239,68,68,0.05)",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(239,68,68,0.35)";
                  el.style.boxShadow = "0 0 80px rgba(239,68,68,0.1)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(239,68,68,0.18)";
                  el.style.boxShadow = "0 0 60px rgba(239,68,68,0.05)";
                }}
              >
                <div
                  aria-hidden="true"
                  className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(ellipse, rgba(239,68,68,0.15) 0%, transparent 70%)", filter: "blur(20px)" }}
                />

                <div className="flex items-center gap-4 mb-6 relative">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-red-400 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.22)" }}
                  >
                    <Download className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-0.5">TubeForge</h3>
                    <p className="text-sm text-red-400/80">Téléchargement & archivage</p>
                  </div>
                </div>

                <p className="text-white/50 text-sm mb-7 leading-relaxed">
                  Téléchargez des vidéos et de l&apos;audio depuis YouTube en haute qualité.
                  Vidéo unique, playlists, ou recherche directe avec téléchargement par lot.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    { icon: Zap, text: "Téléchargement multithread rapide" },
                    { icon: ListVideo, text: "Playlists et batch download" },
                    { icon: Search, text: "Recherche YouTube intégrée" },
                    { icon: FolderOpen, text: "Bibliothèque locale avec dossiers" },
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 p-3 rounded-lg"
                      style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)" }}
                    >
                      <feature.icon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-white/55">{feature.text}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 group/btn"
                  style={{
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.28)",
                    color: "#fca5a5",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "rgba(239,68,68,0.2)";
                    el.style.borderColor = "rgba(239,68,68,0.45)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "rgba(239,68,68,0.12)";
                    el.style.borderColor = "rgba(239,68,68,0.28)";
                  }}
                >
                  En savoir plus
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </Link>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Gradient fade transition */}
        <div
          aria-hidden="true"
          className="w-full h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.12) 35%, rgba(96,165,250,0.1) 65%, transparent 100%)" }}
        />

        {/* ─── Roadmap / Laboratoire ───────────────────────────────────────────── */}
        <section className="py-28 relative">
          {/* Distant nebula — purple, bottom-right */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 right-0 w-[500px] h-64 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at bottom right, rgba(139,92,246,0.07) 0%, transparent 70%)", filter: "blur(40px)" }}
          />

          <div className="container-main relative">
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6"
            >
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-blue-400/60 mb-4 flex items-center gap-2">
                  <span className="w-3 h-px bg-blue-400/40 inline-block" />
                  En cours de forge
                </p>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-3">
                  <Hammer className="w-7 h-7 text-white/30" />
                  Laboratoire
                </h2>
                <p className="text-white/45 max-w-lg leading-relaxed">
                  Aperçu des outils en cours de développement dans nos forges secrètes.
                  Bientôt disponibles dans votre Launcher.
                </p>
              </div>
              <div className="hidden md:block shrink-0">
                <div
                  className="px-4 py-2 rounded-full text-xs font-mono text-white/30"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  ROADMAP_2026.JSON
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {roadmapTools.map((tool, i) => {
                const cfg = STATUS_CONFIG[tool.status] ?? STATUS_CONFIG["Concept"];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                    whileHover={{ y: shouldReduceMotion ? 0 : -6 }}
                    className="p-6 rounded-2xl relative overflow-hidden group"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.035)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)";
                    }}
                  >
                    {/* Status badge — color-coded per state */}
                    <div
                      className={`absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${cfg.badgeBg} ${cfg.badgeBorder} ${cfg.badgeText} border`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor} inline-block shrink-0`}
                        style={
                          tool.status === "En développement"
                            ? { animation: shouldReduceMotion ? "none" : "launcher-blink 1.3s ease-in-out infinite" }
                            : {}
                        }
                      />
                      {tool.status}
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-11 h-11 rounded-lg flex items-center justify-center mb-5 ${tool.color} transition-transform duration-300 group-hover:scale-110`}
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <tool.icon className="w-5 h-5" />
                    </div>

                    <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors duration-200">{tool.name}</h3>
                    <p className="text-white/35 text-sm leading-relaxed mb-6">{tool.desc}</p>

                    {/* Progress bar — width encodes the status stage */}
                    <div className="w-full h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div
                        className={`h-full rounded-full ${cfg.barColor} ${cfg.barWidth} transition-all duration-700 ease-out group-hover:opacity-100`}
                        style={{ opacity: 0.7 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      <Footer />

      {/* Keyframe animations — scoped to launcher page, injected via style tag.
          Using step-end for cursor (authentic terminal feel) and ease-out for pulse ring. */}
      <style>{`
        @keyframes launcher-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes launcher-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes launcher-pulse-ring {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(2.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
