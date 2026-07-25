"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Clock } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * ⚠️ CHIFFRES ILLUSTRATIFS — à remplacer par un vrai chronométrage avant
 * publication (voir plan). Décomposition classique : téléchargeur générique
 * (~45s pour du 1080p) + localiser le fichier + glisser-déposer dans Premiere
 * + attente d'import/transcodage (~35s) + ranger. TubeForge : coller le lien,
 * arrivée directe sur la timeline.
 */
const DEFAULT_CLASSIC_SECONDS = 130; // 2min10
const DEFAULT_TUBEFORGE_SECONDS = 12;

const CLASSIC_STEPS = [
  { label: "Télécharger avec un outil générique", seconds: 45 },
  { label: "Retrouver le fichier, le renommer", seconds: 15 },
  { label: "Glisser-déposer dans Premiere/DaVinci", seconds: 10 },
  { label: "Attendre l'import / le transcodage", seconds: 45 },
  { label: "Ranger dans le bon dossier de projet", seconds: 15 },
];

function formatDuration(totalSeconds: number): string {
  const s = Math.round(totalSeconds);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return rem === 0 ? `${m}min` : `${m}min${String(rem).padStart(2, "0")}`;
}

function useCountUp(target: number, active: boolean, durationMs: number) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 2);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, durationMs]);
  return value;
}

export default function DownloadChrono({
  classicSeconds = DEFAULT_CLASSIC_SECONDS,
  tubeforgeSeconds = DEFAULT_TUBEFORGE_SECONDS,
}: {
  classicSeconds?: number;
  tubeforgeSeconds?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Course visuelle : les deux "chronos" tournent à la même vitesse réelle
  // (1 seconde affichée ≈ un rythme perceptible), donc TubeForge s'arrête vite
  // et l'autre continue de tourner sous les yeux — c'est ça qui vend le temps gagné.
  const RACE_DURATION_MS = 3200;
  const classicValue = useCountUp(classicSeconds, isInView, RACE_DURATION_MS);
  const tubeforgeDurationMs = Math.max(RACE_DURATION_MS * (tubeforgeSeconds / classicSeconds), 400);
  const tubeforgeValue = useCountUp(tubeforgeSeconds, isInView, tubeforgeDurationMs);

  const savedSeconds = classicSeconds - tubeforgeSeconds;
  const savedPct = Math.round((savedSeconds / classicSeconds) * 100);

  return (
    <div ref={ref} className="container-main">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: easeOutExpo }}
        className="text-center mb-10"
      >
        <p className="text-xs font-mono uppercase tracking-widest text-white/35 mb-4">
          Le même téléchargement, chronométré
        </p>
        <h2 className="text-3xl md:text-4xl font-black tracking-[-0.02em]">
          Regarde le temps que tu <span style={{ color: "#ff6a1f" }}>récupères</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Méthode classique */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8"
        >
          <div className="flex items-center gap-2 mb-5 text-white/40">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-widest">Méthode classique</span>
          </div>
          <div className="font-black tabular-nums text-5xl md:text-6xl text-white/70 mb-4">
            {formatDuration(classicValue)}
          </div>
          <ul className="space-y-2">
            {CLASSIC_STEPS.map((step, i) => (
              <li key={i} className="flex items-center justify-between text-xs text-white/35">
                <span>{step.label}</span>
                <span className="tabular-nums shrink-0 ml-3">~{step.seconds}s</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* TubeForge */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="relative rounded-2xl border p-6 md:p-8 overflow-hidden"
          style={{ borderColor: "rgba(255,106,31,0.35)", background: "rgba(255,106,31,0.05)" }}
        >
          <div
            className="absolute -inset-8 pointer-events-none opacity-70"
            style={{
              background: "radial-gradient(ellipse 60% 60% at 50% 30%, rgba(255,106,31,0.18) 0%, transparent 72%)",
              filter: "blur(40px)",
            }}
          />
          <div className="relative flex items-center gap-2 mb-5" style={{ color: "#ff6a1f" }}>
            <Zap className="w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-widest">TubeForge + plugin</span>
          </div>
          <div className="relative font-black tabular-nums text-5xl md:text-6xl text-white mb-4">
            {formatDuration(tubeforgeValue)}
          </div>
          <p className="relative text-sm text-white/55 leading-relaxed">
            Colle le lien dans le plugin Premiere/DaVinci. La vidéo arrive directement sur ta timeline, en pleine
            qualité — pas de fichier à ranger, pas d&apos;import à attendre.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2, ease: easeOutExpo }}
        className="text-center mt-8"
      >
        <p className="text-lg md:text-xl text-white/80">
          Soit <span className="font-black" style={{ color: "#ff6a1f" }}>{formatDuration(savedSeconds)} de moins</span>{" "}
          à chaque vidéo &mdash; <span className="text-white/50">{savedPct}% de temps en moins.</span>
        </p>
      </motion.div>
    </div>
  );
}
