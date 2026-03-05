"use client";

import { motion } from "framer-motion";
import { Zap, Scissors, ImagePlus, FileText, FolderOpen, Search, Video, Music, Download, CheckCircle2, ChevronRight, Loader2, ArrowRight, ListVideo, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
    <section id="tubeforge" className="py-24 md:py-32 relative overflow-hidden border-t border-white/5 bg-white/[0.01]">
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Version 2.0 Disponible
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Tube<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Forge</span>
            </h2>
            <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed">
              T&eacute;l&eacute;chargez, d&eacute;coupez, organisez. Tout ce dont vous avez besoin pour pr&eacute;parer vos montages.
            </p>

            <motion.ul
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-5 mb-10"
            >
              {[
                { icon: Zap, title: "Vos t\u00e9l\u00e9chargements, en quelques secondes", desc: "Pendant que les sites en ligne vous font attendre, TubeForge t\u00e9l\u00e9charge 3 vid\u00e9os en m\u00eame temps avec 4 flux parall\u00e8les. Une playlist de 20 vid\u00e9os ? Lancez et allez monter." },
                { icon: Scissors, title: "T\u00e9l\u00e9chargez uniquement le passage qui vous int\u00e9resse", desc: "Vous avez rep\u00e9r\u00e9 30 secondes utiles dans une vid\u00e9o de 2h ? S\u00e9lectionnez l\u2019extrait exact sur la timeline et t\u00e9l\u00e9chargez juste ce passage. Pas besoin de couper apr\u00e8s." },
                { icon: FileText, title: "Importez votre script, t\u00e9l\u00e9chargez toutes les r\u00e9f\u00e9rences", desc: "Vous pr\u00e9parez une vid\u00e9o avec des liens YouTube dans vos notes pour vos monteurs ? Importez votre document : TubeForge d\u00e9tecte chaque lien et t\u00e9l\u00e9charge tous les passages en un clic." },
                { icon: ImagePlus, title: "Capturez n\u2019importe quelle image d\u2019une vid\u00e9o", desc: "Besoin d\u2019une r\u00e9f\u00e9rence visuelle, d\u2019un frame pr\u00e9cis pour votre miniature ? Extrayez toutes les images cl\u00e9s d\u2019une vid\u00e9o en un clic. Plus besoin de faire des captures \u00e9cran." },
                { icon: ListVideo, title: "Cherchez et t\u00e9l\u00e9chargez sans quitter l\u2019app", desc: "Recherche YouTube int\u00e9gr\u00e9e. Trouvez la vid\u00e9o, s\u00e9lectionnez la qualit\u00e9, lancez le t\u00e9l\u00e9chargement. Tout \u00e7a sans ouvrir votre navigateur." },
                { icon: FolderOpen, title: "Toutes vos vid\u00e9os, rang\u00e9es et accessibles", desc: "Organisez par projet avec des dossiers, pr\u00e9visualisez avec le lecteur int\u00e9gr\u00e9, d\u00e9placez en drag-and-drop. Fini le dossier T\u00e9l\u00e9chargements en bordel." },
              ].map((item, i) => (
                <motion.li key={i} variants={itemVariants} className="flex gap-4">
                  <div className="mt-1 w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <item.icon className="w-4 h-4 text-red-400" />
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
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all duration-300 shadow-lg shadow-white/10"
            >
              Obtenir TubeForge <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mockup — Faithful to real TubeForge UI */}
          <div className="flex-1 w-full relative">
            {/* Ambient glow like real app */}
            <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[90%] h-[60%] rounded-full blur-[150px] opacity-40 pointer-events-none" style={{ background: '#2e1065' }} />
            <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[60%] h-[40%] rounded-full blur-[120px] opacity-25 pointer-events-none" style={{ background: '#4c1d95' }} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-[20px] overflow-hidden shadow-2xl shadow-purple-500/10 flex flex-col"
              style={{ background: '#0f0e17', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              {/* Window chrome */}
              <div className="h-8 flex items-center px-3 gap-1.5" style={{ background: '#13122a', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <span className="text-[10px] text-white/25 ml-2 font-medium tracking-wide">TubeForge</span>
              </div>

              {/* Header — tabs centered */}
              <div className="px-5 pt-4 pb-3 flex items-center justify-center">
                <div className="flex items-center gap-1 p-1 rounded-xl border border-white/10 backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="px-3 py-1.5 rounded-lg text-[10px] font-medium text-white shadow-sm" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    T&eacute;l&eacute;charger
                  </div>
                  <div className="px-3 py-1.5 rounded-lg text-[10px] text-white/50 font-medium">
                    Biblioth&egrave;que
                  </div>
                </div>
              </div>

              <div className="px-5 pb-0 flex flex-col items-center">
                {/* Hero text — real app */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70 tracking-tight">T&eacute;l&eacute;chargez sans limites</h3>
                  <p className="text-[10px] text-white/40 mt-1">Transformez vos liens YouTube en fichiers MP4 et MP3 de haute qualit&eacute;, instantan&eacute;ment.</p>
                </div>

                {/* Mode Toggle — real app */}
                <div className="flex items-center gap-1 p-1 rounded-xl border border-white/10 mb-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  {[
                    { label: "URL", active: true },
                    { label: "Recherche", active: false },
                    { label: "Script", active: false, icon: true },
                  ].map((m) => (
                    <div key={m.label} className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${m.active ? 'bg-white/10 text-white' : 'text-white/50'}`}>
                      {m.icon && <FileText className="w-2.5 h-2.5 inline mr-1" />}
                      {m.label}
                    </div>
                  ))}
                </div>

                {/* Search input — gradient glow like real app */}
                <div className="w-full relative group flex gap-2 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                  <div className="relative flex-1 flex items-center gap-2 p-2 pl-4 rounded-2xl shadow-2xl backdrop-blur-xl" style={{ background: 'rgba(30,27,75,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Search className="w-3.5 h-3.5 text-white/20 shrink-0" />
                    <span className="flex-1 text-[11px] text-white/20">Collez un lien YouTube...</span>
                    <div className="h-5 w-px bg-white/10 mx-1" />
                    <span className="text-[9px] text-white/70 font-medium">1080p</span>
                    <div className="h-5 w-px bg-white/10 mx-1" />
                    <FolderOpen className="w-3 h-3 text-white/30" />
                  </div>
                  <div className="relative px-4 py-2.5 rounded-2xl text-white text-[11px] font-medium flex items-center gap-1.5 shadow-lg" style={{ background: '#4c1d95', boxShadow: '0 8px 20px rgba(76,29,149,0.5)' }}>
                    <Search className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Video Result Card — like real app's result */}
                <div className="w-full rounded-3xl p-4 backdrop-blur-md mb-3 shadow-2xl" style={{ background: 'rgba(30,27,75,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="flex gap-4 items-start">
                    {/* Thumbnail — larger like real app */}
                    <div className="w-28 aspect-video rounded-xl shrink-0 relative overflow-hidden shadow-lg shadow-black/40">
                      <Image src="/mockups/thumb-anime.jpg" alt="Thumbnail" fill className="object-cover" />
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <p className="text-[12px] text-white font-bold leading-tight line-clamp-2">1H46 pour t&apos;expliquer le jeu qui m&apos;a bris&eacute;.</p>
                      <div className="flex items-center gap-2 text-[9px] text-white/40 font-mono">
                        <span className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5">1:46:23</span>
                        <span>&bull;</span>
                        <span>YouTube</span>
                      </div>
                    </div>
                  </div>

                  {/* Download buttons — MP4 cyan / MP3 pink — like real app */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="group bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-xl transition-all text-left">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[11px] font-bold text-white group-hover:text-cyan-400 transition-colors">T&eacute;l&eacute;charger MP4</span>
                        <Video className="w-3.5 h-3.5 text-white/20 group-hover:text-cyan-400 transition-colors" />
                      </div>
                      <p className="text-[8px] text-white/40">Qualit&eacute;: 1080p &bull; 4 fragments parall&egrave;les</p>
                    </div>
                    <div className="group bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-xl transition-all text-left">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[11px] font-bold text-white group-hover:text-pink-400 transition-colors">T&eacute;l&eacute;charger MP3</span>
                        <Music className="w-3.5 h-3.5 text-white/20 group-hover:text-pink-400 transition-colors" />
                      </div>
                      <p className="text-[8px] text-white/40">Audio haute fid&eacute;lit&eacute; &bull; 320kbps</p>
                    </div>
                  </div>

                  {/* Trim toggle — like real app */}
                  <div className="mt-3 flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-[10px] font-medium" style={{ background: 'rgba(249,115,22,0.08)', borderColor: 'rgba(249,115,22,0.25)' }}>
                    <div className="flex items-center gap-2">
                      <Scissors className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-orange-400">Couper un extrait</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-orange-400 rotate-90" />
                  </div>

                  {/* Trim timeline preview — expanded */}
                  <div className="mt-2 rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="p-3">
                      {/* Timeline bar */}
                      <div className="relative h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div className="absolute h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500" style={{ left: '12%', width: '35%' }} />
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-orange-500" style={{ left: '12%' }} />
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-amber-500" style={{ left: '47%' }} />
                      </div>
                      <div className="flex justify-between mt-1.5 text-[8px] text-white/30 font-mono">
                        <span>00:00:00</span>
                        <span className="text-orange-400 font-bold">00:12:34 &mdash; dur&eacute;e s&eacute;lectionn&eacute;e</span>
                        <span>1:46:23</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Tray — fixed bottom, like real app */}
              <div style={{ background: '#1a1840', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {/* Toggle bar */}
                <div className="px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[11px] text-white/70 font-medium">2 en cours</span>
                    <span className="text-[10px] text-white/30">(4)</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/30 rotate-90" />
                </div>

                {/* Downloads list */}
                <div style={{ background: '#0f0e2a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  {[
                    { title: "Pokemon Ultra Soleil mais uniquement avec des Shiny", progress: 100, status: "completed" as const, thumb: "/mockups/thumb-pokemon.jpg" },
                    { title: "22 minutes pour sauver l\u2019univers (ok un peu plus)", progress: 100, status: "completed" as const, thumb: "/mockups/thumb-fantasy.jpg" },
                    { title: "1H46 pour t\u2019expliquer le jeu qui m\u2019a bris\u00e9", progress: 67, status: "downloading" as const, thumb: "/mockups/thumb-anime.jpg" },
                    { title: "POKOPIA VA (vraiment) \u00caTRE EXCEPTIONNEL", progress: 34, status: "downloading" as const, thumb: "/mockups/thumb-pokopia.jpg" },
                  ].map((dl, i) => (
                    <div key={i} className="px-4 py-2.5 flex items-center gap-3" style={{ borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <div className="w-10 h-10 rounded-lg shrink-0 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <Image src={dl.thumb} alt="" fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[10px] text-white/80 truncate">{dl.title}</p>
                          {dl.status === "downloading" && (
                            <span className="text-[10px] text-purple-300 font-medium tabular-nums shrink-0">{dl.progress}%</span>
                          )}
                        </div>
                        {dl.status === "downloading" ? (
                          <div className="mt-1 h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${dl.progress}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.4 + i * 0.15, ease: easeOutExpo }}
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            />
                          </div>
                        ) : (
                          <p className="text-[9px] text-green-400 mt-0.5">T&eacute;l&eacute;charg&eacute;</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {dl.status === "completed" && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                        {dl.status === "downloading" && <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />}
                        <span className="text-white/20 text-[10px] cursor-pointer hover:text-white/50">&times;</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
