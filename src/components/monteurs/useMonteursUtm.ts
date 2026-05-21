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

export type CtaLocation = "hero" | "pricing" | "sticky" | "final";

export function useMonteursUtm() {
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

  /**
   * CTA dominant: skip direct vers Discord OAuth → user voit immédiatement 8,03€
   * (au lieu de /checkout?plan=monthly-discord qui montre 11,99€ jusqu'à OAuth)
   */
  function getDiscordOAuthUrl(): string {
    const base = "/api/discord/auth?plan=monthly";
    return utmString ? `${base}&${utmString}` : base;
  }

  /**
   * CTAs alternatifs : direct vers /checkout (annuel ou mensuel sans Discord)
   */
  function getCheckoutUrl(plan: "monthly" | "yearly"): string {
    const base = `/checkout?plan=${plan}`;
    return utmString ? `${base}&${utmString}` : base;
  }

  function fireCtaEvent(location: CtaLocation) {
    if (typeof window !== "undefined") {
      window.gtag?.("event", "cta_click_pionnier", { cta_location: location });
    }
  }

  function fireViewEvent(section: "pricing" | "faq") {
    if (typeof window !== "undefined") {
      window.gtag?.("event", `view_${section}_pionnier`);
    }
  }

  return { getDiscordOAuthUrl, getCheckoutUrl, fireCtaEvent, fireViewEvent };
}
