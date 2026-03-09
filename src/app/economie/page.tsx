"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Coins,
  Gem,
  Sparkles,
  MessageSquare,
  Mic,
  Star,
  Megaphone,
  Film,
  Youtube,
  Ticket,
  Shield,
  Shuffle,
  Clock,
  Zap,
  Info,
  Palette,
  Frame,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";
import WalletSection from "@/components/WalletSection";

// ─── Animation helpers ──────────────────────────────────────────────────────

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: EASE_OUT_EXPO, delay },
  }),
};

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({
  children,
  color = "text-purple-400/60",
  lineColor = "bg-purple-400/50",
}: {
  children: React.ReactNode;
  color?: string;
  lineColor?: string;
}) {
  return (
    <p
      className={`text-xs font-mono uppercase tracking-widest ${color} mb-6 flex items-center gap-2`}
    >
      <span className={`w-3 h-px ${lineColor} inline-block`} />
      {children}
    </p>
  );
}

// ─── Coin ─────────────────────────────────────────────────────────────────────

function Coin({
  size = 80,
  gradient,
  shimmerColor,
  label,
  symbol,
  className = "",
  animDelay = 0,
}: {
  size?: number;
  gradient: string;
  shimmerColor: string;
  label: string;
  symbol: string;
  className?: string;
  animDelay?: number;
}) {
  return (
    <motion.div
      className={`relative flex flex-col items-center gap-3 ${className}`}
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: animDelay }}
    >
      <div
        className="absolute rounded-full blur-2xl opacity-40"
        style={{
          width: size * 1.4,
          height: size * 0.5,
          background: shimmerColor,
          bottom: -size * 0.15,
          left: "50%",
          transform: "translateX(-50%)",
        }}
        aria-hidden="true"
      />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: animDelay,
        }}
        className="relative rounded-full flex items-center justify-center font-black text-white select-none"
        style={{
          width: size,
          height: size,
          background: gradient,
          boxShadow: `0 0 0 3px ${shimmerColor}30, 0 0 40px ${shimmerColor}50, 0 20px 60px ${shimmerColor}30, inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -2px 0 rgba(0,0,0,0.2)`,
          fontSize: size * 0.28,
        }}
        aria-label={label}
      >
        <div
          className="absolute rounded-full"
          style={{
            inset: size * 0.1,
            border: `${size * 0.018}px solid rgba(255,255,255,0.15)`,
          }}
          aria-hidden="true"
        />
        {symbol}
      </motion.div>
      <span className="text-xs font-mono uppercase tracking-widest text-white/45">
        {label}
      </span>
    </motion.div>
  );
}

// ─── Shop Card ────────────────────────────────────────────────────────────────
// "Sur demande" remplace "Bientot disponible" — dit a l'utilisateur quoi faire

type ShopRarity = "common" | "rare" | "epic" | "legendary";

interface ShopCardData {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  cost: string;
  description: string;
  rarity: ShopRarity;
  visualColor: string;
  visualGradient: string;
}

const RARITY_CONFIG: Record<
  ShopRarity,
  {
    label: string;
    borderColor: string;
    glowColor: string;
    badgeColor: string;
    badgeBg: string;
  }
> = {
  common: {
    label: "Commun",
    borderColor: "border-white/12",
    glowColor: "rgba(255,255,255,0.06)",
    badgeColor: "text-white/50",
    badgeBg: "bg-white/8",
  },
  rare: {
    label: "Rare",
    borderColor: "border-blue-500/30",
    glowColor: "rgba(59,130,246,0.15)",
    badgeColor: "text-blue-400",
    badgeBg: "bg-blue-500/10",
  },
  epic: {
    label: "Epique",
    borderColor: "border-purple-500/40",
    glowColor: "rgba(139,92,246,0.18)",
    badgeColor: "text-purple-400",
    badgeBg: "bg-purple-500/12",
  },
  legendary: {
    label: "Legendaire",
    borderColor: "border-amber-500/50",
    glowColor: "rgba(245,158,11,0.22)",
    badgeColor: "text-amber-400",
    badgeBg: "bg-amber-500/12",
  },
};

