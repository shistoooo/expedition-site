"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Video,
  Download,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Scissors,
  Zap,
  FileText,
  ArrowRight,
  X,
  Clock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useDownloadStore } from "@/stores/useDownloadStore";
import UpgradeCTA from "./UpgradeCTA";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatSpeed(bytesPerSecond: number): string {
  if (bytesPerSecond < 1024 * 1024) return `${(bytesPerSecond / 1024).toFixed(0)} KB/s`;
  return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`;
}

export default function TubeForgeWeb() {
  const [inputUrl, setInputUrl] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    status,
    videoInfo,
    progress,
    speed,
    downloaded,
    totalSize,
    elapsedSeconds,
    error,
    dailyCount,
    dailyLimit,
    setStatus,
    setVideoInfo,
    setProgress,
    setSpeed,
    setDownloaded,
    setTotalSize,
    setElapsedSeconds,
    setError,
    incrementDailyCount,
    initDailyCount,
    reset,
  } = useDownloadStore();

  useEffect(() => {
    initDailyCount();
  }, [initDailyCount]);

  const handleResolve = useCallback(async () => {
    if (!inputUrl.trim()) return;
    if (dailyCount >= dailyLimit) {
      setStatus("limit-reached");
      return;
    }

    setHasInteracted(true);
    reset();
    setIsResolving(true);
    setStatus("resolving");

    try {
      const res = await fetch("/api/download/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.limitReached) {
          setStatus("limit-reached");
        } else {
          setError(data.error || "Erreur inconnue");
        }
        return;
      }

      setVideoInfo({
        title: data.title,
        thumbnail: data.thumbnail,
        duration: data.duration || "",
        durationSeconds: data.durationSeconds || 0,
        url: data.downloadUrl,
      });
      setStatus("idle");
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setIsResolving(false);
    }
  }, [inputUrl, dailyCount, dailyLimit, reset, setStatus, setVideoInfo, setError]);

  const handleDownload = useCallback(async () => {
    if (!videoInfo?.url) return;
    if (dailyCount >= dailyLimit) {
      setStatus("limit-reached");
      return;
    }

    setStatus("downloading");
    setProgress(0);
    setDownloaded(0);
    setElapsedSeconds(0);

    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    try {
      abortRef.current = new AbortController();
      const res = await fetch(videoInfo.url, { signal: abortRef.current.signal });

      if (!res.ok || !res.body) {
        setError("Erreur lors du téléchargement");
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }

      const contentLength = Number(res.headers.get("content-length") || 0);
      if (contentLength) setTotalSize(contentLength);

      const reader = res.body.getReader();
      const chunks: Uint8Array[] = [];
      let receivedBytes = 0;
      let lastSpeedCheck = Date.now();
      let lastBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedBytes += value.length;
        setDownloaded(receivedBytes);

        if (contentLength) {
          setProgress(Math.min(99, Math.round((receivedBytes / contentLength) * 100)));
        }

        const now = Date.now();
        if (now - lastSpeedCheck >= 500) {
          const elapsed = (now - lastSpeedCheck) / 1000;
          const byteDiff = receivedBytes - lastBytes;
          setSpeed(Math.round(byteDiff / elapsed));
          lastSpeedCheck = now;
          lastBytes = receivedBytes;
        }
      }

      const blob = new Blob(chunks as BlobPart[]);
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = videoInfo.title.replace(/[^a-zA-Z0-9À-ÿ\s\-_.]/g, "") + ".mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

      setProgress(100);
      setStatus("completed");
      incrementDailyCount();
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        reset();
      } else {
        setError("Erreur lors du téléchargement. Réessayez.");
      }
    } finally {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [videoInfo, dailyCount, dailyLimit, setStatus, setProgress, setDownloaded, setTotalSize, setElapsedSeconds, setSpeed, setError, incrementDailyCount, reset]);

  const handleCancel = () => {
    abortRef.current?.abort();
    if (timerRef.current) clearInterval(timerRef.current);
    reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleResolve();
  };

  const isDownloading = status === "downloading";
  const isCompleted = status === "completed";
  const isLimitReached = status === "limit-reached" || dailyCount >= dailyLimit;

  // Limit reached — full conversion takeover
  if (isLimitReached) {
    return (
      <div className="rounded-2xl overflow-hidden" style={{ background: '#0f0e17', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="p-8 md:p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <Download className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            {dailyLimit} téléchargements utilisés
          </h3>
          <p className="text-white/60 mb-8 max-w-md mx-auto text-sm">
            Revenez demain, ou passez à TubeForge Pro pour des téléchargements
            illimités en 8K avec découpe vidéo.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-lg mx-auto text-left">
            {[
              { icon: Zap, label: "Vitesse maximale", desc: "Fragments parallèles" },
              { icon: Video, label: "Jusqu'en 8K", desc: "Qualité sans limite" },
              { icon: Scissors, label: "Découpe vidéo", desc: "Extrait exact" },
            ].map((f, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
                <f.icon className="w-4 h-4 text-red-400 mb-2" />
                <p className="text-xs font-bold text-white">{f.label}</p>
                <p className="text-[11px] text-white/50">{f.desc}</p>
              </div>
            ))}
          </div>

          <Link
            href="/checkout"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-base shadow-[0_8px_24px_rgba(239,68,68,0.3)] hover:shadow-[0_12px_40px_rgba(239,68,68,0.5)] transition-all duration-200 hover:translate-y-[-1px]"
          >
            Débloquer TubeForge Pro
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="text-xs text-white/40 mt-4">À partir de 8,03€/mois</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main download UI */}
      <div className="flex-1 min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="rounded-2xl shadow-2xl shadow-black/30 flex flex-col overflow-x-clip"
          style={{ background: '#0f0e17', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="px-4 md:px-6 pt-6 pb-5 flex flex-col items-center">
            {/* URL Input */}
            <div className="w-full relative group mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative flex items-center gap-2 p-2 pl-4 rounded-2xl shadow-2xl" style={{ background: 'rgba(30,27,75,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Search className="w-4 h-4 text-white/25 shrink-0" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Collez un lien YouTube..."
                  disabled={isDownloading}
                  style={{ outline: 'none' }}
                  className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder:text-white/25 outline-none disabled:opacity-50"
                />
                {inputUrl && !isDownloading && (
                  <button onClick={() => { setInputUrl(""); reset(); }} className="p-1 hover:bg-white/10 rounded-lg transition-colors shrink-0">
                    <X className="w-3.5 h-3.5 text-white/30" />
                  </button>
                )}
                <div className="h-5 w-px bg-white/10" />
                <span className="text-xs text-white/50 font-medium shrink-0">720p</span>
                <button
                  onClick={handleResolve}
                  disabled={isResolving || isDownloading || !inputUrl.trim()}
                  className="shrink-0 px-3.5 py-2 rounded-xl text-white text-sm font-medium flex items-center shadow-lg cursor-pointer hover:brightness-125 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: '#4c1d95' }}
                >
                  {isResolving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="w-full mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-xs text-red-300">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty state — before any URL is pasted */}
            {!videoInfo && !error && !isResolving && (
              <div className="w-full py-6 text-center">
                <div className="flex items-center justify-center gap-6 mb-5 text-white/15">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/[0.06]">
                      <Video className="w-5 h-5" />
                    </div>
                    <span className="text-[10px]">MP4 720p</span>
                  </div>
                  <div className="w-px h-8 bg-white/[0.06]" />
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/[0.06]">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className="text-[10px]">15/jour</span>
                  </div>
                  <div className="w-px h-8 bg-white/[0.06]" />
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/[0.06]">
                      <Download className="w-5 h-5" />
                    </div>
                    <span className="text-[10px]">Sans compte</span>
                  </div>
                </div>
                {dailyCount > 0 && (
                  <p className="text-xs text-white/30">
                    {dailyLimit - dailyCount} téléchargement{dailyLimit - dailyCount > 1 ? "s" : ""} restant{dailyLimit - dailyCount > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            )}

            {/* Resolving state */}
            {isResolving && (
              <div className="w-full py-8 flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                <p className="text-sm text-white/50">Analyse de la vidéo...</p>
              </div>
            )}

            {/* Video Card */}
            <AnimatePresence>
              {videoInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: easeOutExpo }}
                  className="w-full rounded-2xl p-4"
                  style={{ background: 'rgba(30,27,75,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="flex gap-4 items-start">
                    {videoInfo.thumbnail && (
                      <div className="w-28 aspect-video rounded-xl shrink-0 relative overflow-hidden shadow-lg shadow-black/40">
                        <Image src={videoInfo.thumbnail} alt={videoInfo.title} fill className="object-cover" unoptimized />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <p className="text-sm text-white font-bold leading-tight line-clamp-2">{videoInfo.title}</p>
                      <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
                        {videoInfo.duration && (
                          <>
                            <span className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5">{videoInfo.duration}</span>
                            <span>&bull;</span>
                          </>
                        )}
                        <span>YouTube</span>
                      </div>
                    </div>
                  </div>

                  {/* Download buttons */}
                  {!isDownloading && !isCompleted && (
                    <>
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <button
                          onClick={handleDownload}
                          className="group bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 p-3 rounded-xl transition-all duration-200 text-left cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">Télécharger MP4</span>
                            <Video className="w-4 h-4 text-white/20 group-hover:text-cyan-400 transition-colors" />
                          </div>
                          <p className="text-[10px] text-white/40 group-hover:text-cyan-400/50 transition-colors">720p &bull; Vitesse bridée</p>
                        </button>
                        <div className="bg-white/[0.03] border border-white/[0.06] p-3 rounded-xl cursor-not-allowed">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-bold text-white/30">MP3</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 font-bold">PRO</span>
                          </div>
                          <p className="text-[10px] text-white/25">TubeForge Pro uniquement</p>
                        </div>
                      </div>

                      {/* Disabled trim */}
                      <div className="mt-3 w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] cursor-not-allowed">
                        <div className="flex items-center gap-2">
                          <Scissors className="w-3.5 h-3.5 text-white/20" />
                          <span className="text-xs text-white/25">Couper un extrait</span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 font-bold">PRO</span>
                      </div>
                    </>
                  )}

                  {/* Download progress */}
                  {isDownloading && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                          <span className="text-xs text-white/70 font-medium">Téléchargement...</span>
                        </div>
                        <button onClick={handleCancel} className="text-xs text-white/30 hover:text-white/60 transition-colors">
                          Annuler
                        </button>
                      </div>

                      <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-white/40 font-mono">
                        <span>{formatBytes(downloaded)}{totalSize > 0 ? ` / ${formatBytes(totalSize)}` : ""}</span>
                        <span>{progress}%</span>
                        <span>{speed > 0 ? formatSpeed(speed) : "..."}</span>
                      </div>
                    </div>
                  )}

                  {/* Completed */}
                  {isCompleted && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-green-300 font-medium">Téléchargé avec succès</span>
                      </div>

                      {elapsedSeconds > 3 && (
                        <div className="px-3 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                          <p className="text-xs text-amber-300">
                            {elapsedSeconds}s &mdash; TubeForge Pro : ~{Math.max(1, Math.round(elapsedSeconds / 2))}s
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => { reset(); setInputUrl(""); }}
                          className="text-xs text-white/50 hover:text-white/80 transition-colors"
                        >
                          Nouveau téléchargement
                        </button>
                        <span className="text-xs text-white/30">
                          {dailyLimit - dailyCount} restant{dailyLimit - dailyCount > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Disabled features bar */}
          <div className="px-4 md:px-6 pb-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/25">
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <FileText className="w-3.5 h-3.5 shrink-0" /> Import script
                <span className="px-1 py-0.5 rounded bg-red-500/15 text-red-400/70 text-[9px] font-bold">PRO</span>
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <Search className="w-3.5 h-3.5 shrink-0" /> Recherche
                <span className="px-1 py-0.5 rounded bg-red-500/15 text-red-400/70 text-[9px] font-bold">PRO</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upgrade CTA sidebar — only visible after first interaction or on download */}
      <AnimatePresence>
        {(hasInteracted || videoInfo || dailyCount > 0) && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
            className="w-full lg:w-80 shrink-0"
          >
            <UpgradeCTA
              isDownloading={isDownloading}
              speed={speed}
              elapsedSeconds={elapsedSeconds}
              progress={progress}
              dailyCount={dailyCount}
              dailyLimit={dailyLimit}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
