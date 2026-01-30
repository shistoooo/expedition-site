"use client";

import { useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { motion } from "framer-motion";
import { Coins, Users, Zap, Scale } from "lucide-react";
import ExpeditionCoin from "./ExpeditionCoin";

const features = [
  {
    icon: Coins,
    title: "Gagnez des XP",
    description: "Réalisez des services pour la communauté (miniature, montage, audit) et accumulez notre monnaie virtuelle."
  },
  {
    icon: Users,
    title: "Échangez vos Talents",
    description: "Utilisez vos XP pour payer des experts. Un monteur aide un stratège, un graphiste aide un copywriter."
  },
  {
    icon: Scale,
    title: "Équité Totale",
    description: "Une économie circulaire où votre temps et vos compétences sont les seules valeurs. Pas d'euros, juste du talent."
  }
];

export default function MoneySection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#111]">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-main relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-medium">
              <Zap className="w-4 h-4" />
              Nouveau Concept
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              L&apos;Économie <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">Expedition</span>
            </h2>

            <div className="space-y-6 text-lg text-white/70 leading-relaxed">
              <p>
                Nous résolvons le problème de l&apos;œuf et de la poule pour les créateurs.
                Comment obtenir des services de qualité sans budget ?
              </p>
              <p className="font-medium text-white">
                La réponse est simple : votre temps a de la valeur.
              </p>
              <p>
                Expedition introduit une monnaie virtuelle interne. Vous êtes excellent en montage mais nul en miniatures ?
                Montez une vidéo pour un membre, gagnez des XP, et utilisez-les pour payer un graphiste de talent.
                C&apos;est un système de troc modernisé, fluide et équitable.
              </p>
            </div>

            <div className="grid gap-6 mt-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-yellow-500/30 hover:bg-white/10 transition-colors"
                >
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-white/60">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 3D Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="h-[500px] w-full relative"
          >
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
              <Suspense fallback={null}>
                <Environment preset="city" />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffd700" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff8c00" />

                <ExpeditionCoin />

                <ContactShadows
                  position={[0, -2, 0]}
                  opacity={0.4}
                  scale={10}
                  blur={2.5}
                  far={4}
                />
              </Suspense>
            </Canvas>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
