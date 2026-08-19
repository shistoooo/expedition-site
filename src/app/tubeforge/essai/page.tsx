"use client";

/**
 * ESSAI 14 JOURS — LE PARCOURS D'OUVERTURE.
 *
 * L'essai n'est plus un abonnement Stripe (fermé le 2026-08-08). Ici : la carte
 * est enregistrée sans être débitée, l'accès dure 14 jours, et au quinzième un
 * seul paiement de 39,99 € part. Aucun renouvellement.
 *
 * ⛔ CE QUI EST ANNONCÉ AVANT LA CARTE N'EST PAS DÉCORATIF.
 * Prélever quelqu'un sans lui avoir dit le montant et la date est illégal en
 * France. Le bloc d'annonce est donc placé AVANT le formulaire de paiement, et
 * la date vient du SERVEUR — la calculer dans le navigateur afficherait une
 * date fausse à qui a une horloge décalée, et on s'engage sur ce qu'on affiche.
 *
 * Une page à part plutôt qu'un mode du checkout : le tunnel d'achat force
 * `plan = "lifetime"` depuis la fermeture des abonnements, et y rouvrir une
 * variante rendrait cette ligne à nouveau ambiguë.
 */

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, CreditCard, Loader2, AlertCircle, Check } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { capturerParrainage, lireParrainage } from "@/lib/parrainage";

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || "https://api.clipapp.uk";
const AMBRE = "#ff6a1f";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_live_51JicqfFeRMzmhuFlENwkuNgIT1Eu4dXjdrzgjXTAvSbMDrLeEeOVwe5sKXwPOKQE3JilpVVi84pRGvl0isY1ZVlV00aKp2MkBc",
);

