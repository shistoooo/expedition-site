"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Download, ArrowRight, KeyRound, Loader2, AlertCircle, Gift, Copy, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import VideoExplicative from "@/components/tubeforge/VideoExplicative";
import { VIDEO_COMPLETE } from "@/lib/videoDemo";

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || "https://api.clipapp.uk";
const AMBER = "#ff6a1f";

// État de la page :
//  loading   → on interroge le paiement (webhook peut être en retard → retry)
//  password  → paiement OK, compte tout neuf → l'acheteur choisit son mot de passe
//  existing  → l'email correspond à un compte existant → il se connecte
//  done      → mot de passe posé + connecté
//  error     → problème (paiement non confirmé, etc.)
type Phase = "loading" | "password" | "existing" | "done" | "error";

function MerciContent() {
  const searchParams = useSearchParams();
  const kind = searchParams.get("kind");
  const isSub = kind === "sub";
  // Flow Payment Element : Stripe renvoie ?payment_intent=pi_... (redirection 3DS)
  // et on le passe aussi manuellement quand il n'y a pas de redirection.
  // Flow abonnement (SetupIntent) : ?setup_intent=seti_...
  const sessionId = isSub ? searchParams.get("setup_intent") : searchParams.get("payment_intent");
  // Endpoint + clé de payload selon le flow — même contrat de réponse côté worker.
  const claimEndpoint = isSub ? "claim-subscription" : "claim-payment";
  const claimBody = (extra?: Record<string, string>) =>
    JSON.stringify(isSub ? { setup_intent: sessionId, ...extra } : { payment_intent: sessionId, ...extra });
  // Le repli disait « ta recharge » — une offre retirée du produit le
  // 02/08/2026. Seul un lien ancien peut encore atterrir ici, et lui nommer un
  // produit qui n'existe plus serait déroutant. « Ton achat » reste vrai dans
  // tous les cas, y compris ceux qu'on n'a pas prévus.
  const kindLabel = kind === "lifetime" ? "ton accès à vie" : isSub ? "ton essai de 14 jours" : "ton achat";

  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [giftKeys, setGiftKeys] = useState<{ code: string; months: number; used: boolean; redeemBy?: number | null }[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const startedRef = useRef(false);

  const copyKey = (code: string) => {
    navigator.clipboard?.writeText(code).then(() => { setCopied(code); setTimeout(() => setCopied((c) => (c === code ? null : c)), 1500); }).catch(() => {});
  };

  // 1. Au chargement : on demande l'état du paiement, avec quelques essais tant
  //    que le webhook n'a pas fini de créer le compte (status "pending").
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (!sessionId) {
      setError("Session de paiement manquante.");
      setPhase("error");
      return;
    }

    let attempts = 0;
    const poll = async () => {
      attempts++;
      try {
        const res = await fetch(`${WORKER_URL}/auth/tubeforge/${claimEndpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: claimBody(),
        });
        const data = await res.json();

        if (res.status === 202 || data.status === "pending") {
          if (attempts < 8) { setTimeout(poll, 1500); return; }
          setError("Le paiement est bien passé, mais l'activation prend un peu de temps. Réessaie dans une minute.");
          setPhase("error");
          return;
        }
        if (!res.ok) throw new Error(data.error || "Impossible de confirmer le paiement.");

        if (Array.isArray(data.giftKeys)) setGiftKeys(data.giftKeys);
        if (data.status === "need_password") setPhase("password");
        else if (data.status === "existing") setPhase("existing");
        else if (data.status === "created") setPhase("done");
        else setPhase("password");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue.");
        setPhase("error");
      }
    };
    poll();
  }, [sessionId]);

  // 2. L'acheteur pose son mot de passe → on le connecte (cookie SSO).
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères."); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${WORKER_URL}/auth/tubeforge/${claimEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: claimBody({ password }),
      });
      const data = await res.json();
      if (!res.ok || data.status !== "created") throw new Error(data.error || "Impossible d'enregistrer le mot de passe.");

      if (Array.isArray(data.giftKeys)) setGiftKeys(data.giftKeys);

      // Pose le cookie de session SSO (best-effort — l'accès est déjà actif même si ça échoue).
      if (data.accessToken) {
        try {
          await fetch("/api/auth/set-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: data.accessToken }),
          });
        } catch { /* non bloquant */ }
      }
      setPhase("done");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  const giftKeysBlock = giftKeys.length > 0 ? (
    <div className="mt-6 text-left rounded-2xl border p-5" style={{ borderColor: "rgba(255,106,31,0.25)", background: "rgba(255,106,31,0.05)" }}>
      <div className="flex items-center gap-2 mb-1" style={{ color: AMBER }}>
        <Gift className="w-4 h-4" />
        <p className="text-sm font-bold">{giftKeys.length} clé{giftKeys.length > 1 ? "s" : ""} cadeau à offrir</p>
      </div>
      <p className="text-xs text-white/50 mb-2">Chaque clé = 1 mois de TubeForge gratuit pour un pote. Il crée un compte et entre le code.</p>
      {giftKeys[0]?.redeemBy ? (
        <p className="text-[11px] mb-3 flex items-center gap-1.5" style={{ color: AMBER }}>
          À offrir avant le <span className="font-bold">{new Date(giftKeys[0].redeemBy).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span> (fin de ta période).
        </p>
      ) : null}
      <div className="space-y-2">
        {giftKeys.map((k) => (
          <button
            key={k.code}
            type="button"
            onClick={() => !k.used && copyKey(k.code)}
            disabled={k.used}
            className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border text-sm font-mono transition ${k.used ? "opacity-40" : "hover:border-white/25"}`}
            style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)" }}
          >
            <span className={`tracking-wider ${k.used ? "line-through" : ""}`}>{k.code}</span>
            {k.used ? (
              <span className="text-[10px] text-white/40">déjà utilisée</span>
            ) : copied === k.code ? (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1"><Check className="w-3.5 h-3.5" />copié</span>
            ) : (
              <span className="text-[11px] text-white/40 flex items-center gap-1"><Copy className="w-3.5 h-3.5" />copier</span>
            )}
          </button>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div className="w-full min-h-screen overflow-x-hidden relative text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[2]" aria-hidden="true">
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <Navbar />

      <main className="w-full relative z-10 pt-28 md:pt-36 pb-20">
        <div className="container-main max-w-md mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: "rgba(255,106,31,0.15)", border: "1px solid rgba(255,106,31,0.4)" }}
          >
            {phase === "error" ? <AlertCircle className="w-8 h-8 text-red-400" /> : <CheckCircle2 className="w-8 h-8" style={{ color: AMBER }} />}
          </motion.div>

          <AnimatePresence mode="wait">
            {phase === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="text-2xl font-black tracking-[-0.02em] mb-3">{isSub ? "Carte enregistrée" : "Paiement confirmé"}</h1>
                <p className="text-white/55 mb-6">On active {kindLabel}…</p>
                <Loader2 className="w-6 h-6 animate-spin text-white/40 mx-auto" />
              </motion.div>
            )}

            {phase === "password" && (
              <motion.div key="password" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h1 className="text-2xl font-black tracking-[-0.02em] mb-2">Merci ! Dernière étape</h1>
                <p className="text-white/55 mb-6 leading-relaxed">
                  {kindLabel.charAt(0).toUpperCase() + kindLabel.slice(1)} {isSub ? "est lancé" : "est active"}. Choisis un mot de passe pour te
                  connecter à TubeForge.
                </p>
                <form onSubmit={handleSetPassword} className="text-left p-6 rounded-2xl bg-[#0F0F12] border border-white/10">
                  <label htmlFor="pw" className="text-xs font-mono text-white/40 uppercase">Mot de passe</label>
                  <div className="relative mt-2 mb-4">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      id="pw"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoFocus
                      placeholder="8 caractères minimum"
                      className="w-full h-11 pl-10 pr-4 bg-white/5 rounded-xl border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.07] transition-all text-sm"
                    />
                  </div>
                  {error && <p className="mb-4 text-red-300 text-sm">{error}</p>}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #ff6a1f 0%, #ef3a24 100%)", color: "#fff" }}
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Activer mon compte"}
                  </button>
                </form>
              </motion.div>
            )}

            {phase === "existing" && (
              <motion.div key="existing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h1 className="text-2xl font-black tracking-[-0.02em] mb-3">C&apos;est bon, {kindLabel} {isSub ? "est lancé" : "est active"}</h1>
                <p className="text-white/55 mb-8 leading-relaxed">
                  Cet email a déjà un compte Expédition — ton achat y est déjà rattaché. Connecte-toi normalement pour
                  en profiter.
                </p>
                <Link
                  href="/account"
                  className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, #ff6a1f 0%, #ef3a24 100%)", color: "#fff" }}
                >
                  Me connecter <ArrowRight className="w-5 h-5" />
                </Link>
                {giftKeysBlock}

                {/**
                  * LA VIDÉO ARRIVE APRÈS LE BOUTON, PAS AVANT.
                  *
                  * La personne vient de payer : ce qu'elle veut, c'est l'app.
                  * Mettre la vidéo entre elle et le téléchargement
                  * transformerait un achat réussi en salle d'attente.
                  *
                  * Juste en dessous, en revanche, c'est le bon moment : le
                  * téléchargement tourne, il y a une minute de temps mort, et
                  * c'est là qu'on découvre ce que l'outil sait faire — plutôt
                  * que de le découvrir seul, six mois plus tard.
                  */}
                <VideoExplicative
                  video={VIDEO_COMPLETE}
                  className="mt-10"
                  titre="Pendant que ça télécharge"
                  sousTitre="La présentation complète, fonction par fonction."
                />
              </motion.div>
            )}

            {phase === "done" && (
              <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h1 className="text-2xl font-black tracking-[-0.02em] mb-3">Tout est prêt.</h1>
                <p className="text-white/55 mb-8 leading-relaxed">
                  Ton compte est activé et {kindLabel} est en cours. Télécharge TubeForge et connecte-toi avec ton
                  email et ton mot de passe.
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/download"
                    className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg, #ff6a1f 0%, #ef3a24 100%)", color: "#fff" }}
                  >
                    <Download className="w-5 h-5" />
                    Télécharger TubeForge
                  </Link>
                  <Link
                    href="/account"
                    className="w-full py-3.5 rounded-xl bg-white/5 text-white/85 font-semibold text-sm border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    Voir mon compte <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                {giftKeysBlock}
              </motion.div>
            )}

            {phase === "error" && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="text-2xl font-black tracking-[-0.02em] mb-3">Un petit souci</h1>
                <p className="text-white/55 mb-8 leading-relaxed">{error}</p>
                <Link
                  href="/account"
                  className="w-full py-3.5 rounded-xl bg-white/5 text-white/85 font-semibold text-sm border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  Aller à mon compte <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function TubeForgeMerciPage() {
  return (
    <Suspense>
      <MerciContent />
    </Suspense>
  );
}
