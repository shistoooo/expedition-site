"use client";

import { motion } from "framer-motion";
import { Download, Rocket, Zap, Layers, Monitor, Youtube, Shield, Sparkles, Terminal, Clock, Play, ListVideo, HardDrive } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

const currentFeatures = [
  {
    icon: Zap,
    title: "Ultra Rapide",
    description: "Moteur de téléchargement multithread pour des vitesses maximales."
  },
  {
    icon: Shield,
    title: "Sans Publicité",
    description: "Un logiciel propre, sans traqueurs ni publicités intrusives."
  },
  {
    icon: Sparkles,
    title: "Haute Qualité",
    description: "Support jusqu'à la 8K, 60fps et extraction audio sans perte."
  },
  {
    icon: ListVideo,
    title: "Playlist Downloader",
    description: "Téléchargez des playlists entières ou des chaînes complètes en un clic."
  },
  {
    icon: HardDrive,
    title: "Gestion Locale",
    description: "Organisez votre bibliothèque de médias téléchargés directement dans l'application."
  }
];

const roadmap = [
  {
    version: "v1.1",
    date: "Q2 2026",
    title: "Playlist Downloader Avancé",
    desc: "Filtres intelligents pour ne télécharger que les vidéos non vues ou spécifiques.",
    status: "In Progress",
    progress: 60
  },
  {
    version: "v1.2",
    date: "Q3 2026",
    title: "Smart Metadata",
    desc: "Ajout automatique des tags, couvertures et infos artistes pour iTunes/Spotify.",
    status: "Planned",
    progress: 30
  },
  {
    version: "v2.0",
    date: "2027",
    title: "Conversion Cloud",
    desc: "Synchronisation directe avec votre Google Drive ou Dropbox.",
    status: "Concept",
    progress: 0
  }
];

export default function TubeForgePage() {
  const [versionData, setVersionData] = useState<any>(null);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch('https://pub-a36a12c960fe437a9b884e6b7db5b56c.r2.dev/version.json', {
          cache: 'no-store'
        });
        const data = await response.json();
        setVersionData(data.tubeforge);
      } catch (err) {
        console.error('Failed to fetch version:', err);
      }
    };
    fetchVersion();
  }, []);

  return (
    <div className="min-h-screen bg-[#05050A] text-white selection:bg-red-500/30 font-sans">
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono mb-6">
                <Youtube className="w-3 h-3" />
                <span>MEDIA_DOWNLOADER_V2.0</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter leading-tight font-display">
                TUBE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">FORGE</span>
              </h1>

              <p className="text-lg text-white/50 mb-10 max-w-xl leading-relaxed">
                L'outil ultime pour télécharger et archiver vos contenus préférés. Rapide, sécurisé et sans limite de qualité.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href={versionData?.download_url || "#"}
                  download
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                >
                  <Download className="w-5 h-5" />
                  <span>Mac</span>
                </motion.a>

                <motion.a
                  href={versionData?.windows_download_url || "https://pub-a36a12c960fe437a9b884e6b7db5b56c.r2.dev/TubeForge-Windows-Installer.zip"}
                  download
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium flex items-center justify-center gap-3 transition-all"
                >
                  <Download className="w-5 h-5" />
                  <span>Windows</span>
                </motion.a>
                
                <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 font-medium flex items-center justify-center gap-3 cursor-not-allowed">
                  <Monitor className="w-5 h-5" />
                  <span>Version Web (Bientôt)</span>
                </button>
              </div>

              <div className="mt-6 flex items-center gap-4 text-xs text-white/30 font-mono">
                <span>v{versionData?.version || '2.0.1'} Stable</span>
                <span>•</span>
                <span>Support 8K/60fps</span>
              </div>
            </motion.div>

            {/* Right Mockup - TubeForge UI */}
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
                  <div className="text-[10px] font-mono text-white/20">TUBEFORGE_CLIENT_X64</div>
                </div>

                <div className="flex h-full">
                  {/* Sidebar */}
                  <div className="w-14 border-r border-white/5 flex flex-col items-center py-4 gap-6 bg-[#111115]">
                    <div className="w-8 h-8 rounded bg-red-500/20 text-red-400 flex items-center justify-center">
                       <Download className="w-4 h-4" />
                    </div>
                    <div className="w-8 h-8 rounded hover:bg-white/5 text-white/20 flex items-center justify-center transition-colors">
                       <ListVideo className="w-4 h-4" />
                    </div>
                    <div className="w-8 h-8 rounded hover:bg-white/5 text-white/20 flex items-center justify-center transition-colors">
                       <HardDrive className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1 p-6 bg-[#0F0F12] flex flex-col gap-4">
                    {/* Search Bar */}
                    <div className="h-12 bg-[#1A1A20] rounded-lg border border-white/5 flex items-center px-4 gap-3">
                        <Youtube className="w-5 h-5 text-white/20" />
                        <div className="h-4 w-48 bg-white/5 rounded-full" />
                        <div className="ml-auto px-3 py-1 bg-red-500 rounded text-xs font-bold">GET</div>
                    </div>

                    {/* Download Queue */}
                    <div className="space-y-3 mt-2">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="h-16 bg-[#16161A] rounded border border-white/5 flex items-center p-3 gap-3">
                                <div className="h-10 w-16 bg-white/5 rounded relative overflow-hidden">
                                    <div className="absolute inset-0 bg-red-500/10" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Play className="w-3 h-3 text-white/20 fill-current" />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-2 w-32 bg-white/10 rounded" />
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500" style={{ width: `${80 - (i * 25)}%` }} />
                                    </div>
                                </div>
                                <div className="text-xs font-mono text-white/30">
                                    {80 - (i * 25)}%
                                </div>
                            </div>
                        ))}
                    </div>
                  </div>
                </div>
                
                {/* Red Glow */}
                <div className="absolute -inset-10 bg-red-500/10 blur-[80px] -z-10 rounded-full" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 border-t border-white/5 bg-white/[0.01]">
            <div className="container-main">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Moteur de Téléchargement</h2>
                    <p className="text-white/50">Performance et qualité sans compromis.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentFeatures.map((feature, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-[#0F0F12] border border-white/5 hover:border-red-500/30 transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4 text-red-400 group-hover:scale-110 transition-transform">
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

        {/* Roadmap */}
        <section className="py-24 border-t border-white/5">
          <div className="container-main max-w-4xl">
            <div className="flex items-center gap-4 mb-12">
               <Terminal className="w-6 h-6 text-red-400" />
               <h2 className="text-2xl font-mono font-bold">SYSTEM_UPDATES</h2>
               <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="space-y-6">
              {roadmap.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col md:flex-row gap-6 relative group"
                >
                  {/* Timeline */}
                  <div className="hidden md:flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50 group-hover:bg-red-500 group-hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all" />
                    {index !== roadmap.length - 1 && <div className="w-px h-full bg-white/10 my-2" />}
                  </div>

                  <div className="flex-1 p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                     <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                            {item.version}
                        </span>
                        <span className="text-xs text-white/30 font-mono">{item.date}</span>
                     </div>
                     
                     <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                     <p className="text-white/50 text-sm mb-4">{item.desc}</p>
                     
                     {/* Progress Bar for In Progress items */}
                     {item.progress > 0 && (
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-2">
                            <div className="h-full bg-red-500" style={{ width: `${item.progress}%` }} />
                        </div>
                     )}
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