const apparence = {
  theme: "night" as const,
  variables: {
    colorPrimary: AMBRE, colorBackground: "#0F0F12", colorText: "#ffffff",
    colorDanger: "#ef4444", borderRadius: "12px",
    colorTextSecondary: "#ffffff66", colorTextPlaceholder: "#ffffff33",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
};

const euros = (cents: number) =>
  (cents / 100).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + " €";

/** La date telle qu'elle sera écrite dans les e-mails : même mot, même jour. */
const jour = (ms: number) =>
  new Date(ms).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

type Ouverture = { clientSecret: string; setupIntentId: string; montantCents: number; preleveAt: number };

/* ── Le formulaire de carte ─────────────────────────────────────────────── */
function FormulaireCarte({ o }: { o: Ouverture }) {
  const stripe = useStripe();
  const elements = useElements();
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setErreur(null);
    setEnvoi(true);
    const { error, setupIntent } = await stripe.confirmSetup({
      elements,
      confirmParams: { return_url: `${window.location.origin}/tubeforge/merci?kind=essai` },
      redirect: "if_required",
    });
    if (error) {
      setErreur(error.message || "L'enregistrement de la carte a échoué.");
      setEnvoi(false);
      return;
    }
    if (setupIntent?.status === "succeeded") {
      window.location.href = `${window.location.origin}/tubeforge/merci?kind=essai&setup_intent=${setupIntent.id}`;
      return;
    }
    setEnvoi(false);
  };

  return (
    <form onSubmit={soumettre} className="p-6 md:p-7 rounded-2xl bg-[#0F0F12] border border-white/10">
      <PaymentElement options={{ layout: "tabs" }} />

      {erreur && (
        <p className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {erreur}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || envoi}
        className="w-full mt-6 py-4 rounded-xl font-bold text-base transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
        style={{ background: "linear-gradient(135deg,#ff6a1f 0%,#ef3a24 100%)", color: "#fff" }}
      >
        {envoi ? <Loader2 className="w-5 h-5 animate-spin" /> : "Commencer mes 14 jours"}
      </button>

      {/* Le rappel EST répété sous le bouton, et c'est voulu : c'est le dernier
          endroit que la personne regarde avant de valider. Ce n'est pas la même
          fonction que le bloc d'annonce plus haut, qui sert à décider. */}
      <p className="mt-4 text-center text-xs text-white/45 leading-relaxed">
        <span className="text-white/70 font-semibold">0 € aujourd&apos;hui.</span>{" "}
        Le {jour(o.preleveAt)}, {euros(o.montantCents)} en une fois. Aucun abonnement.
      </p>

      <div className="flex items-center justify-center gap-x-4 gap-y-2 mt-4 flex-wrap">
        <span className="flex items-center gap-1.5 text-white/35 text-[10px]"><ShieldCheck className="w-3.5 h-3.5" /> Paiement sécurisé</span>
        <span className="flex items-center gap-1.5 text-white/35 text-[10px]"><CreditCard className="w-3.5 h-3.5" /> Visa · Mastercard · AMEX</span>
        <span className="flex items-center gap-1.5 text-white/35 text-[10px]"><Lock className="w-3.5 h-3.5" /> Carte gérée par Stripe</span>
      </div>
    </form>
  );
}

/* ── La page ────────────────────────────────────────────────────────────── */
function Contenu() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [o, setO] = useState<Ouverture | null>(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [dejaUtilise, setDejaUtilise] = useState(false);

  /**
   * ⛔ LE CODE DE PARRAINAGE DOIT SURVIVRE AU CHEMIN, PAS SEULEMENT À L'URL.
   *
   * Première version : on ne lisait que `?ref=` sur CETTE page. Or le parcours
   * réel est « lien de l'affilié vers /tubeforge » → on lit la page → on clique
   * « Ou l'essayer 14 jours », un lien qui ne transporte aucun code. La
   * commission disparaissait donc à ce clic précis, sans que personne ne s'en
   * aperçoive : l'essai s'ouvrait normalement, et quatorze jours plus tard le
   * prélèvement partait sans `ref_code`.
   *
   * `lireParrainage()` relit le code mémorisé à l'arrivée sur n'importe quelle
   * page TubeForge (voir `CaptureParrainage`, monté dans le layout). C'est le
   * mécanisme écrit exprès pour ce cas — je l'avais simplement contourné.
   */
  const refUrl = (params.get("ref") || "").trim();
  const [ref, setRef] = useState(refUrl);
  useEffect(() => {
    if (refUrl) { capturerParrainage(); return; }
    const garde = lireParrainage();
    if (garde) setRef(garde);
  }, [refUrl]);

  const ouvrir = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErreur("Entre une adresse e-mail valide.");
      return;
    }
    setErreur(null);
    setChargement(true);
    try {
      const r = await fetch(`${WORKER_URL}/auth/tubeforge/essai-setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...(ref ? { ref } : {}) }),
      });
      const d = await r.json();
      if (r.status === 409) { setDejaUtilise(true); return; }
      if (!r.ok) { setErreur(d.message || d.error || "Impossible d'ouvrir l'essai."); return; }
      setO(d as Ouverture);
    } catch {
      setErreur("Connexion impossible. Réessaie dans un instant.");
    } finally {
      setChargement(false);
    }
  };

  if (dejaUtilise) {
    return (
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-black mb-3">Tu as déjà eu ton essai</h1>
        <p className="text-white/55 mb-7">
          Cette adresse a déjà bénéficié d&apos;un essai TubeForge. L&apos;outil s&apos;achète
          une fois, 39,99 €, et il est à toi.
        </p>
        <Link
          href="/tubeforge/checkout?plan=lifetime"
          className="inline-flex w-full items-center justify-center py-3.5 rounded-xl font-semibold text-sm"
          style={{ background: AMBRE, color: "#0a0a0a" }}
        >
          Obtenir TubeForge
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: "rgba(255,106,31,0.75)" }}>
          Essai
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-[-0.03em] mb-3">
          14 jours, tout compris
        </h1>
        {/* La carte de prix dit déjà « Toutes les fonctions, sans limite de
            téléchargements » : le détecteur a signalé la phrase partagée entre
            les deux pages. Ici on répond à une autre question — non pas « qu'est-ce
            que j'achète » mais « qu'est-ce qui est bridé pendant l'essai ». */}
        <p className="text-white/55 leading-relaxed">
          Rien n&apos;est bridé : c&apos;est TubeForge entier, pendant quatorze jours.
        </p>
      </div>

      {/**
        * ⛔ L'ANNONCE PASSE AVANT LA CARTE, PAS APRÈS.
        *
        * Quelqu'un doit savoir combien et quand AVANT de saisir son numéro.
        * Placée après, l'information existe mais arrive trop tard pour servir
        * à décider — et c'est précisément ce que la loi exige d'éviter.
        */}
      {o && (
        <div className="rounded-2xl border p-5 mb-6" style={{ borderColor: "rgba(255,106,31,0.3)", background: "rgba(255,106,31,0.05)" }}>
          <p className="font-bold text-white mb-3">Ce qui va se passer</p>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-start gap-2.5 text-white/75">
              <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: AMBRE }} />
              <span>Aujourd&apos;hui : <span className="font-semibold text-white">0 €</span>. Ta carte est enregistrée, rien n&apos;est débité.</span>
            </li>
            <li className="flex items-start gap-2.5 text-white/75">
              <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: AMBRE }} />
              <span>
                Le <span className="font-semibold text-white">{jour(o.preleveAt)}</span> :{" "}
                <span className="font-semibold text-white">{euros(o.montantCents)}</span>, une seule fois.
                Pas d&apos;abonnement, rien à résilier.
              </span>
            </li>
            <li className="flex items-start gap-2.5 text-white/75">
              <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: AMBRE }} />
              <span>Tu arrêtes quand tu veux avant cette date : rien ne sera prélevé.</span>
            </li>
          </ul>
          <p className="text-xs text-white/35 mt-4">
            On te préviendra par e-mail 3 jours avant, puis la veille.
          </p>
        </div>
      )}

      {!o ? (
        <div className="p-6 rounded-2xl bg-[#0F0F12] border border-white/10">
          <label htmlFor="email" className="text-xs font-mono text-white/40 uppercase block mb-2">
            Ton e-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") void ouvrir(); }}
            placeholder="toi@exemple.fr"
            className="w-full h-11 px-3 bg-white/5 rounded-xl border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-orange-500/50 transition-all"
          />
          {erreur && (
            <p className="mt-3 text-sm text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{erreur}
            </p>
          )}
          <button
            onClick={() => void ouvrir()}
            disabled={chargement}
            className="w-full mt-5 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ background: AMBRE, color: "#0a0a0a" }}
          >
            {chargement ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continuer"}
          </button>
          <p className="text-xs text-white/35 mt-4 text-center leading-relaxed">
            Une carte est demandée pour ouvrir l&apos;essai. Rien n&apos;est prélevé aujourd&apos;hui.
          </p>
        </div>
      ) : (
        <Elements stripe={stripePromise} options={{ clientSecret: o.clientSecret, appearance: apparence }}>
          <FormulaireCarte o={o} />
        </Elements>
      )}

      <p className="text-center text-xs text-white/30 mt-6">
        En continuant, tu acceptes nos{" "}
        <Link href="/cgv" target="_blank" className="underline hover:text-white/50">conditions de vente</Link>.
      </p>
    </div>
  );
}

export default function PageEssai() {
  return (
    <div className="w-full min-h-screen text-white relative" style={{ background: "#07060f" }}>
      <Navbar />
      <main className="container-main py-20 md:py-28 relative z-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Suspense fallback={<p className="text-center text-white/40">Chargement…</p>}>
            <Contenu />
          </Suspense>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
