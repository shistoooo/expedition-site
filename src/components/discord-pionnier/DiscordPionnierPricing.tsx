"use client";

import { motion } from "framer-motion";
import { Check, Star, Rocket, Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { SALES_OPEN } from "@/lib/salesConfig";
import NumberTicker from "@/components/NumberTicker";
import { useDiscordPionnierUtm } from "./useDiscordPionnierUtm";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const features = [
  "Expedition Launcher (Mac/Windows)",
  "TubeForge Pro — 4K, sans pub (Vague 1)",
  "ClipForge — Clips auto + sélection illimitée (Vague 2)",
  "ReviewForge — Review sécurisé (Vague 3)",
  "Badge Discord Exclusif « Pionnier »",
  "Tarif bloqué tant que vous restez abonné",
];

export default function DiscordPionnierPricing() {
  const { getDiscordOAuthUrl, getCheckoutUrl, fireCtaEvent, fireViewEvent } = useDiscordPionnierUtm();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fire view event when pricing card enters viewport
  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;
    let fired = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired) {
          fired = true;
          fireViewEvent("pricing");
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [fireViewEvent]);

  const ctaHref = SALES_OPEN ? getDiscordOAuthUrl() : "/checkout";
  const ctaLabel = SALES_OPEN ? "Devenir Pionnier" : "Être prévenu";

  return (
    <section
      id="discord-pionnier-pricing"
      ref={sectionRef}
      className="pt-16 pb-16 md:pt-24 md:pb-24 relative"
    >
      {/* Pricing nebula */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(139,92,246,0.16) 0%, rgba(99,60,200,0.08) 45%, transparent 72%)",
          filter: "blur(2px)",
        }}
      />

      <div className="container-main max-w-3xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-center mb-12"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-purple-400/70 mb-4">
            Tarif Pionnier — Bloqué à vie
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-[-0.03em] mb-4">
            Un seul prix. Trois outils.{" "}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-purple-300">
              Pour toujours.
            </span>
          </h2>
          <p className="text-base text-white/50 max-w-xl mx-auto leading-relaxed">
            Tarif Pionnier bloqué tant que vous restez abonné. Quand de nouveaux outils sortent, le prix d&apos;entrée augmente —{" "}
            <span className="text-white/80 font-semibold">le vôtre, jamais.</span>
          </p>
        </motion.div>

        {/* Featured card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
          className="max-w-md mx-auto"
        >
          <div
            className="relative rounded-2xl overflow-hidden flex flex-col"
            style={{
              background:
                "linear-gradient(160deg, rgba(139,92,246,0.14) 0%, rgba(13,13,22,0.98) 45%)",
              border: "1px solid rgba(139,92,246,0.38)",
              boxShadow:
                "0 0 70px rgba(139,92,246,0.22), 0 20px 50px rgba(0,0,0,0.45)",
            }}
          >
            {/* Top gradient */}
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(139,92,246,0.2) 0%, transparent 100%)",
              }}
            />

            {/* Badge */}
            <div className="flex justify-center pt-5 relative">
              <div
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                  boxShadow: "0 0 16px rgba(139,92,246,0.5)",
                  color: "#fff",
                }}
              >
                <Star className="w-3.5 h-3.5" />
                Meilleure offre
              </div>
            </div>

            <div className="relative p-6 md:p-8 flex flex-col items-center text-center">
              {/* Plan name */}
              <h3 className="font-bold text-lg text-white mb-6">Mensuel + Discord</h3>

              {/* Price */}
              <div className="mb-2">
                <div className="flex items-baseline justify-center gap-1">
                  <NumberTicker
                    value="8,03"
                    suffix="€"
                    className="font-black tracking-tight text-6xl text-white"
                  />
                  <span className="text-base ml-1 text-white/40">/mois</span>
                </div>
              </div>

              {/* Sub-price line */}
              <p className="text-sm text-white/40 mb-1">au lieu de 11,99€/mois</p>

              {/* Note */}
              <p className="text-sm text-green-400 font-semibold mb-8">
                Avec le rôle Discord actif
              </p>

              {/* Features */}
              <ul className="w-full space-y-3 mb-8 text-left">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                    <Check className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={ctaHref}
                onClick={() => fireCtaEvent("pricing")}
                className="group/btn w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)",
                  color: "#fff",
                  boxShadow:
                    "0 0 28px rgba(139,92,246,0.5), 0 0 70px rgba(139,92,246,0.18), inset 0 1px 0 rgba(255,255,255,0.18)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 100%)",
                  }}
                />
                <span className="relative z-10 inline-flex items-center gap-2">
                  {ctaLabel}
                  {SALES_OPEN ? (
                    <Rocket className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </span>
              </Link>

              <p className="text-xs text-white/35 mt-3">
                Annulable 1 clic · Sans engagement
              </p>
            </div>
          </div>

          {/* Alt links */}
          <div className="mt-8 flex flex-col items-center gap-2 text-sm">
            <Link
              href={getCheckoutUrl("yearly")}
              onClick={() => fireCtaEvent("pricing")}
              className="text-white/45 hover:text-white/80 transition-colors"
            >
              Préférez l&apos;annuel ?{" "}
              <span className="text-white/70 font-semibold">99,99€/an</span> (4 mois offerts) →
            </Link>
            <Link
              href={getCheckoutUrl("monthly")}
              onClick={() => fireCtaEvent("pricing")}
              className="text-white/45 hover:text-white/80 transition-colors"
            >
              Sans Discord :{" "}
              <span className="text-white/70 font-semibold">11,99€/mois</span> →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
