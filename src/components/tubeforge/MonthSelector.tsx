"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, ArrowRight, Loader2 } from "lucide-react";

/* ── Prix TubeForge one-time (MIROIR du backend — routes/auth.ts du worker).
      Le montant FACTURÉ est toujours recalculé côté serveur ; ici c'est
      uniquement de l'affichage. ─────────────────────────────────────────── */
export const RECHARGE_CENTS = 1499;
export const LIFETIME_CENTS = 8999;
// L'offre vie119 est neutralisée (même prix que le public) — miroir du worker.
export const LIFETIME_PROMO_CENTS = 8999;

export function volumeDiscountPct(months: number): number {
  const m = Math.min(12, Math.max(1, Math.floor(months) || 1));
  if (m >= 12) return 30;
  if (m >= 6) return 20;
  if (m >= 3) return 10;
  if (m >= 2) return 5;
  return 0;
}
export function bulkTotalCents(months: number): number {
  const m = Math.min(12, Math.max(1, Math.floor(months) || 1));
  return Math.round(m * RECHARGE_CENTS * (1 - volumeDiscountPct(m) / 100));
}
export function eur(cents: number): string {
  return (cents / 100).toLocaleString("fr-FR", { minimumFractionDigits: cents % 100 === 0 ? 0 : 2, maximumFractionDigits: 2 }) + "€";
}
export function giftKeysForMonths(months: number): number {
  const m = Math.min(12, Math.max(1, Math.floor(months) || 1));
  if (m >= 12) return 4;
  if (m >= 8) return 3;
  if (m >= 6) return 2;
  if (m >= 3) return 1;
  return 0;
}

/* ── Abonnement (flow C — MIROIR de services/tfsub.ts du worker).
      Mensuel 4,99€/mois · annuel 3,49€/mois (41,88€/an = −30%).
      Facturé d'un coup par période, essai 14 jours, pas de promo 1er mois. */
export const SUB_TRIAL_DAYS = 14;
export function subPerMonthCents(months: number): number {
  const m = Math.min(12, Math.max(1, Math.floor(months) || 1));
  // Dégressif CONTINU 4,99€ → 3,49€ (MIROIR du worker tfsub.ts) : le total de
  // période est strictement croissant, chaque mois ajouté reste payant.
  return Math.round(499 - (150 * (m - 1)) / 11);
}
export function subPeriodTotalCents(months: number): number {
  const m = Math.min(12, Math.max(1, Math.floor(months) || 1));
  return m * subPerMonthCents(m);
}
export function subDiscountPct(months: number): number {
  return Math.round((1 - subPerMonthCents(months) / 499) * 100);
}

const AMBER = "#ff6a1f";

/* ── Sélecteur de mois interactif (paliers de recharge) — partagé entre la
      landing /tubeforge (section prix) et la page de paiement. ───────────── */
