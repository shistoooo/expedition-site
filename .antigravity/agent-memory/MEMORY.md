# UI Architect Memory — Expedition Site

## Stack
- Next.js App Router, Tailwind v4 (@import "tailwindcss"), Framer Motion
- Font: Geist Sans (body), Geist Mono, Syne (display/headings via --font-display)
- Global CSS: /src/app/globals.css
- Design tokens: --primary: #8b5cf6 (violet), --secondary: #3b82f6, --accent: #06b6d4
- Background: #06051a (very dark purple-tinted black)
- Utility classes: .gradient-text (violet gradient), .glass (backdrop-blur), .container-main

## Component Map
- Hero, Navbar, Footer, CursorGlow — layout primitives
- SocialProofSection — testimonials (placeholder data, no real avatars)
- TubeForgeSection, ToolsSection (ClipForge), ReviewForgeSection — product showcases with interactive mockups
- TransparencySection, HomePricing, PhilosophySection, DiscordSection — conversion sections
- Pages: /pricing, /checkout, /checkout/success, /account, /ambassador, /tools, /launcher

## Patterns in Use
- All section badges: rounded-full pill with icon + text, semi-transparent bg
- Animated pulsing dot: animate-ping pattern used 3+ times for "live" status
- Primary CTA: white bg + black text (inverted), secondary: glass/white/5 ghost
- Product section layout: flex lg:flex-row, text left + mockup right (alternating)
- Card pattern: rounded-2xl bg-white/[0.03-0.05] border border-white/10
- Motion: all whileInView with opacity+y, staggerChildren on lists

## Audit Conducted + Fixes Applied (March 2026)
Full UX/UI audit completed. Fixes done:
- gradient-text removed from all components
- Badge pills replaced with font-mono uppercase labels
- PhilosophySection: icon-in-card grid replaced with numbered pull-quote divider list
- DiscordSection: spring-scale logo animation removed, fake stats removed, whileHover scale on CTA removed, generic copy replaced with specific use cases
- CursorGlow: removed from all pages (0.06 opacity = invisible + mousemove re-render waste). Component file still exists but unused.
- tools/page.tsx: replaced with server redirect to /launcher
- TubeForgeSection: "Tout ce dont vous avez besoin" replaced with concrete feature summary
- Background standardized to bg-[#06051a] across all pages (was bg-[#0a0a0a] or bg-[#030304] in many places)

## Background Rule
ALWAYS use `bg-[#06051a]` on page wrappers. This matches --background in globals.css. Never use #0a0a0a or #030304.

## Icon Type Constraint
Lucide icons typed as `React.ComponentType<{ className?: string }>` do NOT accept a `style` prop at call-site.
Workaround: wrap in `<span style={{ color }}>` or convert to a Tailwind class.

## Economy Page (/economie)
- Layout file: `src/app/economie/layout.tsx` (pass-through with metadata)
- Page file: `src/app/economie/page.tsx` — full "game marketplace" aesthetic
- 8 sections: Hero, Devises, Wallet (imports WalletSection), Boutique Éclats, Cosmétiques, Gacha, Tarifs Services, Mining Social
- CSS coin design: circular div with conic/linear gradient + box-shadow glow, framer-motion float animation
- Shop cards: rarity system (common/rare/epic/legendary) drives border color + glow + badge
- Section separators: `border-t border-white/5` on `<section>` — no SectionDivider component
- Shop buttons: "Sur demande — #boutique-éclats" (not "Bientôt disponible")
- Devises: 2-col layout (list of circles + text LEFT, conversion table RIGHT) — not 3 identical cards
- Cosmetics: single `grid-cols-3 gap-px bg-white/6` surface with internal column separators
- Gacha odds: semantic `<table>` with large typographic `%` values — not colored pill badges
- Gacha rewards: flat list (icon + name + rarity label) — not 12-item mini-card grid
- Mining Social: 2-col layout (editorial text LEFT, semantic `<table>` capital RIGHT)
- CTA: left-aligned, two-line heading (strong line / muted line at white/35)

## Framer Motion Easing — CRITICAL
Framer Motion requires cubic-bezier arrays typed as explicit tuples, NOT plain arrays.
Always declare: `const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];`
Using `const EASE = [0.16, 1, 0.3, 1]` causes TS2322 errors at every `transition={{ ease }}` site.

## Launcher Page Patterns (src/app/launcher/page.tsx)
- Accent: blue (`rgba(37,99,235,...)`) — not violet, not cyan
- Section transitions: 1px `<div aria-hidden>` with `linear-gradient(90deg, transparent, rgba(37,99,235,0.2), transparent)` — NOT `border-t`
- Ambient nebula: `position:absolute` div with `radial-gradient` + `filter:blur(40px)` + `aria-hidden` + `pointer-events-none`
- Mockup mockup animations: scoped `@keyframes` injected via `<style>` tag at bottom of component (launcher-blink, launcher-cursor, launcher-pulse-ring)
- `useReducedMotion()` used — all motion values guarded: `shouldReduceMotion ? 0 : 20`
- Status badge system: STATUS_CONFIG record drives badgeBg/badgeBorder/badgeText/barColor/barWidth per roadmap status string
- Hero CTA: inline `onMouseEnter/Leave` handlers to animate `boxShadow` (Tailwind can't animate arbitrary shadows)
- Product cards ("Disponible maintenant"): dominant visual treatment — gradient-tinted bg, glowing border, feature chips tinted per product color

## Pricing Page Patterns (src/app/pricing/page.tsx)
- Active card: `scale(1.04)` outer transform + animated conic border via WebkitMask exclude trick (reuses `cta-spin` keyframe + `@property --cta-angle` from globals.css)
- Inactive cards: `opacity: 0.65`, muted all text, no glow
- Feature checkmarks: circular icon container (4x4, rounded-full) — not bare Check icons
- Section separators: 1px `<div>` with `linear-gradient(90deg, transparent, color, transparent)`
- Trust box: glass card, top-edge 1px gradient accent line, Star icon, gradient heading text via WebkitTextFillColor
- Page-level nebula blobs: `fixed inset-0 z-[1]` layer with 3 radial-gradient blobs (violet top-left, blue right, cyan bottom)
- CTA button: `linear-gradient(135deg, #7c3aed…)` with `boxShadow` glow + shimmer overlay div on group-hover
- Lucide `Rocket` icon used inside CTA link text (not just label)

## Wallet / Economy System (WalletSection.tsx)
- Component: `src/components/WalletSection.tsx` — full self-contained wallet UI
- Animated counter: `useMotionValue` + `useSpring` from framer-motion (stiffness:200, damping:28)
- Collapsible sections: `AnimatePresence` + `height: 0 → "auto"` transition — works cleanly
- Balance numbers: `text-3xl font-black tracking-tight` (not font-bold)
- Sub-label style in cards: `text-[10px] font-mono uppercase tracking-widest text-white/35`
- Economy rates: 20 Bronze = 1 Gold, 100 Gold = 1 Éclat, Gold cap = 500 EX
