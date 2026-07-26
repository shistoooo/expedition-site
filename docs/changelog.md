---
### [2026-07-26 18:30] — Mon diagnostic du PoToken etait FAUX : c'est le visitorData qui compte

**Quoi :** Un agent de recherche lance sur les plans de secours a isole une variable que je n'avais pas isolee, et sa conclusion invalide la mienne. **Ce n'est pas le PoToken BotGuard qui leve le blocage anti-robot, c'est le `visitorData`.** J'avais attribue le merite au jeton parce que je les envoyais toujours ENSEMBLE. Le systeme marchait, mais pas pour la raison ecrite dans mon code — et j'avais cree un point de rupture unique en couplant la session a BotGuard.

**La mesure, variable isolee, client `android_vr`, meme instant :**

| condition | resultat |
|---|---|
| sans `visitorData` | 2 videos sur 4 refusees |
| `visitorData` SEUL, aucun jeton | **4 sur 4 passent** |

Reproduit par l'agent sur 5 videos (5/5) puis 2 autres series. Test apparie `vd` seul contre `vd` + vrai PoToken : **4/6 contre 3/6** — du bruit. Le jeton n'apporte rien de mesurable.

**Le point de rupture que j'avais introduit :** dans `webdl.ts`, `resolve()` obtenait le `visitorData` *a travers* `getAttestation()`. Une panne de BotGuard renvoyait `null` et **emportait le `visitorData` avec elle**. Mon test de « mode degrade » etait passe uniquement parce que le point de presence n'etait pas bloque a cet instant : il ne prouvait pas ce que je croyais.

