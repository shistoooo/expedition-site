"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  Coins,
  Gem,
  Sparkles,
  ArrowRight,
  ChevronDown,
  History,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Zap,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TransactionType = "earn" | "spend" | "convert";
type Currency = "gold" | "bronze" | "eclat";

interface Transaction {
  type: TransactionType;
  desc: string;
  amount: number;
  currency: Currency;
  date: string;
}

interface ShopItem {
  label: string;
  cost: number;
  description: string;
  highlight?: boolean;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const GOLD_CAP = 500;
const BRONZE_TO_GOLD_RATE = 20;
const GOLD_TO_ECLAT_RATE = 100;
const MIN_GOLD_FOR_ECLAT = 100;

const INITIAL_TRANSACTIONS: Transaction[] = [
  { type: "earn",    desc: "Service rendu — Miniature YouTube", amount: 45, currency: "gold",   date: "8 mars" },
  { type: "earn",    desc: "Mining Social — Chat",               amount: 38, currency: "bronze", date: "8 mars" },
  { type: "convert", desc: "Conversion Bronze — Or",             amount: 60, currency: "bronze", date: "7 mars" },
  { type: "spend",   desc: "Annonce Vitrine",                     amount: 2,  currency: "eclat",  date: "5 mars" },
  { type: "earn",    desc: "Mining Social — Vocal",               amount: 45, currency: "bronze", date: "5 mars" },
];

const SHOP_ITEMS: ShopItem[] = [
  { label: "Annonce Vitrine",    cost: 2,  description: "Pin ton service en haut du salon",        highlight: false },
  { label: "Ticket d'Or",        cost: 5,  description: "Range 3–7 EX selon le tirage",            highlight: true  },
  { label: "Portfolio Vidéo",    cost: 5,  description: "Embed ta chaîne dans le salon Portfolio", highlight: false },
  { label: "Shoutout YouTube",   cost: 10, description: "Mise en avant dans les annonces",         highlight: false },
];

// ─── Animation helpers ─────────────────────────────────────────────────────────

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const fadeUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT_EXPO, delay },
  }),
};

// ─── Animated counter ─────────────────────────────────────────────────────────

function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const motionVal = useMotionValue(value);
  const springVal = useSpring(motionVal, { stiffness: 200, damping: 28 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    motionVal.set(value);
  }, [value, motionVal]);

  useEffect(() => {
    const unsub = springVal.on("change", (v) => setDisplay(Math.round(v)));
    return unsub;
  }, [springVal]);

  return <span className={className}>{display}</span>;
}

// ─── Currency badge ────────────────────────────────────────────────────────────

function CurrencyTag({ currency, amount, sign }: { currency: Currency; amount: number; sign: "+" | "-" }) {
  const config: Record<Currency, { color: string; label: string }> = {
    gold:   { color: sign === "+" ? "text-amber-400"   : "text-amber-300/70",   label: "EX"  },
    bronze: { color: sign === "+" ? "text-orange-400"  : "text-orange-300/70",  label: "BR"  },
    eclat:  { color: sign === "+" ? "text-purple-400"  : "text-purple-300/70",  label: "ECL" },
  };
  const { color, label } = config[currency];
  return (
    <span className={`text-sm font-mono font-bold ${color}`}>
      {sign}{amount} {label}
    </span>
  );
}

// ─── Balance Card ──────────────────────────────────────────────────────────────

interface BalanceCardProps {
  title: string;
  subtitle: string;
  value: number;
  Icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  glowColor: string;
  borderColor: string;
  cap?: number;
  delay?: number;
}

