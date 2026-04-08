"use client";

import { motion } from "framer-motion";
import { Zap, Video, Scissors, FileText, Download, ArrowRight, Crown } from "lucide-react";
import Link from "next/link";

interface UpgradeCTAProps {
  isDownloading: boolean;
  speed: number;
  elapsedSeconds: number;
  progress: number;
  dailyCount: number;
  dailyLimit: number;
}

function formatSpeed(bytesPerSecond: number): string {
  if (bytesPerSecond < 1024 * 1024) return `${(bytesPerSecond / 1024).toFixed(0)} KB/s`;
  return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`;
}

export default function UpgradeCTA({
  isDownloading,
  speed,
  elapsedSeconds,
  progress,
  dailyCount,
  dailyLimit,
}: UpgradeCTAProps) {
  const proSpeed = speed > 0 ? speed * 4 : 0; // Pro is ~4x faster (2x from throttle + parallel fragments)

  return (
    <div className="sticky top-24 space-y-4">
      {/* Speed comparison — shows during download */}
      {isDownloading && speed > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl p-4 overflow-hidden"
          style={{ background: '#0f0e17', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="text-[10px] text-white/40 font-medium uppercase tracking-wider mb-3">Comparaison vitesse</p>

          {/* Web speed */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-white/50">Web gratuit</span>
              <span className="text-[10px] text-white/50 font-mono">{formatSpeed(speed)}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <motion.div
                className="h-full rounded-full bg-white/20"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Pro speed */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-red-400 font-medium">TubeForge Pro</span>
              <span className="text-[10px] text-red-400 font-mono font-bold">{formatSpeed(proSpeed)}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                animate={{ width: `${Math.min(100, progress * 4)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {elapsedSeconds > 5 && (
            <p className="text-[9px] text-amber-400/70 mt-3 text-center">
              Avec Pro, ce serait déjà terminé depuis {Math.max(1, elapsedSeconds - Math.round(elapsedSeconds / 4))}s
            </p>
          )}
        </motion.div>
      )}

      {/* Main upgrade card */}
      <div
        className="rounded-2xl p-5 overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #0f0e17 0%, #1a0a2e 100%)', border: '1px solid rgba(239,68,68,0.15)' }}
      >
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)' }} />

        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-4 h-4 text-red-400" />
          <h4 className="text-sm font-bold text-white">TubeForge Pro</h4>
        </div>

        <ul className="space-y-2.5 mb-5">
          {[
            { icon: Zap, label: "Vitesse maximale", desc: "Fragments parallèles, pas de bridage" },
            { icon: Video, label: "Jusqu'en 4K", desc: "Qualité sans limite" },
            { icon: Scissors, label: "Découpe vidéo", desc: "Sélectionnez l'extrait exact" },
            { icon: FileText, label: "Import de script", desc: "Tous les liens en un clic" },
            { icon: Download, label: "Illimité", desc: "Pas de limite quotidienne" },
          ].map((f, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <f.icon className="w-3 h-3 text-red-400" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-white">{f.label}</p>
                <p className="text-[9px] text-white/40">{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        <Link
          href="/checkout"
          className="group flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-[12px] shadow-[0_8px_20px_rgba(239,68,68,0.3)] hover:shadow-[0_12px_32px_rgba(239,68,68,0.5)] transition-all duration-200 hover:translate-y-[-1px]"
        >
          Passer à Pro
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <p className="text-[9px] text-white/25 text-center mt-2">À partir de 8,03€/mois</p>
      </div>

      {/* Daily counter */}
      <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(15,14,23,0.8)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-[10px] text-white/30">
          <span className="text-white/60 font-bold">{dailyCount}</span>/{dailyLimit} téléchargements utilisés aujourd&apos;hui
        </p>
        <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${(dailyCount / dailyLimit) * 100}%`,
              background: dailyCount > dailyLimit * 0.8
                ? 'linear-gradient(90deg, #ef4444, #f97316)'
                : 'linear-gradient(90deg, #6366f1, #a855f7)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
