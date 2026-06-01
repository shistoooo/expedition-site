"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { youtubers } from "@/lib/youtubers";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Carousel des YouTubeurs (option C — défilement manuel avec flèches).
 *
 * Container scrollable horizontalement, scroll-snap aligné sur chaque avatar.
 * 2 boutons flèche qui scrollent le container par groupes d'avatars.
 * Les flèches sont auto-masquées aux extrémités (cf state showLeft/showRight).
 *
 * Pourquoi pas un marquee ? On a testé : préférence pour le contrôle manuel
 * — l'utilisateur lit à son rythme, on dégage les "orphelin" du wrap, ça reste
 * cohérent même si on ajoute 20 YouTubeurs.
 *
 * Source unique (src/lib/youtubers.ts), partagée avec les landings personas.
 */
export default function HomeYoutuberShowcase() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // Refresh des indicateurs gauche/droite à chaque scroll, resize, ou contenu.
  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 8);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    // Scroll d'environ la moitié du viewport — suffisant pour donner un sentiment
    // de progression sans sauter trop loin et perdre le contexte visuel.
    // On assigne scrollLeft directement (et pas el.scrollBy/scrollTo) parce que
    // certains contextes test/headless ignorent silencieusement scrollBy. Le
    // smooth scrolling reste appliqué automatiquement via la classe Tailwind
    // `scroll-smooth` (CSS `scroll-behavior: smooth`).
    const step = el.clientWidth * 0.5;
    const delta = direction === "left" ? -step : step;
    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollLeft = Math.max(0, Math.min(maxScroll, el.scrollLeft + delta));
  };

  return (
    <section className="pt-0 pb-16 md:pt-2 md:pb-20 relative">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-center"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-white/35 mb-10">
            Déjà adopté par
          </p>

          <div className="relative">
            {/* Fade-mask gauche — masque visuel pour suggérer le débordement */}
            <div
              className={`pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10 transition-opacity duration-300 ${
                showLeft ? "opacity-100" : "opacity-0"
              }`}
              style={{
                background:
                  "linear-gradient(to right, var(--background, #06051a) 10%, transparent)",
              }}
            />
            {/* Fade-mask droite — pareil côté droit */}
            <div
              className={`pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10 transition-opacity duration-300 ${
                showRight ? "opacity-100" : "opacity-0"
              }`}
              style={{
                background:
                  "linear-gradient(to left, var(--background, #06051a) 10%, transparent)",
              }}
            />

            {/* Bouton gauche */}
            <button
              type="button"
              onClick={() => scrollBy("left")}
              aria-label="YouTubeurs précédents"
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-purple-400/50 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 shadow-lg shadow-black/20 ${
                showLeft
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Bouton droite */}
            <button
              type="button"
              onClick={() => scrollBy("right")}
              aria-label="YouTubeurs suivants"
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-purple-400/50 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 shadow-lg shadow-black/20 ${
                showRight
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Conteneur scrollable — scrollbar cachée via Tailwind arbitrary
                selector (évite styled-jsx qui causait un mismatch d'hydratation
                avec les classes auto-générées côté serveur vs client). */}
            <div
              ref={scrollerRef}
              className="flex items-start gap-8 md:gap-12 overflow-x-scroll scroll-smooth pb-2 px-12 md:px-14 [&::-webkit-scrollbar]:hidden"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {youtubers.map((y, i) => (
                <motion.a
                  key={y.handle}
                  href={y.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: 0.15 + i * 0.06,
                    ease: easeOutExpo,
                  }}
                  className="group flex flex-col items-center gap-4 shrink-0"
                  aria-label={`Chaîne YouTube de @${y.handle}`}
                >
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-purple-400/60 transition-all duration-300 group-hover:-translate-y-1.5 shadow-xl shadow-black/30">
                    <div
                      className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle at center, rgba(139,92,246,0.55), transparent 70%)",
                        filter: "blur(14px)",
                      }}
                    />
                    <Image
                      src={y.avatar}
                      alt={`Avatar de la chaîne @${y.handle}`}
                      fill
                      sizes="(min-width: 768px) 96px, 80px"
                      className="object-cover relative"
                    />
                  </div>
                  <span className="text-xs md:text-sm text-white/50 group-hover:text-white/90 transition-colors font-mono tracking-tight whitespace-nowrap">
                    @{y.handle}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
