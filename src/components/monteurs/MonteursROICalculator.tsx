"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, Clock, Euro, TrendingUp, Link2, Download, FolderInput, Trash2 } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

// 45 minutes saved per project on average
const MINUTES_SAVED_PER_PROJECT = 45;
const TUBEFORGE_PRICE_MONTHLY = 8.03;

export default function MonteursROICalculator() {
  const [hourlyRate, setHourlyRate] = useState(35);
  const [projectsPerMonth, setProjectsPerMonth] = useState(5);

  // Calcul step by step
  const totalMinutesSaved = MINUTES_SAVED_PER_PROJECT * projectsPerMonth;
  const totalHoursSaved = totalMinutesSaved / 60;
  const monthlySavings = useMemo(
    () => hourlyRate * totalHoursSaved,
    [hourlyRate, totalHoursSaved]
  );
  const roiMultiplier = useMemo(
    () => Math.max(1, Math.round((monthlySavings / TUBEFORGE_PRICE_MONTHLY) * 10) / 10),
    [monthlySavings]
  );

  const formatEuro = (value: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

  const formatHoursMinutes = (decimalHours: number): string => {
    const totalMinutes = Math.round(decimalHours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h}h`;
    return `${h}h${m.toString().padStart(2, "0")}`;
  };

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
            Calcule ce que tu y gagnes
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05]">
            Le temps gagn&eacute;,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-purple-300">
              tu le factures.
            </span>
          </h2>
          <p className="text-base md:text-lg text-white/55 mt-4 max-w-2xl mx-auto leading-relaxed">
            Chaque minute &eacute;conomis&eacute;e sur la gestion de tes r&eacute;f&eacute;rences, c&apos;est une minute que tu peux facturer ailleurs. Bouge les curseurs ci-dessous avec ta r&eacute;alit&eacute; pour voir le calcul.
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

          <div className="relative space-y-8">
            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <label htmlFor="hourlyRate" className="text-sm font-semibold text-white/85">
                    Ton tarif horaire
                  </label>
                  <span className="text-2xl font-black text-purple-300 tabular-nums">
                    {hourlyRate}€
                  </span>
                </div>
                <p className="text-xs text-white/45 mb-3 leading-relaxed">
                  Combien tu factures de l&apos;heure &agrave; tes clients
                </p>
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
                <div className="flex items-baseline justify-between mb-2">
                  <label htmlFor="projects" className="text-sm font-semibold text-white/85">
                    Projets YouTube par mois
                  </label>
                  <span className="text-2xl font-black text-purple-300 tabular-nums">
                    {projectsPerMonth}
                  </span>
                </div>
                <p className="text-xs text-white/45 mb-3 leading-relaxed">
                  Le nombre de montages que tu livres chaque mois
                </p>
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

            {/* Step-by-step calculation */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.015] p-5 md:p-7">
              <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-5">
                Voici le raisonnement
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-300 text-xs font-bold">
                    1
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm md:text-base text-white/70 leading-relaxed mb-3">
                      Sur chaque vid&eacute;o en ligne que tu g&egrave;res aujourd&apos;hui sans TubeForge,
                      tu perds environ <strong className="text-white">2 minutes</strong> :
                    </p>

                    {/* Decomposition table — pourquoi 2 min/ref */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                      {[
                        { icon: Link2, label: "Ouvrir le lien (YouTube, TikTok, Twitch...)", time: "30 s" },
                        { icon: Download, label: "Télécharger via 4K Video Downloader ou équivalent", time: "1 min" },
                        { icon: FolderInput, label: "Ranger le fichier dans le projet Premiere", time: "20 s" },
                        { icon: Trash2, label: "Supprimer les rushs inutiles après livraison", time: "10 s" },
                      ].map((step, i) => (
                        <div
                          key={i}
                          className="flex flex-col gap-1.5 p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.015]"
                        >
                          <step.icon className="w-3.5 h-3.5 text-purple-300/70" />
                          <p className="text-[11px] text-white/55 leading-tight">{step.label}</p>
                          <p className="text-xs font-mono font-bold text-purple-200 tabular-nums">{step.time}</p>
                        </div>
                      ))}
                    </div>

                    <p className="text-sm md:text-base text-white/70 leading-relaxed">
                      Sur un projet typique (<strong className="text-white">15 &agrave; 20 r&eacute;f&eacute;rences vid&eacute;o</strong>),
                      tu r&eacute;cup&egrave;res donc <strong className="text-white">~45 minutes</strong>{" "}
                      <span className="text-white/45">(de 15 min sur une vid&eacute;o courte &agrave; 1 h+ sur un essai documentaire).</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-300 text-xs font-bold">
                    2
                  </div>
                  <p className="text-sm md:text-base text-white/70 leading-relaxed pt-0.5">
                    <strong className="text-white">{projectsPerMonth}</strong> projet{projectsPerMonth > 1 ? "s" : ""} &times; <strong className="text-white">45 min</strong> ={" "}
                    <strong className="text-white">{formatHoursMinutes(totalHoursSaved)}</strong> r&eacute;cup&eacute;r&eacute;{totalHoursSaved > 1 ? "es" : "e"} chaque mois.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-300 text-xs font-bold">
                    3
                  </div>
                  <p className="text-sm md:text-base text-white/70 leading-relaxed pt-0.5">
                    <strong className="text-white">{formatHoursMinutes(totalHoursSaved)}</strong> &times; <strong className="text-white">{hourlyRate}€/h</strong> ={" "}
                    <strong className="text-white">{formatEuro(monthlySavings)}</strong> que tu peux re-facturer chaque mois.
                  </p>
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="relative rounded-2xl border border-purple-400/30 bg-gradient-to-br from-purple-500/[0.12] to-violet-500/[0.05] p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 text-center md:text-left">
                <div className="flex flex-col items-center md:items-start">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-purple-300/70 mb-2">
                    <Clock className="w-3 h-3" />
                    Temps gagn&eacute;
                  </div>
                  <p className="text-2xl md:text-3xl font-black text-white tabular-nums">
                    {formatHoursMinutes(totalHoursSaved)}<span className="text-base text-white/45 font-bold">/mois</span>
                  </p>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-purple-300/70 mb-2">
                    <Euro className="w-3 h-3" />
                    &Eacute;conomis&eacute;
                  </div>
                  <p className="text-3xl md:text-4xl font-black text-white tabular-nums">
                    {formatEuro(monthlySavings)}<span className="text-base text-white/45 font-bold">/mois</span>
                  </p>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-purple-300/70 mb-2">
                    <TrendingUp className="w-3 h-3" />
                    Retour vs co&ucirc;t
                  </div>
                  <p className="text-2xl md:text-3xl font-black text-white tabular-nums">
                    &times;{roiMultiplier}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/[0.08] text-center md:text-left">
                <p className="text-sm md:text-base text-white/70 leading-relaxed">
                  TubeForge co&ucirc;te <strong className="text-white">8,03€/mois</strong>. Tu &eacute;conomises{" "}
                  <strong className="text-white">{formatEuro(monthlySavings)}/mois</strong>.{" "}
                  <span className="text-white/55">
                    Pour chaque euro pay&eacute;, tu r&eacute;cup&egrave;res <strong className="text-purple-200">{roiMultiplier}€</strong> de temps facturable.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
