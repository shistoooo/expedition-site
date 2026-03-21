"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Download, Key, Copy, Check, AlertCircle, Gift } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackground from "@/components/PageBackground";

const WORKER_URL = "https://expedition-licensing.expedition-studio.workers.dev";

export default function TryPage() {
  const params = useParams();
  const code = (params.code as string)?.toUpperCase() || "";

  const [status, setStatus] = useState<"loading" | "valid" | "used" | "invalid">("loading");
  const [copied, setCopied] = useState(false);
  const [durationDays, setDurationDays] = useState(7);

  useEffect(() => {
    if (!code) {
      setStatus("invalid");
      return;
    }

    fetch(`${WORKER_URL}/invitations/key/${code}`)
      .then((res) => res.json())
      .then((data: any) => {
        if (data.valid) {
          setStatus("valid");
          setDurationDays(data.durationDays || 7);
        } else if (data.error?.includes("déjà été utilisée")) {
          setStatus("used");
        } else {
          setStatus("invalid");
        }
      })
      .catch(() => setStatus("invalid"));
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const macUrl = "https://api.clipapp.uk/downloads/launcher-install/macos";
  const windowsUrl = "https://api.clipapp.uk/downloads/launcher-install/windows";

  return (
    <div className="min-h-screen text-white selection:bg-blue-500/30 font-sans relative">
      <PageBackground />
      <Navbar />

      <main className="relative z-10 overflow-hidden pt-24">
        <section className="relative pt-24 pb-32 container-main">
          <div className="max-w-2xl mx-auto text-center">
            {status === "loading" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Gift className="w-8 h-8 text-blue-400 animate-pulse" />
                </div>
                <p className="text-white/50">Vérification de l'invitation...</p>
              </motion.div>
            )}

            {status === "valid" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <Gift className="w-8 h-8 text-emerald-400" />
                </div>

                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-3">
                    Vous avez été invité !
                  </h1>
                  <p className="text-white/50 text-lg">
                    Quelqu'un vous offre <span className="text-white font-semibold">{durationDays} jours d'accès gratuit</span> à Expedition Creative Suite.
                  </p>
                </div>

                {/* Steps */}
                <div className="space-y-4 text-left max-w-md mx-auto">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0">1</span>
                    <div>
                      <p className="text-sm font-medium text-white/80">Téléchargez le Launcher</p>
                      <p className="text-xs text-white/40 mt-1">Choisissez votre plateforme ci-dessous</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0">2</span>
                    <div>
                      <p className="text-sm font-medium text-white/80">Créez un compte</p>
                      <p className="text-xs text-white/40 mt-1">Ouvrez le Launcher et inscrivez-vous</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0">3</span>
                    <div>
                      <p className="text-sm font-medium text-white/80">Entrez votre clé d'accès</p>
                      <p className="text-xs text-white/40 mt-1">Copiez la clé ci-dessous et collez-la dans le Launcher</p>
                    </div>
                  </div>
                </div>

                {/* Key display */}
                <div className="p-5 rounded-xl bg-white/5 border border-white/10 max-w-md mx-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <Key className="w-4 h-4 text-white/40" />
                    <span className="text-xs text-white/40 uppercase tracking-wider font-medium">Votre clé d'accès</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 text-2xl font-mono font-bold text-white tracking-widest text-center">
                      {code}
                    </code>
                    <button
                      onClick={handleCopy}
                      className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
                      title="Copier la clé"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Download buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <a
                    href={macUrl}
                    className="flex-1 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                  >
                    <Download className="w-5 h-5" />
                    Mac
                  </a>
                  <a
                    href={windowsUrl}
                    className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium flex items-center justify-center gap-3 transition-all"
                  >
                    <Download className="w-5 h-5" />
                    Windows
                  </a>
                </div>
              </motion.div>
            )}

            {status === "used" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-amber-400" />
                </div>
                <h1 className="text-3xl font-bold">Invitation déjà utilisée</h1>
                <p className="text-white/50">
                  Cette clé a déjà été activée. Demandez à votre ami de vous en envoyer une nouvelle.
                </p>
              </motion.div>
            )}

            {status === "invalid" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h1 className="text-3xl font-bold">Invitation invalide</h1>
                <p className="text-white/50">
                  Ce lien d'invitation n'est pas valide. Vérifiez le lien ou contactez la personne qui vous l'a envoyé.
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
