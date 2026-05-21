---
### [2026-05-21 16:00] — Phase 2.5 : Splash overlay au 1er visit

**Quoi :** Ajout d'un overlay non-bloquant qui s'affiche au tout premier visit avec 2 cards (monteur freelance / createur YouTube) menant aux landings dediees, un lien skip discret, et memorisation en localStorage pour ne plus reapparaitre.

**Pourquoi :** Compromis entre la home generique (qui dilue le message) et un quiz bloquant (qui flingue le funnel). Permet de personnaliser le parcours pour les visiteurs qui savent qui ils sont, sans bloquer le SEO ni les visiteurs hesitants qui peuvent skip et continuer sur la home.

**Fichiers touches :**
- `src/components/WelcomeOverlay.tsx` — nouveau composant. localStorage key `expedition_audience_seen_v1` stocke le choix `monteurs` | `createurs` | `skipped`. Mark-as-seen immediat a l'affichage (pas seulement au choix) pour eviter le harcelement sur refresh. Body scroll lock + Esc + click outside fonctionnels. Delai 600ms avant affichage pour laisser le hero se montrer d'abord.
- `src/app/page.tsx` — import et integration de WelcomeOverlay (apres Navbar, avant main).

**Comportement attendu :**
- 1er visit : delai 600ms, overlay apparait avec 2 cards et skip link
- Choix d'une card → navigation vers /monteurs ou /createurs (404 jusqu'aux Phases 3-4)
- Skip ou Esc ou click outside → ferme l'overlay, choix `skipped` persiste
- Visits suivants : pas d'affichage (localStorage check)
- Si localStorage bloque (mode prive, etc.) → traite comme deja vu, pas d'overlay (ne pas harceler)

**Comment annuler :**
- Retirer `<WelcomeOverlay />` de `src/app/page.tsx`
- Supprimer `src/components/WelcomeOverlay.tsx`
- Pour re-declencher l'overlay sur sa propre machine en dev : `localStorage.removeItem("expedition_audience_seen_v1")` dans la console

**Effets de bord possibles :**
- Les liens `/monteurs` et `/createurs` du splash renvoient 404 jusqu'aux Phases 3-4 — UX a clarifier avec stubs ou en accelerant les Phases suivantes.
- Cookie banner / RGPD : localStorage est utilise pour preference UX (pas de tracking), pas de consentement requis dans la plupart des cadres EU mais a documenter dans la page Confidentialite si on est strict.

---
### [2026-05-21 15:30] — Phase 2 : Refonte de la home /

**Quoi :** Refonte du positioning de la home autour de TubeForge / plugin Premiere & DaVinci. Nouveau hero, embed de la demo YouTube en 2e section, section "Pour qui c'est" avec teasing vers /monteurs et /createurs, header explicite "Suite Expedition" au-dessus des outils secondaires. Pricing inchange.

**Pourquoi :** Le hero "Les outils pour youtubeurs et prestataires" sous-vendait le produit en restant trop generique. Le nouveau hero plante directement la promesse plugin Premiere/DaVinci. La demo video sous le hero est l'asset critique de conversion. Les blocs Personas teasent les landings dediees (Phase 3-4) et permettent au visiteur de s'identifier sans quiz d'entree.

**Fichiers touches :**
- `src/components/Hero.tsx` → `src/components/HomeHero.tsx` — renommage du composant + nouveau wording du doc (tagline Premiere/DaVinci, 2 CTAs "Voir le plugin en action" + "Voir les tarifs"). CTA principal scrolle vers `#home-demo`.
- `src/components/HomeDemoVideo.tsx` — nouveau composant, embed YouTube (yqOTp7pSUlQ) via youtube-nocookie.com en 16:9 lazy load, glow violet/cyan derriere le player.
- `src/components/TubeForgeSection.tsx` — reorganise en 4 features (Plugin Premiere/DaVinci en 1er, Recherche YouTube integree, Import script, Decoupe avant DL). Mention "+ multi-DL parallele · 4K · maj hebdo" en sous-points. Retrait du sous-titre "L'alternative a 4K Video Downloader" (positionnement par le bas a eviter en hero).
- `src/components/HomePersonas.tsx` — nouveau composant, 2 cards cote a cote (monteurs purple / createurs cyan) avec lien vers `/monteurs` et `/createurs`.
- `src/components/SecondaryToolsGrid.tsx` — ajout d'un header explicite "L'aventure ne s'arrete pas la — la suite Expedition" pour rendre visible la perception d'ecosysteme.
- `src/app/page.tsx` — reorganisation des sections : Hero → Demo → 4 features TubeForge → Personas → YoutuberShowcase → Suite Expedition (header + outils + bento) → Pricing → Testimonials → FAQ.
- `next.config.ts` — CSP `frame-src` etendu pour autoriser `www.youtube-nocookie.com` et `www.youtube.com` (embed YouTube).

