"use client";

import { motion } from "framer-motion";

export default function PhilosophySection() {
  return (
    <section className="py-32 md:py-40 relative section-fade-top">
      <div className="container-main relative">
        <div className="flex flex-col lg:flex-row items-start gap-8 md:gap-12 lg:gap-20">

          {/* Left: manifesto text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-8 flex items-center gap-2">
              <span className="w-3 h-px bg-white/20 inline-block" />
              Notre Manifeste
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-[1.0] tracking-[-0.03em]">
              L&apos;alternative <br />
              <span className="text-white">Accessible &amp; Honn&ecirc;te</span>
            </h2>

            <div className="space-y-6 text-lg text-white/60 leading-relaxed">
              <p>
                Soyons transparents : nous ne réinventons pas la roue. Les outils que nous développons existent souvent ailleurs, parfois en version plus avancée ou plus polie.
              </p>
              <p>
                <strong className="text-white">Mais notre mission est différente.</strong> Là où d&apos;autres facturent des abonnements prohibitifs pour chaque outil, nous choisissons l&apos;accessibilité radicale.
              </p>
              <p>
                Rejoindre Expédition, c&apos;est accepter de grandir avec nous. Nos produits évoluent chaque semaine grâce à vos retours. En échange de votre tolérance et de votre soutien, nous nous engageons à maintenir un tarif imbattable.
              </p>
            </div>
          </motion.div>

          {/* Right: pull quotes — three convictions stated plainly */}
          <div className="flex-1 w-full flex flex-col gap-0 divide-y divide-white/[0.06]">
            {[
              {
                label: "01",
                quote: "Pourquoi payer 10x le prix pour les mêmes fonctionnalités ?",
                note: "Prix juste — pas de forfait «Pro» à 30€ par outil.",
                delay: 0.2,
              },
              {
                label: "02",
                quote: "Vos retours sur Discord façonnent directement les mises à jour suivantes.",
                note: "Co-construction — pas une feuille de route gravée dans le marbre.",
                delay: 0.3,
              },
              {
                label: "03",
                quote: "Pas de promesses intenables. Nous sommes une petite équipe qui construit, jour après jour.",
                note: "Transparence — vous savez toujours où nous en sommes.",
                delay: 0.4,
              },
            ].map(({ label, quote, note, delay }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay, duration: 0.5 }}
                className="py-8 first:pt-0 last:pb-0"
              >
                <span className="text-xs font-mono font-bold text-purple-400/50 tracking-[0.15em] uppercase mb-4 block">{label}</span>
                <p className="text-2xl md:text-3xl font-semibold text-white leading-snug mb-3">&ldquo;{quote}&rdquo;</p>
                <p className="text-sm text-white/35 font-mono tracking-wide">{note}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
