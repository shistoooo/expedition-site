"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageCircle, Play } from "lucide-react";
import DemoPlayer from "@/components/DemoPlayer";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.com/invite/QuV3bYDEYT";

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
  /** YouTube video ID — défaut = vidéo demo principale (7 min) */
  videoId?: string;
  /** Si true : 3 boutons CTA s'affichent sous la vidéo (Pionnier, démo complète, Discord) */
  showCtas?: boolean;
};

export default function LandingDemoSection({ accent = "purple", title, videoId, showCtas = false }: LandingDemoSectionProps) {
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
                <DemoPlayer videoId={videoId} />
              </div>
            </div>
          </div>

          {/* CTAs sous la vidéo — affichés uniquement si showCtas=true */}
          {showCtas && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.15, ease: easeOutExpo }}
              className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              {/* Primary : acheter / devenir Pionnier */}
              <Link
                href="/checkout"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-black font-bold text-sm border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_24px_rgba(139,92,246,0.25)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_12px_40px_rgba(139,92,246,0.4)] transition-all duration-200 hover:translate-y-[-1px] active:translate-y-[1px]"
              >
                Devenir Pionnier
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              {/* Secondary : démo complète */}
              <Link
                href="/demo"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 text-white/85 font-semibold text-sm border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-200"
              >
                <Play className="w-4 h-4" />
                Voir la d&eacute;mo compl&egrave;te
              </Link>

              {/* Tertiary : Discord pour questions */}
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#5865F2]/10 text-[#a5b4fc] font-semibold text-sm border border-[#5865F2]/25 hover:bg-[#5865F2]/20 hover:text-white hover:border-[#5865F2]/40 transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4" />
                Une question ? Discord
              </a>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
