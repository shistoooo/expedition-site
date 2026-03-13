"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Check, Calendar, Rocket, Bell, Star } from "lucide-react";
import PageBackground from "@/components/PageBackground";
import { SALES_OPEN } from "@/lib/salesConfig";

export default function PricingPage() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden relative bg-[#06051a] text-white">
      <PageBackground />
      <Navbar />

      <main className="pt-36 pb-32 container-main relative z-10">

        {/* ── PRICING CARDS ────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto">

          {/* Wave 1 — Hero card */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-8"
          >
            {/* Animated conic border */}
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

            {/* Diffuse glow */}
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-3xl pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 50% 80%, rgba(139,92,246,0.35) 0%, rgba(139,92,246,0.12) 40%, transparent 70%)",
                filter: "blur(20px)",
                zIndex: -1,
              }}
            />

            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(160deg, rgba(139,92,246,0.12) 0%, rgba(15,15,22,0.98) 40%)",
                border: "1px solid rgba(139,92,246,0.3)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Gradient mesh top */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
                style={{ background: "linear-gradient(180deg, rgba(139,92,246,0.18) 0%, transparent 100%)" }}
              />

              <div className="relative p-8 md:p-10">
                {/* Popular badge */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5" />
                    Disponible
                  </div>
                  <div
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                      boxShadow: "0 0 16px rgba(139,92,246,0.5)",
                      color: "#fff",
                    }}
                  >
                    <Star className="w-3.5 h-3.5" />
                    Le plus populaire
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-[-0.03em]">
                      Vague 1 &mdash; TubeForge
                    </h1>
                    <p className="text-white/50 text-sm">
                      Acc&egrave;s anticip&eacute; &bull; Outils actuels et futurs inclus
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl md:text-6xl font-black tracking-tight">11,99&euro;</span>
                      <span className="text-white/30 text-base ml-1">/mois</span>
                    </div>
                    <p className="text-sm mt-2 font-semibold text-green-400">
                      7,99&euro;/mois pour les membres Discord
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mb-8">
                  {[
                    "Acc\u00e8s complet au Launcher",
                    "Licence TubeForge Pro (8K, sans pub)",
                    "Badge Discord \u2018Pionnier\u2019",
                    "Acc\u00e8s garanti aux Vagues 2 et 3",
                    "Tarif bloqu\u00e9 tant que vous restez abonn\u00e9",
                    "Acc\u00e8s Discord priv\u00e9 : retours directs avec le dev",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div
                        className="mt-0.5 w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
                        style={{
                          background: "rgba(139,92,246,0.2)",
                          border: "1px solid rgba(139,92,246,0.4)",
                        }}
                      >
                        <Check className="w-2.5 h-2.5" style={{ color: "#a78bfa" }} />
                      </div>
                      <span className="text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href="/checkout"
                  className="group/btn w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)",
                    color: "#fff",
                    boxShadow: "0 0 24px rgba(139,92,246,0.45), 0 0 60px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.15)",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.08) 100%)",
                    }}
                  />
                  <span className="relative z-10 transition-transform duration-200 group-hover/btn:scale-105 inline-flex items-center gap-2">
                    {SALES_OPEN ? "S\u00e9curiser mon prix" : "\u00catre pr\u00e9venu au lancement"}
                    {SALES_OPEN ? <Rocket className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </span>
                </Link>

                <p className="text-center text-xs mt-3 font-mono" style={{ color: "rgba(255,255,255,0.28)" }}>
                  Annulable &agrave; tout moment. Sans engagement.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Waves 2 & 3 — Side by side, grayed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            {[
              {
                name: "Vague 2 \u2014 ClipForge",
                date: "Beta",
                price: "~15\u20ac",
                features: [
                  "Tout de la Vague 1",
                  "ClipForge \u2014 Clips auto 8h + s\u00e9lection illimit\u00e9e",
                  "Prix plus \u00e9lev\u00e9 pour les nouveaux",
                  "Pionniers : inclus sans surco\u00fbt",
                ],
              },
              {
                name: "Vague 3 \u2014 ReviewForge",
                date: "\u00c9t\u00e9 2026",
                price: "~25-50\u20ac",
                features: [
                  "Tout des Vagues 1 et 2",
                  "ReviewForge \u2014 Partage vid\u00e9o s\u00e9curis\u00e9",
                  "Prix standard final",
                  "Pionniers : inclus sans surco\u00fbt",
                ],
              },
            ].map((wave, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  opacity: 0.5,
                }}
              >
                <div className="absolute top-0 right-0 bg-white/5 text-white/30 text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-xl font-mono uppercase tracking-wider">
                  Bient&ocirc;t
                </div>

                <div className="p-6">
                  <div className="mb-6 mt-2">
                    <div className="flex items-center gap-2 text-white/30 text-xs font-mono uppercase tracking-widest mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {wave.date}
                    </div>
                    <h2 className="text-lg font-bold text-white/45 mb-3">{wave.name}</h2>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black tracking-tight text-white/35">{wave.price}</span>
                      <span className="text-white/20 text-sm ml-1">/mois</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {wave.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <div
                          className="mt-0.5 w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                        >
                          <Check className="w-2.5 h-2.5" style={{ color: "rgba(255,255,255,0.2)" }} />
                        </div>
                        <span className="text-white/30">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    disabled
                    className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      color: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    Pas encore disponible
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── TRUST / INFO BOX ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto relative"
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(6,5,26,0.95) 60%)",
                border: "1px solid rgba(139,92,246,0.25)",
                backdropFilter: "blur(24px)",
                boxShadow: "0 0 40px rgba(139,92,246,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.6) 30%, rgba(167,139,250,0.8) 50%, rgba(139,92,246,0.6) 70%, transparent)" }}
              />

              <div className="p-8 flex gap-5 items-start">
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
                  <h3
                    className="text-lg font-bold mb-3"
                    style={{
                      background: "linear-gradient(90deg, #c4b5fd, #a78bfa)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Pourquoi c&apos;est le meilleur moment pour rejoindre ?
                  </h3>
                  <p className="text-white/60 leading-relaxed mb-3">
                    La suite Exp&eacute;dition grandit en permanence. &Agrave; chaque nouvelle &quot;Vague&quot; d&apos;outils, le tarif d&apos;entr&eacute;e augmente.
                  </p>
                  <p className="text-white/60 leading-relaxed mb-4">
                    <strong className="text-purple-200/90 font-semibold">Les Pionniers gardent leur tarif d&apos;entr&eacute;e tant qu&apos;ils restent abonn&eacute;s</strong> &mdash; m&ecirc;me quand la suite vaudra 25&euro;/mois avec 10+ outils.
                    Plus vous rejoignez t&ocirc;t, plus vous &eacute;conomisez sur le long terme.
                  </p>
                  <p
                    className="text-xs font-mono uppercase tracking-wider"
                    style={{ color: "rgba(167,139,250,0.45)" }}
                  >
                    Votre tarif reste le m&ecirc;me tant que votre abonnement est actif. Annulable &agrave; tout moment.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
