"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, Sparkles } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

// 45 minutes saved per project on average (between 30min and 1h per project)
const HOURS_SAVED_PER_PROJECT = 0.75;
const TUBEFORGE_PRICE_MONTHLY = 8.03;

export default function MonteursROICalculator() {
  const [hourlyRate, setHourlyRate] = useState(35);
  const [projectsPerMonth, setProjectsPerMonth] = useState(5);

  const monthlySavings = useMemo(() => {
    return hourlyRate * HOURS_SAVED_PER_PROJECT * projectsPerMonth;
  }, [hourlyRate, projectsPerMonth]);

  const roiMultiplier = useMemo(() => {
    return Math.max(1, Math.round((monthlySavings / TUBEFORGE_PRICE_MONTHLY) * 10) / 10);
  }, [monthlySavings]);

  const formatEuro = (value: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

  return (
    <section className="py-16 md:py-20 relative">
      <div className="container-main max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-center mb-10 md:mb-14"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-purple-300/70 mb-3 flex items-center justify-center gap-2">
            <Calculator className="w-3 h-3" />
            Calcul ROI rapide
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05]">
            Combien tu &eacute;conomises{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-purple-300">
              chaque mois ?
            </span>
          </h2>
          <p className="text-base md:text-lg text-white/55 mt-4 max-w-2xl mx-auto leading-relaxed">
            Bouge les curseurs avec ta r&eacute;alit&eacute;. Le calcul se base sur 45&nbsp;minutes gagn&eacute;es par projet en moyenne.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
          className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-10 overflow-hidden"
        >
          {/* Glow */}
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(139,92,246,0.20) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {/* Inputs */}
            <div className="space-y-7">
              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <label htmlFor="hourlyRate" className="text-sm font-semibold text-white/80">
                    Ton tarif horaire
                  </label>
                  <span className="text-2xl font-black text-purple-300 tabular-nums">{hourlyRate}€/h</span>
                </div>
                <input
                  id="hourlyRate"
                  type="range"
                  min={15}
                  max={100}
                  step={5}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-xs text-white/35 mt-1 tabular-nums">
                  <span>15€</span>
                  <span>100€</span>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <label htmlFor="projects" className="text-sm font-semibold text-white/80">
                    Projets YouTube par mois
                  </label>
                  <span className="text-2xl font-black text-purple-300 tabular-nums">{projectsPerMonth}</span>
                </div>
                <input
                  id="projects"
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={projectsPerMonth}
                  onChange={(e) => setProjectsPerMonth(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-xs text-white/35 mt-1 tabular-nums">
                  <span>1</span>
                  <span>30</span>
                </div>
              </div>
            </div>

            {/* Output */}
            <div className="flex flex-col justify-center text-center md:text-left p-6 md:p-8 rounded-2xl border border-purple-400/25 bg-gradient-to-br from-purple-500/[0.08] to-violet-500/[0.04]">
              <p className="text-xs font-mono uppercase tracking-widest text-purple-300/70 mb-2 flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="w-3 h-3" />
                Tu &eacute;conomises par mois
              </p>
              <p className="text-4xl md:text-6xl font-black tracking-[-0.03em] text-white mb-3 tabular-nums">
                {formatEuro(monthlySavings)}
              </p>
              <p className="text-sm text-white/55 leading-relaxed">
                Soit{" "}
                <strong className="text-white">
                  {roiMultiplier}&times;
                </strong>{" "}
                le co&ucirc;t de TubeForge (8,03€/mois).
              </p>
              <p className="text-xs text-white/40 mt-3 leading-relaxed">
                Calcul : {projectsPerMonth}&nbsp;projet{projectsPerMonth > 1 ? "s" : ""} &times; 0,75&nbsp;h gagn&eacute;e &times; {hourlyRate}€/h
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