**Liens 404 attendus (vers /monteurs et /createurs) :**
Les CTAs des cards HomePersonas pointent vers `/monteurs` et `/createurs` qui n'existent pas encore. Routes attendues en Phase 3 et 4. Le cas est explicite cote produit (les user vont sur la home, decouvrent les 2 audiences, mais les vraies landings detaillees arrivent apres).

**Comment annuler :**
```bash
# Annuler la Phase 2 seule (apres commit) :
git revert <commit-hash-phase-2>

# Revenir avant toute la refonte :
git checkout main
```

**Effets de bord possibles :**
- Le composant `Hero.tsx` n'existe plus — toute autre page qui l'importerait casserait (verifie : grep n'a trouve que page.tsx).
- Le CSP CSP `frame-src` autorise maintenant YouTube — cela ne change rien pour les utilisateurs deja autorises a charger Stripe/Hooks, juste un assouplissement strict aux 2 domaines YouTube.
- `WhyExpeditionSection` mentionne `11,99€/mois` alors que `DiscordPionnierHero` et `pricing/` parlent de `8,03€/mois` (annuel mensualise). Incoherence preexistante — ne pas confondre avec la refonte. A clarifier separement.

---
### [2026-05-21 14:00] — Phase 1 : Renommage /pionnier → /discord-pionnier

**Quoi :** Renommage de l'URL `/pionnier` en `/discord-pionnier`, de tous les composants `Pionnier*` en `DiscordPionnier*` et du hook `usePionnierUtm` en `useDiscordPionnierUtm`. Ajout d'un redirect 308 permanent de `/pionnier` vers `/discord-pionnier`. Wording inchangé (sera adapté Phase 2+).

**Pourquoi :** Refonte du positioning du site — la landing existante devient explicitement réservée aux membres du Discord Expédition. Marianna a déjà partagé l'URL `/pionnier` dans le Discord, d'où le redirect obligatoire pour ne pas casser les liens en circulation.

**Fichiers touchés :**
- `src/app/pionnier/` → `src/app/discord-pionnier/` — renommage du dossier de la route App Router
- `src/components/pionnier/` → `src/components/discord-pionnier/` — renommage du dossier de composants
- `src/components/discord-pionnier/Pionnier*.tsx` → `DiscordPionnier*.tsx` — renommage des 9 composants
- `src/components/discord-pionnier/usePionnierUtm.ts` → `useDiscordPionnierUtm.ts` — renommage du hook UTM
- `src/app/discord-pionnier/layout.tsx` — URLs canonical et og:url mises a jour vers `/discord-pionnier`
- `src/app/discord-pionnier/page.tsx` — imports mis a jour vers `@/components/discord-pionnier/`
- `src/app/robots.ts` — disallow `/pionnier` → `/discord-pionnier`
- `src/lib/youtubers.ts` — commentaire de doc mis a jour
- `src/components/HomeYoutuberShowcase.tsx` — commentaire `PionnierTestimonials` → `DiscordPionnierTestimonials`
- `next.config.ts` — ajout d'un `redirects()` avec 308 permanent `/pionnier` → `/discord-pionnier`
- DOM IDs internes `#pionnier-hero`, `#pionnier-pricing` → `#discord-pionnier-*` (preserve les ancres internes coherentes)
- Analytics page tag Clarity : `set("page", "pionnier")` → `set("page", "discord-pionnier")`

**Preserve volontairement :**
- Tous les noms d'evenements analytics (`cta_click_pionnier`, `view_X_pionnier`) — continuite du tracking GA
- Le branding business "Vague Pionnier", "Devenir Pionnier", "Tarif Pionnier" dans tout le texte d'affichage
- Le pricing actuel (8,03€/mois) — `ON CHANGE RIEN AU PRIX`

**Comment annuler :**
```bash
git checkout main
# ou pour annuler la phase 1 seule :
git revert <commit-hash-phase-1>
```

**Effets de bord possibles :**
- Le sitemap Next.js (`src/app/sitemap.ts`) n'a pas ete audite — a verifier qu'il ne reference pas `/pionnier`.
- Les liens externes (DMs, Discord, partenariats) qui pointent vers `/pionnier` continueront de fonctionner via le redirect 308.
- Les analytics qui filtraient par URL `/pionnier` doivent etre mises a jour cote Vercel/GA pour inclure `/discord-pionnier`.
