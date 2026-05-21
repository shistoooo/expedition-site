"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { youtubers } from "@/lib/youtubers";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const testimonials = [
  {
    name: "Nahsir",
    role: "Monteur vidéo",
    text: "Depuis ma première utilisation de ClipForge, je ne me sers plus que de ça. C'est pratique, intuitif et ça permet de gagner un temps précieux sur tous mes montages.",
  },
  {
    name: "Astro",
    role: "Monteur vidéo",
    text: "Franchement bluffé par l'utilisation de TubeForge, ça a vraiment simplifié et accéléré le processus de téléchargement de vidéo YouTube. Bravo !",
  },
];

export default function DiscordPionnierTestimonials() {
  return (
    <section className="py-16 md:py-20 relative">
      <div className="container-main max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-center mb-12"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-purple-400/60 mb-4">
            Ce qu&apos;ils en disent
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-[-0.03em]">
            Les premiers Pionniers, en vrai.
          </h2>
        </motion.div>

        {/* Testimonial quotes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto mb-16 md:mb-20">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: easeOutExpo }}
              className="relative rounded-2xl px-6 py-7 flex flex-col"
              style={{
                background: "rgba(255,255,255,0.045)",
                border: "1px solid rgba(255,255,255,0.10)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              {/* Quote mark */}
              <span
                className="text-3xl leading-none select-none mb-3"
                style={{ color: "rgba(139,92,246,0.30)" }}
              >
                &ldquo;
              </span>

              <p className="text-[15px] leading-relaxed text-white/70 font-light flex-1 mb-5">
                {t.text}
              </p>

              <footer className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                <span className="text-sm font-semibold text-white/80">{t.name}</span>
                <span className="text-white/15">·</span>
                <span className="text-xs text-white/35">{t.role}</span>
              </footer>
            </motion.blockquote>
          ))}
        </div>

        {/* YouTuber avatar row — social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: easeOutExpo }}
          className="text-center"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-white/35 mb-6">
            Et eux aussi sont à bord
          </p>

          <div className="flex flex-wrap items-start justify-center gap-8 md:gap-12">
            {youtubers.map((y, i) => (
              <motion.a
                key={y.handle}
                href={y.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: 0.15 + i * 0.06,
                  ease: easeOutExpo,
                }}
                className="group flex flex-col items-center gap-3"
                aria-label={`Chaîne YouTube de @${y.handle}`}
              >
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-purple-400/60 transition-all duration-300 group-hover:-translate-y-1.5 shadow-xl shadow-black/30">
                  <div
                    className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle at center, rgba(139,92,246,0.55), transparent 70%)",
                      filter: "blur(14px)",
                    }}
                  />
                  <Image
                    src={y.avatar}
                    alt={`Avatar de la chaîne @${y.handle}`}
                    fill
                    sizes="(min-width: 768px) 112px, 96px"
                    className="object-cover relative"
                  />
                </div>
                <span className="text-xs md:text-sm text-white/50 group-hover:text-white/90 transition-colors font-mono tracking-tight">
                  @{y.handle}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
