"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Briefcase, Sparkles, X } from "lucide-react";

const STORAGE_KEY = "expedition_audience_seen_v1";
const DISPLAY_DELAY_MS = 600;
const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Choice = "monteurs" | "createurs" | "skipped";

function persistChoice(choice: Choice) {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // localStorage may be blocked (private mode, etc.) — fail silently
  }
}

export default function WelcomeOverlay() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let seen: string | null = null;
    try {
      seen = localStorage.getItem(STORAGE_KEY);
    } catch {
      // localStorage blocked → treat as already seen to avoid harassing the user
      seen = "blocked";
    }
    if (seen) return;

    const timer = setTimeout(() => {
      setShow(true);
      // Mark as shown the moment the overlay appears so refreshes don't re-trigger
      persistChoice("skipped");
    }, DISPLAY_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleSkip = useCallback(() => {
    persistChoice("skipped");
    setShow(false);
  }, []);

  const handleChoose = useCallback((audience: "monteurs" | "createurs") => {
    persistChoice(audience);
    // Let the Link handle navigation; nothing to do here
  }, []);

  // Body scroll lock + Esc handler when overlay is open
  useEffect(() => {
    if (!show) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleSkip();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [show, handleSkip]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {show && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-overlay-title"
        >
          {/* Backdrop — click to skip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-[#06051a]/85 backdrop-blur-md cursor-pointer"
            onClick={handleSkip}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
            className="relative w-full max-w-4xl"
          >
            {/* Close button */}
            <button
              type="button"
              aria-label="Fermer et continuer sur la home"
              onClick={handleSkip}
              className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-9 h-9 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-white/70 hover:text-white hover:bg-white/15 transition-colors flex items-center justify-center z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="rounded-3xl border border-white/10 bg-[#06051a]/95 backdrop-blur-2xl p-6 md:p-10 shadow-[0_30px_100px_-20px_rgba(139,92,246,0.4)] relative overflow-hidden">
              {/* Subtle nebula behind the title */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none opacity-60"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(139,92,246,0.18) 0%, transparent 70%)",
                }}
              />

              <div className="relative text-center mb-8">
                <p className="text-xs font-mono uppercase tracking-widest text-purple-300/70 mb-3">
                  Avant qu&apos;on continue
                </p>
                <h2
                  id="welcome-overlay-title"
                  className="text-3xl md:text-4xl font-black tracking-[-0.02em] text-white leading-tight"
                >
                  Tu te reconnais dans{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
                    lequel&nbsp;?
                  </span>
                </h2>
                <p className="text-sm md:text-base text-white/55 mt-3 max-w-xl mx-auto">
                  On adapte le message pour que tu ne perdes pas de temps.
                </p>
              </div>

              <div className="relative grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
                <Link
                  href="/monteurs"
                  onClick={() => handleChoose("monteurs")}
                  className="group relative p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-purple-400/40 hover:bg-purple-500/[0.06] hover:shadow-[0_20px_50px_-20px_rgba(139,92,246,0.4)] transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="w-5 h-5 text-purple-300" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black tracking-[-0.02em] text-white mb-2">
                    Je suis monteur freelance
                  </h3>
                  <p className="text-sm text-white/55 leading-relaxed">
                    Je monte des vid&eacute;os YouTube pour des clients sur Premiere ou DaVinci.
                  </p>
                </Link>

                <Link
                  href="/createurs"
                  onClick={() => handleChoose("createurs")}
                  className="group relative p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-cyan-400/40 hover:bg-cyan-500/[0.06] hover:shadow-[0_20px_50px_-20px_rgba(34,211,238,0.4)] transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-5 h-5 text-cyan-300" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black tracking-[-0.02em] text-white mb-2">
                    Je suis cr&eacute;ateur YouTube
                  </h3>
                  <p className="text-sm text-white/55 leading-relaxed">
                    Je monte mon propre contenu sur Premiere ou DaVinci.
                  </p>
                </Link>
              </div>

              <div className="relative text-center">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-xs md:text-sm text-white/40 hover:text-white/75 underline underline-offset-4 decoration-white/20 hover:decoration-white/60 transition-colors"
                >
                  Pas s&ucirc;r &mdash; je continue sur la home
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
