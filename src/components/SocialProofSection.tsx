"use client";

import { motion } from "framer-motion";

const creators = [
  {
    name: "Créateur 1",
    handle: "@createur1",
    quote: "Expedition m'a fait gagner un temps fou sur mes Shorts. ClipForge est devenu indispensable.",
    avatar: null, // URL de l'avatar
  },
  {
    name: "Créateur 2",
    handle: "@createur2",
    quote: "Enfin une suite d'outils pensée pour les créateurs, pas pour les entreprises. Et le prix est honnête.",
    avatar: null,
  },
  {
    name: "Créateur 3",
    handle: "@createur3",
    quote: "Le support sur Discord est incroyable. Tu sens que l'équipe est vraiment à l'écoute.",
    avatar: null,
  },
];

export default function SocialProofSection() {
  return (
    <section className="py-24 relative section-fade-top">
      <div className="container-main">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-white/30 uppercase tracking-widest font-medium mb-10"
        >
          Ils cr&eacute;ent avec Exp&eacute;dition
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {creators.map((creator, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/15 hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(139,92,246,0.08)]"
            >
              <p className="text-white/70 text-sm leading-relaxed mb-5">
                &quot;{creator.quote}&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/30 text-xs font-bold">
                  {creator.avatar ? (
                    <img src={creator.avatar} alt={creator.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    creator.name.charAt(0)
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-white/80">{creator.name}</div>
                  <div className="text-xs text-white/30">{creator.handle}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
