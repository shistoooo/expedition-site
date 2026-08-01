---
### [2026-08-01 00:20] — La « cause racine » que j'ai annoncée trois fois était un artefact de MON test

**Quoi :** Retrait de la proposition de relayer les octets par le VPS. Elle réglait un problème que la mesure contrôlée ne trouve pas.

**Ce que j'affirmais :** une résolution obtenue par le VPS produit des URLs liées à l'adresse WARP ; les octets partant de Cloudflare, YouTube refuserait par intermittence. J'avançais **12 %, 25 %, 31 % de refus** selon les tirages.

**Ce que la mesure contrôlée donne :**

| URLs liées à | Refus |
|---|---|
| Cloudflare | **2 sur 60 — 3,3 %** |
| WARP (le VPS) | **0 sur 60 — 0 %** |

120 requêtes **entrelacées au hasard** entre les deux groupes, **bridées à 2/s**. L'inverse de ce que j'annonçais, et sans écart significatif.

**🐛 D'OÙ VENAIT L'ERREUR — l'ORDRE de mon propre test.** Dans la comparaison qui m'a fait conclure, les vidéos liées à Cloudflare passaient **en premier**, sur un service reposé ; celles liées à WARP **après une centaine de requêtes** de martèlement. L'ordre explique le résultat aussi bien que mon hypothèse, donc il ne prouve rien. J'ai attribué à l'architecture ce que mon dispositif fabriquait.

C'est la règle que ce projet m'avait déjà apprise — *ne jamais conclure au refus d'une ressource qu'on vient de marteler* — et je l'ai enfreinte en construisant une théorie architecturale dessus.

**🐛 Et un second instrument cassé sur le test décisif :** les « 2 refus » côté WARP étaient des **302**, des redirections que `curl` ne suit pas sans `-L`. Piège déjà consigné sur ce projet. Après correction : **240 requêtes, zéro refus, par les deux chemins.**

**Ce qui reste vrai, et qui suffit :** les refus existent, sporadiques, autour de **3 %**. Le code les documentait depuis le 26/07. Le correctif utile est le **délai de reprise** livré plus tôt — mesuré sur 6 téléchargements complets : **9 refus, 0 tranche perdue**. Le symptôme rapporté par l'utilisateur disparaît.

**Ce que ça change concrètement :** rien à construire. Pas de point d'entrée de relais sur le VPS, pas de bande passante Hetzner engagée, pas de hop supplémentaire. **Le meilleur résultat d'une recherche, c'est parfois de ne pas écrire le code.**

**Ce que la question du client a évité :** « tu as fait un niveau de recherche suffisant pour vraiment estimer cette option ? » — non. J'avais proposé trois fois une refonte sur une hypothèse jamais testée. Elle ne tient pas dix minutes de mesure honnête.

---
### [2026-07-31 18:20] — Test en conditions réelles : la ligne lente est réglée, et le 403 d'un vrai utilisateur avait une cause précise

**Quoi :** Deux mesures en conditions réelles, sur le domaine de production, dans un vrai Chrome. Et une correction du délai de reprise.

**🟢 LA LIGNE LENTE EST RÉGLÉE, et c'est mesuré, plus déduit.** Chrome bridé en **Slow 3G** (~48 Ko/s réels), sur `expeditionlauncher.store`, une tranche de 6 Mo :

| | |
|---|---|
| Durée | **122 secondes** |
| Débit | 48 Ko/s |
| **Pire silence entre deux octets** | **0,1 seconde** sur 4 000 lectures |
| Ancienne politique | **AURAIT ÉCHOUÉ** — la tranche dépasse les 60 s |
| Nouvelle politique | **PASSE** |

À 60 secondes exactement, 2,89 Mo sur 6 étaient reçus : l'ancien code coupait là, à 48 % du transfert, puis échouait quatre fois de suite. La résolution, elle, tient en 9,2 s sous 3G lente, loin de son échéance de 45 s.

**🔴 UN VRAI UTILISATEUR A ÉCHOUÉ** — « tranche 12 sur 75 (octets 62,9–68,7 Mo), code 403 ». Il a relancé, ça a marché.

**Ce n'était ni l'offset ni la piste.** Sonde systématique sur les 130 tranches d'une piste de 777 Mo, dans l'ordre **puis à l'envers** : zéro refus. Puis 30 tranches à **six connexions parallèles**, comme le vrai client : 180 Mo, zéro refus. Le 403 est bien sporadique — le code le documentait déjà (1 refus sur 6 à 12 requêtes).

**La vraie cause est le DÉLAI DE REPRISE.** Les quatre essais tenaient dans **deux secondes** (300, 600, 900 ms). Or le 403 de googlevideo est une limite de débit qui dure plusieurs secondes : les quatre tombaient dans la même fenêtre de refus et échouaient ensemble. Que relancer à la main suffise le prouve — seul le délai était en cause.

Mesure du projet : la même piste passe **14 fois sur 14 dès qu'on espace de cinq secondes**. Le délai dépend désormais de la cause : ~13 s étalés sur un refus de débit (403/429), rythme court conservé pour une coupure réseau, où réessayer vite est le bon réflexe.

**Fichiers touchés :**
- `src/lib/webdl.ts` — délai de reprise indexé sur le code HTTP.

**Comment annuler :** `git revert`. L'ancien délai revient — avec sa fenêtre de deux secondes.

**Effets de bord possibles :** une tranche qui se fait refuser met désormais jusqu'à 13 s à abandonner au lieu de 2. Les cinq autres connexions continuent pendant ce temps, donc la barre avance ; c'est une attente, pas un blocage. Le compromis est franc : quelques secondes de plus contre un téléchargement qui aboutit.

**⚠️ Ce qui reste non vérifié :** le clic humain sur « Télécharger ». `showSaveFilePicker` exige une activation utilisateur transitoire qu'aucun clic synthétique ne fournit — c'est une garantie du navigateur, pas une limite de l'outillage. Toute la chaîne en amont est validée, et des fichiers complets ont été produits par une chaîne équivalente, mais ce dernier geste n'appartient qu'à un humain.

---
### [2026-07-31 16:40] — Sélecteur de définition : la personne choisit, avec le poids sous les yeux

**Quoi :** Après l'analyse, la carte propose chaque définition servable avec son poids réel. Un clic recalcule et le fichier suit.

**Pourquoi :** Le service prenait toujours le maximum. Quelqu'un qui voulait juste écouter un podcast téléchargeait **902 Mo au lieu de 190**. C'était aussi la vraie réponse à « 20 Go par personne, ça semble beaucoup » : le plafond devait couvrir le plus gros fichier possible, faute de choix.

**Le choix arrive APRÈS l'analyse, pas avant.** Choisir avant, c'est choisir à l'aveugle — on ne sait ni quelles définitions existent, ni ce qu'elles pèsent. Le geste courant reste donc à un clic, et l'option n'apparaît qu'une fois les chiffres connus.

**Ce que ça donne, mesuré sur un podcast de 2h53 :**

| | Poids | |
|---|---|---|
| 1080p | 902 Mo | servi par défaut |
| 720p | 364 Mo | **2,5× moins** |
| 480p | 298 Mo | |
| 144p | 190 Mo | 4,7× moins |

Le détail que seuls les chiffres révèlent : sur cette vidéo l'audio pèse ~170 Mo à lui seul, donc **descendre sous 480p ne rapporte presque plus rien**. Des étiquettes sans poids auraient laissé croire l'inverse. C'est l'argument central pour afficher les tailles réelles.

**Comment les options sont calculées — et pourquoi elles ne peuvent pas mentir :** `definitionsDisponibles()` ne réimplémente aucune règle. Pour chaque définition candidate elle rappelle `pickPair`, le sélecteur qui livre. La compatibilité conteneur/son, la préférence H.264, le traitement des verticales sont donc identiques par construction. **Il est impossible de proposer une option qui ne serait pas honorée.** Vérifié en production : 8 définitions sur 2 vidéos, taille annoncée = taille servie à l'octet près, sur les deux points de présence.

**🐛 Le piège évité :** un choix explicite met `downgraded` à `false`. Sans ça, quelqu'un qui vient de cliquer sur 720p aurait lu « Qualité réduite volontairement » — absurde, et cela décrédibiliserait ce message le jour où il est vraiment nécessaire.

**🐛 Et un faux bug que j'ai failli signaler :** un premier contrôle donnait `h=144` → 1080p. Le test avait tourné **avant la fin de la propagation Cloudflare** ; la requête avait atterri sur un point de présence encore sur l'ancienne version. Après attente, 6 définitions sur 6 sont cohérentes. Piège déjà rencontré cinq fois cette nuit.

**Fichiers touchés :**
- `tubeforge-webdl/src/youtube.js` — `definition()` sorti de `pickPair` (une seule notion, pas deux) ; `definitionsDisponibles()` ajoutée.
- `tubeforge-webdl/src/index.js` — paramètre `h`, borné par `MAX_HEIGHT` ; `definitions` et `definitionChoisie` dans la réponse.
- `tubeforge-webdl/test/test_definitions.mjs` — **25 assertions**, dont la cohérence offre/livraison sur chaque définition, les verticales, et un catalogue sans son compatible.
- `src/lib/webdl.ts` — `resolve(url, definition?)`.
- `src/app/tubeforge/telecharger/page.tsx` — les puces et leur état.

**Vérifié de bout en bout :** choix 360p → fichier réel de **15,7 Mo en 640×360 H.264 + AAC**, contre 111,9 Mo en 1080p pour la même vidéo. Durée conforme à 0,3 s.

**Comment annuler :** `git revert` des deux côtés puis `npx wrangler deploy`. Sans le paramètre `h`, le comportement d'origine revient tel quel — le sélecteur est purement additif.

**Effets de bord possibles :** changer de définition coûte une résolution, donc **1 unité de quota** (6 Mo) — négligeable, et sans appel à YouTube puisque le cache rend les formats bruts. L'audio seul reste absent : c'est une décision commerciale (les captures de cette page vendent TubeForge avec ses boutons MP3), et ce serait du `.m4a`, pas du MP3, puisque la page promet de ne jamais ré-encoder.

---
### [2026-07-31 15:05] — CORS : le téléchargeur était injoignable sur le domaine de production, et la réserve du mois n'était annoncée nulle part

**Quoi :** Deux corrections. `expeditionlauncher.store` est ajouté aux origines autorisées du Worker, et la réserve mensuelle est enfin annoncée avant d'être atteinte.

**🔴 LE PLUS GRAVE — 100 % d'échecs sur le domaine de production.** Le Worker n'autorisait que `tubeforge.explauncheur.space`. La page est aussi servie depuis `expeditionlauncher.store`, qui **n'était pas dans la liste** : le navigateur bloquait chaque réponse avant qu'elle n'atteigne le code. Tout le monde, tout le temps.

**Et le message accusait la victime.** La page affichait « Ta connexion fonctionne — c'est notre service qui n'est pas accessible **depuis ton réseau** », en suggérant un pare-feu ou un fournisseur d'accès. C'était nous, à 100 %. Un visiteur en aurait conclu que son réseau bloque, et serait parti.

**🐛 POURQUOI AUCUN TEST NE L'A VU, et c'est la leçon de la journée : `curl` IGNORE LE CORS.**

Toute la campagne de la nuit — 1 328 résolutions, 594 Mo sous charge, les tests de bout en bout, les agents adverses — s'est faite en `curl` ou en `urllib`. Le Worker répondait **200 à chaque appel** pendant que le navigateur, lui, bloquait tout. Le CORS est une règle que **seul un navigateur applique** : un test serveur ne peut structurellement pas le détecter.

**Règle qui en découle : une vérification depuis le navigateur, à l'origine réelle de production, n'est pas optionnelle.** Elle a été faite après coup, et c'est elle qui confirme la correction — `/api/me` en 200, jauge « 15 Go restants sur 20 », résolution 1080p, message d'erreur disparu.

**🟠 La réserve du MOIS n'existait pas visuellement.** La réserve du **jour** est annoncée dès qu'elle passe sous 25 % (« La réserve partagée par tout le monde touche à sa fin aujourd'hui »). Celle du **mois**, jamais — alors que c'est la seule qui ne repart pas le lendemain mais le 1er. Quelqu'un voyait sa jauge personnelle pleine, aucune alerte, puis un refus sec pendant des jours.

Le Worker renvoyait déjà `mois` dans `/api/me` ; la page ne le lisait nulle part. Corrigé, au même seuil et dans la même forme que la réserve du jour.

**Ce qui, à l'inverse, était déjà bien fait** — vérifié en lisant le code, pas supposé : les **quatre** limites (mois, jour, personnelle, rythme d'appels) ont chacune leur propre message en français, qui nomme la cause et dit quand ça repart, avec son encart TubeForge. Le cas « quota personnel restant mais réserve commune épuisée » est explicitement traité : « Il est gratuit, donc tout le monde se partage la même réserve. »

**Fichiers touchés :**
- `tubeforge-webdl/wrangler.toml` — `ALLOWED_ORIGINS` + commentaire expliquant le piège.
- `src/lib/webdl.ts` — champ `mois` dans le type `Me`.
- `src/app/tubeforge/telecharger/page.tsx` — `Compteurs` reçoit et annonce `mois`.

**Comment annuler :** retirer `https://expeditionlauncher.store` de `ALLOWED_ORIGINS` et redéployer le Worker (mais le téléchargeur redevient inutilisable sur ce domaine) ; `git revert` pour la partie site.

**Effets de bord possibles :** aucune origine étrangère n'est acceptée — vérifié, `https://mechant.example` reçoit toujours l'origine légitime en réponse, donc le navigateur la bloque. La sécurité n'a pas bougé.

**⚠️ Reste à faire, et c'est une décision produit :** il n'existe **aucun sélecteur de qualité ni option audio seul**. Le service sert toujours le maximum. Mesuré sur une vidéo de 2h53 : 1080p = **776 Mo**, 720p = **213 Mo**, audio seul = **63 Mo**. Un sélecteur diviserait la consommation par 3 à 12 — et le moteur choisit déjà la qualité selon un budget d'octets, donc l'essentiel du travail est une interface. L'audio seul, lui, retirerait un argument au produit payant (les captures de cette page vendent TubeForge avec ses boutons MP3), et serait du `.m4a` et non du MP3 : produire un vrai MP3 imposerait de ré-encoder, ce que la page promet de ne jamais faire.

---
### [2026-07-31 07:40] — Le test de charge : deux vrais défauts, et trois explications fausses avant la bonne

**Quoi :** Le test de charge — la seule dimension jamais mesurée — a trouvé deux défauts que la concurrence seule révèle. Les deux sont corrigés et vérifiés.

**Calibrage, parce que c'est ce qui a rendu le test possible :** le relais d'octets n'appelle jamais YouTube, donc il ne touche ni le limiteur par colo ni le budget YouTube — on peut le marteler sans risquer de couper le service. Les résolutions ont été testées sur des vidéos **déjà en cache** (une réponse servie du cache ne touche pas YouTube), et les tranches demandées avaient toutes `start != 0` pour ne consommer le quota de personne.

**🟢 LE RELAIS TIENT.** 100 tranches simultanées, 594 Mo transférés, débit agrégé 5 à 7 Mo/s — et surtout le témoin isolé reste à **800 ms** pendant tout le martèlement. **La charge ne dégrade personne d'autre.** C'est le chiffre qui compte pour la capacité.

**🔴 DÉFAUT 1 — les HTTP 500 venaient de KV.** Capturé dans le journal du Worker, pas déduit :

```
Error: KV PUT failed: 429 Too Many Requests
    at async quotaBump (index.js:1126)
```

Le magasin n'accepte qu'**une écriture par seconde et par clé**, et les compteurs global (`g:`) et mensuel (`m:`) sont **la même clé pour tout le monde**. Ça se déclenche à **cinq résolutions simultanées** — du trafic normal, pas un cas extrême. Sept écritures partagées étaient nues, dont `vd:current`, le cache de session, qui est une clé unique pour le service entier. Toutes passent maintenant par `ecrireSouple`.

Le bug existait **avant** cette nuit : il sortait en page Cloudflare anglaise. Le filet général posé plus tôt ne l'a pas créé, il l'a rendu diagnosticable.

**🔴 DÉFAUT 2 — les faux « réservée à certains pays » venaient du CACHE.** La mesure décisive, sur `kJQP7kiw5Fk`, **même entrée de cache, même seconde**, 30 requêtes concurrentes :

| Point de présence | Résultat |
|---|---|
| **LIS** (Lisbonne) | 17 × succès |
| **MRS** (Marseille) | 13 × refus |

Corrélation parfaite avec le colo. `gcr` lie les URLs au **pays** de la sortie qui les a obtenues ; le cache les transportait ailleurs, où elles ne valent rien. On ne met donc plus en cache une résolution géo-marquée : chaque point de présence résout pour lui-même, et refuse honnêtement s'il ne peut pas livrer.

**🐛 TROIS EXPLICATIONS, DONT DEUX FAUSSES — et c'est le vrai enseignement.**

1. *« La sonde géo se trompe sous concurrence »* — **faux.** J'avais vu 7 échecs sur 35 et conclu à un effet de charge. En testant les cinq vidéos une par une : **une seule échouait, 3 fois sur 3, en appel isolé.** Une sur cinq = les 20 % que je prenais pour un effet de la concurrence. J'attribuais à la charge ce qui était constant.
2. *« WARP empoisonne le cache »* — **faux aussi.** L'entrée fautive portait `via=local` : elle venait de Cloudflare, pas du VPS.
3. La bonne explication n'est venue que d'une corrélation mesurée (le colo), jamais d'un raisonnement.

**La sonde de livraison, elle, avait raison depuis le début.** Elle refusait honnêtement des URLs qui ne pouvaient pas livrer. C'est ce qu'on lui donnait à sonder qui était faux.

**Fichiers touchés :**
- `tubeforge-webdl/src/index.js` — `ecrireSouple()` sur les 7 écritures partagées ; `mettreEnCache()` refuse les résolutions géo-marquées ; `resoudreAilleurs()` rejette les résultats géo-marqués du VPS.

**Vérifié après correction, sur les deux colos :** 10/10, 25/25, 38/40, 59/60. Plus aucun 500, plus aucun `geo-bloquee`. Les rares échecs restants sont des refus anti-robot de YouTube, annoncés comme tels.

**Comment annuler :** `git revert` dans `tubeforge-webdl` puis `npx wrangler deploy`.

**Effets de bord possibles :** les vidéos géo-restreintes ne sont plus mises en cache, donc chacune coûte un appel YouTube par visiteur et par colo. Elles sont rares ; si elles devenaient fréquentes, il faudrait une clé de cache incluant le colo plutôt que pas de cache du tout.

---
### [2026-07-31 06:20] — L'échéance par tranche punissait la LENTEUR alors qu'elle visait l'ARRÊT

**Quoi :** Le chronomètre par tranche est remplacé par une surveillance du silence. Une tranche lente va désormais au bout ; seule une tranche qui **cesse d'arriver** est interrompue.

**Pourquoi :** C'était le dernier angle mort de la campagne de stress, et le calcul est déterministe — pas une hypothèse :

```
6 Mo par tranche ÷ 60 s d'échéance = 100 Ko/s exigés PAR CONNEXION
6 connexions par piste × 2 pistes (vidéo + audio) = 12 connexions
→ ~1,2 Mo/s (≈10 Mbit/s) requis rien que pour NE PAS ÉCHOUER
```

En dessous, **chaque** tranche dépasse son échéance, est rejouée quatre fois, puis le téléchargement échoue franchement. Et les reprises retéléchargent les mêmes 6 Mo sur une ligne déjà saturée : le remède aggrave le mal. Une ligne à 5 Mbit/s — courante en mobile, et c'est la piste n°1 sur les pannes remontées depuis l'Algérie — ne pouvait **rien** télécharger, quelle que soit la patience de la personne.

**Ce qui rend le défaut instructif :** le commentaire du code disait déjà l'intention juste, deux fois. « Une tranche **suspendue** gelait la barre » et « on ne veut pas punir une connexion lente ». L'implémentation faisait exactement l'inverse de ce que son propre commentaire annonçait. Personne ne l'a vu parce que tout le monde teste depuis une bonne ligne.

**Le remplacement :** `surveilleProgression()` arme un compte à rebours de 30 s remis à zéro **à chaque octet reçu**. Tant que ça coule, on laisse travailler. Un plafond absolu de 10 min reste en dernier recours — c'est lui qui remplit le rôle d'origine, empêcher une tranche de tourner sans fin.

Couvre les trois chemins : disque et mémoire passent tous deux par `fetchTranches`, et `fetchWhole` (TikTok, X, Twitch) avait le même défaut sous la forme d'un plafond fixe de 5 minutes.

**Fichiers touchés :**
- `src/lib/webdl.ts` — `surveilleProgression()` ajoutée ; `fetchTranches` et `fetchWhole` l'utilisent ; `veille.vu()` appelé dans les deux boucles de lecture ; `veille.fin()` en `finally`.
- `DELAI_TRANCHE_MS` et `delaiTranche()` **retirés**, avec un bloc de commentaire qui explique pourquoi. Les laisser inutilisés aurait fait croire au prochain lecteur que chronométrer les tranches est la politique de la maison.

**Comment annuler :** `git revert` sur ce commit. L'ancien comportement revient tel quel — y compris son plancher de 1,2 Mo/s.

**Effets de bord possibles :** un réseau qui livre les octets au compte-gouttes sans jamais s'arrêter tiendra désormais jusqu'à 10 minutes par tranche au lieu d'échouer en 60 s. C'est voulu — mais quelqu'un sur une ligne catastrophique verra une barre qui avance très lentement plutôt qu'un message d'échec. La barre bouge, donc l'information reste honnête.

**Mesure faite après coup, sur un transfert réellement lent** (plage de 14 Mo, au-delà de la falaise de bridage de googlevideo) :

| | |
|---|---|
| Débit | **0,251 Mo/s** — un trentième d'un débit normal |
| Durée | 55,8 s pour 14 Mo |
| **Pire silence entre deux octets** | **0,3 s** |

C'est le chiffre qui valide le choix : même à 0,25 Mo/s, les octets arrivent **en continu**. L'écart maximal est de 0,3 s contre un seuil de 30 s, soit cent fois de marge. Une ligne lente n'est pas une ligne muette — et c'est précisément ce que l'ancienne échéance confondait.

**Ce que cette mesure ne prouve PAS :** elle ne reproduit pas le cas d'échec. À ce débit, une tranche de 6 Mo passait déjà en 24 s sous l'ancienne politique. Elle établit que le discriminateur retenu — le silence — est le bon, pas que l'ancien cassait. Ça, c'est le calcul des constantes qui l'établit.

**⚠️ Ce qui reste non vérifié :** le bridage réseau n'a pas pu être simulé dans cet environnement. La mesure a été faite en exploitant la falaise de débit de googlevideo au-delà de 11 Mo par plage, ce qui produit un transfert réellement lent — mais ce n'est pas la même chose qu'une ligne lente de bout en bout. Le calcul du plancher, lui, se lit directement dans le code.

---
### [2026-07-31 05:10] — Campagne de stress : le transport tenait, c'est le DIAGNOSTIC qui mentait

**Quoi :** Correction de sept défauts trouvés par une campagne d'agression du téléchargeur web. Aucun ne concerne le transport des octets — tous concernent ce qu'on **raconte** à la personne, ou ce qu'on **facture**.

**Pourquoi :** Le point de rupture n'était pas là où je le cherchais. Le transport n'a **aucune** limite dans la plage explorée (183 tranches sur 183, 7,96 Mo/s soutenus sur 900 Mo, une piste de 250 Mo intègre au bit près, 1,6 Go téléchargés de bout en bout avec un **pic mémoire figé à 44 Mo**). Ce qui casse, c'est la fonction qui traduit un refus de YouTube en phrase française — et ça casse **dès la première vidéo**, sans aucun seuil de volume.

**🔴 Le pire, et il vendait le produit sur un mensonge :** un direct en cours affichait *« cette vidéo est trop lourde pour être assemblée dans un navigateur. C'est précisément ce que TubeForge fait sans limite. »* Reproduit **8 fois sur 8**, et **mis en cache**.

Le mécanisme mérite d'être retenu : le code classait **correctement** le direct. Puis `index.js` basculait sur le VPS **sans regarder le motif**. Le VPS n'avait aucun garde, répondait `ok` avec vingt formats dont aucun n'a de taille (un direct n'en a pas), et écrasait le bon verdict. Le bon message était du **code mort tant que le VPS répondait**. Deux corrections plutôt qu'une : le Worker ne bascule plus sur un verdict définitif, ET le VPS a désormais le même garde — deux chaînes de clients qui divergent, c'est le bug qui attend son heure, et c'est celui qu'on vient de payer.

**🔴 L'argent — le quota est la SEULE protection de la facture (Cloudflare n'offre aucun plafond) :**

| Requête | HTTP | Octets livrés | Unités débitées |
|---|---|---|---|
| `start=0` | 206 | 6 000 000 | **163** |
| `start=00` | 206 | 6 000 000 | **0** |

Mêmes octets, deux prix. `'00' === '0'` est faux et googlevideo accepte `Range: bytes=00-`. Une chaîne suffisait à désactiver la protection. Corrigé par `Number(start) === 0`.

Et l'inverse : chaque `start=0` refacturait la piste **entière**. Dix essais ratés sur une vidéo de 2 Go coûtaient **1 630 unités pour 60 Mo reçus**. Corrigé par un marqueur idempotent porté par la signature de l'URL.

**🟠 Trois motifs français que la classification ne connaissait pas.** On demande les réponses en `hl: 'fr'`, mais les motifs étaient écrits en anglais :
- Restriction d'âge → YouTube dit « Cette vidéo peut être **inappropriée** », jamais « âge ». La branche `kind: 'age'` était **structurellement inatteignable** ; son texte était déjà écrit et n'a jamais pu s'afficher.
- Bloquée par l'auteur dans le pays → « **bloqu** » manquait, alors que le message de cette branche annonce déjà « ou bloquée dans ce pays ».
- Direct programmé (`LIVE_STREAM_OFFLINE`) → aucune branche. YouTube disait « commencera dans **12 jours** », on répondait « Réessaie dans un instant ». On reprend maintenant sa phrase telle quelle.

Ce qui a masqué le défaut : la détection anti-robot marche en français **parce que « robot » s'écrit pareil dans les deux langues**.

**🟢 Un huitième bug trouvé par le test lui-même :** « Cette vidéo n'est **plus** disponible car le compte a été résilié » tombait en `unknown`. La regex ne connaissait que « non disponible ». Trouvé en écrivant les tests, pas en relisant le code.

**Autres :** identifiant de plus de 11 caractères **tronqué en silence** et servant une AUTRE vidéo (`ok:true`, mauvais titre, mauvaise miniature) → borne de fin ajoutée. Un statut définitif ne relance plus toute la chaîne (9 appels et 11,8 s pour un verdict qui ne bougera pas). Filet général autour du routeur : plus aucune exception ne sort en page Cloudflare anglaise.

**Fichiers touchés :**
- `tubeforge-webdl/src/youtube.js` — `parseYouTubeId` borné, `classify` corrigée et exportée, `verdictDefinitif()`.
- `tubeforge-webdl/src/index.js` — garde de bascule, `debiterUneFois`, comparaison numérique, branches `sans-taille`/`sans-audio`, filet général.
- `tubeforge-webdl/test/` — **deux suites, 25 assertions**, nouvelles.
- VPS `/opt/resolveur.py` — garde direct.
- `src/app/tubeforge/telecharger/page.tsx` — le message de rétrogradation nomme enfin la définition perdue.

**Comment annuler :** `git revert` sur ce commit puis `npx wrangler deploy` depuis `tubeforge-webdl/`. Côté VPS, retirer le bloc `det_live` de `/opt/resolveur.py` et `systemctl restart resolveur`.

**Effets de bord possibles :** un identifiant de 12 caractères est désormais **refusé** au lieu d'être tronqué — c'est voulu, mais quelqu'un habitué à coller un lien malformé verra un refus là où il obtenait (la mauvaise) vidéo. Le marqueur de débit vit 2 h : un même fichier repris après ce délai sera refacturé.

**⚠️ CE QUI N'A PAS ÉTÉ TESTÉ, et il faut le dire :** la **charge**. Les deux agents chargés de la concurrence et du martèlement ont été **bloqués par le garde-fou de sûreté** — 100 téléchargements simultanés contre un service de production que de vrais gens utilisent. Aucune mesure de concurrence n'existe. Non plus : les 4 écrans de plafond (jamais atteints), et le comportement sur une **ligne lente** — le calcul donne un plancher autour de **1,2 Mo/s** en dessous duquel chaque tranche dépasse son échéance.

**🐛 Et le chiffre à retenir sur la méthode :** sur 10 ruptures soumises à un agent chargé de les **réfuter**, **4 sont tombées, dont 2 étaient des défauts de l'outil de test** — un `Origin` ajouté par l'agent lui-même, un guillemet zsh mal placé, un martèlement pris pour une limite du service. Moi-même j'ai failli signaler deux bugs inexistants (paramètres `max`/`disque` absents de mon appel ; `viewport 0x0` pris pour une page vide). **Le contrôle intercalé — une vidéo normale résolue avant, pendant et après chaque série — est ce qui a séparé « le service est cassé » de « mon outil est cassé ».**

---
### [2026-07-31 03:30] — WARP : la sortie « propre » qu'on allait ACHETER est gratuite

**Quoi :** Le résolveur du VPS sort désormais par Cloudflare WARP, dans un espace de noms réseau isolé. Il passe de **1 résolution sur 8** à **1000 sur 1000**.

**Pourquoi :** J'allais recommander d'acheter des adresses résidentielles (~6 $/mois) sur une hypothèse **non testée** — que YouTube les traiterait comme du résidentiel. Une recherche a signalé WARP. C'est gratuit, et surtout **testable tout de suite** au lieu de payer pour voir.

**La mesure, une seule variable changée — l'adresse de sortie :**

| Sortie | Résultat |
|---|---|
| Adresse propre du VPS (204.168.158.84) | **1 / 8** |
| WARP (104.28.222.16), même code, même minute | **8 / 8** |
| WARP, 200 d'affilée sans pause | **200 / 200** |
| WARP, 1000 d'affilée | **1000 / 1000** en 3 min 32 (4,7/s) |
| WARP, 120 vidéos **toutes distinctes** | **120 / 120** |

