"use client";

import { motion } from "framer-motion";
import { HeartHandshake, Scale, Users, Gem } from "lucide-react";

export default function PhilosophySection() {
  return (
    <section className="py-24 relative">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-50" />

      <div className="container-main relative">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm font-medium mb-8">
              <Gem className="w-4 h-4 text-purple-400" />
              <span>Notre Manifeste</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              L'alternative <br/>
              <span className="gradient-text">Accessible & Honnête</span>
            </h2>

            <div className="space-y-6 text-lg text-white/60 leading-relaxed">
              <p>
                Soyons transparents : nous ne réinventons pas la roue. Les outils que nous développons existent souvent ailleurs, parfois en version plus avancée ou plus polie.
              </p>
              <p>
                <strong className="text-white">Mais notre mission est différente.</strong> Là où d'autres facturent des abonnements prohibitifs pour chaque outil, nous choisissons l'accessibilité radicale.
              </p>
              <p>
                Rejoindre Expédition, c'est accepter de grandir avec nous. Nos produits évoluent chaque semaine grâce à vos retours. En échange de votre tolérance et de votre soutien, nous nous engageons à maintenir un tarif imbattable.
              </p>
            </div>
          </motion.div>

          {/* Cards / Visuals */}
          <div className="flex-1 w-full grid gap-6 sm:grid-cols-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
            >
              <Scale className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Prix Juste</h3>
              <p className="text-white/50 text-sm">
                Pourquoi payer 10x plus cher ? Nous rendons la technologie abordable pour tous les créateurs, petits ou grands.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass p-6 rounded-2xl border border-white/5 bg-white/[0.02] sm:translate-y-8"
            >
              <Users className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Co-Construction</h3>
              <p className="text-white/50 text-sm">
                Nous sommes à l'écoute. Vos retours sur Discord façonnent directement les prochaines mises à jour.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="glass p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
            >
              <HeartHandshake className="w-8 h-8 text-pink-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Transparence</h3>
              <p className="text-white/50 text-sm">
                Pas de promesses intenables. Nous sommes une petite équipe passionnée qui construit des outils utiles, jour après jour.
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
