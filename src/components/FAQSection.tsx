"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "C\u2019est quoi Exp\u00e9dition exactement ?",
    a: "Exp\u00e9dition est une suite de logiciels desktop pour cr\u00e9ateurs YouTube. Vous installez le Launcher (Mac/Windows), et il g\u00e8re tout : installation des outils, mises \u00e0 jour automatiques, licence. Un seul abonnement, tous les outils.",
  },
  {
    q: "Puis-je annuler \u00e0 tout moment ?",
    a: "Oui, en 1 clic depuis votre espace compte. Pas d\u2019engagement, pas de frais cach\u00e9s. Vous gardez l\u2019acc\u00e8s jusqu\u2019\u00e0 la fin du mois pay\u00e9.",
  },
  {
    q: "Y a-t-il un essai gratuit ?",
    a: "Oui : 3 jours gratuits sur TubeForge, sans carte bancaire. Cr\u00e9e ton compte, lance l\u2019essai, et acc\u00e8de \u00e0 toutes les fonctions (4K, d\u00e9coupe, plugins Premiere & DaVinci) jusqu\u2019\u00e0 25 r\u00e9cup\u00e9rations par jour. Aucun pr\u00e9l\u00e8vement \u2014 tu t\u2019abonnes seulement si tu veux continuer.",
  },
  {
    q: "Que veut dire \u00ab\u00a0tarif bloqu\u00e9\u00a0\u00bb ?",
    a: "Le prix que vous payez aujourd\u2019hui reste le m\u00eame tant que votre abonnement est actif. M\u00eame quand de nouveaux outils seront ajout\u00e9s et que le prix d\u2019entr\u00e9e augmentera pour les nouveaux abonn\u00e9s, votre tarif ne change pas.",
  },
  {
    q: "C\u2019est l\u00e9gal de r\u00e9cup\u00e9rer des vid\u00e9os ?",
    a: "TubeForge est un outil multi-sources con\u00e7u pour r\u00e9cup\u00e9rer vos propres vid\u00e9os, du contenu libre de droits ou des r\u00e9f\u00e9rences pour votre montage. Aucun DRM n\u2019est contourn\u00e9. Vous restez responsable de l\u2019utilisation que vous faites des fichiers r\u00e9cup\u00e9r\u00e9s.",
  },
  {
    q: "Comment fonctionne la r\u00e9duction Discord ?",
    a: "Rejoignez le serveur Discord avant de vous abonner, et vous b\u00e9n\u00e9ficiez du tarif r\u00e9duit \u00e0 8,03\u20ac/mois au lieu de 11,99\u20ac.",
  },
  {
    q: "Les futurs outils seront-ils inclus ?",
    a: "Oui. Tous les outils actuels et futurs sont inclus dans votre abonnement Pionnier. Vous n\u2019aurez jamais \u00e0 payer de suppl\u00e9ment.",
  },
  {
    q: "Sur quelles plateformes fonctionnent les outils ?",
    a: "Mac et Windows. Le Launcher g\u00e8re tout automatiquement : installation, mises \u00e0 jour, licence.",
  },
  {
    q: "Qui d\u00e9veloppe Exp\u00e9dition ?",
    a: "Un d\u00e9veloppeur ind\u00e9pendant passionn\u00e9, accessible directement sur Discord. Changelog chaque semaine, roadmap publique, retours pris en compte en temps r\u00e9el.",
  },
];

export const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

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
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
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
        <div ref={contentRef} className="px-6 pb-6 text-white/50 text-sm leading-relaxed -mt-1">
          {faq.a}
        </div>
      </div>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="pt-12 pb-24 md:pt-16 md:pb-32 relative">
      <div className="container-main max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl md:text-4xl font-black mb-10 text-center tracking-[-0.03em]">
            Questions fr&eacute;quentes
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData),
          }}
        />
      </div>
    </section>
  );
}
