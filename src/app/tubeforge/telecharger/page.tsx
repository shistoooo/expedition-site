"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Download, Loader2, LogOut, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  clearToken, download, fetchMe, getToken, loginUrl, readTokenFromHash, resolve, warmSession,
  type Me, type Progress, type Resolved,
} from "@/lib/webdl";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PLATFORMS = [
  { key: "youtube", label: "YouTube" },
  { key: "tiktok", label: "TikTok" },
  { key: "twitter", label: "X" },
  { key: "twitch", label: "Twitch" },
];

function DiscordMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 18" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.3 1.5A19.8 19.8 0 0 0 15.4 0l-.3.5c1.6.4 3 1 4.4 1.9a16.9 16.9 0 0 0-14.9 0A17 17 0 0 1 9 .5L8.7 0A19.8 19.8 0 0 0 3.7 1.5C.6 6.1-.2 10.6.2 15a19.9 19.9 0 0 0 6 3l1.2-1.9c-.7-.3-1.3-.6-1.9-1l.5-.4a14.2 14.2 0 0 0 12.2 0l.5.4c-.6.4-1.2.7-1.9 1L18 18a19.9 19.9 0 0 0 6-3c.5-5.1-.8-9.6-3.7-13.5ZM8 12.3c-1.2 0-2.1-1.1-2.1-2.4S6.8 7.5 8 7.5s2.2 1.1 2.2 2.4S9.2 12.3 8 12.3Zm8 0c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z" />
    </svg>
  );
}

