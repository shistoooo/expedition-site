"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Briefcase, Sparkles, ArrowLeft, Layers, Film } from "lucide-react";

const STORAGE_KEY = "expedition_audience_seen_v1";
const DISPLAY_DELAY_MS = 600;
const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Step = "audience" | "tool";
type Audience = "monteurs" | "createurs" | "skipped";
type Tool = "premiere" | "davinci" | "both";

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
  const [step, setStep] = useState<Step>("audience");

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
      if (audience === "createurs") {
        persistChoice("createurs");
        router.push("/createurs");
        return;
      }
      if (audience === "monteurs") {
        // Step 2: ask which NLE
        setStep("tool");
        return;
      }
    },
    [router]
  );

  const handleChooseTool = useCallback(
    (tool: Tool) => {
      persistChoice(`monteurs:${tool}`);
      const url = tool === "both" ? "/monteurs" : `/monteurs?tool=${tool}`;
      router.push(url);
    },
    [router]
  );

  // Body scroll lock + Esc handler when overlay is open
  useEffect(() => {
    if (!show) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (step === "tool") {
          setStep("audience");
        } else {
          handleSkip();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [show, step, handleSkip]);

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
            {/* Ambient nebula — fills the void behind the content */}
            <div
              className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[700px] pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.25) 0%, rgba(99,60,200,0.10) 40%, transparent 75%)",
                filter: "blur(2px)",
              }}
            />
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

              <AnimatePresence mode="wait">
                {step === "audience" ? (
                  <motion.div
                    key="audience"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.3, ease: easeOutExpo }}
                  >
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
                      <button
                        type="button"
                        onClick={() => handleChooseAudience("monteurs")}
                        className="group relative text-left p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-purple-400/40 hover:bg-purple-500/[0.06] hover:shadow-[0_20px_50px_-20px_rgba(139,92,246,0.4)] transition-all duration-300"
                      >
                        <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                          <Briefcase className="w-5 h-5 text-purple-300" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-black tracking-[-0.02em] text-white mb-2">
                          Je suis monteur freelance
                        </h3>
                        <p className="text-sm text-white/55 leading-relaxed">
                          Je monte des vid&eacute;os pour des clients sur Premiere ou DaVinci.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleChooseAudience("createurs")}
                        className="group relative text-left p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-cyan-400/40 hover:bg-cyan-500/[0.06] hover:shadow-[0_20px_50px_-20px_rgba(34,211,238,0.4)] transition-all duration-300"
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
                      </button>
                    </div>

                    <div className="relative text-center">
                      <button
                        type="button"
                        onClick={handleSkip}
                        className="text-sm md:text-base text-white/50 hover:text-white/90 underline underline-offset-4 decoration-white/25 hover:decoration-white/70 transition-colors"
                      >
                        Pas s&ucirc;r &mdash; je continue sur la home
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="tool"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.3, ease: easeOutExpo }}
                  >
                    <div className="relative text-center mb-8">
                      <p className="text-xs font-mono uppercase tracking-widest text-purple-300/70 mb-3 flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setStep("audience")}
                          className="inline-flex items-center gap-1 text-white/45 hover:text-white/85 transition-colors"
                          aria-label="Revenir au choix pr&eacute;c&eacute;dent"
                        >
                          <ArrowLeft className="w-3 h-3" />
                          Retour
                        </button>
                        <span className="text-white/30">&middot;</span>
                        <span>Monteur freelance</span>
                      </p>
                      <h2 className="text-3xl md:text-4xl font-black tracking-[-0.02em] text-white leading-tight">
                        Tu montes sur{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
                          quel outil&nbsp;?
                        </span>
                      </h2>
                      <p className="text-sm md:text-base text-white/55 mt-3 max-w-xl mx-auto">
                        On adapte les exemples et le wording &agrave; ton workflow.
                      </p>
                    </div>

                    <div className="relative grid md:grid-cols-3 gap-3 md:gap-4 mb-6">
                      <button
                        type="button"
                        onClick={() => handleChooseTool("premiere")}
                        className="group relative text-left p-5 md:p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-purple-400/40 hover:bg-purple-500/[0.06] hover:shadow-[0_20px_50px_-20px_rgba(139,92,246,0.4)] transition-all duration-300"
                      >
                        <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Layers className="w-4 h-4 text-purple-300" />
                        </div>
                        <h3 className="text-lg md:text-xl font-black tracking-[-0.02em] text-white mb-1.5">
                          Premiere Pro
                        </h3>
                        <p className="text-xs md:text-sm text-white/55 leading-relaxed">
                          L&apos;outil Adobe, plugin dans la timeline.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleChooseTool("davinci")}
                        className="group relative text-left p-5 md:p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-cyan-400/40 hover:bg-cyan-500/[0.06] hover:shadow-[0_20px_50px_-20px_rgba(34,211,238,0.4)] transition-all duration-300"
                      >
                        <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Film className="w-4 h-4 text-cyan-300" />
                        </div>
                        <h3 className="text-lg md:text-xl font-black tracking-[-0.02em] text-white mb-1.5">
                          DaVinci Resolve
                        </h3>
                        <p className="text-xs md:text-sm text-white/55 leading-relaxed">
                          L&apos;outil Blackmagic, plugin dans la timeline.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleChooseTool("both")}
                        className="group relative text-left p-5 md:p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.05] transition-all duration-300"
                      >
                        <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <span className="text-base font-black text-white/80">2</span>
                        </div>
                        <h3 className="text-lg md:text-xl font-black tracking-[-0.02em] text-white mb-1.5">
                          Les deux
                        </h3>
                        <p className="text-xs md:text-sm text-white/55 leading-relaxed">
                          Je passe de l&apos;un &agrave; l&apos;autre selon le projet.
                        </p>
                      </button>
                    </div>

                    <div className="relative text-center">
                      <button
                        type="button"
                        onClick={handleSkip}
                        className="text-sm md:text-base text-white/50 hover:text-white/90 underline underline-offset-4 decoration-white/25 hover:decoration-white/70 transition-colors"
                      >
                        Pas s&ucirc;r &mdash; je continue sur la home
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