export default function MonthSelector({ months, setMonths, onContinue, loading, mode = "recharge" }: { months: number; setMonths: (m: number) => void; onContinue: () => void; loading: boolean; mode?: "recharge" | "sub" }) {
  const isSub = mode === "sub";
  const pct = isSub ? subDiscountPct(months) : volumeDiscountPct(months);
  const total = isSub ? subPeriodTotalCents(months) : bulkTotalCents(months);
  const base = months * (isSub ? 499 : RECHARGE_CENTS);
  const saved = base - total;
  const perMonth = isSub ? subPerMonthCents(months) : Math.round(total / months);
  const presets = [1, 3, 6, 12];

  // La rangée de 12 cases reste cliquable ET devient GLISSABLE : on calcule le
  // mois depuis la position du pointeur (chaque case = 1/12 de la largeur).
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const monthFromX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return months;
    const r = el.getBoundingClientRect();
    const ratio = Math.min(0.9999, Math.max(0, (clientX - r.left) / r.width));
    return Math.min(12, Math.max(1, Math.floor(ratio * 12) + 1));
  };
  const onDown = (e: React.PointerEvent) => { setDragging(true); e.currentTarget.setPointerCapture?.(e.pointerId); setMonths(monthFromX(e.clientX)); };
  const onMove = (e: React.PointerEvent) => { if (dragging) setMonths(monthFromX(e.clientX)); };
  const onUp = () => setDragging(false);

  return (
    <div className="p-6 rounded-2xl bg-[#0F0F12] border border-white/10">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold text-white">Combien de mois d&apos;un coup ?</h3>
        <AnimatePresence mode="wait">
          {pct > 0 && (
            <motion.span
              key={pct}
              initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
              className="px-2.5 py-1 rounded-full text-xs font-black"
              style={{ background: "linear-gradient(135deg,#ff6a1f,#ef3a24)", color: "#fff" }}
            >
              −{pct}%
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <p className="text-sm text-white/45 mb-5 text-left">
        {isSub
          ? <>Clique un pack ou <span className="text-white/70">glisse la barre</span> : plus tu t&apos;engages, plus le mois est léger. 14 jours gratuits, annulable à tout moment.</>
          : <>Clique un pack ou <span className="text-white/70">glisse la barre</span> : plus tu montes, plus la remise se débloque. Aucun renouvellement automatique.</>}
      </p>

      {/* presets */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {presets.map((p) => {
          const on = months === p;
          const d = isSub ? subDiscountPct(p) : volumeDiscountPct(p);
          return (
            <button
              key={p}
              type="button"
              onClick={() => setMonths(p)}
              className="relative py-2.5 rounded-lg text-sm font-bold border transition-all hover:brightness-125"
              style={on
                ? { background: "rgba(255,106,31,0.15)", borderColor: "rgba(255,106,31,0.5)", color: "#fff" }
                : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
            >
              {p} mois
              {d > 0 && <span className="block text-[10px] font-mono mt-0.5" style={{ color: on ? AMBER : "rgba(255,255,255,0.35)" }}>−{d}%</span>}
            </button>
          );
        })}
      </div>

      {/* batterie GLISSABLE (clic + drag) — la poignée « grip » signale le glisser */}
      <div
        ref={trackRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="relative flex gap-[3px] touch-none cursor-ew-resize select-none py-1 mb-5"
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const filled = i < months;
          return (
            <div
              key={i}
              className="flex-1 h-7 rounded-md pointer-events-none transition-all"
              style={{ background: filled ? "linear-gradient(180deg,#ff6a1f,#ef3a24)" : "rgba(255,255,255,0.05)" }}
            />
          );
        })}
        <motion.div
          className="absolute top-1/2 w-5 h-9 rounded-lg bg-white flex items-center justify-center gap-[3px] pointer-events-none"
          style={{ left: `${(months / 12) * 100}%`, x: "-50%", y: "-50%", boxShadow: "0 0 0 3px rgba(255,106,31,0.28)" }}
          animate={{ scale: dragging ? 1.14 : 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 26 }}
        >
          <span className="w-[2px] h-4 rounded-full" style={{ background: "rgba(239,58,36,0.55)" }} />
          <span className="w-[2px] h-4 rounded-full" style={{ background: "rgba(239,58,36,0.55)" }} />
        </motion.div>
      </div>

      {/* total live — le nombre « roule » quand la valeur change.
          Mode abonnement : le HÉROS c'est le prix par mois (4,99€ à 12 mois),
          le détail de facturation par période est en dessous, jamais caché. */}
      <div className="flex items-end justify-between rounded-xl bg-white/[0.03] border border-white/10 p-4 mb-5 overflow-hidden">
        <div className="text-left">
          <p className="text-[11px] text-white/40 mb-0.5">
            {isSub
              ? `${months === 1 ? "Mensuel, sans engagement" : `Engagement ${months} mois`} · 14 jours gratuits`
              : `${months} mois · ${months * 30} jours d'accès illimité`}
          </p>
          {/* Le HÉROS = le montant réellement prélevé (pas un « /mois » d'appel).
              Le prix, c'est le prix : pas de barré, pas d'habillage promo. */}
          <div className="flex items-baseline gap-2 h-9">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={total} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.22 }} className="text-3xl font-black text-white tabular-nums inline-block">
                {eur(total)}
              </motion.span>
            </AnimatePresence>
            {!isSub && pct > 0 && <span className="text-sm text-white/30 line-through">{eur(base)}</span>}
          </div>
          {isSub ? (
            <p className="text-xs text-white/40 mt-0.5">
              {months === 1
                ? <>prélevé chaque mois après l&apos;essai, annulable quand tu veux</>
                : <>prélevé tous les {months} mois après l&apos;essai, soit <span className="text-white/60 font-semibold">{eur(perMonth)}/mois</span></>}
            </p>
          ) : (
            saved > 0 && <p className="text-xs text-white/45 mt-0.5">tu économises {eur(saved)}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          {isSub ? (
            <>
              <p className="text-lg font-black tabular-nums text-white">0€</p>
              <p className="text-[10px] text-white/35">aujourd&apos;hui</p>
            </>
          ) : (
            <>
              <p className="text-lg font-black tabular-nums" style={{ color: AMBER }}>{eur(perMonth)}</p>
              <p className="text-[10px] text-white/35">par mois</p>
            </>
          )}
        </div>
      </div>

      {/* Incitation clés cadeau (goal-gradient : une raison de plus de monter) */}
      <AnimatePresence>
        {giftKeysForMonths(months) > 0 && (
          <motion.div
            key={giftKeysForMonths(months)}
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2.5 mb-4 -mt-1 p-3 rounded-xl"
            style={{ background: "rgba(255,106,31,0.07)", border: "1px solid rgba(255,106,31,0.2)" }}
          >
            <Gift className="w-4 h-4 shrink-0" style={{ color: AMBER }} />
            <p className="text-xs text-white/70 text-left">
              <span className="font-bold" style={{ color: AMBER }}>+{giftKeysForMonths(months)} clé{giftKeysForMonths(months) > 1 ? "s" : ""} cadeau</span> à offrir, 1 mois de TubeForge chacune.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={onContinue}
        disabled={loading}
        className="w-full py-4 rounded-xl font-bold text-base transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
        style={{ background: "linear-gradient(135deg,#ff6a1f 0%,#ef3a24 100%)", color: "#fff" }}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isSub ? <>Commencer · 14 jours gratuits <ArrowRight className="w-4 h-4" /></> : <>Continuer · payer {eur(total)} <ArrowRight className="w-4 h-4" /></>}
      </button>
    </div>
  );
}
