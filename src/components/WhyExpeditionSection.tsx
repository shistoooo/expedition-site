"use client";

import { motion } from "framer-motion";
import { DollarSign, MousePointerClick, RefreshCw, Lock } from "lucide-react";

export default function WhyExpeditionSection() {
  return (
    <section className="py-20 md:py-24 relative">
      <div className="absolute inset-0 bg-[#06051a]/90 pointer-events-none" />
      <div className="container-main max-w-5xl relative z-10">

        {/* Bento grid — objection-killing layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Large card — Remplace +50€/mois */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group md:col-span-2 relative p-8 rounded-2xl overflow-hidden border border-white/[0.08] hover:border-white/15 transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(255,255,255,0.02) 100%)' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-30"
              style={{ background: 'radial-gradient(circle at 100% 0%, rgba(139,92,246,0.25), transparent 70%)' }}
            />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-bold text-white text-xl mb-3">Tout-en-un, sans se ruiner</h3>
              <p className="text-sm text-white/45 leading-relaxed max-w-md">
                OpusClip (25&euro;/mois), Frame.io (15&euro;/mois), 4K Video Downloader (40&euro; licence)&hellip; Ici, tout est inclus dans un seul abonnement &agrave; 11,99&euro;.
              </p>
            </div>
          </motion.div>

          {/* Small card — Annulez en 1 clic */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="group p-6 rounded-2xl border border-white/[0.08] hover:border-white/15 transition-all duration-300 bg-white/[0.03] flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <MousePointerClick className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Annulez en 1 clic</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                Pas d&apos;engagement. Pas de frais cach&eacute;s. Vous gardez l&apos;acc&egrave;s jusqu&apos;&agrave; la fin du mois.
              </p>
            </div>
          </motion.div>

          {/* Small card — Mise à jour chaque semaine */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="group p-6 rounded-2xl border border-white/[0.08] hover:border-white/15 transition-all duration-300 bg-white/[0.03]"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <RefreshCw className="w-5 h-5 text-violet-400" />
            </div>
            <h3 className="font-bold text-white text-base mb-2">Mise &agrave; jour chaque semaine</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              Chaque vendredi, un changelog. Pas de promesse vide &mdash; vous voyez le travail avancer.
            </p>
          </motion.div>

          {/* Large card — Votre prix ne bougera jamais */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.24 }}
            className="group md:col-span-2 relative p-8 rounded-2xl overflow-hidden border border-white/[0.08] hover:border-white/15 transition-all duration-300"
            style={{ background: 'linear-gradient(225deg, rgba(99,102,241,0.08) 0%, rgba(255,255,255,0.02) 100%)' }}
          >
            <div className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none opacity-30"
              style={{ background: 'radial-gradient(circle at 0% 100%, rgba(99,102,241,0.25), transparent 70%)' }}
            />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Lock className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="font-bold text-white text-xl mb-3">Votre prix ne bougera jamais</h3>
              <p className="text-sm text-white/45 leading-relaxed max-w-md">
                Nouveaux outils = prix d&apos;entr&eacute;e qui monte. Mais votre tarif Pionnier reste bloqu&eacute; &agrave; vie, tant que vous restez abonn&eacute;.
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
