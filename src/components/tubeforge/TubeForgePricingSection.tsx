"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Star, Rocket, Gift, Sparkles, ArrowRight } from "lucide-react";
import NumberTicker from "@/components/NumberTicker";
import { SALES_OPEN, PRICING_MODE } from "@/lib/salesConfig";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];
const AMBER = "#ff6a1f";

const CLASSIC_FEATURES = [
  "Expedition Launcher (Mac/Windows)",
  "TubeForge Pro : 4K, sans pub",
  "Plus de 1500 sites pris en charge",
  "Direct dans Premiere Pro & DaVinci Resolve",
  "Tarif bloqué tant que vous restez abonné",
];

function ClassicCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: easeOutExpo }}
      className="max-w-md mx-auto w-full"
    >
      <div
        className="relative rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "linear-gradient(160deg, rgba(255,106,31,0.14) 0%, rgba(13,13,22,0.98) 45%)",
          border: "1px solid rgba(255,106,31,0.35)",
        }}
      >
        <div className="flex justify-center pt-5 relative">
          <div
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #ff6a1f, #ef3a24)", color: "#fff" }}
          >
            <Star className="w-3.5 h-3.5" />
            Abonnement
          </div>
        </div>
        <div className="relative p-6 md:p-8 flex flex-col items-center text-center">
          <h3 className="font-bold text-lg text-white mb-6">Mensuel</h3>
          <div className="flex items-baseline justify-center gap-1 mb-1">
            <NumberTicker value="11,99" suffix="€" className="font-black tracking-tight text-6xl text-white" />
            <span className="text-base ml-1 text-white/40">/mois</span>
          </div>
          <p className="text-sm text-white/40 mb-8">Sans engagement, annulable en 1 clic</p>
          <ul className="w-full space-y-3 mb-8 text-left">
            {CLASSIC_FEATURES.map((f, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: AMBER }} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link
            href={SALES_OPEN ? "/checkout?plan=monthly" : "/account?mode=register"}
            className="w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #ff6a1f 0%, #ef3a24 100%)", color: "#fff" }}
          >
            Commencer <Rocket className="w-4 h-4" />
          </Link>
          <Link href="/checkout?plan=yearly" className="text-sm text-white/45 hover:text-white/80 transition-colors mt-4">
            Préférer l&apos;annuel ? <span className="text-white/70 font-semibold">99,99€/an</span> →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// Barème 2026-07-24 : mensuel 4,99€/mois · annuel 3,49€/mois (41,88€/an, −30%)
// · à vie 89,99€. Essai 14 jours avec carte sur les abos.
const PLAN_MONTHLY_CENTS = 499;
const PLAN_YEARLY_CENTS = 4188;
const PLAN_YEARLY_PER_MONTH = 349;
const PLAN_LIFETIME_CENTS = 8999;

