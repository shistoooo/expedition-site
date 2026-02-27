"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";
import { motion } from "framer-motion";
import { Gift, Share2, Banknote, ArrowRight, Users, Repeat, ShieldCheck } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: Gift,
    title: "Inscrivez-vous",
    desc: "Activez le programme ambassadeur depuis votre espace compte. Vous recevez un code de parrainage unique.",
  },
  {
    icon: Share2,
    title: "Partagez votre code",
    desc: "Partagez votre lien personnalisé avec votre communauté : réseaux sociaux, vidéos, articles, Discord...",
  },
  {
    icon: Banknote,
    title: "Gagnez de l'argent",
    desc: "Recevez 50% de commission sur chaque abonnement généré. Paiement récurrent, chaque mois, tant que l'abonné reste actif.",
  },
];

export default function AmbassadorPage() {
  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <CursorGlow />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-24 md:pt-48 md:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />

        <div className="container-main flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-8 backdrop-blur-md">
              <Gift className="w-4 h-4" />
              <span>Programme Ambassadeur</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Partagez. Parrainez.{" "}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                Gagnez.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              Recommandez Expédition à votre communauté et gagnez{" "}
              <span className="text-purple-300 font-semibold">50% de commission récurrente</span>{" "}
              sur chaque abonnement généré.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/account"
                className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2"
              >
                Devenir Ambassadeur <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#comment-ca-marche"
                className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-lg hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                Comment ça marche ?
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" className="py-24 relative">
        <div className="container-main">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comment ça marche ?</h2>
            <p className="text-white/60">Trois étapes simples pour commencer à gagner.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors group relative"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-white/60 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission */}
      <section className="py-24 border-t border-white/5 bg-white/[0.02]">
        <div className="container-main">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Vos gains, en détail</h2>
            <p className="text-white/60">Une commission généreuse, récurrente, sans plafond.</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-[#0F0F12] border border-white/10 shadow-2xl"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                <div className="text-center sm:text-left">
                  <div className="text-sm text-white/40 mb-1">L&apos;abonné paie</div>
                  <div className="text-4xl font-bold">9,99€</div>
                  <div className="text-white/40 text-sm">/mois</div>
                </div>

                <div className="hidden sm:block">
                  <ArrowRight className="w-8 h-8 text-purple-400" />
                </div>
                <div className="sm:hidden">
                  <div className="w-8 h-8 text-purple-400 flex items-center justify-center text-2xl">↓</div>
                </div>

                <div className="text-center sm:text-right">
                  <div className="text-sm text-purple-300 mb-1">Vous recevez</div>
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    ~5€
                  </div>
                  <div className="text-purple-300/60 text-sm">/mois par filleul</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <Repeat className="w-5 h-5 text-purple-400 shrink-0" />
                <p className="text-sm text-purple-200">
                  <strong>Commission récurrente :</strong> vous gagnez chaque mois, tant que votre filleul reste abonné. 10 filleuls = ~50€/mois passifs.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Confiance Stripe Connect */}
      <section className="py-24 border-t border-white/5">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Paiements sécurisés via Stripe</h2>
            <p className="text-white/60 leading-relaxed mb-8">
              Vos commissions sont versées directement sur votre compte bancaire via{" "}
              <span className="text-white font-medium">Stripe Connect</span>.
              Pas d&apos;intermédiaire, pas de seuil minimum, pas de délai artificiel.
              Vous gardez le contrôle total via votre dashboard Stripe.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Banknote, label: "Virement direct" },
                { icon: ShieldCheck, label: "Sécurisé par Stripe" },
                { icon: Users, label: "Sans plafond" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2"
                >
                  <item.icon className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-medium text-white/70">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none" />

        <div className="container-main text-center max-w-2xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold mb-6">Prêt à commencer ?</h2>
          <p className="text-xl text-white/60 mb-10">
            Activez le programme ambassadeur depuis votre espace compte et commencez à partager dès aujourd&apos;hui.
          </p>

          <Link
            href="/account"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25"
          >
            Activer le programme
            <Gift className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-sm text-white/30">
            Accessible à tous les abonnés Expédition.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
