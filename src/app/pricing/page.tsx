"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Check, Lock, Calendar, AlertCircle, Rocket, Zap, Download, Layers, Sparkles, Terminal, Star } from "lucide-react";
import PageBackground from "@/components/PageBackground";

const includedTools = [
  {
    name: "Expedition Launcher",
    desc: "Votre QG de créateur. Mises à jour automatiques, news et accès centralisé.",
    icon: Rocket,
    color: "bg-blue-500/20 text-blue-400",
    accent: "rgba(59,130,246,0.15)",
    border: "rgba(59,130,246,0.3)",
  },
  {
    name: "TubeForge (Vague 1)",
    desc: "Le téléchargeur ultime. 8K, 60fps, sans pub. Disponible maintenant.",
    icon: Download,
    color: "bg-red-500/20 text-red-400",
    accent: "rgba(239,68,68,0.15)",
    border: "rgba(239,68,68,0.3)",
  },
  {
    name: "ClipForge (Vague 2)",
    desc: "Transformez vos vidéos YouTube en TikToks/Shorts viraux. Arrive prochainement.",
    icon: Sparkles,
    color: "bg-purple-500/20 text-purple-400",
    accent: "rgba(139,92,246,0.15)",
    border: "rgba(139,92,246,0.3)",
  },
  {
    name: "ReviewForge (Vague 3)",
    desc: "Partage vidéo sécurisé avec liens temporaires et review en temps réel. Été 2026.",
    icon: Layers,
    color: "bg-green-500/20 text-green-400",
    accent: "rgba(16,185,129,0.15)",
    border: "rgba(16,185,129,0.3)",
  }
];

