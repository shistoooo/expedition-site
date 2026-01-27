"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Download, Rocket, Zap, Layers, Globe, Cpu, Sparkles, Command, Terminal, ChevronRight, Lock, Hammer, Palette, Brain, Shield, Star, MessageCircle, FileCheck, Languages, Youtube } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

const roadmapTools = [
  {
    name: "Correction de Sous-titres",
    desc: "Importez vos .srt : l'IA corrige l'orthographe et reformule les phrases mal comprises.",
    status: "Bientôt disponible",
    icon: FileCheck,
    color: "text-emerald-400"
  },
  {
    name: "Optimiseur de Titres",
    desc: "Analyse vos titres via des leviers psychologiques et compare avec les meilleures vidéos de votre niche.",
    status: "En conception",
    icon: Brain,
    color: "text-purple-400"
  },
  {
    name: "TikTok Repurpose",
    desc: "Importez des TikToks, traduction FR automatique, analyse des facteurs de succès et création de contenus.",
    status: "En développement",
    icon: Languages,
    color: "text-pink-400"
  },
  {
    name: "YouTube Repurpose",
    desc: "Les mêmes fonctionnalités pour YouTube : traduction, analyse et création de contenus.",
    status: "En conception",
    icon: Youtube,
    color: "text-orange-400"
  },
  {
    name: "ThumbCraft",
    desc: "Créez des miniatures avec l'aide de l'IA pour améliorer vos taux de clics.",
    status: "Bientôt disponible",
    icon: Palette,
    color: "text-blue-400"
  },
  {
    name: "AssetStore",
    desc: "Bibliothèque partagée de sons, musiques et overlays libres de droits.",
    status: "Concept",
    icon: Layers,
    color: "text-orange-400"
  }
];