function BalanceCard({ title, subtitle, value, Icon, iconColor, glowColor, borderColor, cap, delay = 0 }: BalanceCardProps) {
  const pct = cap ? Math.min((value / cap) * 100, 100) : null;
  const nearCap = pct !== null && pct >= 80;

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={delay}
      className={`relative flex-1 p-5 rounded-2xl bg-[#0F0F12] border ${borderColor} overflow-hidden group transition-all duration-300 hover:border-opacity-40`}
      style={{ boxShadow: `0 8px 40px ${glowColor}08` }}
    >
      {/* Ambient glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 60% 0%, ${glowColor}18 0%, transparent 70%)` }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/35 mb-0.5">{subtitle}</p>
            <p className="text-xs font-semibold text-white/55">{title}</p>
          </div>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${glowColor}18` }}
          >
            <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
          </div>
        </div>

        <AnimatedNumber
          value={value}
          className="text-3xl font-black tracking-tight text-white leading-none"
        />

        {cap && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-mono ${nearCap ? "text-amber-400/80" : "text-white/25"}`}>
                {nearCap ? (pct === 100 ? "Plafond atteint" : "Proche du plafond") : `/ ${cap} max`}
              </span>
              <span className="text-[10px] font-mono text-white/25">{Math.round(pct!)}%</span>
            </div>
            {/* Progress track */}
            <div className="h-1 rounded-full bg-white/8 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: pct! >= 100
                    ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                    : pct! >= 80
                    ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                    : `linear-gradient(90deg, ${glowColor}cc, ${glowColor})`,
                }}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: delay + 0.3 }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Conversion Card ──────────────────────────────────────────────────────────

interface ConversionCardProps {
  title: string;
  fromLabel: string;
  toLabel: string;
  fromColor: string;
  toColor: string;
  fromBalance: number;
  rate: number;
  minAmount: number;
  onConvert: (amount: number) => void;
  delay?: number;
}

function ConversionCard({
  title, fromLabel, toLabel, fromColor, toColor,
  fromBalance, rate, minAmount, onConvert, delay = 0,
}: ConversionCardProps) {
  const [inputVal, setInputVal] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const raw = parseInt(inputVal, 10) || 0;
  // Snap to nearest valid multiple
  const amount = Math.floor(raw / rate) * rate;
  const preview = amount > 0 ? Math.floor(amount / rate) : 0;
  const isValid = amount >= minAmount && amount <= fromBalance;
  const errorMsg =
    raw > 0 && amount < minAmount
      ? `Minimum ${minAmount} ${fromLabel}`
      : raw > fromBalance
      ? "Solde insuffisant"
      : null;

  const handleConvert = () => {
    if (!isValid) return;
    onConvert(amount);
    setStatus("success");
    setInputVal("");
    setTimeout(() => setStatus("idle"), 2000);
  };

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={delay}
      className="flex-1 p-5 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5 space-y-4"
    >
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-white/35 mb-1">Conversion</p>
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>

      {/* From / To legend */}
      <div className="flex items-center gap-2 text-xs">
        <span className={`font-mono font-bold ${fromColor}`}>{fromLabel}</span>
        <ArrowRight className="w-3 h-3 text-white/25" />
        <span className={`font-mono font-bold ${toColor}`}>{toLabel}</span>
        <span className="text-white/25 ml-auto">
          {rate} : 1
        </span>
      </div>

      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="number"
          min={minAmount}
          step={rate}
          value={inputVal}
          onChange={(e) => { setInputVal(e.target.value); setStatus("idle"); }}
          placeholder={`Min ${minAmount}`}
          aria-label={`Quantité de ${fromLabel} à convertir`}
          className="w-full h-11 px-4 pr-16 bg-white/5 rounded-xl border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.07] transition-all text-sm font-mono"
        />
        <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold ${fromColor} pointer-events-none`}>
          {fromLabel}
        </span>
      </div>

      {/* Preview */}
      <AnimatePresence mode="wait">
        {preview > 0 && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/4 border border-white/6">
              <span className="text-xs text-white/45">Vous recevrez</span>
              <span className={`text-sm font-black font-mono ${toColor}`}>
                +{preview} {toLabel}
              </span>
            </div>
          </motion.div>
        )}
        {errorMsg && (
          <motion.div
            key="error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/8 border border-red-500/15">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="text-xs text-red-400">{errorMsg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Convert button */}
      <button
        onClick={handleConvert}
        disabled={!isValid || status === "success"}
        aria-label={`Convertir ${amount} ${fromLabel} en ${toLabel}`}
        className="w-full h-10 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: isValid
            ? "linear-gradient(135deg, rgba(139,92,246,0.8), rgba(109,40,217,0.9))"
            : "rgba(255,255,255,0.04)",
          border: isValid ? "1px solid rgba(139,92,246,0.35)" : "1px solid rgba(255,255,255,0.06)",
          boxShadow: isValid ? "0 0 20px rgba(139,92,246,0.2)" : "none",
          color: isValid ? "#fff" : "rgba(255,255,255,0.3)",
        }}
      >
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.span
              key="done"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-green-400"
            >
              <CheckCircle2 className="w-4 h-4" />
              Converti
            </motion.span>
          ) : (
            <motion.span key="convert" className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5" />
              Convertir
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}

// ─── Transaction row ───────────────────────────────────────────────────────────

function TransactionRow({ tx, index }: { tx: Transaction; index: number }) {
  const iconConfig: Record<TransactionType, { Icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
    earn:    { Icon: TrendingUp,  color: "text-green-400",  bg: "bg-green-400/10"  },
    spend:   { Icon: TrendingDown, color: "text-red-400",   bg: "bg-red-400/10"    },
    convert: { Icon: RefreshCw,   color: "text-purple-400", bg: "bg-purple-400/10" },
  };
  const { Icon, color, bg } = iconConfig[tx.type];
  const sign = tx.type === "spend" ? "-" : "+";

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index * 0.06}
      className="flex items-center gap-3 py-3 border-b border-white/4 last:border-0"
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
        <Icon className={`w-3.5 h-3.5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/75 truncate leading-tight">{tx.desc}</p>
        <p className="text-[10px] text-white/30 mt-0.5">{tx.date}</p>
      </div>
      <CurrencyTag currency={tx.currency} amount={tx.amount} sign={sign as "+" | "-"} />
    </motion.div>
  );
}

