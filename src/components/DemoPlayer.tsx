"use client";

import { useEffect, useRef } from "react";

const DEFAULT_VIDEO_ID = "yqOTp7pSUlQ";
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

type DemoPlayerProps = {
  /** YouTube video ID to embed. Defaults to the main TubeForge demo. */
  videoId?: string;
  /** Force the player to autoplay as soon as the YouTube API is ready (muted) */
  autoplay?: boolean;
  className?: string;
};

export default function DemoPlayer({ videoId = DEFAULT_VIDEO_ID, autoplay = false, className = "" }: DemoPlayerProps) {
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
            try {
              event.target.setPlaybackRate(PLAYBACK_RATE);
            } catch {
              // Ignore — unsupported rate
            }
          },
          onStateChange: (event) => {
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

  const autoplayParam = autoplay ? "&autoplay=1&mute=1" : "";

  return (
    <iframe
      ref={iframeRef}
      src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1${autoplayParam}`}
      title="TubeForge — Démo du plugin Premiere Pro & DaVinci Resolve"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className={`w-full h-full ${className}`}
    />
  );
}
