"use client";

import { motion } from "framer-motion";
import { Check, Lock, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function HomePricing() {
  return (
    <section id="pricing" className="py-32 md:py-40 relative section-fade-top">
      {/* Pricing nebula — violet ambient, signals high value */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(139,92,246,0.14) 0%, rgba(99,60,200,0.07) 45%, transparent 72%)',
          filter: 'blur(2px)',
        }}
      />
      <div className="container-main max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm font-medium mb-6">
            <Lock className="w-4 h-4" />
            <span>Tarif Pionnier — bloqu&eacute; tant que vous restez abonn&eacute;</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-[-0.03em]">
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
            { period: "Vague 1", tools: "TubeForge", price: "11,99€", you: true },
            { period: "Vague 2", tools: "+ ClipForge", price: "11,99€", you: true },
            { period: "Vague 3", tools: "+ ReviewForge", price: "11,99€", you: true },
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
            <p className="text-xs text-white/30">Les nouveaux abonnés paieront <span className="text-red-400/70">~15&euro;</span>, <span className="text-red-400/70">~25&euro;</span> puis jusqu&apos;&agrave; <span className="text-red-400/70">50-70&euro;</span> pour la même suite.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl p-[1px] overflow-hidden shadow-[0_0_80px_rgba(139,92,246,0.18),0_20px_60px_rgba(0,0,0,0.5)]"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.35) 0%, rgba(255,255,255,0.08) 40%, rgba(99,102,241,0.2) 100%)' }}
        >
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/15 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent pointer-events-none" />
            <div className="relative bg-[#0d0d16] rounded-xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Vague Pionnier</h3>
                <p className="text-white/40 text-sm">Acc&egrave;s anticip&eacute; &bull; Outils actuels et futurs</p>
              </div>
              <div className="text-left md:text-right">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-bold text-white">11,99&euro;</span>
                  <span className="text-white/40">/mois</span>
                </div>
                <p className="text-xs text-green-300 mt-1">7,99&euro;/mois pour les membres Discord</p>
                <p className="text-xs text-purple-300 mt-0.5">ou 99,99&euro;/an (soit 8,33&euro;/mois — 4 mois offerts)</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mb-8">
              {[
                "Expedition Launcher (Mac/Windows)",
                "TubeForge Pro — 8K, sans pub (Vague 1)",
                "ClipForge — Clips auto 8h + sélection illimitée (Vague 2)",
                "ReviewForge — Review sécurisé (Vague 3)",
                "Badge Discord Pionnier",
                "Tarif bloqué tant que vous restez abonné",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/checkout"
                className="group flex-1 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.4),0_8px_32px_rgba(0,0,0,0.4)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Rejoindre la Vague Pionnier
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/pricing"
                className="py-4 px-6 rounded-xl bg-white/[0.04] border border-white/10 text-white/50 font-medium hover:bg-white/[0.08] hover:border-white/20 hover:text-white/70 transition-all duration-300 flex items-center justify-center text-sm"
              >
                Comparer les vagues
              </Link>
            </div>

            <p className="text-center text-xs text-white/25 mt-4">
              Annulable &agrave; tout moment. Sans engagement.
            </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
