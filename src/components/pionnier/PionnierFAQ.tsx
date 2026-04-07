"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { usePionnierUtm } from "./usePionnierUtm";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const faqs: { q: string; a: string }[] = [
  {
    q: "C'est quoi exactement Expédition ?",
    a: "Expédition est une suite de logiciels desktop pour créateurs YouTube. Vous installez le Launcher (Mac/Windows), et il gère tout : installation des outils, mises à jour automatiques, licence. Un seul abonnement, tous les outils — actuels et à venir.",
  },
  {
    q: "Que veut dire « tarif bloqué à vie » ?",
    a: "Le prix que vous payez aujourd'hui reste le même tant que votre abonnement est actif. Quand de nouveaux outils seront ajoutés et que le prix d'entrée augmentera pour les nouveaux abonnés, votre tarif Pionnier ne change pas. Vous êtes verrouillés au tarif d'aujourd'hui.",
  },
  {
    q: "Pourquoi un abonnement et pas une licence one-time comme 4K Video Downloader ?",
    a: "Parce que TubeForge n'est qu'un des outils de la suite Expédition. Pour le prix de votre abonnement Pionnier (8,03€/mois avec Discord), vous obtenez aussi ClipForge (clips auto IA) et ReviewForge (review sécurisé), plus tous les outils à venir, plus les mises à jour hebdomadaires. Et comme votre tarif est bloqué à vie, votre abonnement EST le one-time deal — sauf qu'il continue de grossir. Si ça ne vous convient pas : annulation 1 clic, sans frais.",
  },
  {
    q: "Comment fonctionne la réduction Discord ?",
    a: "Rejoignez le serveur Discord d'Expédition avant de vous abonner, et vous bénéficiez du tarif réduit à 8,03€/mois au lieu de 11,99€. Tant que vous gardez le rôle Discord actif, vous gardez le tarif réduit.",
  },
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui, en 1 clic depuis votre espace compte. Pas d'engagement, pas de frais cachés. Vous gardez l'accès jusqu'à la fin du mois payé.",
  },
  {
    q: "Sur quelles plateformes ça tourne ?",
    a: "Mac et Windows. Le Launcher gère tout automatiquement : installation, mises à jour, licence. Pas de configuration manuelle, pas de bricolage.",
  },
];

function FAQItem({ faq, index }: { faq: typeof faqs[number]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const measure = useCallback(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: easeOutExpo }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full cursor-pointer p-6 text-white/90 font-semibold text-sm md:text-base select-none text-left"
      >
        {faq.q}
        <span
          className="ml-4 text-white/30 text-xl leading-none shrink-0 transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ height: isOpen ? height : 0 }}
      >
        <div ref={contentRef} className="px-6 pb-6 text-white/55 text-sm leading-relaxed -mt-1">
          {faq.a}
        </div>
      </div>
    </motion.div>
  );
}

export default function PionnierFAQ() {
  const { fireViewEvent } = usePionnierUtm();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;
    let fired = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired) {
          fired = true;
          fireViewEvent("faq");
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [fireViewEvent]);

  const discordUrl =
    process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ||
    process.env.NEXT_PUBLIC_DISCORD_URL ||
    "https://discord.gg/expedition";

  return (
    <section ref={sectionRef} className="pt-12 pb-16 md:pt-16 md:pb-24 relative">
      <div className="container-main max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
          className="text-center mb-10"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-purple-400/60 mb-3">
            Avant de cliquer
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-[-0.03em]">
            Questions fréquentes
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>

        {/* Discord fallback */}
        <p className="text-center text-sm text-white/40 mt-10">
          Toujours une question ?{" "}
          <a
            href={discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-300 hover:text-purple-200 transition-colors font-semibold"
          >
            Demandez sur Discord →
          </a>
        </p>
      </div>
    </section>
  );
}
