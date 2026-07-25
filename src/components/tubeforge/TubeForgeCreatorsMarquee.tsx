"use client";

import Image from "next/image";
import { youtubers } from "@/lib/youtubers";

// Version ember (DA TubeForge) du marquee YouTubeurs de la home.
// Réutilise la source unique `@/lib/youtubers` — ajouter/retirer quelqu'un
// se fait à un seul endroit. Anneau + glow orange au lieu du violet home.
const MARQUEE_DURATION_SEC = 42;
const AMBER = "#ff6a1f";

export default function TubeForgeCreatorsMarquee() {
  // Liste dupliquée → boucle linéaire sans saut (cf. HomeYoutuberShowcase).
  const duplicated = [...youtubers, ...youtubers];

  return (
    <div
      className="relative max-w-3xl mx-auto"
      style={{
        overflowX: "hidden",
        overflowY: "visible",
        maskImage: "linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)",
      }}
    >
      <div
        className="flex items-start gap-7 md:gap-9 py-3 will-change-transform animate-marquee w-max"
        style={{ "--marquee-duration": `${MARQUEE_DURATION_SEC}s` } as React.CSSProperties}
      >
        {duplicated.map((y, i) => (
          <a
            key={`${y.handle}-${i}`}
            href={y.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3 shrink-0"
            aria-label={`Chaîne YouTube de @${y.handle}`}
            aria-hidden={i >= youtubers.length ? "true" : undefined}
            tabIndex={i >= youtubers.length ? -1 : undefined}
          >
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-[#ff6a1f]/60 transition-all duration-300 shadow-xl shadow-black/40">
              <div
                className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: "radial-gradient(circle at center, rgba(255,106,31,0.5), transparent 70%)", filter: "blur(14px)" }}
              />
              <Image
                src={y.avatar}
                alt={`Avatar de la chaîne @${y.handle}`}
                fill
                sizes="(min-width: 768px) 56px, 48px"
                className="object-cover relative"
              />
            </div>
            <span className="text-[11px] text-white/45 group-hover:text-white/90 transition-colors font-mono tracking-tight whitespace-nowrap">
              @{y.handle}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export { AMBER };
