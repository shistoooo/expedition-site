"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Clock, Euro, TrendingUp, ChevronDown, Link2, Download, FolderInput, Trash2 } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

// 45 minutes saved per project on average
const MINUTES_SAVED_PER_PROJECT = 45;
const TUBEFORGE_PRICE_MONTHLY = 8.03;

export default function MonteursROICalculator() {
  const [hourlyRate, setHourlyRate] = useState(35);
  const [projectsPerMonth, setProjectsPerMonth] = useState(5);
  const [showDetails, setShowDetails] = useState(false);

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
            Calcule combien tu gagnes
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05]">
            Le temps gagn&eacute;,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-purple-300">
              c&apos;est de l&apos;argent.
            </span>
          </h2>
          <p className="text-base md:text-lg text-white/55 mt-4 max-w-2xl mx-auto leading-relaxed">
            Bouge les curseurs en fonction de ta r&eacute;alit&eacute;. On estime que TubeForge te fait gagner environ <strong className="text-white/85">45 minutes par montage</strong>.
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
                    Ce que tu factures de l&apos;heure
                  </label>
                  <span className="text-2xl font-black text-purple-300 tabular-nums">
                    {hourlyRate}€
                  </span>
                </div>
                <p className="text-xs text-white/45 mb-3 leading-relaxed">
                  Le prix que tu demandes &agrave; ton client pour une heure de montage
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
                    Montages que tu livres par mois
                  </label>
                  <span className="text-2xl font-black text-purple-300 tabular-nums">
                    {projectsPerMonth}
                  </span>
                </div>
                <p className="text-xs text-white/45 mb-3 leading-relaxed">
                  Le nombre de vid&eacute;os que tu rends &agrave; tes clients chaque mois
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

            {/* Result — toujours visible */}
            <div className="relative rounded-2xl border border-purple-400/30 bg-gradient-to-br from-purple-500/[0.12] to-violet-500/[0.05] p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 text-center md:text-left">
                <div className="flex flex-col items-center md:items-start">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-purple-300/70 mb-2">
                    <Clock className="w-3 h-3" />
                    Temps lib&eacute;r&eacute;
                  </div>
                  <p className="text-2xl md:text-3xl font-black text-white tabular-nums">
                    {formatHoursMinutes(totalHoursSaved)}
                    <span className="text-base text-white/45 font-bold">/mois</span>
                  </p>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-purple-300/70 mb-2">
                    <Euro className="w-3 h-3" />
                    Tu peux gagner
                  </div>
                  <p className="text-3xl md:text-4xl font-black text-white tabular-nums">
                    {formatEuro(monthlySavings)}
                    <span className="text-base text-white/45 font-bold">/mois</span>
                  </p>
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-purple-300/70 mb-2">
                    <TrendingUp className="w-3 h-3" />
                    Soit
                  </div>
                  <p className="text-2xl md:text-3xl font-black text-white tabular-nums">
                    {roiMultiplier}&times; le prix
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/[0.08] text-center md:text-left">
                <p className="text-sm md:text-base text-white/70 leading-relaxed">
                  TubeForge te co&ucirc;te <strong className="text-white">8,03€/mois</strong>. Avec le temps que tu gagnes, tu peux faire <strong className="text-purple-200">{formatEuro(monthlySavings)}/mois</strong> en plus en prenant un montage suppl&eacute;mentaire.
                </p>
              </div>
            </div>

            {/* Toggle "Voir comment on calcule" */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                aria-expanded={showDetails}
                className="inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-white/90 transition-colors group"
              >
                {showDetails ? "Masquer le détail du calcul" : "Voir comment on calcule"}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${showDetails ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {/* Détail caché par défaut */}
            <AnimatePresence initial={false}>
              {showDetails && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: easeOutExpo }}
                  className="overflow-hidden"
                >
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.015] p-5 md:p-7">
                    <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-5">
                      Voici comment on arrive au chiffre
                    </p>

                    <div className="space-y-5">
                      <div>
                        <p className="text-sm md:text-base text-white/75 leading-relaxed mb-3">
                          <strong className="text-white">1.</strong> Chaque vid&eacute;o que tu vas chercher en ligne te prend <strong className="text-white">environ 2 minutes</strong>. C&apos;est cette galère que TubeForge t&apos;enl&egrave;ve&nbsp;:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ml-5">
                          {[
                            { icon: Link2, label: "Ouvrir le lien YouTube, TikTok ou autre", time: "30 s" },
                            { icon: Download, label: "Le télécharger avec une autre app", time: "1 min" },
                            { icon: FolderInput, label: "Ranger le fichier dans le bon dossier", time: "20 s" },
                            { icon: Trash2, label: "Supprimer les fichiers inutiles après la livraison", time: "10 s" },
                          ].map((step, i) => (
                            <div
                              key={i}
                              className="flex flex-col gap-1.5 p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.015]"
                            >
                              <step.icon className="w-3.5 h-3.5 text-purple-300/70" />
                              <p className="text-[11px] text-white/55 leading-tight">{step.label}</p>
                              <p className="text-xs font-mono font-bold text-purple-200 tabular-nums">
                                {step.time}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <p className="text-sm md:text-base text-white/75 leading-relaxed">
                        <strong className="text-white">2.</strong> Sur un montage normal, tu vas chercher <strong className="text-white">15 &agrave; 20 vid&eacute;os</strong>. &Ccedil;a fait <strong className="text-white">environ 45 minutes</strong> de perdues juste pour t&eacute;l&eacute;charger.
                      </p>

                      <p className="text-sm md:text-base text-white/75 leading-relaxed">
                        <strong className="text-white">3.</strong> Avec <strong className="text-white">{projectsPerMonth}</strong> montage{projectsPerMonth > 1 ? "s" : ""} par mois, &ccedil;a fait <strong className="text-white">{formatHoursMinutes(totalHoursSaved)}</strong> de libre. Tu peux les utiliser pour prendre un montage en plus &agrave; <strong className="text-white">{hourlyRate}€/h</strong> &mdash; soit <strong className="text-white">{formatEuro(monthlySavings)}</strong> de plus dans ta poche chaque mois.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
