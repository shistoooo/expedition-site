"use client";

import { motion } from "framer-motion";
import { Download, Rocket, Zap, Layers, Video, Scissors, Wand2, Captions, Share2, Clock, CheckCircle2, Circle, Monitor, Sparkles, Terminal } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

const currentFeatures = [
  {
    icon: Wand2,
    title: "Découpage Intelligent",
    description: "L'IA analyse votre vidéo et détecte automatiquement les moments clés pour créer des clips."
  },
  {
    icon: Scissors,
    title: "Recadrage Automatique",
    description: "Passez du format 16:9 au 9:16 facilement. L'IA suit le sujet principal."
  },
  {
    icon: Captions,
    title: "Sous-titres Automatiques",
    description: "Génération automatique de sous-titres stylisés avec plusieurs templates tendance."
  },
  {
    icon: Share2,
    title: "Export Multi-Plateforme",
    description: "Exportez directement aux formats optimisés pour TikTok, YouTube Shorts, et Instagram Reels."
  },
  {
    icon: Zap,
    title: "Traitement Rapide",
    description: "Rendu rapide, même sur des vidéos longues."
  }
];

const upcomingFeatures = [
  {
    title: "Détection des moments clés par IA",
    description: "Analyse pour identifier les passages qui fonctionnent.",
    progress: 75,
  },
  {
    title: "Auto-crop intelligent",
    description: "Recadrage automatique selon le contenu : détecte la cam et le jeu sur les lives Twitch.",
    progress: 50,
  },
  {
    title: "Pipeline YouTube/Twitch complet",
    description: "Téléchargement auto depuis YouTube/Twitch, création de clips, et upload automatique.",
    progress: 15,
  },
  {
    title: "Templates Personnalisables",
    description: "Bibliothèque de templates pour sous-titres, transitions et effets visuels.",
    progress: 40,
  },
  {
    title: "Système Multi-POV",
    description: "Synchronisation VOD multijoueurs : détecte qui parle et affiche sa vue automatiquement.",
    progress: 25,
  },
  {
    title: "Compilations Virales",
    description: "Créez un clip viral à partir de plusieurs extraits combinés dynamiquement.",
    progress: 15,
  },
  {
    title: "Correction Transcript par IA",
    description: "Correction automatique des fautes et du contexte des sous-titres via API avancée.",
    progress: 35,
  }
];

