"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Check, Rocket, Bell, Star } from "lucide-react";
import PageBackground from "@/components/PageBackground";
import { SALES_OPEN } from "@/lib/salesConfig";
import { useRef, useState, useCallback } from "react";

const plans = [
  {
    name: "Annuel",
    price: "99,99\u20ac",
    priceUnit: "/an",
    note: "8,33\u20ac/mois \u2014 4 mois offerts",
    featured: false,
  },
  {
    name: "Mensuel + Discord",
    price: "7,99\u20ac",
    priceUnit: "/mois",
    note: "Avec le r\u00f4le Discord actif",
    badge: "Meilleure offre",
    featured: true,
  },
  {
    name: "Mensuel",
    price: "11,99\u20ac",
    priceUnit: "/mois",
    note: "Sans engagement",
    featured: false,
  },
];

const features = [
  "Acc\u00e8s complet au Launcher (Mac/Windows)",
  "TubeForge Pro \u2014 8K, sans pub",
  "ClipForge \u2014 Clips auto + s\u00e9lection illimit\u00e9e (beta bient\u00f4t)",
  "ReviewForge \u2014 Review s\u00e9curis\u00e9 (\u00e9t\u00e9 2026)",
  "Badge Discord Pionnier",
  "Acc\u00e8s Discord priv\u00e9 : retours directs avec le dev",
  "Tarif bloqu\u00e9 tant que vous restez abonn\u00e9",
  "Acc\u00e8s garanti aux futurs outils",
];

function PricingCard({ plan, index }: { plan: typeof plans[number]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`pricing-card relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${plan.featured ? "md:-mt-3 md:mb-[-12px]" : ""}`}
      style={plan.featured ? {
        background: "linear-gradient(160deg, rgba(139,92,246,0.12) 0%, rgba(15,15,22,0.98) 40%)",
        border: "1px solid rgba(139,92,246,0.35)",
        boxShadow: "0 0 60px rgba(139,92,246,0.2), 0 20px 40px rgba(0,0,0,0.4)",
      } : {
        background: isHovered
          ? "linear-gradient(160deg, rgba(139,92,246,0.08) 0%, rgba(13,13,22,0.95) 50%)"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${isHovered ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.06)"}`,
        boxShadow: isHovered
          ? "0 0 40px rgba(139,92,246,0.15), 0 8px 32px rgba(0,0,0,0.3)"
          : "none",
      }}
    >
      {/* Mouse spotlight */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-[inherit] z-[1]"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, ${plan.featured ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.25)"} 0%, transparent 50%)`,
        }}
      />

      {/* Top edge glow on hover for non-featured */}
      {!plan.featured && (
        <div
          className="absolute top-0 left-0 right-0 h-24 pointer-events-none transition-opacity duration-500 rounded-t-[inherit] z-[1]"
          style={{
            opacity: isHovered ? 1 : 0,
            background: "linear-gradient(180deg, rgba(139,92,246,0.15) 0%, transparent 100%)",
          }}
        />
      )}

      {/* Badge */}
      {plan.featured && plan.badge && (
        <div className="flex justify-center pt-5 relative z-[2]">
          <div
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              boxShadow: "0 0 16px rgba(139,92,246,0.5)",
              color: "#fff",
            }}
          >
            <Star className="w-3.5 h-3.5" />
            {plan.badge}
          </div>
        </div>
      )}

      {/* Top gradient for featured */}
      {plan.featured && (
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(139,92,246,0.18) 0%, transparent 100%)" }}
        />
      )}

      <div className="relative p-6 md:p-8 flex flex-col flex-1 items-center text-center z-[2]">
        {/* Plan name */}
        <h2 className={`font-bold mb-6 ${plan.featured ? "text-lg text-white" : "text-lg text-white/50 pt-2"}`}>
          {plan.name}
        </h2>

        {/* Price */}
        <div className="mb-2">
          <div className="flex items-baseline justify-center gap-1">
            <span className={`font-black tracking-tight ${plan.featured ? "text-5xl text-white" : "text-4xl text-white/70"}`}>
              {plan.price}
            </span>
            <span className={`text-sm ml-1 ${plan.featured ? "text-white/40" : "text-white/30"}`}>
              {plan.priceUnit}
            </span>
          </div>
        </div>

        {/* Note */}
        <p className={`text-sm mb-8 ${plan.featured ? "text-green-400 font-semibold" : "text-white/35"}`}>
          {plan.note}
        </p>

        {/* CTA */}
        <Link
          href="/checkout"
          className={`group/btn w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 relative overflow-hidden ${
            plan.featured ? "" : "border border-white/10 hover:border-white/20 text-white/60 hover:text-white/80"
          }`}
          style={plan.featured ? {
            background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)",
            color: "#fff",
            boxShadow: "0 0 24px rgba(139,92,246,0.45), 0 0 60px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.15)",
          } : {
            background: "rgba(255,255,255,0.03)",
          }}
        >
          {plan.featured && (
            <div
              className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.08) 100%)",
              }}
            />
          )}
          <span className="relative z-10 inline-flex items-center gap-2">
            {SALES_OPEN ? "Commencer" : "\u00catre pr\u00e9venu"}
            {SALES_OPEN ? <Rocket className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          </span>
        </Link>
      </div>
    </motion.div>
  );
}

export default function PricingPage() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden relative bg-[#06051a] text-white">
      <PageBackground />
      {/* Dim stars behind pricing content */}
      <div className="fixed inset-0 bg-[#06051a]/60 pointer-events-none z-[3]" />
      <Navbar />

      <main className="pt-36 pb-32 container-main relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-[-0.03em]">
            Un abonnement, tous les outils.
          </h1>
          <p className="text-white/50 text-lg">
            M&ecirc;mes fonctionnalit&eacute;s, m&ecirc;me acc&egrave;s. Choisissez simplement votre rythme.
          </p>
        </motion.div>

        {/* ── 3 PRICE CARDS ──────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch mb-16">
          {plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} index={index} />
          ))}
        </div>

        {/* ── SHARED FEATURES ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto mb-16"
        >
          <h3 className="text-center text-white/40 text-sm font-mono uppercase tracking-widest mb-8">
            Inclus dans tous les plans
          </h3>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {features.map((feature, i) => (
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
                <span className="text-white/70">{feature}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs mt-8 font-mono" style={{ color: "rgba(255,255,255,0.28)" }}>
            Annulable &agrave; tout moment. Sans engagement.
          </p>
        </motion.div>

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
      </main>
      <Footer />
    </div>
  );
}
