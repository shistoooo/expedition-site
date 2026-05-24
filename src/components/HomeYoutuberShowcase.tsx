"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { youtubers } from "@/lib/youtubers";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Compact YouTuber avatar showcase for the homepage. Lives just under the
 * TestimonialsMarquee carousel — adds a tangible "you've heard of these
 * channels" social proof layer without disrupting the existing rotating quote.
 *
 * Source unique (src/lib/youtubers.ts), partagée avec les landings personas — retirer
 * un YouTubeur du fichier source se propage automatiquement à toutes les pages.
 */
export default function HomeYoutuberShowcase() {
  return (
    <section className="pt-2 pb-16 md:pt-4 md:pb-20 relative">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-center"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-white/35 mb-10">
            Déjà adopté par
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
                className="group flex flex-col items-center gap-4"
                aria-label={`Chaîne YouTube de @${y.handle}`}
              >
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-purple-400/60 transition-all duration-300 group-hover:-translate-y-1.5 shadow-xl shadow-black/30">
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
                    sizes="(min-width: 768px) 96px, 80px"
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