export default function ClipForgePage() {
  const [versionData, setVersionData] = useState<any>(null);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch('https://pub-a36a12c960fe437a9b884e6b7db5b56c.r2.dev/version.json', {
          cache: 'no-store'
        });
        const data = await response.json();
        setVersionData(data.clipforge);
      } catch (err) {
        console.error('Failed to fetch version:', err);
      }
    };
    fetchVersion();
  }, []);

  return (
    <div className="min-h-screen bg-[#05050A] text-white selection:bg-purple-500/30 font-sans">
      <Navbar />
      
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
      
      <main className="relative overflow-hidden pt-24">
        
        {/* Hero Section */}
        <section className="relative pt-20 pb-20 md:pt-32 md:pb-32 container-main">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 text-left z-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono mb-6">
                <Video className="w-3 h-3" />
                <span>AI_VIDEO_ENGINE_V1.2</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter leading-tight font-display">
                CLIP <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">FORGE</span>
              </h1>

              <p className="text-lg text-white/50 mb-10 max-w-xl leading-relaxed">
                Transformez vos longues vidéos en clips viraux en quelques secondes. L'IA analyse, découpe et sous-titre votre contenu automatiquement.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href={versionData?.download_url || "https://pub-a36a12c960fe437a9b884e6b7db5b56c.r2.dev/ClipForge.app.zip"}
                  download={versionData?.download_url ? true : undefined}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                  <Download className="w-5 h-5" />
                  <span>Télécharger (Win/Mac)</span>
                </motion.a>
                
                <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 font-medium flex items-center justify-center gap-3 cursor-not-allowed">
                  <Monitor className="w-5 h-5" />
                  <span>Démo Web (Bientôt)</span>
                </button>
              </div>

              <div className="mt-6 flex items-center gap-4 text-xs text-white/30 font-mono">
                <span>v{versionData?.version || '1.2.4'} Stable</span>
                <span>•</span>
                <span>Windows 10/11 & macOS</span>
              </div>
            </motion.div>

            {/* Right Mockup - ClipForge UI */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-1 w-full relative"
            >
              <div className="relative rounded-xl border border-white/10 bg-[#0F0F12] shadow-2xl overflow-hidden aspect-[16/10] group">
                {/* Header Bar */}
                <div className="h-10 border-b border-white/5 bg-[#141418] flex items-center px-4 justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                  </div>
                  <div className="text-[10px] font-mono text-white/20">CLIPFORGE_PROJECT.CPF</div>
                </div>

                <div className="flex h-full">
                  {/* Sidebar Tools */}
                  <div className="w-14 border-r border-white/5 flex flex-col items-center py-4 gap-6 bg-[#111115]">
                    <div className="w-8 h-8 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center">
                       <Scissors className="w-4 h-4" />
                    </div>
                    <div className="w-8 h-8 rounded hover:bg-white/5 text-white/20 flex items-center justify-center transition-colors">
                       <Captions className="w-4 h-4" />
                    </div>
                    <div className="w-8 h-8 rounded hover:bg-white/5 text-white/20 flex items-center justify-center transition-colors">
                       <Wand2 className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Main Preview Area */}
                  <div className="flex-1 p-6 bg-[#0F0F12] flex flex-col">
                    <div className="flex-1 bg-black/40 rounded-lg border border-white/5 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10" />
                        <div className="w-32 h-48 bg-white/5 rounded border border-white/10 flex items-center justify-center">
                            <Video className="w-8 h-8 text-white/20" />
                        </div>
                        
                        {/* Fake Captions */}
                        <div className="absolute bottom-8 left-0 right-0 text-center">
                            <span className="bg-black/60 px-2 py-1 rounded text-yellow-400 font-bold text-sm">Incroyable ce moment !</span>
                        </div>
                    </div>
                    
                    {/* Timeline */}
                    <div className="h-24 mt-4 bg-[#111115] rounded-lg border border-white/5 p-2 flex gap-1 overflow-hidden relative">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="flex-1 bg-purple-500/20 rounded-sm h-full opacity-50 relative group/track">
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-blue-500/20" />
                            </div>
                        ))}
                        <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-red-500 z-10" />
                    </div>
                  </div>
                  
                  {/* Properties Panel */}
                  <div className="w-48 border-l border-white/5 bg-[#111115] p-4 hidden sm:block">
                     <div className="space-y-4">
                        <div className="h-2 w-12 bg-white/10 rounded" />
                        <div className="h-20 bg-white/5 rounded border border-white/5" />
                        <div className="h-2 w-20 bg-white/10 rounded" />
                        <div className="flex gap-2">
                            <div className="h-8 flex-1 bg-purple-500/20 rounded border border-purple-500/30" />
                            <div className="h-8 flex-1 bg-white/5 rounded border border-white/10" />
                        </div>
                     </div>
                  </div>
                </div>
              </div>
              
              {/* Purple Glow */}
              <div className="absolute -inset-10 bg-purple-500/10 blur-[80px] -z-10 rounded-full" />
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 border-t border-white/5 bg-white/[0.01]">
            <div className="container-main">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Architecture Système</h2>
                    <p className="text-white/50">Fonctionnalités natives intégrées au noyau.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentFeatures.map((feature, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-[#0F0F12] border border-white/5 hover:border-purple-500/30 transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 text-white/90">{feature.title}</h3>
                            <p className="text-sm text-white/50 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Development Roadmap */}
        <section className="py-24 border-t border-white/5">
          <div className="container-main max-w-4xl">
            <div className="flex items-center gap-4 mb-12">
               <Terminal className="w-6 h-6 text-purple-400" />
               <h2 className="text-2xl font-mono font-bold">DEV_LOG & ROADMAP</h2>
               <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="space-y-4">
              {upcomingFeatures.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-3">
                     <div className="flex items-start gap-3">
                        <div className="mt-1">
                            {feature.progress === 100 ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                                <Circle className="w-4 h-4 text-white/20" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-white/90">{feature.title}</h3>
                            <p className="text-sm text-white/40">{feature.description}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 min-w-[140px]">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-purple-500 rounded-full" 
                                style={{ width: `${feature.progress}%` }}
                            />
                        </div>
                        <span className="text-xs font-mono text-purple-400 w-8 text-right">{feature.progress}%</span>
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
