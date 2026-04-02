"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function DownloadPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#06051a] pt-24 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-3xl font-black tracking-[-0.03em] text-white mb-4">
            Bientôt disponible
          </h1>
          <p className="text-white/50 text-sm mb-6">
            Le téléchargement de vidéos YouTube arrive prochainement.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/10 transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </main>
    </>
  );
}