function ShopCard({ card, index }: { card: ShopCardData; index: number }) {
  const [hovered, setHovered] = useState(false);
  const rarity = RARITY_CONFIG[card.rarity];
  const Icon = card.icon;

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index * 0.1}
      className={`relative rounded-2xl bg-[#0F0F12] border ${rarity.borderColor} overflow-hidden group cursor-default`}
      style={{
        boxShadow: hovered
          ? `0 0 40px ${rarity.glowColor}, 0 20px 60px ${rarity.glowColor}`
          : `0 8px 30px ${rarity.glowColor}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -6, transition: { duration: 0.35, ease: EASE_OUT_EXPO } }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${card.visualColor}, transparent)`,
          opacity: hovered ? 1 : 0.3,
        }}
        aria-hidden="true"
      />
      <div
        className="relative h-40 flex items-center justify-center overflow-hidden"
        style={{ background: card.visualGradient }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)",
          }}
        />
        {card.rarity === "legendary" && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-amber-300"
                style={{
                  top: `${20 + i * 11}%`,
                  left: `${10 + i * 16}%`,
                }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], y: [0, -15, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.35,
                  ease: "easeInOut",
                }}
              />
            ))}
          </>
        )}
        <motion.div
          animate={
            hovered
              ? { scale: 1.15, rotate: card.rarity === "legendary" ? 5 : 0 }
              : { scale: 1, rotate: 0 }
          }
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          <Icon className="w-14 h-14 text-white/80" />
        </motion.div>
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span
            className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full ${rarity.badgeBg} ${rarity.badgeColor}`}
          >
            {rarity.label}
          </span>
          <div className="flex items-center gap-1">
            <Gem className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-sm font-black font-mono text-purple-400">
              {card.cost} ECL
            </span>
          </div>
        </div>
        <h3 className="text-base font-bold text-white leading-tight">{card.name}</h3>
        <p className="text-xs text-white/45 leading-relaxed">{card.description}</p>
        {/* Dit exactement quoi faire — pas "Bientot disponible" */}
        <div
          className="w-full h-9 rounded-xl text-xs font-mono flex items-center justify-center gap-2"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "rgba(255,255,255,0.28)",
          }}
        >
          Sur demande — #boutique-eclats
        </div>
      </div>
    </motion.div>
  );
}

const SHOP_CARDS: ShopCardData[] = [
  {
    icon: Megaphone,
    name: "Annonce Vitrine",
    cost: "2",
    description:
      "Mettez en avant votre service dans le salon dédié pendant 7 jours. Maximum de visibilité auprès des membres actifs.",
    rarity: "common",
    visualColor: "rgba(99,102,241,0.8)",
    visualGradient:
      "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)",
  },
  {
    icon: Film,
    name: "Portfolio Vidéo",
    cost: "5",
    description:
      "Votre meilleure vidéo épinglée dans le salon Portfolio. Montrez votre travail à toute la communauté.",
    rarity: "rare",
    visualColor: "rgba(59,130,246,0.8)",
    visualGradient:
      "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
  },
  {
    icon: Youtube,
    name: "Shoutout YouTube",
    cost: "10",
    description:
      "Mise en avant de votre chaîne dans les annonces officielles. 2 places disponibles par mois. Réservé aux créateurs actifs.",
    rarity: "epic",
    visualColor: "rgba(239,68,68,0.8)",
    visualGradient:
      "linear-gradient(135deg, #1a0a0a 0%, #450a0a 40%, #7f1d1d 70%, #1a0a0a 100%)",
  },
  {
    icon: Ticket,
    name: "Ticket d'Or",
    cost: "3 – 7",
    description:
      "Accès prioritaire à la prochaine saison de l'Expédition. Le coût varie selon la taille du serveur.",
    rarity: "legendary",
    visualColor: "rgba(245,158,11,0.9)",
    visualGradient:
      "linear-gradient(135deg, #1a1100 0%, #451a00 30%, #78350f 60%, #d97706 80%, #f59e0b 100%)",
  },
];

// ─── Gacha data ───────────────────────────────────────────────────────────────

const GACHA_RARITIES = [
  {
    label: "Commun",
    pct: "60%",
    color: "#9ca3af",
    glow: "rgba(156,163,175,0.25)",
    bg: "rgba(156,163,175,0.08)",
    border: "rgba(156,163,175,0.15)",
  },
  {
    label: "Rare",
    pct: "25%",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.35)",
    bg: "rgba(96,165,250,0.10)",
    border: "rgba(96,165,250,0.25)",
  },
  {
    label: "Épique",
    pct: "12%",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.4)",
    bg: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.30)",
  },
  {
    label: "Légendaire",
    pct: "3%",
    color: "#fbbf24",
    glow: "rgba(251,191,36,0.5)",
    bg: "rgba(251,191,36,0.12)",
    border: "rgba(251,191,36,0.40)",
  },
];

const GACHA_REWARDS = [
  { name: "Bronze ×50", rarity: 0, icon: Coins },
  { name: "Bronze ×150", rarity: 0, icon: Coins },
  { name: "Bronze ×300", rarity: 1, icon: Coins },
  { name: "Badge Commun", rarity: 0, icon: Shield },
  { name: "Rôle Coloré", rarity: 1, icon: Palette },
  { name: "Fragment d'Éclat", rarity: 1, icon: Sparkles },
  { name: "Frame Animée", rarity: 2, icon: Frame },
  { name: "Badge Exclusif", rarity: 2, icon: Star },
  { name: "Éclat Complet", rarity: 2, icon: Gem },
  { name: "Badge Légendaire", rarity: 3, icon: Star },
  { name: "Frame Dorée", rarity: 3, icon: Frame },
  { name: "Éclats ×3", rarity: 3, icon: Gem },
];

// ─── Service tiers ────────────────────────────────────────────────────────────

const SERVICE_TIERS = [
  {
    name: "Micro-Tâche",
    range: "10 – 30 EX",
    duration: "10 – 30 min",
    color: "#22d3ee",
    examples: [
      "Feedback vidéo",
      "Test utilisateur",
      "Brainstorming",
      "Détourage rapide",
    ],
  },
  {
    name: "Tâche Standard",
    range: "30 – 90 EX",
    duration: "30 min – 1h30",
    color: "#a78bfa",
    examples: [
      "Miniature YouTube",
      "Montage court",
      "Script",
      "Bug fix",
      "Formation express",
    ],
    highlight: true,
  },
  {
    name: "Projet Complexe",
    range: "90 – 200 EX",
    duration: "1h30 – 3h",
    color: "#f59e0b",
    examples: [
      "Audit chaîne",
      "Dérushage",
      "Overlay stream",
      "Montage dynamique",
    ],
  },
];

// ─── Starting capital ─────────────────────────────────────────────────────────

const STARTING_CAPITAL = [
  {
    wave: "Vague 1",
    members: "0 – 300 membres",
    gold: 80,
    bronze: 130,
    color: "#f59e0b",
  },
  {
    wave: "Vague 2",
    members: "301 – 500 membres",
    gold: 60,
    bronze: 90,
    color: "#60a5fa",
  },
  {
    wave: "Tardif",
    members: "501+ membres",
    gold: 40,
    bronze: 50,
    color: "#9ca3af",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EconomiePage() {
  return (
    <div className="w-full min-h-screen bg-[#06051a] text-white overflow-x-hidden">
      <PageBackground />
      <Navbar />

      {/* ================================================================
          1. HERO
      ================================================================ */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[180px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, rgba(139,92,246,0.04) 50%, transparent 80%)",
          }}
          aria-hidden="true"
        />

        <div className="container-main flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          >
            <SectionLabel color="text-amber-400/60" lineColor="bg-amber-400/50">
              Système économique
            </SectionLabel>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-6"
          >
            L&apos;Économie{" "}
            <span
              className="block"
              style={{
                background:
                  "linear-gradient(135deg, #f59e0b 0%, #fbbf24 40%, #a78bfa 80%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Expédition
            </span>
          </motion.h1>

          <div className="flex flex-wrap items-end justify-center gap-10 md:gap-16 mb-10">
            <Coin
              size={90}
              gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 40%, #fbbf24 70%, #f59e0b 100%)"
              shimmerColor="#f59e0b"
              label="Or (EX)"
              symbol="EX"
              animDelay={0.4}
            />
            <Coin
              size={72}
              gradient="linear-gradient(135deg, #ea580c 0%, #c2410c 40%, #f97316 70%, #ea580c 100%)"
              shimmerColor="#f97316"
              label="Bronze (BR)"
              symbol="BR"
              animDelay={0.55}
            />
            <Coin
              size={64}
              gradient="linear-gradient(135deg, #7c3aed 0%, #6d28d9 40%, #a78bfa 70%, #7c3aed 100%)"
              shimmerColor="#8b5cf6"
              label="Éclats (ECL)"
              symbol="ECL"
              animDelay={0.7}
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.25 }}
            className="text-lg md:text-xl text-white/55 max-w-xl mx-auto leading-relaxed mb-6"
          >
            La monnaie fait circuler les talents, pas les interactions. Gagnez,
            échangez, et dépensez dans un marché{" "}
            <span className="text-white/80 font-medium">
              géré par la communauté
            </span>
            .
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-[11px] font-mono text-white/25 tracking-wide"
          >
            Plafond portefeuille : 500 EX — Monnaies internes Discord uniquement
          </motion.p>
        </div>
      </section>

      {/* ================================================================
          2. LES TROIS DEVISES
          Layout asymétrique : texte éditorial à gauche,
          tableau de conversion numérique à droite.
          Remplace les 3 cartes identiques icône + ticker + description + pill.
      ================================================================ */}
      <section className="py-20 relative border-t border-white/5">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left — éditorial */}
            <div>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
              >
                <SectionLabel
                  color="text-amber-400/60"
                  lineColor="bg-amber-400/50"
                >
                  Les devises
                </SectionLabel>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-8 leading-tight">
                  Trois monnaies,
                  <br />
                  un seul flux
                </h2>
              </motion.div>

              <div className="space-y-8">
                {[
                  {
                    symbol: "EX",
                    name: "Pièces d'Or",
                    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
                    glow: "rgba(245,158,11,0.35)",
                    text: "La monnaie principale. Utilisée pour les services, les échanges, et la boutique. Plafonnée à 500 EX pour maintenir l'équilibre.",
                    delay: 0.08,
                  },
                  {
                    symbol: "BR",
                    name: "Bronze",
                    gradient: "linear-gradient(135deg, #ea580c, #f97316)",
                    glow: "rgba(234,88,12,0.35)",
                    text: "Gagnée passivement via l'activité Discord. Se convertit en Or. Récompense les membres présents, pas les spammeurs.",
                    delay: 0.16,
                  },
                  {
                    symbol: "ECL",
                    name: "Points d'Éclat",
                    gradient: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                    glow: "rgba(139,92,246,0.35)",
                    text: "Monnaie de prestige. Convertissez vos Pièces d'Or pour débloquer les avantages exclusifs de la boutique premium.",
                    delay: 0.24,
                  },
                ].map((currency) => (
                  <motion.div
                    key={currency.symbol}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={currency.delay}
                    className="flex gap-5"
                  >
                    <div
                      className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white"
                      style={{
                        background: currency.gradient,
                        boxShadow: `0 0 20px ${currency.glow}`,
                      }}
                      aria-hidden="true"
                    >
                      {currency.symbol}
                    </div>
                    <div>
                      <p className="font-bold text-white mb-1">{currency.name}</p>
                      <p className="text-sm text-white/50 leading-relaxed">
                        {currency.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right — taux de conversion */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.15}
              className="lg:pt-16"
            >
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-6 flex items-center gap-2">
                <span className="w-3 h-px bg-white/20 inline-block" />
                Taux de conversion
              </p>

              <div
                className="p-8 rounded-2xl bg-[#0F0F12] border border-white/8"
                style={{ boxShadow: "0 0 60px rgba(245,158,11,0.04)" }}
              >
                <div className="space-y-6">
                  <div>
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-white/30 text-xs font-mono">
                        Bronze vers Or
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black font-mono text-orange-400">
                          20
                        </span>
                        <span className="text-xs font-mono text-white/30">BR</span>
                        <ArrowRight
                          className="w-4 h-4 text-white/20 mx-1"
                          aria-hidden="true"
                        />
                        <span className="text-3xl font-black font-mono text-amber-400">
                          1
                        </span>
                        <span className="text-xs font-mono text-white/30">EX</span>
                      </div>
                    </div>
                    <div className="h-px bg-white/6" aria-hidden="true" />
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-white/30 text-xs font-mono">
                        Or vers Éclat
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black font-mono text-amber-400">
                          100
                        </span>
                        <span className="text-xs font-mono text-white/30">EX</span>
                        <ArrowRight
                          className="w-4 h-4 text-white/20 mx-1"
                          aria-hidden="true"
                        />
                        <span className="text-3xl font-black font-mono text-purple-400">
                          1
                        </span>
                        <span className="text-xs font-mono text-white/30">ECL</span>
                      </div>
                    </div>
                    <div className="h-px bg-white/6" aria-hidden="true" />
                  </div>

                  <p className="text-[11px] font-mono text-white/20 text-right tracking-wide">
                    2 000 BR = 1 ECL. Il faut le mériter.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-white/25">
                <Info className="w-3 h-3 shrink-0" aria-hidden="true" />
                Les conversions se font via commande bot dans #économie
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================
          3. WALLET
      ================================================================ */}
      <section
        className="py-20 relative border-t border-white/5"
        aria-labelledby="wallet-heading"
      >
        <div className="container-main">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="mb-10"
          >
            <SectionLabel color="text-amber-400/60" lineColor="bg-amber-400/50">
              Portefeuille
            </SectionLabel>
            <h2
              id="wallet-heading"
              className="text-3xl md:text-4xl font-black tracking-tight mb-2"
            >
              Votre solde
            </h2>
            <p className="text-white/40 text-sm">
              Connectez votre compte Discord pour voir votre portefeuille en temps
              réel.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.15}
          >
            <WalletSection />
          </motion.div>
        </div>
      </section>

      {/* ================================================================
          4. BOUTIQUE ÉCLATS
      ================================================================ */}
      <section
        className="py-20 relative border-t border-white/5"
        aria-labelledby="boutique-heading"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(139,92,246,0.04) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="container-main relative z-10">
          <div className="mb-12">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
            >
              <SectionLabel
                color="text-purple-400/60"
                lineColor="bg-purple-400/50"
              >
                Boutique Éclats
              </SectionLabel>
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8">
                <div>
                  <h2
                    id="boutique-heading"
                    className="text-3xl md:text-4xl font-black tracking-tight"
                  >
                    Dépensez vos Éclats
                  </h2>
                  <p className="text-white/45 text-sm mt-2 max-w-sm">
                    Des avantages rares. Chaque achat se traite dans le salon
                    #boutique-éclats.
                  </p>
                </div>
                <div className="shrink-0 text-[11px] font-mono text-white/20 sm:pb-1">
                  Traitement manuel par l&apos;équipe
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {SHOP_CARDS.map((card, i) => (
              <ShopCard key={card.name} card={card} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          5. COSMÉTIQUES
          Une seule surface divisée par des séparateurs internes —
          pas trois sous-grilles de cartes indépendantes.
          Chaque catégorie a un traitement visuel distinct :
          badges = liste avec point couleur, rôles = liste typographique colorée,
          frames = éléments avec anneaux animés.
      ================================================================ */}
      <section
        className="py-20 relative border-t border-white/5"
        aria-labelledby="cosmetiques-heading"
      >
        <div className="container-main">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="mb-12"
          >
            <SectionLabel color="text-cyan-400/60" lineColor="bg-cyan-400/50">
              Cosmétiques Discord
            </SectionLabel>
            <h2
              id="cosmetiques-heading"
              className="text-3xl md:text-4xl font-black tracking-tight"
            >
              Montrez qui vous êtes
            </h2>
            <p className="text-white/45 text-sm mt-2 max-w-sm">
              Payables en Or (EX). Affichez votre rang, votre style, votre
              spécialité.
            </p>
          </motion.div>

          {/* Une seule surface, colonnes séparées par des joints */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/6 rounded-2xl overflow-hidden border border-white/8">

            {/* Badges */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.05}
              className="bg-[#06051a] p-7"
            >
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-5 flex items-center gap-2">
                <span className="w-3 h-px bg-white/20 inline-block" />
                Badges — 10 à 30 EX
              </p>
              <ul className="space-y-3" role="list">
                {[
                  { label: "Créateur Certifié", color: "#f59e0b", cost: 10 },
                  { label: "Monteur Pro", color: "#3b82f6", cost: 20 },
                  { label: "Designer", color: "#ec4899", cost: 25 },
                  { label: "Streamer", color: "#8b5cf6", cost: 25 },
                  { label: "Exclusif Saison", color: "#fbbf24", cost: 30 },
                ].map((badge, i) => (
                  <motion.li
                    key={badge.label}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={0.08 + i * 0.06}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-5 h-5 rounded-full shrink-0"
                      style={{
                        background: badge.color,
                        boxShadow: `0 0 10px ${badge.color}80`,
                      }}
                      aria-hidden="true"
                    />
                    <span className="text-sm text-white/70 flex-1">
                      {badge.label}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {badge.cost} EX
                    </span>
                  </motion.li>
                ))}
              </ul>
              <p className="mt-5 text-[11px] font-mono text-white/20">
                Badge Discord visible à côté de votre pseudo
              </p>
            </motion.div>

            {/* Rôles colorés */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.1}
              className="bg-[#06051a] p-7"
            >
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-5 flex items-center gap-2">
                <span className="w-3 h-px bg-white/20 inline-block" />
                Rôles colorés — 20 à 50 EX
              </p>

              {/* Bande chromatique — pas des cartes */}
              <div className="flex gap-2 mb-6" aria-hidden="true">
                {["#ef4444", "#60a5fa", "#4ade80", "#f472b6", "#fbbf24"].map(
                  (color) => (
                    <div
                      key={color}
                      className="flex-1 h-2 rounded-full"
                      style={{
                        background: color,
                        boxShadow: `0 0 8px ${color}60`,
                      }}
                    />
                  )
                )}
              </div>

              <ul className="space-y-2.5" role="list">
                {[
                  { name: "Rouge Flamme", color: "#ef4444", cost: 20 },
                  { name: "Bleu Glacier", color: "#60a5fa", cost: 25 },
                  { name: "Vert Néon", color: "#4ade80", cost: 25 },
                  { name: "Rose Sakura", color: "#f472b6", cost: 30 },
                  { name: "Or Royal", color: "#fbbf24", cost: 50 },
                ].map((role, i) => (
                  <motion.li
                    key={role.name}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={0.1 + i * 0.06}
                    className="flex items-center justify-between"
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: role.color }}
                    >
                      {role.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {role.cost} EX
                    </span>
                  </motion.li>
                ))}
              </ul>
              <p className="mt-5 text-[11px] font-mono text-white/20">
                Couleur appliquée à votre nom dans tout le serveur
              </p>
            </motion.div>

            {/* Frames */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.15}
              className="bg-[#06051a] p-7"
            >
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-5 flex items-center gap-2">
                <span className="w-3 h-px bg-white/20 inline-block" />
                Frames de profil — 50 à 100 EX
              </p>

              <div className="space-y-5">
                {[
                  {
                    tier: "Bronze",
                    cost: 50,
                    gradient:
                      "conic-gradient(from 0deg, #ea580c, #f97316, #fdba74, #ea580c)",
                    color: "#f97316",
                    speed: 8,
                  },
                  {
                    tier: "Argent",
                    cost: 75,
                    gradient:
                      "conic-gradient(from 0deg, #94a3b8, #e2e8f0, #94a3b8, #64748b, #94a3b8)",
                    color: "#94a3b8",
                    speed: 10,
                  },
                  {
                    tier: "Or",
                    cost: 100,
                    gradient:
                      "conic-gradient(from 0deg, #f59e0b, #fbbf24, #fde68a, #f59e0b, #d97706, #f59e0b)",
                    color: "#f59e0b",
                    speed: 6,
                  },
                ].map((frame, i) => (
                  <motion.div
                    key={frame.tier}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={0.1 + i * 0.08}
                    className="flex items-center gap-4"
                  >
                    <div
                      className="relative w-12 h-12 shrink-0"
                      aria-label={`Frame ${frame.tier}`}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ background: frame.gradient, padding: "2px" }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: frame.speed,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        aria-hidden="true"
                      >
                        <div className="w-full h-full rounded-full bg-[#06051a]" />
                      </motion.div>
                      <div
                        className="absolute inset-[3px] rounded-full bg-white/6 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <span className="text-xs font-black text-white/25">A</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-sm font-bold"
                        style={{ color: frame.color }}
                      >
                        {frame.tier} Frame
                      </p>
                      <p className="text-[11px] font-mono text-white/30">
                        Animée, visible sur votre profil
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
                      {frame.cost} EX
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================
          6. GACHA — La Roue de l'Expédition
          Le gacha a de l'ampleur, pas une grille de 12 mini-cartes.
          Table de probabilités sémantique à gauche.
          Bouton dramatique + liste de récompenses directe à droite.
          Layout deux colonnes : les règles d'abord, le draw ensuite.
      ================================================================ */}
      <section
        className="py-20 relative border-t border-white/5 overflow-hidden"
        aria-labelledby="gacha-heading"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.06) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />

        <div className="container-main relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left — règles + cotes */}
            <div>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
              >
                <SectionLabel
                  color="text-amber-400/60"
                  lineColor="bg-amber-400/50"
                >
                  La Roue
                </SectionLabel>
                <h2
                  id="gacha-heading"
                  className="text-3xl md:text-4xl font-black tracking-tight mb-4 leading-tight"
                >
                  15 EX le tirage.
                  <br />
                  La chance fait le reste.
                </h2>
                <p className="text-white/50 text-sm leading-relaxed mb-8">
                  Des récompenses du Bronze aux Éclats, en passant par des
                  cosmétiques exclusifs. Les cotes sont affichées. Pas de dark
                  patterns.
                </p>
              </motion.div>

              {/* Table de probabilités — sémantique, pas des pills colorées */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.1}
                className="rounded-2xl bg-[#0F0F12] border border-white/8 overflow-hidden"
              >
                <table className="w-full" aria-label="Probabilités de tirage">
                  <thead>
                    <tr className="border-b border-white/6">
                      <th className="text-left px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-white/25">
                        Rareté
                      </th>
                      <th className="text-right px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-white/25">
                        Probabilité
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {GACHA_RARITIES.map((r, i) => (
                      <motion.tr
                        key={r.label}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={0.15 + i * 0.06}
                        className="border-b border-white/4 last:border-0"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{
                                background: r.color,
                                boxShadow: `0 0 8px ${r.color}`,
                              }}
                              aria-hidden="true"
                            />
                            <span
                              className="text-sm font-medium"
                              style={{ color: r.color }}
                            >
                              {r.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span
                            className="text-2xl font-black font-mono"
                            style={{ color: r.color }}
                          >
                            {r.pct}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </div>

            {/* Right — bouton + liste de récompenses */}
            <div className="lg:pt-16">

              {/* Le bouton — dramatique mais honnête sur son état */}
              <motion.div
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.2}
                className="flex flex-col items-center gap-4 mb-12"
              >
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 rounded-2xl blur-xl"
                    style={{ background: "rgba(251,191,36,0.15)" }}
                    animate={{
                      opacity: [0.3, 0.7, 0.3],
                      scale: [0.95, 1.05, 0.95],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    aria-hidden="true"
                  />
                  <button
                    disabled
                    aria-label="Tirer — disponible via commande Discord"
                    className="relative flex flex-col items-center gap-1 px-14 py-6 rounded-2xl font-black cursor-not-allowed select-none"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.06))",
                      border: "1px solid rgba(245,158,11,0.25)",
                      boxShadow: "0 0 40px rgba(245,158,11,0.08)",
                    }}
                  >
                    <Shuffle
                      className="w-7 h-7 text-amber-400/50 mb-1"
                      aria-hidden="true"
                    />
                    <span className="text-lg text-white/30 tracking-tight">
                      Tirer — 15 EX
                    </span>
                    <span className="text-[10px] font-mono text-white/20 font-normal">
                      Via commande bot sur Discord
                    </span>
                  </button>
                </div>
              </motion.div>

              {/* Récompenses — liste, pas 12 mini-cartes */}
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/25 mb-4 flex items-center gap-2">
                <span className="w-3 h-px bg-white/15 inline-block" />
                Ce que vous pouvez obtenir
              </p>

              <div className="space-y-0.5">
                {GACHA_REWARDS.map((reward, i) => {
                  const rarity = GACHA_RARITIES[reward.rarity];
                  const Icon = reward.icon;
                  return (
                    <motion.div
                      key={reward.name}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      custom={0.05 + i * 0.04}
                      className="flex items-center gap-3 py-2.5 border-b border-white/4 last:border-0"
                    >
                      <Icon
                        className="w-4 h-4 shrink-0"
                        style={{ color: rarity.color, opacity: 0.7 }}
                        aria-hidden="true"
                      />
                      <span className="text-sm text-white/60 flex-1">
                        {reward.name}
                      </span>
                      <span
                        className="text-[10px] font-mono"
                        style={{ color: rarity.color, opacity: 0.6 }}
                      >
                        {rarity.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          7. GUIDE DES TARIFS
      ================================================================ */}
      <section
        className="py-20 relative border-t border-white/5"
        aria-labelledby="tarifs-heading"
      >
        <div className="container-main">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="mb-12"
          >
            <SectionLabel color="text-cyan-400/60" lineColor="bg-cyan-400/50">
              Tarifs services
            </SectionLabel>
            <h2
              id="tarifs-heading"
              className="text-3xl md:text-4xl font-black tracking-tight"
            >
              Ce que ça vaut
            </h2>
            <p className="text-white/45 text-sm mt-2 max-w-md">
              Des fourchettes pour chaque type de prestation. Le prix final est
              toujours validé par écrit avant de commencer.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4">
            {SERVICE_TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.12}
                className={`flex-1 p-6 rounded-2xl bg-[#0F0F12] border overflow-hidden relative cursor-default ${
                  tier.highlight ? "" : "border-white/8"
                }`}
                style={{
                  borderColor: tier.highlight ? `${tier.color}40` : undefined,
                  boxShadow: tier.highlight
                    ? `0 0 40px ${tier.color}10`
                    : undefined,
                }}
              >
                {tier.highlight && (
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${tier.color}60, transparent)`,
                    }}
                    aria-hidden="true"
                  />
                )}

                <div className="relative z-10">
                  <div
                    className="text-3xl font-black font-mono mb-1"
                    style={{ color: tier.color }}
                  >
                    {tier.range}
                  </div>

                  <div className="flex items-center gap-1.5 mb-5">
                    <Clock className="w-3 h-3 text-white/30" aria-hidden="true" />
                    <span className="text-xs font-mono text-white/35">
                      {tier.duration}
                    </span>
                  </div>

                  <h3 className="text-lg font-black tracking-tight text-white mb-4">
                    {tier.name}
                  </h3>

                  <ul className="space-y-2">
                    {tier.examples.map((ex) => (
                      <li
                        key={ex}
                        className="flex items-center gap-2 text-sm text-white/55"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: tier.color, opacity: 0.7 }}
                          aria-hidden="true"
                        />
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.35}
            className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-white/3 border border-white/8"
          >
            <Info
              className="w-4 h-4 text-white/40 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p className="text-xs text-white/45 leading-relaxed">
              <span className="text-white/70 font-semibold">Règle absolue :</span>{" "}
              Prix validé par écrit avant de commencer. Pas d&apos;accord écrit = travail
              gracieux. C&apos;est comme ça pour tout le monde, sans exception.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================================================================
          8. MINING SOCIAL
          Layout asymétrique : texte éditorial à gauche avec les chiffres
          en ancres visuelles inline. Tableau sémantique du capital à droite.
          Remplace les 3 cartes identiques avec icône + description.
      ================================================================ */}
      <section
        className="py-20 relative border-t border-white/5"
        aria-labelledby="mining-heading"
      >
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left col */}
            <div>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
              >
                <SectionLabel
                  color="text-orange-400/60"
                  lineColor="bg-orange-400/50"
                >
                  Mining social
                </SectionLabel>
                <h2
                  id="mining-heading"
                  className="text-3xl md:text-4xl font-black tracking-tight mb-4 leading-tight"
                >
                  Votre activité
                  <br />
                  vaut quelque chose.
                </h2>
              </motion.div>

              <div className="space-y-8 mt-6">
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={0.1}
                  className="flex gap-5"
                >
                  <div className="shrink-0 pt-0.5">
                    <MessageSquare
                      className="w-5 h-5 text-orange-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-3 mb-1">
                      <p className="font-bold text-white">Activité chat</p>
                      <span className="text-sm font-mono font-black text-orange-400">
                        max 50 BR/jour
                      </span>
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed">
                      Écrivez dans les salons texte actifs. Chaque message compte
                      — la qualité est valorisée, pas la quantité.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={0.18}
                  className="flex gap-5"
                >
                  <div className="shrink-0 pt-0.5">
                    <Mic className="w-5 h-5 text-amber-400" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-3 mb-1">
                      <p className="font-bold text-white">Activité vocal</p>
                      <span className="text-sm font-mono font-black text-amber-400">
                        max 60 BR/jour
                      </span>
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed">
                      Le temps de présence active dans les salons vocaux est
                      comptabilisé automatiquement par le bot.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={0.26}
                  className="flex gap-5"
                >
                  <div className="shrink-0 pt-0.5">
                    <Shield
                      className="w-5 h-5 text-white/30"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-3 mb-1">
                      <p className="font-bold text-white/50">Coworking</p>
                      <span className="text-sm font-mono text-white/25">
                        aucune récompense
                      </span>
                    </div>
                    <p className="text-sm text-white/35 leading-relaxed">
                      Les salons coworking sont des zones de concentration. Zéro
                      Bronze distribué — c&apos;est le principe.
                    </p>
                  </div>
                </motion.div>
              </div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.34}
                className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-orange-500/6 border border-orange-500/15"
              >
                <Zap
                  className="w-4 h-4 text-orange-400 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <p className="text-xs text-white/50 leading-relaxed">
                  <span className="text-orange-400 font-semibold">
                    Anti-AFK actif.
                  </span>{" "}
                  Un système détecte et exclut les comportements passifs ou
                  automatisés. Seule la participation authentique compte.
                </p>
              </motion.div>
            </div>

            {/* Right col — tableau sémantique du capital */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.15}
              className="lg:pt-16"
            >
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-5 flex items-center gap-2">
                <span className="w-3 h-px bg-white/20 inline-block" />
                Capital de départ — Bonus à l&apos;inscription
              </p>

              <div className="rounded-2xl bg-[#0F0F12] border border-white/8 overflow-hidden">
                <table
                  className="w-full"
                  aria-label="Capital de départ selon la vague d'inscription"
                >
                  <thead>
                    <tr className="border-b border-white/6">
                      <th className="text-left px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-white/25">
                        Vague
                      </th>
                      <th className="text-left px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-white/25">
                        Taille
                      </th>
                      <th className="text-right px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-amber-400/40">
                        Or
                      </th>
                      <th className="text-right px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-orange-400/40">
                        Bronze
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {STARTING_CAPITAL.map((entry, i) => (
                      <motion.tr
                        key={entry.wave}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={0.2 + i * 0.08}
                        className="border-b border-white/4 last:border-0"
                      >
                        <td className="px-5 py-4">
                          <span
                            className="text-sm font-bold"
                            style={{ color: entry.color }}
                          >
                            {entry.wave}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs font-mono text-white/35">
                            {entry.members}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="text-lg font-black font-mono text-amber-400">
                            {entry.gold}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="text-lg font-black font-mono text-orange-400">
                            {entry.bronze}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] font-mono text-white/20 mt-4 tracking-wide">
                La vague est définie par la taille du serveur au moment de votre
                adhésion
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA — Discord
          Alignement gauche — plus de force qu'un bloc centré.
          Titre en deux lignes avec contraste fort / atténué.
          Pas de gradient sur un seul mot générique.
      ================================================================ */}
      <section className="py-24 relative border-t border-white/5 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 0% 100%, rgba(139,92,246,0.07) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />
        <div className="container-main relative z-10">
          <div className="max-w-lg">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
            >
              <SectionLabel
                color="text-purple-400/60"
                lineColor="bg-purple-400/50"
              >
                Rejoindre
              </SectionLabel>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
                Réclamez votre capital.
                <br />
                <span className="text-white/35">
                  Le reste, c&apos;est votre talent.
                </span>
              </h2>
              <p className="text-white/45 text-sm leading-relaxed mb-8">
                Rejoignez le Discord, réclamez votre bonus de Vague 1 pendant que
                les places existent, et commencez à construire votre réputation
                dans la communauté.
              </p>
              <a
                href={
                  process.env.NEXT_PUBLIC_DISCORD_URL ||
                  "https://dsc.gg/expedition"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-base transition-all duration-300 hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(245,158,11,0.9), rgba(167,139,250,0.9))",
                  boxShadow: "0 0 40px rgba(245,158,11,0.2)",
                  color: "#fff",
                }}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
                Rejoindre le Discord
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
