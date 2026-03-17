"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Bell, Star, Rocket } from "lucide-react";
import Link from "next/link";
import { SALES_OPEN } from "@/lib/salesConfig";
import NumberTicker from "@/components/NumberTicker";
import { useRef, useState, useCallback } from "react";

const plans = [
  {
    name: "Annuel",
    slug: "annual",
    price: "99,99\u20ac",
    priceUnit: "/an",
    note: "8,33\u20ac/mois \u2014 4 mois offerts",
    featured: false,
  },
  {
    name: "Mensuel + Discord",
    slug: "monthly-discord",
    price: "7,99\u20ac",
    priceUnit: "/mois",
    note: "Avec le r\u00f4le Discord actif",
    badge: "Meilleure offre",
    featured: true,
  },
  {
    name: "Mensuel",
    slug: "monthly",
    price: "11,99\u20ac",
    priceUnit: "/mois",
    note: "Sans engagement",
    featured: false,
  },
];

const features = [
  "Expedition Launcher (Mac/Windows)",
  "TubeForge Pro \u2014 8K, sans pub (Vague 1)",
  "ClipForge \u2014 Clips auto + s\u00e9lection illimit\u00e9e (Vague 2)",
  "ReviewForge \u2014 Review s\u00e9curis\u00e9 (Vague 3)",
  "Badge Discord Exclusif 'Pionnier'",
  "Tarif bloqu\u00e9 tant que vous restez abonn\u00e9",
];

function PricingCard({ plan }: { plan: typeof plans[number] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`pricing-card relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${plan.featured ? "md:-mt-3 md:mb-[-12px]" : ""}`}
      style={plan.featured ? {
        background: "linear-gradient(160deg, rgba(139,92,246,0.12) 0%, rgba(13,13,22,0.98) 40%)",
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
        <div className="flex justify-center pt-5">
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

      <div className="relative p-6 md:p-8 flex flex-col flex-1 items-center text-center">
        {/* Plan name */}
        <h3 className={`font-bold mb-6 ${plan.featured ? "text-lg text-white" : "text-lg text-white/50 pt-2"}`}>
          {plan.name}
        </h3>

        {/* Price */}
        <div className="mb-2">
          <div className="flex items-baseline justify-center gap-1">
            <NumberTicker
              value={plan.price.replace("\u20ac", "")}
              suffix={"\u20ac"}
              className={`font-black tracking-tight ${plan.featured ? "text-5xl text-white" : "text-4xl text-white/70"}`}
            />
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
          href={`/checkout?plan=${plan.slug}`}
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
    </div>
  );
}

export default function HomePricing() {
  return (
    <section id="pricing" className="pt-32 pb-16 md:pt-40 md:pb-20 relative">
      {/* Pricing nebula */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(139,92,246,0.14) 0%, rgba(99,60,200,0.07) 45%, transparent 72%)',
          filter: 'blur(2px)',
        }}
      />
      <div className="container-main max-w-5xl">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black tracking-[-0.03em] mb-4">
            Un abonnement, tous les outils
          </h2>
          <p className="text-white/45 text-base max-w-lg mx-auto">
            Tarif Pionnier bloqu&eacute; &agrave; vie. Nouveaux outils inclus sans surco&ucirc;t.
          </p>
        </motion.div>

        {/* 3 Price cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch mb-10"
        >
          {plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} />
          ))}
        </motion.div>

        {/* Features — shared */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-center text-white/30 text-xs font-mono uppercase tracking-widest mb-6">
            Inclus imm&eacute;diatement et &agrave; venir
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-white/60">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Links */}
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
        </motion.div>
      </div>
    </section>
  );
}
