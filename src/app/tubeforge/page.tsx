"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Download, Link as LinkIcon, Check, Loader2, Youtube } from "lucide-react";
import { motion } from "framer-motion";

export default function TubeForgePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setStatus("idle");
    
    // Simulation de traitement
    setTimeout(() => {
      setLoading(false);
      setStatus("success");
      // Ici on appellerait l'API réelle
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="pt-32 pb-20 relative overflow-hidden min-h-[80vh] flex flex-col items-center justify-center">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px]" />
        </div>

        <div className="container-main relative z-10 w-full max-w-3xl text-center">
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 mb-6 shadow-lg shadow-red-500/20">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tube<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Forge</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Le moyen le plus simple de télécharger des vidéos YouTube pour vos montages.
              Haute qualité, rapide et gratuit.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm shadow-2xl">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative flex items-center">
                <div className="absolute left-4 text-white/40">
                  <Youtube className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Collez le lien YouTube ici (ex: https://youtube.com/watch?v=...)"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-32 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={loading || !url}
                  className="absolute right-2 top-2 bottom-2 bg-white text-black font-bold px-6 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span className="hidden md:inline">Télécharger</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Status Messages */}
            {status === 'success' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Le téléchargement a commencé ! (Simulation)
              </motion.div>
            )}

            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-white/40">
              <span className="flex items-center gap-1"><Check className="w-3 h-3" /> MP4 1080p</span>
              <span className="flex items-center gap-1"><Check className="w-3 h-3" /> MP3 Audio</span>
              <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Sans publicité</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
