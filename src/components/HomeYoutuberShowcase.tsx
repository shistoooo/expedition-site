"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { youtubers } from "@/lib/youtubers";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Durée d'un cycle complet du marquee (parcours d'une moitié de la liste
// dupliquée = une fois la liste réelle de bout en bout). 40s = défilement
// suffisamment lent pour qu'un visiteur ait le temps de lire chaque handle
// sans se sentir bombardé. Ajustable selon le ressenti.
const MARQUEE_DURATION_SEC = 40;

/**
 * Carousel de YouTubeurs en marquee infini.
 *
 * - Container max-w-3xl → laisse visible ~4 avatars à la fois sur desktop.
 * - Liste dupliquée + animation `x: [0%, -50%]` linéaire en boucle → l'effet
 *   visuel est qu'un nouvel avatar entre à droite pendant qu'un autre sort à
 *   gauche, sans saut perceptible. La duplication est nécessaire parce qu'on
 *   ne peut pas téléporter visuellement de -100% à 0% sans flash.
 * - Pause au hover (whileHover) — important sur desktop pour cliquer
 *   tranquillement sur un YouTubeur sans courir après.
 * - Fade-mask gauche/droite (gradient vers la couleur du fond) → entrées/sorties
 *   fluides sans coupure brutale.
 * - overflow-x: hidden uniquement (pas overflow-hidden complet) → les hover
 *   effects qui débordent verticalement (translate-y, purple glow) restent
 *   visibles. C'est ça qu'on évite pour ne PAS "couper en haut ou en bas".
 */
export default function HomeYoutuberShowcase() {
  // On duplique la liste : `animate x: 0% → -50%` parcourt la 1ʳᵉ moitié et
  // arrive sur le début de la 2ᵉ — qui est visuellement identique à la 1ʳᵉ.
  // Quand l'anim repart de 0%, on est au même point visuel → boucle invisible.
  const duplicated = [...youtubers, ...youtubers];

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

          <div
            className="relative max-w-3xl mx-auto"
            style={{ overflowX: "hidden", overflowY: "visible" }}
          >
            {/* Fade-mask gauche — gradient vers le fond pour absorber l'entrée */}
            <div
              className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 md:w-28 z-10"
              style={{
                background:
                  "linear-gradient(to right, #06051a 20%, transparent)",
              }}
            />
            {/* Fade-mask droite */}
            <div
              className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 md:w-28 z-10"
              style={{
                background:
                  "linear-gradient(to left, #06051a 20%, transparent)",
              }}
            />

            {/* Le marquee — utilise `.animate-marquee` du globals.css
                (keyframes translateX(0) → translateX(-50%), pause au :hover
                déjà gérée par la classe). Plus fiable que framer-motion pour
                cette boucle linéaire infinie. */}
            <div
              className="flex items-start gap-10 md:gap-14 py-4 will-change-transform animate-marquee w-max"
              style={{ "--marquee-duration": `${MARQUEE_DURATION_SEC}s` } as React.CSSProperties}
            >
              {duplicated.map((y, i) => (
                <a
                  key={`${y.handle}-${i}`}
                  href={y.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-4 shrink-0"
                  aria-label={`Chaîne YouTube de @${y.handle}`}
                  // Marquer la deuxième moitié comme aria-hidden pour les
                  // lecteurs d'écran — c'est purement décoratif, pas un
                  // doublon de contenu.
                  aria-hidden={i >= youtubers.length ? "true" : undefined}
                  tabIndex={i >= youtubers.length ? -1 : undefined}
                >
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-purple-400/60 transition-all duration-300 shadow-xl shadow-black/30">
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
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
