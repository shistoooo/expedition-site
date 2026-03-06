"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Eye, Clock, Lock, Link2, Copy, Check, Zap, LayoutDashboard, FolderOpen, Share2, Wifi } from "lucide-react";
import Link from "next/link";

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
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

function ReviewForgeMockup() {
  const [page, setPage] = useState<"dashboard" | "share">("dashboard");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const links = [
    { name: "Montage_Final_v3.mp4", reviewer: "Lucas", views: 3, maxViews: 10, expires: "23h restantes", hasPassword: true },
    { name: "Intro_Podcast_EP12.mov", reviewer: "Emma", views: 1, maxViews: 5, expires: "2j restants", hasPassword: false },
    { name: "Teaser_Campagne.mp4", reviewer: "", views: 7, maxViews: 7, expires: "Expir\u00e9", hasPassword: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative rounded-[20px] overflow-hidden shadow-2xl shadow-emerald-500/10 select-none flex"
      style={{ background: '#0c0c12', border: '1px solid rgba(255,255,255,0.06)', minHeight: 380 }}
    >
      {/* Sidebar */}
      <div className="w-[52px] md:w-[140px] shrink-0 flex flex-col border-r border-white/5" style={{ background: '#08080c' }}>
        {/* Logo */}
        <div className="p-3 md:px-4 md:py-4">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" />
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 px-1.5 md:px-2 space-y-0.5">
          {([
            { id: "dashboard" as const, icon: LayoutDashboard, label: "Dashboard" },
            { id: "projects" as const, icon: FolderOpen, label: "Projets" },
            { id: "share" as const, icon: Share2, label: "Partager" },
          ] as const).map((item) => (
            <button
              key={item.id}
              onClick={() => { if (item.id === "dashboard" || item.id === "share") setPage(item.id); }}
              className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-[10px] font-medium transition-all ${
                (item.id === page || (item.id === "dashboard" && page === "dashboard") || (item.id === "share" && page === "share"))
                  ? 'text-white bg-white/[0.07]'
                  : 'text-white/30 hover:text-white/50'
              }`}
            >
              <item.icon className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline truncate">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Tunnel indicator */}
        <div className="p-2 md:px-3 md:py-3">
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[9px] font-medium text-emerald-400" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <Wifi className="w-3 h-3" />
            <span className="hidden md:inline">Tunnel actif</span>
          </div>
          <p className="text-[8px] text-white/15 mt-2 text-center hidden md:block">v0.1.0-beta</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Window drag region */}
        <div className="h-8 flex items-center justify-end px-3 gap-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>

        {page === "dashboard" ? (
          <div className="p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[13px] font-semibold text-white">Tableau de bord</h3>
                <p className="text-[9px] text-white/30">G&eacute;rez vos liens de review</p>
              </div>
              <div className="flex items-center gap-3 text-[9px] text-white/40">
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> 11 vues</span>
                <span className="flex items-center gap-1"><Link2 className="w-3 h-3" /> 3 liens</span>
              </div>
            </div>

            {/* Link cards */}
            <div className="space-y-2">
              {links.map((link, i) => {
                const isExpired = link.views >= link.maxViews;
                const progress = (link.views / link.maxViews) * 100;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08, ease: easeOutExpo }}
                    className={`p-3 rounded-xl transition-all ${isExpired ? 'opacity-50' : ''}`}
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {!isExpired && (
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                          </span>
                        )}
                        {isExpired && <span className="w-2 h-2 rounded-full bg-red-500/50 shrink-0" />}
                        <span className="text-[10px] text-white/80 font-medium truncate">{link.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {link.reviewer && (
                          <span className="px-1.5 py-0.5 rounded text-[7px] font-medium text-indigo-300" style={{ background: 'rgba(99,102,241,0.15)' }}>{link.reviewer}</span>
                        )}
                        {link.hasPassword && <Lock className="w-2.5 h-2.5 text-white/20" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[8px] text-white/30 mb-1.5">
                      <span className="flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" /> {link.views}/{link.maxViews} vues</span>
                      <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> {link.expires}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div
                        className={`h-full rounded-full transition-all ${progress >= 100 ? 'bg-red-500/60' : progress >= 70 ? 'bg-orange-500' : 'bg-indigo-500'}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {/* Header */}
            <div>
              <h3 className="text-[13px] font-semibold text-white">Partager une vid&eacute;o</h3>
              <p className="text-[9px] text-white/30">Cr&eacute;ez un lien s&eacute;curis&eacute;</p>
            </div>

            {/* File selected */}
            <div className="p-2.5 rounded-xl flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0">
                <FolderOpen className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-white/80 font-medium truncate">Montage_Final_v3.mp4</p>
                <p className="text-[8px] text-white/25">2.4 GB &bull; MP4</p>
              </div>
            </div>

            {/* Settings grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-[7px] text-white/25 uppercase mb-1">Expiration</p>
                <p className="text-[10px] text-white/70 font-medium">24 heures</p>
              </div>
              <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-[7px] text-white/25 uppercase mb-1">Max vues</p>
                <p className="text-[10px] text-white/70 font-medium">10</p>
              </div>
              <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-[7px] text-white/25 uppercase mb-1">Mot de passe</p>
                <p className="text-[10px] text-emerald-400 font-medium">Activ&eacute;</p>
              </div>
            </div>

            {/* Generated link */}
            <div className="p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span className="text-[8px] text-emerald-400 font-medium">Lien actif</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-[8px] text-white/50 font-mono truncate bg-black/20 px-2 py-1.5 rounded-md">https://review.expedition.studio/s/xK9mQ2...</code>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-md shrink-0 transition-all"
                  style={{ background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)' }}
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-white/40" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ReviewForgeSection() {
  return (
    <section id="reviewforge" className="py-24 md:py-32 relative overflow-hidden border-t border-white/5">
      <div className="container-main">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20"
        >
          {/* Text */}
          <div className="flex-1 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium mb-8">
              <Clock className="w-4 h-4" />
              Bient&ocirc;t disponible &mdash; Vague 2
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Review<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Forge</span>
            </h2>
            <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed">
              Partagez vos montages en cours avec vos clients ou votre &eacute;quipe. S&eacute;curis&eacute;, temporaire, sans upload.
            </p>

            <motion.ul
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-5 mb-10"
            >
              {[
                { icon: Shield, title: "Vos vid\u00e9os ne quittent jamais votre machine", desc: "Pas d\u2019upload sur un cloud. ReviewForge cr\u00e9e un tunnel s\u00e9curis\u00e9 direct entre vous et votre reviewer. Votre montage reste sur votre disque dur." },
                { icon: Clock, title: "Des liens qui s\u2019auto-d\u00e9truisent", desc: "Configurez une expiration (1h, 24h, 7 jours), un nombre max de vues, un mot de passe. Le lien dispara\u00eet automatiquement apr\u00e8s." },
                { icon: Eye, title: "Suivez qui regarde, en temps r\u00e9el", desc: "Dashboard en direct : nombre de vues par lien, qui a regard\u00e9, quand le lien expire. R\u00e9voquez un acc\u00e8s en un clic si besoin." },
                { icon: Link2, title: "Un lien, un clic, c\u2019est partag\u00e9", desc: "S\u00e9lectionnez votre fichier, configurez les restrictions, copiez le lien. Votre client n\u2019a rien \u00e0 installer \u2014 il ouvre le lien dans son navigateur." },
              ].map((item, i) => (
                <motion.li key={i} variants={itemVariants} className="flex gap-4">
                  <div className="mt-1 w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <item.icon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>

            <div className="flex items-center gap-4">
              <Link
                href="/pricing"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300 shadow-lg shadow-white/10"
              >
                Inclus dans votre abonnement <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
            <p className="text-xs text-white/25 mt-3">Les Pionniers y auront acc&egrave;s d&egrave;s la sortie, sans surco&ucirc;t.</p>
          </div>

          {/* Mockup */}
          <div className="flex-1 w-full relative">
            <div className="absolute -inset-10 bg-emerald-500/10 blur-3xl rounded-full opacity-30 pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
            <ReviewForgeMockup />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
