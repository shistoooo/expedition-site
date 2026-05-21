"use client";

import { motion } from "framer-motion";
import { Layers, Search, FileText, Scissors, ArrowRight } from "lucide-react";
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
            <p className="text-sm text-white/35 mb-6 font-mono uppercase tracking-wider">
              Le plugin Premiere &amp; DaVinci pour qui mont du YouTube
            </p>
            <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed">
              Quatre outils en un, pens&eacute;s pour ton workflow r&eacute;el&nbsp;: plugin direct dans Premiere et DaVinci, recherche YouTube int&eacute;gr&eacute;e, import de scripts avec auto-d&eacute;tection des liens, d&eacute;coupe avant t&eacute;l&eacute;chargement. Plus jamais d&apos;aller-retour entre cinq apps.
            </p>

            <motion.ul
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-5 mb-10"
            >
              {[
                {
                  icon: Layers,
                  title: "Plugin Premiere Pro & DaVinci Resolve",
                  desc: "Colle un lien YouTube depuis l’onglet TubeForge dans ta timeline. La vidéo se télécharge et s’importe automatiquement. Plus de glisser-déposer depuis le Finder.",
                },
                {
                  icon: Search,
                  title: "Recherche YouTube intégrée à l’app",
                  desc: "Cherche, pré-visualise et télécharge sans quitter TubeForge. Tes onglets de navigateur ne ressemblent plus à un sapin de Noël pendant le montage.",
                },
                {
                  icon: FileText,
                  title: "Import de script avec auto-détection des liens",
                  desc: "Tu prépares une vidéo avec 20 références dans ton script&nbsp;? Importe le document, TubeForge détecte chaque lien YouTube et télécharge tout en un clic.",
                },
                {
                  icon: Scissors,
                  title: "Découpe avant téléchargement",
                  desc: "Une vidéo de 2h avec 30 secondes utiles&nbsp;? Sélectionne l’extrait sur la timeline et ne télécharge que ça. Gain de stockage et de temps de coupe.",
                },
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

            <p className="text-xs text-white/35 mb-10 font-mono leading-relaxed">
              + multi-t&eacute;l&eacute;chargement parall&egrave;le &middot; qualit&eacute; jusqu&apos;en 4K &middot; mises &agrave; jour hebdomadaires
            </p>

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
