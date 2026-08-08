"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Star, Rocket, ArrowRight } from "lucide-react";
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
            className="w-full py-4 rounded-xl font-bold text-base transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2"
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
// · à vie 39,99€ (2026-08-08). Essai 14 jours avec carte sur les abos.
const PLAN_MONTHLY_CENTS = 499;
const PLAN_YEARLY_CENTS = 4188;
const PLAN_YEARLY_PER_MONTH = 349;
const PLAN_LIFETIME_CENTS = 3999;

// 3 cartes : mois à gauche, ANNÉE au centre (le héros), à vie à droite.
/**
 * UNE SEULE OFFRE — l'achat unique.
 *
 * Les cartes « Mensuel » et « Annuel » ont été retirées le 2026-08-08 : le
 * worker refuse désormais toute NOUVELLE souscription (410, voir
 * `ABONNEMENT_OUVERT` dans licensing/src/config-offre.ts). Les 23 abonnements
 * vivants continuent normalement, ils ne passent pas par cette page.
 *
 * On les SUPPRIME au lieu de les masquer : ce fichier porte déjà la trace d'un
 * bloc rendu par aucun mode, donc jamais relu, qui affichait 49,99 € pendant
 * que le paiement facturait 89,99 €. Du code invisible ne reste pas juste.
 * Pour rouvrir l'abonnement un jour : `git log` sur ce fichier.
 */
function OffreUniqueCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
      className="flex flex-col rounded-2xl p-7 md:p-9 border max-w-md mx-auto w-full"
      style={{ borderColor: "rgba(255,106,31,0.28)", background: "rgba(255,106,31,0.04)" }}
    >
      <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: "rgba(255,106,31,0.75)" }}>
        Achat unique
      </p>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-black text-5xl text-white">{eurStatic(PLAN_LIFETIME_CENTS)}</span>
      </div>
      <p className="text-sm text-white/45 mb-6">Tu le gardes, même le jour où le prix montera.</p>
      <ul className="space-y-3 mb-8 flex-1">
        {[
          "Toutes les fonctions, sans limite de téléchargements",
          "Aussi longtemps que TubeForge existe",
          "Toutes les mises à jour comprises",
          "Mac et Windows",
        ].map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
            <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: AMBER }} />
            {f}
          </li>
        ))}
      </ul>
      <Link
        data-track="pricing-vie"
        href="/tubeforge/checkout?plan=lifetime"
        className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
        style={{ background: AMBER, color: "#0a0a0a" }}
      >
        Obtenir TubeForge
      </Link>
      <p className="text-xs text-white/35 mt-4 text-center">
        Paiement sécurisé par Stripe
      </p>
    </motion.div>
  );
}

function eurStatic(cents: number): string {
  return (cents / 100).toLocaleString("fr-FR", { minimumFractionDigits: cents % 100 === 0 ? 0 : 2, maximumFractionDigits: 2 }) + "€";
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
            {PRICING_MODE === "recharge_lifetime" ? "39,99 €, une seule fois" : "Choisis ta formule"}
          </h2>
          {/**
           * ⛔ CE BLOC DISAIT QUATRE FOIS LA MÊME CHOSE.
           *
           * Titre « une seule fois », sous-titre « pas de renouvellement, pas de
           * compteur », pastille « pas de renouvellement, pas de compteur, rien à
           * annuler », carte « Une seule fois. Plus jamais de facture. » — deux
           * répétitions MOT POUR MOT à trois lignes d'écart.
           *
           * Écrit d'un seul jet en basculant sur l'achat unique : chaque surface a
           * reformulé l'argument au lieu d'en porter un autre. C'est la signature
           * la plus reconnaissable d'un texte généré, et un lecteur la sent avant
           * de savoir la nommer.
           *
           * Règle tenue ici : le titre annonce le prix, le sous-titre défend le
           * choix, la carte détaille. La pastille est SUPPRIMÉE — elle ne portait
           * rien que les deux autres ne disaient déjà.
           */}
          <p className="text-base text-white/50 max-w-xl mx-auto leading-relaxed">
            {PRICING_MODE === "both"
              ? "Abonnement classique, ou paiement unique : recharge à la demande ou accès à vie."
              : PRICING_MODE === "recharge_lifetime"
                ? "Un outil que tu ouvres à chaque montage ne devrait pas t'envoyer une facture tous les mois."
                : "Abonnement mensuel ou annuel, sans engagement."}
          </p>
        </motion.div>

        {PRICING_MODE === "classic" && <ClassicCard />}
        {PRICING_MODE === "recharge_lifetime" && <OffreUniqueCard />}
        {/* Le mode « both » affichait `RechargeLifetimeCards`, deux cartes dont
            une RECHARGE — retirée du produit le 02/08/2026 — et un accès à vie
            affiché à 49,99 € alors que le paiement en facture 89,99 €.
            Ce bloc n'était rendu par aucun mode actif, donc invisible, donc
            jamais corrigé : basculer `PRICING_MODE` sur « both » aurait remis
            en vente une offre supprimée, à un prix faux. Supprimé. */}
        {PRICING_MODE === "both" && <ClassicCard />}
      </div>
    </section>
  );
}