// 3 cartes : mois à gauche, ANNÉE au centre (le héros), à vie à droite.
function ThreePlansGrid() {
  const cardBase = "flex flex-col rounded-2xl p-6 md:p-7 border";
  return (
    <div className="grid md:grid-cols-3 gap-4 md:gap-5 max-w-4xl mx-auto w-full items-stretch">
      {/* Mensuel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className={`${cardBase} border-white/10 bg-white/[0.02] max-md:order-2`}
      >
        <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-4">Mensuel</p>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="font-black text-4xl text-white">4,99€</span>
          <span className="text-sm text-white/40">/mois</span>
        </div>
        <p className="text-xs text-white/35 mb-5">Sans engagement, annulable à tout moment.</p>
        <ul className="space-y-2.5 mb-6 flex-1">
          {["14 jours gratuits", "Accès complet, 4K, 1500+ sites", "Direct dans Premiere & DaVinci"].map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-white/60">
              <Check className="w-4 h-4 shrink-0 mt-0.5 text-white/30" />
              {f}
            </li>
          ))}
        </ul>
        <Link
          href="/tubeforge/checkout?plan=sub&months=1"
          className="w-full py-3 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 transition-colors hover:bg-white/5"
          style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)" }}
        >
          Commencer l&apos;essai
        </Link>
      </motion.div>

      {/* Année — LE plan (centre, mis en avant) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.08, ease: easeOutExpo }}
        className={`${cardBase} relative max-md:order-1 md:-my-3`}
        style={{ borderColor: "rgba(255,106,31,0.45)", background: "linear-gradient(165deg, rgba(255,106,31,0.1) 0%, rgba(13,13,22,0.98) 55%)" }}
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-bold text-white" style={{ background: "linear-gradient(135deg,#ff6a1f,#ef3a24)" }}>
          Le plus choisi · −30%
        </div>
        <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: AMBER }}>Année</p>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-black text-5xl text-white">3,49€</span>
          <span className="text-sm text-white/40">/mois</span>
          <span className="text-sm text-white/30 line-through">4,99€</span>
        </div>
        <p className="text-xs text-white/40 mb-5">Facturé {eurStatic(PLAN_YEARLY_CENTS)} par an, après l&apos;essai.</p>
        <ul className="space-y-2.5 mb-6 flex-1">
          {["14 jours gratuits, 0€ aujourd'hui", "Accès complet, 4K, 1500+ sites", "Direct dans Premiere & DaVinci", "4 clés cadeau à offrir chaque année"].map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-white/75">
              <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: AMBER }} />
              {f}
            </li>
          ))}
        </ul>
        <Link
          href="/tubeforge/checkout?plan=sub&months=12"
          className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:brightness-110"
          style={{ background: "linear-gradient(135deg, #ff6a1f 0%, #ef3a24 100%)", color: "#fff" }}
        >
          Commencer 14 jours gratuits <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* À vie */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.16, ease: easeOutExpo }}
        className={`${cardBase} border-white/10 bg-white/[0.02] max-md:order-3`}
      >
        <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-4">À vie</p>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="font-black text-4xl text-white">{eurStatic(PLAN_LIFETIME_CENTS)}</span>
        </div>
        <p className="text-xs text-white/35 mb-5">Une seule fois. Plus jamais de facture.</p>
        <ul className="space-y-2.5 mb-6 flex-1">
          {["Aussi longtemps que TubeForge existe", "Accès complet, 4K, 1500+ sites", "10 clés boost d'1 mois à offrir"].map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-white/60">
              <Check className="w-4 h-4 shrink-0 mt-0.5 text-white/30" />
              {f}
            </li>
          ))}
        </ul>
        <Link
          href="/tubeforge/checkout?plan=lifetime"
          className="w-full py-3 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 transition-colors hover:bg-white/5"
          style={{ borderColor: "rgba(255,106,31,0.35)", color: AMBER }}
        >
          Obtenir l&apos;accès à vie
        </Link>
      </motion.div>
    </div>
  );
}

function eurStatic(cents: number): string {
  return (cents / 100).toLocaleString("fr-FR", { minimumFractionDigits: cents % 100 === 0 ? 0 : 2, maximumFractionDigits: 2 }) + "€";
}

