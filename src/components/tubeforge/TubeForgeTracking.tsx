"use client";

import { useEffect } from "react";
import { trackEvent } from "@/components/Analytics";

/**
 * Mesure fine du funnel TubeForge (monté par tubeforge/layout.tsx) :
 *  - "click"        {id}  → tout élément portant data-track="…" (CTA, cartes prix,
 *                           étapes du checkout, FAQ) via un listener délégué unique
 *  - "section_view" {id}  → chaque section data-section="…" vue à ≥35%, UNE fois
 *                           par visite → montre où les visiteurs s'arrêtent
 *  - "scroll_depth" {pct} → profondeur max atteinte, envoyée au départ de la page
 *
 * Le filtre « vrais visiteurs » vit dans Analytics.tsx : domaines autorisés
 * uniquement + opt-out propriétaire persistant via ?notrack=1.
 */
export default function TubeForgeTracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.("[data-track]") as HTMLElement | null;
      if (el?.dataset.track) trackEvent("click", { id: el.dataset.track });
    };
    document.addEventListener("click", onClick, true);

    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          const id = (en.target as HTMLElement).dataset.section;
          if (en.isIntersecting && id && !seen.has(id)) {
            seen.add(id);
            trackEvent("section_view", { id });
          }
        }
      },
      { threshold: 0.35 },
    );
    document.querySelectorAll<HTMLElement>("[data-section]").forEach((n) => io.observe(n));

    let maxPct = 0;
    const onScroll = () => {
      const h = document.documentElement;
      const pct = Math.round(((h.scrollTop + window.innerHeight) / h.scrollHeight) * 100);
      if (pct > maxPct) maxPct = pct;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onHide = () => trackEvent("scroll_depth", { pct: Math.min(100, maxPct) });
    window.addEventListener("pagehide", onHide);

    return () => {
      document.removeEventListener("click", onClick, true);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", onHide);
    };
  }, []);
  return null;
}