// ─── Shop Item Card ────────────────────────────────────────────────────────────

function ShopItemCard({ item, eclatBalance, index }: { item: ShopItem; eclatBalance: number; index: number }) {
  const canAfford = eclatBalance >= item.cost;

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index * 0.07}
      className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer group
        ${item.highlight
          ? "bg-purple-500/8 border-purple-500/25 hover:border-purple-500/40 hover:bg-purple-500/12"
          : "bg-white/3 border-white/8 hover:border-white/15 hover:bg-white/5"
        }
        ${!canAfford ? "opacity-50" : ""}
      `}
    >
      {item.highlight && (
        <div className="absolute top-2 right-2">
          <Zap className="w-3 h-3 text-purple-400" />
        </div>
      )}

      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-bold text-white leading-tight">{item.label}</span>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <Gem className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-sm font-black font-mono text-purple-400">{item.cost}</span>
        </div>
      </div>
      <p className="text-[11px] text-white/40 leading-snug">{item.description}</p>
    </motion.div>
  );
}

// ─── Main WalletSection component ─────────────────────────────────────────────

export default function WalletSection() {
  const [goldBalance, setGoldBalance]     = useState(247);
  const [bronzeBalance, setBronzeBalance] = useState(1830);
  const [eclatBalance, setEclatBalance]   = useState(3);
  const [transactions, setTransactions]   = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [historyOpen, setHistoryOpen]     = useState(false);

  // Bronze → Gold conversion
  const handleBronzeToGold = (bronzeAmount: number) => {
    const goldGained = Math.floor(bronzeAmount / BRONZE_TO_GOLD_RATE);
    const goldAfter  = Math.min(goldBalance + goldGained, GOLD_CAP);
    const actualGold = goldAfter - goldBalance;
    const actualBronze = actualGold * BRONZE_TO_GOLD_RATE;

    setBronzeBalance((prev) => prev - actualBronze);
    setGoldBalance(goldAfter);
    setTransactions((prev) => [
      { type: "convert", desc: "Conversion Bronze — Or", amount: actualBronze, currency: "bronze", date: "maintenant" },
      ...prev,
    ]);
  };

  // Gold → Éclat conversion
  const handleGoldToEclat = (goldAmount: number) => {
    const eclatGained = Math.floor(goldAmount / GOLD_TO_ECLAT_RATE);
    setGoldBalance((prev) => prev - goldAmount);
    setEclatBalance((prev) => prev + eclatGained);
    setTransactions((prev) => [
      { type: "convert", desc: "Conversion Or — Éclat", amount: goldAmount, currency: "gold", date: "maintenant" },
      ...prev,
    ]);
  };

  return (
    <section
      aria-label="Portefeuille Expedition Coin"
      className="p-8 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5 space-y-7"
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        className="flex items-start justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-px bg-amber-400/50 inline-block" />
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400/60">Économie Discord</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">Portefeuille</h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/8 border border-amber-400/15">
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-mono font-bold text-amber-400">EX</span>
        </div>
      </motion.div>

      {/* ── Balance Cards ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <BalanceCard
          title="Pièces d'Or"
          subtitle="EX"
          value={goldBalance}
          Icon={Coins}
          iconColor="text-amber-400"
          glowColor="#f59e0b"
          borderColor="border-amber-500/20"
          cap={GOLD_CAP}
          delay={0}
        />
        <BalanceCard
          title="Pièces de Bronze"
          subtitle="BR"
          value={bronzeBalance}
          Icon={Coins}
          iconColor="text-orange-400"
          glowColor="#f97316"
          borderColor="border-orange-500/15"
          delay={0.07}
        />
        <BalanceCard
          title="Points d'Éclat"
          subtitle="ECL"
          value={eclatBalance}
          Icon={Gem}
          iconColor="text-purple-400"
          glowColor="#8b5cf6"
          borderColor="border-purple-500/20"
          delay={0.14}
        />
      </div>

      {/* ── Conversion Zone ────────────────────────────────────────────── */}
      <div>
        <motion.p
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.05}
          className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-3 flex items-center gap-2"
        >
          <span className="w-3 h-px bg-white/20 inline-block" />
          Conversions
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-3">
          <ConversionCard
            title="Bronze vers Or"
            fromLabel="BR"
            toLabel="EX"
            fromColor="text-orange-400"
            toColor="text-amber-400"
            fromBalance={bronzeBalance}
            rate={BRONZE_TO_GOLD_RATE}
            minAmount={BRONZE_TO_GOLD_RATE}
            onConvert={handleBronzeToGold}
            delay={0.1}
          />
          <ConversionCard
            title="Or vers Éclat"
            fromLabel="EX"
            toLabel="ECL"
            fromColor="text-amber-400"
            toColor="text-purple-400"
            fromBalance={goldBalance}
            rate={GOLD_TO_ECLAT_RATE}
            minAmount={MIN_GOLD_FOR_ECLAT}
            onConvert={handleGoldToEclat}
            delay={0.18}
          />
        </div>
      </div>

      {/* ── Transaction History ────────────────────────────────────────── */}
      <div>
        <button
          onClick={() => setHistoryOpen((v) => !v)}
          aria-expanded={historyOpen}
          className="w-full flex items-center justify-between group"
        >
          <motion.p
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.1}
            className="text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-2"
          >
            <History className="w-3 h-3 text-white/25" />
            Dernières transactions
          </motion.p>
          <motion.div
            animate={{ rotate: historyOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
          >
            <ChevronDown className="w-4 h-4 text-white/25 group-hover:text-white/50 transition-colors" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {historyOpen && (
            <motion.div
              key="history"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              className="overflow-hidden"
            >
              <div className="mt-3 p-4 rounded-xl bg-white/3 border border-white/6">
                {transactions.slice(0, 6).map((tx, i) => (
                  <TransactionRow key={i} tx={tx} index={i} />
                ))}
                {transactions.length === 0 && (
                  <p className="text-xs text-white/30 text-center py-4">Aucune transaction</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Éclat Shop Preview ─────────────────────────────────────────── */}
      <div>
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.05}
          className="flex items-center justify-between mb-3"
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 flex items-center gap-2">
            <ShoppingBag className="w-3 h-3 text-white/25" />
            Boutique Éclat
          </p>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-purple-400/70" />
            <span className="text-xs font-mono text-purple-400/70">
              <AnimatedNumber value={eclatBalance} /> ECL disponibles
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SHOP_ITEMS.map((item, i) => (
            <ShopItemCard key={item.label} item={item} eclatBalance={eclatBalance} index={i} />
          ))}
        </div>

        <motion.p
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.3}
          className="text-[10px] text-white/20 text-center mt-3"
        >
          Les achats se font dans le salon Discord — la boutique complète arrive bientôt.
        </motion.p>
      </div>
    </section>
  );
}