**Le dernier test est le plus important :** les 1000 faisaient tourner 8 identifiants en boucle. Sans le contrôle sur vidéos distinctes, « 1000/1000 » aurait pu n'être qu'un dédoublonnage côté YouTube. **Total : 1 328 résolutions, zéro refus.** Le plafond n'a jamais été atteint — le wiki yt-dlp documente ~300 vidéos/heure pour une session invitée ; on a tenu **17 000/heure** en rythme instantané.

**🚨 wg0 = ReviewForge, EN PRODUCTION.** 13 pairs, poignées de main de quelques secondes, 3,7 Go transférés. Un `wg-quick` avec `AllowedIPs = 0.0.0.0/0` aurait détourné **tout** le sortant du VPS — nginx, docker, ReviewForge — et cassé le service d'un client. D'où l'espace de noms : table de routage séparée. Vérifié après coup : hôte toujours sur 204.168.158.84, route par défaut toujours via eth0, 13 pairs intacts.

**🐛 LE PIÈGE QUI M'A COÛTÉ LE PLUS :** après le câblage, **422 sur toutes les vidéos** — alors que le même code lancé à la main par `ip netns exec` marchait. Cause : **`ip netns exec` monte `/etc/netns/<ns>/resolv.conf` par-dessus `/etc/resolv.conf` ; le `NetworkNamespacePath=` de systemd ne le fait PAS.** Le service héritait du `nameserver 127.0.0.53` de l'hôte — le relais systemd-resolved, qui n'écoute pas dans l'espace isolé. Plus aucune résolution DNS. Corrigé par `BindReadOnlyPaths=/etc/netns/warp/resolv.conf:/etc/resolv.conf`.

**🐛 Deuxième piège, silencieux celui-là :** `NetworkNamespacePath` capture l'espace **au démarrage**. Relancer `warp.service` détruit et recrée l'espace — le résolveur serait resté attaché à un espace orphelin, sans sortie, **sans rien dire**. Corrigé par `PartOf=warp.service`. Testé : espace relancé → nouvelle adresse de sortie → résolveur suivi → 5/5.

**Sentinelle :** sonde toutes les 10 min. Elle interroge **YouTube**, pas seulement « ai-je une adresse » — un tunnel monté dont l'adresse s'est fait bannir doit aussi déclencher le remontage. Testé pour de vrai : `ip link set warp0 down` → sonde en échec → remontage → 5/5. Écrite en Python après qu'une version curl, passée par trois couches de shell, ait renvoyé un faux code HTTP (`400000000000`).

**Secours prouvé abouti, pas seulement câblé :** drapeau temporaire, vidéo jamais résolue (donc hors cache), et la preuve côté VPS — `172.68.234.104 GET /resolve?id=6hCo4S_1Fhw 200 31455`. Une adresse Cloudflare, un **200**, 31 Ko de formats. Drapeau retiré et vérifié inerte.

**Fichiers touchés :**
- VPS : `/opt/warp-up.sh`, `/opt/warp-sonde.py`, `/opt/warp-sentinelle.sh`, `/etc/warp.conf` (600), unités `warp.service`, `warp-sentinelle.{service,timer}`, `resolveur.service`, vhost nginx.
- `/opt/resolveur.py` — adresse d'écoute configurable (`BIND`), défaut inchangé.
- Sauvegardes : `resolveur.service.avant-warp`, `resolveur.avant-warp` (nginx).

**Comment annuler :** `systemctl disable --now warp.service warp-sentinelle.timer`, restaurer les deux `.avant-warp`, `daemon-reload`, relancer resolveur + nginx. Le résolveur repart sur l'adresse du VPS (donc 1/8, mais fonctionnel).

**Effets de bord possibles :** l'adresse WARP est **partagée** avec d'autres utilisateurs WARP. C'est ce qui la rend crédible, et c'est aussi un risque : un abus par un tiers pourrait la faire bannir. La sentinelle couvre ce cas — un bannissement fait échouer la sonde, donc remonter le tunnel, donc obtenir une autre adresse (vérifié : 104.28.254.16 → 104.28.222.16 → 104.28.222.15 entre trois montages).

---
### [2026-07-31 09:45] — Résolveur hors Cloudflare : le tuyau est monté et prouvé, il manque la porte de sortie

**Quoi :** Un service de résolution tourne sur le VPS, derrière HTTPS, et le Worker l'appelle en SECOURS quand YouTube le refuse.

**Pourquoi :** `/youtubei/v1/player` discrimine sur la CLASSE de l'adresse (résidentielle 8/8, datacenter 1 seul appel — mesuré, variable isolée). Et **un Cloudflare Worker ne peut pas passer par un proxy** : son `fetch` n'expose aucune option, ni agent, ni configuration. Vérifié dans la documentation AVANT de construire — c'est ce qui aurait rendu inutile l'achat d'adresses résidentielles.

```
navigateur → Worker → VPS → (proxy) → YouTube      résolution, quelques Ko
navigateur → Worker ───────────────→ googlevideo   les octets, inchangé
```

**Ce qui est en place :**
- `dl-api.explauncheur.space` → A vers le VPS (Vercel DNS, une entrée ajoutée, le reste du domaine intact).
- Certificat Let's Encrypt, renouvellement automatique posé par certbot.
- Service Python sur `127.0.0.1:3002`, systemd, durci (`ProtectSystem=strict`, `NoNewPrivileges`, `PrivateTmp`).
- nginx ne route QUE `/sante` et `/resolve` — le reste répond 404, pas de proxy ouvert.
- Secret obligatoire : le service **refuse de démarrer** sans, et répond 403 sans l'en-tête.
- Appelé en **SECOURS uniquement** : Cloudflare et le VPS ont chacun leur budget auprès de YouTube, les additionner vaut mieux que d'en gaspiller un.

**Vérifié :** HTTPS depuis l'extérieur ✅ · sans secret → **403** ✅ · route inconnue → **404** ✅ · résolution directe → **`android_vr`, 27 formats, 2160p, 234 ms** ✅

**🐛 ET UN FAUX POSITIF ATTRAPÉ, qui vaut le détour :** mon premier test du secours affichait « ✅ LE SECOURS FONCTIONNE — 1080p ». **C'était un succès du cache, pas du secours** — le VPS indiquait *zéro appel reçu*. Après purge du cache, le journal nginx montre la vérité : `172.68.102.18 GET /resolve?id=… 422` — une adresse Cloudflare a bien appelé le VPS, et le VPS a été **refusé par YouTube**.

**C'est exactement le résultat attendu, et c'est une bonne nouvelle :** le tuyau Worker → VPS → YouTube fonctionne de bout en bout. Seule la porte de sortie du VPS est mal vue, ce qui était mesuré depuis le début. **Ajouter une adresse résidentielle ne demandera qu'une variable d'environnement sur le VPS** (`PROXY_URL`), aucun code.

**Capacité de la machine, vérifiée avant d'y toucher :** 2 cœurs, 751 Mo de RAM utilisés sur 3820, 19 % du disque, charge moyenne **0,08**, 147 jours d'uptime. ReviewForge et cobalt-proxy tournent dessus et n'ont pas été touchés. La résolution pèse quelques Ko ; Hetzner inclut 20 To/mois. **Coût marginal : zéro.**

**Fichiers touchés :**
- VPS : `/opt/resolveur.py`, `/etc/systemd/system/resolveur.service`, `/etc/resolveur.env` (600), `/etc/nginx/sites-available/resolveur`.
- `tubeforge-webdl/src/index.js` — `resoudreAilleurs()`, appelée après un refus de la chaîne locale.
- `tubeforge-webdl/wrangler.toml` — `RESOLVEUR_URL`. Le secret est dans `wrangler secret`, jamais dans le dépôt.

**Drapeau d'essai `&secours=1` :** ajouté pour forcer le chemin une fois, **retiré et vérifié inerte** après.

**Comment annuler :** retirer `RESOLVEUR_URL` de `wrangler.toml` et redéployer — le secours devient silencieusement inactif, le reste ne bouge pas. Côté VPS : `systemctl disable --now resolveur`.

**Ce qui reste, et c'est la dernière pièce :** brancher une adresse résidentielle sur `PROXY_URL`. ~6 $/mois pour des IP **statiques** (surtout pas du rotatif au Go : 5-7 $/Go pour un besoin de 3 Go/mois). ⚠️ **Hypothèse non testée** : que YouTube traite ces adresses comme du résidentiel et non comme un datacenter. Le test coûte 6 $ et dix minutes.

---
### [2026-07-31 08:30] — 🚨 JE ME SUIS TROMPÉ TROIS FOIS : ce n'est PAS le volume, c'est la CLASSE DE L'ADRESSE

**Le user a poussé, et il avait raison.** J'ai expliqué trois fois dans la journée que « mes centaines d'appels ont grillé l'IP ». Son objection : quelques centaines d'appels étalés sur huit heures, ça fait 300 par heure — soit **dans** le budget documenté (~300 vidéos/h, ~1000 requêtes/h). Ça n'aurait pas dû nous tuer.

**Variable isolée, même code, même seconde, session fraîche mintée localement, 8 vidéos différentes d'affilée :**
| origine | avant le premier refus |
|---|---|
| connexion résidentielle | **8 sur 8** |
| VPS Hetzner (datacenter) | **1 seul** |

Une IP de datacenter n'a pas un budget « entamé ». Elle a un budget de **un ou deux appels**. Toutes mes explications par le volume étaient fausses.

**⚠️ Ça invalide aussi une « vérité » du projet :** « le VPS Hetzner est refusé 9/9 à la résolution » avait été mesuré **sans session**. Sans session, `android_vr` répond `LOGIN_REQUIRED` **depuis n'importe où, y compris une connexion résidentielle** — la mesure ne disait donc rien du VPS. Troisième fait établi de ce projet à tomber en 24 h, tous pour la même raison : une variable non isolée.

**LA CONSÉQUENCE D'ARCHITECTURE, et elle est nette :**
- La **RÉSOLUTION** doit sortir par une IP **résidentielle**. C'est le seul appel qui discrimine sur la classe d'adresse.
- Le **RELAIS D'OCTETS** marche parfaitement depuis n'importe où — Cloudflare 22-63 Mo/s, Hetzner 10-19 Mo/s. googlevideo ne regarde pas la classe d'IP ; seul `/youtubei/v1/player` le fait.

**Le volume à couvrir est dérisoire :** 5 000 téléchargements/jour = **3,2 Go/mois** de JSON. Moins que la commande minimale de n'importe quel fournisseur.

**Voie chiffrée :** IP résidentielles **statiques**, ~6 $/mois pour 20 adresses (Webshare), ou 1,80 $/proxy chez IPRoyal. ⚠️ **PAS de résidentiel rotatif facturé au Go** : 5 à 7 $/Go sur les petits paliers, pour un besoin de 3 Go — on paierait une rotation inutile.

**⚠️ Et le plan Workers payant à 5 $ n'y change RIEN.** Il achète du calcul et des requêtes, pas une adresse. L'egress dédié chez Cloudflare est réservé à Enterprise. C'était une question directe du user, la réponse est non.

**Ce que ça remet en cause dans ce que j'ai livré ce soir :** le garde-fou de 200 appels/heure/colo reste utile (il empêche un emballement) mais il ne soigne PAS la cause — il rationne un budget qui n'existe presque pas. À conserver, sans lui prêter de vertu qu'il n'a pas.

**Aucun fichier touché.** C'est une mesure et une correction de doctrine, pas un changement de code.

---
### [2026-07-31 07:30] — 🔑 NOTRE PoToken NE SERVAIT À RIEN ET CASSAIT LA REQUÊTE

**Le fait, mesuré une variable à la fois, même session, même instant, même vidéo :**
| requête | résultat |
|---|---|
| session seule | **OK, 26 formats** |
| session + `hl/gl` | OK, 26 formats |
| session + `playbackContext` | OK, 26 formats |
| **session + jeton de mauvaise famille** | **HTTP 400** |
| **exactement comme le worker (avec jeton)** | **HTTP 400** |
| **exactement comme le worker, SANS le jeton** | **OK, 26 formats** |

**Le mécanisme :** un PoToken est lié à une plateforme d'attestation — BotGuard pour la famille Web, DroidGuard pour Android, iOSGuard pour iOS. Un jeton d'une famille est REFUSÉ par les autres. `bgutils-js` frappe du BotGuard, donc du **Web**. Nos clients sont ANDROID_VR, ANDROID et IOS. On envoyait un jeton Web à des clients Android.

**Ce n'était pas inerte : ça transformait un échec RÉCUPÉRABLE en échec DÉFINITIF.** Et comme le jeton n'était frappé qu'en SECOURS, après un premier refus, il achevait exactement les cas qu'il devait sauver. D'où le message que voyaient les utilisateurs : « attestation fournie, YouTube refuse quand même ».

**⚠️ D'OÙ VENAIT LA CROYANCE INVERSE :** une mesure du 26/07 disait « android_vr passe de LOGIN_REQUIRED à 23 formats grâce au jeton ». C'était une CORRÉLATION mal lue — le jeton était toujours envoyé AVEC un visitorData frais. La mesure du 30/07 avait déjà isolé la variable et conclu que c'est la session qui débloque, **sans qu'on en tire la conséquence sur le corps de la requête**. La bonne conclusion était là depuis un jour et demi ; il manquait de la relier au code.

**Résultat après correctif, sur les vidéos qui échouaient :**
| | avant | après |
|---|---|---|
| Short Fx-3 | refusé | **1080p, `android_vr`, non dégradé** |
| Short WebM | refusé | **1080p, `android_vr`** |
| Short du délai | refusé | **1080p, `android_vr`** |
| Short 403 | refusé | **1080p, `android_vr`** |
| contrôle | 240p `android` | **1080p, `android_vr`, 80 Mo** |

**4 résolutions sur 5 passent désormais par `android_vr`** — le seul client sans plafond d'octets. Avant, on retombait sur `android`, plafonné à **la première minute de vidéo** (mesure du jour : le plafond n'est pas en octets mais en durée, ~7,2 % du fichier quelle que soit sa taille). C'est de là que venaient tous les 240p.

**Ce que la suppression gagne en plus :**
- 1 à 2 secondes de calcul BotGuard sur le chemin d'échec ;
- le besoin de `'unsafe-eval'` dans la politique de sécurité de la page, qui n'existait QUE pour faire tourner la machine virtuelle de Google.

**CE QUI RESTE, et ce n'est pas la requête :** deux vidéos sur sept refusent encore. La MÊME requête, depuis une connexion résidentielle propre, passe : **OK, 26 formats jusqu'à 2160p**. C'est donc la réputation de notre adresse de sortie — **abîmée par mes propres centaines d'appels de la journée**, pas par un défaut de code.

**Fichiers touchés :**
- `tubeforge-webdl/src/youtube.js` — `serviceIntegrityDimensions` retiré du corps de la requête player.
- `expedition-site-prod/src/lib/webdl.ts` — secours PoToken supprimé, import nettoyé.

**Comment annuler :** remettre `...(auth?.poToken ? { serviceIntegrityDimensions: ... } : {})`. ⚠️ Ne le faire QUE si l'on bascule vers la famille de clients WEB/MWEB/TVHTML5 — sinon on réintroduit le HTTP 400.

**À faire ensuite :** `'unsafe-eval'` peut sortir de la CSP (plus aucune VM Google à exécuter), et `potoken.ts` ne sert plus qu'à `getVisitorData` — la moitié BotGuard du fichier est morte.

---
### [2026-07-31 06:00] — On proposait 240p par le relais alors qu'un 360p direct existait

**Le defaut :** le lien direct ne s'affichait QUE si aucun flux adaptatif n'existait. Or quand YouTube nous rabat sur un client plafonne a 25 Mo (`android`, `ios`), le chemin dit « principal » tombe a 240p — pendant que le lien direct offre **360p ET ne passe pas par notre relais**.

**Mesure sur `BYHkFkWxebg` (Seth Curl, 13:58) :**
| chemin | qualite | passe par le relais |
|---|---|---|
| « principal » | **240p**, 23 Mo, client `android`, motif `plafond-youtube` | oui — et il echouait en 403 |
| direct | **360p**, 37,1 Mo | **non** |

On proposait donc le pire des deux, et il echouait. L'utilisateur voyait « Télécharger en 240p », cliquait, et se prenait « code 403, tranche 2 sur 3 ».

**Regle desormais :** des que le lien direct fait MIEUX que le chemin adaptatif, c'est lui le chemin principal. Une condition, un vrai gain.

**Verifie en production :** l'action affichee est « **Ouvrir la vidéo en 360p** », avec l'explication « YouTube limite en ce moment ce qu'il nous laisse relayer — il ne nous laisserait passer que du 240p. Ce lien-ci te donne mieux, et il ne passe pas par nos serveurs : c'est aussi le plus fiable des deux en ce moment. »

⚠️ **Premier controle trompeur : « aucune action visible ».** C'etait le build precedent encore en cache dans le navigateur. Un rechargement en ignorant le cache a montre le bon resultat. **Toujours recharger sans cache avant de conclure qu'un deploiement n'a pas pris.**

**LE CONSTAT QUI COMPTE, et il n'est pas dans ce correctif :** tous les symptomes de la journee ont UNE seule cause. `android_vr` — le seul client sans plafond d'octets — est bloque par l'anti-robot. On retombe sur les clients plafonnes, d'ou le 240p ; et le relais est refuse, d'ou le 403. Message anti-robot, delai de 45 s, 240p, 403 sur les octets : quatre symptomes, une cause.

Tout ce que j'ai livre depuis ce matin traite des SYMPTOMES. C'est utile — un utilisateur repart maintenant avec un fichier au lieu d'une erreur — mais ca ne soigne rien. La cause est instruite par une recherche en cours (six pistes : type de PoToken, chaine de clients 2026, pool de sessions, sortie reseau, pratiques des projets qui tiennent, et l'hypothese qu'il faille cesser d'en dependre).

**Fichiers touches :**
- `src/app/tubeforge/telecharger/page.tsx` — condition d'affichage du lien direct, et explication propre au cas « le direct fait mieux ».

**Comment annuler :** revenir a `result.lienDirect && !result.video`.

---
### [2026-07-31 05:00] — « Le service n'a pas répondu au bout de 45 secondes » : une regression que j'avais introduite le soir meme

**Le defaut :** le code distinguait deux causes d'echec dans son COMMENTAIRE, et les traitait pareil dans son CODE.
- une limite de **debit** (HTTP 403/429/5xx) : une pause la repare ;
- un blocage **anti-robot** : une pause n'y change rien, c'est la SESSION qui est en cause, et la rejouer a l'identique ne sert a rien.

`transitoire()` melangeait les deux, donc la chaine etait rejouee **quatre fois** dans les deux cas. Et le renouvellement de session ajoute quelques heures plus tot relancait une chaine complete par-dessus.

**Resultat mesure :** jusqu'a **19 appels** pour une resolution qui ne pouvait pas aboutir, et une reponse au-dela des 45 secondes d'echeance. L'utilisateur voyait « Le service n'a pas repondu au bout de 45 secondes ».

**Le pire : on produisait avec des appels condamnes exactement le volume qui aggrave le blocage.** Un cercle vicieux que j'avais construit moi-meme.

