"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type CtaLocation =
  | "hero"
  | "hero_primary"
  | "hero_secondary_discord"
  | "pricing"
  | "sticky"
  | "final";

export type ViewSection = "pricing" | "faq" | "faq_open";

export function useCreateursUtm() {
  const sp = useSearchParams();

  const utmString = useMemo(() => {
    const entries = UTM_KEYS
      .map((k) => [k, sp?.get(k) ?? null] as const)
      .filter(([, v]) => v !== null && v !== "");

    if (entries.length === 0) return "";
    return entries
      .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
      .join("&");
  }, [sp]);

  function getDiscordOAuthUrl(): string {
    const base = "/api/discord/auth?plan=monthly";
    return utmString ? `${base}&${utmString}` : base;
  }

  function getCheckoutUrl(plan: "monthly" | "yearly"): string {
    const base = `/checkout?plan=${plan}`;
    return utmString ? `${base}&${utmString}` : base;
  }

  function fireCtaEvent(location: CtaLocation) {
    if (typeof window !== "undefined") {
      window.gtag?.("event", "cta_click_createurs", { cta_location: location });
    }
  }

  function fireViewEvent(section: ViewSection) {
    if (typeof window !== "undefined") {
      window.gtag?.("event", `view_${section}_createurs`);
    }
  }

  return { getDiscordOAuthUrl, getCheckoutUrl, fireCtaEvent, fireViewEvent };
}
