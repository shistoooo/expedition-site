"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Accent = "purple" | "cyan";

const accentClasses: Record<Accent, { iconBg: string; iconBorder: string; icon: string; border: string; pillBorder: string }> = {
  purple: {
    iconBg: "bg-purple-500/10",
    iconBorder: "border-purple-500/25",
    icon: "text-purple-300",
    border: "border-purple-500/15",
    pillBorder: "border-purple-500/20",
  },
  cyan: {
    iconBg: "bg-cyan-500/10",
    iconBorder: "border-cyan-500/25",
    icon: "text-cyan-300",
    border: "border-cyan-500/15",
    pillBorder: "border-cyan-500/20",
  },
};

const platforms = [
  "YouTube",
  "TikTok",
  "Twitch",
  "Vimeo",
  "Instagram",
  "X",
  "SoundCloud",
];

type PlatformsBadgeProps = {
  accent?: Accent;
};

export default function PlatformsBadge({ accent = "purple" }: PlatformsBadgeProps) {
  const cls = accentClasses[accent];

  return (
    <section className="pt-8 md:pt-10 pb-2 relative">
      <div className="container-main max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className={`relative flex flex-col md:flex-row items-center gap-4 md:gap-6 rounded-2xl border ${cls.border} bg-white/[0.02] px-5 py-4 md:px-7 md:py-5`}
        >
          <div className={`shrink-0 w-11 h-11 rounded-xl ${cls.iconBg} border ${cls.iconBorder} flex items-center justify-center`}>
            <Globe className={`w-5 h-5 ${cls.icon}`} />
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="text-sm md:text-base font-semibold text-white leading-snug mb-1">
              T&eacute;l&eacute;charge des vid&eacute;os depuis{" "}
              <span className={cls.icon}>1&nbsp;000+ sites</span>
            </p>
            <p className="text-xs md:text-sm text-white/55 leading-relaxed">
              YouTube, TikTok, Twitch, Vimeo, Instagram, X, SoundCloud&hellip; et tout ce que yt-dlp supporte.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 flex-wrap justify-end max-w-[280px]">
            {platforms.map((p) => (
              <span
                key={p}
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono text-white/65 bg-white/[0.025] border ${cls.pillBorder}`}
              >
                {p}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
