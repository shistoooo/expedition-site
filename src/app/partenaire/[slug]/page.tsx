"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Copy, Check, AlertCircle, Loader2, Gift, Users2 } from "lucide-react";
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
  total: number;
  truncated: boolean;
  codes: PartnerCode[];
}

export default function PartenairePage() {
  const params = useParams();
  const slug = (params.slug as string) || "";

  const [status, setStatus] = useState<"loading" | "found" | "not-found">("loading");
  const [data, setData] = useState<PartnerData | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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

  const copyLink = (code: string) => {
    navigator.clipboard.writeText(`https://expeditionlauncher.store/try/${code}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const available = data?.codes.filter((c) => !c.redeemed).length ?? 0;
  const total = data?.codes.length ?? 0;

  return (
    <div className="min-h-screen bg-[#06051a] text-white selection:bg-purple-500/30 overflow-x-hidden relative">
      <PageBackground />
      <Navbar />

      <main className="pt-32 pb-24 container-main relative z-10">
        <div className="max-w-4xl mx-auto">
          {status === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4 py-24"
            >
              <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              <p className="text-white/50 text-sm">Chargement de la page partenaire...</p>
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
                Ce partenaire n&apos;existe pas ou n&apos;est plus actif. Vérifie le lien que tu as reçu.
              </p>
            </motion.div>
          )}

          {status === "found" && data && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="p-6 md:p-8 rounded-2xl bg-[#0F0F12] border border-purple-500/15 shadow-2xl shadow-purple-500/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Users2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-white/30 uppercase">Page partenaire</p>
                    <h1 className="text-2xl md:text-3xl font-bold">Codes pour {data.name}</h1>
                  </div>
                </div>
                <p className="text-white/50 text-sm md:text-base max-w-2xl">
                  Partage ces liens à ton équipe pour leur donner un accès gratuit à Expedition. Chaque code ne peut être utilisé qu&apos;une seule fois.
                </p>

                {/* Stats */}
                <div className="flex gap-3 flex-wrap mt-6">
                  <div className="flex items-baseline gap-1.5 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
                    <span className="text-xl font-bold text-green-400">{available}</span>
                    <span className="text-xs text-green-400/70">disponibles</span>
                  </div>
                  <div className="flex items-baseline gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-xl font-bold text-white/60">{total - available}</span>
                    <span className="text-xs text-white/40">utilisés</span>
                  </div>
                  <div className="flex items-baseline gap-1.5 px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <span className="text-xl font-bold text-purple-400">{total}</span>
                    <span className="text-xs text-purple-400/70">total</span>
                  </div>
                </div>

                {data.truncated && (
                  <p className="text-xs text-amber-400/70 mt-4">
                    Plus de 200 codes — contacte l&apos;admin pour en voir davantage.
                  </p>
                )}
              </div>

              {/* Codes grid */}
              {data.codes.length === 0 ? (
                <div className="p-12 rounded-2xl bg-[#0F0F12] border border-purple-500/15 text-center">
                  <Gift className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">
                    Aucun code disponible pour le moment.<br />
                    Contacte l&apos;admin pour en recevoir.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.codes.map((c) => (
                    <div
                      key={c.keyCode}
                      className={`p-4 rounded-xl border transition-all ${
                        c.redeemed
                          ? "bg-white/[0.02] border-white/5"
                          : "bg-[#0F0F12] border-purple-500/15 hover:border-purple-500/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <code className="text-sm md:text-base font-mono font-bold text-white/90 tracking-wide truncate">
                          {c.keyCode}
                        </code>
                        <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/60 border border-white/10 font-mono">
                          {c.durationDays}j
                        </span>
                      </div>

                      {c.redeemed ? (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400" />
                          <span className="text-red-400/80 truncate" title={c.redeemedByEmail ?? ""}>
                            Utilisé{c.redeemedByEmail ? ` · ${c.redeemedByEmail}` : ""}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
                            <span className="text-green-400/80">Disponible</span>
                          </div>
                          <button
                            onClick={() => copyLink(c.keyCode)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/20 text-xs font-medium transition-all"
                          >
                            {copiedCode === c.keyCode ? (
                              <><Check className="w-3 h-3" /> Copié</>
                            ) : (
                              <><Copy className="w-3 h-3" /> Copier le lien</>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Footer note */}
              <p className="text-xs text-white/30 text-center pt-4">
                Le lien copié pointe vers <code className="font-mono">/try/CODE</code> — la personne clique, crée un compte, et active le code.
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
