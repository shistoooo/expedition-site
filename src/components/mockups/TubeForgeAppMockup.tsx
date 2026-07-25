"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Link2, Search, FileText, Folder, ChevronDown, Youtube, Puzzle, Play, Check, Loader2, Download, FileUp, Scissors } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────
// Mockup INTERACTIF fidèle à la vraie app TubeForge.
//  • Onglets app : Télécharger / Bibliothèque / Plugins (cliquables)
//  • Sous-onglets : URL / Recherche / Script (cliquables, contenu propre)
//  • Vraies miniatures (/mockups/thumb-*.jpg) sur les vidéos + DL en cours
//  • Plugins : vrais logos Premiere (navy "Pr") / DaVinci (trèfle) / Firefox
// ─────────────────────────────────────────────────────────────────────────

type Tab = "download" | "library" | "plugins";
type Mode = "url" | "search" | "script";

// ── Vrais logos ───────────────────────────────────────────────────────────
function PremiereLogo({ s = 40 }: { s?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={s} height={s} aria-label="Adobe Premiere Pro">
      <rect width="24" height="24" rx="5" fill="#00005B" />
      <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight={700} fill="#9999FF" letterSpacing="-0.5">Pr</text>
    </svg>
  );
}
const TEARDROP = "M 0 0.6 Q -2.6 -2.8 -2.8 -5.2 A 2.8 2.8 0 0 1 2.8 -5.2 Q 2.6 -2.8 0 0.6 Z";
function ResolveLogo({ s = 40 }: { s?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={s} height={s} aria-label="DaVinci Resolve">
      <defs>
        <radialGradient id="rCy" cx="0.5" cy="0.3" r="0.9"><stop offset="0%" stopColor="#C0F0FA" /><stop offset="50%" stopColor="#5DC8E0" /><stop offset="100%" stopColor="#3FA8C8" /></radialGradient>
        <radialGradient id="rYe" cx="0.5" cy="0.3" r="0.9"><stop offset="0%" stopColor="#F8FA9A" /><stop offset="50%" stopColor="#DCDF45" /><stop offset="100%" stopColor="#B5B820" /></radialGradient>
        <radialGradient id="rRe" cx="0.5" cy="0.3" r="0.9"><stop offset="0%" stopColor="#FFC8D2" /><stop offset="50%" stopColor="#EC5A78" /><stop offset="100%" stopColor="#C03050" /></radialGradient>
      </defs>
      <rect width="24" height="24" rx="5" fill="#1A1A1A" />
      <g transform="translate(12 12)"><path d={TEARDROP} fill="url(#rCy)" /><path d={TEARDROP} fill="url(#rRe)" transform="rotate(120)" /><path d={TEARDROP} fill="url(#rYe)" transform="rotate(240)" /></g>
    </svg>
  );
}
function FirefoxLogo({ s = 40 }: { s?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={s} height={s} aria-label="Firefox">
      <rect width="24" height="24" rx="5" fill="#1A1A1A" />
      <g transform="translate(2 2) scale(0.83)">
        <path fill="#ff7a1a" d="M22.778 8.048c-.505-1.215-1.53-2.528-2.333-2.943.654 1.283 1.033 2.57 1.177 3.53l.002.02c-1.314-3.278-3.544-4.6-5.366-7.477-.091-.147-.184-.292-.273-.446a3.545 3.545 0 01-.13-.24 2.118 2.118 0 01-.172-.46.03.03 0 00-.027-.03.038.038 0 00-.021 0l-.006.001a.037.037 0 00-.01.005L15.624 0c-2.585 1.515-3.657 4.168-3.932 5.856a6.197 6.197 0 00-2.305.587.297.297 0 00-.147.37c.057.162.24.24.396.17a5.622 5.622 0 012.008-.523l.067-.005a5.847 5.847 0 011.957.222l.095.03a5.816 5.816 0 01.616.228c.08.036.16.073.238.112l.107.055a5.835 5.835 0 01.368.211 5.953 5.953 0 012.034 2.104c-.62-.437-1.733-.868-2.803-.681 4.183 2.09 3.06 9.292-2.737 9.02a5.164 5.164 0 01-1.513-.292 4.42 4.42 0 01-.538-.232c-1.42-.735-2.593-2.121-2.74-3.806 0 0 .537-2 3.845-2 .357 0 1.38-.998 1.398-1.287-.005-.095-2.029-.9-2.817-1.677-.422-.416-.622-.616-.8-.767a3.47 3.47 0 00-.301-.227 5.388 5.388 0 01-.032-2.842c-1.195.544-2.124 1.403-2.8 2.163h-.006c-.46-.584-.428-2.51-.402-2.913-.006-.025-.343.176-.389.206-.406.29-.787.616-1.136.974-.397.403-.76.839-1.085 1.303a9.816 9.816 0 00-1.562 3.52c-.003.013-.11.487-.19 1.073-.013.09-.026.181-.037.272a7.8 7.8 0 00-.069.667l-.002.034-.023.387-.001.06C.386 18.795 5.593 24 12.016 24c5.752 0 10.527-4.176 11.463-9.661.02-.149.035-.298.052-.448.232-1.994-.025-4.09-.753-5.844z" />
      </g>
    </svg>
  );
}

