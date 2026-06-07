---
### [2026-06-07 15:25] — Pages dédiées /clipforge & /reviewforge + boutons "Découvrir" sous la grille

**Quoi :** Deux pages de présentation autonomes (`/clipforge`, `/reviewforge`) : hero d'identité (indigo / emerald), emplacement vidéo (`DemoPlayer`, prêt à recevoir l'ID YouTube — encart "démo bientôt" tant qu'il est vide), section features + mockup réel, et une feuille de route "Où on en est" (tracker des Vagues : TubeForge livré → ClipForge en dev → ReviewForge prévu). En entrée : deux boutons secondaires "Découvrir ClipForge/ReviewForge" ajoutés sous chaque panneau des grilles d'aperçu (home + monteurs/créateurs).

**Pourquoi :** Les panneaux ClipForge/ReviewForge "Arrive prochainement" ne menaient nulle part. Une page par outil permet de présenter le logiciel + son avancement (avec la vidéo déjà dispo) sans alourdir la home. Le CTA principal "Réserver ma place" reste intact ; le nouveau bouton est secondaire (ghost, couleur de l'outil).

**Fichiers touchés :**
- `src/app/clipforge/page.tsx` + `layout.tsx` — page dédiée ClipForge (indigo) + métadonnées SEO
- `src/app/reviewforge/page.tsx` + `layout.tsx` — page dédiée ReviewForge (emerald) + métadonnées SEO
- `src/components/shared/SuiteRoadmap.tsx` — NOUVEAU : tracker des Vagues réutilisable (prop `highlight`)
- `src/components/ToolsSection.tsx` — prop opt-in `detailHref?` → bouton secondaire indigo sous le mockup + import `Link`
- `src/components/ReviewForgeSection.tsx` — prop opt-in `detailHref?` → bouton secondaire emerald sous le mockup
- `src/components/SecondaryToolsGrid.tsx` + `src/components/shared/SuitePreviewSection.tsx` — passent `detailHref` aux deux sections

**Comment annuler :** `git revert <hash>` ; ou supprimer `src/app/clipforge/`, `src/app/reviewforge/`, `src/components/shared/SuiteRoadmap.tsx`, et retirer la prop `detailHref` (+ son usage) des 4 composants.

**Effets de bord possibles :** `detailHref` est opt-in (défaut `undefined`) → zéro impact là où les sections sont rendues sans (ex: layout horizontal). Les 2 vidéos ne sont pas branchées : constantes `CLIPFORGE_VIDEO_ID` / `REVIEWFORGE_VIDEO_ID` vides → encart placeholder affiché.

**TODO :** Coller les 2 IDs YouTube dans les constantes en haut de chaque page ; valider/ajuster les statuts dans `SuiteRoadmap` quand une vague change d'état.

---
### [2026-05-29 03:30] — Attribution partenaires (Fire Writing) + landing /via/<slug>

**Quoi :** Système de tracking des ventes par partenaire SANS code promo. Un partenaire (ex: Fire Writing) partage un lien `/via/firewriting` → cookie d'attribution first-touch 30j → envoyé au worker au checkout → stocké en BDD (`users.partner_slug`) + metadata Stripe. Landing personnalisée mélangeant l'univers du partenaire et celui d'Expédition.

**Pourquoi :** Mesurer le ROI exact (100% des achats confirmés) de chaque partenariat, sans diluer la marge avec une remise et sans dépendre d'un code à copier-coller.

**Fichiers touchés (expedition-site) :**
- `src/lib/partners.ts` — registry des partenaires (Fire Writing configuré : accent #3b82f6→#22d3ee)
- `src/lib/partnerAttribution.ts` — cookie first-touch + tracking Clarity/GA4
- `src/app/via/[slug]/page.tsx` — landing perso (hero handshake, pitch, CTA final)
- `src/app/via/[slug]/layout.tsx` — force-dynamic + robots noindex
- `src/app/checkout/page.tsx` — envoie `partnerSlug` à /auth/register et /portal/subscribe
- `src/app/robots.ts` — /via en disallow

**Fichiers touchés (expedition-launcher/licensing — worker, NON commité, chantier en cours) :**
- `migrations/0013_users_partner_attribution.sql` — colonne users.partner_slug + index
- `src/db/queries.ts` — setUserPartnerSlug (first-touch, n'overwrite pas) + getPartnerConversions
- `src/routes/auth.ts` + `src/routes/portal.ts` — acceptent partnerSlug, stockent en BDD + metadata Stripe
- `src/services/stripe.ts` — createIncompleteSubscription accepte un param metadata optionnel
- `src/routes/admin.ts` — GET /admin/partners/conversions (stats par partenaire)

**Comment annuler :** Frontend : `git revert 69119fb`. Worker : non commité, `git checkout` les 6 fichiers + supprimer migration 0013.

**Effets de bord possibles :** Le frontend envoie `partnerSlug` au worker. Tant que le worker n'est pas déployé avec la migration appliquée, ce champ est ignoré silencieusement (try/catch). Aucun impact sur les inscriptions existantes. Déployer dans l'ordre : migration D1 → worker → frontend.

**TODO :** Déposer `public/partners/firewriting.png` (fallback "F" en dégradé en attendant).

---
### [2026-05-21 18:30] — Phase 4 + ajustements splash full-screen

**Quoi :**
1. **Phase 4** — creation de la landing `/createurs` (focus + qualite de vie createur, accent cyan/sky). Pas de query param tool (les createurs ne sont pas demandes Premiere vs DaVinci dans le splash).
2. **WelcomeOverlay full-screen** — passage du modal centre a un takeover plein ecran sur demande user (la screenshot du splash en pop-up laissait voir le fond et semblait fragile visuellement).
3. **WelcomeOverlay : retrait du bouton X** — sortie via le lien "Pas sûr — je continue sur la home" uniquement (renforce visuellement pour rester clair) et touche Esc.

**Pourquoi :**
- /createurs etait la derniere landing manquante du funnel. Le splash overlay l'utilisait deja comme destination.
- Full-screen = sentiment de "vraie page d'entree" plutot que pop-up, et plus immersif.
- Retrait du X = encourage le choix (vs skip) tout en gardant la sortie possible. Le skip link agrandi compense la suppression du X.

**Fichiers crees :**
- `src/app/createurs/{page.tsx,layout.tsx}` — nouvelle landing, metadata SEO indexable.
- `src/components/createurs/CreateursHero.tsx` — wording "Ton workflow YouTube, enfin fluide dans Premiere & DaVinci" + accent cyan + nebula cyan.
- `src/components/createurs/CreateursFeatures.tsx` — 4 features angle createur ("moins de logistique, plus de creation"), icones cyan.
- `src/components/createurs/CreateursFAQ.tsx` — 6 questions createur-specifiques (workflow, prix, local-first, vs 4K Video Downloader).
- `src/components/createurs/CreateursFinalCTA.tsx` — CTA "Pret a creer sans friction ?" avec gradient cyan/purple.
- `src/components/createurs/{Mockup,Pricing,SuiteTease,StickyMobileCTA,Testimonials}.tsx` — duplications du pattern monteurs avec sed (Monteurs → Createurs, useMonteursUtm → useCreateursUtm).
- `src/components/createurs/useCreateursUtm.ts` — hook UTM avec analytics `cta_click_createurs` / `view_X_createurs`.

**Fichiers modifies :**
- `src/components/WelcomeOverlay.tsx` — passage en full-screen (backdrop opaque + nebula full-bleed), retrait du X, agrandissement du skip link (text-sm md:text-base au lieu de text-xs md:text-sm).
- Couleurs purple → cyan dans Createurs* (rebrand cyan/sky pour distinguer l'audience createur de l'audience monteur).

**Notes :**
- Les testimonials de Nahsir et Astro sont conserves (memes personnes, contenus reels) sur /monteurs et /createurs. C'est OK : les 2 sont des monteurs/createurs YouTube — le contenu fonctionne pour les 2 audiences.
- Le sticky mobile CTA pointe vers Discord OAuth comme sur monteurs (cohesion funnel).

**Comment annuler :**
- Phase 4 seule : `rm -rf src/app/createurs src/components/createurs`.
- Pop-up overlay : revert WelcomeOverlay.tsx au commit precedent.

---
### [2026-05-21 17:30] — Phase 3 + ameliorations splash + video 1.5x

**Quoi :**
1. **Phase 3** — creation de la landing `/monteurs` (ROI temps facturable, plugin Premiere/DaVinci, FAQ + final CTA orientes freelance). Support du query param `?tool=premiere|davinci|both` qui adapte dynamiquement le titre du Hero ("Le plugin Premiere..." / "DaVinci..." / "Premiere & DaVinci...") et la suite du wording.
2. **WelcomeOverlay v2** — etape 2 ajoutee : si monteur, on demande Premiere vs DaVinci vs Les deux. Le choix se transmet en query param sur /monteurs.
3. **WelcomeOverlay preview override** — localStorage est ignore tant que `NEXT_PUBLIC_VERCEL_ENV !== "production"`. Sur les previews Vercel et en local dev, l'overlay s'affiche TOUJOURS, ce qui permet de valider le funnel sans reset manuel.
4. **URL `?reset-overlay=1`** — efface localStorage et re-trigger l'overlay sur n'importe quel environnement, utile pour debug en prod.
5. **HomeDemoVideo 1.5x** — playback rate impose a 1.5x via l'API YouTube IFrame (script externe charge a la mont du composant, applique en `onReady` + reapplique en `onStateChange:PLAYING`). CSP `script-src` etendu pour autoriser `www.youtube.com` et `s.ytimg.com`.

**Pourquoi :**
- Phase 3 = la landing dediee monteurs etait le palier strategique le plus urgent (vise par les DMs Nina + le splash overlay).
- Tool param = pour rendre le pitch granulaire sans dupliquer la page entiere.
- Preview override = le user veut pouvoir tester le splash a chaque deploy sans flusher son localStorage a la main.
- Video 1.5x = demande explicite, le rythme par defaut etait trop lent pour le contexte demo.

**Fichiers touches / crees :**
- `src/components/WelcomeOverlay.tsx` — refonte 2-step (audience + tool), reset URL param, preview override.
- `src/components/HomeDemoVideo.tsx` — refonte avec YouTube IFrame API + setPlaybackRate(1.5).
- `next.config.ts` — CSP `script-src` etendu pour l'API YouTube IFrame.
- `src/app/monteurs/{page.tsx,layout.tsx}` — nouvelle landing complete. Metadata SEO indexable (contrairement a discord-pionnier qui est noindex).
- `src/components/monteurs/MonteursHero.tsx` — custom, support tool param via useSearchParams.
- `src/components/monteurs/MonteursFeatures.tsx` — 4 features wording freelance.
- `src/components/monteurs/MonteursFAQ.tsx` — 6 questions monteur-specifiques (ROI, tarif, local-first, etc.).
- `src/components/monteurs/MonteursFinalCTA.tsx` — CTA final avec angle "heures facturables".
- `src/components/monteurs/MonteursMockupSection.tsx`, `MonteursPricing.tsx`, `MonteursSuiteTease.tsx`, `MonteursStickyMobileCTA.tsx`, `MonteursTestimonials.tsx`, `useMonteursUtm.ts` — duplications du pattern discord-pionnier avec sed-rename. Pricing inchange.

**Notes :**
- Les analytics events conservent leurs noms (`cta_click_monteurs`, etc.) pour distinguer les sources.
- `useSearchParams` necessite Suspense → MonteursHero est wrappe dans `<Suspense>` dans page.tsx.
- La route `/createurs` reste 404 jusqu'a Phase 4.

**Comment annuler :**
- Phase 3 seule : `rm -rf src/app/monteurs src/components/monteurs` (et retirer la mention dans le splash).
- WelcomeOverlay v2 : revert sur HEAD pour ce fichier, idem HomeDemoVideo.

**Effets de bord possibles :**
- Le `NEXT_PUBLIC_VERCEL_ENV` n'est defini que sur Vercel ; en `next dev` local il est undefined → traite comme non-prod → overlay s'affiche toujours en local. Comportement OK.
- L'API YouTube IFrame charge un script externe ~50KB. Premier affichage de la home : leger surcout reseau mais lazy (apres mount du composant).

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