**Corrige :** les reprises sont reservees a la limite de debit (`debitLimite()` exclut explicitement l'anti-robot). Sur un anti-robot on echoue vite, et l'appelant renouvelle la session — la seule chose qui marche.

**Mesure apres correctif :**
| | avant | apres |
|---|---|---|
| duree d'un echec anti-robot | **45 s** (echeance depassee) | **~700 ms** |
| appels a YouTube par echec | jusqu'a 19 | **3 a 7** |

**Ce qui n'est PAS repare :** le blocage lui-meme. Les Shorts sont toujours refuses, parce que j'ai passe la soiree a alimenter ce que je mesurais. **Aucun correctif ne peut compenser ca — la seule cure est d'arreter d'appeler.**

⚠️ **Et mes mesures sont peut-etre pessimistes pour l'utilisateur :** mes tests sortent par le point de presence Cloudflare le plus proche de MOI. Son navigateur passe par le sien. Un « bot » chez moi ne prouve pas un « bot » chez lui.

**Fichiers touches :**
- `tubeforge-webdl/src/youtube.js` — `antiRobot()` et `debitLimite()` remplacent `transitoire()` dans les deux boucles de reprise.

**Comment annuler :** remettre `transitoire()` dans les deux conditions de boucle.

---
### [2026-07-31 04:20] — Deux defauts sur les Shorts : un plantage, et un fichier que Premiere n'ouvre pas

Deux signalements sur des Shorts. Le premier etait un plantage franc, le second un defaut plus grave parce qu'il ne se voyait pas.

## 1. « Codec 'aac' cannot be contained within WebM » — l'erreur brute affichee a l'utilisateur

**Le defaut :** `pickPair` appariait un conteneur avec un son qu'il ne peut pas contenir. Deux versions du meme bug :
- pour un conteneur `webm`, il prenait TOUS les sons disponibles, AAC compris — or WebM n'accepte que Opus et Vorbis ;
- et meme en `mp4`, `(compat.length ? compat : auds)` retombait **silencieusement** sur un son incompatible quand aucun ne convenait.

**Corrige :** une table explicite (`mp4` → AAC, `webm` → Opus/Vorbis) et, surtout, **plus aucun repli incompatible** — sans son valide pour ce conteneur, on passe au candidat video suivant. Une qualite plus basse mais un fichier QUI S'OUVRE.

**Verifie : 6 paires conteneur/son valides sur 6.**

**Filet pose en plus :** aucune erreur de la bibliotheque de fusion ne doit atteindre l'utilisateur telle quelle. Ce message etait en anglais, ecrit pour un developpeur qui choisit un format (« Switching to MKV will grant support for this codec »). Il est desormais enveloppe dans une phrase francaise — en conservant le detail brut en fin de ligne, parce que c'est exactement ce detail qui a permis de trouver le defaut en une lecture.

## 2. Le vrai probleme : on livrait du WebM a des monteurs

**Ce que la mesure a montre sur `V1r0GsuIakc` :** la video existe en **H.264 jusqu'en 1080p** — le seul format que Premiere Pro ouvre sans greffon. On servait du **VP9 dans un conteneur WebM**, que Premiere n'ouvre pas. Sur une page dont la promesse est « pose tes extraits sur ta timeline Premiere Pro ou DaVinci ».

**La racine :** le plafond de qualite s'appliquait a la HAUTEUR. Pour une video verticale, la hauteur vaut 1920 — donc tous les bons formats etaient elimines, et il ne restait que du VP9 en 1080. **La largeur n'etait meme pas extraite.**

**Corrige :** on plafonne et on classe desormais sur la **petite dimension**, au sens ou tout le monde entend « 1080p » — un 1920x1080 horizontal et un 1080x1920 vertical sont tous les deux du 1080p. Un seul changement repare les deux problemes : a definition egale le classement preferait deja `avc1`, donc le H.264 redevient atteignable et gagne.

Effet secondaire bienvenu : l'etiquette affiche « 1080p » au lieu de « 1920p », qui ne voulait rien dire.

**Verifie apres purge du cache :**
| | avant | apres |
|---|---|---|
| Short vertical | WebM / VP9 (Premiere refuse) | **1080p MP4 / avc1 + AAC, 14,7 Mo** |
| horizontaux (2 controles) | MP4 / avc1 | inchange |

**Fichiers touches :**
- `tubeforge-webdl/src/youtube.js` — `width` extraite ; `definition()` = petite dimension, utilisee pour le plafond ET le classement ; table `SONS_ACCEPTES` ; suppression du repli incompatible.
- `tubeforge-webdl/src/index.js` — la page recoit `definition` comme hauteur affichee.
- `expedition-site-prod/src/lib/webdl.ts` — `muxAvecFilet()`.

**Comment annuler :** revenir a `(f.height || 0)` dans le filtre et le score de `pickPair`, et a l'ancien `pickAudio`.

**⚠️ Non verifie de bout en bout :** deux des trois Shorts ont ete refuses par l'anti-robot pendant le controle final — encore mon propre volume d'appels. Le troisieme confirme le correctif, mais je n'ai pas vu les trois passer ensemble.

---
### [2026-07-31 03:10] — 🔑 Une session YouTube grillee restait en cache SIX HEURES

**Le fait, decouvert en testant un Short :** apres une serie de refus anti-robot (0 succes sur 2 essais consecutifs, sur deux formats d'URL differents), la simple **purge de `vd:current`** a debloque la resolution **immediatement**.

**Pourquoi c'est important :** le `visitorData` — l'identite de session anonyme avec laquelle on parle a YouTube — etait mis en cache six heures. Quand YouTube finit par associer cette session a un comportement de robot, elle **reste en place et empoisonne toutes les requetes suivantes pendant tout ce temps**. On rejouait une identite deja brulee, encore et encore.

**Mesures :**
| moment | resultat |
|---|---|
| avant purge | **0 / 2** (meme video, deux formats d'URL) |
| apres purge manuelle | **2 / 4** sur des videos jamais demandees |
| apres renouvellement automatique deploye | **3 / 4**, dont le Short qui avait echoue |

Ce n'est **pas un remede complet** — le blocage reste partiel, et « Hello » refuse encore. Mais garder une session brulee six heures n'a aucun interet, et c'est desormais corrige.

**Ce qui a ete deploye :** sur un refus de type `bot`, le Worker purge `vd:current`, en obtient une fraiche, et **retente une fois**.

**⚠️ GARDE-FOU CONTRE LA RUEE, sans lequel le remede serait pire que le mal :** sous une vague de refus, chaque requete voudrait renouveler la session — et `/youtubei/v1/visitor_id` est LUI AUSSI limite en debit (11 succes sur 20 appels d'affilee, mesure du projet). Un marqueur `vd:renouvele` de deux minutes borne donc les renouvellements a **un seul, globalement**.

**Au passage, deux choses verifiees et ecartees :**
- **Les Shorts sont parfaitement geres.** `parseYouTubeId` reconnait `/shorts/`, et la meme video en `watch?v=` donnait exactement le meme refus. Le format n'y etait pour rien.
- La video etait publique, 58 secondes, sans restriction d'age — yt-dlp la resout sans broncher depuis une connexion ordinaire.

**Fichiers touches :**
- `tubeforge-webdl/src/index.js` — renouvellement de session sur `kind === 'bot'`, borne par `vd:renouvele`.

**Comment annuler :** supprimer le bloc `if (!r.ok && r.kind === 'bot')` et remettre `const r = await resolveYouTube(...)`.

**Ce que ca ne resout pas :** le blocage lie a l'ADRESSE de sortie reste entier. La session n'etait qu'une des deux moities du probleme — et personne ne l'avait regardee jusqu'ici parce que la memoire du projet attribuait tout au volume d'appels par IP.

---
### [2026-07-31 02:30] — Etat complet apres la journee, et un defaut trouve par le test lui-meme

**Quoi :** Verification de bout en bout du telechargeur. Plus une correction : le compteur affiche ne bougeait plus apres un telechargement.

**Ce qui a ete verifie :**

| | resultat |
|---|---|
| plan / porte / plafonds | payant, porte ouverte, 19,6 Go par personne, mois a 1 846 / 9 500 000 |
| resolutions | **4 sur 5**, 525 a 1 529 ms — dont les deux videos qui avaient echoue chez des utilisateurs |
| la geo-bloquee | refusee, comme voulu |
| relais d'octets | **4 tranches sur 4**, 22,9 Mo, 1,0 a 5,6 Mo/s |
| secours 360p | HTTP 206, conteneur `ftyp` valide |
| telechargement complet | **40 999 534 octets**, `ftypisom`, 12 s |
| pic memoire | **107 Mo** pour un fichier de 39 Mo |
| barre de progression | 14 valeurs, bond maximal 5 Mo |
| page de diagnostic | 4 sondes vertes, octets compris |

**🐛 LE DEFAUT TROUVE PAR CE TEST :** le quota affichait « 8,9 Go restants » **avant ET apres** avoir telecharge. Effet de bord du deplacement du debit vers le relais — plus rien ne rafraichissait le chiffre a l'ecran, puisque la reponse de resolution ne le porte plus. Un compteur qui ne bouge jamais se lit comme un compteur decoratif.

**Corrige :** relecture de `/api/me` vingt secondes apres la fin du telechargement. Le delai n'est pas une precaution vague — la base cle-valeur est a coherence differee, et relire tout de suite renverrait l'ancienne valeur. Mesure du jour : une vingtaine de secondes pour qu'une ecriture soit visible partout.

**Fichiers touches :**
- `src/app/tubeforge/telecharger/page.tsx` — `setTimeout(refreshMe, 20_000)` apres un telechargement reussi.

**Note sur les videos qui avaient echoue :** `NcD7oeBtrvI` (403 sur les octets) et `7obQlmThI58` (anti-robot) se resolvent et se telechargent toutes les deux maintenant. Les deux pannes etaient donc bien transitoires — ce qui renforce l'hypothese que mes propres campagnes de test en etaient la cause.

---
### [2026-07-31 01:50] — « Réessaie dans une minute » était une promesse fausse

**Quoi :** Le message anti-robot annonce desormais une dizaine de minutes, et dit explicitement que **la video n'a rien** — c'est notre serveur qui est momentanement mal vu.

**Pourquoi :** Nouveau signalement, video `7obQlmThI58`. Cette fois le diagnostic du message etait JUSTE, et je l'ai verifie avant de toucher quoi que ce soit :
- yt-dlp depuis une connexion ordinaire : `age_limit=0`, `availability=public`, resolue sans broncher.
- Notre worker : **`LOGIN_REQUIRED` sur 8 tentatives sur 9**, motif explicite « Connectez-vous pour confirmer que vous n'êtes pas un robot », plus un `http403`. Sur les trois clients (`android_vr`, `android`, `ios`).

Donc la video est parfaitement telechargeable et c'est bien notre adresse de sortie qui est signalee. Le seul defaut etait le DELAI annonce : « une minute », quand la limite retombe en une dizaine. Quelqu'un qui reessaie au bout d'une minute se fait refuser, conclut que l'outil est casse, et part.

**Avant / apres :**
| | |
|---|---|
| avant | « YouTube nous a pris pour un robot sur cette video. C'est temporaire… reessaie dans **une minute**. » |
| apres | « YouTube prend **NOTRE serveur** pour un robot en ce moment — **la video elle-meme n'a rien**, elle est parfaitement telechargeable. Ca se debloque tout seul, mais compte **une dizaine de minutes** plutot qu'une. » |

**Verifie apres deploiement :** la video se resout maintenant en 1080p (la limite est retombee pendant l'intervalle), et les trois autres videos de controle passent — le blocage etait bien temporaire et lie a l'adresse, pas a une video.

**⚠️ CAUSE LA PLUS PROBABLE, et elle est de mon fait :** j'ai lance plusieurs centaines de resolutions depuis ce worker aujourd'hui, dont des boucles de huit essais. La memoire du projet le documente deja — « le declencheur = le VOLUME d'appels depuis une meme IP », et « une mesure repetee sur une ressource partagee ne mesure plus la ressource, elle mesure l'effet de la mesure ». **Troisieme fois de la journee que mes propres tests produisent le symptome que j'analyse.**

Ce qui protege un vrai usage : le cache (5 h 29 par video), la repartition des visiteurs sur plusieurs points de presence, et l'etalement dans le temps. Un utilisateur reel ne martele pas.

**Ce qui reste sans filet dans ce cas :** contrairement au refus d'octets, un echec de RESOLUTION ne laisse aucun secours — pas de resolution, donc pas de lien direct 360p a proposer. Le seul filet existant est le cache perime (servi si ses URLs vivent encore), inutile sur une video jamais demandee.

**Fichiers touches :**
- `tubeforge-webdl/src/youtube.js` — formulation du refus `bot`.

**Comment annuler :** revenir a la chaine precedente.

---
### [2026-07-31 01:15] — Le quota se debite quand on TELECHARGE, plus quand on regarde

**Quoi :** La resolution ne debite plus qu'**une unite** — son cout reel. Le cout de la video est debite dans `/api/stream`, a la **premiere tranche** de chaque piste.

**Pourquoi :** Defaut que j'avais signale sans le corriger. Le cout complet etait debite des la resolution : regarder trois grosses videos sans en telecharger une seule mangeait la journee. Negligeable quand une resolution valait 1 sur 25 ; plus du tout depuis qu'elle peut couter 311 unites.

**Le nouveau partage :**
| moment | ce qui est debite |
|---|---|
| resolution | **1 unite** — un appel a YouTube et quelques Ko |
| 1re tranche d'une piste | le cout de la piste (`ceil(clen / 6 Mo)`) |
| tranches suivantes | rien |

**Le plafond garde son role protecteur :** la resolution VERIFIE toujours que le cout projete rentre — inutile de laisser demarrer un telechargement qui ne peut pas aboutir. Nouveau message quand ca ne rentre pas : « Cette video depasse ce qu'il te reste aujourd'hui (X Go). »

**Pourquoi le debit est INESQUIVABLE :** `clen` (la taille de la piste) vit DANS L'URL SIGNEE — infalsifiable sans casser la signature, donc rien a ajouter au payload. Et les octets ne peuvent pas circuler sans passer par `/api/stream` : un fichier sans sa premiere tranche est inutilisable. Une reprise de la tranche 0 debite deux fois, c'est rare, et se tromper vers le HAUT est le bon sens de l'erreur.

**En tache de fond (`waitUntil`)** : la livraison des octets n'attend pas trois ecritures dans la base cle-valeur.

**Verifie en production, sur une video de 1 821 Mo :**
| | mesure | attendu |
|---|---|---|
| resolution seule | **+1** | 1 |
| 1re tranche video | **+311** | 311 |
| tranche suivante | **+0** | 0 |

Avant ce correctif, la seule resolution coutait **319 unites** — soit toute la video, sans avoir telecharge un octet.

**⚠️ PIEGE DE MESURE, la enieme de la journee :** ma premiere serie donnait des deltas absurdes, dont un **-310**. Cause — la base cle-valeur est a coherence differee : je relisais le compteur 3 secondes apres l'ecriture. Un delta negatif est impossible, et c'est ce qui a trahi le dispositif. Il faut **25 secondes de repos entre chaque releve**, sinon on mesure la propagation et pas le comptage.

**Fichiers touches :**
- `tubeforge-webdl/src/index.js` — `debiterUnites()` (les trois compteurs, en tache de fond) ; verification du cout projete separee du debit dans `/api/resolve` ; debit sur `start === '0'` dans `/api/stream`.

**Comment annuler :** remettre `const unites = coutProjete;` dans `/api/resolve` et supprimer le bloc de debit de `/api/stream`.

**Effets de bord possibles :** une resolution sans telechargement ne coute presque rien, ce qui est le but — mais quelqu'un qui resout en boucle sans jamais telecharger consomme des appels a YouTube pour 1 unite chacun. Le cache (5 h 29 par video) et le plafond global couvrent ce cas. A surveiller si le compteur global monte sans que les octets suivent.

---
### [2026-07-31 00:30] — Quand le relais refuse, on propose le chemin qui ne passe pas par nous

**Quoi :** Un echec de telechargement sur refus d'octets affiche desormais un bouton « Recuperer en 360p a la place ». Le lien existait ; il n'apparaissait QUE si aucun flux haute qualite n'etait disponible.

**Pourquoi :** La cause de l'echec chez le contact du user n'est PAS etablie — deux hypotheses nommees, deux ecartees par la mesure. Mais ce chemin-la n'a pas besoin qu'on connaisse la cause : **les octets vont de YouTube directement a la machine du visiteur, sans passer par nos serveurs.** Il contourne donc par construction tout ce qui bloque notre relais — adresse de sortie signalee, filtrage, vague de refus.

Consequence vecue : une personne voyait un echec total alors qu'un chemin fonctionnel etait a cote, invisible.

**Ordre delibere : le secours AVANT la demande de diagnostic.** La personne veut sa video, pas nous aider. On lui donne d'abord ce qui marche, on demande ensuite. Verifie a l'ecran (`secoursAvantDiagnostic: true`).

**Verifie en production, refus de relais simule :**
```
Le téléchargement a échoué (vidéo, tranche 2 sur 14, code 403).
Il reste un chemin qui ne passe pas par nos serveurs, donc que ce blocage n'atteint pas.
La qualité est plus basse, mais tu repars avec la vidéo.
[ Récupérer en 360p à la place ]
Ça nous aiderait beaucoup : lance ce test maintenant…
```

**Et le lien de secours livre vraiment :** HTTP 206, 2 097 152 octets recus, `content-disposition: attachment` avec le nom du fichier, `video/mp4`, **boite `ftyp` valide**. Ce n'est pas un lien decoratif.

**Disponibilite mesuree :** le secours 360p existe sur 4 videos testees sur 4. Sur deux d'entre elles YouTube n'envoie pas d'en-tete d'attachement (`gir=yes`) : la video s'ouvre alors dans un onglet, et le message le dit explicitement au lieu de laisser la personne devant une surprise.

**Fichiers touches :**
- `src/app/tubeforge/telecharger/page.tsx` — bloc de secours dans l'encart d'erreur, conditionne a `echecTelechargement && result.lienDirect`.

**Comment annuler :** retirer le bloc `echecTelechargement && result?.lienDirect` de l'encart d'erreur. Le chemin principal n'est pas touche.

**Effets de bord possibles :** aucun sur le chemin normal — ce bloc n'existe que dans un encart d'erreur. Le secours plafonne a 360p, et c'est dit.

---
### [2026-07-30 23:55] — L'echec se signale tout seul, au lieu de dependre du bon timing d'un tiers

**Quoi :** Un echec de telechargement pose desormais un marqueur Clarity portant sa NATURE, et propose de lancer le diagnostic dans la seconde qui suit, dans le meme navigateur.

**Pourquoi — erreur de METHODE de ma part :** j'ai recu deux diagnostics, tous les deux entierement verts, octets compris. Ils ne prouvaient rien : lances quand ca marchait, et l'un dans **Chrome** alors que le premier rapport d'echec venait de **Firefox**. **Une mesure qui depend du bon timing et du bon navigateur d'un tiers n'est pas une mesure.**

**Ce qui change :**
- `webdl_dl_echec` = `octets-403` | `coupure-reseau` | `trop-lourd` | `autre`. Clarity fournissant deja le pays ET le navigateur, le taux et sa repartition se liront sans que personne n'ait rien a faire.
- Sur un refus d'octets — le seul cas ou le diagnostic apporte quelque chose — l'encart d'erreur invite a le lancer **maintenant**, dans le meme navigateur.

**Verifie en production, refus d'octets simule :**
```
Le téléchargement a échoué (audio, tranche 1 sur 1, code 403). Réessaie : YouTube refuse parfois
des morceaux au hasard.
Ça nous aiderait beaucoup : lance ce test maintenant — dans le même navigateur, pendant que la
panne est là — et envoie-nous le résultat.
```
Marqueur pose : `set webdl_dl_echec octets-403`. Lien present.

**⚠️ Decouvert pendant le test, et ca vaut d'etre note :** mon premier essai est reste bloque sans rien afficher. Cause — **Chrome a ouvert le selecteur de fichier natif et attendait un humain**. C'est la premiere fois que ce chemin s'exerce sous mes yeux, et ca confirme qu'il s'engage bien. Il reste non valide de bout en bout : le selecteur exige un clic que je ne peux pas donner.

**Fichiers touches :**
- `src/app/tubeforge/telecharger/page.tsx` — `marquerEtat2()` generique, `echecTelechargement`, classification de la nature de l'echec, invitation sous l'encart d'erreur.

**Comment annuler :** retirer l'appel a `marquerEtat2` dans le `catch` de `onDownload` et le bloc `echecTelechargement` de l'encart.

**Ce qui reste ouvert, et honnetement :** la cause de l'echec chez son contact n'est PAS etablie. Deux hypotheses nommees, deux ecartees par la mesure (`gcr`, puis l'adresse signee). Ce dispositif ne devine plus — il attend la prochaine panne pour la decrire.

---
### [2026-07-30 23:20] — 🚨 MON DIAGNOSTIC GEO NE TENAIT PAS, et le diagnostic avait un trou beant

**Le fait qui m'a corrige :** le user signale une video qui marche parfaitement chez lui et echoue chez quelqu'un d'autre — **et cette personne n'est pas en Algerie**. Puis une seconde video, `NcD7oeBtrvI`.

**Ce que la mesure a etabli sur cette seconde video :**
- **Aucun `gcr`.** Ma theorie de la restriction geographique ne l'explique pas.
- `ip` EST dans les parametres signes, mais les octets passent quand meme depuis une adresse totalement differente → l'URL **n'est pas** verrouillee sur l'adresse. Confirme dans les deux sens, comme la memoire du projet le disait deja.
- Par le RELAIS : **206 sur les quatre tranches testees**, octets exacts. En direct : 206 aussi.

Donc la video est parfaitement livrable depuis au moins deux reseaux, au moment meme ou elle echoue chez quelqu'un d'autre. **L'echec est specifique a SA requete**, et aucune des deux causes que j'avais nommees ne l'explique.

**🕳️ LE TROU DANS MON DIAGNOSTIC, et c'est le plus important :** les trois sondes verifiaient qu'un hote REPOND. Aucune ne verifiait que les OCTETS CIRCULENT. D'ou l'absurdite vecue : la page annoncait « tout repond depuis ton reseau » pendant que le telechargement echouait des la premiere tranche avec un 403. **Repondre n'est pas livrer.**

**Quatrieme sonde ajoutee — la seule qui reproduit ce qui echoue vraiment :** une resolution reelle sur une video de 19 secondes (1 Mo), puis UN octet demande par le relais. Elle coute une unite de quota a qui la lance ; c'est le prix d'un diagnostic qui ne mente pas.

**Nouveau verdict `OCTETS-REFUSES`, place AVANT « tout repond » :**
> « Notre serveur repond, mais YouTube refuse de lui livrer la video. C'est le cas le plus vicieux : tout a l'air normal, et le telechargement echoue quand meme. YouTube refuse de servir les fichiers a notre serveur depuis ton point d'acces a Internet — pas depuis d'autres. Ca arrive par vagues et ca se debloque souvent tout seul. Ce n'est ni ta connexion, ni ton ordinateur. »

**Verifie en production, LES DEUX BRANCHES :**
- normal → `OK`, quatre sondes vertes dont « Le telechargement lui-meme : OK (octets recus, 834 ms) ».
- octets refuses par simulation → `OCTETS-REFUSES`, avec le bon texte.

**HYPOTHESE, et je la marque comme telle :** l'adresse de sortie du point de presence Cloudflare qui sert cette personne est refusee par googlevideo — un signalement par volume, deja documente dans ce projet (« le declencheur = le VOLUME d'appels depuis une meme IP »). Ca expliquerait tout : meme video, meme instant, un point de presence passe et l'autre non. **Non prouve.** La nouvelle sonde est precisement ce qui permettra de le prouver ou de l'ecarter, depuis chez la personne concernee.

**Si l'hypothese se confirme, la reparation est deja identifiee et mesuree :** relayer les octets par le VPS Hetzner (10,9 a 19,2 Mo/s, 3-6x plus rapide que Cloudflare, cf. entree du jour). Non pas pour un pays, mais pour la DIVERSITE DES ADRESSES DE SORTIE. Le VPS revient donc dans le tableau, pour une raison differente de celle que j'avais imaginee.

**Fichiers touches :**
- `src/app/tubeforge/telecharger/diagnostic/page.tsx` — `sonderOctets()`, quatrieme sonde, verdict `OCTETS-REFUSES` en tete de la chaine de decision.

**Comment annuler :** retirer l'entree `octets` de `SONDES`, la fonction `sonderOctets` et la premiere branche du verdict.

**Lecon, la deuxieme de la journee sur le meme theme :** j'ai nomme deux causes (`gcr`, puis l'adresse signee) et les deux etaient fausses pour ce cas. Ce qui a fini par avancer, ce n'est pas une hypothese de plus — c'est d'avoir rendu l'instrument capable de mesurer ce qui casse REELLEMENT, au lieu d'un proxy commode.

---
### [2026-07-30 22:35] — Dire QUI bloque, en premiere phrase

**Quoi :** Le refus geographique commence desormais par nommer la cause : « C'est YouTube qui bloque cette video, **pas le telechargeur**. »

**Pourquoi :** Retour du user, et il a raison. Le message precedent nommait YouTube mais laissait le doute — lu vite, « refuse de nous la livrer » se lit encore comme une panne de l'outil. Or c'est le seul cas de la journee ou nous n'avons rien casse, et laisser l'outil porter le chapeau pour une decision de YouTube est faux et couteux : sur un produit d'appel, l'utilisateur qui croit l'outil casse ne revient pas.

**Avant / apres :**
| | |
|---|---|
| avant | « YouTube bloque cette video en dehors de certains pays, et refuse de nous la livrer. Ce n'est pas un probleme passager : reessayer ne changera rien. » |
| apres | « **C'est YouTube qui bloque cette video, pas le telechargeur.** Elle est reservee a certains pays, et YouTube refuse de nous livrer le fichier. **Rien a corriger de notre cote**, et reessayer ne changera rien. » |

La variante generique `livraison-refusee` suit la meme regle : « C'est YouTube qui refuse, pas le telechargeur. »

**Verifie en production, 3 essais sur 3** apres attente de propagation (piege rencontre quatre fois aujourd'hui) : message identique et stable, argumentaire TubeForge joint.

**Point deja verifie et qui tient :** ce refus ne debite **aucune** unite de quota — mesure avant/apres, 828 unites personnelles et 1654 serveur, inchangees. Le refus survient avant le debit dans `/api/resolve`.

**Fichiers touches :**
- `tubeforge-webdl/src/index.js` — formulation des deux branches de refus.

**Comment annuler :** revenir aux deux chaines precedentes.

---
### [2026-07-30 22:10] — « Code 403 » sur une video : ce n'est pas un bug, c'est une restriction geographique — et on le dit maintenant AVANT

**Quoi :** Le Worker verifie desormais que YouTube accepte de LIVRER la video, avant de promettre quoi que ce soit. Nouveau refus `geo-bloquee`, rendu a la resolution.

**Pourquoi :** Signalement du user sur `OskI6bDrZVM` (TheKAIRI78) — « Le telechargement a echoue (audio, tranche 1 sur 2, code 403). Reessaie ». Le conseil etait faux : aucun nouvel essai ne pouvait passer.

**Ce que la mesure a etabli, etape par etape :**
1. La resolution REUSSIT, les liens sont valides 6 heures.
2. Les octets repondent **403 depuis notre relais, depuis une connexion residentielle ET depuis un VPS finlandais**. Donc ni notre code, ni notre reseau.
3. Comparaison des parametres SIGNES avec une video qui marche : une seule difference, **`gcr`** — *geo country restriction*, valeur `us`.
4. Confirmation : **8 refus sur 8** sur huit essais espaces. Ce n'est pas sporadique.
5. Et une sonde d'**UN SEUL OCTET** le detecte : 403 sur celle-ci, 206 sur une video normale.

**⚠️ Piege de mesure evite de justesse :** le premier essai apres deploiement annoncait « livrable ». C'etait un point de presence Cloudflare pas encore a jour — la propagation progressive, deja rencontree quatre fois aujourd'hui. Sans les huit essais suivants j'aurais conclu que c'etait intermittent, et ecrit un message faux dans l'autre sens.

**Le refus, et son argumentaire :**
> « YouTube bloque cette video en dehors de certains pays, et refuse de nous la livrer. Ce n'est pas un probleme passager : reessayer ne changera rien. »
> *TubeForge n'a pas cette limite — il telecharge depuis TA connexion et TA session : si la video est visible chez toi, il la recupere.*

C'est le seul cas de la journee ou l'argumentaire TubeForge est litteralement vrai plutot que commercial : notre worker sort par une IP geolocalisee ailleurs, l'application de la personne sort par la sienne.

**⚡ Sonde CIBLEE, et c'est important :** systematique, elle ajoutait ~400 ms a CHAQUE resolution (777-943 ms contre 449-511 ms). Elle ne se declenche donc que si l'URL porte `gcr` dans ses parametres signes — un test de chaine, gratuit. Mesure apres ciblage : videos normales **539 a 787 ms** (vitesse retrouvee), video geo-bloquee refusee en **302 a 687 ms**.

**Verifie :** 6 videos normales sur 6 passent, **0 faux positif** — un seul aurait rendu la sonde inacceptable. La geo-bloquee refusee 3 fois sur 3 apres ciblage, 8 sur 8 avant.

**Fichiers touches :**
- `tubeforge-webdl/src/index.js` — `marqueeGeo` (detection `gcr` dans `sparams`), sonde `bytes=0-0` conditionnelle, refus `geo-bloquee` / `livraison-refusee` avec argumentaire.

**Comment annuler :** supprimer le bloc `marqueeGeo` / `livrable` et le `if (livrable !== null)` qui suit. Le symptome d'origine reviendra : echec en cours de telechargement avec un conseil inutile.

**Effets de bord possibles :** une sous-requete de plus sur les seules videos marquees `gcr` (non facturee, et le plan payant en autorise 10 000 par invocation). Si un refus de livraison apparait un jour SANS `gcr`, il repassera par l'ancien symptome — il faudra elargir la sonde plutot que deviner. La branche generique `livraison-refusee` est en place pour ce jour-la.

---
### [2026-07-30 21:00] — La barre de progression bondissait de 1 a 16 a 80 a 127 Mo

**Quoi :** Les octets sont desormais comptes A LEUR ARRIVEE, plus a la fin d'une tranche. Et l'affichage est borne a dix rafraichissements par seconde.

**Pourquoi :** Signalement du user — « au debut t'as l'impression que c'est tres lent et que ca deconne ». La cause exacte : `onBytes` n'etait appele qu'une fois la tranche de 6 Mo ENTIEREMENT recue (`await r.arrayBuffer()`). Comme douze tranches se telechargent en parallele et se partagent la ligne, elles s'achevaient presque ensemble : le compteur restait immobile, puis bondissait. Rien n'etait lent — c'etait l'affichage qui mentait.

**Mesure du meme telechargement (275 Mo), avant / apres :**
| | avant | apres |
|---|---|---|
| valeurs affichees | ~4 | **122** |
| ecart median entre deux valeurs | ~40 Mo | **2 Mo** |
| ecart maximal | ~64 Mo | **5 Mo** |
| debut de la suite | 1 · 16 · 80 · 127 | **0 · 1 · 4 · 5 · 7 · 8 · 12 · 13 · 16 · 18…** |
Fichier final identique : **288 320 525 octets**, comme avant le changement.

**⚠️ Le revers, traite dans la meme passe :** compter a l'arrivee fait appeler `onBytes` pour chaque morceau recu, soit quelques dizaines de kilo-octets — des centaines de fois par seconde. Rafraichir React a ce rythme fait ramer l'onglet et RALENTIT le telechargement : on aurait echange un defaut d'affichage contre un vrai defaut de vitesse. D'ou `compteurProgression()` : il COMPTE tout, il n'AFFICHE qu'au plus dix fois par seconde.

**Piege de comptage traite :** si le flux casse EN COURS de lecture, les octets deja annonces n'existent plus. Sans un `onBytes(-recu)` avant de rejouer la tranche, le nouvel essai les compterait une seconde fois et la barre afficherait plus de megaoctets que le fichier n'en contient.

**La vitesse ne change pas d'un octet.** C'est un defaut de PERCEPTION qui est corrige, et il faut le dire clairement : la personne voit du mouvement des la premiere seconde au lieu d'attendre dix secondes devant un compteur fige.

**Fichiers touches :**
- `src/lib/webdl.ts` — lecture du corps en flux dans la boucle de reprise ; `compteurProgression()` remplace les deux `bump` locaux ; `reinitialiser()` pour le repli vers le relais ; suppression du `onBytes` apres depot (il aurait double la progression).

**Comment annuler :** revenir a `buf = new Uint8Array(await r.arrayBuffer())` et remettre `onBytes(buf.byteLength)` apres `deposer`.

**Effets de bord possibles :** aucun sur le fichier produit (verifie octet par octet). Le seul risque etait la cadence de rafraichissement, borne explicitement.

---
### [2026-07-30 20:00] — 🚨 L'HYPOTHESE « L'ALGERIE BLOQUE CLOUDFLARE » EST FAUSSE

**Le fait :** le contact algerien a lance la page de diagnostic. **Les trois sondes repondent.**
```
DIAGNOSTIC TÉLÉCHARGEUR — OK
- Notre téléchargeur : OK (réponse reçue, 266 ms)
- Un gros site du même hébergeur : OK (réponse reçue, 178 ms)
- Le site que tu es en train de lire : OK (réponse reçue, 217 ms)
navigateur : Firefox 153 / Windows
```

**Consequence directe : NE PAS construire le relais sur le VPS.** Sa premisse n'existe pas. La mesure du VPS (10,9 a 19,2 Mo/s, cf. entree precedente) reste vraie et reste un gain de VITESSE interessant — mais elle ne repare pas un probleme de joignabilite qui n'est pas etabli.

**Ce que j'ai construit sur une hypothese non verifiee, et ce que ca valait :**
- Le message d'erreur honnete (« Le telechargeur est injoignable » au lieu de « Impossible de verifier ton acces ») → **a garder**, l'ancien accusait l'utilisateur d'un probleme de droits quelle que soit la cause.
- La page de diagnostic → **a garder**, c'est elle qui vient de me contredire. Un instrument qui refute son auteur est exactement ce qu'on veut.
- Le marqueur Clarity par pays → **a garder**, il donnera le taux reel sur plusieurs jours au lieu d'une anecdote.
- Le relais VPS → **abandonne**, faute de premisse.

**🐛 CE QUE LE RESULTAT REVELE DANS MON PROPRE DIAGNOSTIC :** il ne distinguait pas un blocage par le FOURNISSEUR D'ACCES d'un blocage par une EXTENSION ou un antivirus sur la machine. Or Firefox sur Windows rend le second tres plausible — les bloqueurs de publicite listent frequemment `workers.dev`, vecteur de hameconnage connu.

**Corrige avec la lecon du jour, payee deux fois :** un refus en 0 a 1 ms ne peut PAS venir du reseau, il n'y a pas le temps d'un aller-retour. C'est la signature d'un refus LOCAL. Sous 15 ms, la page annonce desormais :
> « Le blocage vient de ton ordinateur, pas de ton reseau. La demande a ete refusee en moins d'un centieme de seconde : c'est trop rapide pour venir d'Internet. Une extension, un antivirus ou un pare-feu intercepte l'adresse. Essaie en navigation privee. »

**Verifie en production :** blocage simule a 1 ms → `BLOCAGE-LOCAL`, avec le bon texte. Les autres branches (`OK`, `NOTRE-ADRESSE`, `HEBERGEUR-ENTIER`) restent en place.

**Cause probable de la panne d'origine, sans certitude :** soit une extension ou un antivirus sur sa machine, soit un incident passager. ⚠️ **A ne pas ecarter : j'ai redeploye le worker une douzaine de fois et le site une dizaine de fois pendant cette journee.** Un chargement tombe au mauvais moment est un candidat credible, et il est de mon fait.

**Fichiers touches :**
- `src/app/tubeforge/telecharger/diagnostic/page.tsx` — `refusLocal` (seuil 15 ms), branche `BLOCAGE-LOCAL` placee avant celles qui accusent le reseau.

**Ce qu'il faut faire maintenant :** demander au contact de relancer le diagnostic **au moment ou ca casse**, pas quand ca marche. C'est le seul instant ou la mesure vaut quelque chose. Et lire le taux Clarity dans quelques jours.

**Lecon pour la memoire :** j'ai bati un plan d'infrastructure — achat de domaine, zone Cloudflare, relais VPS — sur DEUX captures d'ecran et une recherche documentaire, sans jamais avoir mesure le cas reel. Le premier test a coute trente secondes et a tout invalide. **L'instrument de mesure aurait du etre la premiere chose construite, pas la cinquieme.**

---
### [2026-07-30 19:15] — Le VPS SERT les octets, 3 a 6 fois plus vite que Cloudflare

**Quoi :** Mesure, pas modification. Le VPS Hetzner de ReviewForge (`204.168.158.84`, AS24940, Helsinki) relaie parfaitement les octets googlevideo.

**Pourquoi c'etait a tester :** la memoire du projet disait « le VPS Hetzner est refuse MEME A L'ETAPE RESOLUTION (LOGIN_REQUIRED 9/9), ne pas y demenager quoi que ce soit ». C'est vrai pour la RESOLUTION. Ca n'avait **jamais** ete teste pour le RELAIS D'OCTETS — et les deux etapes n'ont rien a voir : l'anti-robot vit sur `/youtubei/v1/player`, pas sur googlevideo.

**Mesures, une seule requete par plage :**
| plage d'octets | resultat |
|---|---|
| 0 – 6,2 Mo | 206, 6 291 456 octets exacts, **19,2 Mo/s** |
| 20 – 26 Mo | 206, exact, **12,7 Mo/s** |
| 50 – 56 Mo | 206, exact, **10,9 Mo/s** |
| *Cloudflare, meme URL, meme instant* | *206, exact, **3,07 Mo/s*** |

⚠️ **`curl -L` est indispensable** : googlevideo repond d'abord 302. Le premier essai sans suivre la redirection donnait « http=302, 0 octet », qu'on lirait comme un refus.

**Ce que ca ouvre :** separer les deux metiers du worker PAR RESEAU. Resolution sur Cloudflare (le VPS y est refuse), relais d'octets sur le VPS — plus rapide, 20 To/mois inclus, et surtout **hors AS13335**, ce qui en fait la piste la plus credible pour l'Algerie. Effet de bord favorable : le budget de requetes Cloudflare cesse d'etre la contrainte, seules les resolutions y passent.

Chemin sans achat ni migration DNS : un enregistrement A `relais.explauncheur.space` vers l'IP du VPS chez Vercel DNS (qui accepte les A), plus Caddy pour le certificat automatique. Le domaine de marque est conserve, aucune zone Cloudflare a creer.

**NON MESURE, et c'est le point qui decide :** la joignabilite du VPS depuis l'Algerie. Reseau totalement different, donc a priori favorable, mais aucune preuve. La page de diagnostic devra recevoir une quatrieme sonde vers le VPS.

**Ecarte fermement :** faire passer les octets par Vercel. Sa politique d'usage interdit explicitement de relayer ou d'heberger du media pour du lien direct, et une suspension emporterait tout `expedition-site` — paiement Stripe, comptes, licences. On ne met pas le revenu du site en gage pour une fonctionnalite gratuite.

**Ecarte pour cause de prix :** « subdomain zone » chez Cloudflare = Enterprise seulement ; Partial/CNAME setup = Business, 200 $/mois par zone.

**Aucun fichier touche.** Rien n'est deploye : le VPS heberge ReviewForge, y ajouter du trafic video est une decision a prendre, pas un detail technique.

---
### [2026-07-30 18:30] — Page de diagnostic reseau : trancher a distance au lieu de supposer

**Quoi :** Nouvelle page `/tubeforge/telecharger/diagnostic`. On l'envoie a quelqu'un dont le telechargeur ne marche pas ; elle teste trois adresses depuis SA connexion, conclut elle-meme, et produit un rapport copiable.

**Pourquoi :** Des visiteurs en Algerie voyaient la page se charger mais tout appel au worker echouer. Deux causes possibles, deux reparations OPPOSEES : un filtrage de notre adresse technique (reparable en donnant un nom propre au worker) ou un blocage de tout l'hebergeur (bien plus lourd). Impossible de trancher sans quelqu'un sur place, et « ouvre ces deux liens et dis-moi » ne produit pas une reponse exploitable.

**Le mecanisme qui rend la mesure possible :** un `fetch` en mode `no-cors` **resout** si la requete a atteint le serveur (reponse opaque, illisible, mais existante) et **rejette** avec un TypeError si elle a ete bloquee avant. On peut donc sonder n'importe quel hote tiers sans son autorisation CORS.

**Les trois sondes, et ce qu'elles etablissent :**
| sonde | ce qu'elle prouve |
|---|---|
| notre worker (`188.114.96/97`) | le point de depart : est-ce lui qui casse |
| `cloudflare.com` (`104.16.x`) | l'hebergeur passe-t-il, oui ou non — **c'est la sonde decisive** |
| notre propre site (Vercel) | temoin : il doit forcement passer |

**Verifie en production, LES DEUX BRANCHES :**
- normal → `OK`, trois sondes joignables (142 / 46 / 334 ms).
- worker bloque par simulation → `NOTRE-ADRESSE`, « C'est notre adresse technique qui est filtree, pas l'hebergeur. »

**🐛 TROIS DEFAUTS, tous trouves par l'essai reel, aucun par la relecture :**
1. **Une sonde mal etiquetee.** Le libelle annoncait « le meme nom de domaine » et l'URL pointait ailleurs. Elle mesurait autre chose que ce qu'elle disait.
2. **La CSP faisait echouer les temoins en 0 a 1 ms**, ce que la page lisait comme un blocage par le fournisseur d'acces : elle aurait annonce « ton reseau bloque tout l'hebergeur » a **absolument tout le monde**. ⚠️ **Un refus en une milliseconde ne peut PAS venir du reseau** — c'est la signature d'un refus local, et c'est ce qui a trahi le defaut. `workers.dev` et `cloudflare.com` ajoutes a `connect-src`.
3. **`redirect: "manual"` est interdit en mode `no-cors`** par la specification Fetch : les trois sondes sont passees a « bloque » en 0 ms, y compris notre worker qui fonctionnait. Meme famille de verrou que les reponses opaques. Consequence acceptee : **on ne peut pas sonder un hote qui repond par une redirection**, donc le temoin sur `workers.dev` (qui redirige) a ete SUPPRIME au lieu d'etre bricole.
4. **Une cle de sonde renommee mais pas sa lecture** : `autre` valait toujours `undefined` et le verdict tombait dans la mauvaise branche. Un diagnostic faux, sans le moindre plantage pour le signaler.

**Simplification assumee :** trois sondes au lieu de quatre. La question a trancher est unique — l'hebergeur passe-t-il ? — et une sonde de plus n'ajoutait que des modes de panne.

**Fichiers touches :**
- `src/app/tubeforge/telecharger/diagnostic/page.tsx` — nouvelle page, entierement cote navigateur (aucune route serveur : le site est deja a 12 fonctions, le plafond du plan).
- `next.config.ts` — `connect-src` accepte les deux temoins.

**Comment annuler :** supprimer le dossier `diagnostic/` et retirer les deux hotes de `connect-src`.

**Effets de bord possibles :** la page est publique et non liee depuis le site. Elle n'expose que des temps de reponse vers des hotes publics, aucune donnee de l'utilisateur.

---
### [2026-07-30 17:45] — Mesurer combien de visiteurs n'arrivent pas a joindre le worker

**Quoi :** Chaque visite pose un marqueur Clarity `webdl_worker` = `joignable` | `injoignable` | `erreur`.

**Pourquoi :** Question posee — « ca posera probleme a beaucoup de monde ou a certains ? ». Je n'en sais rien, et une estimation ne vaut rien face a une mesure. Clarity est deja installe sur le site et fournit la repartition par PAYS : le taux et sa geographie seront lisibles en quelques jours.

**Pourquoi Clarity et pas une route a nous :** deux raisons. Le site est deja a **12 fonctions serverless**, soit le plafond du plan Vercel. Et surtout une route a nous ne dirait rien du pays, alors que c'est precisement la dimension qui compte ici — le blocage se concentre par reseau et par pays, il n'est pas reparti au hasard.

**Trois valeurs et pas deux :** `injoignable` (requete bloquee avant d'atteindre le serveur — filtrage reseau) est distingue de `erreur` (le serveur a repondu quelque chose de faux — panne de notre cote). Les confondre rendrait la mesure inutile, puisque les deux appellent des reparations opposees.

**Verifie en production, LES DEUX BRANCHES :**
- normal → `set webdl_worker joignable`
- avec un filtrage simule sur `workers.dev` → `set webdl_worker injoignable`, et l'ecran « Le telechargeur est injoignable » s'affiche.

⚠️ **Le premier essai n'avait rien capte, et c'etait mon instrument :** le script de Clarity se charge en differe et **remplace** `window.clarity`, ce qui effacait mon espion. Il a fallu intercepter l'AFFECTATION (`Object.defineProperty` avec un setter) pour voir les appels. Verification prealable indispensable : la chaine `webdl_worker` est bien presente dans le bundle livre (chunk `5b1b8ee6ca5d0be8.js`). **Une mesure qui ne se declenche pas est pire que pas de mesure — on lirait l'absence de pannes comme une absence de probleme.**

**Fichiers touches :**
- `src/app/tubeforge/telecharger/page.tsx` — `marquerEtat()`, appele dans les deux issues de `refreshMe`.

**Effets de bord possibles :**
Le marqueur est pose deux fois par visite (l'effet de montage s'execute deux fois). Sans consequence : `clarity('set', ...)` ecrase la valeur, elle est identique. Clarity est lui-meme bloque par certains bloqueurs de publicite — les visiteurs concernes seront donc absents de la mesure, ce qui la rend probablement OPTIMISTE. A garder en tete en lisant le taux.

---
### [2026-07-30 17:10] — « Impossible de verifier ton acces » accusait l'utilisateur d'un probleme de reseau

**Quoi :** L'ecran d'echec de `/api/me` nomme desormais la cause reelle et affiche l'hote concerne. « Impossible de verifier ton acces » devient « Le telechargeur est injoignable ».

**Pourquoi :** Signalement de visiteurs en ALGERIE : la page se charge (puces des plateformes visibles, squelette affiche) mais l'appel au worker echoue. Le mot « acces » designe des DROITS : il envoyait chercher un probleme de compte, alors qu'il s'agit d'un domaine injoignable. Et « verifie ta connexion » accusait l'utilisateur d'une connexion qui fonctionne — la page vient de se charger par cette meme connexion.

**Ce que le diagnostic reseau etablit deja :**
- `tubeforge.explauncheur.space` → **64.29.17.x, Vercel** → joignable depuis l'Algerie (la page s'affiche).
- `tubeforge-webdl.expedition-studio.workers.dev` → **188.114.96.5 / 188.114.97.5, CLOUDFLARENET-EU** → c'est cet appel qui echoue.
- Rapports publics concordants : des IP Cloudflare injoignables depuis Ooredoo et Djezzy.
- ⚠️ **Aucun des deux domaines n'est chez Cloudflare** : `explauncheur.space` est sur `ns*.vercel-dns.com`, `expeditionlauncher.store` chez IONOS. Donner un domaine propre au worker exigerait de deplacer les serveurs de noms d'une zone entiere.

**Ce qui reste a trancher, et que le nouvel ecran permet :** un blocage par NOM (`workers.dev` est massivement sur liste noire, c'est un vecteur de hameconnage connu) se repare par un domaine propre. Un blocage par IP de Cloudflare ne se repare pas comme ca. Le detail technique affiche donne de quoi le savoir depuis une seule capture d'ecran sur place.

**Fichiers touches :**
- `src/lib/webdl.ts` — classe `EchecReseau` portant un `detail` affichable ; `hoteWorker()` ; messages distinguant delai depasse et requete bloquee avant d'atteindre le serveur.
- `src/app/tubeforge/telecharger/page.tsx` — etat `causeEchec` ; l'ecran affiche le message reel et le detail technique en petit.

**Verifie en production en SIMULANT la panne** (script injecte avant le chargement, rejetant tout appel vers `workers.dev`) : « Le telechargeur est injoignable. » + « requete bloquee avant d'atteindre tubeforge-webdl.expedition-studio.workers.dev (TypeError) ». L'ancien texte « verifier ton acces » a bien disparu.

**Comment annuler :** revenir aux deux `throw new Error(...)` dans `api()` et retirer l'etat `causeEchec`.

**Effets de bord possibles :** aucun en fonctionnement normal — cet ecran n'apparait que si `/api/me` echoue.

---
### [2026-07-30 16:20] — Plan PAYANT confirme et active : 20 Go par personne, facture bornee a 5 $

**Quoi :** Bascule `PLAN = "payant"`. Quota par personne 5,6 → **19,6 Go/jour**, reserve du jour 492 Go → **1,75 To**, et le plafond MENSUEL s'active.

**Comment le plan a ete verifie — sans identifiants et sans tableau de bord :**
Le Chrome pilotable n'etait pas connecte a Cloudflare, et saisir un mot de passe est hors de question. J'ai donc mesure une PROPRIETE du plan : le gratuit plafonne a **50 requetes sortantes par invocation**, le payant a 10 000 (documentation, changement de fevrier 2026). Sonde temporaire deployee : **70 sortantes reussies, deux essais sur deux**, aucune rupture. Le gratuit aurait casse a la 51e. Sonde retiree ensuite.

**Etat verifie en production :**
| | valeur |
|---|---|
| plan | `payant` |
| quota par personne | 3 500 u = **19,6 Go/jour** |
| reserve du jour | 320 000 u = **1,75 To/jour** |
| plafond du mois | **9 500 000 u sur les 10 M incluses** |
Compteur mensuel teste sur une resolution reelle : 0 → 16 unites. Page : « 19 Go restants sur 20 ».

**🔒 CE QUE GARANTIT LE PLAFOND MENSUEL :** le forfait inclut 10 M requetes, on borne a 9,5 M. **La facture ne peut pas depasser 5 $** sauf a lever la borne a la main. C'est la seule protection existante, Cloudflare n'en proposant aucune.

**🐛 Defaut que j'ai introduit et corrige dans la meme passe :** en supprimant la sonde par un decoupage d'indices, j'ai coupe trop large et laisse un fragment orphelin (` env, req);`) — le Worker ne compilait plus. **`node --check` est passe quand meme** : il ne voit pas la meme chose qu'esbuild sur un module. C'est le deploiement qui a refuse. **Ne pas se fier a `node --check` seul pour valider une suppression de bloc ; c'est `wrangler deploy` qui tranche.**

**Fichiers touches :**
- `tubeforge-webdl/wrangler.toml` — `PLAN = "payant"`, avec la preuve empirique en commentaire.
- `tubeforge-webdl/src/index.js` — sonde `/api/sonde-plan` ajoutee puis supprimee ; fragment orphelin repare.

**Comment annuler :** `PLAN = "gratuit"` et redeployer. Toutes les bornes redescendent ensemble, le compteur mensuel cesse d'etre lu.

**Effets de bord possibles :**
Les ecritures cle-valeur etant desormais illimitees, le compteur mensuel coute une troisieme ecriture par telechargement sans consequence — ce qui etait justement la raison de ne pas l'activer sur le gratuit. Le plafond journalier (320 000) fois 30 depasse legerement le plafond mensuel : c'est voulu, c'est le mensuel qui doit trancher.

---
### [2026-07-30 15:45] — Les deux plafonds ont ete DECLENCHES pour de vrai

**Quoi :** Verification empirique des deux refus, en production, en abaissant temporairement les bornes.

**Pourquoi :** Les deux branches de refus n'avaient JAMAIS ete executees. Un plafond qu'on n'a pas vu fonctionner n'est pas un plafond, c'est une intention — et sur une question d'argent, l'intention ne suffit pas.

**Protocole :** plafond journalier abaisse a la consommation exacte du jour (864 unites), une resolution tentee. Puis `PLAN = "payant"` avec `MAX_MONTHLY_UNITS = "1"`, deux resolutions tentees. Config restauree et compteur d'essai purge apres.

**Resultats :**
| plafond | statut | motif | message |
|---|---|---|---|
| journalier | **HTTP 429** | `plafond-global` | « Le telechargeur a epuise sa reserve du jour… Elle repart demain matin. » |
| mensuel | **HTTP 429** | `plafond-mensuel` | « …a atteint sa reserve du mois… Elle repart le 1er du mois. » |
Dans les deux cas le compteur et l'argumentaire TubeForge sont joints a la reponse.

Le mensuel a demande DEUX appels pour se declencher, et c'est correct : le premier trouve le compteur a 0, passe, puis debite 16 unites ; le second refuse. Le plafond borne donc le DEPART d'un telechargement, pas son achevement — un telechargement en cours n'est jamais coupe au milieu.

**Etat restaure et verifie :** `plan: gratuit`, perso 80/1000, jour 880/88 000, `mois: null`, resolution HTTP 200 en 1080p. Cle `m:2026-07` (valeur d'essai 16) supprimee.

**⚠️ NUANCE QUI COMPTE, et que je n'avais pas dite clairement : sur le plan gratuit il n'y a AUCUNE facture a proteger.** Cloudflare gratuit ne facture pas de depassement, il COUPE a 100 000 requetes par jour. Le plafond journalier protege donc la DISPONIBILITE du service, pas l'argent. La protection financiere ne devient reelle que le jour de l'abonnement, et c'est a ce moment que le plafond mensuel s'active tout seul via `PLAN = "payant"`.

---
### [2026-07-30 15:10] — Plafond de depense : un seul interrupteur, et un plafond MENSUEL

**Quoi :** Les bornes (jour, mois, quota par personne) viennent desormais d'un `REGIMES` unique cote code, choisi par la variable `PLAN` (`gratuit` | `payant`). Ajout d'un plafond **mensuel** sur le plan payant.

**Pourquoi :** Cloudflare ne propose aucun plafond de facturation. Le notre existait mais uniquement JOURNALIER — or la facturation Cloudflare est mensuelle, donc trente jours pleins pouvaient depasser le forfait sans qu'aucune borne ne s'y oppose. Et les bornes etaient eparpillees en constantes independantes, ce qui est le moyen le plus sur d'en monter une en oubliant les autres.

**🐛 Le piege que j'avais moi-meme cree, et corrige dans la meme passe :** apres avoir ecrit les regimes, `wrangler.toml` contenait encore `DAILY_LIMIT` et `MAX_DAILY_RESOLVES` en dur. Ces variables **ECRASENT** le regime : passer `PLAN` a `payant` n'aurait rien change du tout. Vu dans la sortie du deploiement, pas dans le code. Les surcharges sont maintenant commentees, avec l'avertissement.

**Les deux regimes :**
| | jour | mois | par personne | ecritures cle-valeur |
|---|---|---|---|---|
| gratuit | 88 000 u (492 Go) | aucun | 1 000 u (5,6 Go) | **1 000/jour = le vrai mur** |
| payant | 320 000 u | 9 500 000 u | 3 500 u (~20 Go) | illimitees |

**⚠️ CE QUI BORNE LE PLAN GRATUIT N'EST PAS LA BANDE PASSANTE.** Ce sont les **1 000 ecritures/jour** de la base cle-valeur (documentation Cloudflare, verifie le 30/07). Chaque telechargement en consomme deux — compteur personnel + compteur global — trois si la video n'est pas en cache. Le plafond reel est donc de **330 a 500 telechargements par jour**, bien avant les 1 630 que permettrait le budget de requetes. Sur le plan payant elles deviennent illimitees : **c'est le vrai argument des 5 $, pas le nombre de requetes**, et j'avais donne le mauvais.

**Pas de compteur mensuel sur le plan gratuit, et ce n'est pas un oubli :** il couterait une TROISIEME ecriture par telechargement, donc il ferait BAISSER le plafond reel de 500 a 330. Il protegerait moins qu'il ne coute.

**Garantie apportee par le plafond mensuel :** le forfait payant inclut 10 M requetes ; on borne a 9,5 M. La facture **ne peut pas** depasser 5 $, sauf a lever la borne a la main.

**Fichiers touches :**
- `tubeforge-webdl/src/index.js` — `REGIMES` + `regime(env)` ; `moisCourant()` ; compteur `m:<AAAA-MM>` (TTL 40 jours pour survivre au changement de mois) ; refus `plafond-mensuel` ; `plan` et `mois` exposes sur `/api/me` pour etre observables sans ouvrir le tableau de bord Cloudflare ; suppression des constantes `DEFAULT_DAILY_LIMIT` et `MAX_DAILY_RESOLVES` devenues mortes.
- `tubeforge-webdl/wrangler.toml` — `PLAN = "gratuit"` ; anciennes variables passees en surcharges commentees.

**Verifie en production :** `/api/me` renvoie `plan: "gratuit"`, quota 5,6 Go/jour, reserve 492 Go/jour, `mois: null`.

**Comment passer au payant :** souscrire Workers Paid dans le tableau de bord Cloudflare (Compute → Workers → Plans), puis `PLAN = "payant"` dans `wrangler.toml` et `npx wrangler deploy`. Rien d'autre.

**Comment annuler :** remettre `PLAN = "gratuit"` et redeployer. Le compteur mensuel cesse d'etre lu et ecrit.

---
### [2026-07-30 14:20] — Contrer l'anti-robot : 3,7x moins d'appels a YouTube, et un secours au lieu d'un echec

**Quoi :** Le cache des resolutions suit desormais la duree de vie REELLE des URLs au lieu d'une constante devinee, et une resolution refusee ressort l'entree en cache plutot que d'echouer.

**Pourquoi :** Ce qui declenche le blocage anti-robot de YouTube, c'est le VOLUME d'appels a `/youtubei/v1/player` depuis une meme adresse. On ne peut pas deplacer ces appels chez l'utilisateur (CORS ferme, verifie le 26/07), donc le seul levier est d'en faire moins.

**🔑 MESURE QUI DEBLOQUE TOUT :** une URL googlevideo porte `expire=<horodatage>` et vit **6 heures (21 600 s)**. Le cache expirait au bout de **90 minutes** — une valeur posee a la main. On jetait donc les trois quarts de la validite et on rappelait YouTube quatre fois plus souvent que necessaire.

Le TTL est maintenant calcule depuis `expire`, avec une marge de confort de 30 minutes avant l'expiration (de quoi telecharger 1,8 Go sur une connexion a 1 Mo/s sans que les URLs meurent en route).

**Verifie en production, meme video, trois appels d'affilee :**
- resolution fraiche : **9 937 ms** (ces dix secondes SONT la limite a l'oeuvre sur mon adresse, apres une journee de tests)
- depuis le cache : **449 ms** puis **511 ms**, sans aucun appel a YouTube
- validite restante servie : 5 h 59 → le cache tient encore ~5 h 29
- **3,7x moins d'appels** pour une video redemandee

**SECOURS SUR ECHEC :** quand la resolution est refusee, on ressort l'entree jugee « trop juste » si ses URLs vivent encore plus de 2 minutes, au lieu de rendre une erreur. Echouer alors qu'on a de quoi repondre serait absurde — et c'est exactement le cas qui compte, celui ou YouTube nous bloque.

**🧭 LE FAIT STRUCTUREL QUI RASSURE, et que je croyais defavorable :** la requete sortante d'un Worker part du **centre de donnees le plus proche du VISITEUR** (Anycast a l'entree, unicast a la sortie — documentation Cloudflare). La limite anti-robot n'est donc PAS sur une adresse unique et partagee : il y en a une par region. Un visiteur allemand et un visiteur americain n'usent pas la meme. **Mes propres tests passaient tous par Lisbonne**, ce qui explique que je l'aie grillee a repetition alors qu'un usage reparti ne le ferait pas.

**Fichiers touches :**
- `tubeforge-webdl/src/index.js` — `expirationDesUrls()` lit `expire` dans les URLs ; `MARGE_CONFORT_S = 1800` ; TTL du cache borne entre 5 min et 6 h ; branche de secours sur echec de resolution.

**Comment annuler :** remettre `expirationTtl: 5400` en dur et supprimer la branche `perime`.

**Effets de bord possibles :**
Les entrees ecrites avant ce changement n'ont pas de champ `expire` : elles sont considerees comme non confortables et re-resolues une fois, puis le nouveau regime s'applique. Auto-cicatrisant, aucune purge a faire.

**PAS FAIT, et ca reste le levier suivant :** deux personnes qui collent la MEME video au meme instant declenchent deux resolutions. Un verrou de coalescence les ramenerait a une seule. KV n'etant pas atomique, ce serait imparfait — et au trafic actuel, marginal.

---
### [2026-07-30 13:45] — Le poids de la video en gigaoctets, et ce qu'il reste apres

**Quoi :** La fiche d'une video resolue affiche son poids en Go des qu'il depasse le gigaoctet (« 1.8 Go » au lieu de « 1821 Mo »), suivi de ce que ca laisse du quota du jour : « Il te reste 1.1 Go aujourd'hui. »

**Pourquoi :** Depuis que le quota s'exprime en gigaoctets, la fiche restait en megaoctets. Deux nombres cote a cote dans deux unites differentes, et c'est le lecteur qui fait la conversion. Surtout, le poids seul ne repond pas a la question qu'on se pose vraiment — « est-ce que je peux, et apres ? ».

**Fichiers touches :**
- `src/app/tubeforge/telecharger/page.tsx` — `fmtPoids()` (Go au-dela du gigaoctet, Mo en dessous) ; `octetsResultat` calcule une fois au lieu d'etre duplique ; ligne « il te reste » sous la fiche.

**Verifie en production** sur le Mario de 52 minutes : « Siphano · 52:09 · 1080p · 1.8 Go | Il te reste 1.1 Go aujourd'hui. »

**⚠️ CE QUE CETTE LIGNE REND VISIBLE, et qui est un vrai defaut de conception :** le quota est debite **a la RESOLUTION**, pas au telechargement. Quelqu'un qui regarde trois grosses videos sans en telecharger aucune a perdu sa journee. C'etait negligeable a 25 resolutions par jour ; ca ne l'est plus quand une resolution peut couter 1,8 Go. **A corriger** : debiter au telechargement (ou creer une reservation liberee si le telechargement n'a pas lieu). Non fait ici.

**Comment annuler :** revenir a l'expression inline en `Mo` dans la fiche et supprimer le bloc « il te reste ».

---
### [2026-07-30 13:15] — La reserve du serveur quitte l'ecran (sauf quand elle baisse)

**Quoi :** La jauge « Reserve du serveur — 491 Go restants sur 492 » ne s'affiche plus. Elle est remplacee par une phrase, sans chiffre, et seulement sous 25 % de reserve restante. Le quota personnel devient « Ton quota du jour — 2,9 Go restants sur 5,6 ».

**Pourquoi :** Retour du user, et il est juste : « 491 Go restants sur 492 » est un indicateur d'exploitation. Pose a cote du quota personnel, ca donne l'impression d'un tableau de bord interne laisse ouvert par erreur. Un visiteur qui vient telecharger une video n'a aucun usage de ce nombre.

La raison d'origine de l'afficher tenait pourtant — sans elle, un refus ressemble a une panne alors qu'il s'agit d'une reserve partagee. Mais cette raison ne vaut QU'AU MOMENT OU la reserve baisse. On la garde donc pour ce moment-la, en francais et sans gigaoctets.

**Fichiers touches :**
- `src/app/tubeforge/telecharger/page.tsx` — `Compteurs` : seuil `SEUIL_RESERVE = 0.25` ; la reserve devient une phrase conditionnelle ; libelle du quota personnel passe a « Ton quota du jour » ; la mise en page a deux colonnes (calculee pour deux jauges cote a cote a 320 px) est supprimee plutot que gardee « au cas ou ».

**Verifie en production :** une seule mention de gigaoctets sur la page, « 2.9 Go restants sur 5.6 ». Plus aucune trace de « Reserve du serveur ».
⚠️ **La branche « reserve basse » n'a PAS ete exercee visuellement** : elle demande que le serveur soit reellement sous 25 %, ce que je ne peux pas provoquer. C'est une condition simple, mais elle n'est pas vue.

**Comment annuler :** remettre la seconde `<Jauge>` dans le retour de `Compteurs` et supprimer `SEUIL_RESERVE`.

**Effets de bord possibles :** aucun sur le fonctionnement. Le Worker continue de renvoyer `serveur` dans ses reponses ; c'est l'affichage seul qui change.

---
### [2026-07-30 12:40] — Ecriture sur disque : le plafond de 500 Mo tombe, le 1080p revient

**Quoi :** Le telechargeur n'assemble plus les videos en memoire. Les octets vont directement dans un fichier, et la fusion relit ce fichier a la demande. Le plafond passe de 500 Mo a 4 Go, et le quota est desormais debite au cout reel.

**Pourquoi :** Une video d'une heure sortait en 480p. Pas par choix : le code tenait TROIS copies completes en memoire (piste video + piste audio + fichier assemble), soit un pic mesure a 3,23 fois la taille du fichier. Le plafond de 500 Mo etait la borne de securite de cette architecture, pas une limite de YouTube.

**✅ VALIDE PAR MESURE, en production puis sur preversion :**
| fichier | pic de tas | ancien pic attendu (x3,23) |
|---|---|---|
| 84 Mo (Rick Astley 1080p) | **81 a 86 Mo** | ~272 Mo |
| 275 Mo (Big Buck Bunny 1080p) | **155 Mo** | ~890 Mo |
Fichiers verifies octet par octet : 84 354 223 et 288 320 525 octets, en-tete `ftyp/isom` valide dans les deux cas. 12 s et 39 s bout en bout.

Le cas de la capture d'ecran du user : **Mario Odyssey, 52 minutes — 480p/290 Mo avant, 1080p/1821 Mo apres**, sans degradation. Compare au meme instant depuis le meme cache.

**⚠️ RESIDU HONNETE :** le pic n'est pas CONSTANT, il croit encore un peu (70 Mo de surcout a 84 Mo de fichier, 140 Mo a 275 Mo). Ce n'est plus proportionnel a la TAILLE mais probablement au NOMBRE DE PAQUETS, donc a la duree — mediabunny tient un index. L'extrapolation a 1,8 Go **n'est pas mesuree** : je n'ai pas teste le Mario en telechargement complet.

**Fichiers touches :**
- `src/lib/webdl.ts` — `disqueUtilisable()` sonde la capacite (ecrit un octet, le supprime) plutot que de renifler le navigateur ; `fetchTranches` separe le tranchage de la DESTINATION (memoire ou disque) pour que la logique de reprise n'existe qu'une fois ; `muxVersFlux` lit par `BlobSource` et ecrit par `StreamTarget` ; `ouvrirDestination` utilise le selecteur de fichier quand il existe, sinon un brouillon remis a la fin ; `telechargerSurDisque` orchestre et nettoie.
- `tubeforge-webdl/src/index.js` — `disque=1` fait passer le plafond a 4 Go ; quota debite en UNITES DE RELAIS (`unitesPour`) ; **le cache garde desormais les formats BRUTS** ; garde-fou contre une entree de cache a l'ancienne forme.
- `tubeforge-webdl/wrangler.toml` — `DAILY_LIMIT` 25 → 1000 unites (~5,6 Go/jour) ; `MAX_DAILY_RESOLVES` 1200 → 88 000 unites.
- `src/app/tubeforge/telecharger/page.tsx` — compteurs en gigaoctets.

**🐛 CINQ DEFAUTS TROUVES PAR LE TEST REEL, aucun par la relecture :**
1. **« Cannot close a locked stream »** — mediabunny ferme lui-meme le flux de sortie (verifie dans `target.js` : `finalize()` appelle `streamWriter.close()` et ne relache jamais le verrou). Ma fermeture supplementaire echouait, et le fichier n'etait jamais remis. → `finaliser(dejaFerme)`.
2. **Tranches de 16 Mo : quatre minutes de barre figee, puis echec.** googlevideo bride CHAQUE connexion a ~0,7 Mo/s, donc une tranche de 16 Mo demande ~23 s contre 9 s pour 6 Mo — et l'echeance de 60 s n'avait pas bouge. Mesure appariee : 1 Mo de la piste audio arrive en 1,5 s, 16 Mo n'arrivent jamais. **REVENU A 6 Mo**, et l'echeance est desormais CALCULEE depuis la taille (`delaiTranche`) pour que la desynchronisation ne puisse plus se reproduire.
3. **Cache empoisonne** — la cle ne contenait que l'identifiant de la video, et la valeur contenait la qualite DEJA CHOISIE. Le premier visiteur figeait son budget pour tous pendant 90 minutes : un telephone condamnait les ordinateurs au 480p. Invisible tant que tout le monde avait le meme budget.
4. **Unite de facturation desynchronisee** — `OCTETS_PAR_UNITE` valait 16 Mo apres le retour a 6 Mo : le compteur aurait sous-estime le cout de 2,67x, donc le plafond dur de Cloudflare serait tombe AVANT notre garde-fou.
5. **Course sur le fichier de sortie** — nom fixe + suppression differee de 5 min : deux telechargements rapproches et le minuteur du premier supprimait le fichier du second en cours d'ecriture. → noms uniques + balayage des residus au demarrage.

**Comment annuler :**
Le chemin memoire est intact et sert de repli. Pour revenir dessus partout, faire retourner `false` a `disqueUtilisable()` dans `src/lib/webdl.ts` et redeployer le site — le Worker suit tout seul (sans `disque=1`, le plafond reste a 500 Mo). Pour le quota, remettre `DAILY_LIMIT = "25"` et `MAX_DAILY_RESOLVES = "1200"` dans `wrangler.toml` **et** `OCTETS_PAR_UNITE` sans effet (le debit redeviendrait faux) — plus simple : remettre `unites` a 1 dans `/api/resolve`.

**Effets de bord possibles :**
Des fichiers temporaires de la taille de la video apparaissent dans le stockage du navigateur pendant un telechargement. Ils sont supprimes en fin de course ET balayes au demarrage du suivant. Sur Safari, la capacite d'ecriture n'a PAS ete verifiee : la sonde la detectera et le repli memoire s'appliquera. Le selecteur de fichier (Chrome, Edge) n'a pas ete teste automatiquement — il ouvre une fenetre native impossible a piloter ; c'est le seul chemin qui reste a valider a la main.

---
### [2026-07-30 09:40] — Recousage cote Worker : possible sur le plan GRATUIT, mais 3x plus lent

**Quoi :** Verification demandee d'une affirmation que j'avais faite sans la mesurer — « l'architecture compte plus que l'argent : gratuit avec recousage (12 000 tel./jour) ecrase payant sans toucher au code (1 260/jour) ». Route de mesure temporaire deployee sur le worker de production, puis retiree.

**Pourquoi :** L'affirmation reposait sur une hypothese non testee. Le plan gratuit n'accorde que **10 ms de CPU par invocation**. La documentation Cloudflare garantit que RENVOYER un flux tel quel ne coute pas de CPU, mais pas que le RECOUDRE soit gratuit, et un rapport de la communaute signale l'inverse. Si recoudre coutait du CPU proportionnel aux octets, le plan gratuit ne pouvait pas le faire du tout et ma conclusion s'inversait.

**✅ CE QUI EST PROUVE : le plan gratuit sait recoudre.**
20 sous-requetes de 12 Mo lancees en parallele (fenetre glissante de 4) et recousues en un seul flux sortant via `IdentityTransformStream` : **251 658 240 octets recus, exactement le compte annonce, HTTP 200, aucun depassement CPU**. `IdentityTransformStream` et `FixedLengthStream` sont tous deux presents dans le runtime. Le `pipeTo` natif sequentiel ne fait pas passer les octets par du JavaScript, et c'est ce qui sauve le budget CPU.

Regles Cloudflare confirmees dans la documentation : les **sous-requetes ne sont pas facturees** et ne comptent pas dans les 100 000/jour du plan gratuit (seules les requetes ENTRANTES comptent) ; 50 sous-requetes externes par invocation sur le gratuit, 10 000 sur le payant depuis fevrier 2026 ; aucune limite de taille de reponse ni de duree tant que le client reste connecte.

**⚠️ CE QUE JE N'AVAIS PAS MESURE, ET QUI CORRIGE MON AFFIRMATION : c'est plus lent.**
Mesures appariees, meme video, meme connexion, 240 Mo a chaque fois :
| dispositif | debit |
|---|---|
| recousage, 1 connexion cliente, fenetre interne 4 | 2,05 Mo/s |
| recousage, 1 connexion cliente, fenetre interne 8 | 2,69 Mo/s |
| 4 recousages en parallele | 3,87 Mo/s agrege |
| 20 tranches de 12 Mo, 6 connexions clientes (l'actuel) | **8,00 Mo/s** |

Le goulot n'est PAS googlevideo : c'est la connexion cliente unique.

**🧠 LE PRINCIPE QUE J'AVAIS CONFONDU :** le **debit** vient du NOMBRE de connexions clientes ; l'**economie de requetes** vient de la TAILLE des tranches. Deux reglages independants. Je vendais le recousage comme s'il faisait les deux metiers, alors qu'il n'ameliore que le second et degrade le premier.

**Fichiers touches :**
- `tubeforge-webdl/src/index.js` — route `/api/test-recousage` ajoutee puis **entierement supprimee** (corps du code retire, pas neutralise par `if (false)`). Ne reste qu'un bloc de commentaire portant les mesures, au-dessus de la section OAuth.

**Verifie apres nettoyage :** `/api/test-recousage` renvoie « Route inconnue » sur 8 requetes fraiches consecutives ; `/health` et `/api/me` repondent normalement. ⚠️ Les 3 premieres verifications donnaient de faux positifs — une reponse mise en cache a l'edge, puis des points de presence encore sur l'ancienne version. **Toujours busted le cache avec un parametre aleatoire ET repeter, avant d'affirmer qu'une route est retiree.**

**Conclusion pratique, inchangee sur le fond :** le gain sur lequel batir reste l'ecriture sur disque + des tranches plus grandes + les 6 connexions paralleles conservees. Le recousage devient une option **prouvee possible** mais pas prouvee a debit egal : il exigerait plusieurs flux recousus en parallele, et je n'ai teste que 4 flux courts.

**Comment annuler :** rien a annuler, l'etat deploye est identique a celui d'avant la mesure (version 820f9e61). Pour rejouer l'experience, le code de la route est dans l'historique de cette entree.

**Effets de bord possibles :** aucun sur la production. La mesure a consomme ~750 Mo d'egress googlevideo et 3 unites de quota.

---
### [2026-07-28 13:05] — Porte Discord mise de cote : on telecharge sans se connecter

**Quoi :** Le telechargeur s'affiche directement. Plus d'etape de connexion, plus de verification d'appartenance au serveur : on arrive, on colle un lien, on recupere le fichier.

**Pourquoi :** Demande explicite. La porte coutait deux allers-retours (rejoindre le serveur, autoriser Discord) avant le premier telechargement, sur un outil qui sert justement de produit d'appel — l'obstacle etait place avant la demonstration de valeur, pas apres.

**RIEN N'A ETE SUPPRIME.** Les routes `/auth/start` et `/auth/callback`, la verification d'appartenance, la carte de confiance, le bouton : tout reste cable et fonctionnel. Une seule variable decide, et elle est prevue pour ca depuis le depart (`gateActive`).

**Fichiers touches :**
- `tubeforge-webdl/wrangler.toml` — `REQUIRE_DISCORD` passe de `"true"` a `"false"`. Le commentaire dit desormais la consequence sur le quota.
- `tubeforge-webdl/src/index.js` — message du plafond global : « Les membres du Discord ont epuise le quota » nommait un groupe auquel le visiteur n'appartient plus. Devenu « Le telechargeur a epuise sa reserve ».
- `src/app/tubeforge/telecharger/layout.tsx` — la description de recherche promettait « Outil gratuit pour les membres du Discord Expedition », devenu faux. Remplace par « Gratuit, sans compte et sans installation ».
- `src/app/tubeforge/telecharger/page.tsx` — meme correction sur le repli « quota partage » (`epuise`).

**Aucun changement de logique cote page :** elle lisait deja `me.gate` et savait afficher les deux etats. C'est ce qui rend l'aller-retour gratuit.

**⚠️ CE QUI CHANGE VRAIMENT, ET QU'IL FAUT SAVOIR — le quota ne suit plus un compte.**
`quotaSubject` bascule sur `CF-Connecting-IP` : 25 telechargements par ADRESSE IP et par jour. Une IP partagee (fac, entreprise, operateur mobile en CGNAT) compte donc pour une seule personne, et un utilisateur seul peut se donner un quota neuf en changeant de reseau. C'est assume : le garde-fou de la FACTURE n'a jamais ete le quota individuel mais `MAX_DAILY_RESOLVES` (1200/jour), qui lui ne bouge pas et reste sous le plafond dur de 100 000 requetes/jour du plan gratuit Cloudflare.

Consequence secondaire : `/api/resolve` n'est plus protege que par `originAllowed`, qui lit un en-tete Origin — falsifiable en une ligne de commande. Ce n'etait deja qu'un garde-barriere, pas une securite ; il le reste, simplement il est maintenant seul.

**Verifie en production, sans aucun jeton :**
- `/api/me` renvoie `gate: false`.
- Resolution en ligne de commande : 1080p, 245,7 Mo de video + 29,3 Mo d'audio, client `android_vr`, non degradee.
- Dans un vrai navigateur sur `tubeforge.explauncheur.space` : le champ de saisie est present au chargement, zero mention de Discord dans le DOM, un lien colle donne « Big Buck Bunny — 1080p — 275 Mo » et le bouton « Telecharger en 1080p ».
- Relais d'octets depuis l'origine du site : **HTTP 206, 1 048 576 octets exactement, `video/mp4`, 902 ms**, `localStorage` vide de tout jeton.

**Non conclu volontairement :** une premiere video (`jNQXAC9IVRw`) a ete refusee pour motif anti-robot pendant ces essais, alors qu'une autre passait deux minutes plus tot depuis le meme worker. C'est la fragilite YouTube connue, sans rapport avec la porte, et un seul essai ne suffit pas a en dire quoi que ce soit — cf. [[webdl-googlevideo-refuse-cloudflare]].

**Comment annuler :**
Remettre `REQUIRE_DISCORD = "true"` dans `tubeforge-webdl/wrangler.toml`, puis `npx wrangler deploy`. La porte se referme au premier `/api/me` suivant, sans toucher au site. Les quatre corrections de formulation ci-dessus peuvent rester : elles sont vraies dans les deux etats.

**Effets de bord possibles :**
Le trafic peut monter, puisqu'il n'y a plus rien a franchir. Surveiller `serveur.used` sur `/api/me` : s'il approche 1200 en journee, c'est le plan Cloudflare payant qui se pose (et alors `MAX_DAILY_RESOLVES` monte a ~4385). Le canari, lui, ne depend pas de la porte.

---
### [2026-07-28 11:20] — Redondance des extracteurs : une seule des trois plateformes gagne un vrai secours

**Quoi :** Question posee — « si un extracteur tombe, on a des solutions ? ». Reponse mesuree, par une construction et une refutation systematiques sur les quatre plateformes.

**🚨 LE CONSTAT LE PLUS IMPORTANT : la redondance YouTube est COSMETIQUE.**
Les trois clients de la chaine (ANDROID_VR, ANDROID, IOS) tapent tous le **meme** point d'entree `/youtubei/v1/player`. Ce ne sont pas trois voies, ce sont **cinq facades du meme endpoint**. Recherche d'une voie qui n'en depende pas : **7 videos x 7 voies = 49 tentatives, ZERO octet servi**. Ont ete essayes et ont echoue : la page `watch` et son `ytInitialPlayerResponse`, `get_video_info`, la page `/embed/<id>`, `/youtubei/v1/next`. **Le jour ou ce point d'entree change de forme, YouTube tombe entierement et il n'y a rien derriere.** C'est le risque numero un du telechargeur, et il etait invisible parce que « trois clients » donnait une fausse impression de solidite.

**✅ TIKTOK gagne une vraie seconde voie — la seule validee, et elle est deployee.**
Elle lit une **application differente** de TikTok : celle qui sert les integrations (`/embed/v2/<id>`), dont l'etat s'appelle `__FRONTITY_CONNECT_STATE__` et non `__UNIVERSAL_DATA_FOR_REHYDRATION__`, avec un autre CDN, un autre identifiant d'application et un autre modele d'authentification.

Verifie par un agent adverse sur un jeu de test entierement different : **8 contenus sur 8**, 14 URLs sur 14 servant des octets, **14 sur 14 avec audio decode**. Puis verifie par moi **depuis l'edge Cloudflare** — la porte de ship que les agents avaient signalee, toutes leurs mesures venant d'une IP residentielle : **4 resolutions sur 4** en 400 a 600 ms, et **3 sur 3 servent leurs octets SANS AUCUN COOKIE**. Le secours est donc plus robuste que la voie principale sur ce point precis, puisque celle-ci doit rejouer `ttwid`.

**Portee honnete de cette independance : deux classes de panne sur trois.** Couvertes : changement de schema JSON, durcissement des cookies. **Non couverte** : un blocage a l'edge — les deux routes ressortent par le meme edge Akamai et le meme repartiteur ByteDance, et tomberaient ensemble.

**❌ CE QUI N'A PAS ETE RETENU, et pourquoi :**
- **X / Twitter** — la methode GraphQL avec jeton invite fonctionne (5/5 sur contenus neufs, 28/28 en elargi, audio confirme), mais le code livre porte **3 defauts bloquants**, et surtout l'independance est **partielle** : la livraison reste strictement commune (`video.twimg.com` est l'unique CDN video de X) et `api.x.com` / `api.twitter.com` partagent les memes IP et **le meme compteur de quota**. La « double facade » annoncee n'existe pas.
- **Twitch, clips** — la voie proposee rappelle `gql.twitch.tv` pour la signature, et le jeton contient deja `clip_uri` : la page SSR n'apporte aucune information. Gain nul, et deux modes de panne en plus.
- **Twitch, VOD** — c'est une **fonctionnalite neuve**, pas une redondance (la methode actuelle refuse les VOD par construction). Mais 3 succes sur 6 en refutation, et **1 sur 7 sur les VOD de moins de 48 h** : le porteur unique est la miniature `og:image`, qui se desynchronise du media pendant deux jours. Six defauts bloquants. Pas mur.

**Fichiers touches :**
- (hors repo) `tubeforge-webdl/src/tiktok_embed.js` (nouveau) — seconde voie, avec sonde `Range: bytes=0-0` pour connaitre la taille reelle, classification des pannes pour le canari, et delai maximal
- (hors repo) `tubeforge-webdl/src/index.js` — la branche TikTok essaie la voie principale puis le secours ; le secours ne remplace que s'il fait mieux, sinon on garde le message d'origine, plus precis sur la cause

**Non-regression verifiee** avant deploiement : YouTube 1080p, TikTok, X, Twitch — **4 sur 4**.

**Comment annuler :** retirer l'import et remettre `await resolveTikTok(target)` seul. Le fichier `tiktok_embed.js` peut rester, il est inerte sans son appel.

**Effets de bord possibles :** un echec TikTok coute desormais un aller-retour de plus avant de rendre la main. C'est l'echange voulu. Et le message d'erreur reste celui de la voie principale quand les deux echouent — volontaire, il est plus precis sur la cause.

**Au moment du deploiement, le canari rapporte YouTube KO (LOGIN_REQUIRED).** C'est ma propre limite de debit, declenchee par les tests de la journee : le meme worker resolvait du 1080p deux minutes plus tot. **Je le note sans en conclure quoi que ce soit** — c'est exactement l'erreur commise hier, ou treize refus d'affilee m'avaient fait annoncer a tort que googlevideo bloquait Cloudflare.

---
### [2026-07-28 09:40] — La qualite s'adapte a la memoire de la machine du visiteur

**Quoi :** Un telechargement 1080p de 441 Mo fait monter le tas JavaScript a **1 425 Mo**, soit **3,23 fois la taille du fichier** — le navigateur tient en meme temps la piste video, la piste audio et le fichier assemble. Sur un poste de bureau le plafond est de 4 Go, donc invisible. Sur un telephone il tourne autour du gigaoctet : l'onglet meurt, sans message, apres plusieurs minutes d'attente.

**C'est exactement le type de panne qu'on ne voit jamais en testant sur sa propre machine**, et la question posee etait « assure-toi que ca marchera chez les autres ».

**Mesures :** video 1080p de 441 Mo, 42 s de bout en bout, pic de tas 1 425 Mo, retour a 22 Mo apres (la memoire est bien liberee), fichier de 461 940 707 octets avec boite `ftyp`/`isom` valide.

**Le correctif.** La page calcule un budget d'octets a partir de ce qu'elle peut reellement mesurer, et le transmet au Worker qui choisit la qualite en consequence :
- `performance.memory.jsHeapSizeLimit` quand il existe (Chromium) — la mesure la plus fiable ;
- sinon `navigator.deviceMemory`, dont on ne prend qu'un quart : le reste de l'appareil vit aussi ;
- sinon, ni Firefox ni Safari n'exposant quoi que ce soit, on se rabat sur l'agent utilisateur, et **dans le doute on choisit le budget le plus bas**.

Le Worker borne la valeur recue entre 50 et 500 Mo : c'est un parametre d'URL, donc il ne merite aucune confiance — trop bas il refuserait tout, trop haut il ferait mourir l'onglet. Un client ancien qui n'envoie rien garde l'ancien comportement.

**Verifie en simulant trois machines :**

| budget declare | qualite servie |
|---|---|
| 500 Mo (poste de bureau) | 1080p, 441 Mo |
| 150 Mo (portable modeste) | 720p, 105 Mo, degrade |
| 80 Mo (telephone) | 480p, 67 Mo, degrade |
| aucun (client ancien) | 1080p, 441 Mo |

Le message honnete existait deja et devient enfin exact sur mobile : « Qualite reduite volontairement : en pleine resolution, cette video depasserait ce qu'un navigateur peut assembler en memoire. »

**Fichiers touches :**
- `src/lib/webdl.ts` — `budgetOctets()` et transmission du parametre `max` a la resolution
- (hors repo) `tubeforge-webdl/src/index.js` — le budget client borne entre dans le calcul de `pickPair`

**Comment annuler :** `git revert` cote site suffit — sans le parametre `max`, le Worker retombe sur l'ancien comportement.

**Effets de bord possibles :** un visiteur sur telephone recevra du 480p la ou il voyait « 1080p » avant — mais avant, il ne recevait rien du tout, l'onglet mourait. Le ratio de 3,23 est mesure sur un seul fichier et sur Chromium ; il peut differer ailleurs, d'ou la marge a 3,5.

---
### [2026-07-27 19:30] — Le 1080p fonctionne. Ma conclusion inverse etait fausse.

**Quoi :** J'ai annonce cet apres-midi que googlevideo refusait les octets a toute IP de datacenter, et donc que le 1080p etait impossible sans un relais residentiel a 1 320 $/mois. **C'etait faux.** Remesure le soir meme, a froid : le relais fonctionne, le 1080p aussi.

**Les mesures qui corrigent :**
- Worker Cloudflare vers googlevideo : **6 essais sur 6 en HTTP 206**, 500 001 octets chacun, 244 a 1 182 ms.
- **Chemin de production complet** (le Worker resout ET relaie) : **9 tranches sur 9**, dont une lue a 424 Mo d'offset sur une video 1080p de 427 Mo.
- **Bout en bout dans un vrai navigateur** : fichier de **84 354 215 octets**, `video/mp4`, boite `ftyp`/`isom` valide, image et son fusionnes, mention « Fichier enregistre », aucune erreur.

**La cause de l'erreur.** J'avais passe la journee a marteler YouTube depuis le meme Worker — dizaines de resolutions, canari, plus une mauvaise idee qui ajoutait deux clients par video et doublait les appels. L'IP de sortie etait grillee. **Une mesure repetee treize fois d'affilee sur une ressource partagee ne mesure plus la ressource : elle mesure l'effet de la mesure.**

Deux signaux auraient du m'arreter, et je les ai ignores : la memoire projet du 26/07 disait « googlevideo vers Cloudflare = 22 a 63 Mo/s, verifie », et un telechargement de 441 Mo avait abouti par ce meme relais le matin meme. J'ai conclu l'inverse sans jamais expliquer pourquoi la mesure de la veille aurait ete fausse. **Quand une nouvelle mesure contredit une mesure anterieure documentee, la charge de la preuve est sur la NOUVELLE.**

Ce sont les agents d'une enquete parallele qui ont trouve la contradiction, en mesurant 3 tranches sur 3 en 206 depuis un edge Cloudflare pendant que j'affirmais l'inverse.

**Fichiers touches :**
- `src/app/tubeforge/telecharger/page.tsx` — le 1080p (relais + fusion) redevient le chemin principal ; le lien direct 360p passe en secours (`result.lienDirect && !result.video`), et son commentaire porte desormais le recit de l'erreur pour qu'on ne la refasse pas.

**Ce qui reste vrai du dossier de cet apres-midi :**
- googlevideo n'accorde CORS qu'aux origines youtube.com : le relais reste **obligatoire** pour YouTube — mais il fonctionne.
- Le VPS Hetzner de ReviewForge est refuse **des la resolution** (LOGIN_REQUIRED x9). Ne rien y demenager.
- Le lien direct 360p (`&title=` -> `content-disposition: attachment` sur les URLs sans `gir`) reste en place comme secours.
- L'enquete concurrentielle tient : SaveFrom sert du 360p en lien direct et des pistes 1080p **muettes** (classe CSS `no-audio`), y2mate.gs ne fait que du 360p, yt5s ment depuis 20 mois, cobalt a **retire YouTube**, y2mate.com et yt1s.com ont ete saisis (Cour federale du Canada, juin 2026). **Notre 1080p sonore et gratuit est au-dessus de tout ce que fait le marche.**

**Comment annuler :** `git revert`. Ne pas revenir a la version qui privilegie le 360p : elle repose sur une mesure fausse.

**Effets de bord possibles :** le relais consomme des requetes Worker (~76 pour une video de 441 Mo). Le plafond `MAX_DAILY_RESOLVES = 1200` calibre pour le plan gratuit reste donc necessaire et correctement dimensionne.

**Piege de dispositif, huitieme de la journee :** un `cd` reste dans le dossier du worker a fait deployer le mauvais projet sur Vercel, et l'alias `tubeforge.explauncheur.space` a pointe sur le worker pendant une minute. Repare immediatement. **Toujours verifier `pwd` avant un deploiement.**

---
### [2026-07-27 17:00] — 1080p automatique dans le navigateur : recherche exhaustive, resultat negatif

**Quoi :** Exploration systematique (4 balayages paralleles + refutation adversariale de chaque piste positive, 8 agents, 207 appels d'outils) pour trouver un chemin vers le 1080p automatique depuis le navigateur, sans relais et sans cout au gigaoctet. **Aucun n'existe.** Le document sert a ne JAMAIS refaire ces tests.

**⛔ TUE PAR LA MESURE — ne jamais re-tester :**
- **Format fusionne (image+son) au-dela de 360p** : 0 sur 46 points de mesure (23 clients x 2 videos). Aucun itag 22/37/59/78 nulle part. L'itag 18 (360p) est le plafond absolu.
- **URL 1080p sans `gir=yes`** : 0 sur 50 formats inventories ; 22 formats adaptatifs sur 22, provenant de 10 videos, portent `gir=yes`.
- **`gir` depend de la VIDEO, pas du client** : identique entre ANDROID et ANDROID_VR sur une meme video, different entre videos. Changer de client ne sert a rien.
- **Retirer / vider / contredire / doubler `gir`** : 403. Il est dans `sparams`, donc signe. Idem `clen`, `mime`, `rqh`, `itag`.
- **45 variantes de parametres et d'en-tetes** pour arracher un `content-disposition` sur une URL `gir=yes` (`filename`, `response-content-disposition`, `dl=1`, `download=1`, `range`, `rn`, `rbuf`, `cpn`, `ump`, `pot`, `sq`, `keepalive`, `ratebypass`, Sec-Fetch-* simules, `Accept: octet-stream`…) : **zero**.
- **Reecriture d'hote vers `www.youtube.com/videoplayback`** : sert bien les octets (6/6) mais comportement strictement identique. Gain 0/6, et 0/4 sur les itag 137. Ajoute des redirections pour rien.
- **Suivre les 302 a la main pour « laver » gir** : recopie a chaque saut, 6 sauts, aucun effet.
- **`alr=yes`** : renvoie l'URL en texte brut, mais toujours aucun en-tete CORS.
- **`dashManifestUrl`** : jamais present, sur 11 videos x 12 clients.
- **Service Worker + reponse opaque** : ferme par la specification, DOUBLE verrou. (1) `respondWith` interdit une reponse opaque quand le mode n'est pas `no-cors`, or une navigation est en mode `navigate`. (2) Meme sans (1), une reponse opaque a **`body` null** : il n'y a aucun octet a ecrire. Meme impasse pour StreamSaver.js et `showSaveFilePicker()`.
- **`<a download>` cross-origin** : ignore depuis Chrome 65. Le `content-disposition` cote serveur est le SEUL levier — et notre production est deja dessus.
- **PoToken / attestation BotGuard comme cle du manifeste HLS** : hypothese la plus serieuse du dossier, testee avec un vrai jeton frappe dans le navigateur (220 caracteres, 1,7 s). Resultat : **HLS present 0 fois sur 8 AVEC attestation, 0 sur 9 sans**. Le jeton ne change rien. Piste morte.
- **Cobalt.tools (etat de l'art)** : relaie les octets par ses propres serveurs (`itunnel`). S'il existait une voie navigateur-sans-relais, il l'utiliserait.

**✅ CE QUI MARCHE, ET C'EST TOUT :** le 360p fusionne en un clic, via `&title=` qui declenche `content-disposition: attachment`. **Tient sur ~70 % des videos** (7/10 mesure) : celles dont l'URL ne porte pas `gir`. Le lien `gir=yes` -> pas d'attachment est confirme sur **34 URLs sur 34**.

**Predicteur sans requete HTTP :** `gir=yes` ⇔ `clen` dans l'URL ⇔ `contentLength` present dans `streamingData.formats[itag 18]`. Notre code detecte deja `gir` dans l'URL — meme resultat, zero appel supplementaire. L'hypothese « ce sont les videos longues » a ete **refutee** : kJQP7kiw5Fk (282 s) porte gir, aqz-KE-bpKQ (635 s) non.

**Une piste 1080p reelle mais inexploitable :** le parametre `govp/slices` des segments HLS n'est pas signe ; etendu a `0-(clen-1)`, il ramene la piste video 1080p entiere en une requete, en `application/octet-stream` + `nosniff` (donc enregistree, pas lue). Verifie de bout en bout : 83 210 680 octets, ffmpeg confirme 213 s, h264 High 1920x1080, zero erreur de decodage, fusion locale valide. **Mais il exige un `hlsManifestUrl`, present sur 1 video sur 27** — et l'attestation ne le debloque pas (mesure ci-dessus). Sans generalite, ce n'est pas un produit.

**Arithmetique du relais residentiel**, pour 100 videos/jour de 440 Mo (1 320 Go/mois) : DataImpulse 1 320 $, IPRoyal 2 310 $, Decodo 2 904 $, Bright Data 3 960 a 11 088 $. Soit 0,44 a 3,70 $ par telechargement gratuit. **Aucun modele economique.** Le seul levier qui casse cette arithmetique n'est pas le prix du proxy mais le NOMBRE D'OCTETS : ne servir que 30 s (~15 Mo) fait tomber a 45-100 $/mois, un facteur 29.

**Fichiers touches :** aucun. Ce chantier est une mesure, pas un changement.

**Ce qui reste a tester, et c'est tout ce qui reste :** une IP **ISP statique** (ni residentielle ni datacenter, vendue au forfait par IP avec trafic illimite) est-elle acceptee par googlevideo ? ~0,30 $ et vingt minutes. Si oui, le relais 1 320 Go passe de 2 310 $ a environ 40 $/mois. C'est le seul pari qui reste ouvert.

---
### [2026-07-27 15:30] — YouTube : googlevideo refuse les IP de Cloudflare. Diagnostic complet, et ce qui marche vraiment

**Quoi :** Premier parcours COMPLET depuis un vrai navigateur, jusqu'au fichier verifie aux octets. Trois plateformes sur quatre fonctionnent. YouTube est bloque, et la cause est desormais isolee.

**✅ Prouve de bout en bout** (fichier produit, en-tete lu, pas seulement « pas d'erreur ») :
- **X / Twitter** — 20,2 Mo, `video/mp4`
- **Twitch** — 44,4 Mo, boite `ftyp` presente, marque `isom`
- **TikTok** — 11,3 Mo, boite `ftyp` presente, marque `isom`

C'est la premiere fois de la session qu'un telechargement complet est verifie. Jusque-la on ne prouvait que la RESOLUTION, ce qui ne dit rien du telechargement — et c'est precisement la que ca cassait.

**Deux mecanismes valides au passage, par accident :** en testant j'ai epuise le quota de 25, et l'encart « Tu as utilise tes 25 telechargements du jour » plus la proposition TubeForge se sont affiches correctement. Jamais vu en conditions reelles avant.

**❌ YouTube : googlevideo refuse de livrer les octets aux IP de Cloudflare.**

Mesure : **0 succes sur 6** via le relais, contre **206 + fichier complet** depuis une connexion residentielle, avec **la meme URL**. Puis un relevé automatique toutes les 3 minutes pendant 45 minutes : **13 essais, 403 a chaque fois, aucune decroissance**. A comparer au blocage de la RESOLUTION, qui retombait en 9 minutes — ce sont deux phenomenes differents.

**Hypotheses eliminees une par une, par mesure et pas par raisonnement :**
- *User-Agent* — les trois variantes (tronque du relais, complet du client, `curl` brut) donnent 206 depuis chez moi ;
- *en-tete Range* — le relais prend 403 avec ET sans (`start`/`end` absents), donc ce n'est pas la redirection 302 qui perd le Range ;
- *expiration des URLs* — elles vivent 5,9 h pour un cache de 1,5 h ;
- *visitorData* — un tout neuf ne change rien ;
- *PoToken* — frappe avec succes (220 caracteres, 912 ms) et refuse quand meme.

Il ne reste que l'adresse de sortie.

**🚨 Et la sortie de secours est fermee.** Faire recuperer les octets par le navigateur du visiteur — son IP residentielle, exactement l'avantage de TubeForge — est **impossible** : `googlevideo` n'envoie **aucun en-tete CORS**, meme apres avoir suivi ses redirections (verifie : 302 puis 206, sans jamais d'`access-control-allow-origin`). Le navigateur refuse de lire une reponse sans ces en-tetes. **Le relais n'est donc pas un choix d'architecture, c'est une obligation.** Et l'appel a `youtubei/v1/player` depuis le navigateur est refuse pareil (403, sans en-tete CORS).

**⚠️ Complement du 27/07 15:50 — ce n'est PAS propre a Cloudflare, c'est TOUT DATACENTER.** Sonde temporaire deployee sur Vercel (donc sortie par des IP AWS) et interrogee avec **exactement la meme URL** que les deux autres sorties :

| sortie reseau | resultat |
|---|---|
| connexion residentielle | **206**, 200 001 octets |
| **Vercel (AWS)** | **403**, 0 octet |
| Cloudflare Worker | 403 (13/13 sur 45 min) |

Consequence directe : l'option gratuite « demenager le relais sur Vercel, ou le site est deja heberge » est **morte**. Et comme AWS et Cloudflare sont les deux plages les plus abusees d'Internet, un VPS bon marche (Hetzner, OVH, Scaleway) a des chances d'etre refuse aussi — a verifier avant de s'engager, pas a supposer.

Chiffrage de la seule voie qui marche techniquement, un proxy residentiel (tarifs releves 27/07) : de **1 $/GB** en paiement a l'usage le moins cher a 4-8 $/GB en milieu de gamme. Une video de 15 min en 1080p pese 440 Mo, soit 0,44 GB, donc **~0,44 $ la video au meilleur tarif**. Avec 10 € par mois : **environ 25 videos**. Le quota est de 25 par personne et par JOUR, pour 635 membres. **L'arithmetique ne ferme pas.**

La sonde a ete supprimee apres mesure et son absence verifiee en production (404) : on ne laisse pas derriere soi un relais ouvert, meme restreint aux hotes googlevideo.

**Ce que ca implique**, sans detour : servir YouTube demande une adresse de sortie que YouTube accepte. Le plan gratuit de Cloudflare n'en fournit pas. Les trois autres plateformes sont indifferentes au probleme parce qu'elles autorisent notre origine et sont donc telechargees EN DIRECT par le navigateur.

**Livre au passage, utile quoi qu'il arrive** — le message d'echec de telechargement nomme desormais la piste, la tranche et la position en octets, et distingue une coupure reseau d'un refus :
> « Le telechargement a echoue (**video, tranche 1 sur 1 (octets 0,0–0,4 Mo), code 403**) »

C'est ce message qui a permis de trouver la cause en dix minutes. Avant, il disait « tranche 2 sur 2, code 403 » sans dire quelle piste ni ou, et laissait passer un « Failed to fetch » brut quand la requete n'aboutissait pas du tout.

**Fichiers touches :**
- `src/lib/webdl.ts` — parametre `piste`, detection de la panne reseau distincte du refus, message construit selon ce qui a reellement echoue
- `next.config.ts` — la CSP de developpement passe a un joker de port (`http://127.0.0.1:*`) : deux fois j'ai perdu du temps parce que le worker de test tournait sur un port absent de la liste, et le symptome ressemble a une panne reelle

**Comment annuler :** `git revert`. Ne pas revenir a l'ancien message : il confondait trois causes.

**Effets de bord possibles :** aucun sur le comportement, seulement sur ce qui est dit.

**Deux pieges de dispositif de test, notes pour ne pas les repayer :**
- `tubeforge-webdl/.dev.vars` contient `PUBLIC_ORIGIN="http://127.0.0.1:8803"`, un port mort d'une session ancienne. Les URLs du relais pointaient donc dans le vide et produisaient « Failed to fetch » — j'ai cru a une panne produit. **Toujours passer `--var PUBLIC_ORIGIN:<port courant>` a `wrangler dev`.**
- Remplir un champ React en affectant `.value` ne met PAS l'etat a jour, donc le bouton reste desactive et rien ne part. Il faut le setter natif puis un evenement `input`. J'ai conclu deux fois a tort que « la page ne fait rien ».

---
### [2026-07-27 14:15] — Le canonical pointait sur un 404, et pourquoi le domaine principal ignore /tubeforge

**Quoi :** En cherchant si la page etait atteignable, decouverte de trois choses. Une seule etait un vrai defaut, mais elle rendait la page inindexable.

**🚨 Le canonical designait une URL qui renvoie 404.** Il valait `https://expeditionlauncher.store/tubeforge/telecharger`. Dire a Google « la version de reference est la-bas » quand la-bas est vide, c'est garantir que la page ne soit jamais indexee.

**Pourquoi cette URL est vide — l'explication complete.** Tous les deploiements du projet sont marques **Preview**, aucun n'est Production (consequence directe de la regle « jamais `vercel --prod` »). `expeditionlauncher.store` etant le domaine de PRODUCTION, il sert donc le dernier deploiement Production, anterieur a **toute** la section `/tubeforge` — la page produit y renvoie 404 elle aussi, pas seulement le telechargeur. `tubeforge.explauncheur.space` est un alias manuel repointe a chaque deploiement : c'est la que tout vit.

**Le supprimer ne suffisait pas, et je l'ai verifie apres coup au lieu de le supposer.** Sans declaration, la page herite du canonical du segment parent, soit `.../tubeforge` : elle se declarait alors doublon de la page produit. Un autre mensonge, et vers un 404 lui aussi. Il faut donc le poser EXPLICITEMENT — auto-referent est le defaut sur. Verifie : le canonical servi repond maintenant 200.

**Fausse alerte que je dois consigner.** J'ai d'abord annonce que `expedition.so` servait la page sans aucun correctif du jour, en la presentant comme la decouverte la plus importante de la session. **C'etait faux.** `expedition.so` renvoie 200 sur N'IMPORTE QUEL chemin, avec 114 octets et sans titre : c'est une page parquee, hors Vercel (IP AWS), sans rapport avec le site. J'avais lu un code 200 sans regarder le corps. **Sixieme artefact de mesure de la session, et le seul qui ait produit une alarme injustifiee. Regle : un 200 ne prouve pas qu'une page existe — comparer avec un chemin absurde.**

**Deux manques assumes, pas corriges, qui attendent une decision :**
- la page n'est **au sitemap d'aucun domaine** ;
- **aucun lien du site n'y mene** (verifie : zero occurrence hors du dossier de la page).

Ce n'est pas grave tant que le lien se transmet a la main, mais ca veut dire zero visiteur venu d'un moteur. A regler en meme temps que le choix du domaine public — les trois valeurs par defaut du code se contredisent aujourd'hui (`sitemap.ts` et `layout.tsx` designent `expeditionlauncher.store`, `robots.ts` designe `expedition.so`, qui est parque).

**Fichiers touches :**
- `src/app/tubeforge/telecharger/layout.tsx` — canonical explicite vers l'URL qui sert la page

**Comment annuler :** `git revert`. **Ne pas revenir a l'ancienne valeur** : elle pointe sur un 404.

**Effets de bord possibles :** si la page est un jour publiee sur le domaine principal, ce canonical devra changer en meme temps, sinon deux URLs se declareront reference. La contradiction `robots.ts` / `sitemap.ts` est site-wide et pre-existante : signalee, pas touchee.

---
### [2026-07-27 13:20] — « YouTube nous a pris pour un robot » : rendre le refus diagnosticable

**Quoi :** Un membre (deuxieme compte Discord a passer la porte, donc la connexion fonctionne bien pour d'autres que le proprietaire) est tombe sur ce refus avec une video musicale. Le message etait juste, mais MUET sur la seule chose qui compte pour reparer.

**Ce que la mesure dit vraiment.** Sur `lxnyzw3f8Qc` (une video musicale, liste `RD…`) :
- depuis MA machine, avec le meme visitorData que le Worker : les trois clients mobiles repondent `OK` avec 7 pistes ;
- depuis le Worker : `LOGIN_REQUIRED` / « Connectez-vous pour confirmer que vous n'etes pas un robot », sur les trois clients, trois fois de suite.

Donc la classification est **correcte** — c'est bien de la detection anti-robot — et la cause est **l'adresse IP partagee de Cloudflare**, pas le client ni le visitorData. D'autres videos passent depuis ce meme Worker (canari vert, 6/6 en test), donc YouTube applique une surveillance PAR VIDEO, plus stricte sur le contenu musical.

**Le vrai defaut n'etait pas l'absence de secours, c'etait son silence.** Face a « YouTube nous a pris pour un robot », impossible de distinguer trois situations qui appellent trois corrections opposees : le secours BotGuard n'a pas ete tente, il a ete tente et a echoue, ou il a reussi et YouTube refuse quand meme (= blocage IP confirme). `window.__tfdlAttestation` existait deja, mais vivait dans la console — que personne ne pense a copier. Un rapport de bug se resumait donc a « ca ne marche pas ».

Le verdict est desormais joint au refus et affiche sous le message, en petit : « attestation impossible sur ce navigateur (raison) », « attestation fournie, YouTube refuse quand meme », ou « session YouTube indisponible, secours impossible ».

**CSP : le worker local est autorise en DEVELOPPEMENT seulement.** La porte etant fermee en production, la seule facon d'exercer le vrai chemin du navigateur est de viser un worker local — que `connect-src` refusait, ce qui rendait tout diagnostic impossible et m'avait deja fait conclure a tort a une panne reseau. `CSP_CONNECT_DEV` vaut la chaine vide quand `NODE_ENV` est `production`. **Verifie sur la production apres deploiement : aucune occurrence de `localhost`, `127.0.0.1`, ni des ports de dev dans l'en-tete servi.**

**Ce que je n'ai PAS pu etablir :** si le secours a effectivement tourne chez ce membre. Mon harnais de navigateur n'arrivait pas a remplir le champ (remplissage direct du DOM sans evenement React, donc bouton reste desactive ; puis deux `ref` renvoyant les memes coordonnees). Plutot que d'insister sur un outil defaillant, j'ai rendu la reponse observable — le prochain rapport la donnera directement.

**Fichiers touches :**
- `src/lib/webdl.ts` — `resolve()` rend compte du secours dans `attestation` ; type `ResolveFailure` etendu
- `src/app/tubeforge/telecharger/page.tsx` — etat `detailTechnique`, affiche sous le message d'erreur
- `next.config.ts` — `CSP_CONNECT_DEV`, vide en production

**Comment annuler :** `git revert` du commit. Retirer `CSP_CONNECT_DEV` reste possible seul, au prix de la capacite a diagnostiquer en local.

**Effets de bord possibles :** une ligne technique en plus sous certains messages d'erreur. Volontairement discrete (12 px, mono, opacite reduite) : elle sert au diagnostic, pas a la comprehension — le message principal reste autonome. Elle n'apparait que sur les refus anti-robot YouTube.

**Ce qui reste ouvert :** si l'attestation remonte « fournie, YouTube refuse quand meme », alors le PoToken ne suffit pas et le seul levier restant est de ne plus sortir par l'IP de Cloudflare. C'est exactement l'argument de TubeForge, que le message d'erreur avance deja.

---
### [2026-07-27 12:35] — Dire qu'il faut REJOINDRE, pas seulement se connecter

**Quoi :** Le bouton disait « Se connecter avec Discord », ce qui suppose qu'on a deja acces. Quelqu'un qui n'est pas encore sur le serveur autorisait Discord, revenait, et decouvrait SEULEMENT LA qu'il fallait d'abord rejoindre. Un aller-retour inutile, au pire moment — juste apres avoir accorde une autorisation.

**Le correctif.** La sequence complete est annoncee avant le premier clic : « Deux etapes : rejoindre le serveur, puis se connecter ici pour qu'on verifie. » Puis deux boutons numerotes, **1 Rejoindre le Discord** (lien d'invitation, nouvel onglet) et **2 Se connecter**, suivis de « Deja sur le serveur ? L'etape 2 suffit. »

**Un seul bouton plein**, conformement a la doctrine : la connexion est la seule etape que TOUT LE MONDE fait — un membre saute la premiere — donc c'est elle qui porte le poids visuel. Le bouton « Rejoindre » reste en contour.

**Mesure apres coup**, sur un vrai 375x812 : carte a 996 px, **les deux boutons entierement au-dessus du pli** (le second finit a 776 px pour un pli a 812), 0 debordement horizontal.

**Question posee : pourquoi pas UN SEUL lien qui joint et connecte ?** C'est techniquement faisable. Le scope Discord `guilds.join` permet a une application d'ajouter quelqu'un a un serveur, via un bot present dessus. Un clic suffirait alors. Non retenu pour l'instant, pour deux raisons :
1. **Ca detruit l'argument de confiance qu'on vient d'ecrire.** L'ecran d'autorisation afficherait « Rejoindre des serveurs pour toi », alors que la page promet noir sur blanc « on ne peut pas te faire rejoindre quoi que ce soit ». Sur une page dont le probleme central est de ne pas ressembler a une arnaque, c'est un mauvais echange contre un clic economise.
2. **Le but n'est pas de franchir la porte, c'est d'entrer dans la communaute.** Une adhesion silencieuse produit un membre qui n'ouvre jamais le serveur. Rejoindre a la main, c'est voir le serveur.

Si on change d'avis : il faut un bot dans le serveur, son jeton en secret, le scope `guilds.join`, et **reecrire le bloc de levee de doute** — pas seulement ajouter le scope.

**Fichiers touches :**
- `src/app/tubeforge/telecharger/page.tsx` — deux etapes annoncees, deux boutons numerotes

**Comment annuler :** `git revert` du commit.

**Effets de bord possibles :** deux boutons cote a cote, c'est deux fois plus de choix a l'instant du clic. Le numerotage et la ligne « Deja sur le serveur ? L'etape 2 suffit » sont la pour que le choix ne demande pas de reflechir. A surveiller : si les gens cliquent massivement « Se connecter » en premier sans etre membres, la branche « Tu n'es pas encore sur le serveur » les rattrape deja, avec son propre bouton pour rejoindre.

---
### [2026-07-27 12:05] — Expliquer ce qu'est Expedition, et remonter le bouton au-dessus du pli

**Quoi :** La page exigeait de rejoindre un Discord sans jamais dire ce qu'on y trouve. « Reserve aux membres du Discord » se lisait donc comme un peage, pas comme une porte. Ajout d'un bloc « Expedition, c'est quoi », et reorganisation de la carte.

**Le contenu.** Trois usages concrets plutot qu'une phrase sur une « communaute active » — on nomme ce qu'on y FAIT : poser ses questions (montage, YouTube, business), trouver une mission ou un monteur, et les outils de la maison dont ce telechargeur fait partie. Ce dernier point n'est pas decoratif : il rattache la page gratuite au reste de la suite.

**« Plus de 600 » plutot que le compte exact.** L'API d'invitation Discord donne 635 membres et 141 en ligne au 27/07 — mais un chiffre fige perime tout seul, et un chiffre faux sur la page qui promet de l'honnetete couterait plus qu'il ne rapporte. Un compteur en direct reste possible via cette meme API si on le veut.

**🚨 Mesure qui a impose de tout reorganiser.** Place AVANT le bouton — l'ordre logique, puisque c'est la raison de cliquer — le bloc faisait monter la carte a **1062 px, soit 131 % de l'ecran**, et le bouton tombait a **948 px alors que le pli est a 812 px**. On enterrait l'action principale derriere un mur de texte. Le bouton passe donc en premier : qui connait deja Expedition clique tout de suite, qui ne connait pas lit juste en dessous.

**Deuxieme economie : la liste des autorisations Discord repasse en prose.** Deux listes a coches consecutives se lisaient comme une repetition et coutaient 90 px pour rien. Une phrase dit la meme chose : « Discord te demandera ton pseudo, la liste de tes serveurs et ton e-mail : de quoi t'afficher ici, verifier que tu es bien sur Expedition, et te prevenir si l'outil change. »

**Apres reorganisation, sur un vrai 375x812 :** carte a **904 px** (contre 1062), **bouton entierement au-dessus du pli a 716 px**, 0 debordement horizontal.

**Fichiers touches :**
- `src/app/tubeforge/telecharger/page.tsx` — bloc « Expedition, c'est quoi », bouton remonte, autorisations en prose

**Comment annuler :** `git revert` du commit.

**Effets de bord possibles :** la carte reste a 111 % de la hauteur d'ecran sur telephone, donc le bas depasse le pli. C'est voulu : ce qui depasse, ce sont les explications, pas l'action.

**Artefact de mesure, cinquieme de la session :** une premiere serie de mesures donnait une carte de 3638 px et un bouton a 1568 px — le panneau du navigateur etait retombe a `0x0`, donc tout se repliait a l'infini. **Verifier que le viewport n'est pas nul AVANT de lire une mesure de mise en page.** Meme famille que le `scroll-behavior: smooth` et le `grep --include` avale par le shell.

---
### [2026-07-27 11:30] — Levee de doute sur la connexion Discord, et passe mobile

**Quoi :** Deux demandes. Preciser que la connexion Discord est la methode officielle et qu'on veut seulement verifier l'appartenance au serveur, parce que « se connecter avec Discord » sur un site tiers sonne comme une arnaque. Puis adapter la page au telephone.

**1. Bloc de levee de doute sous le bouton.**
Le reflexe de mefiance est SAIN : c'est exactement la forme que prend un vol de compte. On n'y repond donc pas par « fais-nous confiance », mais en annoncant a l'avance ce que l'ecran suivant va montrer — quand Discord affiche ensuite les trois memes autorisations, l'ecran CONFIRME au lieu de surprendre.

Le bloc dit : c'est la connexion officielle, le mot de passe se tape sur discord.com et on ne le voit jamais ; puis les trois autorisations avec ce qu'on en fait (pseudo et avatar pour l'affichage, liste des serveurs pour verifier l'appartenance, e-mail pour prevenir des changements) ; puis ce qu'on ne peut PAS faire, et comment retirer l'acces.

**L'e-mail est nomme ici plutot que decouvert la-bas.** C'est le point qui compte : le scope reel est `identify guilds email` (verifie sur `/auth/start` en production), donc le taire aurait produit exactement l'effet inverse de celui recherche — une prise en traitre a l'ecran suivant.

**2. Passe mobile, mesuree plutot que jugee a l'oeil.**
Etat a 375 px et 320 px apres correction : **0 debordement horizontal, 0 cible tactile sous 44 px, aucune image trop large**. La structure tenait deja.

Ce qui n'allait pas, c'est la LISIBILITE. Regle appliquee : un texte a la fois petit (moins de 13 px) et pale (sous `white/50`) est illisible sur telephone. Les tailles remontent sur mobile uniquement (`md:` preserve l'echelle voulue sur ordinateur), les opacites remontent partout — sur ces libelles, c'est le style mono/majuscules qui porte la hierarchie, pas la paleur.
- libelles de jauges 10 -> 11 px, `white/30` -> `white/50`
- legendes de captures et unites 11 -> 12 px, `white/32` -> `white/50`
- mentions en PROSE (tarif, notes) 11 -> 13 px, `white/30-35` -> `white/50`
- bloc de levee de doute 13 -> 14 px sur mobile

**🚨 Defaut trouve par le calcul, invisible a l'ecran : la rangee des deux jauges deborde a 320 px.** Le libelle le plus long fait 136 px et « 1194 restants sur 1200 » 133 px, pour une colonne de 120 px — et les deux etant en `whitespace-nowrap`, ca ne se replie pas, ca deborde la carte. **Ce bloc ne s'affiche qu'une fois connecte**, donc il n'apparait jamais pendant un test porte fermee : c'est en mesurant la largeur du texte dans la vraie police que le probleme est sorti. Les jauges s'empilent desormais sous 360 px — point de bascule calcule, pas choisi : c'est la premiere largeur ou la colonne (144 px) depasse le libelle (136 px).

**Constat plus large, NON corrige, signale :** sur le fond `#07060f`, **tout ce qui est sous `white/50` echoue au seuil de 4,5:1**, y compris sur ordinateur — `white/45` plafonne a 4,47, `white/32` a 2,77. Une bonne partie de la page est concernee (`ICI`, `SECONDAIRE`, sous-textes). Remonter tout d'un coup applatirait la hierarchie construite au fil des iterations, donc je n'y touche pas sans validation. Restent aussi hors correction : le point de separation « · » (decoratif, sans contenu) et « Compatible » dans `CompatBadge` a 4,47:1 (composant PARTAGE avec d'autres pages).

**Fichiers touches :**
- `src/app/tubeforge/telecharger/page.tsx` — bloc de levee de doute, echelle typographique mobile, empilement des jauges sous 360 px

**Comment annuler :** `git revert` du commit. Le bloc de levee de doute peut etre retire seul sans rien casser.

**Effets de bord possibles :** le bloc allonge la carte d'environ 190 px sur telephone, avant le pli. C'est assume : sur cette page, la question « est-ce que c'est une arnaque ? » se pose avant toute autre.

**Artefact de mesure, quatrieme de la session :** j'ai d'abord conclu que la variante `min-[360px]:` n'etait pas generee par Tailwind. Elle l'etait — mon `grep --include=*.css` echouait sur l'expansion du shell. **Verifier l'outil de mesure avant de conclure a un bug.** Meme famille que le `scroll-behavior: smooth` qui a fait croire que la page ne defilait pas.

---
### [2026-07-27 10:40] — « Tu n'es pas sur le serveur » alors qu'on y est : un echec de lecture pris pour un refus

**Quoi :** Question posee — « pourquoi ca marche chez moi et pas chez les autres ? ». La verification d'appartenance au Discord concluait « non-membre » des que l'appel echouait.

**Le defaut.** `fetchDiscordIdentity` faisait :
```js
let member = false;
if (guilds.ok) { member = list.some((g) => g.id === guildId); }
```
`/users/@me/guilds` est l'un des points les plus limites en debit de l'API Discord. Un 429 — ou n'importe quelle panne — laissait `member` a `false`, et la personne s'entendait dire « Tu n'es pas encore sur le serveur ». Elle ne pouvait rien y faire : rejoindre un serveur ou l'on est deja ne change rien, et le refus est indistinguable d'un vrai refus, donc personne ne peut diagnostiquer.

**C'est la meme faute que celle corrigee ce matin sur la page** (repli qui supposait la porte ouverte) : traiter une panne comme une reponse ferme. Une fois sous cet angle, les deux se voient d'un coup.

Ca explique aussi l'asymetrie « chez moi ca marche » : le succes depend d'un appel limite en debit, donc du hasard et de la simultaneite, pas de la personne.

**Le correctif.** Une reprise sur 429 en respectant le `Retry-After` de Discord (borne a 3 s), puis un refus EXPLICITE si la lecture echoue encore. On ne conclut que sur une liste reellement lue. Le message passe par le fragment `tfdl_err` pose ce matin, donc il s'affiche dans l'encart rouge de la page au lieu d'une page blanche.

**Verifie sur cinq scenarios simules** (impossible a provoquer a la demande sinon) : membre + appel OK -> membre ; non-membre + appel OK -> non-membre ; 429 puis OK -> **membre** (la reprise sauve le cas) ; 429 deux fois -> erreur explicite ; panne 500 -> erreur explicite. 5/5.

**Constat annexe, rassurant :** **deux** comptes Discord distincts ont deja telecharge (cles `q:d:<id>`), plus une entree `q:ip:` datant de la periode ou la porte etait ouverte. La porte fonctionne donc pour d'autres que le proprietaire du serveur.

**Visite neutre verifiee** (localStorage vide — il restait un `tfdl_token` d'un test precedent, ce qui suffit a changer le chemin de code) : bouton Discord affiche, aucune erreur console, `/api/me` en 78 ms.

**Fichiers touches :**
- (hors repo) `tubeforge-webdl/src/auth.js` — `listerServeurs()` avec reprise, et refus explicite quand la liste n'a pas pu etre lue

**Comment annuler :** `npx wrangler rollback`. **A eviter** : on remet un cul-de-sac ou la personne est accusee de ne pas etre membre.

**Effets de bord possibles :** une panne Discord produit maintenant une erreur au lieu d'un « non-membre » silencieux. C'est voulu — mais ca veut dire qu'une panne Discord devient visible sur la page au lieu d'etre maquillee en probleme de l'utilisateur. Reste non couvert : `/users/@me/guilds` ne pagine pas au-dela de 200 serveurs. Un compte Nitro present dans plus de 200 serveurs pourrait ne pas voir Expedition dans sa liste. Cas rare, non traite, note ici pour ne pas le redecouvrir.

---
### [2026-07-27 10:05] — 144p au lieu de 720p : un client plafonne gagnait la course

**Quoi :** Le telechargeur proposait 144p pour une video dont le 720p existe (et 360p pour du 1080p), et le telechargement cassait sur un 403 en cours de route. Une seule cause pour les deux.

**La cause.** La chaine de clients YouTube etait parcourue dans l'ordre, et le PREMIER qui repondait gagnait. `android_vr` (sans plafond) prend regulierement un **403 de limite de debit sur l'IP partagee de Cloudflare** ; `android` repond OK juste apres. On servait donc `android`, dont les URLs refusent les octets au-dela de ~25 Mo (`cappedBytes`, mesure du 26/07). Deux consequences pour la meme cause :
- `pickPair` doit rester sous le plafond, donc il descend a **144p alors que le 720p est la** — sur une video de 13 min, le 720p depasse largement 25 Mo ;
- le telechargement casse sur un **403 de tranche** des qu'on demande des octets au-dela du plafond.

Diagnostic : les trois clients sondes directement depuis ma machine repondaient `OK` avec le 720p et ses URLs, alors que le Worker retenait `android`. C'est ce qui a designe la limite de debit par IP plutot que la configuration du client. Le canari le disait aussi sans que je le voie : « client **android** » au lieu d'`android_vr`.

**Le correctif.** Sonder les clients SANS plafond en premier, avec reprise et attente croissante, et n'accepter un client plafonne qu'apres avoir vraiment insiste. Le bug de fond etait que la boucle de reprise se declenchait sur `!hit` : un succes **plafonne** l'empechait donc de tourner. Un succes plafonne ne doit pas arreter la recherche.

**Mesure apres correction**, six videos distinctes (pour ne pas mesurer le cache) : 6/6 sur `android_vr`, aucune degradation — 720p pour la video concernee, 1080p pour quatre autres. Avant : `android`, 144p. Verifie en production via le canari, qui rapporte desormais `client android_vr`.

**🚨 Piege du cache, qui aurait masque le correctif.** Les resolutions sont mises en cache 90 min sous `yt:<videoId>`. Le resultat degrade en 144p etait donc resservi tel quel apres le deploiement. Les sept entrees ont ete purgees. **A retenir : tout correctif qui change la QUALITE choisie exige de purger `yt:*`, sinon on teste l'ancien resultat.**

**Fichiers touches :**
- (hors repo) `tubeforge-webdl/src/youtube.js` — `resolveYouTube` sonde `sansPlafond` puis `avecPlafond`, chacun avec sa reprise

**Comment annuler :** `npx wrangler rollback`. Penser a purger `yt:*` ensuite, sinon les resultats en cache brouillent la comparaison.

**Effets de bord possibles :** une resolution peut prendre plus longtemps quand `android_vr` est limite, puisqu'on insiste au lieu d'accepter tout de suite le premier client venu. C'est l'echange voulu : quelques centaines de millisecondes contre du 1080p au lieu du 144p. Si YouTube durcit un jour `android_vr` durablement, les plafonnes reprendront la main tout seuls — avec la degradation de qualite, mais sans panne.

**Non prouve independamment :** le 403 sur « tranche 2 sur 2 » n'a pas ete reproduit directement (les URLs de mon worker de dev pointaient sur un `PUBLIC_ORIGIN` local mort). L'explication par le plafond d'octets du client `android` est coherente avec la mesure du 26/07, mais elle reste une deduction. A reverifier si le symptome revient alors que `client` vaut `android_vr`.

---
### [2026-07-27 09:10] — Le spinner infini et le bouton Discord absent

**Quoi :** Deux symptomes rapportes (« le bouton Discord ne s'affiche pas » et « quand je colle un lien ca charge en boucle »), deux causes distinctes, les deux reelles.

**🚨 1. Un `/api/me` en echec faisait croire a la page que la porte etait OUVERTE.**
`refreshMe` retombait sur `setMe({ auth: false })`. Or `gated = me?.gate === true` : avec cet objet, `gated` passe a FAUX, donc `toolOpen` passe a VRAI. Resultat : la page cachait le bouton Discord et affichait le champ de saisie, alors que le Worker exigeait toujours Discord. Chaque collage repartait avec « Connecte-toi avec Discord » et aucun bouton pour le faire. Cul-de-sac parfait, et rien dans la console : c'est un chemin nominal du code, pas une exception.

La porte est une decision du SERVEUR. Quand on n'a pas pu la lire, on ne devine plus qu'elle est ouverte : etat `echecMe` distinct de « pas encore lu », message « Impossible de verifier ton acces », bouton « Reessayer », et **jamais** de champ de saisie. **Verifie en local** en rendant le Worker injoignable : avant, champ de saisie affiche sans bouton Discord ; apres, message + Reessayer et plus de champ.

**2. Aucun des six `fetch` du chemin n'avait d'echeance.**
C'est ca, « ca charge en boucle ». Un appel REFUSE jette, et on affiche l'erreur. Un appel SUSPENDU ne jette jamais : le `await` ne rend pas la main, donc le `finally` qui eteint le bouton « Analyse » ne s'execute pas, et le bouton tourne indefiniment. Il n'existe aucun cas ou tourner sans fin est correct.

Delais poses : `api()` 45 s (le Worker interroge YouTube en direct, l'anti-robot le fait attendre une dizaine de secondes), `/api/session` 8 s (sur le chemin de CHAQUE resolution YouTube, et le Worker sait s'en passer), tranche de 6 Mo 60 s (rejouee — le mecanisme d'essais existait deja mais ne servait qu'aux refus explicites), fichier d'un seul bloc 5 min.

**BotGuard a droit a un traitement a part** : `Promise.race` contre un minuteur de 20 s, EN PLUS des echeances sur ses deux appels reseau. L'essentiel de son travail se passe dans une machine virtuelle JavaScript fournie par Google (`bg.snapshot()`) qu'aucun signal d'annulation n'interrompt. C'est le suspect le plus credible dans le cas rapporte : le navigateur concerne n'arrive pas a creer de contexte WebGL (`FEATURE_FAILURE_EGL_NO_CONFIG`), et BotGuard empreinte lourdement le materiel.

**Fichiers touches :**
- `src/app/tubeforge/telecharger/page.tsx` — etat `echecMe`, ecran d'echec avec « Reessayer », repli qui ne suppose plus la porte ouverte
- `src/lib/webdl.ts` — `echeance()`, `estDelaiDepasse()`, delais sur `api()`, sur les tranches et sur le fichier d'un bloc
- `src/lib/potoken.ts` — delais sur les deux appels BotGuard et borne globale de 20 s

**Comment annuler :** `git revert c55d2ff`. **Ne pas annuler le point 1** : il remet un cul-de-sac silencieux des que le reseau hoquette.

**Effets de bord possibles :** un reseau tres lent voit maintenant des messages d'echeance la ou il patientait. C'est l'echange voulu — une phrase lisible vaut mieux qu'un bouton qui tourne. Les echeances sont volontairement larges pour ne pas punir une connexion modeste : 60 s pour 6 Mo, soit 100 Ko/s.

**Constat au passage, non modifie :** `connect-src` autorise `video.twimg.com` (X) et `*.cloudfront.net` (Twitch) mais PAS `*.googlevideo.com`. Ce n'est pas un oubli — YouTube passe deliberement par le relais du Worker, son CDN n'autorisant pas notre origine. A ne pas « corriger » sans mesurer.

---
### [2026-07-27 07:55] — Faille de redirection ouverte sur /auth/start, carte vide et echecs Discord muets

**Quoi :** Trois defauts trouves en repondant a « le bloc Discord ne s'affiche pas, puis s'affiche, et ca marche pas ». Le premier est une faille de securite, les deux autres expliquent le symptome.

**🚨 1. Redirection ouverte : le jeton de session pouvait etre livre a un site tiers.**
`/auth/start?next=<url>` signait la destination fournie dans le `state`, et `/auth/callback` terminait par `new URL(st.n)` + le jeton de session DANS LE FRAGMENT. Une signature prouve seulement que NOUS l'avons emise, jamais que la destination nous appartient. **Verifie sur le worker de production** : `/auth/start?next=https://exemple-malveillant.test/vol` renvoyait un state signe contenant `{"n":"https://exemple-malveillant.test/vol"}`. Il suffisait de faire cliquer un membre sur ce lien pour recevoir sa session apres son passage par Discord.

Corrige par `destinationAutorisee()`, qui compare l'ORIGINE a `ALLOWED_ORIGINS` et retombe sur la notre sinon. Filtre a l'entree (`/auth/start`) ET revalide au retour (`/auth/callback`), pour qu'un state signe avant le correctif ne serve plus. Compare l'origine, pas un prefixe : `startsWith` aurait laisse passer `tubeforge.explauncheur.space.evil.test` et `tubeforge.explauncheur.spaceX`. **Sept cas testes sur un worker de dev, sept refuses** (origine hostile, sous-domaine trompeur, prefixe trompeur, `javascript:`, chaine non parsable, parametre absent), puis reverifie en production.

**2. La carte restait un rectangle vide avant d'afficher le bouton Discord.**
`gated = me?.gate === true` et `toolOpen = me !== null && …` : tant que `/api/me` n'avait pas repondu, AUCUNE des trois branches ne rendait quoi que ce soit. Mesure : `/api/me` repond en 140-320 ms, donc un rectangle vide pendant un tiers de seconde, puis un bouton qui surgit. Vu de l'autre cote, l'outil a l'air casse. Ajout d'une branche `me === null` qui occupe la place avec la forme de ce qui arrive, aux memes dimensions.

**Au passage, l'accroche mentait pendant ce meme delai.** Elle affichait « Gratuit, sans compte » (valeur par defaut quand `gate` est inconnu) puis se corrigeait en « Gratuit pour les membres du Discord ». La premiere phrase de la page etait donc fausse le temps de l'aller-retour, et sautait sous les yeux. Remplacee par « Gratuit, sans publicite », vraie dans les deux cas ; la condition d'acces est dite dans la carte, la ou elle s'applique.

**3. Un echec de connexion Discord donnait une page blanche sans retour.**
`/auth/callback` repondait `new Response(err, {status: 400})` : une phrase sur fond blanc, aucun lien, et rien dans la console. Desormais l'erreur revient dans le fragment (`tfdl_err`) et s'affiche dans l'encart rouge de la page. `error=access_denied` (clic sur « Annuler » chez Discord) ramene simplement sur la page, sans message : ce n'est pas une panne.

**Ce que ces trois points n'expliquent PAS :** aucune cle `q:<discordId>:<date>` n'existe en KV, donc personne n'a encore reussi a passer la porte. Le tour OAuth complet reste a tester par quelqu'un qui a un compte Discord — je ne peux pas me connecter a la place du user.

**Fichiers touches :**
- (hors repo) `tubeforge-webdl/src/index.js` — `destinationAutorisee()`, `retourAvecErreur()`, reecriture de `/auth/start` et `/auth/callback`
- `src/lib/webdl.ts` — `readTokenFromHash` devient `readHashResult`, qui rend aussi l'erreur
- `src/app/tubeforge/telecharger/page.tsx` — branche de chargement, accroche neutre, affichage de l'erreur de retour

**Comment annuler :** `npx wrangler rollback` cote worker ; `git revert` cote site. **Ne pas annuler le point 1 seul** : c'est une fuite de session.

**Effets de bord possibles :** ajouter un domaine (preview Vercel, autre alias) exige de l'ajouter a `ALLOWED_ORIGINS` dans `wrangler.toml`, sinon la connexion Discord y ramene sur l'origine principale au lieu de la page d'ou l'on vient. C'est le prix de la liste blanche, et c'est le bon sens de l'echange.

**Deux bruits de console constates, non corriges (hors perimetre, signales) :**
- `vercel.live/feedback.js` bloque par la CSP : c'est la barre d'outils Vercel, injectee parce que le deploiement est un PREVIEW aliase sur le domaine (consequence de `npx vercel --yes` + `alias set`). Bloquee, donc sans effet — mais c'est une erreur a chaque visite.
- Dix echecs `WebGLRenderer: Error creating WebGL context` : aucun composant Three.js n'est importe par cette page ni par `Navbar`/`Footer`. Ces erreurs viennent d'une autre page du meme onglet (fond anime de l'accueil). La cause reelle est cote navigateur (`FEATURE_FAILURE_EGL_NO_CONFIG` = acceleration materielle indisponible) : sur cette machine, le fond anime du site ne s'affiche pas du tout.

---
### [2026-07-27 07:10] — Canari : surveillance horaire des quatre extracteurs

**Quoi :** Un canari verifie que les quatre extracteurs repondent encore, garde son etat en KV, et previent sur Discord quand une plateforme tombe ou refonctionne. Lisible sans Discord sur `/api/canary`, declenchable a la main sur `/api/canary/run`.

**Pourquoi :** les extracteurs sont ecrits a la main et casseront un par un. Sans surveillance, la panne est decouverte par un utilisateur, ou par personne s'il se contente de partir. Le canari ne repare rien : il transforme « quelqu'un finit par le signaler » en « on le sait dans l'heure, avec le message d'erreur exact ».

**🚨 Decouverte en cours de route : le compte est sur le plan GRATUIT.** Le deploiement a echoue sur `You have exceeded the limit of 5 cron triggers`. Verifie dans la documentation : 5 taches planifiees par compte en gratuit, 250 en payant. Les cinq places sont occupees par des workers de production (`expedition-licensing` x2, `forgenote-sync`, `swipeforge-sync`, `expeprod-sync`, `reviewforge-keepalive`). Je n'ai touche a aucun. **Ca confirme aussi les chiffres de capacite donnes plus tot : plafond DUR de 100 000 requetes par jour, avec erreur 1027 au-dela.**

**Consequence de conception : le canari se declenche sur le TRAFIC.** A chaque appel de `/api/me` (soit chaque chargement de page), si le dernier passage date de plus d'une heure, la requete en cours lance une verification en tache de fond via `waitUntil`, sans ralentir la reponse. Un marqueur est pose AVANT le lancement pour que deux visites simultanees ne declenchent pas deux series. Le handler `scheduled` reste en place, pret pour le jour ou une place de cron se libere.

**Limite assumee :** sans visite, pas de verification. Sur un outil sans utilisateur, une panne non detectee ne gene personne ; des qu'il y a du trafic, le premier visiteur de l'heure paie la verification pour les suivants.

**Deux garde-fous contre le bruit, qui comptent plus que la detection elle-meme :**
- **Deux echecs consecutifs** avant d'alerter. Un blocage anti-robot passager (mesure : 9 succes sur 15 appels d'affilee) ne doit pas reveiller quelqu'un a 3 h du matin.
- **Notification sur CHANGEMENT d'etat seulement.** Une plateforme cassee depuis trois jours a envoye un message, pas 72.

**Verification du mecanisme d'alerte, faite pour de vrai.** J'ai pointe la cible Twitch sur un clip supprime, sur un worker de developpement : passage 1 -> echec enregistre, `echecs=1`, statut toujours `ok`, **zero alerte** ; passage 2 -> `echecs=2`, statut `ko`, **une alerte**. La cible reelle a ensuite ete restauree et l'etat purge. Un systeme d'alerte qui n'alerte pas serait pire que pas de surveillance.

**Fichiers touches :**
- (hors repo) `tubeforge-webdl/src/canary.js` (nouveau) — cibles, test par plateforme, machine a etats, notification Discord
- (hors repo) `tubeforge-webdl/src/index.js` — handler `scheduled`, `peutEtreCanari` sur le trafic, routes `/api/canary` et `/api/canary/run`
- (hors repo) `tubeforge-webdl/wrangler.toml` — pas de `[triggers]`, avec la raison ecrite dans le fichier

**Ce qui reste a faire cote user :** creer un webhook dans Discord (Parametres du serveur, Integrations, Webhooks) puis `npx wrangler secret put DISCORD_WEBHOOK_URL`. Sans lui le canari tourne et garde ses resultats, il ne notifie pas.

**Comment annuler :** retirer l'appel a `peutEtreCanari` dans `/api/me` suffit a l'endormir ; `npx wrangler rollback` pour tout defaire.

**Effets de bord possibles :** les videos de reference peuvent etre supprimees par leurs auteurs, ce qui produirait une fausse alerte. `jNQXAC9IVRw` (la premiere video de YouTube) ne risque rien, les trois autres oui — et le clip Twitch est le plus fragile, les clips expirant reellement (j'en ai perdu un ce matin). C'est pourquoi l'alerte cite l'erreur brute au lieu de conclure : « Clip introuvable ou supprime » se distingue d'un coup d'oeil de « Reponse Twitch illisible ». Le canari ajoute 4 appels par heure aux plateformes, soit 96 par jour : negligeable face aux 200 que mes tests ont produits en une heure, mais non nul dans le budget anti-robot.

---
### [2026-07-27 06:00] — Le produit payant existe enfin sur la page : mise en regard 12 journees / 41,88 EUR

**Quoi :** Trois changements pour que le lecteur comprenne qu'un autre produit existe et ce qu'il lui rapporte : le nom **TubeForge** entre dans le titre de section avec son wordmark anime, le cout se compte en **journees de travail** au lieu d'heures, et la carte de cloture met face a face **12 journees de travail** et **41,88 EUR**.

**Pourquoi :** remarque du user, et elle visait juste. La page **parlait** de TubeForge sans jamais le **presenter**. Le nom n'apparaissait qu'en corps de texte, l'accroche etait en petit mono, et aucun moment ne mettait le gain de temps en face d'un prix. Resultat : rien a arbitrer, donc aucune raison de cliquer.

**Les trois leviers :**
1. **Le produit est nomme dans le titre**, avec la classe `.tf-forge-flow` de la one-page (degrade ember vers violet, anime). C'est le traitement typographique qui signe le produit ailleurs sur le site ; l'utiliser ici le presente comme un produit et non comme une reference. L'accroche mono devient « L'application payante d'Expedition », sans ambiguite possible.
2. **Le cout passe des heures aux journees.** 96 heures par an ne se ressentent pas ; **douze journees de travail** si. Meme calcul, meme hypothese, une unite que le lecteur eprouve.
3. **La mise en regard, qui manquait.** 12 journees d'un cote, 41,88 EUR de l'autre, le mot « contre » entre les deux. Les deux chiffres sortent du meme calcul ecrit plus haut dans la bande de cout, donc la comparaison est verifiable et pas un effet de manche.

**L'arithmetique, verifiee avant d'ecrire :** 10 min par extrait x 12 extraits = 2 h par video. Une video par semaine fait 8,7 h par mois (on annonce 8, prudent). 8 x 12 = 96 h par an, soit 12 journees de 8 h. Prix : 3,49 x 12 = 41,88 EUR. Aucun chiffre invente, et l'hypothese reste ecrite a l'ecran.

**Fichiers touches :**
- `src/app/tubeforge/telecharger/page.tsx` — accroche mono, `h2` avec wordmark, bande de cout en journees, carte de cloture avec la mise en regard

**Verification en production :** le nom apparait dans le titre avec le wordmark (deux occurrences de `tf-forge-flow`, titre et cloture), la mise en regard est en place, zero exclamation, un seul tiret cadratin (`Footer` global).

**Comment annuler :** `git revert <hash>`.

**Effets de bord possibles :** « 12 journees de travail » repose sur une journee de 8 heures, ce qui n'est pas la realite d'un independant. Le chiffre reste un ordre de grandeur, et l'hypothese est ecrite juste a cote. Le calcul suppose aussi une video par semaine : quelqu'un qui publie une fois par mois verra un chiffre quatre fois trop grand pour lui, et l'hypothese affichee est la seule protection contre ce malentendu. Enfin `.tf-forge-flow` anime un degrade en continu ; deux occurrences sur la page restent discretes, mais en ajouter d'autres transformerait la signature en decoration.

---
### [2026-07-27 05:20] — Logos Premiere/DaVinci a cote du titre, gain de temps remonte avant les preuves

**Quoi :** Le badge « Compatible · Premiere Pro · DaVinci Resolve » se place a cote du titre de section. Les chiffres de temps (2 h par video, 8 h par mois) quittent la carte de cloture pour une bande posee juste avant les quatre cartes. La cloture ne garde que l'action.

**Pourquoi :**
- **Les logos** : le titre parle de « ta timeline », et la premiere question d'un monteur devant un outil est de savoir s'il fonctionne avec SON logiciel. Repondre au moment ou la question se pose vaut mieux que la renvoyer en bas de page. Composant `CompatBadge` deja utilise dans le hero de la one-page, donc zero code nouveau et une coherence visuelle acquise.
- **Le gain de temps remonte** : c'est ce qu'on achete. Il etait enterre sous 1500 px de cartes, la ou le lecteur decide en haut. L'hypothese du calcul (dix minutes par extrait, douze extraits) est ecrite dans la meme bande, a cote du chiffre, pour qu'il reste verifiable au lieu d'etre assene.
- **La cloture allegee** : elle repetait 2 h et 8 h a l'identique. Remplacee par une seule phrase qui parle du risque pris (« Quatorze jours pour voir si ca change ta facon de monter »), suivie des boutons. Verifie : chaque chiffre n'apparait plus qu'une fois dans la page.

**Fichiers touches :**
- `src/app/tubeforge/telecharger/page.tsx` — import `CompatBadge`, titre en `flex` avec le badge, bande de temps, carte de cloture reduite

**Verification en production :** ordre de lecture confirme (accroche, titre, badge Compatible, les quatre gestes, la bande 2 h / 8 h, puis les cartes). « 2 h » et « 8 h » n'apparaissent qu'une fois chacun. Zero exclamation, un seul tiret cadratin (`Footer` global).

**Comment annuler :** `git revert <hash>`.

**Effets de bord possibles :** `CompatBadge` s'anime avec `animate` et non `whileInView` : son apparition se declenche au chargement de la page, donc bien avant que le lecteur arrive a cette section. L'effet de reveal est perdu ici, sans consequence visuelle notable puisque le badge est deja en place quand on y arrive. Sur les largeurs intermediaires (autour de 1024 px), le titre et le badge se retrouvent sur deux lignes : c'est prevu par le `flex-col lg:flex-row`, mais ca fait respirer moins haut que prevu.

---
### [2026-07-27 04:50] — La question rejoint sa carte, l'accroche de section porte la promesse

**Quoi :** La question chiffree (« Tu viens de telecharger 440 Mo. Combien vas-tu en garder ? ») quitte le titre de section pour entrer dans la carte de decoupe, juste au-dessus des deux barres. Le titre de section porte desormais la promesse du produit : « Tes extraits arrivent sur ta timeline pendant que tu montes. »

**Pourquoi :** remarque du user, structurelle et juste. La question interroge ce que montre UNE carte (le gaspillage d'octets) ; en tete de section elle n'annoncait qu'un tiers du bloc, alors que la section couvre aussi les lots, les playlists et la destination du fichier. Deux consequences :
- **Dans la carte**, la question est collee aux deux barres qui y repondent. Le lecteur ne peut pas deviner la reponse avant de les regarder, ce qui lui fait descendre l'oeil de la question vers la preuve.
- **En tete de section**, une promesse couvre les quatre cartes. « Tes extraits arrivent sur ta timeline pendant que tu montes » decrit un etat que le lecteur n'a pas, ce qui est ce qui accroche un prospect. Elle est aussi verifiable : c'est la conjonction de la file d'attente et du depot dans le chutier, tous deux montres plus bas.

**Fichiers touches :**
- `src/app/tubeforge/telecharger/page.tsx` — `h2` de section, accroche mono, question deplacee dans la carte

**Verification :** ordre de lecture confirme en production (accroche, promesse, les quatre gestes, puis la question dans la carte). Zero exclamation, un seul tiret cadratin (`Footer` global).

**Comment annuler :** `git revert <hash>`.

**Effets de bord possibles :** quatrieme iteration sur cette meme accroche. Les trois precedentes ont echoue pour des raisons differentes (phrase-slogan, declaration vague, reponse avant la question) et celle-ci change de nature : elle ne decrit plus le probleme mais la promesse. Si elle ne prend pas, le probleme n'est plus la formulation mais le fait qu'un titre de section doive porter quatre arguments a la fois.

---
### [2026-07-27 04:20] — L'accroche de section devient une QUESTION (troisieme essai)

**Quoi :** Le titre du bloc promo passe de constat a question ouverte, calculee sur les chiffres de la personne : « Tu viens de telecharger 440 Mo. Combien vas-tu en garder ? » (ou « Une video de 15 minutes pese 440 Mo. Combien vas-tu en garder ? » avant tout telechargement). Suppression au passage d'une etiquette qui repetait l'accroche a 40 px d'ecart.

**Pourquoi, et les deux erreurs qui ont precede :**
1. **« Le telechargement n'est pas le travail. »** — opposition binaire + phrase faite pour etre citee. Deux fautes que `stop-slop` proscrit.
2. **« Ce que tu fais avant de monter. »** — en fuyant le slogan, j'ai ecrit une declaration vague, exactement ce que le meme skill interdit : une phrase qui annonce un sujet sans nommer la chose. Le user : « pas assez clair, pas assez evocateur ». Il avait raison.
3. **« Recuperer tes extraits te coute deux heures par video. »** — clair et chiffre, mais ca **repond avant d'avoir pose la question**. Le user voulait une formulation qui intrigue et donne envie de lire.

**Pourquoi une question est ici legitime :** le skill `copywriting` recommande la question rhetorique (« Questions engage readers and make them think about their own situation »). Le skill `stop-slop` n'interdit pas les questions, il interdit de les **refermer dans la phrase suivante**. Ici la reponse n'est pas dans le texte : elle est dans les deux barres juste en dessous, calculees sur le fichier reel. Le lecteur ne peut pas connaitre la reponse avant de regarder.

**Le doublon supprime :** l'accroche annonce « Une video de 15 minutes pese 440 Mo », et l'etiquette de la carte disait « Une video de 15 minutes en 1080p » quarante pixels plus bas. Etiquette retiree ; l'accroche indique deja s'il s'agit du fichier de la personne ou d'un exemple.

**Fichiers touches :**
- `src/app/tubeforge/telecharger/page.tsx` — accroche, sous-titre, etiquette retiree

**Verification :** en production, la question apparait bien, la phrase qui la suit enumere les quatre gestes sans y repondre, « 15 minutes » n'apparait plus qu'une fois. Zero exclamation, zero adverbe proscrit, un seul tiret cadratin (celui du `Footer` global).

**Comment annuler :** `git revert <hash>`.

**Effets de bord possibles :** la question mentionne 20 secondes comme extrait de reference ; quelqu'un qui garde trois minutes trouvera le calcul severe. Le chiffre est defendable comme ordre de grandeur d'un extrait de montage, mais c'est une hypothese, pas une mesure. **Trois formulations en trois iterations sur la meme phrase** : le signe qu'il faut faire valider une accroche avant de l'habiller, pas apres.

---
### [2026-07-27 03:40] — Copy reecrite avec les skills `stop-slop` + `copywriting`, et metadonnees SEO propres

**Quoi :** Tous les textes visibles de `/tubeforge/telecharger` et tous les messages du Worker reecrits contre les regles du skill `stop-slop`. Ajout d'un `layout.tsx` de segment avec des metadonnees propres a la page.

**Pourquoi :** le user a juge la copy inacceptable (« ecrit comme une IA ») et a demande d'aller chercher un vrai skill. La bibliotheque en contenait trois pertinents : `stop-slop` (supprimer les tics d'ecriture IA), `copywriting` (structure et CTA), `ai-seo`. Charges et appliques.

**Les infractions que j'avais commises, et ce qu'elles sont devenues :**
- **Tirets cadratins** : 12 dans la page, 7 dans le Worker. La regle est « aucun ». Tous remplaces par des points ou des virgules. Il en reste UN dans le HTML servi, dans le `Footer` global (« depuis Paris — Expedition ») : hors perimetre, il concerne tout le site.
- **Phrase-slogan** : « Le telechargement n'est pas le travail. » cumulait deux fautes, l'opposition binaire et la phrase faite pour etre citee. Devenu « Ce que tu fais avant de monter. », qui decrit au lieu de proclamer.
- **Questions suivies de leur reponse** : « Trente secondes utiles dans une video de deux heures ? Tu ne recuperes que ces trente secondes. » et « Sans carte pendant l'essai ? Non : ... ». Les deux reecrites en affirmations. Zero restante dans le texte servi.
- **Listes de trois** : « A pleine vitesse, sans recompression, et sans une seule publicite » -> deux items. La rangee de garanties passe de cinq a quatre items, en retirant le doublon « aucune recompression » qui repetait le sous-titre.
- **Adverbes** : `forcement`, `volontairement`, `directement` supprimes. Zero adverbe proscrit dans le texte servi.
- **Titres vagues** : « Plusieurs videos en une fois » -> « Neuf videos, un seul clic ». « Une playlist entiere » -> « Cinquante-trois videos d'affilee ». Le chiffre visible dans la capture devient le titre.
- **« Ici : »** repete trois fois en tete de phrase -> « Sur cette page : », et la formulation dit ce qu'on fait plutot que ce qu'on subit.

**Metadonnees, et l'intention de recherche qu'on evite.** La page etant un composant client, elle ne pouvait pas exporter `metadata` : elle heritait donc du titre de la one-page TubeForge et se presentait comme une page produit. Nouveau `layout.tsx` de segment.

⚠️ **Choix strategique explicite : on ne vise PAS « telecharger video youtube gratuit ».** Deux raisons. Le trafic arriverait sur une porte Discord et repartirait aussitot, donc zero conversion. Et cette requete est un marecage de sites publicitaires ou etre confondu avec eux ne rapporte rien. On vise le probleme du monteur : « telecharger une video pour Premiere Pro ou DaVinci ». Titre de 50 caracteres (tient sans troncature dans un resultat de recherche), description qui nomme les quatre plateformes et les deux garanties.

**Note du skill `ai-seo` qui s'applique ici :** le contenu derriere une porte n'est pas citable par les moteurs IA. L'outil est garde, mais tout le bloc d'argumentation reste public et indexable, avec ses chiffres et ses captures. C'est cette partie qui peut etre citee.

**Fichiers touches :**
- `src/app/tubeforge/telecharger/layout.tsx` (nouveau) — metadonnees, avec le raisonnement sur l'intention de recherche ecrit dans le fichier
- `src/app/tubeforge/telecharger/page.tsx` — 26 textes reecrits
- (hors repo) `tubeforge-webdl/src/index.js` et `src/platforms.js` — 12 messages reecrits

**Verification sur le HTML servi en production :** 0 point d'exclamation, 0 question suivie de sa reponse, 0 adverbe proscrit, 1 tiret cadratin (celui du `Footer` global), title a 50 caracteres, description presente. Les six nouvelles formulations testees sont bien la.

**Comment annuler :** `git revert <hash>` ; `npx wrangler rollback` pour les messages du Worker.

**Effets de bord possibles :** les messages d'erreur du Worker sont maintenant plus secs. C'est voulu, mais si un utilisateur trouve un message brutal, c'est la contrepartie de la suppression des adoucisseurs. Le titre SEO ne contient plus le mot « gratuit », qui aide le taux de clic : il est dans la description, arbitre au profit d'un titre non tronque. Enfin **ces metadonnees ne serviront a rien tant que la page n'est liee depuis nulle part** : aucun moteur ne la connait.

---
### [2026-07-27 02:50] — Deux capacites mises en avant (lots + playlists) sur une vraie grille de lecture

**Quoi :** Ajout de deux arguments demandes par le user, chacun avec sa capture reelle : **telecharger plusieurs videos d'un coup** (recherche par mot-cle, 9 cochees) et **telecharger une playlist entiere** (53 videos, un clic). Le bloc promo est restructure en quatre rangees, avec une echelle typographique unique partagee par toutes les cartes.

**La grille de lecture.** C'etait la demande explicite (« met un point d'honneur a la grille de lecture et a la lisibilite de tous les elements »). Trois decisions :
1. **Une seule echelle de texte pour tout le bloc**, extraite en constantes (`TITRE` 15 px blanc, `SECONDAIRE` 14 px a 52 %, `ICI` 14 px a 32 %, `LEGENDE` 11 px mono a 32 %). Avant, chaque carte redefinissait ses tailles a la main et rien ne s'alignait d'une carte a l'autre.
2. **Les deux captures de la paire recadrees au meme rapport de forme** (1,63 et 1,43) pour que la rangee se lise comme une grille. Resultat mesure : les deux cartes font 608 et 609 px — **1 px d'ecart**.
3. **Un composant `Feature` partage** par les deux cartes de la paire : meme ordre (preuve en image, chiffre qui frappe, titre, explication, puis la limite de la page gratuite en bas), et `mt-auto` sur la derniere ligne pour que les bas de carte s'alignent quelle que soit la longueur du texte.

**Structure finale** — quatre rangees, dans un ordre narratif : precision (la decoupe avant telechargement) -> volume (les deux nouvelles cartes) -> destination (le chutier, en bande large avec les chiffres 1500+/4K/∞) -> temps (2 h / 8 h et les CTA).

**Les captures.** `real-multi-2.jpg` (903x555) et `real-playlist-2.jpg` (902x632), recadrees depuis les captures fournies par le user sur le disque T5. J'ai d'abord produit des recadrages larges (`-1`, supprimes) puis les ai resserres en retirant les marges vides laterales : l'echelle d'affichage passe de **0,40 a 0,54**, soit 35 % de contenu utile en plus a largeur d'ecran identique. Le cadrage retenu garde exactement ce qui prouve l'argument — « 9 selectionnees » + « MP4 (9) / MP3 (9) » d'un cote, l'en-tete « 53 videos dans cette playlist » + « 53 selectionnees » de l'autre, plus deux rangees completes de vignettes cochees.

**Poids** : les PNG d'origine faisaient 896 et 674 Ko ; convertis en JPEG qualite 3, ils tombent a 209 et 139 Ko. Total des quatre captures du bloc : ~450 Ko, toutes en `loading="lazy"`.

**Fichiers touches :**
- `public/tubeforge/real-multi-2.jpg`, `real-playlist-2.jpg` (nouveaux ; les versions `-1` intermediaires supprimees)
- `src/app/tubeforge/telecharger/page.tsx` — constantes typographiques, composant `Feature`, rangee paire, bande « destination » avec les chiffres deplaces sous un separateur

**Verification :** a 1280 px — cartes de 535 / 608 / 609 / 331 px, paire alignee a 1 px, captures a l'echelle 0,54 et 0,55. A 375 px — aucun debordement horizontal, captures a 280-282 px, triptyque de chiffres a 3 x 83 px, aucune carte ne casse.

**Comment annuler :** `git revert <hash>` ; les captures sources restent sur le disque T5.

**Effets de bord possibles :** ⚠️ **le bloc est maintenant long** — environ 2100 px a 1280, apres un parcours deja charge. L'audit avait deja signale la densite avec deux cartes ; il y en a quatre. C'est un choix assume (les deux capacites ajoutees etaient demandees) mais si le taux de clic sur les CTA decoit, c'est la premiere piste a examiner. **Second point d'honnetete : a l'echelle 0,54, les petits libelles des captures restent difficiles a lire.** Les elements gras (« MP4 (9) », « 53 selectionnees ») passent, mais pas les titres de vignettes. Le parti pris est donc : l'image porte le CONCEPT (une grille de vignettes cochees se comprend d'un coup d'oeil), la typographie porte les FAITS (les chiffres 9 et 53 en 36 px). Aucun argument ne depend de la lecture d'une capture. Les rendre pleinement lisibles demanderait de passer les deux cartes en pleine largeur, ce qui rallongerait le bloc de ~700 px.

---
### [2026-07-27 02:05] — Capture du module de decoupe remplacee par celle fournie

**Quoi :** `real-cut-2.jpg` (647x716, 79 Ko) remplace mon recadrage maison `real-cut-1.jpg`, supprime. Source : capture fournie par le user (`Capture d'ecran 2026-07-26 a 18.16.16.png` sur le disque SAMSUNG T5), convertie en JPEG — 333 Ko en PNG, 79 Ko en JPEG qualite 2, sans perte visible sur une capture d'interface.

**Pourquoi :** le user a designe precisement cette capture. Elle est mieux cadree que mon recadrage : elle part de « + Options avancees » et garde le libelle « Couper un extrait », l'apercu, le curseur a deux poignees, Debut/Fin/Duree et le mode de coupe — exactement ce que prouve le paragraphe d'a cote, et rien de plus. Son rapport de forme (0,904) est aussi un peu plus favorable que le mien (1,04).

**Geometrie :** affichee a 400 px de large -> 443 px de haut, soit une carte d'environ **499 px** contre 730 au depart (-32 %). Legerement plus haute que les 442 px de l'etape precedente, parce que cette capture inclut la ligne « + Options avancees » que mon recadrage coupait — c'est le prix du cadrage choisi, et il est assume.

**Fichiers touches :**
- `public/tubeforge/real-cut-2.jpg` (nouveau) ; `real-cut-1.jpg` supprime
- `src/app/tubeforge/telecharger/page.tsx` — source, dimensions et commentaire mis a jour

**Verification :** HTML de prod ne reference plus que `real-cut-2.jpg` (une occurrence, zero de l'ancienne), le fichier repond en 200 / 81 Ko, et l'ancien renvoie bien 404.

**Comment annuler :** `git revert <hash>` — mais `real-cut-1.jpg` etant supprime, il faudrait le regenerer (`ffmpeg -i real-app.jpg -vf crop=692:668:0:190`).

**Effets de bord possibles :** le nom est versionne (`-2`) parce que les fichiers de `/tubeforge/` sont servis en cache immuable un an : ecraser un nom existant aurait laisse l'ancienne image chez les visiteurs deja passes. **Toute future capture doit suivre la meme regle.** `real-app.jpg` reste en place et inchangee : elle sert toujours sur la one-page.

---
### [2026-07-27 01:40] — Premiere carte du bloc promo : -39 % de hauteur, capture recadree

**Quoi :** La carte principale du bloc promo etait trop haute et desequilibree — le texte flottait au milieu d'un grand vide a cote d'une capture en portrait. Capture recadree, colonnes reequilibrees : la carte passe de **730 px a ~442 px**.

**Pourquoi :** retour direct du user (« le premier cadran est trop gros, essaye de mieux equilibrer le tout »). La cause etait geometrique : `real-app.jpg` est en 692x878 (portrait). Affichee a 500 px de large, elle faisait 635 px de haut, alors que la colonne de texte n'en faisait que 280 — d'ou 165 px de vide de chaque cote du texte centre.

**Ce que j'ai failli faire de travers.** J'avais commence a recadrer serre sur le seul curseur de decoupe, ce qui aurait supprime le libelle « Couper un extrait », l'apercu video et le mode de coupe. Le user a interrompu : « peut-etre qu'on peut garder tout ca en vrai ». Il avait raison — le recadrage ne devait retirer que l'en-tete « Telecharger MP4 / MP3 », qui parle d'autre chose que l'argument. **Nouveau fichier `real-cut-1.jpg`** (692x668, 80 Ko), qui garde le libelle, l'apercu, le curseur, Debut/Fin/Duree et le mode de coupe. Nom versionne, comme l'exigent les assets de `/tubeforge/` servis en cache immuable un an.

**Les trois leviers, dans l'ordre d'effet :**
1. **Recadrage** : 878 -> 668 px de haut, soit 24 % de moins, sans rien perdre de ce qui prouve l'argument.
2. **Capture plafonnee a 400 px** et centree dans sa colonne -> 386 px de haut, echelle 0,58. C'est un compromis assume : l'audit avait signale qu'a l'echelle 0,43 le texte interne devenait illisible ; a 0,58 les valeurs Debut/Fin restent dechiffrables et les formes (curseur a deux poignees, deux champs de temps, duree en orange) parlent d'elles-memes.
3. **Colonnes reequilibrees** (`1.3fr_1fr`) et **barres qui respirent** (hauteur 10 -> 12 px, libelles a 15 px, rythme vertical elargi). Faire monter la colonne de texte valait mieux que combler avec du vide : les barres sont l'argument central, elles meritent cette presence.

**Fichiers touches :**
- `public/tubeforge/real-cut-1.jpg` (nouveau, recadrage 692x668 de `real-app.jpg`)
- `src/app/tubeforge/telecharger/page.tsx` — `PromoTubeForge` : nouvelle capture, plafond 400 px, grille 1.3fr, barres et rythme elargis, rembourrage `md:p-7`

**Verification :** valeurs confirmees dans le HTML servi en production (`real-cut-1.jpg`, `max-w-[400px]`, `h-3`, `1.3fr_1fr`, `md:p-7`) et la capture repond bien en 200 / 80 Ko. Mesures a l'ecran prises a l'etape precedente (carte 517 px, capture 442x427) ; **la derniere mesure visuelle n'a PAS pu etre refaite** — le panneau navigateur a cesse de repondre. La hauteur de ~442 px est donc calculee depuis les valeurs deployees, pas relevee a l'ecran.

**Comment annuler :** `git revert <hash>` ; `real-app.jpg` reste en place et inchangee (elle sert toujours sur la one-page).

**Effets de bord possibles :** a l'echelle 0,58 la capture reste petite — si le texte interne s'avere illisible a l'usage, le vrai correctif serait un recadrage plus serre (au prix du contexte) ou une capture refaite a une resolution plus adaptee, pas un simple agrandissement qui redeséquilibrerait la carte. Il reste ~70 px de vide repartis autour du texte centre : c'est le prix d'une capture presque carree a cote d'un bloc de texte, et ca se lit maintenant comme un centrage voulu plutot que comme un trou.

---
### [2026-07-27 00:50] — Bloc promo rendu visuel, et un defaut d'HONNETETE trouve par l'audit

**Quoi :** Le bloc de promotion TubeForge, qui etait un mur de six paragraphes, devient une comparaison de proportions chiffree sur la vraie video de la personne, appuyee par les captures reelles du produit. Un audit en contexte frais (agent `design-critic`) a ensuite trouve trois defauts bloquants, tous corriges.

**🚨 Le defaut le plus grave, que je n'avais pas vu : un chiffre falsifie.**
J'avais mis un plancher `Math.max(0.6, part*100)` pour que la barre minuscule reste visible. Mais cette meme valeur servait AUSSI au texte « Soit X % du fichier ». Sur une video de deux heures — precisement le cas que ce bloc cherche a dramatiser — la vraie valeur est **0,28 %** et le texte affichait **0,6 %**. Un chiffre gonfle de plus du double, presente comme une mesure, sur une page dont l'argument central est l'honnetete. Corrige en separant les deux : le texte affiche toujours la valeur reelle, la lisibilite de la barre se regle en **pixels** (`minWidth: 6px`), ce qui ne touche pas au nombre annonce. Verifie sur quatre cas : 2 h -> 0,28 % · 15 min -> 2,2 % · 2 min -> 16,7 % · 15 s -> 100 %.

**Les deux autres bloquants.**
- `max-w-3xl` sur le conteneur etait une classe **morte** : `.container-main` (globals.css) est declaree hors de tout `@layer` et l'emporte donc toujours sur les utilitaires Tailwind v4. La page fait 1200 px, pas 768. Je n'ai PAS touche au CSS global (il concerne tout le site) mais j'ai retire la classe morte et documente le piege : le jour ou quelqu'un range `.container-main` dans un layer, cette page se retrecirait et la grille casserait.
- Consequence : la capture du module de decoupe etait plafonnee a 300 px alors que 500 px etaient disponibles. A cette taille, le texte interne (« DEBUT 00:00:21 ») tombait a ~7 px — **illisible**. La preuve visuelle echouait a son seul travail : montrer la fonctionnalite dont parle le paragraphe d'a cote. Passee a **506 px** (echelle 0,73 au lieu de 0,43).

**Le reste des corrections de l'audit :**
- **Densite** : quatre cartes empilees apres un parcours deja long, c'etait trop. Les deux cartes « chutier » et « 1500+/4K/∞ » fusionnent en une seule a deux colonnes -> trois blocs.
- **Animation d'entree manquante** : le bloc apparaissait d'un coup alors que toute la page (et `FeaturesList`) utilise des reveals decales. Ajout de `whileInView` avec delais echelonnes.
- **`object-left` inoperant** : la boite d'affichage est proportionnellement plus large que `real-timeline.jpg`, donc `object-cover` rogne en HAUTEUR — l'axe horizontal n'entrait pas en jeu. Remplace par `objectPosition: 50% 35%`.
- **Commentaire trompeur** : il affirmait que les quatre cartes utilisaient `.tf-cell`, faux pour la carte de cloture. Corrige dans le commentaire, pas dans le CSS — la cloture suit deliberement le langage des encarts d'alerte de la page.
- **Niveaux d'opacite** resserres (`/32` et `/52` au lieu de six valeurs differentes).

**Ce que l'audit a valide** : la mecanique des deux barres (meme piste, une pleine une vide) porte le sens sans lecture ; les captures reelles plutot que des icones ; et le fait d'ecrire l'hypothese du calcul (« dix minutes par extrait, douze extraits ») au lieu de sortir un chiffre magique.

**Verifications :** a 1280 px — barre pleine 500 px contre 11 px pour la barre utile, capture a 506 px, deux `.tf-cell`, pourcentage « 2,2 % ». A 375 px — aucun debordement horizontal, le libelle tient sur une ligne (21 px de haut), le triptyque de chiffres tient (3 x 85 px), capture a 282 px.

**Fichiers touches :**
- `src/app/tubeforge/telecharger/page.tsx` — `PromoTubeForge` reecrit, conteneur nettoye de sa classe morte

**Comment annuler :** `git revert <hash>`.

**Effets de bord possibles :** la comparaison n'est personnalisee qu'apres une resolution reussie ; sinon elle retombe sur l'exemple par defaut, lui aussi mesure (15 min en 1080p = ~440 Mo). Le bloc reste haut : trois cartes apres un parcours deja long, c'est un pari sur l'attention de quelqu'un qui vient d'obtenir ce qu'il voulait. Et **le piege `.container-main` hors `@layer` reste entier** pour tout le site : ce n'est pas mon perimetre, mais c'est une mine documentee.

---
### [2026-07-26 23:50] — Compteurs lisibles, arguments propres a la page gratuite, Instagram tranche

**Quoi :** Correction du piege d'ergonomie sur les quotas, refonte du bloc de promotion TubeForge depuis le point de vue d'un monteur, rangee « zero pub », et reponse mesuree sur Instagram.

**Le piege d'ergonomie sur les quotas.** L'affichage montrait `25/25` avec une barre **pleine**. Or un lecteur decode spontanement une barre remplie comme de la **consommation** : « 25 consommes sur 25 », donc « c'est fini » — l'inverse exact du sens voulu. Et `1196/1200` avec une barre pleine donnait l'impression d'etre au bout alors qu'il restait tout. Corrige : le mot « restants » ecrit en clair (« 25 restants sur 25 »), une barre qui se VIDE comme une jauge de carburant, les libelles forces sur une ligne (« POUR TOUT LE SERVEUR » passait a la ligne et desalignait tout), et les compteurs sortis de sous l'avatar pour occuper leur propre rangee.

**Fausse alerte que j'ai failli « corriger ».** Mes mesures donnaient des barres de **0 px** de large. Avant de toucher au code, j'ai remonte la chaine des parents : la carte entiere faisait 50 px — le panneau de navigation etait a une largeur minuscule. A 1280 px : pistes de 495 px, remplissages 100% et 99,67%, libelles sur une ligne. **Il n'y avait aucun bug.**

**Le bloc de promotion, refait depuis le poste de montage.** L'ancien enumerait des specifications (« 1500 sites, 4K, sans limite »). Le nouveau nomme les trois moments que la personne vient de vivre et dit ce qu'ils deviennent : (1) elle a telecharge des centaines de Mo pour garder vingt secondes -> TubeForge pose les points d'entree/sortie AVANT le telechargement ; (2) le fichier est dans son dossier Telechargements -> il arrive dans le chutier Premiere/DaVinci, nomme ; (3) quatre plateformes, 25/jour -> 1500 sites, 4K, a la chaine. Puis le calcul pose noir sur blanc : dix minutes par extrait, douze extraits, deux heures par video, huit heures par mois. La premiere ligne est **personnalisee avec le poids reel du dernier fichier** recupere : un chiffre vecu porte plus qu'un exemple.

**Deux affirmations devenues fausses, corrigees :**
- L'accroche disait « GRATUIT, SANS COMPTE » alors qu'on demande maintenant Discord. Elle suit desormais l'etat reel de la porte.
- Le sous-titre disait « Rien ne passe par nos serveurs » : vrai pour X et Twitch, **faux pour YouTube** dont le CDN interdit au navigateur de lire les octets. Remplace par ce qui est vrai partout : « A pleine vitesse, sans recompression, et sans une seule publicite. »

**La rangee « zero pub ».** Cinq mentions sous les plateformes : zero publicite, zero pop-up, rien a installer, aucune recompression, sans filigrane. C'est l'argument le plus fort de cette page : tout le monde a deja essaye un telechargeur en ligne avec ses faux boutons « Download », ses pop-up qui s'ouvrent dans le dos et son fichier recompresse en 480p. **Dire ce qu'on ne fait PAS est ici plus convaincant qu'une liste de fonctionnalites.**

**Instagram : NON, mesure.** La page profil publique ne contient plus aucun identifiant de publication (tout passe par une API authentifiee), et yt-dlp — la reference du domaine — repond « reponse media vide, verifie si le post est accessible sans etre connecte, sinon passe tes cookies ». C'est un mur d'**authentification**, pas une question d'IP : aucun contournement cote serveur. Instagram n'est donc PAS annonce. Mais plutot qu'un « plateforme non supportee » sec, les liens Instagram, Facebook, Vimeo et Dailymotion recoivent desormais un message qui **explique** — et l'encart precise le vrai mecanisme : un logiciel installe sur la machine peut utiliser la session du navigateur, une page web non.

**Fichiers touches :**
- (hors repo) `tubeforge-webdl/src/platforms.js` — `REFUS_EXPLIQUES` + `refusExplique()`
- (hors repo) `tubeforge-webdl/src/index.js` — refus de plateforme explique avec encart
- `src/app/tubeforge/telecharger/page.tsx` — `Compteurs` refait, `PromoTubeForge`, rangee de garanties, accroche dynamique, sous-titre corrige, memorisation du poids du dernier fichier

**Verification :** compteurs relus a 1280 px (495 px de piste, libelles sur une ligne, « restants sur » explicite) ; bloc promo et boutons verifies en production ; les quatre refus de plateforme testes sur un worker de developpement, chacun avec le bon message ; porte de prod re-verifiee fermee apres les tests.

**Effets de bord possibles :** la promo personnalisee n'affiche le poids reel qu'apres une resolution reussie — sinon elle retombe sur une formulation generique. La liste `REFUS_EXPLIQUES` est a maintenir a la main : une plateforme absente retombe sur le message generique, ce qui reste correct. Enfin le chiffre « dix minutes par extrait » vient de la page TubeForge : si cet argument evolue la-bas, il faut le repercuter ici.

---
### [2026-07-26 22:40] — Porte Discord ACTIVE, deux compteurs visibles, rouge exact, scope email

**Quoi :** La porte Discord est fermee et fonctionnelle (application `tubeforge`, ID `1530946642352803921`). La page affiche desormais les DEUX reserves — la personnelle et celle du serveur — en jauges. L'encart de conversion se declenche aussi a l'arrivee si une reserve est deja vide. Et le scope `email` est ajoute a l'OAuth.

**Bug corrige avant meme d'activer la porte :** mon `discordAuthorizeUrl()` envoyait `prompt=none`. Discord ne saute l'ecran d'autorisation que si la personne a **deja** autorise l'application ; au premier passage — donc pour tout le monde au debut — `none` renvoie `consent_required` **au lieu d'afficher l'ecran**. La premiere connexion de chaque membre aurait echoue. Parametre retire : Discord affiche l'ecran la premiere fois puis l'escamote seul ensuite.

**Verifications faites apres activation :**
- `gate = true` dans `/api/me`
- `/api/resolve` sans connexion -> refus avec `needAuth`
- l'URL construite par `/auth/start` porte le bon `client_id`, le `redirect_uri` exact, le scope `identify guilds email`, et **plus de `prompt`**
- Discord repond **200** sur cette URL : ni `invalid_redirect_uri` ni `invalid_client`, donc la redirection enregistree correspond
- la page affiche bien l'ecran « reserve aux membres du Discord »

**Les deux compteurs.** Nouveau composant `Compteurs` : deux jauges cote a cote, « Pour toi, aujourd'hui » (x/25) et « Pour tout le serveur » (x/1200), qui passent au rouge sous 20% de reserve. Raison : sans le compteur collectif, un blocage ressemble a une panne ; avec lui, on comprend qu'on partage un outil gratuit avec 600 personnes. Le Worker expose `serveur: { used, limit }` dans `/api/me` **et** dans chaque resolution reussie, pour que l'affichage se rafraichisse sans second appel.

**Le « canal » de conversion.** L'encart ne se declenche plus seulement APRES un refus : si une reserve est deja vide au chargement, il s'affiche immediatement avec le texte adapte (personnel ou collectif). On ne laisse plus quelqu'un cliquer pour rien avant de lui parler.

**Rouge exact.** `#ef3a24` (celui qui clot le degrade du wordmark) applique la ou il porte du sens : le point du titre, la bordure de l'encart de conversion, le focus du champ, les jauges et la barre de progression. L'ambre `#ff6a1f` reste la couleur dominante — le rouge marque l'alerte et l'action, pas la decoration.

**Scope `email`.** `identify guilds` devient `identify guilds email`, et l'adresse (si le compte Discord en a une **verifiee**) voyage dans le jeton signe et ressort dans `/api/me`. ⚠️ Elle n'est **stockee nulle part** : le jeton vit chez la personne, cote navigateur. En faire une liste de diffusion serait une autre decision, avec un consentement explicite et une mention dans la politique de confidentialite.

**Fichiers touches :**
- (hors repo) `tubeforge-webdl/src/auth.js` — `prompt=none` retire, scope `email`, `user.email` (null si non verifiee)
- (hors repo) `tubeforge-webdl/src/index.js` — email dans le jeton, `serveur` dans `/api/me` et dans les resolutions, compteurs dans le refus de plafond
- (hors repo) `tubeforge-webdl/wrangler.toml` — `REQUIRE_DISCORD = "true"`
- `src/lib/webdl.ts` — types `serveur` et `user.email`
- `src/app/tubeforge/telecharger/page.tsx` — composant `Compteurs`, encart proactif, constantes `RED`/`AMBER`, texte des limites corrige (disait encore « 10 videos par jour »)

**Comment annuler :** `REQUIRE_DISCORD = "false"` + `npx wrangler deploy` rouvre l'outil a tous en une minute. `git revert <hash>` cote page.

**Effets de bord possibles :** l'outil n'est **plus utilisable sans compte Discord** — tout visiteur hors du serveur voit une porte. Le scope `email` ajoute une ligne « voir votre adresse e-mail » sur l'ecran d'autorisation Discord : un peu plus de friction, et une demande a laquelle certains diront non. Le compteur serveur est en KV, donc **souple** comme les autres (il peut afficher une valeur en retard de quelques secondes). Enfin le parcours OAuth complet — clic, retour de Discord, verification d'appartenance — **n'a pas pu etre teste de bout en bout** : il faut se connecter avec un vrai compte Discord, ce que je ne fais pas a la place de quelqu'un.

---
### [2026-07-26 21:40] — Porte Discord pilotable + messages de refus qui convertissent

**Quoi :** Trois choses. La porte Discord devient activable par variable d'environnement, avec une securite anti-verrouillage. Les refus de quota portent desormais un encart de conversion vers TubeForge, affiche dans la page. Et le quota par personne devient reglable sans redeployer.

**Pourquoi :** demande du user — brancher la connexion Discord et preparer les messages « trop de telechargements ont ete faits par les membres du Discord, passez a TubeForge ». Le moment ou quelqu'un bute sur une limite est le SEUL ou il a une raison concrete de s'interesser au produit payant : c'est la qu'il faut parler, pas dans une banniere permanente.

**Porte Discord — pilotable, et impossible a se tirer dans le pied :**
`REQUIRE_DISCORD` est maintenant une variable (`"false"` aujourd'hui). Mais elle **ne se ferme que si l'application Discord est reellement configuree** : si `DISCORD_CLIENT_ID` ou `DISCORD_CLIENT_SECRET` valent encore le placeholder `0`, la porte reste ouverte quoi qu'on demande. Sans ce garde-fou, activer la porte avant de poser les secrets enfermerait **tout le monde dehors** — le bouton « Se connecter » renverrait une erreur Discord et plus personne ne pourrait telecharger. Mieux vaut un outil ouvert qu'un outil mort.

**Trois messages, trois situations :**
- **Plafond global atteint** : « Les membres du Discord ont epuise le quota du jour. L'outil est gratuit, donc partage entre tout le monde et forcement bride — il repart demain matin. » + encart « Ne plus dependre d'un quota partage ».
- **Quota personnel atteint** : « Tu as utilise tes 25 telechargements du jour. Le compteur repart demain a minuit. » + encart « Tu telecharges assez pour que ca vaille le coup ». (Singulier gere : « ton telechargement » si la limite vaut 1.)
- **Video bridee par YouTube** : le message ne promet plus rien, il explique — et l'encart dit *pourquoi* TubeForge n'a pas ce probleme : il passe par la connexion de l'utilisateur, pas par nos serveurs.

L'encart porte deux boutons (`Essayer 14 jours gratuitement` vers le checkout annuel, `Voir ce que fait TubeForge` vers la one-page), tous deux tracks, et une ligne qui dit franchement que la carte est demandee mais que rien n'est preleve avant 14 jours.

**Fichiers touches :**
- (hors repo) `tubeforge-webdl/src/index.js` — `gateActive(env)`, `dailyLimit(env)`, messages + `upsell` sur les trois refus
- (hors repo) `tubeforge-webdl/wrangler.toml` — `DAILY_LIMIT = "25"`, `REQUIRE_DISCORD = "false"`
- `src/lib/webdl.ts` — types `Upsell` et `ResolveFailure`
- `src/app/tubeforge/telecharger/page.tsx` — encart de conversion sous le message d'erreur

**Verification :** limite temporairement mise a 1 sur un worker de developpement -> refus au 1er appel avec `kind: 'quota-perso'`, le bon message et l'encart. Rendu de l'encart verifie en production (les deux boutons pointent au bon endroit). Config restauree, compteurs de test purges, prod re-verifiee (porte ouverte, quota 25).

**Comment annuler :** `REQUIRE_DISCORD` et `DAILY_LIMIT` sont des variables : les changer et redeployer. `git revert <hash>` retire l'encart.

**Effets de bord possibles :** l'encart n'apparait que sur les refus de quota, donc la plupart des visiteurs ne le verront jamais — c'est voulu, mais ca veut dire que le funnel ne se declenche que chez les utilisateurs intensifs. Le bloc de conversion pointe vers le checkout ANNUEL (`months=12`) : c'est le plan mis en avant sur la one-page, a changer si la strategie de prix bouge. Enfin, tant que les secrets Discord ne sont pas poses, `REQUIRE_DISCORD = "true"` **n'aura aucun effet** — c'est deliberе, et c'est verifiable via `gate` dans `/api/me`.

---
### [2026-07-26 20:45] — Le plafond que je venais de poser ne protegeait rien sur le plan gratuit

**Quoi :** `MAX_DAILY_RESOLVES` corrige de 3000 a **1200**, et la valeur a utiliser selon le plan est desormais ecrite dans le code et dans `wrangler.toml`.

**Pourquoi :** question du user — « donc si les 635 telechargent les 25 videos par jour ». En faisant le calcul, mon garde-fou etait mal calibre. Je l'avais dimensionne sur le forfait PAYANT (10 M requetes/mois, soit ~333 000/jour) alors que je venais de conseiller de rester en GRATUIT (100 000 requetes/JOUR, plafond DUR).

Resultat : avec un plafond a 3000 resolutions, le plafond dur de Cloudflare tombait le premier — vers **1315 telechargements** — et coupait le service pour tout le monde. **Un garde-fou pose au-dessus de la limite qu'il est censé proteger ne protege rien.** Il fallait le mettre en dessous : 1200.

**Les chiffres du scenario complet** (635 membres x 25 videos = 15 875 telechargements/jour) :

| | pire cas (441 Mo, 76 req) | realiste (150 Mo, 28 req) |
|---|---|---|
| requetes/jour | 1 206 500 | 444 500 |
| gratuit | coupe des **1 315** telechargements | coupe des **3 571** |
| payant | 5 $ + 7,86 $ = **12,86 $/mois** | 5 $ + 1 $ = **6 $/mois** |

Autrement dit : soutenir le Discord entier a son maximum theorique coute entre 6 et 13 $/mois. Le gratuit, lui, ne tient pas ce scenario — mais le plafond a 1200 fait que le service se bride proprement au lieu de tomber.

**Fichiers touches :**
- (hors repo) `tubeforge-webdl/src/index.js` — `MAX_DAILY_RESOLVES = 1200`, commentaire qui donne la valeur par plan et explique le piege
- (hors repo) `tubeforge-webdl/wrangler.toml` — `1200` avec les deux valeurs documentees (gratuit 1200 / payant 4385)

**Comment annuler :** remettre la valeur souhaitee dans `wrangler.toml` et redeployer.

**Effets de bord possibles :** 1200 resolutions/jour est un plafond BAS si l'outil prend — il se declenchera avant que le Discord entier n'en profite. C'est assume : mieux vaut brider tot et voir le message apparaitre (signal clair qu'il faut passer au payant et monter a 4385) que couper sans prevenir. **Lecon de methode : un garde-fou doit etre calibre sur la limite REELLE de l'environnement ou il tourne, pas sur celle d'un environnement qu'on envisage.**

---
### [2026-07-26 20:15] — Plafond de depense construit a la main (Cloudflare n'en propose aucun)

**Quoi :** Un plafond GLOBAL de resolutions par jour (`MAX_DAILY_RESOLVES`, 3000 par defaut) dans le Worker, et la duree de vie des URLs de relais ramenee de 6 h a 2 h.

**Pourquoi :** question directe du user — « en payant 5 $ je peux me retrouver a etre facture plus, non ? ». **Oui.** Verifie le 26/07/2026 : le plan payant facture 0,30 $ par million de requetes au-dela du forfait, et **Cloudflare ne propose AUCUN reglage de plafond de facturation** — c'est une demande recurrente de leur communaute, jamais implementee. La seule borne technique disponible est le CPU par invocation, qui ne limite pas la depense totale. Sans garde-fou maison, un partage qui prend ou un abus transforme « 5 $/mois » en montant inconnu.

**Le calcul derriere le 3000 :** une resolution entraine jusqu'a ~76 appels au relais (video de 441 Mo en tranches de 6 Mo). 3000 x 76 = 228 000 requetes/jour, soit **~6,8 M/mois — sous les 10 M inclus dans le forfait a 5 $**. Autrement dit, meme dans le pire des cas ou tous les telechargements sont des videos longues, la facture reste a 5 $. Le quota par IP (25/jour) ne protegeait que contre un utilisateur seul ; celui-la protege la facture.

**Duree de vie des signatures ramenee a 2 h :** une resolution donnait auparavant six heures de relais a qui gardait le lien. Un fichier de 441 Mo descend en ~2 minutes, donc 2 h reste tres large et reduit d'autant la fenetre d'abus.

**Fichiers touches :**
- (hors repo) `tubeforge-webdl/src/index.js` — `MAX_DAILY_RESOLVES`, compteur KV `g:<date>` verifie AVANT le quota individuel, message `plafond-global`
- (hors repo) `tubeforge-webdl/src/auth.js` — `signUrl` par defaut a 2 h
- (hors repo) `tubeforge-webdl/wrangler.toml` — variable `MAX_DAILY_RESOLVES = "3000"`, reglable sans toucher au code

**Verification :** plafond temporairement mis a 1 sur un worker de developpement — 1er appel OK, 2e et 3e bloques avec `kind: 'plafond-global'` et un message qui explique que l'outil est gratuit donc bride et qu'il repart demain. Plafond restaure a 3000, compteurs de test purges, prod re-verifiee (resolution OK, `android_vr`, 1080p).

**Comment annuler :** changer `MAX_DAILY_RESOLVES` dans `wrangler.toml` puis `npx wrangler deploy`. Mettre une valeur tres haute revient a retirer le plafond.

**Effets de bord possibles :** le compteur global est en KV, donc **souple** comme celui par IP (coherence eventuelle : on peut depasser de quelques unites en rafale) — suffisant pour un garde-fou de facturation, pas pour de la comptabilite. Quand le plafond tombe, il tombe pour TOUT LE MONDE jusqu'au lendemain : c'est voulu (mieux vaut un service bride qu'une facture surprise), mais ca veut dire qu'un abus peut priver les vrais utilisateurs — le quota de 25/IP limite deja ce risque. Enfin le plafond compte les RESOLUTIONS, pas les octets : quelqu'un qui garde une URL signee peut encore consommer du relais pendant 2 h sans passer par le compteur.

---
### [2026-07-26 19:30] — Limite portee a 25/jour + nouvel essai par tranche (403 sporadiques)

**Quoi :** `DAILY_LIMIT` passe de 10 a 25 telechargements par jour et par IP. Et surtout : chaque tranche a desormais droit a 4 essais, parce qu'un seul refus tuait tout le telechargement.

**Pourquoi le nouvel essai :** en mesurant la capacite, j'ai trouve que googlevideo refuse **sporadiquement** des tranches parfaitement valides — 1 refus sur 6 a 12 requetes, **sans lien avec le parallelisme** (teste a 1, 3, 6 et 12 connexions : 0/1, 3/3, 5/6, 11/12). Sur une video de 426 Mo decoupee en 75 tranches, abandonner au premier refus revient a ne presque jamais finir. C'est probablement la vraie cause de l'« echec tranche 6 » que j'avais mis sur le compte du plafond iOS : il y avait DEUX causes, pas une. Correctif : 4 tentatives par tranche, attente croissante + gigue.

**Capacite mesuree.** Le mur n'est pas la bande passante (Cloudflare ne facture pas l'egress des Workers) mais le **nombre de requetes**, et il est domine par le decoupage en tranches de 6 Mo :

| cas | poids | requetes Cloudflare |
|---|---|---|
| TikTok / X / Twitch | 20 Mo | **1** en direct, 5 si repli relais |
| YouTube ~5 min 1080p | 80 Mo | 16 |
| YouTube ~15 min 1080p | 441 Mo | 76 |
| YouTube ~1 h | 490 Mo | 84 |

Sur le plan **gratuit** (100 000 requetes/jour) : ~20 000 telechargements/jour de TikTok/X/Twitch, ~6 250 de YouTube courts, ~1 315 de YouTube de 15 min. Avec la limite de 25/jour/personne : **~52 personnes/jour** si tout le monde prend du 15 min, ~250 sur du court, ~800 sur du TikTok. Sur le plan **payant** ($5/mois, ~333 000 requetes/jour) : x3,3.

**Sur la simultaneite :** aucune limite de notre cote (Workers montent en charge tout seuls, et on n'utilise qu'**1 sous-requete** par invocation sur les 50 autorisees). Le facteur limitant observe est googlevideo lui-meme, et il ne depend pas du nombre de personnes : les refus sont sporadiques a tous les niveaux de parallelisme. Debit mesure : 4 a 8 Mo/s par telechargement, et une taille de tranche plus grosse ne gagne rien (6 Mo : 6,5 Mo/s ; 24 Mo : 2,7 Mo/s ; 48 Mo : 4,6 Mo/s) — donc **inutile d'augmenter la tranche pour economiser des requetes**, ca coute du debit.

**Fichiers touches :**
- (hors repo) `tubeforge-webdl/src/index.js` — `DAILY_LIMIT = 25`
- `src/lib/webdl.ts` — 4 essais par tranche dans `fetchChunked`, message d'erreur qui donne le rang de la tranche et le code

**Comment annuler :** remettre `DAILY_LIMIT = 10` et `npx wrangler deploy` ; `git revert <hash>` pour le nouvel essai.

**Effets de bord possibles :** 25/jour/personne multiplie par 2,5 la consommation de requetes par utilisateur actif — sur le plan gratuit, une cinquantaine de personnes qui telechargent des videos de 15 min suffiraient a epuiser le quota journalier. **Le plan Workers n'a pas pu etre determine depuis la configuration** (aucune fonctionnalite payante utilisee) : a verifier dans le tableau de bord Cloudflare, car c'est ce qui separe ~1 300 et ~4 400 telechargements/jour. Le nouvel essai par tranche peut masquer une degradation reelle de YouTube en la transformant en lenteur plutot qu'en erreur — le message d'erreur final donne desormais le code HTTP pour qu'on puisse quand meme le voir.

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
