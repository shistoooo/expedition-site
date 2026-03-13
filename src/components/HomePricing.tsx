"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Lock, ArrowRight, TrendingUp, Bell } from "lucide-react";
import Link from "next/link";
import { SALES_OPEN } from "@/lib/salesConfig";

export default function HomePricing() {
  const [isAnnual, setIsAnnual] = useState(false);

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
          className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10"
        >
          {[
            { period: "Vague 1", tools: "TubeForge", price: "11,99\u20ac", you: true },
            { period: "Vague 2", tools: "+ ClipForge", price: "11,99\u20ac", you: true },
            { period: "Vague 3", tools: "+ ReviewForge", price: "11,99\u20ac", you: true },
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
          <div className="col-span-1 md:col-span-3 text-center">
            <p className="text-xs text-white/30">Les nouveaux abonn&eacute;s paieront <span className="text-red-400/70">~15&euro;</span>, <span className="text-red-400/70">~25&euro;</span> puis jusqu&apos;&agrave; <span className="text-red-400/70">50-70&euro;</span> pour la m&ecirc;me suite.</p>
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

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-white' : 'text-white/40'}`}>Mensuel</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative w-14 h-7 rounded-full transition-colors duration-300"
                style={{ background: isAnnual ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.1)' }}
                aria-label="Basculer entre mensuel et annuel"
              >
                <div
                  className="absolute top-0.5 w-6 h-6 rounded-full bg-white transition-transform duration-300 shadow-md"
                  style={{ transform: isAnnual ? 'translateX(30px)' : 'translateX(2px)' }}
                />
              </button>
              <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-white' : 'text-white/40'}`}>
                Annuel
              </span>
              {isAnnual && (
                <span className="px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/25 text-green-300 text-xs font-bold">
                  4 mois offerts
                </span>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Vague Pionnier</h3>
                <p className="text-white/40 text-sm">Acc&egrave;s anticip&eacute; &bull; Outils actuels et futurs</p>
              </div>
              <div className="text-left md:text-right">
                {isAnnual ? (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl md:text-5xl font-bold text-white">99,99&euro;</span>
                      <span className="text-white/40">/an</span>
                    </div>
                    <p className="text-xs text-green-300 mt-1">soit 8,33&euro;/mois — 4 mois offerts</p>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl md:text-5xl font-bold text-white">11,99&euro;</span>
                      <span className="text-white/40">/mois</span>
                    </div>
                    <p className="text-xs text-green-300 mt-1">7,99&euro;/mois pour les membres Discord</p>
                  </>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mb-8">
              {[
                "Expedition Launcher (Mac/Windows)",
                "TubeForge Pro \u2014 8K, sans pub (Vague 1)",
                "ClipForge \u2014 Clips auto 8h + s\u00e9lection illimit\u00e9e (Vague 2)",
                "ReviewForge \u2014 Review s\u00e9curis\u00e9 (Vague 3)",
                "Badge Discord Pionnier",
                "Acc\u00e8s Discord priv\u00e9 : retours directs avec le dev, votes features",
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
                className="group flex-1 py-4 rounded-xl bg-white text-black font-bold text-base border border-white/20 transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_24px_rgba(139,92,246,0.25)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_12px_40px_rgba(139,92,246,0.4)] hover:translate-y-[-1px] active:translate-y-[1px] flex items-center justify-center gap-2"
              >
                {SALES_OPEN ? "Rejoindre la Vague Pionnier" : "\u00catre pr\u00e9venu au lancement"}
                {SALES_OPEN ? (
                  <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </Link>
              <Link
                href="/pricing"
                className="py-4 px-6 rounded-xl bg-white/[0.04] border border-white/10 text-white/50 font-medium hover:bg-white/[0.08] hover:border-white/20 hover:text-white/70 transition-all duration-300 flex items-center justify-center text-sm"
              >
                Voir tous les d&eacute;tails
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
