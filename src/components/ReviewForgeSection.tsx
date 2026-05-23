"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Eye, Clock, Lock, Link2, Copy, Check, Zap, LayoutDashboard, FolderOpen, Share2, Wifi, Play, MessageSquare, Send, Film } from "lucide-react";
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

interface ReviewComment {
  author: string;
  initials: string;
  color: string;
  time: string;
  timeSec: number;
  body: string;
  ago: string;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function ReviewForgeMockup() {
  const [side, setSide] = useState<"creator" | "reviewer">("reviewer");
  const [page, setPage] = useState<"dashboard" | "share">("dashboard");
  const [copied, setCopied] = useState(false);

  // Reviewer interactive state
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(8);
  const [isPlaying, setIsPlaying] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [reviewComments, setReviewComments] = useState<ReviewComment[]>([
    { author: "Lucas", initials: "LU", color: "#6366f1", time: "02:34", timeSec: 2.5, body: "Le cut ici est trop brusque, on peut adoucir la transition ?", ago: "il y a 12min" },
    { author: "Emma", initials: "EM", color: "#8b5cf6", time: "05:12", timeSec: 5, body: "J\u2019adore ce passage ! On le garde tel quel.", ago: "il y a 8min" },
    { author: "Lucas", initials: "LU", color: "#6366f1", time: "08:47", timeSec: 7, body: "La musique est un peu forte par rapport \u00e0 la voix ici.", ago: "il y a 3min" },
  ]);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setIsPlaying(true); }
    else { v.pause(); setIsPlaying(false); }
  }, []);

  const seekTo = useCallback((seconds: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = seconds;
    setCurrentTime(seconds);
  }, []);

  const handleTimelineClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekTo(pct * duration);
  }, [duration, seekTo]);

  const addComment = useCallback(() => {
    if (!commentText.trim()) return;
    const newComment: ReviewComment = {
      author: "Vous",
      initials: "VO",
      color: "#10b981",
      time: formatTime(currentTime),
      timeSec: currentTime,
      body: commentText.trim(),
      ago: "à l'instant",
    };
    setReviewComments(prev => [...prev, newComment].sort((a, b) => a.timeSec - b.timeSec));
    setCommentText("");
  }, [commentText, currentTime]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || side !== "reviewer") return;
    const onTime = () => setCurrentTime(v.currentTime);
    const onDur = () => setDuration(v.duration || 8);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onDur);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onDur);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [side]);

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
      className="relative rounded-[20px] overflow-hidden shadow-2xl shadow-emerald-500/10 select-none"
      style={{ background: '#0c0c12', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Side toggle */}
      <div className="flex items-center justify-center gap-1 p-2" style={{ background: '#08080c', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {(["creator", "reviewer"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSide(s)}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
              side === s ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'
            }`}
          >
            {s === "creator" ? "C\u00f4t\u00e9 cr\u00e9ateur" : "C\u00f4t\u00e9 reviewer"}
          </button>
        ))}
      </div>

      {side === "reviewer" ? (
        /* ── Reviewer view (interactive) ── */
        <div className="flex" style={{ minHeight: 440 }}>
          {/* Video area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.18)' }}>
                  <Film className="w-3 h-3 text-indigo-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-white/80 font-semibold truncate">Montage_Final_v3</p>
                  <p className="text-[8px] text-white/35">Partagé par Mohamed — pour Lucas</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded-full text-[8px] font-medium" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', color: 'rgba(99,102,241,0.8)' }}>{reviewComments.length} notes</span>
                <span className="px-2 py-0.5 rounded-full text-[8px] font-bold" style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)', color: 'rgba(99,102,241,0.8)', letterSpacing: '0.04em' }}>ReviewForge</span>
              </div>
            </div>

            {/* Video player — click to play/pause */}
            <div className="flex-1 relative bg-black flex items-center justify-center min-h-[200px] cursor-pointer" onClick={togglePlay}>
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-contain"
                src="/mockups/review-clip.mp4"
              />
              {/* Play/pause overlay on hover */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-5 h-5 text-white ml-0.5" fill="white" strokeWidth={0} />
                  </div>
                </div>
              )}
              {/* Watermark */}
              <div className="absolute top-[25%] left-[15%] pointer-events-none select-none z-[5]">
                <span className="text-[11px] font-medium text-white/[0.15]" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>Lucas — 06 Mar 2026</span>
              </div>
            </div>

            {/* Interactive Timeline */}
            <div className="px-3 py-2" style={{ background: 'rgba(8,8,16,0.98)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <button onClick={togglePlay} className="hover:opacity-80 transition-opacity">
                  {isPlaying
                    ? <span className="flex items-center gap-[2px]"><span className="w-[3px] h-3 bg-white rounded-sm" /><span className="w-[3px] h-3 bg-white rounded-sm" /></span>
                    : <Play className="w-3 h-3 text-white" fill="white" strokeWidth={0} />
                  }
                </button>
                <span className="text-[9px] text-white/40 font-mono">{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>
              <div
                ref={timelineRef}
                className="relative h-2 rounded-full cursor-pointer group"
                style={{ background: 'rgba(255,255,255,0.08)' }}
                onClick={handleTimelineClick}
              >
                {/* Progress */}
                <div className="absolute h-full rounded-full transition-[width] duration-100" style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
                {/* Comment markers */}
                {reviewComments.map((c, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 cursor-pointer hover:scale-125 transition-transform z-[2]"
                    style={{ left: `${duration > 0 ? (c.timeSec / duration) * 100 : 0}%`, background: c.color, borderColor: 'rgba(8,8,16,0.9)', boxShadow: '0 0 6px rgba(99,102,241,0.4)' }}
                    onClick={(e) => { e.stopPropagation(); seekTo(c.timeSec); }}
                    title={`${c.author}: ${c.body}`}
                  />
                ))}
                {/* Playhead */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full z-[3] transition-[left] duration-100" style={{ left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`, boxShadow: '0 0 0 2px rgba(99,102,241,0.4), 0 2px 8px rgba(0,0,0,0.5)' }} />
              </div>
            </div>
          </div>

          {/* Comment panel */}
          <div className="w-[100px] sm:w-[120px] shrink-0 flex flex-col" style={{ background: 'rgba(11,11,20,0.97)', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Header */}
            <div className="flex items-center gap-1.5 px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <MessageSquare className="w-3 h-3 text-indigo-500" />
              <span className="text-[10px] font-semibold text-white/80">Commentaires</span>
              <span className="px-1 py-0.5 rounded-full text-[8px] font-mono text-indigo-400" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>{reviewComments.length}</span>
            </div>

            {/* Comments list — scrollbar masquée pour ne pas polluer le mockup */}
            <div
              className="flex-1 overflow-y-auto px-2 py-2 space-y-1.5 [&::-webkit-scrollbar]:hidden"
              style={{ maxHeight: 220, scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {reviewComments.map((c, i) => {
                const isActive = Math.abs(currentTime - c.timeSec) < 0.8;
                return (
                  <div
                    key={`${c.timeSec}-${c.body.slice(0,10)}-${i}`}
                    className="p-2 rounded-lg cursor-pointer transition-all hover:bg-white/[0.04]"
                    style={{ background: isActive ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isActive ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)'}` }}
                    onClick={() => seekTo(c.timeSec)}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center text-[6px] font-bold text-white shrink-0" style={{ background: c.color }}>{c.initials}</div>
                      <span className="text-[8px] font-semibold text-white/70 flex-1 truncate">{c.author}</span>
                      <span className="text-[7px] font-mono px-1 py-0.5 rounded" style={{ background: isActive ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.08)', color: '#818cf8' }}>{c.time}</span>
                    </div>
                    <p className="text-[8px] text-white/50 leading-relaxed line-clamp-2 pl-[22px]">{c.body}</p>
                    <p className="text-[7px] text-white/25 pl-[22px] mt-0.5">{c.ago}</p>
                  </div>
                );
              })}
            </div>

            {/* Add comment form — functional */}
            <div className="px-2 py-2 space-y-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,8,16,0.6)' }}>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" style={{ boxShadow: '0 0 6px rgba(99,102,241,0.6)' }} />
                <span className="text-[8px] text-white/35">Note à <span className="text-indigo-400 font-mono">{formatTime(currentTime)}</span></span>
              </div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addComment(); } }}
                placeholder="Ajouter une note..."
                className="w-full h-10 rounded-md px-2 py-1.5 text-[8px] text-white/80 placeholder-white/15 resize-none outline-none"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              />
              <div className="flex items-center justify-between">
                <span className="text-[7px] text-white/20">⏎ envoyer</span>
                <button
                  onClick={addComment}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-[8px] font-semibold transition-all"
                  style={{ background: commentText.trim() ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.15)', color: commentText.trim() ? 'white' : 'rgba(255,255,255,0.4)' }}
                >
                  Envoyer <Send className="w-2 h-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
      /* ── Creator view ── */
      <div className="flex" style={{ minHeight: 440 }}>
      {/* Sidebar */}
      <div className="w-[52px] sm:w-[100px] shrink-0 flex flex-col border-r border-white/5" style={{ background: '#08080c' }}>
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
                <code className="flex-1 text-[8px] text-white/50 font-mono truncate bg-black/20 px-2 py-1.5 rounded-md">https://review.expeditionlauncher.store/s/xK9mQ2...</code>
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
      </div>
      )}
    </motion.div>
  );
}

type ReviewForgeSectionProps = {
  /** "vertical" (default) = texte au-dessus, mockup en dessous. "horizontal" = texte | mockup côte à côte sur lg+ */
  layout?: "vertical" | "horizontal";
  /** Si true : mockup flouté + overlay "Arrive prochainement" + CTA "Voir plus" vers /tools. Pour la home. */
  blurred?: boolean;
};

export default function ReviewForgeSection({ layout = "vertical", blurred = false }: ReviewForgeSectionProps = {}) {
  const horizontal = layout === "horizontal";
  return (
    <motion.div
      id="reviewforge"
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
        <p className="text-xs font-mono uppercase tracking-widest text-emerald-400/60 mb-4 flex items-center gap-2">
          <span className="w-3 h-px bg-emerald-400/50 inline-block" />
          Vague 3 &mdash; Prochainement
        </p>

        <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-[-0.03em]">
          Review<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Forge</span>
        </h2>
        <p className="text-xs text-white/35 mb-4 font-mono uppercase tracking-wider">L&apos;alternative &agrave; Frame.io</p>
        <p className="text-base text-white/60 mb-6 leading-relaxed">
          Partagez vos montages en cours avec vos clients ou votre &eacute;quipe. S&eacute;curis&eacute;, temporaire, sans upload.
        </p>

        <motion.ul
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4 mb-7"
        >
          {[
            { icon: Shield, title: "Vos vid\u00e9os restent sur votre machine", desc: "Tunnel s\u00e9curis\u00e9 direct, pas d\u2019upload cloud." },
            { icon: Clock, title: "Liens qui s\u2019auto-d\u00e9truisent", desc: "Expiration, max de vues, mot de passe." },
            { icon: Eye, title: "Suivi en temps r\u00e9el", desc: "Qui a regard\u00e9, quand, combien de vues." },
            { icon: Link2, title: "Un lien, un clic", desc: "Rien \u00e0 installer c\u00f4t\u00e9 reviewer." },
          ].map((item, i) => (
            <motion.li key={i} variants={itemVariants} className="flex gap-3 group/item">
              <div className="mt-0.5 w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                <item.icon className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                <p className="text-white/45 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        <Link
          href="/pricing"
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-sm border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_8px_24px_rgba(16,185,129,0.2)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.1),0_12px_40px_rgba(16,185,129,0.35)] transition-all duration-200 hover:translate-y-[-1px] active:translate-y-[1px]"
        >
          R&eacute;server ma place &mdash; tarif bloqu&eacute; &agrave; vie <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Mockup — taille naturelle, pas de container fixe ni badge floating (statut dans l'eyebrow "Vague 3 — En développement") */}
      <div
        className={`group relative transition-all duration-500 hover:-translate-y-1 ${
          horizontal ? "w-full lg:flex-[1.3]" : "w-full"
        }`}
      >
        {/* Emerald-cyan nebula — ReviewForge identity glow. Intensifies on hover. */}
        <div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] rounded-full pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.12) 0%, rgba(34,211,238,0.05) 40%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Mockup — flou très subtil (2px) sur la home pour signaler "à venir" sans cacher le mockup */}
        <div className={blurred ? "blur-[2px] pointer-events-none select-none transition-all duration-500" : ""}>
          <ReviewForgeMockup />
        </div>
        {/* Badge "Arrive prochainement" — affiché uniquement quand blurred=true */}
        {blurred && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div
              className="px-5 py-2.5 rounded-full text-white font-semibold text-sm shadow-2xl backdrop-blur-xl"
              style={{
                background: "rgba(16,185,129,0.20)",
                border: "1px solid rgba(52,211,153,0.45)",
                boxShadow: "0 0 40px rgba(16,185,129,0.35), 0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              Arrive prochainement
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
