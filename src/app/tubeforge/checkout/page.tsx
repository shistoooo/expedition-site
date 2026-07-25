"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ShieldCheck, Gift, Sparkles, Loader2, AlertCircle, Mail, Lock, CreditCard, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import MonthSelector, { LIFETIME_CENTS, LIFETIME_PROMO_CENTS, volumeDiscountPct, bulkTotalCents, eur, subPerMonthCents, subPeriodTotalCents, subDiscountPct, SUB_TRIAL_DAYS } from "@/components/tubeforge/MonthSelector";

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || "https://api.clipapp.uk";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_live_51JicqfFeRMzmhuFlENwkuNgIT1Eu4dXjdrzgjXTAvSbMDrLeEeOVwe5sKXwPOKQE3JilpVVi84pRGvl0isY1ZVlV00aKp2MkBc");
const AMBER = "#ff6a1f";
// Créateurs qui utilisent la suite (source: page principale) — social proof.
const CREATORS = [
  { h: "Donay", a: "/youtubers/donay.jpg" },
  { h: "Manji", a: "/youtubers/manji.jpg" },
  { h: "Champ Libre", a: "/youtubers/champlibre0.jpg" },
  { h: "Maxime", a: "/youtubers/maxim-well.jpg" },
];

const stripeAppearance = {
  theme: "night" as const,
  variables: {
    colorPrimary: AMBER, colorBackground: "#0F0F12", colorText: "#ffffff", colorDanger: "#ef4444",
    borderRadius: "12px", colorTextSecondary: "#ffffff66", colorTextPlaceholder: "#ffffff33",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  rules: {
    ".Input": { backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "none", color: "#ffffff" },
    ".Input:focus": { border: "1px solid rgba(255,106,31,0.5)", backgroundColor: "rgba(255,255,255,0.07)", boxShadow: "none" },
    ".Label": { color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", textTransform: "uppercase" as const },
    ".Tab": { backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" },
    ".Tab--selected": { backgroundColor: "rgba(255,106,31,0.15)", border: "1px solid rgba(255,106,31,0.35)", color: "#ffffff" },
    ".Tab:hover": { color: "#ffffff" },
  },
};

const COMMON_INCLUDED = [
  "4K, sans filigrane, sans pub",
  "1500+ sites : YouTube, TikTok, Vimeo, X…",
  "Direct dans Premiere Pro & DaVinci Resolve",
  "Téléchargements illimités, 3 en parallèle",
  "Utilisable sur 2 ordis en même temps",
];

type OneTimePlan = "recharge" | "lifetime";
type PlanKind = "sub" | "recharge" | "lifetime";

/* ── Formulaire carte pour l'ABONNEMENT (SetupIntent : 0€ aujourd'hui) ────── */
function SetupForm({ months }: { months: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstChargeDate = new Date(Date.now() + SUB_TRIAL_DAYS * 86400000).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  const firstChargeLabel = months === 1
    ? `${eur(subPeriodTotalCents(1))} par mois`
    : `${eur(subPeriodTotalCents(months))} pour ${months} mois`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError(null);
    setSubmitting(true);
    const { error: err, setupIntent } = await stripe.confirmSetup({
      elements,
      confirmParams: { return_url: `${window.location.origin}/tubeforge/merci?kind=sub` },
      redirect: "if_required",
    });
    if (err) { setError(err.message || "L'enregistrement de la carte a échoué. Vérifie tes informations."); setSubmitting(false); return; }
    if (setupIntent && setupIntent.status === "succeeded") {
      window.location.href = `${window.location.origin}/tubeforge/merci?kind=sub&setup_intent=${setupIntent.id}`;
      return;
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-7 rounded-2xl bg-[#0F0F12] border border-white/10">
      <PaymentElement options={{ layout: "tabs" }} />

      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-sm">{error}</motion.p>
        )}
      </AnimatePresence>

      <button type="submit" data-track="checkout-carte" disabled={!stripe || submitting}
        className="w-full mt-6 py-4 rounded-xl font-bold text-base transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
        style={{ background: "linear-gradient(135deg,#ff6a1f 0%,#ef3a24 100%)", color: "#fff" }}>
        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Démarrer mes 14 jours gratuits</>}
      </button>

      <div className="flex items-center justify-center gap-x-4 gap-y-2 mt-5 flex-wrap">
        <span className="flex items-center gap-1.5 text-white/35 text-[10px]"><ShieldCheck className="w-3.5 h-3.5 text-white/40" /> Paiement sécurisé</span>
        <span className="flex items-center gap-1.5 text-white/35 text-[10px]"><CreditCard className="w-3.5 h-3.5 text-white/40" /> Visa · Mastercard · AMEX</span>
        <span className="flex items-center gap-1.5 text-white/35 text-[10px]"><Lock className="w-3.5 h-3.5 text-white/40" /> Chiffrement SSL</span>
      </div>
      <p className="mt-3 text-center text-[10px] text-white/30 leading-normal">
        <span className="text-white/50 font-semibold">0€ aujourd&apos;hui.</span> Premier prélèvement le {firstChargeDate} : {firstChargeLabel}.<br />
        Annulable avant en 1 clic depuis ton compte. Carte gérée par Stripe.
      </p>
    </form>
  );
}

/* ── Formulaire carte (dans <Elements>) ─────────────────────────────────── */
function PaymentForm({ plan, price }: { plan: OneTimePlan; price: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Veuillez entrer une adresse email valide."); return; }
    setError(null);
    setSubmitting(true);
    const { error: err, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/tubeforge/merci?kind=${plan}`, receipt_email: email },
      redirect: "if_required",
    });
    if (err) { setError(err.message || "Le paiement a échoué. Vérifie tes informations."); setSubmitting(false); return; }
    if (paymentIntent && paymentIntent.status === "succeeded") {
      window.location.href = `${window.location.origin}/tubeforge/merci?kind=${plan}&payment_intent=${paymentIntent.id}`;
      return;
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-7 rounded-2xl bg-[#0F0F12] border border-white/10">
      <div className="space-y-2 mb-5">
        <label htmlFor="email" className="text-xs font-mono text-white/40 uppercase">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input id="email" type="email" value={email} onChange={(ev) => setEmail(ev.target.value)} required placeholder="vous@email.com"
            className="w-full h-11 pl-10 pr-4 bg-white/5 rounded-xl border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.07] transition-all text-sm" />
        </div>
      </div>

      <PaymentElement options={{ layout: "tabs" }} />

      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-sm">{error}</motion.p>
        )}
      </AnimatePresence>

      <button type="submit" data-track="checkout-payer" disabled={!stripe || submitting}
        className="w-full mt-6 py-4 rounded-xl font-bold text-base transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
        style={{ background: "linear-gradient(135deg,#ff6a1f 0%,#ef3a24 100%)", color: "#fff" }}>
        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Payer {price}</>}
      </button>

      <div className="flex items-center justify-center gap-x-4 gap-y-2 mt-5 flex-wrap">
        <span className="flex items-center gap-1.5 text-white/35 text-[10px]"><ShieldCheck className="w-3.5 h-3.5 text-white/40" /> Paiement sécurisé</span>
        <span className="flex items-center gap-1.5 text-white/35 text-[10px]"><CreditCard className="w-3.5 h-3.5 text-white/40" /> Visa · Mastercard · AMEX</span>
        <span className="flex items-center gap-1.5 text-white/35 text-[10px]"><Lock className="w-3.5 h-3.5 text-white/40" /> Chiffrement SSL</span>
      </div>
      <p className="mt-3 text-center text-[10px] text-white/30 leading-normal">
        Payé via Stripe : tes données bancaires ne passent jamais par nos serveurs.<br />Tu choisiras ton mot de passe juste après le paiement.
      </p>
    </form>
  );
}

function OneTimeCheckoutContent() {
  const searchParams = useSearchParams();
  // Par défaut = abonnement (flow C). Recharge/lifetime restent accessibles
  // par paramètre explicite (flows A/B, jamais supprimés).
  const planParam = searchParams.get("plan");
  const plan: PlanKind = planParam === "lifetime" ? "lifetime" : planParam === "recharge" ? "recharge" : "sub";
  const isLifetime = plan === "lifetime";
  const isSub = plan === "sub";
  // Offre « page cachée » — le worker revalide le code et recalcule le montant :
  // l'URL ne fait qu'afficher, jamais fixer le prix.
  const promoVie = isLifetime && searchParams.get("offre") === "vie119";
  // Pré-sélection du nombre de mois quand on arrive depuis le sélecteur de la landing.
  const initialMonths = Math.min(12, Math.max(1, parseInt(searchParams.get("months") || (isSub ? "12" : "1"), 10) || 1));

  const [months, setMonths] = useState(initialMonths);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  // Flow abonnement : étape email entre le sélecteur et la carte (le worker a
  // besoin de l'email pour créer le customer Stripe AVANT le SetupIntent).
  const [subStep, setSubStep] = useState<"select" | "email">(searchParams.get("months") ? "email" : "select");
  const [email, setEmail] = useState("");
  const lifeStarted = useRef(false);

  const totalCents = isLifetime
    ? (promoVie ? LIFETIME_PROMO_CENTS : LIFETIME_CENTS)
    : isSub ? subPeriodTotalCents(months) : bulkTotalCents(months);
  const pct = isLifetime ? 0 : isSub ? subDiscountPct(months) : volumeDiscountPct(months);
  const Icon = isLifetime ? Sparkles : Gift;

  async function createPI(m: number) {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch(`${WORKER_URL}/auth/tubeforge/payment-intent`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan, months: m, ...(promoVie ? { offer: "vie119" } : {}) }),
      });
      const data = await res.json();
      if (!res.ok || !data.clientSecret) throw new Error(data.error || "Paiement indisponible pour le moment.");
      setClientSecret(data.clientSecret);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setCreating(false);
    }
  }

  // Abonnement : email + mois → SetupIntent (carte enregistrée, 0€ aujourd'hui).
  async function createSetup(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Veuillez entrer une adresse email valide."); return; }
    setCreating(true);
    setError(null);
    try {
      const res = await fetch(`${WORKER_URL}/auth/tubeforge/subscribe-setup`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, months }),
      });
      const data = await res.json();
      if (!res.ok || !data.clientSecret) throw new Error(data.error || "Paiement indisponible pour le moment.");
      setClientSecret(data.clientSecret);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setCreating(false);
    }
  }

  // Lifetime : PI direct au chargement. Recharge/abonnement : on attend le choix.
  useEffect(() => {
    if (isLifetime && !lifeStarted.current) { lifeStarted.current = true; createPI(1); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLifetime]);

  const included = isLifetime
    ? ["Accès à vie, un seul paiement", ...COMMON_INCLUDED, "10 clés boost d'1 mois à offrir (valables le mois de ton achat)", "Plus jamais de facture"]
    : isSub
      ? ["14 jours d'essai gratuit, accès complet", ...COMMON_INCLUDED, "4 clés cadeau à offrir chaque année (plan annuel)", "Annulable à tout moment"]
      : [`${months} mois d'accès illimité (${months * 30} jours)`, ...COMMON_INCLUDED, "Sans renouvellement automatique"];
  const reassure = isLifetime
    ? "Paiement unique, accès illimité tant que TubeForge existe. Pas d'abonnement, jamais de renouvellement."
    : isSub
      ? "0€ aujourd'hui. Rien n'est prélevé avant la fin des 14 jours, et tu peux annuler avant en 1 clic depuis ton compte."
      : "Zéro engagement, zéro prélèvement automatique. Tu recharges quand tu veux.";

  return (
    <div className="w-full min-h-screen flex flex-col overflow-x-hidden relative text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[2]" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: "#07060f" }} />
      </div>

      <Navbar />

      <main className="w-full relative z-10 flex-1 pt-28 md:pt-32 pb-16">
        <div className="container-main max-w-4xl mx-auto">
          <Link href="/tubeforge" className="group inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/80 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Retour à TubeForge
          </Link>

          {/* Récap */}
          <div className="rounded-2xl overflow-hidden mb-6" style={{ background: "linear-gradient(160deg, rgba(255,106,31,0.14) 0%, rgba(13,13,22,0.98) 55%)", border: "1px solid rgba(255,106,31,0.3)" }}>
            <div className="p-6 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,106,31,0.15)", border: "1px solid rgba(255,106,31,0.35)" }}>
                <Icon className="w-5 h-5" style={{ color: AMBER }} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-white">
                  {isLifetime ? "Accès à vie" : isSub ? (months === 1 ? "Abonnement mensuel" : `Abonnement — ${months} mois`) : `Recharge — ${months} mois`}
                </p>
                <p className="text-sm text-white/50">
                  {isLifetime
                    ? "Un seul paiement, accès illimité tant que le logiciel existe."
                    : isSub
                      ? "14 jours gratuits, annulable à tout moment."
                      : `${months * 30} jours d'accès illimité, sans renouvellement auto.`}
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-baseline gap-1.5 justify-end">
                  {promoVie && <span className="text-sm text-white/30 line-through">{eur(LIFETIME_CENTS)}</span>}
                  {/* Le HÉROS = le montant réellement facturé. Le prix, c'est le
                      prix — pas d'habillage « offre », pas de /mois d'appel. */}
                  <p className="font-black text-3xl text-white tabular-nums">
                    {eur(totalCents)}
                  </p>
                  {!isSub && pct > 0 && <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(255,106,31,0.18)", color: AMBER }}>−{pct}%</span>}
                  {promoVie && <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(255,106,31,0.18)", color: AMBER }}>offre privée</span>}
                </div>
                <p className="text-xs text-white/40">
                  {isLifetime
                    ? "une seule fois"
                    : isSub
                      ? <>0€ aujourd&apos;hui · prélevé après les 14 jours d&apos;essai{months > 1 ? <> (soit {eur(subPerMonthCents(months))}/mois)</> : null}</>
                      : "paiement unique"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
            <div>
              {error ? (
                <div className="p-6 rounded-2xl bg-[#0F0F12] border border-red-500/25 text-center">
                  <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                  <p className="text-red-300 text-sm mb-4">{error}</p>
                  <button onClick={() => { setError(null); if (isLifetime) { lifeStarted.current = false; createPI(1); } }} className="text-sm text-white/60 hover:text-white underline underline-offset-2">Réessayer</button>
                </div>
              ) : clientSecret ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
                    {isSub ? <SetupForm months={months} /> : <PaymentForm plan={plan as OneTimePlan} price={eur(totalCents)} />}
                  </Elements>
                </motion.div>
              ) : isSub ? (
                subStep === "select" ? (
                  <MonthSelector months={months} setMonths={setMonths} mode="sub" onContinue={() => setSubStep("email")} loading={false} />
                ) : (
                  <form onSubmit={createSetup} className="p-6 md:p-7 rounded-2xl bg-[#0F0F12] border border-white/10">
                    <h2 className="text-lg font-bold mb-1">Ton email</h2>
                    <p className="text-sm text-white/45 mb-5">C&apos;est lui qui servira à te connecter à TubeForge.</p>
                    <div className="relative mb-5">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input type="email" value={email} onChange={(ev) => setEmail(ev.target.value)} required placeholder="vous@email.com" autoFocus
                        className="w-full h-11 pl-10 pr-4 bg-white/5 rounded-xl border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.07] transition-all text-sm" />
                    </div>
                    <button type="submit" data-track="checkout-email" disabled={creating}
                      className="w-full py-4 rounded-xl font-bold text-base transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg,#ff6a1f 0%,#ef3a24 100%)", color: "#fff" }}>
                      {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continuer vers la carte <ArrowRight className="w-4 h-4" /></>}
                    </button>
                    <button type="button" onClick={() => setSubStep("select")} className="w-full mt-3 text-xs text-white/40 hover:text-white/70 transition-colors">
                      ← Changer la durée ({months === 1 ? "mensuel" : `${months} mois`})
                    </button>
                  </form>
                )
              ) : !isLifetime ? (
                <MonthSelector months={months} setMonths={setMonths} onContinue={() => createPI(months)} loading={creating} />
              ) : (
                <div className="p-10 rounded-2xl bg-[#0F0F12] border border-white/10 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-white/50" />
                  <p className="text-sm text-white/40">Préparation du paiement sécurisé…</p>
                </div>
              )}
            </div>

            {/* Réassurance */}
            <aside className="space-y-4 lg:sticky lg:top-28">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <h3 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">Ce que tu obtiens</h3>
                <ul className="space-y-3">
                  {included.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: AMBER }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border p-5 flex gap-3" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-white/50" />
                <div>
                  <p className="text-white font-bold text-sm mb-1">Sans mauvaise surprise</p>
                  <p className="text-white/55 text-xs leading-relaxed">{reassure}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-1">
                <div className="flex -space-x-2">
                  {CREATORS.map((c) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={c.h} src={c.a} alt={c.h} title={c.h} className="w-7 h-7 rounded-full border-2 border-[#06051a] object-cover bg-white/5" />
                  ))}
                </div>
                <p className="text-xs text-white/45"><span className="text-white/70">Donay, Manji, Champ&nbsp;Libre, Maxime</span> l&apos;utilisent au quotidien.</p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function TubeForgeCheckoutPage() {
  return (
    <Suspense>
      <OneTimeCheckoutContent />
    </Suspense>
  );
}
