"use client";

import { motion } from "framer-motion";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

type CompatBadgeProps = {
  delay?: number;
};

export default function CompatBadge({ delay = 0 }: CompatBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: easeOutExpo }}
      className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-sm"
    >
      <span className="text-[10px] font-mono uppercase tracking-widest text-white/45">
        Compatible
      </span>

      <span className="h-4 w-px bg-white/15" aria-hidden="true" />

      {/* Premiere Pro — carré violet sombre, "Pr" rose-violet (style Adobe) */}
      <span className="inline-flex items-center gap-1.5">
        <span
          className="inline-flex items-center justify-center w-5 h-5 rounded-[5px] text-[10px] font-black"
          style={{
            background: "#2A0634",
            color: "#EA77FF",
          }}
          aria-hidden="true"
        >
          Pr
        </span>
        <span className="text-xs md:text-sm font-semibold text-white/85">Premiere&nbsp;Pro</span>
      </span>

      <span className="text-white/25 text-xs">&middot;</span>

      {/* DaVinci Resolve — carré sombre + 3 gouttes (bleu, jaune-vert, rouge) en triangle */}
      <span className="inline-flex items-center gap-1.5">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="dv-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a2840" />
              <stop offset="100%" stopColor="#0e1827" />
            </linearGradient>
            <radialGradient id="dv-blue" cx="50%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#9be8ff" />
              <stop offset="100%" stopColor="#1f80c8" />
            </radialGradient>
            <radialGradient id="dv-green" cx="50%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#eaf36e" />
              <stop offset="100%" stopColor="#7ea63a" />
            </radialGradient>
            <radialGradient id="dv-red" cx="50%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#ffa3b8" />
              <stop offset="100%" stopColor="#d22e48" />
            </radialGradient>
          </defs>

          {/* Rounded-square background */}
          <rect
            x="0.5"
            y="0.5"
            width="19"
            height="19"
            rx="4.5"
            fill="url(#dv-bg)"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="0.5"
          />

          {/* Top blue droplet */}
          <ellipse cx="10" cy="6.3" rx="2.1" ry="2.7" fill="url(#dv-blue)" />
          {/* Bottom-left yellow-green droplet */}
          <ellipse
            cx="6.8"
            cy="13"
            rx="2.1"
            ry="2.7"
            transform="rotate(-40 6.8 13)"
            fill="url(#dv-green)"
          />
          {/* Bottom-right red droplet */}
          <ellipse
            cx="13.2"
            cy="13"
            rx="2.1"
            ry="2.7"
            transform="rotate(40 13.2 13)"
            fill="url(#dv-red)"
          />
        </svg>
        <span className="text-xs md:text-sm font-semibold text-white/85">DaVinci&nbsp;Resolve</span>
      </span>
    </motion.div>
  );
}