**Ce qui a ete corrige :**
1. **Le `visitorData` ne depend plus de rien cote page.** Le Worker en obtient un tout seul (`vd:current` en KV, puis `fetchVisitorData()`) quand la page n'en fournit pas. Verifie : 4 videos sur 4 resolues avec **rien du tout** envoye par le client.
2. **Le PoToken passe en SECOURS a la demande.** Plus de calcul BotGuard au chargement : il n'est frappe que si une resolution est refusee pour motif anti-robot, puis la resolution est rejouee. Verifie en prod : `client=android_vr`, 1080p, `botguard_appele: false`, aucun jeton en cache, et les 440,5 Mo arrivent quand meme (2 pistes, avc1 + mp4a).
3. **Chaine de clients elaguee de 7 a 3.** Mesure de l'agent : `tv_embed`, `web_embed`, `mweb`, `tv` et `ios_music` etaient **morts a 100%** (ERROR / « La page doit etre actualisee » / LOGIN_REQUIRED). Ils ne produisaient que de la latence et des appels — donc du 403. Reste `android_vr` (aligne sur la version 1.65.10 que yt-dlp utilise, et **seul client sans plafond d'octets**, verifie jusqu'a 440 Mo), puis `android` (id 3, absent de ma chaine, **lui aussi plafonne** — piege que mon code n'attendait pas) et `ios`, tous deux avec `cappedBytes`.
4. **Reprise avec attente croissante et gigue sur les erreurs transitoires.** Le mode d'echec le plus frequent n'est ni le robot ni le PoToken : c'est un **HTTP 403** sur l'appel player, une limite de debit par IP declenchee par les rafales (9 succes sur 15 appels d'affilee). Une pause suffit.
5. **`/api/stream` utilise l'en-tete `Range:` pour tout le monde.** Mesure : sur 4 connexions paralleles, l'en-tete donne 7,79 Mo/s contre 7,47 pour `&range=` — **c'est le parallelisme qui debride, pas la forme du range** (une connexion unique plafonne a ~0,8 Mo/s dans les deux cas). Et un en-tete ne touche pas a l'URL, alors qu'ajouter un parametre non signe a une URL googlevideo la fait passer en 403. Le scenario « YouTube ferme `&range=` » disparait.
6. **Le message de baisse de qualite ne ment plus.** Il distinguait mal deux causes tres differentes : le fichier trop lourd pour la memoire du navigateur, ou un client plafonne par YouTube. Dire « memoire » dans le second cas etait faux ; la page annonce maintenant la vraie raison et la resolution qui existait.

**Fichiers touches :**
- (hors repo) `tubeforge-webdl/src/youtube.js` — chaine reduite a 3 clients, `android_vr` en 1.65.10, `android` ajoute avec `cappedBytes`, reprise exponentielle + gigue, `bestHeight`
- (hors repo) `tubeforge-webdl/src/index.js` — `visitorData` autonome, `Range:` seul, `client` / `downgradeReason` / `bestHeight` exposes
- `src/lib/potoken.ts` — `getVisitorData()` et `getPoToken()` separees ; en-tete recrit pour dire ce qui est mesure
- `src/lib/webdl.ts` — resolution en deux temps (vd, puis jeton seulement si refus anti-robot) ; `warmSession()` remplace `warmAttestation()`
- `src/app/tubeforge/telecharger/page.tsx` — prechauffage de session au lieu de BotGuard ; message de baisse honnete

**Culs-de-sac enterres par l'agent, a ne pas reexplorer :** `createColpstartToken` (teste dans un etat reellement bloque : LOGIN_REQUIRED partout) ; parser `ytInitialPlayerResponse` (la page `watch` ne contient **plus aucune URL**, ni chiffree ni en clair — le client web est passe 100% SABR) ; Invidious (0 instance exploitable sur 7 testees) ; Piped (0 sur 5) ; faire lire googlevideo directement par le navigateur (ACAO est une liste blanche stricte, et ajouter `&origin=` casse la signature). Les autres bibliotheques de PoToken enrobent **la meme** VM Google : elles tomberont ensemble.

**Comment annuler :** `npx wrangler rollback` depuis `tubeforge-webdl/` ; `git revert <hash>` cote page.

**Effets de bord possibles :** `'unsafe-eval'` reste dans la CSP de cette seule route parce que le secours BotGuard doit pouvoir s'executer le jour ou il sert — c'est un relachement conserve pour une valeur non prouvee, et c'est un candidat au retrait si le secours ne se declenche jamais. Reduire la chaine a 3 clients diminue la couverture theorique : si `android_vr` tombe durablement, il ne reste que deux clients plafonnes a 25 Mo, donc les videos longues echoueront proprement au lieu d'etre servies en mauvaise qualite. **A retenir sur la methode : envoyer deux nouveautes ensemble et conclure que ca marche, c'est ne rien avoir mesure.**

---
### [2026-07-26 16:50] — Trois bugs de telechargement trouves en verifiant les 4 plateformes de bout en bout

**Quoi :** Avant de repondre « oui c'est fonctionnel », j'ai teste un VRAI telechargement par l'interface pour chacune des 4 plateformes. YouTube passait ; **les trois autres etaient cassees**, chacune pour une raison differente. Toutes corrigees et re-verifiees.

**Pourquoi cette verification :** je n'avais prouve que la RESOLUTION pour TikTok, X et Twitch (le lien est bien reconnu, les metadonnees remontent). Le telechargement lui-meme n'avait jamais ete execute par la page. C'etait un trou dans mes preuves, et les trois bugs etaient dedans.

**Bug 1 — X/Twitter : 403, cause = l'en-tete `Referer`.** Mesure sur la meme URL : `curl` sans `Referer` -> 200 ; `curl` avec un `Referer` etranger -> **403**. Le navigateur en envoie un par defaut. Correctif : `referrerPolicy: "no-referrer"` sur les deux chemins de telechargement. Ce n'est pas cosmetique, c'est la condition pour que le CDN reponde.

**Bug 2 — Twitch : « Failed to fetch », cause = cache CORS de CloudFront.** La requete SORT bien du navigateur (un `fetch` en `mode: 'no-cors'` reussit, reponse opaque) mais revient **sans en-tete CORS**, alors que `curl` avec `Origin` obtient bien `Access-Control-Allow-Origin: *`. C'est le piege connu de CloudFront : il met en cache une reponse produite pour une requete sans `Origin`, puis la sert au navigateur. **Cet etat de cache ne nous appartient pas** : on ne peut donc pas se fier au telechargement direct. Correctif : le Worker fournit TOUJOURS une URL de relais en plus de l'URL directe, et la page tente le direct (gratuit) puis retombe sur le relais si ca casse. Aucune violation de CSP n'etait en cause — verifie avec un ecouteur `securitypolicyviolation`.

**Bug 3 — TikTok : 403 des la 2e requete, cause = URLs liees a la session.** La premiere tranche passait, les suivantes non ; et depuis `curl`, meme la premiere echouait. Les URLs de media TikTok exigent les cookies poses par la page (`ttwid` & co). Correctif : `resolveTikTok` capture les `set-cookie` de la page et les renvoie ; le relais les transmet en `Cookie`. Verifie : requete unique -> 200 avec les 11 872 497 octets exacts, puis une requete partielle -> 206.

**Fichiers touches :**
- `src/lib/webdl.ts` — `referrerPolicy: "no-referrer"` sur `fetchChunked` et `fetchWhole` ; repli automatique sur `file.relayUrl` quand le direct echoue ; champ `relayUrl` sur le type
- (hors repo) `tubeforge-webdl/src/index.js` — URL de relais systematiquement calculee et renvoyee ; parametre `ck` transmis en `Cookie` par `/api/stream`
- (hors repo) `tubeforge-webdl/src/platforms.js` — capture des cookies de session TikTok

**Verification finale, par l'interface, fichier inspecte a chaque fois :**
- YouTube 441 Mo, 1080p, `ftyp`+`moov`+`mdat`, **2 pistes** (avc1 + mp4a), 904 s, audio present
- X/Twitter 20,21 Mo, en-tete `ftyp`
- Twitch 44,41 Mo, en-tete `ftyp` (passe par le repli relais)
- TikTok 11,32 Mo, en-tete `ftyp` (relais + cookies de session)

**Comment annuler :** `git revert <hash>` cote page ; `npx wrangler rollback` depuis `tubeforge-webdl/`.

**Effets de bord possibles :** le repli relais fait passer par nous des octets qui auraient pu etre gratuits — c'est un choix de fiabilite, et il ne se declenche qu'apres un echec du direct. Le compteur de progression repart de zero quand le repli s'active (le fichier est retelecharge depuis le debut). Les cookies de session TikTok voyagent dans l'URL signee du relais : ce sont des cookies d'un visiteur anonyme, pas des donnees personnelles, et la signature empeche qu'on detourne le relais. **A retenir : prouver la resolution ne prouve RIEN sur le telechargement** — chaque plateforme a son propre piege cote CDN.

---
### [2026-07-26 15:40] — Vraie solution anti-robot : PoToken BotGuard dans le navigateur + plafond iOS decouvert

**Quoi :** Le telechargeur ne depend plus de la reputation de nos IP. Une attestation BotGuard (PoToken) est desormais frappee **dans le navigateur du visiteur** et transmise au Worker, qui la joint a ses appels InnerTube. Au passage, un second bug bien plus grave a ete trouve et corrige : les URLs servies au client iOS sont plafonnees a ~25 Mo.

**Pourquoi :** Le correctif precedent (cache + 7 clients) reduisait la frequence du blocage « Connectez-vous pour confirmer que vous n'etes pas un robot » sans le supprimer. Le PoToken s'y attaque a la racine : il ne cache pas l'IP, il prouve qu'un vrai navigateur est derriere.

**La preuve, mesuree le 26/07 sur la meme video au meme instant depuis l'edge Cloudflare :**

| client | sans jeton | avec jeton |
|---|---|---|
| `android_vr` | `LOGIN_REQUIRED` / « ...pas un robot » | **OK, 23 formats, 1080p** |
| `ios` | HTTP 403 | **OK, 28 formats, 1080p** |

Et derriere : octets reellement servis, HTTP 200, 65 536 o de `video/mp4`.

**Ce qui a rendu la chose possible :** `jnn-pa.googleapis.com` (l'API BotGuard) renvoie **notre origine** dans `Access-Control-Allow-Origin`. Tout se fait donc dans le navigateur, sans relais. A l'inverse, l'API InnerTube refuse toute origine tierce (403 des le preflight) : l'extraction, elle, doit rester chez nous — c'est ce qui rendait l'anti-robot inevitable.

**🚨 Le bug decouvert en chemin — plafond de 25 Mo sur les URLs iOS :** en faisant marcher le client iOS, le PoToken l'a fait GAGNER la chaine, et les telechargements ont commence a mourir en cours de route (« echec tranche 6 », 23 Mo sur 441). Diagnostic : sur une URL iOS, les offsets 0, 12 et 24 Mo renvoient http 200, et les offsets 30, 60, 120, 240 Mo renvoient **403**. Les URLs `android_vr` n'ont pas ce plafond (prouve le matin meme : 342 Mo de 4K telecharges d'un bloc). **`android_vr` passe donc devant `ios` dans la chaine**, et un garde-fou refuse proprement plutot que de livrer un fichier tronque quand seul un client plafonne est disponible. Sans le PoToken, ce bug etait latent : chaque fois qu'iOS gagnait (ce qui etait le cas des 40 videos du test de fiabilite), tout fichier de plus de 25 Mo etait condamne.

**Fichiers touches :**
- `src/lib/potoken.ts` (nouveau) — defi BotGuard, VM, GenerateIT, frappe liee au `visitorData`, cache localStorage 3 h, diagnostic `window.__tfdlAttestation`. Ne jette jamais : sans jeton, l'outil fonctionne encore, en plus fragile.
- `src/lib/webdl.ts` — `resolve()` joint `vd`+`pot` pour YouTube seulement ; `warmAttestation()`
- `src/app/tubeforge/telecharger/page.tsx` — prechauffage de l'attestation au montage (~1,2 s), pour qu'elle soit prete au clic
- `next.config.ts` — **CSP par route** : `'unsafe-eval'` uniquement sur `/tubeforge/telecharger`, plus `jnn-pa.googleapis.com` en `connect-src`
- `package.json` — dependance `bgutils-js` (168 Ko dans node_modules)
- (hors repo) `tubeforge-webdl/src/youtube.js` — `fetchVisitorData()`, parametre `auth` propage, `cappedBytes` sur la famille iOS, ordre de la chaine corrige
- (hors repo) `tubeforge-webdl/src/index.js` — `/api/session` (visitorData stable, cache KV 6 h), `vd`/`pot` acceptes, garde-fou plafond

**Pourquoi `'unsafe-eval'` et pourquoi seulement la : ** l'interpreteur BotGuard evalue du bytecode via `new Function`. Sans la directive il leve « EvalError: ... 'unsafe-eval' is not an allowed source of script » et la VM ne s'installe jamais (verifie en prod). La relacher partout affaiblirait le paiement et le compte ; cette page n'a ni formulaire, ni donnee personnelle, ni Stripe. **Attention au piege : deux regles `headers()` qui matchent la meme route envoient DEUX en-tetes CSP et le navigateur applique l'INTERSECTION** — la regle globale exclut donc explicitement cette page. Verifie route par route : un seul en-tete partout, `unsafe-eval` present sur le telechargeur, absent sur `/tubeforge`, `/tubeforge/checkout` et `/pricing`.

**Verification finale, en production, parcours complet :** attestation OK en 1,2 s (jeton 220 o), `attested: true` cote Worker, 441 Mo telecharges sans un seul 403, fichier de sortie inspecte atome par atome — `ftyp` + `moov` (739 Ko) + `mdat`, **2 pistes** (`vide` + `soun`), `avc1` + `mp4a`, 904 s, 1920x1080, audio present, aucune erreur de lecture.

**Comment annuler :** Worker : `npx wrangler rollback` depuis `tubeforge-webdl/`. Front : `git revert <hash>` — l'attestation etant facultative par conception, le retirer ne casse rien, ca ramene juste la fragilite d'avant.

**Effets de bord possibles :** L'attestation ajoute ~1,2 s au premier chargement (en tache de fond, pendant que la personne colle son lien) puis rien, grace au cache. Le `visitorData` est **partage** entre tous les visiteurs (un seul en KV) : c'est voulu, un jeton frappe par n'importe qui vaut pour tout le monde tant que le visitorData ne tourne pas ; s'il tourne, la page detecte le desaccord et refrappe. `bgutils-js` depend d'un endpoint prive de Google : il cassera un jour, et ce jour-la l'outil retombera sur le comportement d'avant sans planter. Enfin `'unsafe-eval'` sur cette route est un vrai relachement, assume et documente ci-dessus.

---
### [2026-07-26 14:20] — Telechargeur web : « video privee » etait un FAUX diagnostic + cache de resolution

**Quoi :** Sur une video parfaitement publique (CHAMP LIBRE, `7obQlmThI58`), la page repondait « Cette video demande une connexion (privee, ou reservee aux adultes) ». C'etait faux. Trois corrections : classification des refus sur le MOTIF et non le statut, cache des resolutions pour reduire notre volume d'appels, et baisse automatique de qualite au lieu d'un refus sur les videos lourdes.

**Pourquoi :** `LOGIN_REQUIRED` ne signifie PAS « video privee ». Mesure faite le jour meme : la meme video renvoie `status=OK` et 28 formats depuis une IP residentielle, et `LOGIN_REQUIRED` avec le motif **« Connectez-vous pour confirmer que vous n'etes pas un robot »** depuis les IP Cloudflare. C'est du controle anti-robot, declenche par le VOLUME d'appels — mes propres tests (40 videos x 4 clients + des dizaines de sondes) ont grille la reputation de l'IP de sortie, et l'utilisateur est tombe dedans. **Verifie ensuite : le code de prod inchange refonctionnait une heure plus tard**, donc ce n'etait pas un defaut de code mais un blocage transitoire mal traduit.

**Ce qui a ete corrige :**
1. **Classification sur le motif.** `classify()` lit le texte du refus, pas le statut. Piege : l'age ET le robot renvoient tous deux `LOGIN_REQUIRED` avec un motif qui commence par « Connectez-vous pour confirmer » — seul le mot suivant les distingue. Message robot desormais honnete (« c'est temporaire, ca ne vient pas de toi ») avec l'argument TubeForge qui est ici factuellement vrai : il passe par la connexion de l'utilisateur.
2. **Cache des resolutions** (`yt:<videoId>` en KV, TTL 90 min, bien sous les ~6 h de validite des URLs googlevideo). Deux personnes sur la meme video, ou quelqu'un qui reessaie, ne coutent qu'un appel InnerTube. C'est la mesure qui reduit reellement le risque de blocage, puisque la cause est le volume.
3. **Chaine de clients elargie** de 4 a 7 (ajout `tv_embed` 85, `ios_music` 26, `web_embed` 56, avec le `thirdParty.embedUrl` que les clients embed exigent). Retire `userAgentIsBot: false`, un champ invente qui n'existe pas dans l'API. Second essai sur les 2 meilleurs clients quand le motif est « robot » (une autre IP de sortie du meme point de presence peut passer).
4. **Baisse de qualite au lieu de refus.** `pickPair` prend un budget d'octets et descend l'echelle des hauteurs. Verifie : un podcast de 2 h, refuse avant, sort en 676p / 229 Mo avec `downgraded: true`, et la page explique pourquoi. Une video de 15 min reste en 1080p (441 Mo).
5. **`attempts` dans la reponse d'erreur** (non affiche) : sans ca, un rapport de bug se resume a « ca marche pas » et on ne sait pas quel client a ete refuse.

**Fichiers touches :**
- `tubeforge-webdl/src/youtube.js` (hors repo) — 7 clients, `classify()`, second essai, `pickPair(formats, maxHeight, maxBytes)`
- `tubeforge-webdl/src/index.js` (hors repo) — `MAX_BYTES`, cache KV `yt:<id>`, `downgraded` et `attempts` dans la reponse
- `src/lib/webdl.ts` — champ `downgraded` sur `Resolved`
- `src/app/tubeforge/telecharger/page.tsx` — mention « Qualite reduite volontairement » sous les metadonnees

**Comment annuler :** `npx wrangler rollback` depuis `tubeforge-webdl/`. Le cache se purge en supprimant les cles `yt:*` du namespace KV `b0ae98d3c33844e78f3aee9794b60524`. Cote page, `git revert <hash>`.

**Effets de bord possibles :** Le cache sert la MEME URL googlevideo a plusieurs personnes — sans risque, il est prouve que ces URLs ne sont pas liees a l'IP, mais une entree de cache dont les URLs expirent avant les 90 min donnerait un echec de telechargement (le TTL a 90 min garde une marge de 4 h). **Le fond du probleme reste entier** : l'extraction doit venir de nos IP de datacenter (CORS d'InnerTube verifie ferme, 403 meme en preflight), donc le blocage anti-robot reviendra a fort trafic. La seule parade durable est un PoToken genere dans le navigateur de l'utilisateur (bgutils) — chantier non engage.

---
### [2026-07-26 13:05] — Telechargeur web : retrait de la porte Discord (quota par IP)

**Quoi :** L'outil `/tubeforge/telecharger` est desormais utilisable **sans compte**. La verification d'appartenance au Discord est desactivee par une constante `REQUIRE_DISCORD = false` dans le Worker ; tout le flux OAuth reste en place et fonctionnel.

**Pourquoi :** Decision produit du user (« pour l'instant enleve la barriere Discord ») : maximiser l'essai avant de refermer eventuellement la porte.

**Ce qui remplace la porte** (sans identite, il fallait autre chose pour que le relais ne devienne pas un proxy public) :
- **Quota par adresse IP** (`CF-Connecting-IP`) au lieu du compte Discord, meme plafond de 10/jour. Si l'en-tete manque, on laisse passer sans compter plutot que de mettre tous les visiteurs dans le meme seau.
- **Verification d'origine** sur `/api/resolve` : refus si l'en-tete `Origin` existe et n'est pas une origine Expedition. Ce n'est pas une securite (un `Origin` se falsifie en CLI) : ca empeche l'endpoint de finir cable dans le site de quelqu'un d'autre.
- Inchange : relais signe par HMAC (URL arbitraire -> 403), plafond 1080p, garde-fou 500 Mo.

**Fichiers touches :**
- `tubeforge-webdl/src/index.js` (hors repo) — `REQUIRE_DISCORD`, `readClaims`, `quotaSubject` (Discord ou IP), `originAllowed`, `/api/me` renvoie `gate`
- `src/app/tubeforge/telecharger/page.tsx` — la page lit `gate` depuis `/api/me` au lieu d'avoir sa propre notion de la porte ; bandeau d'identite Discord affiche seulement si la porte est active ; accroche « Gratuit pour le Discord » -> « Gratuit, sans compte » ; pluriel corrige (« 1 telechargement restant »)
- `src/lib/webdl.ts` — champ `gate` sur le type `Me`

**Comment annuler :** remettre `REQUIRE_DISCORD = true` dans `tubeforge-webdl/src/index.js`, poser les deux secrets Discord, `npx wrangler deploy`. **Aucun changement de page necessaire** : elle suit ce que le Worker annonce.

**Effets de bord possibles :** Le quota est **souple** — KV est a coherence eventuelle et le lire-puis-ecrire n'est pas atomique, donc en rafale on peut depasser de quelques unites (verifie : des appels a moins d'une seconde d'intervalle voient un compteur qui oscille). Assume : au rythme d'un humain le compte est juste, et un compteur exact demanderait un Durable Object, disproportionne ici. Autre limite du quota par IP : un lieu a IP partagee (entreprise, campus, CGNAT mobile) partage le meme plafond. Enfin, sans porte, le volume passant par le relais YouTube n'est plus borne par la taille du Discord : c'est le point a surveiller, et `REQUIRE_DISCORD = true` est le frein d'urgence.

---
### [2026-07-26 12:10] — Telechargeur web gratuit (produit d'appel TubeForge), gate Discord

**Quoi :** Nouvelle page `/tubeforge/telecharger` + nouveau Worker Cloudflare `tubeforge-webdl`. L'utilisateur colle un lien (YouTube, TikTok, X, Twitch), le Worker resout les URLs de flux, et le **navigateur** telecharge puis fusionne audio+video sans re-encodage (mediabunny). Acces reserve aux membres du Discord Expedition (OAuth2 Discord, verification `users/@me/guilds`), 10 telechargements/jour/membre, 1080p max.

**Pourquoi :** Produit d'appel : faire gouter le geste « colle un lien -> tu as le fichier », dont TubeForge est la version sans limites (1500+ sites, 4K, chutier Premiere/DaVinci). Contrainte posee : ne rien couter. Tenue en ne faisant JAMAIS transiter d'octets par un serveur qu'on paie quand c'est evitable.

**Mesures qui ont dicte l'architecture** (26/07/2026, tests reels depuis l'edge Cloudflare) :
- Extraction InnerTube : **40/40 videos**, latence mediane **175 ms**, chaine de clients `ios -> android_vr -> mweb -> tv` (un client seul echoue sur une partie du catalogue : `LOGIN_REQUIRED`). Aucun PoToken requis.
- Les URLs googlevideo **ne sont PAS liees a l'IP** : extraite chez Cloudflare, elle se telecharge depuis chez l'utilisateur (verifie dans les deux sens).
- YouTube bride une connexion unique a **670 Ko/s** ; en tranches paralleles (`&range=`), **7 a 9 Mo/s** = la vitesse de la ligne.
- CORS googlevideo : autorise **uniquement** `youtube.com` -> le relais est obligatoire pour YouTube. X renvoie notre origine, Twitch renvoie `*` -> **telecharges en direct, zero relais**. TikTok exige un `Referer` -> relais, mais fichiers de 2-5 Mo.
- Fusion navigateur mesuree : 720p en 6,2 s / 1080p en 10,8 s / 4K en 46,7 s. Le muxage lui-meme prend **0,1 a 0,4 s** (recopie de paquets, zero re-encodage).
- Aucun format deja fusionne au-dela de 360p cote YouTube : la fusion n'est pas optionnelle.

**Fichiers touches :**
- `src/app/tubeforge/telecharger/page.tsx` — page (porte Discord, resolution, progression, garde-fou 500 Mo, encart vers TubeForge)
- `src/lib/webdl.ts` — client : jeton, tranches paralleles, fusion mediabunny, enregistrement
- `next.config.ts` — CSP : `connect-src` + worker webdl / `video.twimg.com` / `*.cloudfront.net` ; ajout de `media-src 'self' blob:` (sans lui, un `<video src=blob:>` retombe sur `default-src` et casse)
- `package.json` — dependance `mediabunny` (fusion sans re-encodage, ~10 Mo en node_modules, tree-shake au build)
- (hors repo) `tubeforge-webdl/` — Worker : `src/index.js`, `src/youtube.js`, `src/platforms.js`, `src/auth.js`

**Comment annuler :** Front : `git revert <hash>` (la page disparait, aucune autre page ne la reference). Worker : `npx wrangler delete tubeforge-webdl` depuis `tubeforge-webdl/`, et supprimer le namespace KV `expedition-licensing-TFDL_QUOTA`. Rien dans le licensing, Stripe ni D1 n'a ete touche.

**Effets de bord possibles :** La page n'est **liee depuis nulle part** (accessible par URL seulement) : c'est volontaire, le placement du lien dans le funnel reste a decider. L'OAuth Discord est **inerte** jusqu'a ce que `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` soient poses en secrets (placeholders `0` actuellement) : la page affiche le bouton, Discord repond « invalid client ». Le relais YouTube fait passer des octets par Cloudflare : c'est gratuit en egress mais reste une zone grise des CGU a volume eleve — le quota de 10/jour et la limite 1080p sont la pour ca, et couper le relais degrade proprement (X et Twitch continuent de fonctionner). Les extracteurs TikTok/Twitch dependent du format des pages/API de ces plateformes : ils casseront un jour, isolement.

---
### [2026-06-08 18:14] — PROD : onglet "Attribution" dans le panel admin + déploiement worker attribution

**Quoi :**
1. **Worker `expedition-licensing` déployé** (version `3e45c376`, via `wrangler versions upload` → test préview → `versions deploy` 100%) : active l'attribution partenaire (le checkout envoie `partnerSlug` → écrit `users.partner_slug` en D1 + `metadata.partner_slug` sur l'abonnement Stripe, sur `/auth/register` ET `/portal/subscribe`). Migration `0013` (colonne `partner_slug`) appliquée à la prod D1. Embarque aussi les fixes freemium du WIP (grâce 7j sur impayés, cap minutes ClipForge, clés ambassadeur). **Carte-only / blocage PayPal-Link MIS DE CÔTÉ** (commenté dans `services/stripe.ts`, réactivable) sur décision user.
2. **Panel admin** : nouvel onglet **"Attribution"** qui appelle `GET /admin/partners/conversions` et affiche, par partenaire, les inscrits / abonnés actifs / revenu estimé (active_subs × 8,03€).

**Pourquoi :** L'utilisateur veut suivre les ventes Fire Writing directement dans son panel admin (shisto81). Le backend existait déjà (mid-chantier) ; déployé proprement + affichage ajouté.

**Fichiers touchés :**
- `src/app/admin/page.tsx` — onglet "Attribution" (type Tab, state conversions, fetchConversions, useEffect, bouton, tableau)
- (worker, repo expedition-launcher, NON commité — déployé tel quel via wrangler) `services/stripe.ts` carte-only commentée + tout le WIP attribution/freemium

**Comment annuler :** Front : `git revert <hash>` (retire l'onglet). Worker : `npx wrangler rollback` (revient à la version d'avant) ; colonne `partner_slug` inoffensive (sinon `ALTER TABLE users DROP COLUMN partner_slug`).

**Effets de bord possibles :** L'attribution ne compte que les ventes **à partir du déploiement** (pas rétroactif). Le fix grâce-7j coupe désormais l'accès des impayés après 7j (intentionnel, ferme une fuite). Le revenu admin est une **estimation** (× 8,03€) ; le montant exact est sur Stripe (`metadata['partner_slug']:'firewriting'`).

---
### [2026-06-07 23:27] — PROD : landing partenaire /via/firewriting (Fire Writing)

**Quoi :** Port chirurgical de la landing partenaire Fire Writing depuis `refonte` vers `main`/prod (page publique, noindex). Inclut : la page `/via/[slug]`, le carousel d'outils `SuiteCarousel` (+ `ScriptForgeMockup`), la lib d'attribution `partnerAttribution`, le registre `partners.ts`, les logos `public/partners/`. La citation des fondateurs est **masquée** (non encore validée par Yasser/Tommate/Lucasvr — on ne publie pas de mots en leur nom sans accord) ; `draft: false` → aucun encart « À remplir ». H1 « Gagne des heures sur tes vidéos. 8,03€/mois, bloqué à vie », preuve = bandeau YouTubeurs réels.

**Pourquoi :** Rendre le lien `/via/firewriting` **partageable** avec la communauté Fire Writing (le preview Vercel est derrière un mur d'auth). Port ciblé, sans merger le reste de refonte.

**Fichiers touchés :**
- `src/app/via/[slug]/page.tsx` + `layout.tsx` — landing partenaire (section citation rendue seulement si validée/brouillon)
- `src/lib/partners.ts` — registre (Fire Writing : citation masquée + commentée, draft:false)
- `src/lib/partnerAttribution.ts` — cookie first-touch + tracking Clarity/GA
- `src/components/shared/SuiteCarousel.tsx` + `src/components/mockups/ScriptForgeMockup.tsx` — carousel des 4 outils
- `public/partners/firewriting.webp` + `expedition.png` — logos du handshake
- `src/app/robots.ts` — ajoute `/via` au disallow (noindex)

**Comment annuler :** `git revert <hash>` sur main ; ou supprimer `src/app/via/`, `partners.ts`, `partnerAttribution.ts`, `SuiteCarousel.tsx`, `ScriptForgeMockup.tsx` + retirer `/via` du robots.

**Effets de bord possibles :** Purement additif (nouvelle route). ⚠️ **L'attribution des ventes ne s'enregistre PAS** tant que le worker `expedition-licensing` n'est pas déployé avec la migration partenaires — la page set bien le cookie, mais le checkout/worker ne le consomme pas encore. Pour activer la citation : remettre la string dans `founderQuote` (partners.ts) une fois validée.

---
### [2026-06-07 16:10] — PROD : pages dédiées /clipforge & /reviewforge + boutons "Découvrir"

**Quoi :** Port chirurgical (depuis la branche `refonte`) du feature "outils à venir" directement sur `main`/prod, SANS embarquer le reste de la refonte (landing /via, carousel, etc. restent en preview). Deux pages de présentation (`/clipforge` indigo, `/reviewforge` emerald) : hero d'identité, vidéo démo (ClipForge `fFndGIIxUhw`, ReviewForge `QyUYGiEaQTk`), features + mockup réel, feuille de route "Où on en est" (tracker des Vagues). Et un bouton secondaire "Découvrir ClipForge/ReviewForge" sous chaque panneau des grilles d'aperçu (home + monteurs/créateurs).

**Pourquoi :** Les panneaux "Arrive prochainement" ne menaient nulle part sur le site live. L'utilisateur voulait ce feature en prod sur la home, /créateurs et /monteurs — mais pas le reste de la refonte (inachevée). D'où le port ciblé plutôt qu'un merge complet.

**Fichiers touchés :**
- `src/app/clipforge/page.tsx` + `layout.tsx` — page dédiée ClipForge + SEO
- `src/app/reviewforge/page.tsx` + `layout.tsx` — page dédiée ReviewForge + SEO
- `src/components/mockups/ClipForgeMockup.tsx` + `ReviewForgeMockup.tsx` — NOUVEAU : mockups extraits (réutilisés par les pages)
- `src/components/shared/SuiteRoadmap.tsx` — NOUVEAU : tracker des Vagues (prop `highlight`)
- `src/components/ToolsSection.tsx` + `ReviewForgeSection.tsx` — prop opt-in `detailHref` → bouton secondaire sous le mockup
- `src/components/SecondaryToolsGrid.tsx` + `shared/SuitePreviewSection.tsx` — passent `detailHref`
- `src/components/DemoPlayer.tsx` — prop `title` optionnelle (a11y), défaut inchangé

**Comment annuler :** `git revert <hash>` sur main ; ou supprimer `src/app/clipforge`, `src/app/reviewforge`, `SuiteRoadmap.tsx`, les 2 mockups extraits, et retirer la prop `detailHref` des 4 composants.

**Effets de bord possibles :** Purement additif (nouvelles routes, prop opt-in, nouveaux composants). Ne touche ni l'auth, ni le checkout, ni les prix. `detailHref` défaut `undefined` → aucun impact ailleurs. Les mockups extraits dupliquent (volontairement, pour éviter un refactor risqué en prod) les versions inline encore présentes dans Tools/ReviewForgeSection.

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