export default function LauncherPage() {
  const [updates, setUpdates] = useState<Record<string, any>>({});

  useEffect(() => {
    const checkUpdates = async () => {
      try {
        const response = await fetch('https://pub-a36a12c960fe437a9b884e6b7db5b56c.r2.dev/version.json', {
            cache: 'no-store'
        });
        const data = await response.json();
        setUpdates(data);
      } catch (err) {
        console.error("Failed to check for updates:", err);
      }
    };
    checkUpdates();
  }, []);

  const getUpdateStatus = (appKey: string, currentVersion: string) => {
    const remote = updates[appKey];
    if (!remote) return null;
    
    // Simple string comparison for now, assuming semantic versioning format
    if (remote.version > currentVersion) {
      return {
        available: true,
        version: remote.version,
        critical: remote.critical,
        message: remote.message
      };
    }
    return null;
  };

  const clipforgeUpdate = getUpdateStatus('clipforge', '1.0.0');
  
  return (
    <div className="min-h-screen bg-[#030304] text-white selection:bg-blue-500/30 font-sans">
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-6">
                <Terminal className="w-3 h-3" />
                <span>SYSTEM_READY_V1.0.0</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter leading-tight font-display">
                COMMAND <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">CENTER</span>
              </h1>

              <p className="text-lg text-white/50 mb-10 max-w-xl leading-relaxed">
                Centralisez votre flux de production. Accédez à tous les outils Expedition, gérez vos mises à jour et découvrez les nouveautés depuis une interface unique.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href="https://pub-a36a12c960fe437a9b884e6b7db5b56c.r2.dev/expedition-launcher_0.1.0_aarch64.dmg"
                  download
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                >
                  <Download className="w-5 h-5" />
                  <span>Télécharger (Mac)</span>
                </motion.a>
                
                <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 font-medium flex items-center justify-center gap-3 cursor-not-allowed opacity-50">
                  <Command className="w-5 h-5" />
                  <span>Windows (Bientôt)</span>
                </button>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-blue-500/5 border border-blue-500/10 max-w-md">
                 <p className="text-xs text-blue-200/80 flex gap-2 items-start">
                    <span className="mt-0.5">ℹ️</span>
                    <span>
                       <strong>Version 0.1.0 :</strong> Détection automatique des mises à jour pour ClipForge et tous vos outils Expedition.
                    </span>
                 </p>
              </div>
            </motion.div>

            {/* Right Mockup - "Command Center" Style */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-1 w-full relative"
            >
              <div className="relative rounded-xl border border-white/10 bg-[#0F1115] shadow-2xl overflow-hidden aspect-[4/3] group">
                {/* Header Bar */}
                <div className="h-10 border-b border-white/5 bg-[#16181D] flex items-center px-4 justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                  </div>
                  <div className="text-[10px] font-mono text-white/20">EXPEDITION_OS_KERNEL</div>
                </div>

                <div className="flex h-full">
                  {/* Sidebar */}
                  <div className="w-16 border-r border-white/5 flex flex-col items-center py-4 gap-4 bg-[#121418]">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                       <Rocket className="w-5 h-5" />
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-white/5 text-white/20 flex items-center justify-center">
                       <Layers className="w-5 h-5" />
                    </div>
                    <div className="mt-auto w-8 h-8 rounded-full bg-white/5" />
                  </div>

                  {/* Main Area */}
                  <div className="flex-1 p-6 bg-[#0F1115]">
                    {/* Welcome Banner */}
                    <div className="mb-6 p-6 rounded-xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/5 flex justify-between items-center">
                       <div>
                          <h3 className="text-sm font-medium text-blue-200 mb-1">Bienvenue, Créateur</h3>
                          <p className="text-xs text-white/40">Tous les systèmes sont opérationnels.</p>
                       </div>
                       <div className="px-3 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono">ONLINE</div>
                    </div>

                    {/* App Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* ClipForge Widget */}
                        <Link href="/clipforge" className="p-4 rounded-xl bg-[#16181D] border border-white/5 hover:border-purple-500/30 transition-colors group/card cursor-pointer block relative overflow-hidden">
                           {clipforgeUpdate?.available && (
                             <div className="absolute top-0 right-0 px-2 py-1 bg-blue-500 text-white text-[10px] font-bold rounded-bl-xl z-10 animate-pulse">
                               UPDATE
                             </div>
                           )}
                           <div className="flex justify-between items-start mb-3">
                              <div className="p-2 rounded bg-purple-500/10 text-purple-400">
                                 <Sparkles className="w-4 h-4" />
                              </div>
                              <div className={`w-2 h-2 rounded-full ${clipforgeUpdate?.available ? 'bg-blue-500 animate-ping' : 'bg-green-500'}`} />
                           </div>
                           <h4 className="font-medium text-sm text-white/80 mb-1">ClipForge</h4>
                           <p className={`text-xs ${clipforgeUpdate?.available ? 'text-blue-400 font-bold' : 'text-white/30'}`}>
                             {clipforgeUpdate?.available ? `v${clipforgeUpdate.version} disponible` : 'v1.2.4 • Installed'}
                           </p>
                           <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full w-full bg-purple-500/50" />
                           </div>
                        </Link>

                        {/* TubeForge Widget */}
                        <Link href="/tubeforge" className="p-4 rounded-xl bg-[#16181D] border border-white/5 hover:border-red-500/30 transition-colors group/card cursor-pointer block">
                           <div className="flex justify-between items-start mb-3">
                              <div className="p-2 rounded bg-red-500/10 text-red-400">
                                 <Download className="w-4 h-4" />
                              </div>
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                           </div>
                           <h4 className="font-medium text-sm text-white/80 mb-1">TubeForge</h4>
                           <p className="text-xs text-white/30">v2.0.1 • Installed</p>
                           <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full w-3/4 bg-red-500/50" />
                           </div>
                        </Link>
                    </div>
                    
                    {/* Console Log Fake */}
                    <div className="mt-6 p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-[10px] text-white/30 leading-relaxed">
                       <p>&gt; Initializing core services...</p>
                       <p>&gt; Connected to Expedition Network (ms: 24)</p>
                       <p className="text-blue-400/60">&gt; Updates found: ClipForge (patch_1.2.5)</p>
                       <p className="animate-pulse">_</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Blue Glow */}
              <div className="absolute -inset-10 bg-blue-500/10 blur-[80px] -z-10 rounded-full" />
            </motion.div>
          </div>
        </section>

        {/* Roadmap / In Development */}
        <section className="py-24 border-t border-white/5">
          <div className="container-main">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
               <div>
                  <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                     <Hammer className="w-6 h-6 text-white/40" />
                     Laboratoire
                  </h2>
                  <p className="text-white/50 max-w-lg">
                     Aperçu des outils en cours de développement dans nos forges secrètes.
                     Bientôt disponibles dans votre Launcher.
                  </p>
               </div>
               <div className="hidden md:block">
                  <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/40">
                     ROADMAP_2026.JSON
                  </div>
               </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {roadmapTools.map((tool, i) => (
                 <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors relative group overflow-hidden"
                 >
                    <div className="absolute top-4 right-4 px-2 py-1 rounded text-[10px] font-bold border bg-white/5 border-white/10 uppercase tracking-wide text-white/40 group-hover:bg-white/10 group-hover:text-white/60 transition-colors">
                       {tool.status}
                    </div>
                    
                    <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 ${tool.color} group-hover:scale-110 transition-transform`}>
                       <tool.icon className="w-6 h-6" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{tool.name}</h3>
                    <p className="text-white/40 text-sm leading-relaxed mb-6">
                       {tool.desc}
                    </p>
                    
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-white/10 w-1/3 group-hover:w-2/3 transition-all duration-700 ease-out" />
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