export default function PricingPage() {
  const waves = [
    {
      id: 1,
      name: "Vague 1 — TubeForge",
      date: "Disponible",
      price: "11,99€",
      discordPrice: "7,99€",
      period: "/mois",
      status: "open",
      features: [
        "Accès complet au Launcher",
        "Licence TubeForge Pro (8K, sans pub)",
        "Badge Discord 'Pionnier'",
        "Accès garanti aux Vagues 2 et 3",
        "Tarif bloqué tant que vous restez abonné"
      ],
      color: "from-purple-500 to-blue-500",
      glow: "purple"
    },
    {
      id: 2,
      name: "Vague 2 — ClipForge",
      date: "Beta",
      price: "~15€",
      period: "/mois",
      status: "upcoming",
      features: [
        "Tout de la Vague 1",
        "ClipForge — Clips auto 8h + sélection illimitée",
        "Prix plus élevé pour les nouveaux",
        "Pionniers : inclus sans surcoût"
      ],
      color: "from-blue-500 to-cyan-500",
      glow: "blue"
    },
    {
      id: 3,
      name: "Vague 3 — ReviewForge",
      date: "Été 2026",
      price: "~25-50€",
      period: "/mois",
      status: "upcoming",
      features: [
        "Tout des Vagues 1 et 2",
        "ReviewForge — Partage vidéo sécurisé",
        "Prix standard final",
        "Pionniers : inclus sans surcoût"
      ],
      color: "from-cyan-500 to-emerald-500",
      glow: "cyan"
    }
  ];

  return (
    <div className="w-full min-h-screen overflow-x-hidden relative bg-[#06051a] text-white">
      <PageBackground />

      {/* Page-level nebula glows — reinforce space depth without fighting PageBackground */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
        {/* Hero nebula — warm violet bloom top-left */}
        <div
          className="absolute -top-32 -left-48 w-[700px] h-[700px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.22) 0%, rgba(139,92,246,0.06) 50%, transparent 70%)", filter: "blur(60px)" }}
        />
        {/* Pricing section — cold blue bloom right */}
        <div
          className="absolute top-[55%] -right-64 w-[600px] h-[600px] rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        {/* Bottom trust section — cyan whisper */}
        <div
          className="absolute bottom-0 left-1/4 w-[500px] h-[400px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)", filter: "blur(70px)" }}
        />
      </div>

      <Navbar />

      <main className="pt-36 pb-32 container-main relative z-10">

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <div className="text-center max-w-4xl mx-auto mb-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Section label — editorial mono style */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8"
              style={{
                background: "rgba(139,92,246,0.08)",
                border: "1px solid rgba(139,92,246,0.25)",
              }}
            >
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-purple-300/90 text-xs font-mono uppercase tracking-widest">
                Plus la suite grandit, plus votre offre prend de la valeur
              </span>
            </div>

            {/* Title — push size hard, split into two tonal layers */}
            <h1
              className="font-black leading-[0.95] mb-8 tracking-[-0.04em]"
              style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
            >
              {/* First line: muted white, large */}
              <span className="block text-white/90">Un abonnement unique.</span>
              {/* Second line: gradient — the signature typographic move */}
              <span
                className="block"
                style={{
                  background: "linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 40%, #60a5fa 80%, #06b6d4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Une infinit&eacute; d&apos;outils.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl mx-auto font-light">
              Rejoignez l&apos;Exp&eacute;dition d&egrave;s maintenant pour profiter du tarif le plus bas — il reste bloqu&eacute; tant que vous restez abonn&eacute;.
              Acc&eacute;dez imm&eacute;diatement &agrave; tous nos outils actuels et futurs.
            </p>
          </motion.div>
        </div>

        {/* ── VALUE STACK GRID ─────────────────────────────────────────── */}
        {/* Soft gradient separator above the grid */}
        <div
          aria-hidden="true"
          className="w-full max-w-5xl mx-auto mb-10 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.2) 30%, rgba(59,130,246,0.2) 70%, transparent)" }}
        />

        <h2 className="sr-only">Outils inclus dans votre abonnement</h2>

        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto mb-28">
          {includedTools.map((tool, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
              className="group flex items-start gap-4 p-6 rounded-2xl cursor-default relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                transition: "border-color 0.3s ease, background 0.3s ease",
              }}
            >
              {/* Color accent left-border reveal on hover */}
              <div
                className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: tool.border }}
              />
              {/* Subtle inner glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 20% 50%, ${tool.accent} 0%, transparent 60%)` }}
              />

              <div className={`p-3 rounded-xl shrink-0 relative z-10 ${tool.color} group-hover:scale-110 transition-transform duration-300`}
                style={{ boxShadow: `0 0 20px ${tool.accent}` }}>
                <tool.icon className="w-6 h-6" />
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-1 text-white/90 group-hover:text-white transition-colors duration-300">{tool.name}</h3>
                <p className="text-white/50 text-sm leading-relaxed group-hover:text-white/65 transition-colors duration-300">{tool.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Soft gradient separator */}
        <div
          aria-hidden="true"
          className="w-full max-w-5xl mx-auto mb-16 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.2) 30%, rgba(59,130,246,0.2) 70%, transparent)" }}
        />

        {/* ── PRICING CARDS ────────────────────────────────────────────── */}
        <h2 className="sr-only">Les Vagues — choisissez votre moment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto leading-relaxed">
          {waves.map((wave, index) => {
            const isOpen = wave.status === "open";
            return (
              <motion.div
                key={wave.id}
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
                /* Active card lifts off the page; inactive cards are subdued */
                style={{ transform: isOpen ? "scale(1.04)" : "scale(1)", zIndex: isOpen ? 10 : 1 }}
              >
                {/* ── Animated conic border — only on active card ── */}
                {isOpen && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      padding: "1.5px",
                      background: "conic-gradient(from var(--cta-angle, 0deg), transparent 50%, rgba(139,92,246,0.9) 75%, rgba(167,139,250,1) 85%, rgba(139,92,246,0.9) 90%, transparent 100%)",
                      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      animation: "cta-spin 4s linear infinite",
                    }}
                  />
                )}

                {/* ── Diffuse glow beneath active card ── */}
                {isOpen && (
                  <div
                    aria-hidden="true"
                    className="absolute -inset-4 rounded-3xl pointer-events-none"
                    style={{
                      background: "radial-gradient(ellipse at 50% 80%, rgba(139,92,246,0.35) 0%, rgba(139,92,246,0.12) 40%, transparent 70%)",
                      filter: "blur(20px)",
                      zIndex: -1,
                    }}
                  />
                )}

                {/* Card body */}
                <div
                  className="relative h-full rounded-2xl overflow-hidden flex flex-col"
                  style={{
                    background: isOpen
                      ? "linear-gradient(160deg, rgba(139,92,246,0.12) 0%, rgba(15,15,22,0.98) 40%)"
                      : "rgba(255,255,255,0.03)",
                    border: isOpen
                      ? "1px solid rgba(139,92,246,0.3)"
                      : "1px solid rgba(255,255,255,0.07)",
                    backdropFilter: "blur(20px)",
                    opacity: isOpen ? 1 : 0.65,
                  }}
                >
                  {/* Gradient mesh inside card top — only on active */}
                  {isOpen && (
                    <div
                      aria-hidden="true"
                      className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
                      style={{
                        background: "linear-gradient(180deg, rgba(139,92,246,0.18) 0%, transparent 100%)",
                      }}
                    />
                  )}

                  <div className="relative p-8 flex flex-col flex-1">
                    {/* Status badge */}
                    {isOpen && (
                      <div
                        className="absolute top-0 right-0 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-xl font-mono uppercase tracking-wider"
                        style={{
                          background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                          boxShadow: "0 0 16px rgba(139,92,246,0.5)",
                        }}
                      >
                        Disponible
                      </div>
                    )}
                    {!isOpen && (
                      <div className="absolute top-0 right-0 bg-white/5 text-white/30 text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-xl font-mono uppercase tracking-wider">
                        Bientôt
                      </div>
                    )}

                    {/* Wave header */}
                    <div className="mb-8 mt-4">
                      <div className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        {wave.date}
                      </div>
                      <h3
                        className="text-xl font-bold mb-4"
                        style={{ color: isOpen ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)" }}
                      >
                        {wave.name}
                      </h3>
                      <div className="flex items-baseline gap-1">
                        <span
                          className="text-5xl font-black tracking-tight"
                          style={{
                            color: isOpen ? "#fff" : "rgba(255,255,255,0.35)",
                            letterSpacing: "-0.04em",
                          }}
                        >
                          {wave.price}
                        </span>
                        <span className="text-white/30 text-base ml-1">{wave.period}</span>
                      </div>
                      {wave.discordPrice && (
                        <p
                          className="text-xs mt-2 font-mono"
                          style={{ color: "rgba(167,139,250,0.8)" }}
                        >
                          {wave.discordPrice}/mois pour les membres Discord
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <div className="flex-1 space-y-3.5 mb-8">
                      {wave.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm">
                          <div
                            className="mt-0.5 w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
                            style={{
                              background: isOpen ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.05)",
                              border: isOpen ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(255,255,255,0.1)",
                            }}
                          >
                            <Check
                              className="w-2.5 h-2.5"
                              style={{ color: isOpen ? "#a78bfa" : "rgba(255,255,255,0.2)" }}
                            />
                          </div>
                          <span style={{ color: isOpen ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)" }}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    {isOpen ? (
                      <Link
                        href="/checkout"
                        className="group/btn w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 relative overflow-hidden"
                        style={{
                          background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)",
                          color: "#fff",
                          boxShadow: "0 0 24px rgba(139,92,246,0.45), 0 0 60px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.15)",
                        }}
                      >
                        {/* Shimmer layer */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 pointer-events-none"
                          style={{
                            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.08) 100%)",
                          }}
                        />
                        {/* Scale on hover via CSS — framer-motion would fight the outer scale */}
                        <span className="relative z-10 transition-transform duration-200 group-hover/btn:scale-105 inline-flex items-center gap-2">
                          Sécuriser mon prix
                          <Rocket className="w-4 h-4" />
                        </span>
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 cursor-not-allowed"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          color: "rgba(255,255,255,0.2)",
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        Pas encore disponible
                      </button>
                    )}

                    {isOpen && (
                      <p className="text-center text-xs mt-3 font-mono" style={{ color: "rgba(255,255,255,0.28)" }}>
                        Annulable à tout moment. Sans engagement.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Extra bottom breathing room after the scaled card */}
        <div className="h-10" aria-hidden="true" />

        {/* Soft gradient separator before trust box */}
        <div
          aria-hidden="true"
          className="w-full max-w-3xl mx-auto mt-20 mb-10 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.2) 50%, transparent)" }}
        />

        {/* ── TRUST / INFO BOX ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto relative"
        >
          {/* Nebula glow behind the box */}
          <div
            aria-hidden="true"
            className="absolute -inset-8 rounded-3xl pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%)",
              filter: "blur(30px)",
              zIndex: 0,
            }}
          />

          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(6,5,26,0.95) 60%)",
              border: "1px solid rgba(139,92,246,0.25)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 0 40px rgba(139,92,246,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Gradient top-edge accent line */}
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.6) 30%, rgba(167,139,250,0.8) 50%, rgba(139,92,246,0.6) 70%, transparent)" }}
            />

            <div className="p-8 flex gap-5 items-start">
              {/* Icon — orbital star instead of bare AlertCircle */}
              <div
                className="shrink-0 mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(139,92,246,0.15)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  boxShadow: "0 0 20px rgba(139,92,246,0.25)",
                }}
              >
                <Star className="w-5 h-5" style={{ color: "#a78bfa" }} />
              </div>

              <div>
                <h4
                  className="text-lg font-bold mb-3"
                  style={{
                    background: "linear-gradient(90deg, #c4b5fd, #a78bfa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Pourquoi c&apos;est le meilleur moment pour rejoindre ?
                </h4>
                <p className="text-white/60 leading-relaxed mb-3">
                  La suite Expédition grandit en permanence. À chaque nouvelle &quot;Vague&quot; d&apos;outils, le tarif d&apos;entrée augmente.
                </p>
                <p className="text-white/60 leading-relaxed mb-4">
                  <strong className="text-purple-200/90 font-semibold">Les Pionniers gardent leur tarif d&apos;entr&eacute;e tant qu&apos;ils restent abonn&eacute;s</strong> — m&ecirc;me quand la suite vaudra 25&euro;/mois avec 10+ outils.
                  Plus vous rejoignez t&ocirc;t, plus vous &eacute;conomisez sur le long terme.
                </p>
                <p
                  className="text-xs font-mono uppercase tracking-wider"
                  style={{ color: "rgba(167,139,250,0.45)" }}
                >
                  Votre tarif reste le même tant que votre abonnement est actif. Annulable à tout moment.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="w-full max-w-3xl mx-auto mt-20 mb-10 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.2) 50%, transparent)" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-10 text-center tracking-[-0.03em]">
            Questions fr&eacute;quentes
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Puis-je annuler \u00e0 tout moment ?",
                a: "Oui, sans engagement. Vous pouvez annuler votre abonnement \u00e0 tout moment depuis votre espace compte. Vous gardez l\u2019acc\u00e8s jusqu\u2019\u00e0 la fin de la p\u00e9riode pay\u00e9e.",
              },
              {
                q: "Que veut dire \u00ab\u00a0tarif bloqu\u00e9\u00a0\u00bb ?",
                a: "Le prix que vous payez aujourd\u2019hui reste le m\u00eame tant que votre abonnement est actif. M\u00eame quand de nouveaux outils seront ajout\u00e9s et que le prix d\u2019entr\u00e9e augmentera pour les nouveaux abonn\u00e9s, votre tarif ne change pas.",
              },
              {
                q: "Comment fonctionne la r\u00e9duction Discord ?",
                a: "Si vous \u00eates membre de notre serveur Discord avant de vous abonner, vous b\u00e9n\u00e9ficiez du tarif r\u00e9duit \u00e0 7,99\u20ac/mois au lieu de 11,99\u20ac. Rejoignez le Discord d\u2019abord, puis abonnez-vous.",
              },
              {
                q: "Sur quelles plateformes fonctionnent les outils ?",
                a: "Le Launcher et tous les outils (TubeForge, ClipForge, ReviewForge) fonctionnent sur Mac et Windows. Aucune installation suppl\u00e9mentaire n\u2019est n\u00e9cessaire.",
              },
              {
                q: "Les futurs outils seront-ils inclus ?",
                a: "Oui. Tous les outils actuels et futurs sont inclus dans votre abonnement Pionnier. Vous n\u2019aurez jamais \u00e0 payer de suppl\u00e9ment.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <summary
                  className="flex items-center justify-between cursor-pointer p-6 text-white/90 font-semibold text-sm md:text-base select-none list-none [&::-webkit-details-marker]:hidden"
                >
                  {faq.q}
                  <span className="ml-4 text-white/30 transition-transform duration-300 group-open:rotate-45 text-xl leading-none shrink-0">+</span>
                </summary>
                <div className="px-6 pb-6 text-white/50 text-sm leading-relaxed -mt-1">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </motion.div>

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Puis-je annuler \u00e0 tout moment ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Oui, sans engagement. Vous pouvez annuler votre abonnement \u00e0 tout moment depuis votre espace compte. Vous gardez l\u2019acc\u00e8s jusqu\u2019\u00e0 la fin de la p\u00e9riode pay\u00e9e.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Que veut dire \u00ab tarif bloqu\u00e9 \u00bb ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Le prix que vous payez aujourd\u2019hui reste le m\u00eame tant que votre abonnement est actif. M\u00eame quand de nouveaux outils seront ajout\u00e9s et que le prix d\u2019entr\u00e9e augmentera pour les nouveaux abonn\u00e9s, votre tarif ne change pas.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Comment fonctionne la r\u00e9duction Discord ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Si vous \u00eates membre de notre serveur Discord avant de vous abonner, vous b\u00e9n\u00e9ficiez du tarif r\u00e9duit \u00e0 7,99\u20ac/mois au lieu de 11,99\u20ac. Rejoignez le Discord d\u2019abord, puis abonnez-vous.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Sur quelles plateformes fonctionnent les outils ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Le Launcher et tous les outils (TubeForge, ClipForge, ReviewForge) fonctionnent sur Mac et Windows.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Les futurs outils seront-ils inclus ?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Oui. Tous les outils actuels et futurs sont inclus dans votre abonnement Pionnier. Vous n\u2019aurez jamais \u00e0 payer de suppl\u00e9ment.",
                  },
                },
              ],
            }),
          }}
        />

      </main>
      <Footer />
    </div>
  );
}
