"use client";

import { motion } from "framer-motion";
import { Zap, Scissors, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import TubeForgeMockup from "@/components/mockups/TubeForgeMockup";

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
              Tube<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Forge</span>
            </h2>
            <p className="text-sm text-white/35 mb-6 font-mono uppercase tracking-wider">L&apos;alternative &agrave; 4K Video Downloader</p>
            <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed">
              T&eacute;l&eacute;chargez vos r&eacute;f&eacute;rences YouTube en quelques secondes, d&eacute;coupez l&apos;extrait exact, importez votre script. Plus jamais d&apos;onglets YouTube ouverts pendant le montage.
            </p>

            <motion.ul
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-5 mb-10"
            >
              {[
                { icon: Zap, title: "T\u00e9l\u00e9chargez en quelques secondes, jusqu\u2019en 4K", desc: "Pendant que les sites en ligne vous font attendre, TubeForge t\u00e9l\u00e9charge 3 vid\u00e9os en m\u00eame temps. Une playlist de 20 vid\u00e9os ? Lancez et allez monter." },
                { icon: Scissors, title: "D\u00e9coupez l\u2019extrait exact avant de t\u00e9l\u00e9charger", desc: "Vous avez rep\u00e9r\u00e9 30 secondes utiles dans une vid\u00e9o de 2h ? S\u00e9lectionnez l\u2019extrait sur la timeline et t\u00e9l\u00e9chargez juste ce passage. Pas besoin de couper apr\u00e8s." },
                { icon: FileText, title: "Importez votre script, toutes les r\u00e9f\u00e9rences se t\u00e9l\u00e9chargent", desc: "Vous pr\u00e9parez une vid\u00e9o avec des liens YouTube dans vos notes ? Importez votre document : TubeForge d\u00e9tecte chaque lien et t\u00e9l\u00e9charge tout en un clic." },
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

            <Link
              href="/pricing"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-bold text-base border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_24px_rgba(239,68,68,0.2)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_12px_40px_rgba(239,68,68,0.35)] transition-all duration-200 hover:translate-y-[-1px] active:translate-y-[1px]"
            >
              Commencer maintenant <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1.5" />
            </Link>
          </div>

          {/* Mockup */}
          <div className="flex-1 w-full relative">
            {/* Red-orange nebula — TubeForge identity glow */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(239,68,68,0.12) 0%, rgba(249,115,22,0.06) 35%, transparent 70%)', filter: 'blur(80px)' }} />
            <TubeForgeMockup />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
