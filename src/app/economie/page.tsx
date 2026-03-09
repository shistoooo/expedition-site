"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
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
  Palette,
  Frame,
  Shuffle,
  Clock,
  Zap,
  Info,
  ChevronRight,
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

// ─── Section divider (game-UI style) ────────────────────────────────────────

function SectionDivider({ accent = "#8b5cf6" }: { accent?: string }) {
  return (
    <div className="flex items-center gap-4 py-2" aria-hidden="true">
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}30)` }} />
      <div
        className="w-1.5 h-1.5 rotate-45"
        style={{ background: accent, opacity: 0.5, boxShadow: `0 0 8px ${accent}` }}
      />
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${accent}30, transparent)` }} />
    </div>
  );
}

// ─── Section label (matches site-wide pattern) ──────────────────────────────

function SectionLabel({ children, color = "text-purple-400/60", lineColor = "bg-purple-400/50" }: {
  children: React.ReactNode;
  color?: string;
  lineColor?: string;
}) {
  return (
    <p className={`text-xs font-mono uppercase tracking-widest ${color} mb-6 flex items-center gap-2`}>
      <span className={`w-3 h-px ${lineColor} inline-block`} />
      {children}
    </p>
  );
}

// ─── CSS Coin component (no images) ─────────────────────────────────────────

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
      {/* Ambient glow underneath coin */}
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

      {/* Coin body — floating animation */}
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
        {/* Inner ring */}
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

      <span className="text-xs font-mono uppercase tracking-widest text-white/45">{label}</span>
    </motion.div>
  );
}

// ─── Currency Card ───────────────────────────────────────────────────────────

interface CurrencyCardProps {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  ticker: string;
  description: string;
  gradient: string;
  borderColor: string;
  glowColor: string;
  textColor: string;
  detail: string;
  delay?: number;
}

function CurrencyCard({
  icon: Icon,
  name,
  ticker,
  description,
  gradient,
  borderColor,
  glowColor,
  textColor,
  detail,
  delay = 0,
}: CurrencyCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={delay}
      className={`relative flex-1 p-6 rounded-2xl bg-[#0F0F12] border ${borderColor} overflow-hidden group cursor-default`}
      style={{ boxShadow: `0 8px 40px ${glowColor}06` }}
      whileHover={{ y: -4, transition: { duration: 0.3, ease: EASE_OUT_EXPO } }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% -20%, ${glowColor}20 0%, transparent 65%)` }}
        aria-hidden="true"
      />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${glowColor}50, transparent)` }} aria-hidden="true" />

      <div className="relative z-10">
        {/* Icon + ticker */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: `${glowColor}18`, border: `1px solid ${glowColor}25` }}
          >
            <Icon className={`w-6 h-6 ${textColor}`} />
          </div>
          <span
            className="text-xs font-mono font-bold px-2.5 py-1 rounded-full"
            style={{ background: `${glowColor}15`, color: glowColor, border: `1px solid ${glowColor}25` }}
          >
            {ticker}
          </span>
        </div>

        {/* Name */}
        <h3
          className="text-xl font-black tracking-tight mb-2"
          style={{ background: gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
        >
          {name}
        </h3>

        <p className="text-sm text-white/55 leading-relaxed mb-4">{description}</p>

        {/* Detail pill */}
        <div
          className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full"
          style={{ background: `${glowColor}10`, border: `1px solid ${glowColor}20`, color: `${glowColor}` }}
        >
          <Info className="w-3 h-3" />
          {detail}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Conversion flow visual ──────────────────────────────────────────────────

function ConversionFlow() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={0.3}
      className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6"
      aria-label="Taux de conversion des devises"
    >
      {/* Bronze */}
      <div className="flex flex-col items-center gap-1">
        <div className="px-4 py-2 rounded-xl bg-orange-500/15 border border-orange-500/25 font-mono font-black text-orange-400 text-lg">
          20 BR
        </div>
        <span className="text-[10px] text-white/30 font-mono uppercase">Bronze</span>
      </div>

      <div className="flex items-center gap-2 text-white/20">
        <ChevronRight className="w-5 h-5" />
        <span className="text-xs font-mono text-white/30">conversion</span>
        <ChevronRight className="w-5 h-5" />
      </div>

      {/* Gold */}
      <div className="flex flex-col items-center gap-1">
        <div className="px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/25 font-mono font-black text-amber-400 text-lg">
          1 EX
        </div>
        <span className="text-[10px] text-white/30 font-mono uppercase">Or</span>
      </div>

      <div className="flex items-center gap-2 text-white/20">
        <span className="text-xs font-mono text-white/30">× 100</span>
        <ChevronRight className="w-5 h-5" />
        <span className="text-xs font-mono text-white/30">conversion</span>
        <ChevronRight className="w-5 h-5" />
      </div>

      {/* Eclat */}
      <div className="flex flex-col items-center gap-1">
        <div className="px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-500/25 font-mono font-black text-purple-400 text-lg">
          1 ECL
        </div>
        <span className="text-[10px] text-white/30 font-mono uppercase">Éclat</span>
      </div>
    </motion.div>
  );
}

