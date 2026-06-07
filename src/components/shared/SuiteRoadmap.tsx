"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

type ToolKey = "tubeforge" | "clipforge" | "reviewforge";

type Wave = {
  key: ToolKey;
  wave: string;
  name: string;
  status: string;
  /** Couleur d'identité de l'outil (cohérente avec le reste du site) */
  color: string;
  /** true = déjà livré (coche verte) */
  done?: boolean;
};

// Source de vérité de l'état d'avancement de la suite.
// ⚠️ Mettre à jour `status` ici quand une vague change d'état (dev → bêta → livré).
const WAVES: Wave[] = [
  { key: "tubeforge", wave: "Vague 1", name: "TubeForge", status: "Disponible aujourd'hui", color: "#f97316", done: true },
  { key: "clipforge", wave: "Vague 2", name: "ClipForge", status: "En développement", color: "#8b5cf6" },
  { key: "reviewforge", wave: "Vague 3", name: "ReviewForge", status: "Prévu", color: "#10b981" },
];

type SuiteRoadmapProps = {
  /** Outil mis en avant (la page courante) */
  highlight: ToolKey;
};

/**
 * Tracker des "Vagues" de la suite Expédition. Répond honnêtement à
 * "là où on en est" en réutilisant le langage Vague 1/2/3 déjà présent sur le
 * site : TubeForge est livré, les suivants arrivent — tous inclus dans le même
 * abonnement. La carte de l'outil courant est mise en avant (anneau + glow).
 */
export default function SuiteRoadmap({ highlight }: SuiteRoadmapProps) {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-center mb-10 md:mb-14 max-w-2xl mx-auto"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-white/45 mb-3">
            La feuille de route
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-[-0.02em] mb-4">
            Où on en est
          </h2>
          <p className="text-base md:text-lg text-white/55 leading-relaxed">
            Un launcher, plusieurs outils qui arrivent par vagues.{" "}
            <span className="text-white/80">Chaque nouvel outil s&apos;ajoute à ton abonnement &mdash; ton tarif Pionnier, lui, ne bouge pas.</span>
          </p>
        </motion.div>

        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 max-w-4xl mx-auto">
          {WAVES.map((w, i) => {
            const active = w.key === highlight;
            return (
              <motion.li
                key={w.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: easeOutExpo }}
                className="relative rounded-2xl p-5 md:p-6 border bg-white/[0.03] transition-all duration-300"
                style={{
                  borderColor: active ? `${w.color}66` : "rgba(255,255,255,0.08)",
                  background: active ? `${w.color}10` : undefined,
                  boxShadow: active ? `0 0 40px ${w.color}26` : undefined,
                }}
              >
                {/* Pastille d'état */}
                <div className="flex items-center gap-2.5 mb-3">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: w.done ? w.color : `${w.color}26`,
                      border: w.done ? "none" : `1.5px solid ${w.color}99`,
                    }}
                  >
                    {w.done ? (
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    ) : (
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: w.color }}
                      />
                    )}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-widest text-white/45">
                    {w.wave}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{w.name}</h3>
                <p
                  className="text-sm font-semibold"
                  style={{ color: active || w.done ? w.color : "rgba(255,255,255,0.5)" }}
                >
                  {w.status}
                </p>

                {active && (
                  <span className="absolute top-4 right-4 text-[10px] font-mono uppercase tracking-wider text-white/40">
                    Tu es ici
                  </span>
                )}
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
