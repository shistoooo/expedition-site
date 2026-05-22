"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useCreateursUtm } from "./useCreateursUtm";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const faqs = [
  {
    q: "Concrètement, qu'est-ce que ça change quand je monte ?",
    a: "Tu arrêtes de jongler entre YouTube, ton navigateur, ton Finder et ton logiciel de montage. TubeForge gère tes téléchargements, ta recherche et l'import de tes vidéos directement dans Premiere ou DaVinci. Résultat : tu restes concentré sur ta vidéo au lieu d'éparpiller ton attention.",
  },
  {
    q: "Compatible avec quelle version de Premiere ou DaVinci ?",
    a: "Adobe Premiere Pro CC 2023, 2024, 2025 (plugin natif via le panneau Extensions). DaVinci Resolve 18.x, 19.x, 20.x — Studio et Free, sans interférence avec Color, Fusion ou Fairlight. macOS Apple Silicon natif (M1/M2/M3/M4) + Intel. Windows 10/11 x64. ~80 Mo RAM en idle, GPU optionnel.",
  },
  {
    q: "TubeForge marche sur quelles plateformes vidéo ?",
    a: "1 000+ sites. Les principaux pris en charge nativement avec UI dédiée : YouTube, TikTok, Instagram, Twitter/X, Twitch, Vimeo, SoundCloud. Au-delà, TubeForge délègue à yt-dlp qui supporte 1 800+ extracteurs (Reddit, Dailymotion, Facebook, Bilibili, Vimeo OTT, etc.). Si le site a une vidéo, on essaie de la télécharger.",
  },
  {
    q: "Je télécharge déjà avec 4K Video Downloader, pourquoi changer ?",
    a: "4K Video Downloader te donne le fichier. Tu dois quand même : sortir de l'app, l'ouvrir dans Premiere, glisser-déposer, ranger le fichier. TubeForge fait tout ça en une étape, depuis ton outil de montage. C'est pas la même chose qu'un download manager — c'est un plugin d'import.",
  },
  {
    q: "Mes vidéos et mes refs sont-elles privées ?",
    a: "Oui, 100% local. TubeForge tourne sur ta machine — tes téléchargements, ton historique et tes projets ne quittent jamais ton poste. Aucune donnée ne passe par nos serveurs. Zéro tracking de contenu : on ne sait pas ce que tu télécharges, ni ce que tu prépares.",
  },
  {
    q: "Quel est le tarif ?",
    a: "8,03€/mois (annuel) ou 11,99€/mois (mensuel). L'abonnement inclut TubeForge et tous les outils à venir de la suite Expédition (ClipForge pour les clips auto, ReviewForge pour les retours, etc.). Le tarif est bloqué à vie tant que tu restes abonné.",
  },
  {
    q: "C'est quoi les futurs outils inclus dans l'abonnement ?",
    a: "Au-delà de TubeForge, la suite Expédition couvre : ClipForge (clips auto IA pour Shorts/TikTok depuis tes rushs), ReviewForge (espace de retour pour partager ta vidéo avec un cercle restreint avant publi), et d'autres outils pensés pour les créateurs YouTube. Tout est inclus dans ton abonnement, ton prix ne bouge pas quand le catalogue grossit.",
  },
  {
    q: "Je peux essayer avant de payer ? Annulation facile ?",
    a: "Annulation 1 clic, sans frais, depuis ton espace compte. Si TubeForge ne te simplifie pas concrètement la vie sur 2-3 vidéos, tu annules. Pas de questions, pas de complications.",
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
