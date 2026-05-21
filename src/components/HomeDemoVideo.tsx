"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];
const VIDEO_ID = "yqOTp7pSUlQ";
const PLAYBACK_RATE = 1.5;

type YTPlayer = {
  setPlaybackRate: (rate: number) => void;
  destroy: () => void;
};

type YTPlayerEvent = { target: YTPlayer; data?: number };

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLIFrameElement | string,
        config: {
          events?: {
            onReady?: (event: YTPlayerEvent) => void;
            onStateChange?: (event: YTPlayerEvent) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: { PLAYING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return;
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }

    // Stack onto any pre-existing handler so multiple loaders don't clobber each other
    const previousHandler = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousHandler?.();
      resolve();
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
    }
  });
}

export default function HomeDemoVideo() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  useEffect(() => {
    let cancelled = false;
    const iframe = iframeRef.current;
    if (!iframe) return;

    loadYouTubeAPI().then(() => {
      if (cancelled || !iframeRef.current || !window.YT) return;

      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: (event) => {
            // Apply playback rate immediately so the very first play is at 1.5x
            try {
              event.target.setPlaybackRate(PLAYBACK_RATE);
            } catch {
              // Ignore — older browsers or unsupported rates
            }
          },
          onStateChange: (event) => {
            // Re-apply if YouTube reset it (can happen after seek or quality change)
            if (event.data === window.YT?.PlayerState.PLAYING) {
              try {
                event.target.setPlaybackRate(PLAYBACK_RATE);
              } catch {
                // Ignore
              }
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {
        // Ignore teardown errors
      }
      playerRef.current = null;
    };
  }, []);

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
                  ref={iframeRef}
                  src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0&modestbranding=1&enablejsapi=1&origin=${typeof window !== "undefined" ? window.location.origin : ""}`}
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
