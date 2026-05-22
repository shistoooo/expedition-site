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

      {/* Premiere Pro */}
      <span className="inline-flex items-center gap-1.5">
        <span
          className="inline-flex items-center justify-center w-5 h-5 rounded-[4px] text-[10px] font-black tabular-nums"
          style={{
            background: "linear-gradient(135deg, #2A0634 0%, #4D1A6E 100%)",
            color: "#EA77FF",
            border: "1px solid rgba(234,119,255,0.35)",
          }}
          aria-hidden="true"
        >
          Pr
        </span>
        <span className="text-xs md:text-sm font-semibold text-white/85">Premiere&nbsp;Pro</span>
      </span>

      <span className="text-white/25 text-xs">&middot;</span>

      {/* DaVinci Resolve */}
      <span className="inline-flex items-center gap-1.5">
        <span
          className="inline-flex items-center justify-center w-5 h-5 rounded-[4px] text-[10px] font-black tabular-nums"
          style={{
            background: "linear-gradient(135deg, #0B1929 0%, #1A3550 100%)",
            color: "#3FB7E8",
            border: "1px solid rgba(63,183,232,0.4)",
          }}
          aria-hidden="true"
        >
          DV
        </span>
        <span className="text-xs md:text-sm font-semibold text-white/85">DaVinci&nbsp;Resolve</span>
      </span>
    </motion.div>
  );
}
