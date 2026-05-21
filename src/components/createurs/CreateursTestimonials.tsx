"use client";

import { motion } from "framer-motion";

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

export default function CreateursTestimonials() {
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
          <p className="text-xs font-mono uppercase tracking-widest text-cyan-400/60 mb-4">
            Ce qu&apos;ils en disent
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-[-0.03em]">
            Les cr&eacute;ateurs qui l&apos;utilisent d&eacute;j&agrave;.
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
      </div>
    </section>
  );
}
