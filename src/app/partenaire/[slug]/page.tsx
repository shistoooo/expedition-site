"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy, Check, AlertCircle, Loader2, Gift, Share2,
  Sparkles, ChevronRight, Clock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || "https://api.clipapp.uk";

interface PartnerCode {
  keyCode: string;
  durationDays: number;
  redeemed: boolean;
  redeemedByEmail: string | null;
  redeemedAt: string | null;
  createdAt: string;
}

interface PartnerData {
  name: string;
  slug: string;
  avatarUrl: string | null;
  total: number;
  truncated: boolean;
  codes: PartnerCode[];
}

function getInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  return trimmed[0]!.toUpperCase();
}

function formatDateShort(iso: string | null): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  } catch {
    return "";
  }
}

export default function PartenairePage() {
  const params = useParams();
  const slug = (params.slug as string) || "";

  const [status, setStatus] = useState<"loading" | "found" | "not-found">("loading");
  const [data, setData] = useState<PartnerData | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showUsed, setShowUsed] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    if (!slug) {
      setStatus("not-found");
      return;
    }
    fetch(`${WORKER_URL}/partners/${encodeURIComponent(slug)}`)
      .then(async (res) => {
        if (!res.ok) {
          setStatus("not-found");
          return;
        }
        const json = (await res.json()) as PartnerData;
        setData(json);
        setStatus("found");
      })
      .catch(() => setStatus("not-found"));
  }, [slug]);

  const { available, used } = useMemo(() => {
    const a: PartnerCode[] = [];
    const u: PartnerCode[] = [];
    for (const c of data?.codes ?? []) {
      if (c.redeemed) u.push(c);
      else a.push(c);
    }
    return { available: a, used: u };
  }, [data]);

  const copyLink = async (code: string) => {
    await navigator.clipboard.writeText(`https://expeditionlauncher.store/try/${code}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const shareLink = async (code: string, partnerName: string, durationDays: number) => {
    const url = `https://expeditionlauncher.store/try/${code}`;
    if (!navigator.share) {
      copyLink(code);
      return;
    }
    try {
      await navigator.share({
        title: `Invitation de ${partnerName}`,
        text: `${durationDays} jours d'accès gratuit à Expedition 👇`,
        url,
      });
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="min-h-screen bg-[#06051a] text-white selection:bg-purple-500/30 overflow-x-hidden relative">
      <PageBackground />
      <Navbar />

      <main className="pt-32 pb-24 container-main relative z-10">
        <div className="max-w-3xl mx-auto">
          {status === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4 py-24"
            >
              <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              <p className="text-white/50 text-sm">Chargement...</p>
            </motion.div>
          )}

          {status === "not-found" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center gap-4 py-24"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold">Page introuvable</h1>
              <p className="text-white/50 max-w-md">
                Ce lien n&apos;est plus valide. Demande-en un nouveau à la personne qui te l&apos;a envoyé.
              </p>
            </motion.div>
          )}

          {status === "found" && data && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              {/* Header — personal welcome */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-gradient-to-br from-purple-500/[0.08] via-[#0F0F12] to-[#0F0F12] border border-purple-500/20"
              >
                {/* Glow decoration */}
                <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

                <div className="relative flex items-center gap-4 md:gap-5">
                  {/* Avatar */}
                  <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/40 border border-purple-300/20">
                    {data.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={data.avatarUrl}
                        alt={data.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl md:text-2xl font-bold text-white">
                        {getInitial(data.name)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-400/70 uppercase tracking-[0.15em] mb-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Page partenaire</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold leading-tight truncate">
                      Salut, {data.name} 👋
                    </h1>
                    <p className="text-white/50 text-sm md:text-base mt-1">
                      {available.length > 0 ? (
                        <>
                          Voici tes <span className="text-white font-semibold">{available.length} invitation{available.length > 1 ? "s" : ""}</span> à offrir à tes amis, collègues ou contacts.
                        </>
                      ) : (
                        "Toutes tes invitations ont été distribuées."
                      )}
                    </p>
                  </div>
                </div>

                {/* Mini stats row */}
                <div className="relative mt-5 flex items-center gap-1.5 text-xs text-white/40 flex-wrap">
                  <span className="text-green-400/80 font-medium">{available.length} à offrir</span>
                  <span className="text-white/20">·</span>
                  <span>{used.length} déjà donné{used.length > 1 ? "e" : ""}{used.length > 1 ? "s" : ""}</span>
                  <span className="text-white/20">·</span>
                  <span>{data.total} au total</span>
                </div>
              </motion.div>

              {/* Available invitations */}
              {available.length > 0 ? (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-mono text-white/40 uppercase tracking-wider">
                      Invitations à offrir ({available.length})
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {available.map((c, idx) => (
                      <motion.div
                        key={c.keyCode}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                        whileHover={{ y: -2 }}
                        className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-purple-500/15 via-purple-600/5 to-transparent border border-purple-400/25 hover:border-purple-400/40 transition-all"
                      >
                        {/* Subtle glow */}
                        <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-purple-500/20 blur-3xl group-hover:bg-purple-500/30 transition-all pointer-events-none" />

                        <div className="relative z-10 space-y-4">
                          {/* Top row */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-300/70 uppercase tracking-[0.15em]">
                              <Gift className="w-3 h-3" />
                              <span>Invitation</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10 font-mono">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{c.durationDays}j</span>
                            </div>
                          </div>

                          {/* Code */}
                          <div className="text-center py-2">
                            <code className="block text-lg md:text-xl font-mono font-bold text-white tracking-wider">
                              {c.keyCode}
                            </code>
                            <p className="text-[11px] text-white/40 mt-1.5">
                              {c.durationDays} jours d&apos;accès gratuit
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => copyLink(c.keyCode)}
                              className="flex-1 h-10 px-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
                            >
                              {copiedCode === c.keyCode ? (
                                <><Check className="w-4 h-4" /> Copié</>
                              ) : (
                                <><Copy className="w-4 h-4" /> Copier le lien</>
                              )}
                            </button>
                            {canShare && (
                              <button
                                onClick={() => shareLink(c.keyCode, data.name, c.durationDays)}
                                className="shrink-0 h-10 w-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white/60 hover:text-white transition-all flex items-center justify-center"
                                aria-label="Partager"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              ) : (
                <section className="p-10 rounded-2xl bg-[#0F0F12] border border-purple-500/15 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-6 h-6 text-white/30" />
                  </div>
                  <p className="text-white/50 text-sm">
                    Toutes tes invitations ont été distribuées.<br />
                    Contacte l&apos;admin si tu en veux plus.
                  </p>
                </section>
              )}

              {/* Already used — collapsible */}
              {used.length > 0 && (
                <section>
                  <button
                    onClick={() => setShowUsed((s) => !s)}
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group"
                  >
                    <ChevronRight className={`w-4 h-4 transition-transform ${showUsed ? "rotate-90" : ""}`} />
                    <span>Déjà distribuées ({used.length})</span>
                  </button>

                  <AnimatePresence>
                    {showUsed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 space-y-1.5">
                          {used.map((c) => (
                            <div
                              key={c.keyCode}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs"
                            >
                              <code className="font-mono text-white/30 shrink-0 hidden sm:inline">{c.keyCode}</code>
                              <span className="text-white/60 flex-1 truncate" title={c.redeemedByEmail ?? ""}>
                                {c.redeemedByEmail ?? "—"}
                              </span>
                              <span className="text-white/30 text-[10px] shrink-0">
                                {formatDateShort(c.redeemedAt)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>
              )}

              {/* How it works */}
              <div className="p-4 md:p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xs md:text-sm text-white/50 space-y-1">
                  <p className="text-white/70 font-medium">Comment ça marche</p>
                  <p>
                    Copie un lien et envoie-le à un ami, un collègue ou un contact. Il clique, crée un compte, et son accès Expedition est activé automatiquement pour la durée de l&apos;invitation.
                  </p>
                </div>
              </div>

              {data.truncated && (
                <p className="text-xs text-amber-400/70 text-center">
                  Plus de 200 codes au total — contacte l&apos;admin pour en voir davantage.
                </p>
              )}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
