"use client";

import Navbar from "@/components/Navbar";
import TubeForgeWeb from "@/components/TubeForgeWeb";

export default function DownloadPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#06051a] pt-24 pb-20">
        <div className="container-main">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-white mb-3">
              Téléchargez des vidéos{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                YouTube
              </span>
            </h1>
            <p className="text-white/55 max-w-lg mx-auto text-sm md:text-base">
              Collez un lien et téléchargez en MP4. Gratuit, sans compte, 30 par jour.
            </p>
          </div>

          {/* Main UI */}
          <div className="max-w-4xl mx-auto">
            <TubeForgeWeb />
          </div>
        </div>
      </main>
    </>
  );
}
