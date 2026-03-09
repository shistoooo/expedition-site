"use client";

import { motion } from "framer-motion";

export default function DiscordSection() {
  return (
    <section id="discord" className="py-32 md:py-40 relative overflow-hidden">
      {/* Discord nebula — indigo ambient behind card */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(88,101,242,0.12) 0%, transparent 68%)',
          filter: 'blur(2px)',
        }}
      />
      <div className="container-main relative max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 md:p-12 lg:p-16 text-center relative overflow-hidden flex flex-col items-center shadow-[0_0_80px_rgba(88,101,242,0.12),0_20px_60px_rgba(0,0,0,0.4)]"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#5865F2]/5 to-transparent pointer-events-none" />

          {/* Discord logo — static, no spring animation */}
          <div className="w-20 h-20 mb-8 rounded-2xl bg-[#5865F2] flex items-center justify-center shadow-lg shadow-[#5865F2]/20 relative z-10 mx-auto">
            <svg
              className="w-10 h-10 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-center tracking-[-0.03em] leading-[1.05]">
            Rejoignez la communauté{" "}
            <span className="text-white">Exp&eacute;dition</span>
          </h2>

          {/* Specific, honest description — not "boost your productivity" */}
          <p className="text-lg md:text-xl text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed text-center">
            Signalement de bugs, votes de features, discussions entre créateurs.
            C&apos;est là que les prochaines mises à jour se décident.
          </p>

          {/* Inline stats — real, grounded, not 3 identical cards */}
          <p className="text-sm text-white/40 mb-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <span><span className="text-white font-semibold">200+ créateurs</span> déjà présents</span>
            <span className="hidden sm:inline text-white/15">·</span>
            <span><span className="text-purple-300 font-semibold">Le dev lit chaque message</span> — vraiment</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 mt-4">
            <a
              href={process.env.NEXT_PUBLIC_DISCORD_URL || "https://dsc.gg/expedition"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] transition-all duration-300 font-bold text-lg shadow-[0_4px_24px_rgba(88,101,242,0.35)] hover:shadow-[0_0_50px_rgba(88,101,242,0.55),0_8px_32px_rgba(0,0,0,0.4)] hover:scale-[1.04] active:scale-[0.98]"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Rejoindre le serveur
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
