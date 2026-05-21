"use client";

import { motion } from "framer-motion";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function HomeDemoVideo() {
  return (
    <section
      id="home-demo"
      className="pt-12 md:pt-16 pb-20 md:pb-28 relative scroll-mt-20"
    >
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8 md:mb-10">
            <p className="text-xs font-mono uppercase tracking-widest text-purple-300/70 mb-3 flex items-center justify-center gap-2">
              <span className="w-3 h-px bg-purple-300/50 inline-block" />
              D&eacute;mo en 60&nbsp;secondes
              <span className="w-3 h-px bg-purple-300/50 inline-block" />
            </p>
            <h2 className="text-2xl md:text-4xl font-black tracking-[-0.02em] text-white/90 leading-tight">
              Le plugin que tu vas vouloir <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">dans Premiere</span> demain matin.
            </h2>
          </div>

          <div className="relative">
            {/* Glow nebula behind the player */}
            <div
              className="absolute -inset-8 pointer-events-none opacity-70"
              style={{
                background:
                  "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(139,92,246,0.20) 0%, rgba(34,211,238,0.10) 40%, transparent 75%)",
                filter: "blur(40px)",
              }}
            />

            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_-15px_rgba(139,92,246,0.35)] bg-black/40">
              <div className="aspect-video w-full">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/yqOTp7pSUlQ?rel=0&modestbranding=1"
                  title="TubeForge — D&eacute;mo du plugin Premiere Pro &amp; DaVinci Resolve"
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
