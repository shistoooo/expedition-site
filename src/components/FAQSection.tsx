"use client";

import { motion } from "framer-motion";

const faqs = [
  {
    q: "Puis-je annuler \u00e0 tout moment ?",
    a: "Oui, sans engagement. Vous pouvez annuler votre abonnement \u00e0 tout moment depuis votre espace compte. Vous gardez l\u2019acc\u00e8s jusqu\u2019\u00e0 la fin de la p\u00e9riode pay\u00e9e.",
  },
  {
    q: "Que veut dire \u00ab\u00a0tarif bloqu\u00e9\u00a0\u00bb ?",
    a: "Le prix que vous payez aujourd\u2019hui reste le m\u00eame tant que votre abonnement est actif. M\u00eame quand de nouveaux outils seront ajout\u00e9s et que le prix d\u2019entr\u00e9e augmentera pour les nouveaux abonn\u00e9s, votre tarif ne change pas.",
  },
  {
    q: "Comment fonctionne la r\u00e9duction Discord ?",
    a: "Si vous \u00eates membre de notre serveur Discord avant de vous abonner, vous b\u00e9n\u00e9ficiez du tarif r\u00e9duit \u00e0 7,99\u20ac/mois au lieu de 11,99\u20ac. Rejoignez le Discord d\u2019abord, puis abonnez-vous.",
  },
  {
    q: "Sur quelles plateformes fonctionnent les outils ?",
    a: "Le Launcher et tous les outils (TubeForge, ClipForge, ReviewForge) fonctionnent sur Mac et Windows. Aucune installation suppl\u00e9mentaire n\u2019est n\u00e9cessaire.",
  },
  {
    q: "Les futurs outils seront-ils inclus ?",
    a: "Oui. Tous les outils actuels et futurs sont inclus dans votre abonnement Pionnier. Vous n\u2019aurez jamais \u00e0 payer de suppl\u00e9ment.",
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

export default function FAQSection() {
  return (
    <section id="faq" className="py-24 md:py-32 relative">
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

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <summary className="flex items-center justify-between cursor-pointer p-6 text-white/90 font-semibold text-sm md:text-base select-none list-none [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span className="ml-4 text-white/30 transition-transform duration-300 group-open:rotate-45 text-xl leading-none shrink-0">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6 text-white/50 text-sm leading-relaxed -mt-1">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </motion.div>

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
