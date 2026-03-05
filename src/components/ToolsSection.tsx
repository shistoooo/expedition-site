"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Video, Wand2, Scissors, Share2, ArrowRight, FileCheck, MonitorPlay } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

export default function ToolsSection() {
  return (
    <section id="clipforge" className="py-24 md:py-32 relative overflow-hidden">
      <div className="container-main">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20"
        >
          {/* Côté Texte */}
          <div className="flex-1 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Disponible Maintenant
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Clip<span className="gradient-text">Forge</span>
            </h2>
            <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed">
              Transformez vos longues vidéos (YouTube, Twitch)
              en formats courts (TikTok, Shorts) facilement.
            </p>

            <motion.ul
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6 mb-10"
            >
              {[
                {
                  icon: Wand2,
                  title: "Découpage Intelligent",
                  desc: "L'IA détecte les moments clés de vos vidéos.",
                },
                {
                  icon: Scissors,
                  title: "Recadrage Auto",
                  desc: "Passez du format 16:9 au 9:16 sans perdre le sujet.",
                },
                {
                  icon: Share2,
                  title: "Sous-titres & Export",
                  desc: "Sous-titres générés automatiquement et export 4K.",
                },
                {
                  icon: FileCheck,
                  title: "Correction de Sous-titres",
                  desc: "Importez vos .srt : l'IA corrige l'orthographe et le sens.",
                },
              ].map((item, i) => (
                <motion.li key={i} variants={itemVariants} className="flex gap-5">
                  <div className="mt-1 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <item.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">
                      {item.title}
                    </h3>
                    <p className="text-white/50">{item.desc}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>

            <a
              href="/pricing"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-300 shadow-lg shadow-white/10"
            >
              Obtenir ClipForge <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>

          {/* Côté Visuel / Mockup */}
          <div className="flex-1 w-full relative">
            <div className="absolute -inset-10 bg-purple-500/10 blur-3xl rounded-full opacity-50" />
            <div className="relative glass rounded-2xl border border-white/5 p-2 shadow-2xl">
              <div className="aspect-video bg-[#0a0a0a] rounded-xl overflow-hidden relative border border-white/5 flex items-center justify-center group">
                {/* Simulation d'interface */}
                <div className="absolute inset-0 flex">
                  {/* Sidebar */}
                  <div className="w-16 border-r border-white/10 flex flex-col items-center py-4 gap-4 bg-[#0f0f12]">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Video className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Scissors className="w-4 h-4 text-white/30" />
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Wand2 className="w-4 h-4 text-white/30" />
                    </div>
                  </div>
                  {/* Main Content — Source → Output preview */}
                  <div className="flex-1 p-4 relative h-full flex items-center justify-center gap-4">
                    {/* Source 16:9 */}
                    <div className="relative flex flex-col items-center gap-2">
                      <div className="w-28 h-16 md:w-36 md:h-20 bg-[#1a1a22] rounded-lg border border-white/10 flex items-center justify-center overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
                        <MonitorPlay className="w-8 h-8 text-white/20" />
                        <div className="absolute bottom-1 right-1 text-[9px] text-white/30 font-mono">16:9</div>
                      </div>
                      <span className="text-[10px] text-white/30 font-medium">Source</span>
                    </div>

                    {/* Arrow / Scissors */}
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30"
                    >
                      <Scissors className="w-5 h-5 text-white" />
                    </motion.div>

                    {/* Output 9:16 */}
                    <div className="relative flex flex-col items-center gap-2">
                      <div className="w-12 h-20 md:w-14 md:h-24 bg-[#1a1a22] rounded-lg border border-purple-500/20 flex items-center justify-center overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
                        <motion.div
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-purple-500/20 to-transparent flex items-center justify-center"
                        >
                          <div className="h-[3px] w-3/4 bg-white/20 rounded-full" />
                        </motion.div>
                        <Video className="w-5 h-5 text-purple-400/40" />
                        <div className="absolute bottom-1 right-1 text-[9px] text-white/30 font-mono">9:16</div>
                      </div>
                      <span className="text-[10px] text-white/30 font-medium">Short</span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="absolute bottom-4 left-20 right-4 h-12 bg-white/5 rounded-lg border border-white/5 flex items-center px-2 overflow-hidden">
                  <TimelineAnimation />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TimelineAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Playhead position synced with step
  const playheadPositions = ["10%", "50%", "85%"];

  return (
    <>
      {/* Segment Violet Gauche */}
      <motion.div
        animate={{
          borderTopRightRadius: step === 0 ? "0px" : "4px",
          borderBottomRightRadius: step === 0 ? "0px" : "4px",
          marginRight: step >= 1 ? "4px" : "0px",
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="h-8 w-1/2 shrink-0 bg-purple-500/20 border-y border-l border-purple-500/30 backdrop-blur-sm rounded-l-md relative"
        style={{ borderRight: step === 0 ? "none" : "1px solid rgba(168, 85, 247, 0.3)" }}
      >
        {/* Ligne de cut qui flash */}
        <motion.div
          animate={{ opacity: step === 1 ? [0, 1, 0] : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute right-0 top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-20"
        />
      </motion.div>

      {/* Segment Bleu (Insertion Ripple) */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: step === 2 ? "30%" : "0%",
          opacity: step === 2 ? 1 : 0,
          marginRight: step === 2 ? "4px" : "0px",
          marginLeft: step === 2 ? "4px" : "0px",
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="h-8 shrink-0 bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm rounded-md overflow-hidden"
      />

      {/* Segment Violet Droit */}
      <motion.div
        animate={{
          borderTopLeftRadius: step === 0 ? "0px" : "4px",
          borderBottomLeftRadius: step === 0 ? "0px" : "4px",
          marginLeft: step === 1 ? "4px" : "0px",
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="h-8 w-1/2 shrink-0 bg-purple-500/20 border-y border-r border-purple-500/30 backdrop-blur-sm rounded-r-md"
        style={{ borderLeft: step === 0 ? "none" : "1px solid rgba(168, 85, 247, 0.3)" }}
      />

      {/* Playhead — synced with step */}
      <motion.div
        animate={{ left: playheadPositions[step] }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 bottom-0 w-0.5 bg-white/50 z-10 pointer-events-none shadow-[0_0_10px_rgba(255,255,255,0.5)]"
      />
    </>
  );
}
