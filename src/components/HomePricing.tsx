"use client";

import { motion } from "framer-motion";
import { Check, Lock, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function HomePricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 relative overflow-hidden border-t border-white/5">
      <div className="container-main max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm font-medium mb-6">
            <Lock className="w-4 h-4" />
            <span>Tarif Pionnier — garanti sans augmentation</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            La suite grossit. Votre prix, non.
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto">
            Chaque nouveau outil augmente la valeur de votre abonnement.
            Les nouveaux membres paieront plus cher — mais pas vous.
          </p>
        </motion.div>

        {/* Value escalator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-3 mb-10"
        >
          {[
            { period: "Aujourd\u2019hui", tools: "2 outils", price: "9,99\u20AC", you: true },
            { period: "\u00C9t\u00E9 2026", tools: "5 outils", price: "9,99\u20AC", you: true },
            { period: "Fin 2026", tools: "10+ outils", price: "9,99\u20AC", you: true },
          ].map((step, i) => (
            <div key={i} className="relative text-center p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <p className="text-xs text-white/30 mb-1">{step.period}</p>
              <p className="text-lg font-bold text-white mb-0.5">{step.tools}</p>
              <p className="text-sm font-bold text-green-400">{step.price}</p>
              {i < 2 && (
                <TrendingUp className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 z-10" />
              )}
            </div>
          ))}
          <div className="col-span-3 text-center">
            <p className="text-xs text-white/30">Les nouveaux abonnés paieront <span className="text-red-400/70">~15&euro;</span> puis <span className="text-red-400/70">~25&euro;</span> pour la même suite.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl p-1 overflow-hidden ring-1 ring-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent" />
          <div className="relative bg-[#0f0f12] rounded-xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Vague Pionnier</h3>
                <p className="text-white/40 text-sm">Acc&egrave;s anticip&eacute; &bull; Outils actuels et futurs</p>
              </div>
              <div className="text-left md:text-right">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-bold text-white">9,99&euro;</span>
                  <span className="text-white/40">/mois</span>
                </div>
                <p className="text-xs text-purple-300 mt-1">ou 99,99&euro;/an (soit 8,33&euro;/mois)</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mb-8">
              {[
                "Expedition Launcher (Mac/Windows)",
                "ClipForge — Clips illimit&eacute;s",
                "TubeForge Pro — 8K, sans pub",
                "Tous les futurs outils inclus",
                "Badge Discord Pionnier",
                "Votre tarif n&apos;augmentera jamais",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: feature }} />
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/checkout"
                className="flex-1 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-100 transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-2"
              >
                Rejoindre la Vague Pionnier
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pricing"
                className="py-4 px-6 rounded-xl bg-white/5 border border-white/10 text-white/50 font-medium hover:bg-white/10 hover:text-white/70 transition-all flex items-center justify-center text-sm"
              >
                Comparer les vagues
              </Link>
            </div>

            <p className="text-center text-xs text-white/25 mt-4">
              Annulable &agrave; tout moment. Sans engagement.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
