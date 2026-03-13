"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Scissors, FileText, Search, Video, Music, Download, CheckCircle2, ChevronRight, Loader2, ArrowRight, Play, FileUp, FolderOpen } from "lucide-react";
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

function TubeForgeMockup() {
  const [mainTab, setMainTab] = useState<"download" | "library">("download");
  const [mode, setMode] = useState<"url" | "search" | "script">("url");
  const [trimOpen, setTrimOpen] = useState(true);
  const [trimStart, setTrimStart] = useState(12);
  const [trimEnd, setTrimEnd] = useState(47);
  const [dragging, setDragging] = useState<"start" | "end" | null>(null);
  const [trayOpen, setTrayOpen] = useState(true);
  const timelineRef = useState<HTMLDivElement | null>(null);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const bar = e.currentTarget as HTMLDivElement;
    const rect = bar.getBoundingClientRect();
    const pct = Math.round(Math.max(2, Math.min(98, ((e.clientX - rect.left) / rect.width) * 100)));
    if (dragging === "start") {
      setTrimStart(Math.min(pct, trimEnd - 5));
    } else {
      setTrimEnd(Math.max(pct, trimStart + 5));
    }
  };

  const handlePointerUp = () => setDragging(null);

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    // Move whichever handle is closer
    const distStart = Math.abs(pct - trimStart);
    const distEnd = Math.abs(pct - trimEnd);
    if (distStart < distEnd) {
      setTrimStart(Math.min(pct, trimEnd - 5));
    } else {
      setTrimEnd(Math.max(pct, trimStart + 5));
    }
  };

  // Convert percent (0-100) to time string for a 1:46:23 video (6383 seconds)
  const pctToTime = (pct: number) => {
    const totalSec = Math.round((pct / 100) * 6383);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const downloads = [
    { title: "Pokemon Ultra Soleil mais uniquement avec des Shiny", progress: 100, status: "completed" as const, thumb: "/mockups/thumb-pokemon.jpg" },
    { title: "22 minutes pour sauver l\u2019univers (ok un peu plus)", progress: 100, status: "completed" as const, thumb: "/mockups/thumb-fantasy.jpg" },
    { title: "1H46 pour t\u2019expliquer le jeu qui m\u2019a bris\u00e9", progress: 67, status: "downloading" as const, thumb: "/mockups/thumb-anime.jpg" },
    { title: "POKOPIA VA (vraiment) \u00caTRE EXCEPTIONNEL", progress: 34, status: "downloading" as const, thumb: "/mockups/thumb-pokopia.jpg" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative rounded-[20px] overflow-hidden shadow-2xl shadow-purple-500/10 flex flex-col select-none"
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
          {(["download", "library"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setMainTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-200 ${mainTab === tab ? 'bg-white/10 text-white shadow-sm' : 'text-white/50 hover:text-white/70'}`}
            >
              {tab === "download" ? "T\u00e9l\u00e9charger" : "Biblioth\u00e8que"}
            </button>
          ))}
        </div>
      </div>

      {mainTab === "download" ? (
        <div className="px-5 pb-0 flex flex-col items-center">
          {/* Hero text */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70 tracking-tight">T&eacute;l&eacute;chargez sans limites</h3>
            <p className="text-[10px] text-white/40 mt-1">Transformez vos liens YouTube en fichiers MP4 et MP3 de haute qualit&eacute;, instantan&eacute;ment.</p>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl border border-white/10 mb-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {(["url", "search", "script"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-200 ${mode === m ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/70'}`}
              >
                {m === "script" && <FileText className="w-2.5 h-2.5 inline mr-1" />}
                {m === "url" ? "URL" : m === "search" ? "Recherche" : "Script"}
              </button>
            ))}
          </div>

          {/* Content based on mode */}
          {mode === "script" ? (
            <div className="w-full mb-4 space-y-3">
              <div className="rounded-2xl p-6 text-center border-2 border-dashed border-white/10 hover:border-purple-500/40 transition-colors cursor-pointer" style={{ background: 'rgba(30,27,75,0.4)' }}>
                <FileUp className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p className="text-[10px] text-white/30">Glissez un fichier <span className="text-purple-400/80 font-medium">.docx</span> ici</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: 'rgba(30,27,75,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="h-16 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <p className="text-[10px] text-white/20">Ou collez votre texte avec des liens YouTube...</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Search input */}
              <div className="w-full relative group flex gap-2 mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="relative flex-1 flex items-center gap-2 p-2 pl-4 rounded-2xl shadow-2xl backdrop-blur-xl" style={{ background: 'rgba(30,27,75,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Search className="w-3.5 h-3.5 text-white/20 shrink-0" />
                  <span className="flex-1 text-[11px] text-white/20">{mode === "search" ? "Rechercher sur YouTube..." : "Collez un lien YouTube..."}</span>
                  <div className="h-5 w-px bg-white/10 mx-1" />
                  <span className="text-[9px] text-white/70 font-medium">1080p</span>
                  <div className="h-5 w-px bg-white/10 mx-1" />
                  <FolderOpen className="w-3 h-3 text-white/30" />
                </div>
                <div className="relative px-4 py-2.5 rounded-2xl text-white text-[11px] font-medium flex items-center gap-1.5 shadow-lg cursor-pointer hover:brightness-125 transition-all" style={{ background: '#4c1d95', boxShadow: '0 8px 20px rgba(76,29,149,0.5)' }}>
                  <Search className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Video Result Card */}
              <div className="w-full rounded-3xl p-4 backdrop-blur-md mb-3 shadow-2xl" style={{ background: 'rgba(30,27,75,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex gap-4 items-start">
                  <div className="w-28 aspect-video rounded-xl shrink-0 relative overflow-hidden shadow-lg shadow-black/40">
                    <Image src="/mockups/thumb-anime.jpg" alt="Miniature vid\u00e9o dans l'interface TubeForge" fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <p className="text-[12px] text-white font-bold leading-tight line-clamp-2">1H46 pour t&apos;expliquer le jeu qui m&apos;a bris&eacute;.</p>
                    <div className="flex items-center gap-2 text-[9px] text-white/40 font-mono">
                      <span className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5">1:46:23</span>
                      <span>&bull;</span>
                      <span>YouTube</span>
                    </div>
                  </div>
                </div>

                {/* Download buttons */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="group bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 p-3 rounded-xl transition-all duration-200 text-left cursor-pointer">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] font-bold text-white group-hover:text-cyan-400 transition-colors">T&eacute;l&eacute;charger MP4</span>
                      <Video className="w-3.5 h-3.5 text-white/20 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <p className="text-[8px] text-white/40 group-hover:text-cyan-400/50 transition-colors">Qualit&eacute;: 1080p &bull; 4 fragments parall&egrave;les</p>
                  </div>
                  <div className="group bg-white/5 hover:bg-pink-500/10 border border-white/10 hover:border-pink-500/30 p-3 rounded-xl transition-all duration-200 text-left cursor-pointer">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] font-bold text-white group-hover:text-pink-400 transition-colors">T&eacute;l&eacute;charger MP3</span>
                      <Music className="w-3.5 h-3.5 text-white/20 group-hover:text-pink-400 transition-colors" />
                    </div>
                    <p className="text-[8px] text-white/40 group-hover:text-pink-400/50 transition-colors">Audio haute fid&eacute;lit&eacute; &bull; 320kbps</p>
                  </div>
                </div>

                {/* Trim toggle */}
                <button
                  onClick={() => setTrimOpen(!trimOpen)}
                  className="mt-3 w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-[10px] font-medium cursor-pointer"
                  style={{ background: trimOpen ? 'rgba(249,115,22,0.08)' : 'rgba(255,255,255,0.02)', borderColor: trimOpen ? 'rgba(249,115,22,0.25)' : 'rgba(255,255,255,0.05)' }}
                >
                  <div className="flex items-center gap-2">
                    <Scissors className={`w-3.5 h-3.5 transition-colors ${trimOpen ? 'text-orange-400' : 'text-white/40'}`} />
                    <span className={trimOpen ? 'text-orange-400' : 'text-white/40'}>Couper un extrait</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 transition-all duration-200 ${trimOpen ? 'text-orange-400 rotate-90' : 'text-white/30'}`} />
                </button>

                {/* Trim timeline */}
                {trimOpen && (
                  <div className="mt-2 rounded-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="p-3">
                      <div
                        className="relative h-3 rounded-full cursor-pointer touch-none"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                        onClick={handleBarClick}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                      >
                        {/* Selected range — clamped to stay inside */}
                        <div
                          className="absolute h-full bg-gradient-to-r from-orange-500 to-amber-500"
                          style={{ left: `${trimStart}%`, right: `${100 - trimEnd}%`, transition: dragging ? 'none' : 'all 0.15s' }}
                        />
                        {/* Start handle */}
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-orange-500 hover:scale-125 transition-transform z-10 ${dragging === 'start' ? 'scale-125 cursor-grabbing' : 'cursor-grab'}`}
                          style={{ left: `${trimStart}%` }}
                          onPointerDown={(e) => { e.stopPropagation(); setDragging("start"); (e.target as HTMLElement).setPointerCapture(e.pointerId); }}
                          onPointerMove={handlePointerMove}
                          onPointerUp={(e) => { handlePointerUp(); (e.target as HTMLElement).releasePointerCapture(e.pointerId); }}
                        />
                        {/* End handle */}
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-amber-500 hover:scale-125 transition-transform z-10 ${dragging === 'end' ? 'scale-125 cursor-grabbing' : 'cursor-grab'}`}
                          style={{ left: `${trimEnd}%` }}
                          onPointerDown={(e) => { e.stopPropagation(); setDragging("end"); (e.target as HTMLElement).setPointerCapture(e.pointerId); }}
                          onPointerMove={handlePointerMove}
                          onPointerUp={(e) => { handlePointerUp(); (e.target as HTMLElement).releasePointerCapture(e.pointerId); }}
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-[8px] text-white/30 font-mono">
                        <span>00:00:00</span>
                        <span className="text-orange-400 font-bold">
                          {pctToTime(trimStart)} &rarr; {pctToTime(trimEnd)}
                        </span>
                        <span>1:46:23</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        /* Library view */
        <div className="px-5 pb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { thumb: "/mockups/thumb-pokemon.jpg", title: "Pokemon Ultra Soleil...", type: "MP4", size: "1.2 GB" },
              { thumb: "/mockups/thumb-fantasy.jpg", title: "22 minutes pour sauver...", type: "MP4", size: "340 MB" },
              { thumb: "/mockups/thumb-anime.jpg", title: "1H46 pour t\u2019expliquer...", type: "MP4", size: "2.1 GB" },
              { thumb: "/mockups/thumb-pokopia.jpg", title: "POKOPIA VA (vraiment)...", type: "MP4", size: "520 MB" },
            ].map((item, i) => (
              <div key={i} className="rounded-xl overflow-hidden cursor-pointer group transition-all hover:-translate-y-0.5" style={{ background: 'rgba(30,27,75,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="aspect-video relative overflow-hidden">
                  <Image src={item.thumb} alt={`${item.title} — vid\u00e9o dans la biblioth\u00e8que TubeForge`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[7px] font-bold text-white/80 uppercase" style={{ background: 'rgba(0,0,0,0.6)' }}>{item.type}</div>
                </div>
                <div className="p-2">
                  <p className="text-[9px] text-white/70 font-medium truncate">{item.title}</p>
                  <p className="text-[8px] text-white/30">{item.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Download Tray */}
      <div style={{ background: '#1a1840', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={() => setTrayOpen(!trayOpen)} className="w-full px-4 py-2 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[11px] text-white/70 font-medium">2 en cours</span>
            <span className="text-[10px] text-white/30">(4)</span>
          </div>
          <ChevronRight className={`w-3.5 h-3.5 text-white/30 transition-transform duration-200 ${trayOpen ? 'rotate-90' : '-rotate-90'}`} />
        </button>

        {trayOpen && (
          <div style={{ background: '#0f0e2a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {downloads.map((dl, i) => (
              <div key={i} className="px-4 py-2.5 flex items-center gap-3" style={{ borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div className="w-10 h-10 rounded-lg shrink-0 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Image src={dl.thumb} alt={`${dl.title} — t\u00e9l\u00e9chargement en cours`} fill className="object-cover" />
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
        )}
      </div>
    </motion.div>
  );
}

export default function TubeForgeSection() {
  return (
    <section id="tubeforge" className="py-32 md:py-40 relative section-fade-top bg-[#06051a]/80">
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
                { icon: Zap, title: "T\u00e9l\u00e9chargez en quelques secondes, jusqu\u2019en 8K", desc: "Pendant que les sites en ligne vous font attendre, TubeForge t\u00e9l\u00e9charge 3 vid\u00e9os en m\u00eame temps. Une playlist de 20 vid\u00e9os ? Lancez et allez monter." },
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
              Rejoindre pour y acc&eacute;der <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1.5" />
            </Link>
            <p className="text-xs text-white/25 mt-3">Inclus dans l&apos;abonnement Pionnier &mdash; &agrave; partir de 7,99&euro;/mois</p>
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
