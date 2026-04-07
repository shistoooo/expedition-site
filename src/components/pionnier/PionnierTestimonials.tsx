"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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

// Discord SVG icon (inline, matches the brand)
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
    </svg>
  );
}

export default function PionnierTestimonials() {
  const discordUrl =
    process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ||
    process.env.NEXT_PUBLIC_DISCORD_URL ||
    "https://discord.gg/expedition";

  return (
    <section className="py-16 md:py-20 relative">
      <div className="container-main max-w-6xl">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
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

          {/* Discord tile */}
          <motion.a
            href={discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16, ease: easeOutExpo }}
            className="group relative rounded-2xl px-6 py-7 flex flex-col items-center justify-center text-center transition-all duration-300 hover:translate-y-[-2px]"
            style={{
              background:
                "linear-gradient(160deg, rgba(88,101,242,0.10) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(88,101,242,0.25)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#5865f2]/15 border border-[#5865f2]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <DiscordIcon className="w-7 h-7 text-[#7785f8]" />
            </div>
            <p className="text-base font-bold text-white mb-2">
              Plus de retours sur Discord
            </p>
            <p className="text-xs text-white/45 leading-relaxed mb-4">
              Discutez avec les autres Pionniers, voyez les vrais retours, posez vos questions au dev.
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#7785f8] group-hover:text-[#a3afff] transition-colors">
              Rejoindre <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
