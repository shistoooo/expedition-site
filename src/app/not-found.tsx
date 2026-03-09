import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#06051a] text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="text-8xl font-bold text-white/10 mb-4">404</div>
        <h2 className="text-2xl font-bold mb-3">Page introuvable</h2>
        <p className="text-white/60 mb-8 text-sm">
          Cette page n&apos;existe pas ou a &eacute;t&eacute; d&eacute;plac&eacute;e.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour &agrave; l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