function fmtDuration(s: number | null) {
  if (!s) return null;
  const m = Math.floor(s / 60);
  const sec = String(s % 60).padStart(2, "0");
  return m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}` : `${m}:${sec}`;
}

export default function TelechargerPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Resolved | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [done, setDone] = useState(false);
  // L'URL de connexion depend de window.location : la calculer au rendu
  // provoquerait un ecart entre le HTML du serveur et celui du client.
  const [authHref, setAuthHref] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const refreshMe = useCallback(async () => {
    try {
      setMe(await fetchMe());
    } catch {
      setMe({ auth: false });
    }
  }, []);

  useEffect(() => {
    setAuthHref(loginUrl());
    readTokenFromHash();
    refreshMe();
    // On prechauffe la session YouTube (quelques Ko) pendant que la personne
    // colle son lien. Le calcul BotGuard, lui, n'a plus lieu ici : il ne sert
    // qu'en secours si YouTube nous refuse (cf. lib/potoken.ts).
    warmSession();
  }, [refreshMe]);

  const onResolve = async () => {
    setError(null); setResult(null); setDone(false); setProgress(null);
    if (!url.trim()) return;
    setBusy(true);
    try {
      const r = await resolve(url.trim());
      if (!r.ok) {
        setError(r.err);
        if ("needAuth" in r && r.needAuth) clearToken();
        await refreshMe();
      } else {
        setResult(r);
        setMe((m) => (m ? { ...m, quota: r.quota } : m));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
    } finally {
      setBusy(false);
    }
  };

  const onDownload = async () => {
    if (!result) return;
    setError(null); setDone(false);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setProgress({ phase: "download", pct: 0, label: "Démarrage" });
    try {
      await download(result, setProgress, ctrl.signal);
      setDone(true);
    } catch (e) {
      if (!ctrl.signal.aborted) setError(e instanceof Error ? e.message : "Le téléchargement a échoué.");
    } finally {
      setProgress(null);
      abortRef.current = null;
    }
  };

  const connected = !!me?.auth && !!getToken();
  const member = connected && me?.member;
  // Le Worker decide seul s'il exige Discord ou non (constante REQUIRE_DISCORD).
  // La page suit : elle n'a pas sa propre notion de la porte, sinon les deux
  // finiraient par diverger. Tant que /api/me n'a pas repondu, on n'affiche rien.
  const gated = me?.gate === true;
  const toolOpen = me !== null && (gated ? member : true);
  const left = me?.quota ? Math.max(0, me.quota.limit - me.quota.used) : null;
  const remaining =
    left === null ? "" : `${left} téléchargement${left === 1 ? "" : "s"} restant${left === 1 ? "" : "s"} aujourd’hui`;

  return (
    <div className="w-full min-h-screen overflow-x-hidden relative text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[2]" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: "#07060f" }} />
        <div
          className="absolute -top-48 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] rounded-full blur-[170px]"
          style={{ background: "radial-gradient(ellipse at center, rgba(255,106,31,0.12), rgba(239,68,68,0.05) 42%, transparent 72%)" }}
        />
        <div
          className="absolute top-[55%] right-[-14%] w-[520px] h-[520px] rounded-full blur-[180px]"
          style={{ background: "radial-gradient(circle at center, rgba(139,61,255,0.06), transparent 68%)" }}
        />
      </div>

      <Navbar />

      <main className="w-full relative z-10">
        <section className="pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="container-main max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
              className="text-center"
            >
              <p className="text-xs font-mono uppercase tracking-widest mb-5" style={{ color: "rgba(255,106,31,0.7)" }}>
                Gratuit, sans compte
              </p>
              <h1 className="text-4xl md:text-6xl font-black tracking-[-0.03em] mb-5">
                Télécharge une vidéo<span style={{ color: "#ff6a1f" }}>.</span>
              </h1>
              <p className="text-lg text-white/60 leading-relaxed max-w-xl mx-auto">
                Colle un lien, récupère le fichier. Rien ne passe par nos serveurs : ton navigateur
                télécharge en direct, à pleine vitesse.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-7">
                {PLATFORMS.map((p) => (
                  <span key={p.key} className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/55">
                    {p.label}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* ── Porte Discord ─────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: easeOutExpo }}
              className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
            >
              {gated && !connected && (
                <div className="text-center">
                  <p className="text-white/70 mb-1">Le téléchargeur est réservé aux membres du Discord.</p>
                  <p className="text-sm text-white/40 mb-6">C&apos;est gratuit, et ça prend dix secondes.</p>
                  <a
                    href={authHref}
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-white transition-transform duration-200 hover:translate-y-[-1px]"
                    style={{ background: "#5865F2" }}
                  >
                    <DiscordMark className="w-5 h-4" />
                    Se connecter avec Discord
                  </a>
                </div>
              )}

              {gated && connected && !member && (
                <div className="text-center">
                  <p className="text-white/80 mb-1">
                    Salut {me?.user?.name} — tu n&apos;es pas encore sur le serveur.
                  </p>
                  <p className="text-sm text-white/40 mb-6">Rejoins-le, puis reviens vérifier.</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={me?.invite || "https://discord.com/invite/QuV3bYDEYT"}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-white"
                      style={{ background: "#5865F2" }}
                    >
                      <DiscordMark className="w-5 h-4" />
                      Rejoindre le Discord
                    </a>
                    <a
                      href={authHref}
                      className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/80 font-semibold hover:bg-white/10 transition-colors"
                    >
                      J&apos;ai rejoint, vérifier
                    </a>
                  </div>
                </div>
              )}

              {toolOpen && (
                <>
                  {/* Bandeau d'identite : n'a de sens que si la porte Discord est
                      active. Ouverte, on garde juste le compteur du jour. */}
                  {gated ? (
                    <div className="flex items-center justify-between gap-4 mb-5 pb-5 border-b border-white/10">
                      <div className="flex items-center gap-3 min-w-0">
                        {me?.user?.avatar && (
                          // eslint-disable-next-line @next/next/no-img-element -- avatar Discord, domaine externe non liste dans next/image
                          <img src={me.user.avatar} alt="" className="w-8 h-8 rounded-full" />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{me?.user?.name}</p>
                          <p className="text-[11px] font-mono text-white/40">{remaining}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { clearToken(); setMe({ auth: false }); setResult(null); }}
                        className="text-white/30 hover:text-white/60 transition-colors shrink-0"
                        aria-label="Se déconnecter"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    remaining && (
                      <p className="text-[11px] font-mono text-white/35 mb-4">{remaining}</p>
                    )
                  )}

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !busy && onResolve()}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="flex-1 min-w-0 px-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/25 font-mono text-sm focus:outline-none focus:border-[rgba(255,106,31,0.5)] transition-colors"
                    />
                    <button
                      onClick={onResolve}
                      disabled={busy || !url.trim()}
                      className="px-7 py-3.5 rounded-xl font-bold text-black disabled:opacity-40 disabled:cursor-not-allowed transition-transform duration-200 enabled:hover:translate-y-[-1px] inline-flex items-center justify-center gap-2"
                      style={{ background: "linear-gradient(118deg, #ff6a1f 0%, #ef3a24 58%, #8b3dff 155%)" }}
                    >
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      {busy ? "Analyse" : "Récupérer"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-500/25 bg-red-500/[0.07] px-5 py-4 text-sm text-red-200/90 leading-relaxed">
                {error}
              </div>
            )}

            {/* ── Resultat ──────────────────────────────────────────── */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: easeOutExpo }}
                className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
              >
                <div className="flex gap-4 p-5">
                  {result.meta.thumb && (
                    // eslint-disable-next-line @next/next/no-img-element -- miniatures multi-domaines (ytimg, tiktokcdn, twimg)
                    <img
                      src={result.meta.thumb}
                      alt=""
                      className="w-32 h-20 object-cover rounded-lg shrink-0 bg-black/40"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug line-clamp-2">{result.meta.title}</p>
                    <p className="text-xs text-white/40 mt-1.5 font-mono">
                      {[
                        result.meta.author,
                        fmtDuration(result.meta.durationSec),
                        result.video ? `${result.video.height}p` : result.file?.label,
                        result.video
                          ? `${(((result.video.size ?? 0) + (result.audio?.size ?? 0)) / 1048576).toFixed(0)} Mo`
                          : result.file?.size
                            ? `${(result.file.size / 1048576).toFixed(0)} Mo`
                            : null,
                      ].filter(Boolean).join("  ·  ")}
                    </p>
                    {result.downgraded && (
                      <p className="text-[11px] text-white/35 mt-2 leading-relaxed">
                        {result.downgradeReason === "plafond-youtube"
                          ? `Qualité réduite : YouTube limite en ce moment ce qu'il nous laisse récupérer${result.bestHeight ? ` (le ${result.bestHeight}p existe)` : ""}. Réessaie dans quelques minutes.`
                          : "Qualité réduite volontairement : en pleine résolution, cette vidéo dépasserait ce qu'un navigateur peut assembler en mémoire."}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5">
                  {progress ? (
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-2">
                        <span>
                          {progress.phase === "download" ? "Téléchargement" : progress.phase === "merge" ? "Assemblage image + son" : "Enregistrement"}
                          {" — "}{progress.label}
                        </span>
                        <button
                          onClick={() => abortRef.current?.abort()}
                          className="inline-flex items-center gap-1 text-white/40 hover:text-white/70 transition-colors"
                        >
                          <X className="w-3 h-3" /> annuler
                        </button>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-[width] duration-300"
                          style={{ width: `${progress.pct}%`, background: "linear-gradient(90deg, #ff6a1f, #ef3a24)" }}
                        />
                      </div>
                    </div>
                  ) : done ? (
                    <p className="inline-flex items-center gap-2 text-sm text-green-300/90">
                      <Check className="w-4 h-4" /> Fichier enregistré dans tes téléchargements.
                    </p>
                  ) : (
                    <button
                      onClick={onDownload}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-bold transition-transform duration-200 hover:translate-y-[-1px]"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger {result.video ? `en ${result.video.height}p` : ""}
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── Vers TubeForge ────────────────────────────────────── */}
            <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-7">
              <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-3">
                Les limites de cette page
              </p>
              <p className="text-white/65 leading-relaxed">
                Ici : 4 plateformes, 1080p, 10 vidéos par jour, et le fichier atterrit dans ton dossier
                Téléchargements. <span className="text-white">TubeForge fait la même chose depuis plus de 1500 sites,
                en 4K, sans limite, et dépose l&apos;extrait directement dans ton chutier Premiere ou DaVinci.</span>
              </p>
              <Link
                href="/tubeforge"
                className="group inline-flex items-center gap-2 mt-5 text-sm font-bold"
                style={{ color: "#ff6a1f" }}
              >
                Voir TubeForge
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
