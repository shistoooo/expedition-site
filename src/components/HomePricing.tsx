"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Bell, Star } from "lucide-react";
import Link from "next/link";
import { SALES_OPEN } from "@/lib/salesConfig";

export default function HomePricing() {
  return (
    <section id="pricing" className="py-32 md:py-40 relative">
      {/* Pricing nebula */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(139,92,246,0.14) 0%, rgba(99,60,200,0.07) 45%, transparent 72%)',
          filter: 'blur(2px)',
        }}
      />
      <div className="container-main max-w-lg">
        {/* Single pricing card */}
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

            {/* Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-300 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
                Le plus populaire
              </div>
            </div>

            {/* Plan name */}
            <h3 className="text-center text-lg font-semibold text-white/60 mb-6">Vague Pionnier</h3>

            {/* Both prices visible */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="text-center p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl md:text-4xl font-black text-white">11,99&euro;</span>
                  <span className="text-white/40 text-sm">/mois</span>
                </div>
                <p className="text-xs text-green-300 mt-1.5">7,99&euro;/mois avec Discord</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl md:text-4xl font-black text-white">99,99&euro;</span>
                  <span className="text-white/40 text-sm">/an</span>
                </div>
                <p className="text-xs text-green-300 mt-1.5">8,33&euro;/mois &mdash; 4 mois offerts</p>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/checkout"
              className="group w-full py-4 rounded-xl bg-white text-black font-bold text-base border border-white/20 transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_24px_rgba(139,92,246,0.25)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_12px_40px_rgba(139,92,246,0.4)] hover:translate-y-[-1px] active:translate-y-[1px] flex items-center justify-center gap-2 mb-8"
            >
              {SALES_OPEN ? "Rejoindre la Vague Pionnier" : "\u00catre pr\u00e9venu au lancement"}
              {SALES_OPEN ? (
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              ) : (
                <Bell className="w-5 h-5" />
              )}
            </Link>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {[
                "Expedition Launcher (Mac/Windows)",
                "TubeForge Pro \u2014 8K, sans pub",
                "ClipForge \u2014 Clips auto + s\u00e9lection illimit\u00e9e",
                "ReviewForge \u2014 Review s\u00e9curis\u00e9",
                "Badge Discord Pionnier",
                "Acc\u00e8s Discord priv\u00e9 avec le dev",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-white/60">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Secondary link */}
            <div className="flex flex-col items-center gap-3">
              <Link
                href="/pricing"
                className="text-sm text-white/35 hover:text-white/60 transition-colors"
              >
                Voir tous les d&eacute;tails &rarr;
              </Link>
              <p className="text-xs text-white/25">
                Annulable &agrave; tout moment. Sans engagement.
              </p>
            </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
