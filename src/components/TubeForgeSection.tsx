"use client";

import { motion } from "framer-motion";
import { Layers, Globe, Scissors, Zap, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import TubeForgeAppMockup from "@/components/mockups/TubeForgeAppMockup";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

export default function TubeForgeSection() {
  return (
    <section id="tubeforge" className="pt-32 md:pt-40 pb-12 md:pb-16 relative section-fade-top bg-[#06051a]/80">
      <div className="container-main">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20"
        >
          {/* Text */}
          <div className="flex-1 text-left">
            <p className="text-xs font-mono uppercase tracking-widest text-red-400/60 mb-6 flex items-center gap-2">
              <span className="w-3 h-px bg-red-400/50 inline-block" />
              Vague 1 &mdash; Stable
            </p>

            <h2 className="text-5xl md:text-6xl font-black mb-3 tracking-[-0.03em]">
              Tube<span className="tf-forge-flow">Forge</span>
            </h2>
            <p className="text-sm text-white/35 mb-6 font-mono uppercase tracking-wider">Du web &agrave; ta timeline, sans d&eacute;tour</p>
            <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed">
              R&eacute;cup&egrave;re tes extraits depuis plus de 1500&nbsp;sites et envoie-les <span className="text-white/80">directement dans Premiere Pro &amp; DaVinci Resolve</span>. Le passage exact, en pleine qualit&eacute;, dans ta timeline &mdash; sans quitter ton montage.
            </p>

            <motion.ul
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-5 mb-10"
            >
              {[
                { icon: Layers, title: "Direct dans ta timeline Premiere & DaVinci", desc: "La vid\u00e9o n\u2019atterrit pas dans un dossier \u00e0 ranger \u2014 elle arrive dans ton logiciel de montage, pos\u00e9e sur la timeline, pr\u00eate \u00e0 couper. C\u2019est ce que personne d\u2019autre ne fait." },
                { icon: Globe, title: "Plus de 1500 sites, un seul workflow", desc: "Vimeo, Dailymotion, X, YouTube\u2026 r\u00e9cup\u00e8re tes r\u00e9f\u00e9rences o\u00f9 qu\u2019elles soient, toujours de la m\u00eame fa\u00e7on. Une seule habitude \u00e0 prendre." },
                { icon: Scissors, title: "L\u2019extrait exact, pas la vid\u00e9o enti\u00e8re", desc: "30 secondes utiles dans une vid\u00e9o de 2h ? S\u00e9lectionne le passage sur la timeline et ne r\u00e9cup\u00e8re que \u00e7a. Pas de d\u00e9coupe \u00e0 refaire apr\u00e8s." },
                { icon: Zap, title: "Pleine qualit\u00e9, plusieurs en parall\u00e8le", desc: "Jusqu\u2019en 4K, et 3 vid\u00e9os en m\u00eame temps pendant que tu montes. Une playlist enti\u00e8re ? Tu lances et tu vas bosser." },
                { icon: FileText, title: "Ton script se remplit tout seul", desc: "Des liens plein tes notes de pr\u00e9paration ? Importe le document : chaque r\u00e9f\u00e9rence est d\u00e9tect\u00e9e et r\u00e9cup\u00e9r\u00e9e d\u2019un coup." },
              ].map((item, i) => (
                <motion.li key={i} variants={itemVariants} className="flex gap-4 group/item">
                  <div className="mt-1 w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10 transition-all duration-300 group-hover/item:bg-red-500/10 group-hover/item:border-red-500/25 group-hover/item:shadow-[0_0_20px_rgba(239,68,68,0.12)]">
                    <item.icon className="w-4 h-4 text-red-400 transition-transform duration-300 group-hover/item:scale-110" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link
                href="/account?mode=register"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-bold text-base border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_24px_rgba(239,68,68,0.2)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_12px_40px_rgba(239,68,68,0.35)] transition-all duration-200 hover:translate-y-[-1px] active:translate-y-[1px]"
              >
                Commencer 3 jours gratuits <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1.5" />
              </Link>
              <Link
                href="/demo"
                className="group inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-white/5 text-white/85 font-semibold text-base transition-all duration-200 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
              >
                Voir la d&eacute;mo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>

          {/* Mockup — taille naturelle, pas de container fixe ni badge floating (le statut est déjà dans l'eyebrow "Vague 1 — Stable") */}
          <div className="group relative w-full lg:flex-[1.3] transition-all duration-500 hover:-translate-y-1">
            {/* Red-orange nebula — TubeForge identity glow. Intensifies on hover. */}
            <div
              className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] rounded-full pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "radial-gradient(ellipse at 50% 40%, rgba(239,68,68,0.16) 0%, rgba(249,115,22,0.08) 35%, transparent 70%)",
                filter: "blur(80px)",
              }}
            />
            <TubeForgeAppMockup />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
