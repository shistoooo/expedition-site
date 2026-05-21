"use client";

import { motion } from "framer-motion";
import DemoPlayer from "@/components/DemoPlayer";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Accent = "purple" | "cyan";

const accentStyles: Record<Accent, { label: string; gradient: string; glow: string; shadow: string }> = {
  purple: {
    label: "text-purple-300/70",
    gradient: "from-purple-300 to-cyan-300",
    glow: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(139,92,246,0.20) 0%, rgba(34,211,238,0.10) 40%, transparent 75%)",
    shadow: "0_20px_60px_-15px_rgba(139,92,246,0.35)",
  },
  cyan: {
    label: "text-cyan-300/70",
    gradient: "from-cyan-300 to-purple-300",
    glow: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(34,211,238,0.22) 0%, rgba(139,92,246,0.10) 40%, transparent 75%)",
    shadow: "0_20px_60px_-15px_rgba(34,211,238,0.35)",
  },
};

type LandingDemoSectionProps = {
  accent?: Accent;
  /** Override the title (defaults to a generic pitch) */
  title?: React.ReactNode;
};

export default function LandingDemoSection({ accent = "purple", title }: LandingDemoSectionProps) {
  const cls = accentStyles[accent];

  const defaultTitle = (
    <>
      Le plugin Premiere &amp; DaVinci, et{" "}
      <span className={`text-transparent bg-clip-text bg-gradient-to-r ${cls.gradient}`}>tout ce qu&apos;il y a derri&egrave;re.</span>
    </>
  );

  return (
    <section className="pt-12 md:pt-16 pb-16 md:pb-24 relative">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8 md:mb-10">
            <p className={`text-xs font-mono uppercase tracking-widest ${cls.label} mb-3 flex items-center justify-center gap-2`}>
              <span className="w-3 h-px bg-current opacity-50 inline-block" />
              Pr&eacute;sentation compl&egrave;te
              <span className="w-3 h-px bg-current opacity-50 inline-block" />
            </p>
            <h2 className="text-2xl md:text-4xl font-black tracking-[-0.02em] text-white/90 leading-tight">
              {title ?? defaultTitle}
            </h2>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-8 pointer-events-none opacity-70"
              style={{ background: cls.glow, filter: "blur(40px)" }}
            />

            <div
              className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40"
              style={{ boxShadow: cls.shadow.replaceAll("_", " ") }}
            >
              <div className="aspect-video w-full">
                <DemoPlayer />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
