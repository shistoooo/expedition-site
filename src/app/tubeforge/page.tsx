"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Download, Monitor, Zap, Shield, Sparkles, Clock } from "lucide-react";

export default function TubeForgePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 relative">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="container-main relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-orange-600 mb-8 shadow-2xl shadow-red-500/20">
                    <Download className="w-10 h-10 text-white" />
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                    Tube<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Forge</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
                    L'outil ultime pour télécharger et gérer vos sources vidéos YouTube.
                    <br />
                    <span className="text-white/40 text-lg">Disponible sur Windows & Mac.</span>
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Télécharger (v1.0.0)
                    </button>
                    <button className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-lg hover:bg-white/10 transition-colors">
                        Voir les fonctionnalités
                    </button>
                </div>
                
                <p className="mt-4 text-sm text-white/30">
                    Compatible Windows 10/11 & macOS 12+
                </p>
            </div>
        </section>

        {/* Mockup Section */}
        <section className="py-10">
            <div className="container-main">
                <div className="relative mx-auto max-w-5xl rounded-xl border border-white/10 bg-[#121212] shadow-2xl overflow-hidden aspect-[16/10]">
                    {/* Mockup Header */}
                    <div className="h-10 border-b border-white/5 bg-[#1a1a1a] flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20" />
                    </div>
                    {/* Mockup Body Placeholder */}
                    <div className="p-8 flex items-center justify-center h-full text-white/20">
                        <div className="text-center">
                            <Monitor className="w-24 h-24 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">Interface de TubeForge</p>
                        </div>
                    </div>
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none" />
                </div>
            </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 relative">
            <div className="container-main">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Zap,
                            title: "Ultra Rapide",
                            desc: "Moteur de téléchargement multithread pour des vitesses maximales."
                        },
                        {
                            icon: Shield,
                            title: "Sans Publicité",
                            desc: "Un logiciel propre, sans traqueurs ni publicités intrusives."
                        },
                        {
                            icon: Sparkles,
                            title: "Haute Qualité",
                            desc: "Support jusqu'à la 8K, 60fps et extraction audio sans perte."
                        }
                    ].map((feature, i) => (
                        <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-colors">
                            <feature.icon className="w-10 h-10 text-red-500 mb-6" />
                            <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                            <p className="text-white/60">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Roadmap / Future Updates */}
        <section className="py-24 border-t border-white/5">
            <div className="container-main max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Roadmap</h2>
                    <p className="text-white/60">Ce qui arrive prochainement sur TubeForge.</p>
                </div>

                <div className="space-y-8">
                    {[
                        {
                            version: "v1.1",
                            date: "Q2 2024",
                            title: "Playlist Downloader",
                            desc: "Téléchargez des playlists entières en un clic.",
                            status: "In Progress"
                        },
                        {
                            version: "v1.2",
                            date: "Q3 2024",
                            title: "Smart Metadata",
                            desc: "Ajout automatique des tags, couvertures et infos artistes.",
                            status: "Planned"
                        },
                        {
                            version: "v2.0",
                            date: "2025",
                            title: "Conversion Cloud",
                            desc: "Synchronisation directe avec votre drive.",
                            status: "Concept"
                        }
                    ].map((item, i) => (
                        <div key={i} className="flex gap-6 relative group">
                            {/* Timeline Line */}
                            <div className="absolute left-[19px] top-10 bottom-[-32px] w-0.5 bg-white/10 group-last:hidden" />
                            
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 z-10 group-hover:bg-red-500/20 group-hover:border-red-500/50 transition-colors">
                                <Clock className="w-5 h-5 text-white/60 group-hover:text-red-400" />
                            </div>
                            
                            <div className="flex-1 pt-2 pb-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-red-400 font-mono text-sm px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">
                                        {item.version}
                                    </span>
                                    <span className="text-white/40 text-sm">{item.date}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-white/60">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
