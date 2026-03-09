"use client";

import { motion } from "framer-motion";
import { Coins, Gem, Sparkles, MessageSquare, Mic, ArrowRight, Megaphone, Film, Youtube, Ticket } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import WalletSection from "@/components/WalletSection";
import Link from "next/link";

export default function EconomiePage() {
  return (
    <div className="min-h-screen text-white relative">
      <PageBackground />
      <Navbar />

      <main className="relative z-10">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="pt-40 pb-24 container-main text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-mono uppercase tracking-widest text-amber-400/60 mb-8 flex items-center justify-center gap-2">
              <span className="w-3 h-px bg-amber-400/50 inline-block" />
              Expedition Coin
            </p>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              La monnaie qui fait<br />
              circuler le talent.
            </h1>

            <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
              Gagnez des pi&egrave;ces en participant sur Discord.
              Vendez vos comp&eacute;tences. D&eacute;pensez-les en avantages exclusifs.
            </p>
          </motion.div>

          {/* 3 coins */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center justify-center gap-12 md:gap-20 mt-16"
          >
            {[
              { symbol: "EX", label: "Or", gradient: "linear-gradient(145deg, #f59e0b, #d97706, #b45309)", glow: "#f59e0b" },
              { symbol: "BR", label: "Bronze", gradient: "linear-gradient(145deg, #f97316, #c2410c, #9a3412)", glow: "#f97316" },
              { symbol: "ECL", label: "Eclat", gradient: "linear-gradient(145deg, #a855f7, #7c3aed, #6d28d9)", glow: "#8b5cf6" },
            ].map((coin, i) => (
              <motion.div
                key={coin.symbol}
                className="flex flex-col items-center gap-3"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
              >
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center font-black text-white text-sm md:text-base select-none"
                  style={{
                    background: coin.gradient,
                    boxShadow: `0 0 30px ${coin.glow}40, 0 10px 40px ${coin.glow}25, inset 0 2px 0 rgba(255,255,255,0.2)`,
                  }}
                >
                  {coin.symbol}
                </div>
                <span className="text-xs font-mono text-white/40">{coin.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── Les 3 monnaies ──────────────────────────────────────── */}
        <section className="py-20 container-main max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Coins, color: "text-amber-400", border: "border-amber-500/20",
                title: "Pi\u00e8ces d'Or (EX)",
                desc: "La monnaie principale. Utilisable pour les services, \u00e9changes et achats. Plafond : 500 EX.",
              },
              {
                icon: Coins, color: "text-orange-400", border: "border-orange-500/15",
                title: "Pi\u00e8ces de Bronze",
                desc: "Gagn\u00e9e via l'activit\u00e9 Discord (chat et vocal). Convertissez en Or : 20 BR = 1 EX.",
              },
              {
                icon: Gem, color: "text-purple-400", border: "border-purple-500/20",
                title: "Points d'Eclat",
                desc: "Monnaie prestige. 100 EX = 1 Eclat. D\u00e9pensez-les en avantages rares.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl bg-[#0F0F12] border ${item.border}`}
              >
                <item.icon className={`w-6 h-6 ${item.color} mb-4`} />
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Conversion flow */}
          <div className="flex items-center justify-center gap-4 mt-10 text-sm font-mono">
            <span className="text-orange-400 font-bold">20 BR</span>
            <ArrowRight className="w-4 h-4 text-white/20" />
            <span className="text-amber-400 font-bold">1 EX</span>
            <span className="text-white/20 mx-2">|</span>
            <span className="text-amber-400 font-bold">100 EX</span>
            <ArrowRight className="w-4 h-4 text-white/20" />
            <span className="text-purple-400 font-bold">1 ECL</span>
          </div>
        </section>

        {/* ── Portefeuille ────────────────────────────────────────── */}
        <section className="py-20 container-main max-w-lg mx-auto">
          <WalletSection />
        </section>

        {/* ── Boutique Eclats ─────────────────────────────────────── */}
        <section className="py-20 container-main max-w-4xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-widest text-purple-400/60 mb-4 flex items-center gap-2">
            <span className="w-3 h-px bg-purple-400/50 inline-block" />
            Boutique
          </p>
          <h2 className="text-3xl font-bold mb-3">D&eacute;pensez vos Eclats</h2>
          <p className="text-white/50 mb-12 max-w-lg">
            Les Points d'Eclat d&eacute;bloquent des avantages exclusifs.
            Achats via la commande bot dans <span className="font-mono text-purple-400">#boutique-eclats</span>.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Megaphone, name: "Annonce Vitrine", cost: "2 ECL", desc: "Ton service mis en avant dans le salon d\u00e9di\u00e9 pendant 7 jours.", color: "text-white/60", border: "border-white/10" },
              { icon: Film, name: "Portfolio Vid\u00e9o", cost: "5 ECL", desc: "Ta meilleure vid\u00e9o \u00e9pingl\u00e9e dans le salon Portfolio.", color: "text-blue-400", border: "border-blue-500/20" },
              { icon: Youtube, name: "Shoutout YouTube", cost: "10 ECL", desc: "Mise en avant de ta cha\u00eene. 2 places par mois, valid\u00e9es par le staff.", color: "text-purple-400", border: "border-purple-500/25" },
              { icon: Ticket, name: "Ticket d'Or", cost: "3-7 ECL", desc: "Acc\u00e8s prioritaire \u00e0 la prochaine saison de l'Exp\u00e9dition.", color: "text-amber-400", border: "border-amber-500/30" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`p-5 rounded-xl bg-[#0F0F12] border ${item.border} flex items-start gap-4`}
              >
                <item.icon className={`w-5 h-5 ${item.color} shrink-0 mt-0.5`} />
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-white">{item.name}</span>
                    <span className="text-xs font-mono text-purple-400">{item.cost}</span>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Comment gagner ──────────────────────────────────────── */}
        <section className="py-20 container-main max-w-4xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-widest text-orange-400/60 mb-4 flex items-center gap-2">
            <span className="w-3 h-px bg-orange-400/50 inline-block" />
            Gagner des pi&egrave;ces
          </p>
          <h2 className="text-3xl font-bold mb-10">Mining Social</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0F0F12] border border-white/8">
              <MessageSquare className="w-5 h-5 text-orange-400 mb-4" />
              <h3 className="font-bold mb-1">Chat</h3>
              <p className="text-sm text-white/40 mb-3">Ecrivez dans les salons texte pour gagner du Bronze.</p>
              <span className="text-xs font-mono text-orange-400">Max 50 BR / jour</span>
            </div>
            <div className="p-6 rounded-2xl bg-[#0F0F12] border border-white/8">
              <Mic className="w-5 h-5 text-orange-400 mb-4" />
              <h3 className="font-bold mb-1">Vocal</h3>
              <p className="text-sm text-white/40 mb-3">Parlez dans les salons discussion pour gagner du Bronze.</p>
              <span className="text-xs font-mono text-orange-400">Max 60 BR / jour</span>
            </div>
            <div className="p-6 rounded-2xl bg-[#0F0F12] border border-white/8">
              <Sparkles className="w-5 h-5 text-amber-400 mb-4" />
              <h3 className="font-bold mb-1">Services</h3>
              <p className="text-sm text-white/40 mb-3">Vendez vos comp&eacute;tences aux autres membres en Or.</p>
              <span className="text-xs font-mono text-amber-400">10 &mdash; 200 EX</span>
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section className="py-24 container-main text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Rejoignez le Discord pour r&eacute;clamer votre capital.
            </h2>
            <p className="text-white/40 mb-8 max-w-md mx-auto">
              Le reste, c'est votre talent.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href={process.env.NEXT_PUBLIC_DISCORD_URL || "https://dsc.gg/expedition"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-[#5865F2] text-white font-bold hover:bg-[#4752c4] transition-colors"
              >
                Rejoindre le Discord
              </a>
              <Link
                href="/pricing"
                className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
              >
                Voir les tarifs
              </Link>
            </div>
          </motion.div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
