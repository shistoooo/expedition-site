# UI Architect — Expedition Site Memory

## Stack
- Next.js 16 App Router + Turbopack. All components are `"use client"` by default.
- Tailwind CSS v4 (`@import "tailwindcss"` — no tailwind.config.js)
- Framer Motion for animations
- Lucide React for icons

## Design Tokens (globals.css)
- Background: `#06051a` (deep navy-purple, NOT pure black)
- Primary accent: `#8b5cf6` (violet-purple)
- Secondary: `#3b82f6` (blue)
- Accent: `#06b6d4` (cyan)
- Foreground: `#f0eef5`
- Font display: `var(--font-syne)` — Syne loaded via Next.js font system
- Container: `.container-main` class (max-width 1200px, responsive padding)

## Product Color Identities
- **ClipForge**: indigo-to-purple gradient (`from-indigo-400 to-purple-500`)
- **TubeForge**: red-to-orange gradient (`from-red-500 to-orange-500`)
- **ReviewForge**: emerald-to-cyan gradient (`from-emerald-400 to-cyan-400`)
- **Brand/Hero**: violet-to-cyan (`from-violet-400 via-purple-400 to-cyan-400`)

## Section Label Pattern (editorial style)
Section labels use: `text-xs font-mono uppercase tracking-widest [color]/60 mb-6 flex items-center gap-2`
with a dash prefix: `<span className="w-3 h-px bg-[color]/50 inline-block" />`
NOT bare text, NOT pill badges.

## CursorGlow
- Lives at `src/components/CursorGlow.tsx`
- Only rendered on homepage (`src/app/page.tsx`)
- Settings: 400px radius, opacity 0.15, duration 0.15s — this is the calibrated sweet spot

## Tone for Creators
This site targets YouTubers/video editors — they want energy and personality.
Do NOT strip gradients from product names. Do NOT use bare flat color on headlines.
The "Un seul abonnement." line MUST have a gradient (not flat purple).

## Animation Standard
- Easing: `[0.16, 1, 0.3, 1]` (easeOutExpo) — used consistently across all sections
- Stagger: 0.08s between list items
- Entry: `opacity: 0, y: 20` → `opacity: 1, y: 0` with `viewport: { once: true }`

## Typography Scale (established)
- Hero h1: `text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-[-0.04em]`
- Product section h2: `text-5xl md:text-6xl font-black tracking-[-0.03em]`
- Info section h2: `text-4xl md:text-5xl lg:text-6xl font-black tracking-[-0.03em]`
- Body: `text-lg md:text-xl text-white/55-60 leading-relaxed`
- globals.css: h1 is `font-weight: 900`, h2 is `font-weight: 800`

## Spacing Standard
- Hero: `pt-36 pb-48 md:pt-56 md:pb-64`
- Major product sections: `py-32 md:py-40`
- Info/secondary sections: `py-32 md:py-40`

## Section Transition Pattern
Use `.section-fade-top` CSS class instead of `border-t border-white/5`. Defined in globals.css
as a `::before` pseudo-element gradient line — atmospheric fade, not a hard cut.

## Nebula Ambient Glow Pattern (per section)
Radial gradient `div` positioned absolutely behind mockups, `pointer-events-none`:
- TubeForge: `rgba(239,68,68,0.18)` red core + `rgba(76,29,149,0.3)` deep purple base
- ClipForge: `rgba(99,102,241,0.18)` indigo + `rgba(168,85,247,0.15)` purple top-right
- ReviewForge: `rgba(16,185,129,0.16)` emerald + `rgba(6,182,212,0.14)` cyan
- Hero: `rgba(139,92,246,0.18)` violet + `rgba(6,182,212,0.09)` cyan lower-right
- Pricing: `rgba(139,92,246,0.14)` violet centered
- Discord: `rgba(88,101,242,0.12)` Discord-blue centered

## Feature Icon Hover Pattern (named group)
Use `group/item` on the `<li>`, `group-hover/item:` on icon wrapper and icon.
Icon wrapper adds: `bg-[color]/10 border-[color]/25 shadow-[0_0_20px_[color]/0.12]`
Icon adds: `scale-110`

## Pricing Card Gradient Border Technique
Outer `motion.div`: `p-[1px]` + `background: linear-gradient(135deg, ...)` creates colored border.
Inner `div`: `rounded-2xl overflow-hidden` wraps content with dark `bg-[#0d0d16]`.
Add `h-px` top highlight line: `bg-gradient-to-r from-transparent via-purple-400/40 to-transparent`.

## CTA Hover Standard
All primary CTAs: `hover:shadow-[0_0_50px_rgba([color],0.4),0_8px_32px_rgba(0,0,0,0.4)] hover:scale-[1.03-1.04] active:scale-[0.98] transition-all duration-300`

## Economie Page Patterns (established 2026-03)
- Section transitions: `SectionFade` component (gradient fade bands, not SectionDivider lines)
  - Blends `fromColor` → `toColor` matching adjacent section accent colors over 32px tall band
- Economie section headings: `text-4xl md:text-6xl lg:text-7xl font-black tracking-tight`
- Economie section padding: `py-28 md:py-36`
- Nebula per section: amber for gold/bronze, purple for éclats/boutique, cyan for pricing/tarifs
- Legendary card: `outerGlow` in RARITY_CONFIG for persistent always-on ambient shadow
- Gacha draw button: layered spinning conic border + pulsing outer aura even when disabled

## JSX Pitfall — Icon Components in Array Objects
When inlining icon components inside array objects for `.map()`, the property key MUST be
capitalized (`StepIcon`, `CardIcon`, etc.). `<item.icon />` is invalid JSX. Use `item.StepIcon`.

## Key File Paths
- Homepage: `src/app/page.tsx`
- Ambassador: `src/app/ambassador/page.tsx`
- Economie: `src/app/economie/page.tsx`
- Globals CSS: `src/app/globals.css`
- Components: `src/components/`
