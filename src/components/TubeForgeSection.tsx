"use client";

import { motion } from "framer-motion";
import { Download, Rocket, Zap, Layers, Monitor, Youtube, Shield, Sparkles, Terminal, Clock, Play, ListVideo, HardDrive, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TubeForgeSection() {
    return (
        <section id="tubeforge" className="py-24 md:py-32 relative overflow-hidden border-t border-white/5 bg-white/[0.01]">
            <div className="container-main">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20"
                >
                    {/* Côté Texte */}
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
                            Le téléchargeur ultime. Rapide, sans publicité et conçu pour les créateurs exigeants.
                        </p>

                        <ul className="space-y-6 mb-10">
                            {[
                                {
                                    icon: Zap,
                                    title: "Ultra Rapide",
                                    desc: "Moteur multithread pour des téléchargements instantanés.",
                                },
                                {
                                    icon: Sparkles,
                                    title: "Qualité 8K & 60fps",
                                    desc: "Préservez chaque pixel. Extraction audio sans perte.",
                                },
                                {
                                    icon: ListVideo,
                                    title: "Playlists & Chaînes",
                                    desc: "Téléchargez des séries entières en un seul clic.",
                                },
                            ].map((item, i) => (
                                <li key={i} className="flex gap-5">
                                    <div className="mt-1 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                        <item.icon className="w-5 h-5 text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white text-lg">
                                            {item.title}
                                        </h3>
                                        <p className="text-white/50">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/tubeforge"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg shadow-white/10"
                        >
                            Télécharger Gratuitement <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Côté Visuel / Mockup */}
                    <div className="flex-1 w-full relative">
                        <div className="absolute -inset-10 bg-gradient-to-tr from-red-500/20 via-orange-500/20 to-yellow-500/20 blur-3xl rounded-full opacity-50" />
                        <div className="relative glass rounded-2xl border border-white/5 p-2 shadow-2xl">
                            <div className="aspect-[4/3] bg-[#0F0F12] rounded-xl overflow-hidden relative border border-white/5 group">
                                {/* Header Mockup */}
                                <div className="h-10 border-b border-white/5 bg-[#141418] flex items-center px-4 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                </div>

                                {/* Content Mockup */}
                                <div className="p-6 space-y-4">
                                    {/* Search Bar */}
                                    <div className="h-10 bg-[#1A1A20] rounded-lg border border-white/5 flex items-center px-4">
                                        <div className="w-4 h-4 rounded-full bg-white/10 mr-3" />
                                        <div className="h-2 w-32 bg-white/5 rounded-full" />
                                    </div>

                                    {/* Download Cards */}
                                    {[1, 2, 3].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ x: 20, opacity: 0 }}
                                            whileInView={{ x: 0, opacity: 1 }}
                                            transition={{ delay: i * 0.2 }}
                                            className="h-16 bg-[#16161A] rounded border border-white/5 flex items-center p-3 gap-3"
                                        >
                                            <div className="h-10 w-16 bg-white/5 rounded relative overflow-hidden">
                                                <div className="absolute inset-0 bg-red-500/10" />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-2 w-24 bg-white/10 rounded" />
                                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: "0%" }}
                                                        whileInView={{ width: `${80 - (i * 15)}%` }}
                                                        transition={{ duration: 1.5, delay: 0.5 + (i * 0.2) }}
                                                        className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
