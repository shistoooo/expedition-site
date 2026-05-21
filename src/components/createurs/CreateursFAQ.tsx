"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useCreateursUtm } from "./useCreateursUtm";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const faqs = [
  {
    q: "Concrètement, qu'est-ce que ça change pour mon workflow ?",
    a: "Tu arrêtes de jongler entre YouTube, ton navigateur, ton Finder et ton outil de montage. TubeForge intègre tes téléchargements, ta recherche et ton import de refs directement dans Premiere ou DaVinci. Résultat : tu restes dans ton focus créatif au lieu d'éparpiller ton attention.",
  },
  {
    q: "Le plugin marche avec Premiere ET DaVinci ?",
    a: "Oui. TubeForge expose un plugin compatible Adobe Premiere Pro et DaVinci Resolve Studio. Tu colles un lien YouTube depuis TubeForge, la vidéo s'importe dans ta timeline. Si tu passes d'un outil à l'autre selon les projets, ça suit.",
  },
  {
    q: "Je télécharge déjà avec 4K Video Downloader, pourquoi changer ?",
    a: "4K Video Downloader te donne le fichier. Tu dois quand même : sortir de l'app, l'ouvrir dans Premiere, glisser-déposer, ranger le fichier. TubeForge fait tout ça en une étape, depuis ton outil de montage. C'est pas la même chose qu'un download manager — c'est un plugin d'import.",
  },
  {
    q: "Quel est le tarif ?",
    a: "8,03€/mois (annuel) ou 11,99€/mois (mensuel). L'abonnement inclut TubeForge et tous les outils à venir de la suite Expédition (ClipForge pour les clips auto, ReviewForge pour les retours, etc.). Le tarif est bloqué à vie tant que tu restes abonné.",
  },
  {
    q: "Je peux essayer avant de payer ?",
    a: "Annulation 1 clic, sans frais, dès le premier mois. Si TubeForge ne fluidifie pas concrètement ton workflow sur 2-3 vidéos, tu annules. Pas de questions, pas de friction.",
  },
  {
    q: "Et mes refs / projets ?",
    a: "TubeForge tourne en local sur ta machine. Tes téléchargements, ton historique et tes projets ne quittent jamais ton poste. Aucune donnée ne passe par nos serveurs.",
  },
];

function FAQItem({ q, a, idx, onOpen }: { q: string; a: string; idx: number; onOpen: () => void }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (open && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [open]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) onOpen();
  };

  return (
    <div className="border-b border-white/[0.06] last:border-b-0">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="w-full text-left py-5 md:py-6 flex items-start gap-4 group"
      >
        <span className="text-xs font-mono text-white/30 mt-1 shrink-0">{String(idx + 1).padStart(2, "0")}</span>
        <span className="flex-1 font-semibold text-base md:text-lg text-white/85 group-hover:text-white transition-colors leading-snug">
          {q}
        </span>
        <span
          className={`shrink-0 mt-1 w-6 h-6 rounded-full border border-white/15 flex items-center justify-center text-white/60 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      <div
        style={{ height }}
        className="overflow-hidden transition-[height] duration-300 ease-out"
      >
        <div ref={contentRef} className="pb-5 md:pb-6 pl-10 pr-10 text-white/55 text-sm md:text-[15px] leading-relaxed">
          {a}
        </div>
      </div>
    </div>
  );
}

export default function CreateursFAQ() {
  const { fireViewEvent } = useCreateursUtm();
  const [hasFired, setHasFired] = useState(false);

  const onAnyOpen = useCallback(() => {
    if (hasFired) return;
    setHasFired(true);
    fireViewEvent("faq_open");
  }, [hasFired, fireViewEvent]);

  return (
    <section className="py-16 md:py-24 relative">
      <div className="container-main max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-center mb-10 md:mb-14"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-cyan-400/60 mb-3">
            Questions fr&eacute;quentes
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05]">
            Tout ce que les{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-cyan-300">
              cr&eacute;ateurs nous demandent.
            </span>
          </h2>
        </motion.div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] px-4 md:px-8">
          {faqs.map((f, i) => (
            <FAQItem key={i} idx={i} q={f.q} a={f.a} onOpen={onAnyOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}
