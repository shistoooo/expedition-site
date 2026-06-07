"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Link2, Upload, Focus, Crop, TrendingUp, Anchor, Eye } from "lucide-react";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ClipForgeMockup() {
  const [inputTab, setInputTab] = useState<"youtube" | "local">("youtube");
  const [cropMode, setCropMode] = useState<"smart" | "verify">("smart");
  const [subStyle, setSubStyle] = useState("Pop");
  const [subColor, setSubColor] = useState("#FFFFFF");

  const colors = ['#FFFFFF', '#FACC15', '#22D3EE', '#EF4444', '#22C55E', '#EC4899', '#FBBF24'];
  const clips = [
    { score: 94, title: "J'ai vendu 500 mille albums", duration: "0:42", hook: 91, retention: 88, video: "/mockups/clip-1.mp4" },
    { score: 87, title: "Acceptez-vous ?", duration: "0:31", hook: 85, retention: 82, video: "/mockups/clip-2.mp4" },
    { score: 91, title: "Le moment où tout a changé", duration: "0:38", hook: 89, retention: 85, video: "/mockups/clip-3.mp4" },
    { score: 82, title: "Personne ne s'y attendait", duration: "0:27", hook: 78, retention: 80, video: "/mockups/review-clip.mp4" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative rounded-[20px] overflow-hidden shadow-2xl shadow-indigo-500/10 select-none"
      style={{ background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Window chrome */}
      <div className="h-8 flex items-center px-3 gap-1.5" style={{ background: '#12121a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="text-[10px] text-white/25 ml-2 font-medium tracking-wide">ClipForge</span>
      </div>

      <div className="p-3 space-y-2.5">
        {/* Tab switcher — YouTube | Fichier Local */}
        <div className="flex gap-1.5">
          {(["youtube", "local"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setInputTab(tab)}
              className={`flex-1 py-1.5 px-3 rounded-lg text-center text-[10px] font-medium flex items-center justify-center gap-1 transition-all duration-200 ${
                inputTab === tab
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-white/40 hover:text-white/60'
              }`}
              style={inputTab !== tab ? { background: 'rgba(255,255,255,0.03)' } : {}}
            >
              {tab === "youtube" ? <><Link2 className="w-3 h-3" /> YouTube</> : <><Upload className="w-3 h-3" /> Local</>}
            </button>
          ))}
        </div>

        {/* URL Input */}
        <div className="flex items-center gap-0 p-[5px] rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex-1 flex items-center px-2.5 gap-1.5">
            {inputTab === "youtube" ? (
              <>
                <Link2 className="w-3.5 h-3.5 text-white/25 shrink-0" />
                <span className="text-[10px] text-white/25">Collez un lien YouTube...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-white/25 shrink-0" />
                <span className="text-[10px] text-white/25">Glissez un fichier...</span>
              </>
            )}
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-medium flex items-center gap-1 shadow-lg shadow-indigo-500/25 cursor-pointer hover:brightness-110 transition-all">
            G&eacute;n&eacute;rer
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Options row — Crop mode + Subtitle in one row */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg p-0.5 gap-0.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {(["smart", "verify"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setCropMode(m)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-medium transition-all duration-200 ${
                  cropMode === m
                    ? 'text-indigo-300'
                    : 'text-white/40 hover:text-white/60 border border-transparent'
                }`}
                style={cropMode === m ? { background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.35)' } : {}}
              >
                {m === "smart" ? <><Focus className="w-2.5 h-2.5" /> Smart Crop</> : <><Crop className="w-2.5 h-2.5" /> V&eacute;rif.</>}
              </button>
            ))}
          </div>
          <div className="flex gap-0.5 items-center ml-auto">
            {["Pop", "Smooth", "Glow"].map((s) => (
              <button
                key={s}
                onClick={() => setSubStyle(s)}
                className={`px-1.5 py-0.5 rounded-md text-[7px] font-medium border transition-all duration-200 ${
                  subStyle === s
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                    : 'text-white/35 border-transparent hover:text-white/55'
                }`}
                style={subStyle !== s ? { background: 'rgba(255,255,255,0.03)' } : {}}
              >
                {s}
              </button>
            ))}
            <div className="flex gap-px items-center ml-1">
              {colors.slice(0, 5).map((c) => (
                <button
                  key={c}
                  onClick={() => setSubColor(c)}
                  className={`w-2 h-2 rounded-full transition-all duration-150 ${subColor === c ? 'ring-[1px] ring-white ring-offset-1 ring-offset-transparent scale-110' : 'opacity-60 hover:opacity-90'}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Results strip — compact clip cards */}
        <div className="grid grid-cols-2 gap-2">
          {clips.map((clip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.12, ease: easeOutExpo }}
              className="flex-1 flex items-center gap-2.5 p-2.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {/* Mini 9:16 thumbnail */}
              <div className="shrink-0 w-[72px] h-[128px] rounded-lg overflow-hidden relative" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  src={clip.video}
                />
              </div>
              {/* Info */}
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-[9px] text-white/80 font-semibold truncate">{clip.title}</p>
                <div className="flex items-center gap-2 text-[8px]">
                  <span className={`px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-0.5 ring-1 bg-gradient-to-r ${clip.score >= 90 ? 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 ring-emerald-500/30' : 'from-amber-500/20 to-amber-500/5 text-amber-400 ring-amber-500/30'}`}>
                    <TrendingUp className="w-2 h-2" />
                    {clip.score}
                  </span>
                  <span className="text-white/30">{clip.duration}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[7px] text-white/40">
                  <span className="flex items-center gap-0.5"><Anchor className="w-2 h-2 text-blue-400" /> Hook: <span className="text-blue-300 font-bold">{clip.hook}</span></span>
                  <span className="flex items-center gap-0.5"><Eye className="w-2 h-2 text-pink-400" /> Ret: <span className="text-pink-300 font-bold">{clip.retention}</span></span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
