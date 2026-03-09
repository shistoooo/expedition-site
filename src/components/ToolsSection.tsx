"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Link2, Upload, Focus, Crop, TrendingUp, Anchor, Eye, Download, Edit, Trash2, Play, ScanFace, Type, Sparkles } from "lucide-react";

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
    { score: 94, title: "Le moment cl\u00e9", duration: "0:42", hook: 91, retention: 88, video: "/mockups/clip-1.mp4" },
    { score: 87, title: "R\u00e9action \u00e9pique", duration: "0:31", hook: 85, retention: 82, video: "/mockups/clip-2.mp4" },
    { score: 78, title: "Conseil #1", duration: "0:55", hook: 72, retention: 80, video: "/mockups/clip-3.mp4" },
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

      <div className="p-5 space-y-4">
        {/* Tab switcher — YouTube | Fichier Local */}
        <div className="flex gap-2">
          {(["youtube", "local"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setInputTab(tab)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-center text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-200 ${
                inputTab === tab
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-white/40 hover:text-white/60'
              }`}
              style={inputTab !== tab ? { background: 'rgba(255,255,255,0.03)' } : {}}
            >
              {tab === "youtube" ? <><Link2 className="w-3.5 h-3.5" /> YouTube</> : <><Upload className="w-3.5 h-3.5" /> Fichier Local</>}
            </button>
          ))}
        </div>

        {/* URL Input */}
        <div className="flex items-center gap-0 p-[6px] rounded-[20px]" style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex-1 flex items-center px-3 gap-2">
            {inputTab === "youtube" ? (
              <>
                <Link2 className="w-4 h-4 text-white/25 shrink-0" />
                <span className="text-[11px] text-white/25">Collez un lien YouTube...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-white/25 shrink-0" />
                <span className="text-[11px] text-white/25">Glissez un fichier ou cliquez...</span>
              </>
            )}
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[11px] font-medium flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 cursor-pointer hover:brightness-110 transition-all">
            G&eacute;n&eacute;rer
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Options row — Crop mode */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded-xl p-0.5 gap-0.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {(["smart", "verify"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setCropMode(m)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-200 ${
                  cropMode === m
                    ? 'text-indigo-300'
                    : 'text-white/40 hover:text-white/60 border border-transparent'
                }`}
                style={cropMode === m ? { background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.35)' } : {}}
              >
                {m === "smart" ? <><Focus className="w-3 h-3" /> Smart Crop</> : <><Crop className="w-3 h-3" /> V&eacute;rification</>}
              </button>
            ))}
          </div>
        </div>

        {/* Subtitle customizer */}
        <div className="flex items-center gap-3 p-3 rounded-[20px]" style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Mini 9:16 preview */}
          <div className="shrink-0 w-[36px] h-[64px] rounded-md overflow-hidden relative flex items-end justify-center" style={{ background: 'linear-gradient(to bottom, rgba(30,30,40,0.8), #000)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="mb-2">
              <SubtitlePreview style={subStyle} />
            </div>
          </div>
          {/* Style + Color */}
          <div className="flex-1 space-y-1.5">
            <div className="flex gap-0.5 flex-wrap">
              {["Pop", "Smooth", "Glow", "Classique"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSubStyle(s)}
                  className={`px-1.5 py-0.5 rounded-md text-[8px] font-medium border transition-all duration-200 ${
                    subStyle === s
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                      : 'text-white/35 border-transparent hover:text-white/55'
                  }`}
                  style={subStyle !== s ? { background: 'rgba(255,255,255,0.03)' } : {}}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-0.5 items-center">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSubColor(c)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-150 ${subColor === c ? 'ring-[1.5px] ring-white ring-offset-1 ring-offset-transparent scale-110' : 'opacity-60 hover:opacity-90'}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Results grid — 3 clip cards */}
        <div className="grid grid-cols-3 gap-2">
          {clips.map((clip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.12, ease: easeOutExpo }}
              className="rounded-xl overflow-hidden group"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {/* 9:16 preview area */}
              <div className="aspect-[9/16] relative flex items-center justify-center overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  src={clip.video}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-black/20" />
                <div className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[8px] font-semibold flex items-center gap-0.5 ring-1 bg-gradient-to-r ${clip.score >= 90 ? 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 ring-emerald-500/30' : clip.score >= 80 ? 'from-amber-500/20 to-amber-500/5 text-amber-400 ring-amber-500/30' : 'from-orange-500/20 to-orange-500/5 text-orange-400 ring-orange-500/30'}`}>
                  <TrendingUp className="w-2 h-2" />
                  {clip.score}
                </div>
                <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[8px] text-white/80 font-medium">
                  {clip.duration}
                </div>
              </div>

              {/* Info */}
              <div className="p-2 space-y-1.5">
                <p className="text-[9px] text-white/80 font-semibold truncate">{clip.title}</p>
                <div className="grid grid-cols-2 gap-1">
                  <div className="flex items-center gap-0.5 text-[7px] text-white/50 rounded-md px-1 py-0.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <Anchor className="w-2 h-2 text-blue-400" />
                    <span>Hook: <span className="text-blue-300 font-bold">{clip.hook}</span></span>
                  </div>
                  <div className="flex items-center gap-0.5 text-[7px] text-white/50 rounded-md px-1 py-0.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <Eye className="w-2 h-2 text-pink-400" />
                    <span>Ret: <span className="text-pink-300 font-bold">{clip.retention}</span></span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-[8px] font-medium text-white cursor-pointer hover:brightness-110 transition-all">
                    <Download className="w-2.5 h-2.5" />
                  </div>
                  <div className="p-1 rounded-lg text-white/30 hover:text-white/60 transition-colors cursor-pointer" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <Edit className="w-2.5 h-2.5" />
                  </div>
                  <div className="p-1 rounded-lg text-white/20 hover:text-red-400/60 transition-colors cursor-pointer" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <Trash2 className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function ToolsSection() {
  return (
    <section id="clipforge" className="py-32 md:py-40 relative section-fade-top">
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
            <p className="text-xs font-mono uppercase tracking-widest text-purple-400/60 mb-6 flex items-center gap-2">
              <span className="w-3 h-px bg-purple-400/50 inline-block" />
              Vague 2 &mdash; Beta
            </p>

            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-[-0.03em]">
              Clip<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Forge</span>
            </h2>
            <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed">
              Collez un lien YouTube. ClipForge trouve les moments viraux, recadre, sous-titre et exporte vos clips pr&ecirc;ts &agrave; poster.
            </p>

            <motion.ul
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-5 mb-10"
            >
              {[
                { icon: Sparkles, title: "L\u2019IA trouve vos meilleurs moments", desc: "Analyse sp\u00e9cialis\u00e9e selon votre contenu : gaming, podcast, tuto, vlog. Elle d\u00e9tecte les punchlines, les r\u00e9actions, les fails \u2014 pas juste les silences." },
                { icon: TrendingUp, title: "Score de viralit\u00e9, hook et r\u00e9tention", desc: "Chaque clip est not\u00e9 sur 100. Vous voyez en un coup d\u2019\u0153il quels extraits vont performer et lesquels sont \u00e0 jeter." },
                { icon: ScanFace, title: "Recadrage intelligent qui suit le visage", desc: "Le cadrage 9:16 suit votre visage frame par frame. Smooth, sans saccade, avec un lissage cin\u00e9matographique. Vous restez toujours au centre." },
                { icon: Type, title: "Sous-titres anim\u00e9s, \u00e9ditables", desc: "4 styles d\u2019animation (Pop, Smooth, Glow, Classique), couleurs personnalisables, \u00e9diteur int\u00e9gr\u00e9. Modifiez un mot, reg\u00e9n\u00e9rez le clip en un clic." },
              ].map((item, i) => (
                <motion.li key={i} variants={itemVariants} className="flex gap-4 group/item">
                  <div className="mt-1 w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10 transition-all duration-300 group-hover/item:bg-indigo-500/10 group-hover/item:border-indigo-500/25 group-hover/item:shadow-[0_0_20px_rgba(99,102,241,0.12)]">
                    <item.icon className="w-4 h-4 text-purple-400 transition-transform duration-300 group-hover/item:scale-110" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>

            <a
              href="/pricing"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:shadow-[0_0_50px_rgba(168,85,247,0.45),0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:scale-[1.03] active:scale-[0.98]"
            >
              Obtenir ClipForge <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1.5" />
            </a>
          </div>

          {/* Mockup */}
          <div className="flex-1 w-full relative">
            {/* Indigo-purple nebula — ClipForge identity */}
            <div className="absolute -inset-5 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.07) 0%, rgba(139,92,246,0.04) 40%, transparent 70%)', filter: 'blur(60px)' }} />
            <ClipForgeMockup />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
