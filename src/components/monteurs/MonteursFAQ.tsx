"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useMonteursUtm } from "./useMonteursUtm";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const faqs = [
  {
    q: "Concrètement, combien de temps je gagne par projet ?",
    a: "Selon le volume de références, entre 15 minutes (vidéo courte avec 3-5 refs) et 1 heure (essai documentaire avec 20+ refs et découpes précises). À ton tarif horaire moyen, l'abonnement est rentabilisé dès le premier projet du mois.",
  },
  {
    q: "Compatible avec quelle version de Premiere ou DaVinci ?",
    a: "Adobe Premiere Pro CC 2023, 2024, 2025 (plugin natif via le panneau Extensions, compatible Adobe Media Encoder). DaVinci Resolve 18.x, 19.x, 20.x — Studio et Free, sans interférence avec Color, Fusion ou Fairlight. macOS Apple Silicon natif (M1/M2/M3/M4) + Intel. Windows 10/11 x64. ~80 Mo RAM en idle, GPU optionnel.",
  },
  {
    q: "Et si mon client m'envoie 30 refs dans un Google Doc ?",
    a: "Import du document dans TubeForge → auto-détection de tous les liens YouTube → téléchargement en parallèle. Le tout pendant que tu ouvres ton projet Premiere. Quand tu reviens, tout est prêt à être glissé dans la timeline.",
  },
  {
    q: "Mes données et projets clients sont-ils protégés ?",
    a: "Oui, 100% local. TubeForge tourne sur ta machine — tes téléchargements, ton historique et tes projets ne quittent jamais ton poste. Aucune donnée client transite par nos serveurs. Zéro tracking de contenu : on ne sait pas quelles vidéos tu télécharges ni pour qui.",
  },
  {
    q: "Quel est le tarif et pourquoi un abonnement ?",
    a: "8,03€/mois (annuel) ou 11,99€/mois (mensuel). L'abonnement inclut TubeForge et tous les outils à venir de la suite Expédition (ClipForge, ReviewForge, etc.). Le tarif est bloqué à vie tant que tu restes abonné — quand le catalogue grossit, ton prix ne bouge pas.",
  },
  {
    q: "Je peux essayer avant de payer ? Annulation facile ?",
    a: "Annulation 1 clic depuis ton espace compte, sans frais, sans question. Tu testes pendant ton premier mois sur tes projets réels — si TubeForge ne te fait pas gagner de temps facturable, tu annules.",
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

export default function MonteursFAQ() {
  const { fireViewEvent } = useMonteursUtm();
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
          <p className="text-xs font-mono uppercase tracking-widest text-purple-400/60 mb-3">
            Questions fr&eacute;quentes
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.05]">
            Tout ce que les{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-violet-200 to-purple-300">
              monteurs nous demandent.
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
