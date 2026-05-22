"use client";

import { motion } from "framer-motion";
import { Video, Wrench } from "lucide-react";
import DemoPlayer from "@/components/DemoPlayer";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Accent = "red" | "indigo" | "emerald";

const accentStyles: Record<
  Accent,
  { label: string; glow: string; shadow: string; placeholderBg: string; placeholderBorder: string; placeholderIconBg: string; placeholderIcon: string; placeholderText: string }
> = {
  red: {
    label: "text-red-300/70",
    glow:
      "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(239,68,68,0.20) 0%, rgba(249,115,22,0.08) 40%, transparent 75%)",
    shadow: "0 20px 60px -15px rgba(239,68,68,0.30)",
    placeholderBg: "from-red-500/[0.04] to-orange-500/[0.02]",
    placeholderBorder: "border-red-500/20",
    placeholderIconBg: "bg-red-500/10 border-red-500/25",
    placeholderIcon: "text-red-300",
    placeholderText: "text-red-200/80",
  },
  indigo: {
    label: "text-indigo-300/70",
    glow:
      "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(99,102,241,0.20) 0%, rgba(139,92,246,0.08) 40%, transparent 75%)",
    shadow: "0 20px 60px -15px rgba(99,102,241,0.30)",
    placeholderBg: "from-indigo-500/[0.04] to-violet-500/[0.02]",
    placeholderBorder: "border-indigo-500/20",
    placeholderIconBg: "bg-indigo-500/10 border-indigo-500/25",
    placeholderIcon: "text-indigo-300",
    placeholderText: "text-indigo-200/80",
  },
  emerald: {
    label: "text-emerald-300/70",
    glow:
      "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(16,185,129,0.20) 0%, rgba(34,211,238,0.08) 40%, transparent 75%)",
    shadow: "0 20px 60px -15px rgba(16,185,129,0.30)",
    placeholderBg: "from-emerald-500/[0.04] to-cyan-500/[0.02]",
    placeholderBorder: "border-emerald-500/20",
    placeholderIconBg: "bg-emerald-500/10 border-emerald-500/25",
    placeholderIcon: "text-emerald-300",
    placeholderText: "text-emerald-200/80",
  },
};

type ToolDemoVideoSlotProps = {
  /** YouTube video ID. If absent, displays a styled placeholder ("Vidéo bientôt disponible"). */
  videoId?: string;
  toolName: string;
  accent?: Accent;
  /** Override the placeholder caption */
  placeholderText?: string;
};

export default function ToolDemoVideoSlot({
  videoId,
  toolName,
  accent = "indigo",
  placeholderText,
}: ToolDemoVideoSlotProps) {
  const cls = accentStyles[accent];

  return (
    <section className="pt-2 pb-12 md:pb-16 relative">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-6 md:mb-8">
            <p
              className={`text-xs font-mono uppercase tracking-widest ${cls.label} flex items-center justify-center gap-2`}
            >
              <Video className="w-3 h-3" />
              {toolName} en vid&eacute;o
            </p>
          </div>

          <div className="relative">
            {/* Glow nebula behind the player */}
            <div
              className="absolute -inset-8 pointer-events-none opacity-60"
              style={{ background: cls.glow, filter: "blur(40px)" }}
              aria-hidden="true"
            />

            <div
              className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40"
              style={{ boxShadow: cls.shadow }}
            >
              <div className="aspect-video w-full">
                {videoId ? (
                  <DemoPlayer videoId={videoId} />
                ) : (
                  /* Placeholder while we shoot the demo */
                  <div
                    className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${cls.placeholderBg} border ${cls.placeholderBorder} relative overflow-hidden`}
                  >
                    {/* Subtle animated grid pattern in the background */}
                    <div
                      className="absolute inset-0 opacity-10 pointer-events-none"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                      }}
                      aria-hidden="true"
                    />

                    <motion.div
                      animate={{ scale: [1, 1.05, 1], opacity: [0.85, 1, 0.85] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl ${cls.placeholderIconBg} border flex items-center justify-center mb-5`}
                    >
                      <Wrench className={`w-7 h-7 md:w-8 md:h-8 ${cls.placeholderIcon}`} />
                    </motion.div>

                    <p className={`relative text-lg md:text-xl font-bold ${cls.placeholderText} mb-2 text-center px-6`}>
                      {placeholderText ?? `Vidéo démo ${toolName} bientôt disponible`}
                    </p>
                    <p className="relative text-sm text-white/45 max-w-sm text-center px-6">
                      On tourne d&egrave;s qu&apos;une version montrable est pr&ecirc;te. En attendant, le mockup interactif ci-dessus en donne un avant-go&ucirc;t.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
