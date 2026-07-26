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
