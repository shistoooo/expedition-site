"use client";

import { motion } from "framer-motion";
import { Download, Monitor } from "lucide-react";

interface DownloadButtonsProps {
  macUrl: string | undefined;
  macFallbackPath: string;
  windowsUrl: string | undefined;
  windowsFallbackPath: string;
  accentColor: "red" | "purple" | "blue";
  showWebButton?: boolean;
  webLabel?: string;
}

const colorMap = {
  red: {
    primary: "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]",
  },
  purple: {
    primary: "bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]",
  },
  blue: {
    primary: "bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]",
  },
};

export default function DownloadButtons({
  macUrl,
  macFallbackPath,
  windowsUrl,
  windowsFallbackPath,
  accentColor,
  showWebButton = false,
  webLabel = "Version Web (Bient\u00f4t)",
}: DownloadButtonsProps) {
  const r2 = process.env.NEXT_PUBLIC_R2_BUCKET_URL || "https://pub-a36a12c960fe437a9b884e6b7db5b56c.r2.dev";

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <motion.a
        href={macUrl || `${r2}/${macFallbackPath}`}
        download
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`group px-8 py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-3 transition-all ${colorMap[accentColor].primary}`}
      >
        <Download className="w-5 h-5" />
        <span>Mac</span>
      </motion.a>

      <motion.a
        href={windowsUrl || `${r2}/${windowsFallbackPath}`}
        download
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium flex items-center justify-center gap-3 transition-all"
      >
        <Download className="w-5 h-5" />
        <span>Windows</span>
      </motion.a>

      {showWebButton && (
        <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 font-medium flex items-center justify-center gap-3 cursor-not-allowed">
          <Monitor className="w-5 h-5" />
          <span>{webLabel}</span>
        </button>
      )}
    </div>
  );
}
