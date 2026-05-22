"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Briefcase, Sparkles } from "lucide-react";

const STORAGE_KEY = "expedition_audience_seen_v1";
const DISPLAY_DELAY_MS = 600;
const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Deterministic particle positions (avoid SSR/hydration mismatch).
// Each particle floats slowly with a unique duration/delay → background feels alive without distracting.
const particles: { x: number; y: number; size: number; duration: number; delay: number }[] = [
  { x: 8, y: 15, size: 2, duration: 5, delay: 0 },
  { x: 22, y: 45, size: 1.5, duration: 6, delay: 0.8 },
  { x: 18, y: 78, size: 2, duration: 7, delay: 1.4 },
  { x: 35, y: 20, size: 1, duration: 4, delay: 0.3 },
  { x: 45, y: 88, size: 1.5, duration: 5.5, delay: 2 },
  { x: 60, y: 12, size: 2, duration: 6.5, delay: 1.1 },
  { x: 72, y: 38, size: 1, duration: 4.5, delay: 0.6 },
  { x: 80, y: 70, size: 1.5, duration: 5, delay: 1.7 },
  { x: 90, y: 25, size: 2, duration: 7, delay: 0.9 },
  { x: 95, y: 58, size: 1, duration: 5, delay: 2.3 },
  { x: 12, y: 92, size: 1.5, duration: 6, delay: 1.5 },
  { x: 50, y: 50, size: 1, duration: 4, delay: 0 },
  { x: 28, y: 60, size: 1.5, duration: 6, delay: 1.2 },
  { x: 68, y: 85, size: 1, duration: 5, delay: 0.4 },
  { x: 85, y: 8, size: 1.5, duration: 6.5, delay: 1.8 },
];

type Audience = "monteurs" | "createurs" | "skipped";

// Always show the overlay outside of production so we can demo the funnel on previews.
const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

function persistChoice(value: string) {
  if (!isProduction) return; // don't persist outside prod — keeps preview testable
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // localStorage may be blocked — fail silently
  }
}

function hasBeenSeen(): boolean {
  if (!isProduction) return false; // always show outside prod
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  } catch {
    return true; // localStorage blocked → don't harass
  }
}

export default function WelcomeOverlay() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Allow ?reset-overlay=1 to force re-display from anywhere
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("reset-overlay") === "1") {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // Ignore
        }
      }
    }

    if (hasBeenSeen()) return;

    const timer = setTimeout(() => {
      setShow(true);
      // Mark as shown the moment the overlay appears so refreshes don't re-trigger (prod only)
      persistChoice("shown");
    }, DISPLAY_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleSkip = useCallback(() => {
    persistChoice("skipped");
    setShow(false);
  }, []);

  const handleChooseAudience = useCallback(
    (audience: Audience) => {
      persistChoice(audience);
      if (audience === "createurs") {
        router.push("/createurs");
      } else if (audience === "monteurs") {
        router.push("/monteurs");
      }
    },
    [router]
  );

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
          className="fixed inset-0 z-[100] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-overlay-title"
        >
          {/* Full-screen backdrop (opaque) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-[#06051a]"
            aria-hidden="true"
          >
            {/* Ambient nebula — fills the void behind the content. Pulses slowly to feel alive. */}
            <motion.div
              className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[700px] pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.25) 0%, rgba(99,60,200,0.10) 40%, transparent 75%)",
                filter: "blur(2px)",
              }}
              animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Subtle floating particles — give the background a sense of life without distracting */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {particles.map((p, i) => (
                <motion.span
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: p.size,
                    height: p.size,
                    boxShadow: `0 0 ${p.size * 3}px rgba(167,139,250,0.5)`,
                  }}
                  animate={{
                    opacity: [0.15, 0.7, 0.15],
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Content — centered, scrollable on small screens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="relative min-h-full flex items-center justify-center p-6 md:p-10 z-10"
          >
            <div className="w-full max-w-4xl relative">

              <div>
                <div className="relative text-center mb-8">
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: easeOutExpo }}
                    className="text-xs font-mono uppercase tracking-widest text-purple-300/70 mb-3"
                  >
                    Avant qu&apos;on continue
                  </motion.p>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: easeOutExpo }}
                    id="welcome-overlay-title"
                    className="text-3xl md:text-4xl font-black tracking-[-0.02em] text-white leading-tight"
                  >
                    Tu montes{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
                      pour qui&nbsp;?
                    </span>
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3, ease: easeOutExpo }}
                    className="text-sm md:text-base text-white/55 mt-3 max-w-xl mx-auto"
                  >
                    Dis-nous ce que tu fais, on t&apos;oriente.
                  </motion.p>
                </div>

                <div className="relative grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
                  <motion.button
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4, ease: easeOutExpo }}
                    type="button"
                    onClick={() => handleChooseAudience("monteurs")}
                    className="group relative text-left p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-purple-400/60 hover:bg-purple-500/[0.07] hover:-translate-y-1 hover:shadow-[0_30px_70px_-20px_rgba(139,92,246,0.55)] transition-all duration-300"
                  >
                    <div
                      className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-purple-500/25 group-hover:border-purple-400/60 transition-all duration-300"
                      style={{ boxShadow: "0 0 0 rgba(139,92,246,0)" }}
                    >
                      <Briefcase className="w-5 h-5 text-purple-300 group-hover:text-purple-200 transition-colors" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black tracking-[-0.02em] text-white mb-2">
                      Je suis monteur freelance
                    </h3>
                    <p className="text-sm text-white/55 leading-relaxed">
                      Je monte des vid&eacute;os pour des clients sur Premiere ou DaVinci.
                    </p>
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5, ease: easeOutExpo }}
                    type="button"
                    onClick={() => handleChooseAudience("createurs")}
                    className="group relative text-left p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-cyan-400/60 hover:bg-cyan-500/[0.07] hover:-translate-y-1 hover:shadow-[0_30px_70px_-20px_rgba(34,211,238,0.55)] transition-all duration-300"
                  >
                    <div
                      className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-cyan-500/25 group-hover:border-cyan-400/60 transition-all duration-300"
                      style={{ boxShadow: "0 0 0 rgba(34,211,238,0)" }}
                    >
                      <Sparkles className="w-5 h-5 text-cyan-300 group-hover:text-cyan-200 transition-colors" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black tracking-[-0.02em] text-white mb-2">
                      Je suis cr&eacute;ateur YouTube
                    </h3>
                    <p className="text-sm text-white/55 leading-relaxed">
                      Je monte mon propre contenu sur Premiere ou DaVinci.
                    </p>
                  </motion.button>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.65, ease: easeOutExpo }}
                  className="relative text-center"
                >
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="text-sm md:text-base text-white/50 hover:text-white/90 underline underline-offset-4 decoration-white/25 hover:decoration-white/70 transition-colors"
                  >
                    Pas s&ucirc;r &mdash; je pr&eacute;f&egrave;re explorer
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
