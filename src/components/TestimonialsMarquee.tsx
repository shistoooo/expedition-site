"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Nahsir",
    role: "Monteur vidéo",
    text: "J’utilise souvent Expedition, et notamment ClipForge, pour mes montages. Depuis ma première utilisation, je ne me sers plus que de ce logiciel. Il est pratique, facile d’utilisation et propose de nombreuses options qui permettent aux monteurs de gagner un temps précieux, que ce soit pour des projets clients ou personnels. Je recommande vivement cet outil pour tout prestataire travaillant sur du montage vidéo",
  },
  {
    name: "Astro",
    role: "Monteur vidéo",
    text: "Franchement bluffé par l'utilisation de tubeforge, ça a vraiment simplifié et accélérer le processus de téléchargement de vidéo youtube. Bravo !!",
  },
];

export default function TestimonialsMarquee() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const t = testimonials[current];

  return (
    <div className="relative pt-4 pb-16 md:pb-20">
      {/* Ambient glow — attire le regard sur les avis */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(139,92,246,0.12) 0%, rgba(99,60,200,0.04) 50%, transparent 80%)",
        }}
      />

      <div className="container-main flex flex-col items-center text-center relative z-10">
        {/* Frosted glass container — the "petit plus" */}
        <div
          className="relative max-w-lg w-full rounded-2xl px-6 py-5 md:px-9 md:py-7"
          style={{
            background: "rgba(255,255,255,0.045)",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {/* Decorative quote mark */}
          <div className="flex justify-center mb-3">
            <span
              className="text-2xl md:text-3xl leading-none select-none"
              style={{ color: "rgba(139,92,246,0.25)" }}
            >
              &ldquo;
            </span>
          </div>

          {/* Rotating quote */}
          <div className="relative min-h-[65px] md:min-h-[55px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={current}
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-base md:text-lg leading-relaxed text-white/65 font-light"
              >
                {t.text}
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Author — crossfade */}
          <div className="mt-4 relative h-7 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.08 }}
                className="flex items-center gap-2"
              >
                <span className="text-xs font-medium text-white/45">
                  {t.name}
                </span>
                <span className="text-white/15">·</span>
                <span className="text-[11px] text-white/25">{t.role}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Minimal progress indicator — thin animated lines */}
        <div className="mt-6 flex gap-1">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="relative h-[2px] rounded-full transition-all duration-500 ease-out"
              style={{
                width: i === current ? "24px" : "6px",
                background:
                  i === current
                    ? "rgba(139,92,246,0.5)"
                    : "rgba(255,255,255,0.08)",
                boxShadow:
                  i === current
                    ? "0 0 10px rgba(139,92,246,0.3)"
                    : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