// ─── Shop Card (Boutique Éclats) ─────────────────────────────────────────────

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

const RARITY_CONFIG: Record<ShopRarity, {
  label: string;
  borderColor: string;
  glowColor: string;
  badgeColor: string;
  badgeBg: string;
}> = {
  common:    { label: "Commun",    borderColor: "border-white/12",        glowColor: "rgba(255,255,255,0.06)", badgeColor: "text-white/50",   badgeBg: "bg-white/8"          },
  rare:      { label: "Rare",      borderColor: "border-blue-500/30",     glowColor: "rgba(59,130,246,0.15)",  badgeColor: "text-blue-400",   badgeBg: "bg-blue-500/10"     },
  epic:      { label: "Épique",    borderColor: "border-purple-500/40",   glowColor: "rgba(139,92,246,0.18)",  badgeColor: "text-purple-400", badgeBg: "bg-purple-500/12"   },
  legendary: { label: "Légendaire",borderColor: "border-amber-500/50",    glowColor: "rgba(245,158,11,0.22)",  badgeColor: "text-amber-400",  badgeBg: "bg-amber-500/12"    },
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
      style={{ boxShadow: hovered ? `0 0 40px ${rarity.glowColor}, 0 20px 60px ${rarity.glowColor}` : `0 8px 30px ${rarity.glowColor}` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -6, transition: { duration: 0.35, ease: EASE_OUT_EXPO } }}
    >
      {/* Top glow border on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${card.visualColor}, transparent)`,
          opacity: hovered ? 1 : 0.3,
        }}
        aria-hidden="true"
      />

      {/* Visual area */}
      <div
        className="relative h-40 flex items-center justify-center overflow-hidden"
        style={{ background: card.visualGradient }}
        aria-hidden="true"
      >
        {/* Background decoration */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)",
          }}
        />

        {/* Legendary sparkle particles */}
        {card.rarity === "legendary" && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-amber-300"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${10 + i * 16}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  y: [0, -15, 0],
                }}
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
          animate={hovered ? { scale: 1.15, rotate: card.rarity === "legendary" ? 5 : 0 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          <Icon className="w-14 h-14 text-white/80" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Rarity badge + cost */}
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full ${rarity.badgeBg} ${rarity.badgeColor}`}>
            {rarity.label}
          </span>
          <div className="flex items-center gap-1">
            <Gem className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-sm font-black font-mono text-purple-400">{card.cost} ECL</span>
          </div>
        </div>

        <h3 className="text-base font-bold text-white leading-tight">{card.name}</h3>
        <p className="text-xs text-white/45 leading-relaxed">{card.description}</p>

        {/* Disabled buy button */}
        <button
          disabled
          aria-label={`${card.name} — bientôt disponible`}
          className="w-full h-9 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-not-allowed"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.25)",
          }}
        >
          <Clock className="w-3.5 h-3.5" />
          Bientôt disponible
        </button>
      </div>
    </motion.div>
  );
}

const SHOP_CARDS: ShopCardData[] = [
  {
    icon: Megaphone,
    name: "Annonce Vitrine",
    cost: "2",
    description: "Votre service mis en avant 7 jours dans le salon dédié.",
    rarity: "common",
    visualColor: "rgba(99,102,241,0.8)",
    visualGradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)",
  },
  {
    icon: Film,
    name: "Portfolio Vidéo",
    cost: "5",
    description: "Vidéo épinglée dans le salon Portfolio.",
    rarity: "rare",
    visualColor: "rgba(59,130,246,0.8)",
    visualGradient: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
  },
  {
    icon: Youtube,
    name: "Shoutout YouTube",
    cost: "10",
    description: "Votre chaîne dans les annonces officielles. 2 places/mois.",
    rarity: "epic",
    visualColor: "rgba(239,68,68,0.8)",
    visualGradient: "linear-gradient(135deg, #1a0a0a 0%, #450a0a 40%, #7f1d1d 70%, #1a0a0a 100%)",
  },
  {
    icon: Ticket,
    name: "Ticket d'Or",
    cost: "3 – 7",
    description: "Accès prioritaire à la prochaine saison. Coût variable.",
    rarity: "legendary",
    visualColor: "rgba(245,158,11,0.9)",
    visualGradient: "linear-gradient(135deg, #1a1100 0%, #451a00 30%, #78350f 60%, #d97706 80%, #f59e0b 100%)",
  },
];

// ─── Cosmetics Section ───────────────────────────────────────────────────────

function BadgeCard({ label, color, delay }: { label: string; color: string; delay: number }) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={delay}
      className="relative p-4 rounded-xl bg-[#0F0F12] border border-white/8 hover:border-white/15 transition-all group cursor-default text-center"
      whileHover={{ y: -3, transition: { duration: 0.25, ease: EASE_OUT_EXPO } }}
    >
      <div
        className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
        style={{ background: color, boxShadow: `0 0 20px ${color}60` }}
      >
        <Shield className="w-6 h-6 text-white/90" />
      </div>
      <p className="text-xs font-bold text-white/80 leading-tight">{label}</p>
      <p className="text-[10px] font-mono text-white/30 mt-0.5">Badge Discord</p>
    </motion.div>
  );
}

function ColorRoleCard({ name, color, cost, delay }: { name: string; color: string; cost: number; delay: number }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={delay}
      className="flex items-center gap-3 p-3 rounded-xl bg-[#0F0F12] border border-white/8 hover:border-white/15 transition-all group cursor-default"
      whileHover={{ x: 4, transition: { duration: 0.2, ease: EASE_OUT_EXPO } }}
    >
      <div
        className="w-8 h-8 rounded-full shrink-0"
        style={{ background: color, boxShadow: `0 0 12px ${color}70` }}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-white/80">{name}</p>
        <p className="text-[10px] font-mono text-white/30">Rôle coloré</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Coins className="w-3 h-3 text-amber-400" />
        <span className="text-xs font-mono font-bold text-amber-400">{cost} EX</span>
      </div>
    </motion.div>
  );
}

function FrameCard({ tier, cost, gradient, borderColor, delay }: { tier: string; cost: number; gradient: string; borderColor: string; delay: number }) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={delay}
      className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-[#0F0F12] border transition-all group cursor-default"
      style={{ borderColor }}
      whileHover={{ y: -4, transition: { duration: 0.3, ease: EASE_OUT_EXPO } }}
    >
      {/* Fake avatar with animated frame */}
      <div className="relative w-16 h-16" aria-label={`Frame ${tier}`}>
        {/* Frame ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: gradient,
            padding: "3px",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full bg-[#0F0F12]" />
        </motion.div>
        {/* Avatar placeholder */}
        <div
          className="absolute inset-[4px] rounded-full bg-white/8 flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="text-lg font-black text-white/30">A</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-white/80">{tier} Frame</p>
        <div className="flex items-center gap-1 justify-center mt-1">
          <Coins className="w-3 h-3 text-amber-400" />
          <span className="text-xs font-mono font-bold text-amber-400">{cost} EX</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Gacha Section ───────────────────────────────────────────────────────────

const GACHA_RARITIES = [
  { label: "Commun",    pct: "60%", color: "#9ca3af", glow: "rgba(156,163,175,0.25)", bg: "rgba(156,163,175,0.08)", border: "rgba(156,163,175,0.15)" },
  { label: "Rare",      pct: "25%", color: "#60a5fa", glow: "rgba(96,165,250,0.35)",  bg: "rgba(96,165,250,0.10)",  border: "rgba(96,165,250,0.25)"  },
  { label: "Épique",    pct: "12%", color: "#a78bfa", glow: "rgba(167,139,250,0.4)",  bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.30)" },
  { label: "Légendaire", pct: "3%", color: "#fbbf24", glow: "rgba(251,191,36,0.5)",   bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.40)" },
];

const GACHA_REWARDS = [
  { name: "Bronze ×50",          rarity: 0, icon: Coins        },
  { name: "Bronze ×150",         rarity: 0, icon: Coins        },
  { name: "Bronze ×300",         rarity: 1, icon: Coins        },
  { name: "Badge Commun",        rarity: 0, icon: Shield       },
  { name: "Rôle Coloré",         rarity: 1, icon: Palette      },
  { name: "Fragment d'Éclat",    rarity: 1, icon: Sparkles     },
  { name: "Frame Animée",        rarity: 2, icon: Frame        },
  { name: "Badge Exclusif",      rarity: 2, icon: Star         },
  { name: "Éclat Complet",       rarity: 2, icon: Gem          },
  { name: "Badge Légendaire",    rarity: 3, icon: Star         },
  { name: "Frame Dorée",         rarity: 3, icon: Frame        },
  { name: "Éclats ×3",           rarity: 3, icon: Gem          },
];

function GachaRewardCard({ reward, index }: { reward: typeof GACHA_REWARDS[0]; index: number }) {
  const rarity = GACHA_RARITIES[reward.rarity];
  const Icon = reward.icon;

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index * 0.05}
      className="flex flex-col items-center gap-2 p-3 rounded-xl text-center cursor-default group"
      style={{
        background: rarity.bg,
        border: `1px solid ${rarity.border}`,
        boxShadow: `0 0 20px ${rarity.glow}`,
      }}
      whileHover={{
        scale: 1.06,
        boxShadow: `0 0 30px ${rarity.glow}`,
        transition: { duration: 0.2, ease: EASE_OUT_EXPO },
      }}
    >
      <Icon className="w-5 h-5" style={{ color: rarity.color }} />
      <span className="text-[10px] font-bold text-white/70 leading-tight">{reward.name}</span>
      <span
        className="text-[9px] font-mono uppercase tracking-widest"
        style={{ color: rarity.color, opacity: 0.8 }}
      >
        {rarity.label}
      </span>
    </motion.div>
  );
}

// ─── Pricing Table ───────────────────────────────────────────────────────────

const SERVICE_TIERS = [
  {
    name: "Micro-Tâche",
    range: "10 – 30 EX",
    duration: "10 – 30 min",
    color: "#22d3ee",
    examples: ["Feedback vidéo", "Test utilisateur", "Brainstorming", "Détourage rapide"],
  },
  {
    name: "Tâche Standard",
    range: "30 – 90 EX",
    duration: "30 min – 1h30",
    color: "#a78bfa",
    examples: ["Miniature YouTube", "Montage court", "Script", "Bug fix", "Formation express"],
    highlight: true,
  },
  {
    name: "Projet Complexe",
    range: "90 – 200 EX",
    duration: "1h30 – 3h",
    color: "#f59e0b",
    examples: ["Audit chaîne", "Dérushage", "Overlay stream", "Montage dynamique"],
  },
];

// ─── Mining Info Card ────────────────────────────────────────────────────────

function MiningCard({ icon: Icon, title, detail, max, color, delay }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  detail: string;
  max?: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={delay}
      className="flex-1 p-5 rounded-2xl bg-[#0F0F12] border border-white/8 hover:border-white/15 transition-all group cursor-default"
      whileHover={{ y: -3, transition: { duration: 0.25, ease: EASE_OUT_EXPO } }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `${color}18`, border: `1px solid ${color}25` }}
      >
        <span style={{ color }}>
          <Icon className="w-5 h-5" />
        </span>
      </div>
      <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-white/45 leading-relaxed mb-3">{detail}</p>
      {max && (
        <div
          className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full"
          style={{ background: `${color}12`, border: `1px solid ${color}20`, color }}
        >
          <Zap className="w-2.5 h-2.5" />
          Max {max}/jour
        </div>
      )}
    </motion.div>
  );
}

// ─── Capital de départ table ─────────────────────────────────────────────────

const STARTING_CAPITAL = [
  { wave: "Vague 1", members: "0 – 300 membres", gold: 80, bronze: 130, color: "#f59e0b" },
  { wave: "Vague 2", members: "301 – 500 membres", gold: 60, bronze: 90, color: "#60a5fa" },
  { wave: "Tardif", members: "501+ membres", gold: 40, bronze: 50, color: "#9ca3af" },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function EconomiePage() {
  return (
    <div className="w-full min-h-screen bg-[#06051a] text-white overflow-x-hidden">
      <PageBackground />
      <Navbar />

      {/* ================================================================
          1. HERO SECTION
      ================================================================ */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        {/* Extra ambient glow specific to this page */}
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[180px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, rgba(139,92,246,0.04) 50%, transparent 80%)" }}
          aria-hidden="true"
        />

        <div className="container-main flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          >
            <SectionLabel color="text-amber-400/60" lineColor="bg-amber-400/50">
              Système Économique
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
                background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 40%, #a78bfa 80%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Expédition
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.25 }}
            className="text-lg md:text-xl text-white/55 max-w-xl mx-auto leading-relaxed mb-16"
          >
            Gagnez, échangez et dépensez dans un marché
            <span className="text-white/80 font-medium"> géré par la communauté</span>.
          </motion.p>

          {/* Coin visuals */}
          <div className="flex flex-wrap items-end justify-center gap-10 md:gap-16 mb-6">
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

          {/* Wallet cap note */}
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

      <div className="container-main"><SectionDivider accent="#f59e0b" /></div>

      {/* ================================================================
          2. CURRENCY EXPLAINER
      ================================================================ */}
      <section className="py-20 relative">
        <div className="container-main">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="mb-12 text-center"
          >
            <SectionLabel color="text-amber-400/60" lineColor="bg-amber-400/50">
              Les Devises
            </SectionLabel>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">Trois monnaies, un écosystème</h2>
          </motion.div>

          {/* Currency cards */}
          <div className="flex flex-col md:flex-row gap-4">
            <CurrencyCard
              icon={Coins}
              name="Pièces d'Or"
              ticker="EX"
              description="Monnaie principale. Services, échanges, boutique. Plafonnée à 500."
              gradient="linear-gradient(135deg, #fbbf24, #f59e0b)"
              borderColor="border-amber-500/20"
              glowColor="#f59e0b"
              textColor="text-amber-400"
              detail="Plafond 500 EX"
              delay={0.05}
            />
            <CurrencyCard
              icon={Coins}
              name="Bronze"
              ticker="BR"
              description="Gagnée via l'activité Discord. Se convertit en Or."
              gradient="linear-gradient(135deg, #fb923c, #f97316)"
              borderColor="border-orange-500/20"
              glowColor="#f97316"
              textColor="text-orange-400"
              detail="20 BR = 1 EX"
              delay={0.15}
            />
            <CurrencyCard
              icon={Gem}
              name="Points d'Éclat"
              ticker="ECL"
              description="Monnaie premium. Donne accès à la boutique Éclats."
              gradient="linear-gradient(135deg, #a78bfa, #8b5cf6)"
              borderColor="border-purple-500/25"
              glowColor="#8b5cf6"
              textColor="text-purple-400"
              detail="100 EX = 1 ECL"
              delay={0.25}
            />
          </div>

          <ConversionFlow />
        </div>
      </section>

      <div className="container-main"><SectionDivider accent="#8b5cf6" /></div>

      {/* ================================================================
          3. WALLET SECTION
      ================================================================ */}
      <section className="py-20 relative" aria-labelledby="wallet-heading">
        <div className="container-main">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="mb-10 text-center"
          >
            <SectionLabel color="text-amber-400/60" lineColor="bg-amber-400/50">
              Portefeuille
            </SectionLabel>
            <h2 id="wallet-heading" className="text-3xl md:text-5xl font-black tracking-tight mb-3">
              Votre solde
            </h2>
            <p className="text-white/40 text-sm">
              Connectez Discord pour voir vos soldes.
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

      <div className="container-main"><SectionDivider accent="#f59e0b" /></div>

      {/* ================================================================
          4. BOUTIQUE ÉCLATS
      ================================================================ */}
      <section className="py-20 relative" aria-labelledby="boutique-heading">
        {/* Section ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(139,92,246,0.04) 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="container-main relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="mb-12 text-center"
          >
            <SectionLabel color="text-purple-400/60" lineColor="bg-purple-400/50">
              Boutique
            </SectionLabel>
            <h2 id="boutique-heading" className="text-3xl md:text-5xl font-black tracking-tight mb-3">
              Boutique Éclats
            </h2>
            <p className="text-white/45 text-sm max-w-sm mx-auto">
              Avantages exclusifs payables en Éclats.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {SHOP_CARDS.map((card, i) => (
              <ShopCard key={card.name} card={card} index={i} />
            ))}
          </div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.4}
            className="text-center text-[11px] font-mono text-white/20 mt-8 tracking-wide"
          >
            Les achats sont traités manuellement par l&apos;équipe dans le salon #boutique-éclats
          </motion.p>
        </div>
      </section>

      <div className="container-main"><SectionDivider accent="#22d3ee" /></div>

      {/* ================================================================
          5. COSMÉTIQUES
      ================================================================ */}
      <section className="py-20 relative" aria-labelledby="cosmetiques-heading">
        <div className="container-main">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="mb-12 text-center"
          >
            <SectionLabel color="text-cyan-400/60" lineColor="bg-cyan-400/50">
              Cosmétiques
            </SectionLabel>
            <h2 id="cosmetiques-heading" className="text-3xl md:text-5xl font-black tracking-tight mb-3">
              Personnalisez votre profil
            </h2>
            <p className="text-white/45 text-sm max-w-sm mx-auto">
              Payables en Or (EX).
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Badges */}
            <div>
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.05}>
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-4 flex items-center gap-2">
                  <span className="w-3 h-px bg-white/20 inline-block" />
                  Badges (10 – 30 EX)
                </p>
              </motion.div>
              <div className="grid grid-cols-3 gap-3">
                <BadgeCard label="Créateur Certifié" color="linear-gradient(135deg, #f59e0b, #d97706)" delay={0.1} />
                <BadgeCard label="Monteur Pro" color="linear-gradient(135deg, #3b82f6, #2563eb)" delay={0.17} />
                <BadgeCard label="Designer" color="linear-gradient(135deg, #ec4899, #db2777)" delay={0.24} />
              </div>
            </div>

            {/* Rôles colorés */}
            <div>
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.05}>
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-4 flex items-center gap-2">
                  <span className="w-3 h-px bg-white/20 inline-block" />
                  Rôles Colorés (20 – 50 EX)
                </p>
              </motion.div>
              <div className="flex flex-col gap-2">
                <ColorRoleCard name="Rouge Flamme" color="linear-gradient(135deg, #ef4444, #dc2626)" cost={20} delay={0.1} />
                <ColorRoleCard name="Bleu Glacier" color="linear-gradient(135deg, #60a5fa, #3b82f6)" cost={25} delay={0.16} />
                <ColorRoleCard name="Vert Néon" color="linear-gradient(135deg, #4ade80, #22c55e)" cost={25} delay={0.22} />
                <ColorRoleCard name="Rose Sakura" color="linear-gradient(135deg, #f472b6, #ec4899)" cost={30} delay={0.28} />
                <ColorRoleCard name="Or Royal" color="linear-gradient(135deg, #fbbf24, #f59e0b)" cost={50} delay={0.34} />
              </div>
            </div>

            {/* Frames */}
            <div>
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.05}>
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-4 flex items-center gap-2">
                  <span className="w-3 h-px bg-white/20 inline-block" />
                  Frames de Profil (50 – 100 EX)
                </p>
              </motion.div>
              <div className="grid grid-cols-3 gap-4">
                <FrameCard
                  tier="Bronze"
                  cost={50}
                  gradient="conic-gradient(from 0deg, #ea580c, #f97316, #fdba74, #ea580c)"
                  borderColor="rgba(234,88,12,0.25)"
                  delay={0.1}
                />
                <FrameCard
                  tier="Argent"
                  cost={75}
                  gradient="conic-gradient(from 0deg, #94a3b8, #e2e8f0, #94a3b8, #64748b, #94a3b8)"
                  borderColor="rgba(148,163,184,0.25)"
                  delay={0.2}
                />
                <FrameCard
                  tier="Or"
                  cost={100}
                  gradient="conic-gradient(from 0deg, #f59e0b, #fbbf24, #fde68a, #f59e0b, #d97706, #f59e0b)"
                  borderColor="rgba(245,158,11,0.35)"
                  delay={0.3}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-main"><SectionDivider accent="#fbbf24" /></div>

      {/* ================================================================
          6. GACHA SECTION
      ================================================================ */}
      <section className="py-20 relative overflow-hidden" aria-labelledby="gacha-heading">
        {/* Gacha ambient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(251,191,36,0.05) 0%, transparent 65%)" }}
          aria-hidden="true"
        />

        <div className="container-main relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="mb-4 text-center"
          >
            <SectionLabel color="text-amber-400/60" lineColor="bg-amber-400/50">
              Tirage
            </SectionLabel>
            <h2 id="gacha-heading" className="text-3xl md:text-5xl font-black tracking-tight mb-3">
              La Roue de l&apos;Expédition
            </h2>
            <p className="text-white/45 text-sm max-w-sm mx-auto mb-2">
              15 EX par tirage. Bronze, cosmétiques, ou Éclats.
            </p>
          </motion.div>

          {/* Rarity bars */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {GACHA_RARITIES.map((r, i) => (
              <motion.div
                key={r.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.1 + i * 0.07}
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ background: r.bg, border: `1px solid ${r.border}`, boxShadow: `0 0 12px ${r.glow}` }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: r.color, boxShadow: `0 0 8px ${r.color}` }}
                  aria-hidden="true"
                />
                <span className="text-xs font-mono font-bold" style={{ color: r.color }}>{r.label}</span>
                <span className="text-[10px] text-white/35 font-mono">{r.pct}</span>
              </motion.div>
            ))}
          </div>

          {/* The big draw button */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.2}
            className="flex justify-center mb-12"
          >
            <div className="relative">
              {/* Outer glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full blur-xl"
                style={{ background: "rgba(251,191,36,0.2)" }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              />
              <button
                disabled
                aria-label="Tirer — bientôt disponible"
                className="relative flex items-center gap-3 px-10 py-5 rounded-full font-black text-xl tracking-tight cursor-not-allowed select-none"
                style={{
                  background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.08))",
                  border: "1px solid rgba(245,158,11,0.3)",
                  color: "rgba(255,255,255,0.35)",
                  boxShadow: "0 0 30px rgba(245,158,11,0.1)",
                }}
              >
                <Shuffle className="w-6 h-6" />
                Tirer — 15 EX
                <span
                  className="text-xs font-mono ml-1 px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  Bientôt
                </span>
              </button>
            </div>
          </motion.div>

          {/* Rewards grid */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.05}
            className="text-[10px] font-mono uppercase tracking-widest text-white/25 text-center mb-5 flex items-center justify-center gap-2"
          >
            <span className="w-4 h-px bg-white/15 inline-block" />
            Récompenses possibles
            <span className="w-4 h-px bg-white/15 inline-block" />
          </motion.p>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {GACHA_REWARDS.map((reward, i) => (
              <GachaRewardCard key={reward.name} reward={reward} index={i} />
            ))}
          </div>
        </div>
      </section>

      <div className="container-main"><SectionDivider accent="#22d3ee" /></div>

      {/* ================================================================
          7. GUIDE DES TARIFS
      ================================================================ */}
      <section className="py-20 relative" aria-labelledby="tarifs-heading">
        <div className="container-main">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="mb-12 text-center"
          >
            <SectionLabel color="text-cyan-400/60" lineColor="bg-cyan-400/50">
              Tarifs Services
            </SectionLabel>
            <h2 id="tarifs-heading" className="text-3xl md:text-5xl font-black tracking-tight mb-3">
              Guide des prix
            </h2>
            <p className="text-white/45 text-sm max-w-md mx-auto">
              Fourchettes de prix par type de service.
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
                className={`flex-1 p-6 rounded-2xl bg-[#0F0F12] border overflow-hidden relative group cursor-default ${
                  tier.highlight ? "" : "border-white/8"
                }`}
                style={{
                  borderColor: tier.highlight ? `${tier.color}40` : undefined,
                  boxShadow: tier.highlight ? `0 0 40px ${tier.color}10` : undefined,
                }}
                whileHover={{ y: -4, transition: { duration: 0.3, ease: EASE_OUT_EXPO } }}
              >
                {tier.highlight && (
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${tier.color}60, transparent)` }}
                    aria-hidden="true"
                  />
                )}

                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${tier.color}12 0%, transparent 65%)` }}
                  aria-hidden="true"
                />

                <div className="relative z-10">
                  {/* Price range */}
                  <div
                    className="text-3xl font-black font-mono mb-1"
                    style={{ color: tier.color }}
                  >
                    {tier.range}
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <Clock className="w-3 h-3 text-white/30" />
                    <span className="text-xs font-mono text-white/35">{tier.duration}</span>
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-black tracking-tight text-white mb-4">{tier.name}</h3>

                  {/* Examples */}
                  <ul className="space-y-2">
                    {tier.examples.map((ex) => (
                      <li key={ex} className="flex items-center gap-2 text-sm text-white/55">
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

          {/* Important note */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.35}
            className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-white/3 border border-white/8"
          >
            <Info className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
            <p className="text-xs text-white/45 leading-relaxed">
              <span className="text-white/70 font-semibold">Règle d&apos;or :</span> Prix validé par écrit avant de commencer.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-main"><SectionDivider accent="#f97316" /></div>

      {/* ================================================================
          8. MINING SOCIAL
      ================================================================ */}
      <section className="py-20 relative" aria-labelledby="mining-heading">
        <div className="container-main">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="mb-12 text-center"
          >
            <SectionLabel color="text-orange-400/60" lineColor="bg-orange-400/50">
              Mining Social
            </SectionLabel>
            <h2 id="mining-heading" className="text-3xl md:text-5xl font-black tracking-tight mb-3">
              Gagnez du Bronze
            </h2>
            <p className="text-white/45 text-sm max-w-md mx-auto">
              Votre activité Discord vous rapporte du Bronze.
            </p>
          </motion.div>

          {/* Mining cards */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <MiningCard
              icon={MessageSquare}
              title="Activité Chat"
              detail="Messages dans les salons texte actifs."
              max="50 BR"
              color="#f97316"
              delay={0.08}
            />
            <MiningCard
              icon={Mic}
              title="Activité Vocal"
              detail="Présence active dans les salons vocaux."
              max="60 BR"
              color="#f59e0b"
              delay={0.16}
            />
            <MiningCard
              icon={Shield}
              title="Coworking"
              detail="Espaces silencieux, pas de récompense."
              color="#6b7280"
              delay={0.24}
            />
          </div>

          {/* Anti-AFK note */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.3}
            className="mb-10 flex items-start gap-3 p-4 rounded-xl bg-orange-500/6 border border-orange-500/15"
          >
            <Zap className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <p className="text-xs text-white/50 leading-relaxed">
              <span className="text-orange-400 font-semibold">Anti-AFK actif :</span> Seule la participation authentique est récompensée.
            </p>
          </motion.div>

          {/* Capital de départ table */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.1}
          >
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-5 flex items-center gap-2">
              <span className="w-3 h-px bg-white/20 inline-block" />
              Capital de départ — Bonus à l&apos;inscription
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {STARTING_CAPITAL.map((entry, i) => (
                <motion.div
                  key={entry.wave}
                  variants={scaleIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={0.1 + i * 0.1}
                  className="p-5 rounded-2xl bg-[#0F0F12] border border-white/8 hover:border-white/15 transition-all relative overflow-hidden group cursor-default"
                  whileHover={{ y: -3, transition: { duration: 0.25, ease: EASE_OUT_EXPO } }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${entry.color}50, transparent)` }}
                    aria-hidden="true"
                  />

                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-xs font-mono font-bold px-2.5 py-1 rounded-full"
                      style={{ color: entry.color, background: `${entry.color}15`, border: `1px solid ${entry.color}25` }}
                    >
                      {entry.wave}
                    </span>
                  </div>

                  <p className="text-[11px] text-white/35 mb-4 font-mono">{entry.members}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/45 flex items-center gap-1.5">
                        <Coins className="w-3 h-3 text-amber-400" />
                        Pièces d&apos;Or
                      </span>
                      <span className="text-sm font-black font-mono text-amber-400">{entry.gold} EX</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/45 flex items-center gap-1.5">
                        <Coins className="w-3 h-3 text-orange-400" />
                        Bronze
                      </span>
                      <span className="text-sm font-black font-mono text-orange-400">{entry.bronze} BR</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.4}
              className="text-[11px] font-mono text-white/20 text-center mt-5 tracking-wide"
            >
              Les vagues sont définies par la taille du serveur au moment de votre adhésion
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA to Discord */}
      <section className="py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.07) 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="container-main relative z-10 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Prêt à rejoindre{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #f59e0b, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                l&apos;économie
              </span> ?
            </h2>
            <p className="text-white/45 text-sm max-w-sm mx-auto mb-8">
              Rejoignez le Discord et réclamez votre capital de départ.
            </p>
            <a
              href={process.env.NEXT_PUBLIC_DISCORD_URL || "https://dsc.gg/expedition"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-base transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, rgba(245,158,11,0.9), rgba(167,139,250,0.9))",
                boxShadow: "0 0 40px rgba(245,158,11,0.25)",
                color: "#fff",
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
              Rejoindre le Discord
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
