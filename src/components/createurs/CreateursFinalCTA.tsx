"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Bell } from "lucide-react";
import { SALES_OPEN } from "@/lib/salesConfig";
import { useCreateursUtm } from "./useCreateursUtm";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function CreateursFinalCTA() {
  const { fireCtaEvent } = useCreateursUtm();
  const ctaHref = SALES_OPEN ? "/account?mode=register" : "/checkout";
  const ctaLabel = SALES_OPEN ? "Commencer 3 jours gratuits" : "Être prévenu au lancement";

  return (
    <>
      <section className="py-20 md:py-28 relative">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(34,211,238,0.14) 0%, rgba(56,189,248,0.07) 45%, transparent 72%)",
            filter: "blur(2px)",
          }}
        />

        <div className="container-main max-w-2xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] mb-4">
              Pr&ecirc;t &agrave; cr&eacute;er sans{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                friction&nbsp;?
              </span>
            </h2>
            <p className="text-base md:text-lg text-white/55 mb-10 leading-relaxed">
              60 secondes pour devenir Pionnier.{" "}
              <span className="text-white/80">Tarif bloqu&eacute; &agrave; vie tant que tu restes abonn&eacute;.</span>
            </p>

            <Link
              href={ctaHref}
              onClick={() => fireCtaEvent("final")}
              className="group inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-white text-black font-bold text-lg transition-all duration-200 border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_12px_40px_rgba(34,211,238,0.35)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_18px_60px_rgba(34,211,238,0.5)] hover:translate-y-[-2px] active:translate-y-[1px]"
            >
              {ctaLabel}
              {SALES_OPEN ? (
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
              ) : (
                <Bell className="w-5 h-5" />
              )}
            </Link>

            <p className="text-xs text-white/35 mt-5">
              Annulable 1 clic &middot; Sans engagement &middot; Tarif bloqu&eacute; &agrave; vie
            </p>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 border-t border-white/[0.06] relative">
        <div className="container-main max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p className="text-white/35 font-mono uppercase tracking-wider">
              EXP&Eacute;DITION &mdash; Construit avec passion depuis Paris
            </p>
            <div className="flex items-center gap-5">
              <Link
                href="/mentions-legales"
                className="text-white/35 hover:text-white/70 transition-colors"
              >
                Mentions l&eacute;gales
              </Link>
              <Link
                href="/cgv"
                className="text-white/35 hover:text-white/70 transition-colors"
              >
                CGV
              </Link>
              <Link
                href="/confidentialite"
                className="text-white/35 hover:text-white/70 transition-colors"
              >
                Confidentialit&eacute;
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
