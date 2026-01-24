import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Video, Download, ArrowRight, Wand2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const tools = [
  {
    id: "clipforge",
    title: "ClipForge",
    description: "Transformez vos vidéos longues en formats courts (TikTok, Shorts) grâce à l'IA.",
    icon: Wand2,
    href: "/clipforge",
    color: "from-purple-500 to-pink-500",
    status: "Disponible"
  },
  {
    id: "tubeforge",
    title: "TubeForge",
    description: "Téléchargez des vidéos YouTube en haute qualité pour vos montages.",
    icon: Download,
    href: "/tubeforge",
    color: "from-red-500 to-orange-500",
    status: "Nouveau"
  }
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="pt-32 pb-20 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px]" />
           <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px]" />
        </div>

        <div className="container-main relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Outils</span>
            </h1>
            <p className="text-xl text-white/60">
              Une suite complète pour booster votre productivité et votre créativité.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {tools.map((tool) => (
              <Link key={tool.id} href={tool.href} className="group">
                <div className="h-full p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all relative overflow-hidden">
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${tool.color}`} />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg`}>
                        <tool.icon className="w-6 h-6 text-white" />
                      </div>
                      {tool.status && (
                        <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium border border-white/10">
                          {tool.status}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-3">{tool.title}</h2>
                    <p className="text-white/60 mb-6 flex-1">
                      {tool.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm font-bold text-white/80 group-hover:text-white group-hover:gap-3 transition-all">
                      Découvrir <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
