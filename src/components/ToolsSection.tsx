"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bell, Link2, Upload, Focus, Crop, TrendingUp, Anchor, Eye, Download, Edit, Trash2, Play, ScanFace, Type, Sparkles } from "lucide-react";

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

function SubtitlePreview({ style }: { style: string }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => setVisible(v => !v), 1800);
    return () => clearInterval(interval);
  }, []);

  const animations: Record<string, React.CSSProperties> = {
    Pop: {
      transform: visible ? 'scale(1)' : 'scale(0.85)',
      opacity: visible ? 1 : 0,
      transition: 'transform 0.14s cubic-bezier(0.34,1.56,0.64,1), opacity 0.1s',
      textShadow: '0 1px 3px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.5)',
    },
    Smooth: {
      transform: visible ? 'translateY(0)' : 'translateY(4px)',
      opacity: visible ? 1 : 0,
      transition: 'transform 0.15s ease-out, opacity 0.15s',
      background: 'rgba(0,0,0,0.5)',
      padding: '1px 4px',
      borderRadius: '2px',
    },
    Glow: {
      opacity: visible ? 1 : 0.3,
      transition: 'opacity 0.3s',
      textShadow: '0 0 8px rgba(255,255,255,0.6), 0 0 16px rgba(255,255,255,0.3)',
    },
    Classique: {
      opacity: 1,
      color: '#FACC15',
    },
  };

  return (
    <span
      className="text-[5px] font-bold uppercase tracking-wide text-center whitespace-nowrap"
      style={{ color: '#fff', ...animations[style] }}
    >
      REGARDEZ
    </span>
  );
}

function ClipForgeMockup() {
  const [inputTab, setInputTab] = useState<"youtube" | "local">("youtube");
  const [cropMode, setCropMode] = useState<"smart" | "verify">("smart");
  const [subStyle, setSubStyle] = useState("Pop");
  const [subColor, setSubColor] = useState("#FFFFFF");

  const colors = ['#FFFFFF', '#FACC15', '#22D3EE', '#EF4444', '#22C55E', '#EC4899', '#FBBF24'];
  const clips = [
    { score: 94, title: "J'ai vendu 500 mille albums", duration: "0:42", hook: 91, retention: 88, video: "/mockups/clip-1.mp4" },
    { score: 87, title: "Acceptez-vous ?", duration: "0:31", hook: 85, retention: 82, video: "/mockups/clip-2.mp4" },
    { score: 91, title: "Le moment o\u00f9 tout a chang\u00e9", duration: "0:38", hook: 89, retention: 85, video: "/mockups/clip-3.mp4" },
    { score: 82, title: "Personne ne s'y attendait", duration: "0:27", hook: 78, retention: 80, video: "/mockups/review-clip.mp4" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative rounded-[20px] overflow-hidden shadow-2xl shadow-indigo-500/10 select-none h-full"
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

type ToolsSectionProps = {
  /** "vertical" (default) = texte au-dessus, mockup en dessous. "horizontal" = texte | mockup côte à côte sur lg+ */
  layout?: "vertical" | "horizontal";
};

export default function ToolsSection({ layout = "vertical" }: ToolsSectionProps = {}) {
  const horizontal = layout === "horizontal";
  return (
    <motion.div
      id="clipforge"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={
        horizontal
          ? "relative flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16 h-full"
          : "relative flex flex-col h-full"
      }
    >
      {/* Text */}
      <div className={horizontal ? "text-left lg:flex-1" : "text-left mb-8"}>
        <p className="text-xs font-mono uppercase tracking-widest text-purple-400/60 mb-4 flex items-center gap-2">
          <span className="w-3 h-px bg-purple-400/50 inline-block" />
          Vague 2 &mdash; Prochainement
        </p>

        <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-[-0.03em]">
          Clip<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Forge</span>
        </h2>
        <p className="text-xs text-white/35 mb-4 font-mono uppercase tracking-wider">L&apos;alternative &agrave; OpusClip</p>
        <p className="text-base text-white/60 mb-6 leading-relaxed">
          Collez un lien YouTube. ClipForge trouve les moments viraux, recadre, sous-titre et exporte vos clips pr&ecirc;ts &agrave; poster.
        </p>

        <motion.ul
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-3 mb-6"
        >
          {[
            { icon: Sparkles, title: "L\u2019IA trouve vos meilleurs moments", desc: "Analyse sp\u00e9cialis\u00e9e selon votre contenu : gaming, podcast, tuto, vlog." },
            { icon: TrendingUp, title: "Score de viralit\u00e9, hook et r\u00e9tention", desc: "Chaque clip est not\u00e9 sur 100. Voyez quels extraits vont performer." },
            { icon: ScanFace, title: "Recadrage intelligent qui suit le visage", desc: "Le cadrage 9:16 suit votre visage frame par frame, sans saccade." },
            { icon: Type, title: "Sous-titres anim\u00e9s, \u00e9ditables", desc: "4 styles, couleurs personnalisables, \u00e9diteur int\u00e9gr\u00e9." },
          ].map((item, i) => (
            <motion.li key={i} variants={itemVariants} className="flex gap-3 group/item">
              <div className="mt-0.5 w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                <item.icon className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                <p className="text-white/45 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        <a
          href="/pricing"
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-sm border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_24px_rgba(168,85,247,0.2)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_12px_40px_rgba(168,85,247,0.35)] transition-all duration-200 hover:translate-y-[-1px] active:translate-y-[1px]"
        >
          &Ecirc;tre pr&eacute;venu au lancement <Bell className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
        </a>
      </div>

      {/* Mockup */}
      <div className={`relative rounded-[20px] h-[480px] overflow-hidden ${horizontal ? "w-full lg:flex-1" : "w-full"}`}>
        {/* Indigo-purple nebula — ClipForge identity */}
        <div className="absolute -inset-5 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)', filter: 'blur(80px)' }} />
        <ClipForgeMockup />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#06051a] to-transparent pointer-events-none z-10" />
        {/* Coming soon overlay */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[1px] rounded-[20px]">
          <div className="px-5 py-2.5 rounded-full border border-purple-400/30 bg-purple-500/10 backdrop-blur-sm">
            <span className="text-sm font-bold text-purple-300 tracking-wide uppercase">Disponible prochainement</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
