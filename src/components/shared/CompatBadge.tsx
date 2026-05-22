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

      {/* Premiere Pro — carré arrondi violet sombre, "Pr" rose-violet (style Adobe) */}
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

      {/* DaVinci Resolve — cercle bleu Blackmagic avec dégradé radial (style Resolve) */}
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
            <radialGradient id="dv-grad" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#5DD2F5" />
              <stop offset="60%" stopColor="#1F8DD6" />
              <stop offset="100%" stopColor="#0F4D85" />
            </radialGradient>
          </defs>
          <circle cx="10" cy="10" r="9" fill="url(#dv-grad)" />
          <circle cx="10" cy="10" r="4.5" fill="none" stroke="#0A2F52" strokeWidth="1.3" />
          <circle cx="10" cy="10" r="1.6" fill="#0A2F52" />
        </svg>
        <span className="text-xs md:text-sm font-semibold text-white/85">DaVinci&nbsp;Resolve</span>
      </span>
    </motion.div>
  );
}
