"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import { motion } from "framer-motion";
import { Gift, Share2, Banknote, ArrowRight, Users, ShieldCheck, Send, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
    desc: "Recevez 42% de commission sur chaque abonnement généré, pendant 6 mois par filleul.",
  },
];

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL;

const channels = [
  { id: "youtube", label: "YouTube" },
  { id: "tiktok", label: "TikTok" },
  { id: "twitter", label: "Twitter / X" },
  { id: "instagram", label: "Instagram" },
  { id: "personal", label: "Réseau personnel / amis" },
  { id: "other", label: "Autre" },
];

export default function AmbassadorPage() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referrals, setReferrals] = useState(10);

  const toggleChannel = (id: string) => {
    setSelectedChannels(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || selectedChannels.length === 0) {
      setError("Remplissez tous les champs obligatoires.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await fetch(`${WORKER_URL}/ambassador/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), contact: contact.trim(), channels: selectedChannels, link: link.trim() }),
      });
      setSent(true);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full min-h-screen bg-[#06051a] text-white overflow-x-hidden">
      <PageBackground />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">

        <div className="container-main flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs font-mono uppercase tracking-widest text-purple-400/60 mb-10 flex items-center justify-center gap-2">
              <span className="w-3 h-px bg-purple-400/50 inline-block" />
              Programme d&apos;affiliation
            </p>

            {/* The number IS the hook — give it impossible-to-miss scale */}
            <div className="mb-4">
              <span className="text-[60px] sm:text-[100px] md:text-[140px] lg:text-[180px] font-black leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-500 select-none">
                42%
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-white/90">
              de commission. Pendant 6 mois.
            </h1>

            <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              Recommandez Expédition à votre communauté et gagnez sur chaque abonnement généré,{" "}
              <span className="text-white font-medium">pendant 6 mois par filleul</span>. Sans plafond.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#candidature"
                className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2"
              >
                Devenir Affili&eacute; <ArrowRight className="w-5 h-5" />
              </a>
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

      {/* Simulateur de gains — interactive slider */}
      <section className="py-20 relative">
        <div className="container-main max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-[#0F0F12] border border-white/10 shadow-2xl"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Simulez vos gains</h2>
            <p className="text-white/40 text-sm text-center mb-8">D&eacute;placez le curseur pour voir combien vous gagnez.</p>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-white/50">Nombre de filleuls</span>
                <span className="text-2xl font-black text-white">{referrals}</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={referrals}
                onChange={(e) => setReferrals(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(139,92,246) ${referrals}%, rgba(255,255,255,0.1) ${referrals}%)`,
                }}
              />
              <div className="flex justify-between text-xs text-white/25 mt-1">
                <span>1</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                <p className="text-xs text-white/40 mb-1">Par mois</p>
                <p className="text-3xl font-black text-purple-400">~{Math.round(referrals * 5)}&euro;</p>
                <p className="text-xs text-white/30 mt-1">pendant 6 mois</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                <p className="text-xs text-white/40 mb-1">Total sur 6 mois</p>
                <p className="text-3xl font-black text-green-400">~{Math.round(referrals * 5 * 6)}&euro;</p>
                <p className="text-xs text-white/30 mt-1">pour {referrals} filleul{referrals > 1 ? "s" : ""}</p>
              </div>
            </div>

            <p className="text-xs text-white/25 text-center">
              Bas&eacute; sur 42% de commission sur 11,99&euro;/mois, pendant 6 mois par filleul.
            </p>
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

      {/* Formulaire de candidature */}
      <section id="candidature" className="py-24 relative overflow-hidden">

        <div className="container-main max-w-xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Rejoindre le programme</h2>
            <p className="text-white/60">
              Remplissez ce formulaire et on vous recontacte rapidement.
            </p>
          </div>

          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-[#0F0F12] border border-white/10 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Candidature envoy&eacute;e !</h3>
              <p className="text-white/60">
                Merci pour votre int&eacute;r&ecirc;t. On revient vers vous tr&egrave;s vite.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="p-8 rounded-2xl bg-[#0F0F12] border border-white/10 shadow-2xl space-y-6"
            >
              {/* Nom / Pseudo */}
              <div className="space-y-2">
                <label htmlFor="amb-name" className="text-xs font-mono text-white/40 uppercase">Nom / Pseudo *</label>
                <input
                  id="amb-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Votre nom ou pseudo"
                  className="w-full h-11 px-4 bg-white/5 rounded-xl border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all text-sm"
                />
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <label htmlFor="amb-contact" className="text-xs font-mono text-white/40 uppercase">Moyen de contact * <span className="normal-case text-white/25">(email, Discord, t&eacute;l&eacute;phone...)</span></label>
                <input
                  id="amb-contact"
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  placeholder="votre@email.com ou Discord#1234"
                  className="w-full h-11 px-4 bg-white/5 rounded-xl border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all text-sm"
                />
              </div>

              {/* Canaux de promotion */}
              <div className="space-y-3">
                <label className="text-xs font-mono text-white/40 uppercase">Comment comptez-vous promouvoir Exp&eacute;dition ? *</label>
                <div className="grid grid-cols-2 gap-2">
                  {channels.map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => toggleChannel(ch.id)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                        selectedChannels.includes(ch.id)
                          ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                          : "bg-white/5 border-white/10 text-white/50 hover:bg-white/[0.07] hover:text-white/70"
                      }`}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lien optionnel */}
              <div className="space-y-2">
                <label htmlFor="amb-link" className="text-xs font-mono text-white/40 uppercase">Lien vers votre cha&icirc;ne / compte <span className="normal-case text-white/25">(optionnel)</span></label>
                <input
                  id="amb-link"
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://youtube.com/@votrechaine"
                  className="w-full h-11 px-4 bg-white/5 rounded-xl border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all text-sm"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-100 transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Envoyer ma candidature
                  </>
                )}
              </button>

              <p className="text-center text-xs text-white/25">
                On vous recontacte sous 48h.
              </p>
            </motion.form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
