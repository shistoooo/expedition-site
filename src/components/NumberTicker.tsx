"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface NumberTickerProps {
  value: string; // e.g. "7,99" or "99,99"
  suffix?: string;
  className?: string;
  duration?: number;
}

export default function NumberTicker({ value, suffix = "", className = "", duration = 1.2 }: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  // État au repos = la vraie valeur (jamais "0"). Si l'IntersectionObserver ne
  // se déclenche pas (élément déjà visible au mount, edge cases framer-motion),
  // on affiche le vrai prix au lieu de rester bloqué sur 0€. Le compte-à-rebours
  // 0→valeur ne joue que quand l'élément entre dans le viewport en scrollant.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!isInView) return;

    // Parse the numeric value (handle French comma format)
    const numericStr = value.replace(",", ".");
    const target = parseFloat(numericStr);
    if (isNaN(target)) {
      setDisplay(value);
      return;
    }

    const decimals = value.includes(",") ? value.split(",")[1]?.length || 0 : 0;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      // Format with French comma
      const formatted = current.toFixed(decimals).replace(".", ",");
      setDisplay(formatted);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplay(value);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}{suffix}
    </span>
  );
}