function RechargeLifetimeCards() {
  return (
    <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 flex flex-col"
      >
        <div className="flex items-center gap-2 mb-4" style={{ color: AMBER }}>
          <Gift className="w-5 h-5" />
          <span className="font-mono text-xs uppercase tracking-widest">Sans engagement</span>
        </div>
        <h3 className="font-bold text-xl text-white mb-1">Recharge 1 mois</h3>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="font-black text-4xl text-white">14,99€</span>
          <span className="text-sm text-white/40">/mois, à la demande</span>
        </div>
        <p className="text-xs text-white/35 mb-4">Dès 10,49€/mois en volume, jusqu&apos;à −30% à 12 mois.</p>
        <p className="text-sm text-white/50 leading-relaxed mb-4 flex-1">
          Accès illimité 30 jours, sans renouvellement automatique. <span className="text-white/80 font-semibold">Prends-en
          plusieurs d&apos;un coup et le prix baisse.</span>
        </p>
        <div className="mb-6 min-h-[80px] flex items-center gap-2 p-3 rounded-xl" style={{ background: "rgba(255,106,31,0.07)", border: "1px solid rgba(255,106,31,0.2)" }}>
          <Gift className="w-4 h-4 shrink-0" style={{ color: AMBER }} />
          <p className="text-xs text-white/70">
            <span className="font-bold" style={{ color: AMBER }}>Bonus :</span> plus tu prends de mois, plus tu reçois de
            <span className="font-semibold"> clés cadeau</span> (1 mois chacune) à offrir à tes potes.
          </p>
        </div>
        <Link
          href="/tubeforge/checkout?plan=recharge"
          className="w-full py-3 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:bg-white/5"
          style={{ borderColor: "rgba(255,106,31,0.35)", color: AMBER }}
        >
          Recharger maintenant <ArrowRight className="w-4 h-4" />
        </Link>
        {/* Pont vers l'abonnement : la recharge auto EST l'abonnement mensuel. */}
        <Link
          href={SALES_OPEN ? "/checkout?plan=monthly" : "/account?mode=register"}
          className="mt-3 text-center text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          Préfères l&apos;automatique ? <span className="text-white/70 font-semibold">Passe à l&apos;abonnement</span> →
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
        className="relative rounded-2xl overflow-hidden p-6 md:p-8 flex flex-col"
        style={{ border: "1px solid rgba(255,106,31,0.4)", background: "linear-gradient(160deg, rgba(255,106,31,0.12) 0%, rgba(13,13,22,0.98) 50%)" }}
      >
        <div className="flex items-center gap-2 mb-4" style={{ color: AMBER }}>
          <Sparkles className="w-5 h-5" />
          <span className="font-mono text-xs uppercase tracking-widest">Paiement unique</span>
        </div>
        <h3 className="font-bold text-xl text-white mb-1">Paiement unique</h3>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="font-black text-4xl text-white">49,99€</span>
          <span className="text-sm text-white/40">une seule fois</span>
        </div>
        <p className="text-xs text-white/35 mb-4">≈ 3 recharges. Après, tu ne repaies plus jamais.</p>
        <p className="text-sm text-white/50 leading-relaxed mb-4 flex-1">
          Un seul paiement, puis accès illimité à TubeForge <span className="text-white/80 font-semibold">aussi longtemps
          que le logiciel existe</span>, sans abonnement ni renouvellement, même si le prix augmente.
        </p>
        <div className="mb-6 min-h-[80px] flex items-center gap-2 p-3 rounded-xl" style={{ background: "rgba(255,106,31,0.1)", border: "1px solid rgba(255,106,31,0.28)" }}>
          <Gift className="w-4 h-4 shrink-0" style={{ color: AMBER }} />
          <p className="text-xs text-white/75">
            <span className="font-bold" style={{ color: AMBER }}>+ 10 clés boost</span> d&apos;1 mois à offrir, valables
            le mois de ton achat.
          </p>
        </div>
        <Link
          href="/tubeforge/checkout?plan=lifetime"
          className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
          style={{ background: "linear-gradient(135deg, #ff6a1f 0%, #ef3a24 100%)", color: "#fff" }}
        >
          Obtenir l&apos;accès à vie <ArrowRight className="w-4 h-4" />
        </Link>
        {/* Symétrie visuelle avec la carte recharge + transparence sur « à vie ». */}
        <Link
          href="/cgv"
          className="mt-3 text-center text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          Sans abonnement, jamais. <span className="text-white/70 font-semibold">Ce que « à vie » garantit</span> →
        </Link>
      </motion.div>
    </div>
  );
}

export default function TubeForgePricingSection() {
  return (
    <section className="pt-16 pb-16 md:pt-24 md:pb-24 relative">
      <div className="container-main max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-center mb-12"
        >
          <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "rgba(255,106,31,0.75)" }}>
            Prix
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-[-0.03em] mb-4">
            {PRICING_MODE === "recharge_lifetime" ? "14 jours gratuits, puis dès 3,49€/mois" : "Choisis ta formule"}
          </h2>
          <p className="text-base text-white/50 max-w-xl mx-auto leading-relaxed">
            {PRICING_MODE === "both"
              ? "Abonnement classique, ou paiement unique : recharge à la demande ou accès à vie."
              : PRICING_MODE === "recharge_lifetime"
                ? "Tu testes tout pendant 14 jours, gratuitement. Ensuite tu choisis : au mois, à l'année, ou une bonne fois pour toutes."
                : "Abonnement mensuel ou annuel, sans engagement."}
          </p>
          <div
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
            style={{ background: "rgba(255,106,31,0.08)", border: "1px solid rgba(255,106,31,0.22)", color: "rgba(255,255,255,0.8)" }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: AMBER }} />
            <span><span className="font-semibold text-white">0€ aujourd&apos;hui</span> : rien n&apos;est prélevé avant la fin des 14 jours d&apos;essai</span>
          </div>
        </motion.div>

        {PRICING_MODE === "classic" && <ClassicCard />}
        {PRICING_MODE === "recharge_lifetime" && <ThreePlansGrid />}
        {PRICING_MODE === "both" && (
          <div className="space-y-12">
            <ClassicCard />
            <div className="flex items-center gap-4 max-w-3xl mx-auto">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-mono uppercase tracking-widest text-white/30">Ou paiement unique</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <RechargeLifetimeCards />
          </div>
        )}
      </div>
    </section>
  );
}