const LIB = [
  { title: "Pokemon Ultra Soleil — uniquement des Shiny", size: "1.2 GB", thumb: "/mockups/thumb-pokemon.jpg" },
  { title: "22 minutes pour sauver l'univers", size: "340 MB", thumb: "/mockups/thumb-fantasy.jpg" },
  { title: "1H46 pour t'expliquer le jeu qui m'a brisé", size: "2.1 GB", thumb: "/mockups/thumb-anime.jpg" },
  { title: "POKOPIA VA (vraiment) être exceptionnel", size: "520 MB", thumb: "/mockups/thumb-pokopia.jpg" },
];
const QUEUE = [
  { title: "1H46 pour t'expliquer le jeu qui m'a brisé", pct: 67, thumb: "/mockups/thumb-anime.jpg" },
  { title: "POKOPIA VA (vraiment) être exceptionnel", pct: 34, thumb: "/mockups/thumb-pokopia.jpg" },
];
const RESULTS = [
  { title: "1H46 pour t'expliquer le jeu qui m'a brisé", dur: "1:46:23", thumb: "/mockups/thumb-anime.jpg" },
  { title: "22 minutes pour sauver l'univers", dur: "22:14", thumb: "/mockups/thumb-fantasy.jpg" },
];

function NavBtn({ label, icon: Icon, active, onClick }: { label: string; icon: React.ComponentType<{ className?: string }>; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-3.5 py-2 rounded-lg text-[11px] font-medium transition-all duration-300 flex items-center gap-1.5 ${active ? "bg-[#8b3dff]/[0.18] text-white ring-1 ring-[#8b3dff]/45" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
      <Icon className="w-3 h-3" />{label}
    </button>
  );
}

export default function TubeForgeAppMockup() {
  const [tab, setTab] = useState<Tab>("download");
  const [mode, setMode] = useState<Mode>("url");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative rounded-[16px] overflow-hidden shadow-2xl shadow-black/40 select-none"
      style={{ background: "#100f14", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="absolute -top-[18%] left-[6%] w-[58%] h-[50%] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(139,61,255,0.16), transparent 70%)", filter: "blur(60px)" }} />
      <div className="absolute -bottom-[22%] right-[4%] w-[60%] h-[50%] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(226,56,31,0.13), transparent 70%)", filter: "blur(60px)" }} />

      {/* window chrome */}
      <div className="relative h-8 flex items-center px-3 gap-1.5" style={{ background: "rgba(0,0,0,0.35)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" /><div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" /><div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
      </div>

      {/* header */}
      <div className="relative z-10 px-5 py-3 flex items-center justify-between border-b border-white/[0.06]">
        <span className="w-8" aria-hidden="true" />
        <nav className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/[0.07]">
          <NavBtn label="Télécharger" icon={Download} active={tab === "download"} onClick={() => setTab("download")} />
          <NavBtn label="Bibliothèque" icon={Play} active={tab === "library"} onClick={() => setTab("library")} />
          <NavBtn label="Plugins" icon={Puzzle} active={tab === "plugins"} onClick={() => setTab("plugins")} />
        </nav>
        <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-green-400"><Youtube className="w-3.5 h-3.5" /> Connecté</span>
      </div>

      <div className="relative z-10 px-5 py-7 min-h-[460px]">

        {/* ── TÉLÉCHARGER ── */}
        {tab === "download" && (
          <div className="flex flex-col items-center">
            <div className="text-center mb-6 max-w-md">
              <h4 className="text-2xl md:text-[26px] font-bold tracking-tight text-white leading-[1.12]">De n&apos;importe quelle vidéo à ton <span className="tf-forge-flow">montage</span>.</h4>
              <p className="mt-2.5 text-xs md:text-sm text-white/45">Colle un lien, coupe ton extrait, envoie-le dans Premiere ou DaVinci.</p>
            </div>

            <div className="w-full max-w-lg rounded-3xl p-5 space-y-4" style={{ background: "#17161c", border: "1px solid rgba(255,255,255,0.08)" }}>
              {/* sous-onglets cliquables */}
              <div className="flex justify-center">
                <div className="relative flex w-[280px] bg-black/40 p-1 rounded-xl border border-white/[0.07]">
                  {([{ k: "url", l: "URL", I: Link2 }, { k: "search", l: "Recherche", I: Search }, { k: "script", l: "Script", I: FileText }] as const).map(({ k, l, I }) => {
                    const a = mode === k;
                    return (
                      <button key={k} onClick={() => setMode(k)} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${a ? "text-white bg-[#8b3dff]/[0.18] ring-1 ring-[#8b3dff]/45" : "text-white/50 hover:text-white/80"}`}>
                        <I className={`w-3 h-3 ${a ? "text-[#9b5cff]" : ""}`} />{l}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* contenu selon le sous-onglet */}
              {mode === "url" && (
                <div className="flex gap-2 items-center rounded-2xl p-2 pl-4 shadow-2xl" style={{ background: "#131316", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <span className="flex-1 min-w-0 truncate text-sm text-white/25 font-light">Colle un lien…</span>
                  <div className="h-6 w-px bg-white/10" />
                  <span className="text-[11px] font-medium text-white/70 flex items-center gap-1 shrink-0">1080p <ChevronDown className="w-3 h-3 text-white/40" /></span>
                  <div className="h-6 w-px bg-white/10" />
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white/[0.04] border border-white/10"><Folder className="w-3.5 h-3.5 text-white/40" /></span>
                  <span className="w-9 h-8 rounded-xl flex items-center justify-center shrink-0 text-white" style={{ background: "#4c1d95" }}><Search className="w-4 h-4" /></span>
                </div>
              )}

              {mode === "search" && (
                <div className="space-y-2.5">
                  <div className="flex gap-2 items-center rounded-2xl p-2 pl-4" style={{ background: "#131316", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <Search className="w-3.5 h-3.5 text-white/25 shrink-0" />
                    <span className="flex-1 min-w-0 truncate text-sm text-white/25 font-light">Rechercher une vidéo…</span>
                    <span className="w-9 h-8 rounded-xl flex items-center justify-center shrink-0 text-white" style={{ background: "#4c1d95" }}><Search className="w-4 h-4" /></span>
                  </div>
                  {RESULTS.map((r) => (
                    <div key={r.title} className="flex items-center gap-3 p-2 rounded-xl" style={{ background: "#131316", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <div className="relative w-16 h-10 rounded-md overflow-hidden shrink-0"><Image src={r.thumb} alt="" fill className="object-cover" unoptimized /></div>
                      <div className="flex-1 min-w-0"><p className="text-[11px] text-white/80 truncate">{r.title}</p><p className="text-[10px] text-white/35 font-mono">{r.dur}</p></div>
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#8b3dff]/15 border border-[#8b3dff]/30 text-[#b3a6ff]"><Download className="w-3.5 h-3.5" /></span>
                    </div>
                  ))}
                </div>
              )}

              {mode === "script" && (
                <div className="space-y-2.5">
                  <div className="rounded-2xl p-6 text-center border-2 border-dashed border-white/10" style={{ background: "#131316" }}>
                    <FileUp className="w-7 h-7 text-white/20 mx-auto mb-2" />
                    <p className="text-[11px] text-white/35">Glisse un fichier <span className="text-[#9b5cff] font-medium">.docx</span> — chaque lien sera récupéré</p>
                  </div>
                  <div className="rounded-xl p-3 text-[10px] text-white/25" style={{ background: "#131316", border: "1px solid rgba(255,255,255,0.07)" }}>Ou colle ton texte avec tes liens…</div>
                </div>
              )}

              <div className="pt-3.5 border-t border-white/[0.06] flex items-center justify-center gap-5">
                {["Premiere Pro", "Resolve", "Auto-open"].map((t) => (<span key={t} className="flex items-center gap-1.5 text-[11px] text-white/40"><span className="w-3 h-3 rounded-full border border-white/20" />{t}</span>))}
              </div>
            </div>

            {/* DL en cours (avec miniatures) */}
            <div className="w-full max-w-lg mt-5">
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2.5 flex items-center gap-2"><Loader2 className="w-3 h-3 text-[#9b5cff] animate-spin" /> 2 téléchargements en cours</p>
              <div className="space-y-2">
                {QUEUE.map((q) => (
                  <div key={q.title} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: "#16141d", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="relative w-12 h-8 rounded-md overflow-hidden shrink-0"><Image src={q.thumb} alt="" fill className="object-cover" unoptimized /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2"><span className="text-[11px] text-white/80 truncate">{q.title}</span><span className="text-[11px] text-[#9b5cff] font-medium shrink-0">{q.pct}%</span></div>
                      <div className="mt-1.5 h-1 rounded-full overflow-hidden bg-white/[0.08]"><div className="h-full rounded-full" style={{ width: `${q.pct}%`, background: "linear-gradient(90deg,#7c5cf5,#a06bff)" }} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── BIBLIOTHÈQUE (miniatures) ── */}
        {tab === "library" && (
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-3">Bibliothèque · {LIB.length} vidéos</p>
            <div className="grid grid-cols-2 gap-3">
              {LIB.map((it) => (
                <div key={it.title} className="rounded-xl overflow-hidden group/card" style={{ background: "#16141d", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="aspect-video relative">
                    <Image src={it.thumb} alt={it.title} fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.35)" }}><Play className="w-5 h-5 text-white" /></div>
                    <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold text-white/80 bg-black/60">MP4</span>
                  </div>
                  <div className="p-2"><p className="text-[10px] text-white/75 truncate">{it.title}</p><p className="text-[9px] text-white/35 mt-0.5">{it.size}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PLUGINS ── */}
        {tab === "plugins" && (
          <div className="space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">Plugins & intégrations</p>
            <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: "#17161c", border: "1px solid rgba(255,255,255,0.08)" }}>
              <PremiereLogo s={40} />
              <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-white truncate">TubeForge pour Premiere Pro</p><p className="text-[11px] text-white/40">Adobe Premiere Pro · v1.0.69</p></div>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-green-300 bg-green-500/10 border border-green-500/20 shrink-0"><Check className="w-3.5 h-3.5" /> Installé</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: "#17161c", border: "1px solid rgba(255,255,255,0.08)" }}>
              <ResolveLogo s={40} />
              <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-white truncate">TubeForge pour DaVinci Resolve</p><p className="text-[11px] text-white/40">DaVinci Resolve Studio · v2.11.9</p></div>
              <span className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-white bg-[#8b3dff]/90 shrink-0">Installer</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: "#17161c", border: "1px solid rgba(255,255,255,0.08)" }}>
              <FirefoxLogo s={40} />
              <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-white truncate">Extension navigateur</p><p className="text-[11px] text-white/40">Firefox · envoie un lien en 1 clic vers TubeForge</p></div>
              <span className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-white bg-[#8b3dff]/90 shrink-0">Installer</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-white/35 pt-1"><Scissors className="w-3.5 h-3.5 text-[#f0654a]" /> Tes extraits arrivent direct sur la timeline de l&apos;app active.</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
