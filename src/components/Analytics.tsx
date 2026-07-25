"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const WORKER = "https://expedition-licensing.expedition-studio.workers.dev";

// Hôte → tag `site` en base. Le funnel TubeForge (lien privé) est tracké À PART
// (site="tubeforge") pour ne pas polluer les stats du site principal.
// localhost et previews Vercel → jamais trackés.
const TRACKED_HOSTS: Record<string, string> = {
  "expeditionlauncher.store": "site",
  "www.expeditionlauncher.store": "site",
  "tubeforge.explauncheur.space": "tubeforge",
};
function currentSite(): string | null {
  return TRACKED_HOSTS[window.location.hostname] ?? null;
}

// N'inclut QUE les vrais visiteurs :
//  - exclut tout ce qui n'est pas le domaine de prod (dev/preview/lien privé)
//  - opt-out propriétaire persistant : visite `?notrack=1` une fois → tes
//    propres visites ne sont plus comptées (drapeau localStorage).
function shouldTrack(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (new URLSearchParams(window.location.search).get("notrack") === "1") {
      localStorage.setItem("expedition_notrack", "1");
    }
    if (localStorage.getItem("expedition_notrack") === "1") return false;
  } catch {
    /* localStorage indispo → on continue sur le seul filtre domaine */
  }
  return currentSite() !== null;
}

function track(event: string, page: string, meta?: Record<string, unknown>) {
  if (!shouldTrack()) return;
  const payload = { site: currentSite() ?? "site", event, page, referrer: document.referrer || "", meta: meta ?? {} };
  const url = `${WORKER}/analytics/track`;
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
  } else {
    fetch(url, { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
  }
}

export function trackEvent(event: string, meta?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  track(event, window.location.pathname, meta);
}

export default function Analytics() {
  const pathname = usePathname();
  const lastPage = useRef<string>("");
  useEffect(() => {
    if (pathname === lastPage.current) return;
    lastPage.current = pathname;
    track("pageview", pathname);
  }, [pathname]);
  return null;
}
