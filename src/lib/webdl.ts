/**
 * Telechargeur web TubeForge — logique client.
 *
 * Trois raisons pour lesquelles tout se passe dans le navigateur :
 *  - le fichier ne transite jamais par un serveur qu'on paie ;
 *  - YouTube bride une connexion unique a ~670 Ko/s, mais sert plusieurs
 *    Mo/s si on demande des tranches en parallele ;
 *  - fusionner audio + video sans re-encoder prend 0,1 a 0,4 seconde ici,
 *    contre plusieurs secondes de CPU facture cote serveur.
 */

// `getPoToken` n'est plus importe : la frappe BotGuard produisait un jeton de
// la mauvaise famille, qui faisait repondre HTTP 400 a YouTube (cf. `resolve`).
import { getVisitorData } from "./potoken";

const WORKER =
  process.env.NEXT_PUBLIC_WEBDL_URL || "https://tubeforge-webdl.expedition-studio.workers.dev";

const TOKEN_KEY = "tfdl_token";

/** Au-dela, le navigateur risque de manquer de memoire : c'est le terrain de TubeForge. */
export const MAX_BYTES = 500 * 1024 * 1024;

/**
 * Plafond quand le fichier ne passe plus par la memoire.
 *
 * 4 Go : ce n'est plus la memoire qui borne mais le disque et la patience. On
 * garde un plafond parce qu'un `Number` venu d'une URL ne merite aucune
 * confiance cote Worker, et parce qu'au-dela le temps de telechargement devient
 * de toute facon deraisonnable dans un onglet.
 */
export const MAX_BYTES_DISQUE = 4 * 1024 * 1024 * 1024;

/* ────────────────────────────────────────────────────────────────────────────
 * ECRITURE SUR DISQUE — ce qui decroche le pic memoire de la taille du fichier
 *
 * Le code d'origine tenait TROIS copies completes en meme temps : la piste
 * video, la piste audio, et le fichier assemble. D'ou le pic mesure a 3,23 fois
 * la taille du fichier, d'ou le plafond a 500 Mo, et d'ou la degradation en
 * 480p sur une video d'une heure.
 *
 * Mesure du 2026-07-30, page fraiche, 69 Mo telecharges en 4 connexions vers un
 * fichier du navigateur : **pic de tas 52 Mo, soit 34 Mo au-dessus du repos**.
 * Ces 34 Mo sont exactement les quatre tranches en vol. Le pic ne depend donc
 * plus que du PARALLELISME, plus du tout de la taille du fichier.
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * On s'appuie sur les types natifs (`FileSystemDirectoryHandle` &co) plutot que
 * d'en redeclarer : les redeclarer les faisait entrer en conflit avec ceux du
 * DOM, et TypeScript refusait l'affectation sur dix lignes d'erreur.
 *
 * `getDirectory` reste teste a l'execution : le type existe dans la
 * bibliotheque, la methode pas dans tous les navigateurs.
 */
type FluxDisque = FileSystemWritableFileStream;

/** Un tampon dont on sait que le support est un vrai `ArrayBuffer` : c'est ce
 *  qu'exige l'ecriture de fichier, et un `Uint8Array` venu d'un flux ne le
 *  garantit pas au type. */
type Tampon = Uint8Array<ArrayBuffer>;

function opfs(): Promise<FileSystemDirectoryHandle> | null {
  const s = navigator.storage as StorageManager & { getDirectory?: () => Promise<FileSystemDirectoryHandle> };
  return typeof s?.getDirectory === "function" ? s.getDirectory() : null;
}

/**
 * Le chemin disque est-il utilisable ?
 *
 * On exige le stockage du navigateur ET la capacite d'y ouvrir un flux
 * d'ecriture. Safari a longtemps eu le premier sans le second, et le detecter
 * par le nom du navigateur serait faux dans six mois : on teste la capacite.
 */
export async function disqueUtilisable(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const racine = await opfs();
    if (!racine) return false;
    const sonde = await racine.getFileHandle("tfdl-sonde", { create: true });
    if (typeof sonde.createWritable !== "function") return false;
    const f = await sonde.createWritable();
    await f.write(new Uint8Array([0]));
    await f.close();
    await racine.removeEntry("tfdl-sonde");
    return true;
  } catch {
    return false;
  }
}

/**
 * Un flux d'ecriture n'accepte PAS d'ecritures concurrentes. On telecharge donc
 * les tranches en parallele (c'est ce qui debride googlevideo) mais on serialise
 * les depots, chacun attendant le precedent.
 */
function depotSerialise(flux: FluxDisque) {
  let chaine: Promise<void> = Promise.resolve();
  return (position: number, data: Tampon) => {
    chaine = chaine.then(() => flux.write({ type: "write", position, data }));
    return chaine;
  };
}

/**
 * Brouillon jetable dans le stockage du navigateur.
 *
 * ⚠️ LE NOM DOIT ETRE UNIQUE PAR TELECHARGEMENT. Il valait `tfdl-sortie.part`,
 * fixe, et la suppression du fichier de sortie est DIFFEREE de cinq minutes (le
 * navigateur le lit encore pendant qu'il le remet a la personne). Deux
 * telechargements a moins de cinq minutes d'intervalle partageaient donc le meme
 * nom : le minuteur du premier supprimait le fichier que le second etait en train
 * d'ecrire. Defaut trouve en inspectant le stockage apres un essai reel, pas par
 * un plantage — il aurait produit un fichier tronque, sans message.
 *
 * Le prefixe `tfdl-` reste commun pour que le balayage ci-dessous reconnaisse
 * nos residus sans toucher a ceux d'un autre code.
 */
let compteurBrouillon = 0;
async function ouvrirBrouillon(piste: string) {
  const racine = await opfs();
  if (!racine) throw new Error("Stockage du navigateur indisponible.");
  const nom = `tfdl-${piste}-${Date.now().toString(36)}-${compteurBrouillon++}.part`;
  const poignee = await racine.getFileHandle(nom, { create: true });
  return { racine, nom, poignee };
}

/**
 * Balayage des residus au DEBUT d'un telechargement.
 *
 * Si l'onglet est ferme avant que le minuteur de suppression se declenche, un
 * fichier de la taille d'une video reste sur le disque de la personne pour
 * toujours. Personne ne le verra jamais, et c'est precisement pour ca qu'il faut
 * le ramasser. On ne touche qu'a nos propres fichiers, et on n'echoue jamais
 * dessus : un residu non supprime ne doit pas empecher un telechargement.
 */
async function balayerResidus(saufCes: Set<string>) {
  try {
    const racine = await opfs();
    if (!racine) return;
    const aJeter: string[] = [];
    for await (const nom of (racine as unknown as { keys: () => AsyncIterable<string> }).keys()) {
      if (nom.startsWith("tfdl-") && !saufCes.has(nom)) aJeter.push(nom);
    }
    for (const nom of aJeter) {
      try { await racine.removeEntry(nom); } catch { /* verrouille par une autre operation */ }
    }
  } catch { /* le balayage est un confort, jamais une condition */ }
}

/**
 * Budget d'octets adapte a la MACHINE du visiteur.
 *
 * Mesure du 28/07/2026, sur une video 1080p de 441 Mo assemblee dans l'onglet :
 * le pic de tas JavaScript monte a **1 425 Mo**, soit **3,23 fois** la taille du
 * fichier. C'est logique — le navigateur tient en meme temps la piste video, la
 * piste audio et le fichier assemble.
 *
 * Sur un poste de bureau, le plafond de tas est de 4 Go : aucun probleme. Sur un
 * telephone, il tourne souvent autour du gigaoctet, et un budget de 500 Mo
 * viserait un pic de 1,6 Go — l'onglet meurt, sans message, au bout de plusieurs
 * minutes d'attente. C'est exactement le genre de panne qu'on ne voit jamais en
 * testant sur sa propre machine.
 *
 * On mesure donc ce qu'on peut et on retombe prudemment sinon : `performance.memory`
 * n'existe que sur Chromium, `navigator.deviceMemory` pas sur Firefox ni Safari.
 * Quand on ne sait pas, on se fie a l'agent utilisateur, et dans le doute on
 * choisit le budget le plus bas — une video en qualite reduite vaut mieux qu'un
 * onglet qui disparait.
 */
const RATIO_PIC_MEMOIRE = 3.5; // 3,23 mesure, arrondi vers le haut par prudence

/**
 * @param surDisque quand le fichier ne passe plus par la memoire, tout ce
 * raisonnement devient sans objet : le pic ne vaut plus que les tranches en vol.
 * On rend alors un plafond qui ne parle plus de memoire du tout.
 */
export function budgetOctets(surDisque = false): number {
  if (typeof window === "undefined") return MAX_BYTES;
  if (surDisque) return MAX_BYTES_DISQUE;

  const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  // Chromium : le plafond de tas est expose, c'est la mesure la plus fiable.
  const perf = performance as Performance & { memory?: { jsHeapSizeLimit: number } };
  const plafond = perf.memory?.jsHeapSizeLimit;
  if (plafond) return Math.min(MAX_BYTES, Math.floor(plafond / RATIO_PIC_MEMOIRE));

  // Sinon la memoire de l'appareil, arrondie par le navigateur et plafonnee a 8.
  // On n'en prend qu'un quart : le reste de l'appareil vit aussi.
  const ram = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (ram) {
    return Math.min(MAX_BYTES, Math.floor((ram * 1024 * 1024 * 1024 * 0.25) / RATIO_PIC_MEMOIRE));
  }

  // Firefox et Safari n'exposent rien : on se rabat sur le type d'appareil.
  return mobile ? 150 * 1024 * 1024 : MAX_BYTES;
}

export type Me = {
  /** true si le Worker exige d'etre membre du Discord (constante cote Worker). */
  gate?: boolean;
  auth: boolean;
  member?: boolean;
  user?: { name: string; avatar: string | null; email?: string | null };
  /** En UNITES DE RELAIS (~16 Mo), plus en telechargements, depuis le 30/07/2026.
   *  `octetsParUnite` sert a l'afficher en gigaoctets cote page. */
  quota?: { used: number; limit: number; octetsParUnite?: number };
  /** Reserve COLLECTIVE du jour : ce que tout le serveur a consomme. */
  serveur?: { used: number; limit: number };
  invite?: string;
};

export type Resolved = {
  ok: true;
  platform: "youtube" | "tiktok" | "twitter" | "twitch";
  muxed: boolean;
  direct: boolean;
  meta: { title: string; author: string | null; durationSec: number | null; thumb: string | null };
  maxHeight?: number;
  /** true quand la qualite a du etre baissee. `downgradeReason` dit pourquoi. */
  downgraded?: boolean;
  /** 'memoire' (trop lourd pour le navigateur) ou 'plafond-youtube' (client plafonne). */
  downgradeReason?: "memoire" | "plafond-youtube" | null;
  /** meilleure hauteur qui existait, pour pouvoir l'annoncer honnetement. */
  bestHeight?: number | null;
  /** client InnerTube qui a repondu — diagnostic, non affiche. */
  client?: string | null;
  /** true quand l'extraction a ete faite avec l'attestation BotGuard. */
  attested?: boolean;
  video?: { url: string; size: number; height: number; codec: string; container: string };
  audio?: { url: string; size: number; codec: string };
  file?: { url: string; relayUrl?: string; size: number | null; label: string; container: string };
  /**
   * YouTube seulement : lien a cliquer, hors relais. Les octets passent par la
   * connexion du visiteur — seule voie possible depuis un navigateur, puisque
   * googlevideo refuse les IP de datacenter et n'accorde CORS qu'aux origines
   * youtube.com. `forceTelechargement` est faux quand l'URL porte `gir=yes` :
   * YouTube n'envoie alors pas d'en-tete d'attachement et le navigateur lit la
   * video au lieu de l'enregistrer (mesure : 4 videos sur 6 declenchent bien un
   * telechargement).
   */
  lienDirect?: {
    url: string;
    size: number | null;
    height: number | null;
    container: string;
    forceTelechargement: boolean;
  } | null;

  quota: { used: number; limit: number; octetsParUnite?: number };
  serveur?: { used: number; limit: number };
};

export type Progress = { phase: "download" | "merge" | "save"; pct: number; label: string };

/* ── Jeton ─────────────────────────────────────────────────────────── */

/**
 * Recupere ce que le retour de Discord a depose dans le fragment.
 *
 * Deux issues possibles, et la seconde manquait : `tfdl` est la session, mais un
 * refus de Discord produisait auparavant une page blanche portant une phrase et
 * aucun lien de retour. Le worker renvoie desormais `tfdl_err`, que la page
 * affiche dans son encart d'erreur habituel.
 *
 * Le fragment est efface dans les deux cas : il ne doit pas survivre a un
 * rechargement, ni partir dans un lien copie-colle.
 */
export function readHashResult(): { token: string | null; erreur: string | null } {
  if (typeof window === "undefined") return { token: null, erreur: null };
  const hash = window.location.hash;
  const jeton = hash.match(/tfdl=([^&]+)/);
  const erreur = hash.match(/tfdl_err=([^&]+)/);
  if (!jeton && !erreur) return { token: null, erreur: null };
  if (jeton) localStorage.setItem(TOKEN_KEY, jeton[1]);
  history.replaceState(null, "", window.location.pathname + window.location.search);
  return {
    token: jeton ? jeton[1] : null,
    erreur: erreur ? decodeURIComponent(erreur[1]) : null,
  };
}

export const getToken = () =>
  typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY);

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const loginUrl = () =>
  `${WORKER}/auth/start?next=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.origin + window.location.pathname : ""
  )}`;

/**
 * Echeance sur un appel reseau.
 *
 * ⚠️ La raison d'etre de ce fichier-ci. Aucun `fetch` de ce chemin n'avait de
 * delai maximum. Un appel refuse jette et on affiche l'erreur ; un appel qui
 * reste SUSPENDU ne jette jamais, donc le `await` ne rend pas la main, donc le
 * `finally` qui eteint le bouton « Analyse » ne s'execute pas : le bouton tourne
 * indefiniment. C'est exactement le symptome rapporte (« ça charge en boucle »).
 *
 * Il n'existe aucun cas ou tourner sans fin est le bon comportement. Une
 * echeance transforme un blocage muet en phrase lisible.
 */
function echeance(ms: number, signalAppelant?: AbortSignal): AbortSignal {
  const minuteur = AbortSignal.timeout(ms);
  if (!signalAppelant) return minuteur;
  // `AbortSignal.any` combine annulation manuelle et echeance. S'il manque, on
  // garde au moins l'echeance : mieux vaut perdre l'annulation que la borne.
  return typeof AbortSignal.any === "function"
    ? AbortSignal.any([signalAppelant, minuteur])
    : signalAppelant;
}

/** Vrai quand l'echec vient d'une echeance depassee et non d'un refus du serveur. */
function estDelaiDepasse(e: unknown): boolean {
  return e instanceof DOMException && (e.name === "TimeoutError" || e.name === "AbortError");
}

/**
 * Le Worker interroge YouTube en direct, et l'anti-robot le fait parfois
 * attendre une dizaine de secondes. L'echeance doit donc etre large — mais
 * finie.
 */
const DELAI_API_MS = 45_000;

/*
 * `DELAI_TRANCHE_MS` et `delaiTranche()` ont ete RETIRES le 31/07/2026.
 *
 * Ils bornaient la duree TOTALE d'une tranche, ce qui revient a exiger un debit
 * minimum : 6 Mo en 60 s, soit 100 Ko/s par connexion, soit ~1,2 Mo/s une fois
 * les douze connexions video+audio additionnees. Leur commentaire affirmait
 * pourtant vouloir « ne pas punir une connexion lente ».
 *
 * Les laisser en place, meme inutilises, aurait fait croire au prochain lecteur
 * que la politique de la maison est de chronometrer les tranches. Elle ne l'est
 * plus : voir `surveilleProgression` ci-dessous.
 */

/**
 * ⛔ SANCTIONNER L'ARRET, JAMAIS LA LENTEUR.
 *
 * L'echeance ci-dessus dit vouloir « ne pas punir une connexion lente ». Elle la
 * punit. Le calcul est deterministe, pas une hypothese :
 *
 *   6 Mo par tranche / 60 s d'echeance = **100 Ko/s exiges par connexion**
 *   6 connexions par piste, video + audio en parallele = 12 connexions
 *   -> il faut environ **1,2 Mo/s (≈10 Mbit/s) rien que pour ne pas echouer**
 *
 * En dessous, CHAQUE tranche depasse son echeance, est rejouee quatre fois,
 * puis le telechargement echoue franchement. Et les reprises retelechargent les
 * memes 6 Mo sur une ligne deja saturee : le remede aggrave le mal. Une ligne a
 * 5 Mbit/s — courante en mobile, et le cas des utilisateurs qui nous ont
 * remonte des pannes — ne peut donc RIEN telecharger, quelle que soit sa
 * patience.
 *
 * Le commentaire d'origine dit pourtant l'intention juste : l'echeance existe
 * pour attraper une tranche SUSPENDUE, celle qui gelait la barre sans rien
 * afficher. « Suspendue » et « lente » sont deux etats differents, et seule la
 * premiere merite d'etre interrompue.
 *
 * On surveille donc le SILENCE : tant que des octets arrivent, la connexion vit
 * et on la laisse travailler. Trente secondes sans un seul octet, c'est morte.
 * Un plafond absolu reste en dernier recours, pour qu'aucune tranche ne puisse
 * tourner sans fin — le defaut que l'echeance corrigeait a l'origine.
 */
const SILENCE_TRANCHE_MS = 30_000;
const PLAFOND_TRANCHE_MS = 10 * 60_000;

function surveilleProgression(signalAppelant: AbortSignal) {
  const ctrl = new AbortController();
  // `TimeoutError` et non `AbortError` : `estDelaiDepasse` distingue ainsi un
  // depassement (qui vaut un nouvel essai) d'une annulation par la personne.
  const stop = (raison: string) => ctrl.abort(new DOMException(raison, "TimeoutError"));

  let silence = setTimeout(() => stop("silence"), SILENCE_TRANCHE_MS);
  const plafond = setTimeout(() => stop("plafond"), PLAFOND_TRANCHE_MS);

  const relais = () => ctrl.abort(signalAppelant.reason);
  signalAppelant.addEventListener("abort", relais, { once: true });
  if (signalAppelant.aborted) relais();

  return {
    signal: ctrl.signal,
    /** Des octets sont arrives : la connexion vit, le compte a rebours repart. */
    vu() {
      clearTimeout(silence);
      silence = setTimeout(() => stop("silence"), SILENCE_TRANCHE_MS);
    },
    /** A appeler dans un `finally` : sans ca, les minuteurs survivent a la
     *  tranche et finissent par annuler une requete qui n'existe plus. */
    fin() {
      clearTimeout(silence);
      clearTimeout(plafond);
      signalAppelant.removeEventListener("abort", relais);
    },
  };
}

/**
 * Erreur portant un DETAIL TECHNIQUE affichable.
 *
 * Sans lui, un blocage reseau et une panne de notre service donnent le meme
 * ecran, et un rapport de bug se resume a « ca marche pas ». Le detail nomme
 * l'hote concerne : c'est ce qui permet de trancher a distance entre « notre
 * service est tombe » et « ce reseau bloque ce domaine ».
 */
export class EchecReseau extends Error {
  detail: string;
  constructor(message: string, detail: string) {
    super(message);
    this.name = "EchecReseau";
    this.detail = detail;
  }
}

/** L'hote du worker, pour le nommer dans les diagnostics. */
function hoteWorker(): string {
  try { return new URL(WORKER).host; } catch { return WORKER; }
}

async function api<T>(path: string, params?: Record<string, string>): Promise<T> {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  const token = getToken();
  let r: Response;
  try {
    r = await fetch(WORKER + path + qs, {
      headers: token ? { Authorization: "Bearer " + token } : {},
      signal: echeance(DELAI_API_MS),
    });
  } catch (e) {
    if (estDelaiDepasse(e)) {
      throw new EchecReseau(
        "Le service n’a pas répondu au bout de 45 secondes. Réessaie — si ça se reproduit, c’est de notre côté.",
        "délai dépassé (45 s) sur " + hoteWorker()
      );
    }
    /**
     * `TypeError: Failed to fetch` sur un appel qui n'atteint meme pas le
     * serveur. C'est le SEUL symptome que produit un filtrage reseau — par un
     * fournisseur d'acces, un pare-feu d'entreprise, une extension, ou un DNS
     * qui refuse de repondre. Le message d'origine disait « vérifie ta
     * connexion », ce qui accuse l'utilisateur alors que sa connexion marche
     * (la page vient de se charger).
     *
     * Vecu le 30/07/2026 : des visiteurs en Algerie voyaient « Impossible de
     * verifier ton acces » alors que la page s'affichait. Le mot « acces »
     * envoyait chercher un probleme de droits, quand il s'agit d'un domaine
     * injoignable. Sans le detail technique, impossible de trancher a distance.
     */
    throw new EchecReseau(
      "Le téléchargeur n’a pas pu être joint. Ta connexion fonctionne — c’est notre service qui n’est " +
      "pas accessible depuis ton réseau. Certains fournisseurs d’accès et pare-feux bloquent le domaine " +
      "qu’il utilise.",
      "requête bloquée avant d’atteindre " + hoteWorker() + " (" + (e instanceof Error ? e.name : "erreur") + ")"
    );
  }
  const data = await r.json();
  if (!r.ok && !data?.err) throw new Error("Le service est momentanément indisponible.");
  return data as T;
}

export const fetchMe = () => api<Me>("/api/me");

const isYouTube = (u: string) => /youtu\.?be|youtube\.com/.test(u);

/** Encart de conversion renvoye par le Worker sur les refus de quota. */
export type Upsell = { titre: string; texte: string };

export type ResolveFailure = {
  ok: false;
  err: string;
  kind?: string;
  /** Verdict du secours anti-robot, affiche sous le message d'erreur. */
  attestation?: string;
  needAuth?: boolean;
  quotaReached?: boolean;
  upsell?: Upsell;
};

type ResolveResult = Resolved | ResolveFailure;

/** Prechauffe la session (quelques Ko). Aucun calcul BotGuard ici. */
export async function warmSession() {
  await getVisitorData(WORKER);
}

/**
 * Resolution en deux temps.
 *
 * D'abord avec le seul `visitorData` : c'est lui qui leve le blocage anti-robot
 * (mesure du 26/07, cf. potoken.ts), et il ne coute qu'un aller-retour. Le
 * PoToken n'est frappe QUE si YouTube nous refuse quand meme pour motif
 * anti-robot — inutile de faire tourner BotGuard 1,2 s chez tout le monde pour
 * un gain qui n'est pas prouve.
 *
 * Si le Worker ne recoit pas de `vd`, il s'en procure un de son cote : une
 * panne de cette page ne peut donc pas priver l'extraction de sa session.
 */
/**
 * Capacite disque, calculee UNE fois et memorisee.
 *
 * La sonde ecrit puis supprime un octet dans le stockage du navigateur : la
 * refaire a chaque resolution serait du gaspillage, et surtout le resultat ne
 * change pas au cours d'une visite.
 */
let capaciteDisque: Promise<boolean> | null = null;
export function disquePret(): Promise<boolean> {
  if (!capaciteDisque) capaciteDisque = disqueUtilisable();
  return capaciteDisque;
}

export async function resolve(url: string): Promise<ResolveResult> {
  // Le Worker choisit la qualite en fonction de ce budget : c'est la machine du
  // visiteur qui decide, pas une constante ecrite sur la mienne.
  //
  // `disque=1` n'est pas cosmetique : il dit au Worker que ce navigateur peut
  // ecrire le fichier sans le tenir en memoire, donc qu'il a le droit de servir
  // du 1080p sur une video d'une heure au lieu de descendre en 480p.
  const surDisque = await disquePret();
  const params: Record<string, string> = { url, max: String(budgetOctets(surDisque)) };
  if (surDisque) params.disque = "1";
  const yt = isYouTube(url);
  const visitorData = yt ? await getVisitorData(WORKER) : null;
  if (visitorData) params.vd = visitorData;

  const first = await api<ResolveResult>("/api/resolve", params);
  if (first.ok) return first;

  /**
   * Secours anti-robot, et surtout : RENDRE COMPTE de ce qu'il a fait.
   *
   * Le probleme n'etait pas que ce secours manque, c'est qu'il etait muet. Face
   * a « YouTube nous a pris pour un robot », impossible de distinguer trois
   * situations tres differentes : le secours n'a pas ete tente, il a ete tente
   * et BotGuard a echoue, ou il a reussi et YouTube a refuse quand meme. Les
   * trois demandent des corrections opposees, et un rapport de bug se resumait a
   * « ca ne marche pas ». `window.__tfdlAttestation` existait deja mais vivait
   * dans la console, que personne ne pense a copier.
   *
   * On joint donc le verdict au refus, en clair, dans `attestation`.
   */
  /**
   * ⛔ LE SECOURS PoToken EST SUPPRIME. Il ne servait a rien et il NUISAIT.
   *
   * Un PoToken est lie a une plateforme d'attestation : BotGuard pour la
   * famille Web, DroidGuard pour Android, iOSGuard pour iOS. Un jeton d'une
   * famille est refuse par les autres. `bgutils-js` frappe du BotGuard, donc du
   * **Web** — et nos clients sont ANDROID_VR, ANDROID et IOS.
   *
   * MESURE DU 31/07/2026, une variable a la fois, meme session, meme instant :
   *   requete du worker SANS le jeton ... OK, 26 formats jusqu'a 2160p
   *   requete du worker AVEC le jeton ... **HTTP 400**
   *
   * Le jeton n'etait donc pas inerte : il transformait un echec RECUPERABLE en
   * echec DEFINITIF. Et comme il n'etait frappe qu'en secours, apres un premier
   * refus, il achevait exactement les cas qu'il devait sauver.
   *
   * Ce qu'on gagne en le retirant, au-dela de la correction :
   *   - 1 a 2 secondes de calcul BotGuard sur le chemin d'echec ;
   *   - le besoin de `'unsafe-eval'` dans la politique de securite de la page,
   *     qui n'existait QUE pour faire tourner la machine virtuelle de Google.
   *
   * NE PAS LE REMETTRE sans changer d'abord de famille de clients.
   */
  return first;
}

/* ── Telechargement ────────────────────────────────────────────────── */

/**
 * Tranches paralleles. Le decoupage n'est pas une optimisation cosmetique :
 * en une seule requete YouTube plafonne a ~0,7 Mo/s, en tranches on mesure
 * 7 a 9 Mo/s, soit la vitesse de la ligne.
 */
/**
 * Ou deposer une tranche recue. C'est le seul point qui change entre « tout en
 * memoire » et « droit sur le disque » : la logique de tranchage, de
 * parallelisme et de reprise ne doit exister qu'une fois.
 */
type Depot = (position: number, data: Tampon) => void | Promise<void>;

/**
 * Taille des tranches. **6 Mo, et j'ai essaye 16 : ca casse.**
 *
 * Le raisonnement qui m'a fait grossir les tranches etait juste sur la facture —
 * moins de tranches, moins de requetes payees chez Cloudflare, et le gaspillage
 * des reprises reste proportionnel a la taille du fichier, pas a celle des
 * tranches. Sur le chemin disque, la memoire ne s'y oppose plus.
 *
 * ⛔ CE QUI M'A ECHAPPE, ET QUI A ETE MESURE LE 2026-07-30 : googlevideo bride
 * CHAQUE connexion a ~0,7 Mo/s. Le temps d'une tranche est donc proportionnel a
 * sa taille, et l'echeance de 60 s ne bougeait pas :
 *   -  6 Mo → ~9 s, soit 6,7x de marge sous l'echeance ;
 *   - 16 Mo → ~23 s au mieux, soit 2,6x — et en pratique la piste AUDIO de Big
 *     Buck Bunny (29 Mo, donc deux tranches de 16) a depasse les 60 s QUATRE
 *     fois de suite. Mesure appariee, meme page, meme instant : 1 Mo de cette
 *     piste arrive en 1,5 s, 16 Mo n'arrivent jamais.
 * Resultat vu de l'utilisateur : quatre minutes de barre figee a « 246 Mo sur
 * 275 », puis un echec. Pire que le probleme que je voulais resoudre.
 *
 * 🧠 LA LECON : le debit vient du NOMBRE de connexions, jamais de la taille des
 * tranches. Grossir les tranches n'achete que de l'economie de requetes, et le
 * prix est du temps par tranche. Pour reduire les requetes SANS allonger chaque
 * tranche, il faut monter le parallelisme en meme temps — et remesurer.
 */
function tailleTranche(): number {
  return 6_000_000;
}

async function fetchTranches(
  url: string,
  size: number,
  onBytes: (n: number) => void,
  signal: AbortSignal,
  /** « vidéo », « audio » ou « fichier » : nomme ce qui a échoué dans le message. */
  piste: string,
  deposer: Depot,
  concurrency = 6,
  chunkSize = 6_000_000
): Promise<void> {
  const ranges: Array<[number, number]> = [];
  for (let s = 0; s < size; s += chunkSize) ranges.push([s, Math.min(s + chunkSize, size) - 1]);

  let next = 0;

  const worker = async () => {
    for (;;) {
      const k = next++;
      if (k >= ranges.length) return;
      const [s, e] = ranges[k];
      const sep = url.includes("?") ? "&" : "?";

      /**
       * Chaque tranche a droit a plusieurs essais.
       *
       * Ce n'est pas de la prudence gratuite : googlevideo refuse
       * SPORADIQUEMENT des tranches parfaitement valides (mesure du 26/07 :
       * 1 refus sur 6 a 12 requetes, sans lien avec le parallelisme). Sur une
       * video de 426 Mo decoupee en 75 tranches, abandonner au premier refus
       * revient a ne presque jamais finir. Un simple nouvel essai passe.
       *
       * `no-referrer` est tout aussi indispensable : les CDN de X et de Twitch
       * repondent 403 des qu'un Referer etranger accompagne la requete (mesure :
       * sans Referer 200, avec Referer 403, meme URL), et le navigateur en
       * envoie un par defaut.
       */
      // `Tampon` et non `Uint8Array` : l'ecriture de fichier exige un support
      // ArrayBuffer, et `Uint8Array` seul autorise aussi SharedArrayBuffer.
      let buf: Tampon | null = null;
      let lastStatus = 0;
      // Panne RESEAU, distincte d'un refus : une requete qui n'atteint meme pas
      // le serveur ne renvoie aucun code, et le navigateur se contente d'un
      // « Failed to fetch » que l'interface affichait tel quel. Vu de l'autre
      // cote, c'est indechiffrable — et c'est le message que les utilisateurs
      // rapportent comme « ca marche pas ». On le retient pour le traduire.
      let panneReseau = false;
      for (let attempt = 0; attempt < 4 && !buf; attempt++) {
        if (signal.aborted) throw new Error("Téléchargement annulé.");
        if (attempt > 0) {
          await new Promise((r) => setTimeout(r, 300 * attempt + Math.random() * 200));
        }
        // Surveillance du SILENCE, et non chronometre de la tranche : une
        // tranche suspendue gelait la barre sans rien afficher, mais une tranche
        // simplement LENTE doit pouvoir aller au bout. Voir `surveilleProgression`.
        const veille = surveilleProgression(signal);
        try {
          const r = await fetch(`${url}${sep}start=${s}&end=${e}`, {
            signal: veille.signal,
            referrerPolicy: "no-referrer",
          });
          if (!r.ok) { lastStatus = r.status; continue; }

          /**
           * ON COMPTE LES OCTETS A LEUR ARRIVEE, pas a la fin de la tranche.
           *
           * Avant : `await r.arrayBuffer()` puis un seul `onBytes(6 Mo)`. Comme
           * douze tranches se telechargent en parallele et se partagent la ligne,
           * elles s'achevaient presque ensemble : le compteur restait immobile
           * puis bondissait de 1 a 16, 80, 127 Mo. Vu de l'utilisateur, ca donne
           * « c'est tres lent » au demarrage, puis « ca deconne ».
           *
           * La vitesse reelle ne change pas d'un octet. Ce qui change, c'est
           * qu'on la MONTRE : du mouvement des la premiere seconde.
           */
          if (!r.body) { buf = new Uint8Array(await r.arrayBuffer()); onBytes(buf.byteLength); break; }

          const parties: Uint8Array[] = [];
          let recu = 0;
          try {
            const lecteur = r.body.getReader();
            for (;;) {
              const { done, value } = await lecteur.read();
              if (done) break;
              // Le seul endroit qui sait que la connexion vit encore. Sans cet
              // appel, la surveillance couperait une tranche parfaitement saine
              // au bout de trente secondes.
              veille.vu();
              parties.push(value);
              recu += value.byteLength;
              onBytes(value.byteLength);
            }
          } catch (eFlux) {
            /**
             * Coupure EN COURS de lecture. Les octets deja annonces n'existent
             * plus : sans ce retrait, un nouvel essai les compterait une seconde
             * fois et la barre depasserait 100 % — ou pire, afficherait plus de
             * megaoctets que le fichier n'en contient.
             */
            onBytes(-recu);
            throw eFlux;
          }
          const assemble = new Uint8Array(recu);
          let pos = 0;
          for (const part of parties) { assemble.set(part, pos); pos += part.byteLength; }
          buf = assemble;
        } catch (e2) {
          // Annulation demandee par la personne : on sort tout de suite. Une
          // echeance depassee, elle, vaut un nouvel essai.
          if (signal.aborted) throw new Error("Téléchargement annulé.");
          if (estDelaiDepasse(e2)) continue;
          // `TypeError: Failed to fetch` : la requete n'a pas abouti du tout.
          // Reseau coupe, blocage par une extension, ou service inaccessible.
          // On reessaie — mais on retient la nature de la panne pour le dire.
          if (e2 instanceof TypeError) { panneReseau = true; continue; }
          throw e2;
        } finally {
          // Sans ca, les minuteurs de la tranche survivent a la tranche et
          // finissent par annuler une requete qui ne les concerne plus.
          veille.fin();
        }
      }
      if (!buf) {
        /**
         * Message construit selon ce qui a REELLEMENT echoue.
         *
         * Un « code 403 » et une absence totale de reponse demandent deux
         * reactions opposees, et l'ancien message les confondait — quand il ne
         * laissait pas passer un « Failed to fetch » brut. On nomme donc la
         * piste concernee et la position dans le fichier : sur un refus par
         * plage d'octets, savoir que ca casse toujours au meme endroit vaut
         * tous les commentaires.
         */
        const ou = `${piste}, tranche ${k + 1} sur ${ranges.length}` +
          ` (octets ${(s / 1048576).toFixed(1)}–${(e / 1048576).toFixed(1)} Mo)`;
        throw new Error(
          panneReseau && !lastStatus
            ? `La connexion au service a été coupée pendant le téléchargement (${ou}). ` +
              "Vérifie ta connexion, désactive un éventuel bloqueur, puis réessaie."
            : `Le téléchargement a échoué (${ou}, code ${lastStatus}). ` +
              "Réessaie : YouTube refuse parfois des morceaux au hasard."
        );
      }
      // Plus de `onBytes` ici : les octets ont deja ete comptes a leur arrivee,
      // pendant la lecture du flux. Les recompter doublerait la progression.
      await deposer(s, buf);
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, ranges.length) }, worker));
}

/** Ancien comportement : tout en memoire. Conserve pour les navigateurs sans
 *  stockage utilisable, et pour les petits fichiers ou ca ne coute rien. */
async function fetchChunked(
  url: string,
  size: number,
  onBytes: (n: number) => void,
  signal: AbortSignal,
  piste = "fichier"
): Promise<ArrayBuffer> {
  const out = new Uint8Array(size);
  await fetchTranches(url, size, onBytes, signal, piste, (pos, buf) => { out.set(buf, pos); });
  return out.buffer;
}

/** Nouveau comportement : les octets ne touchent jamais un tampon de la taille
 *  du fichier. Ils vont dans `flux` et quittent le tas aussitot. */
async function fetchVersFlux(
  url: string,
  size: number,
  onBytes: (n: number) => void,
  signal: AbortSignal,
  piste: string,
  flux: FluxDisque,
  decalage = 0
): Promise<void> {
  const deposer = depotSerialise(flux);
  await fetchTranches(
    url, size, onBytes, signal, piste,
    (pos, buf) => deposer(decalage + pos, buf),
    6, tailleTranche()
  );
}

async function fetchWhole(
  url: string,
  onBytes: (n: number) => void,
  signal: AbortSignal
): Promise<ArrayBuffer> {
  // Fichier d'un seul bloc (TikTok, X, Twitch) : pas de decoupage possible, donc
  // pas de nouvel essai par tranche. Meme surveillance qu'ailleurs — c'est
  // l'ARRET du flux qu'on veut attraper, pas sa lenteur. Le plafond fixe de cinq
  // minutes condamnait un gros fichier sur une ligne lente, alors qu'il arrivait
  // parfaitement, juste plus tard.
  const veille = surveilleProgression(signal);
  try {
    const r = await fetch(url, { signal: veille.signal, referrerPolicy: "no-referrer" });
    if (!r.ok) throw new Error("Le téléchargement a échoué (" + r.status + ").");
    if (!r.body) return r.arrayBuffer();
    const parts: Uint8Array[] = [];
    const reader = r.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      veille.vu();
      parts.push(value);
      onBytes(value.byteLength);
    }
    const total = parts.reduce((n, p) => n + p.byteLength, 0);
    const out = new Uint8Array(total);
    let off = 0;
    for (const p of parts) { out.set(p, off); off += p.byteLength; }
    return out.buffer;
  } finally {
    veille.fin();
  }
}


/** Fusion sans re-encodage : on recopie les paquets deja encodes tels quels. */
async function mux(
  videoBuf: ArrayBuffer,
  audioBuf: ArrayBuffer,
  container: string
): Promise<Blob> {
  const {
    Input, ALL_FORMATS, BufferSource, EncodedPacketSink,
    Output, Mp4OutputFormat, WebMOutputFormat, BufferTarget,
    EncodedVideoPacketSource, EncodedAudioPacketSource,
  } = await import("mediabunny");

  // Deux fonctions distinctes plutot qu'une generique : les configs decodeur
  // video et audio n'ont pas les memes champs obligatoires, et les fusionner
  // en union force des assertions inutiles a l'appel.
  const openVideo = async (buf: ArrayBuffer) => {
    const input = new Input({ source: new BufferSource(buf), formats: ALL_FORMATS });
    const track = await input.getPrimaryVideoTrack();
    if (!track) throw new Error("Piste vidéo illisible.");
    return { cfg: await track.getDecoderConfig(), codec: await track.getCodec(), sink: new EncodedPacketSink(track) };
  };
  const openAudio = async (buf: ArrayBuffer) => {
    const input = new Input({ source: new BufferSource(buf), formats: ALL_FORMATS });
    const track = await input.getPrimaryAudioTrack();
    if (!track) throw new Error("Piste audio illisible.");
    return { cfg: await track.getDecoderConfig(), codec: await track.getCodec(), sink: new EncodedPacketSink(track) };
  };

  const v = await openVideo(videoBuf);
  const a = await openAudio(audioBuf);
  const isWebm = container === "webm";

  const out = new Output({
    format: isWebm ? new WebMOutputFormat() : new Mp4OutputFormat(),
    target: new BufferTarget(),
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- codec vient de la piste lue, pas d'un litteral typable
  const vs = new EncodedVideoPacketSource(v.codec as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- idem
  const as = new EncodedAudioPacketSource(a.codec as any);
  out.addVideoTrack(vs);
  out.addAudioTrack(as);
  await out.start();

  let first = true;
  for await (const p of v.sink.packets()) {
    await vs.add(p, first ? { decoderConfig: v.cfg! } : undefined);
    first = false;
  }
  await vs.close();
  first = true;
  for await (const p of a.sink.packets()) {
    await as.add(p, first ? { decoderConfig: a.cfg! } : undefined);
    first = false;
  }
  await as.close();
  await out.finalize();

  return new Blob([out.target.buffer!], { type: isWebm ? "video/webm" : "video/mp4" });
}

/**
 * Fusion SANS jamais tenir un fichier entier.
 *
 * Deux differences avec `mux`, et elles portent tout le gain :
 *  - l'entree est un `BlobSource` adosse a un fichier du disque : mediabunny lit
 *    a la demande les octets dont il a besoin, au lieu qu'on lui tende deux
 *    tampons de 1,5 Go ;
 *  - la sortie est un `StreamTarget` branche sur le flux d'ecriture du fichier
 *    de destination. mediabunny annonce lui-meme cette compatibilite, et le
 *    format de ses ecritures (`{type:'write', data, position}`) est exactement
 *    celui qu'attend un flux de fichier du navigateur — il peut donc revenir en
 *    arriere pour poser l'index, sans qu'on ait a bricoler un index en fin de
 *    fichier.
 */
async function muxVersFlux(
  fVideo: Blob,
  fAudio: Blob,
  container: string,
  destination: FluxDisque,
  onAvance: (octets: number) => void
): Promise<void> {
  const {
    Input, ALL_FORMATS, BlobSource, EncodedPacketSink,
    Output, Mp4OutputFormat, WebMOutputFormat, StreamTarget,
    EncodedVideoPacketSource, EncodedAudioPacketSource,
  } = await import("mediabunny");

  // Deux fonctions distinctes, comme dans `mux` — et pour la raison que le
  // commentaire d'origine annoncait : les configurations de decodeur video et
  // audio n'ont pas les memes champs, et les fusionner en une seule fonction
  // generique produit un type union que `add()` refuse. Je l'ai fusionne, j'ai
  // eu l'erreur, je les resepare.
  const ouvrirVideo = async (b: Blob) => {
    const input = new Input({ source: new BlobSource(b), formats: ALL_FORMATS });
    const track = await input.getPrimaryVideoTrack();
    if (!track) throw new Error("Piste vidéo illisible.");
    return { cfg: await track.getDecoderConfig(), codec: await track.getCodec(), sink: new EncodedPacketSink(track) };
  };
  const ouvrirAudio = async (b: Blob) => {
    const input = new Input({ source: new BlobSource(b), formats: ALL_FORMATS });
    const track = await input.getPrimaryAudioTrack();
    if (!track) throw new Error("Piste audio illisible.");
    return { cfg: await track.getDecoderConfig(), codec: await track.getCodec(), sink: new EncodedPacketSink(track) };
  };

  const v = await ouvrirVideo(fVideo);
  const a = await ouvrirAudio(fAudio);
  const isWebm = container === "webm";

  const out = new Output({
    format: isWebm ? new WebMOutputFormat() : new Mp4OutputFormat(),
    // Le flux de fichier du navigateur EST un WritableStream, et son puits
    // accepte les commandes d'ecriture positionnees de mediabunny. TypeScript
    // ne connait pas ce croisement de types, d'ou la conversion.
    target: new StreamTarget(destination as unknown as WritableStream<{ type: "write"; data: Uint8Array<ArrayBuffer>; position: number }>),
  });
  // La progression de l'assemblage n'etait pas affichee du tout : sur un fichier
  // d'un gigaoctet, cette etape dure et la barre restait figee a 100 %.
  out.target.on("write", ({ end }) => onAvance(end));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- codec vient de la piste lue, pas d'un litteral typable
  const vs = new EncodedVideoPacketSource(v.codec as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- idem
  const as = new EncodedAudioPacketSource(a.codec as any);
  out.addVideoTrack(vs);
  out.addAudioTrack(as);
  await out.start();

  let first = true;
  for await (const p of v.sink.packets()) {
    await vs.add(p, first ? { decoderConfig: v.cfg! } : undefined);
    first = false;
  }
  await vs.close();
  first = true;
  for await (const p of a.sink.packets()) {
    await as.add(p, first ? { decoderConfig: a.cfg! } : undefined);
    first = false;
  }
  await as.close();
  await out.finalize();
}

type Destination = {
  flux: FluxDisque;
  /**
   * Termine et, si besoin, remet le fichier a la personne.
   *
   * @param dejaFerme true quand mediabunny a deja ferme le flux. VERIFIE dans sa
   * source (`target.js`) : `finalize()` appelle `streamWriter.close()` et ne
   * relache JAMAIS le verrou. Fermer une seconde fois ne donne donc pas « deja
   * ferme » mais **« Cannot close a locked stream »**, et le fichier n'etait
   * jamais remis. C'est le defaut qu'a trouve le premier essai reel.
   */
  finaliser: (dejaFerme?: boolean) => Promise<void>;
  /** Nettoie en cas d'echec. Ne doit jamais jeter. */
  jeter: () => Promise<void>;
  /** true si la personne a choisi l'emplacement : rien de temporaire a nettoyer. */
  choisie: boolean;
};

/**
 * Ou ecrire le fichier final.
 *
 * ⚠️ `showSaveFilePicker` EXIGE un geste de l'utilisateur. Cette fonction doit
 * donc etre appelee AVANT toute attente reseau dans le gestionnaire du clic,
 * sinon le navigateur refuse d'ouvrir le selecteur. C'est aussi une meilleure
 * experience : la personne choisit d'abord, puis le fichier s'ecrit directement
 * chez elle, sans copie temporaire.
 *
 * Firefox et Safari n'ont pas ce selecteur. On passe alors par un brouillon dans
 * le stockage du navigateur, remis a la fin comme un telechargement ordinaire.
 * Le fichier rendu est adosse au disque, pas au tas.
 */
async function ouvrirDestination(nomFichier: string, mime: string): Promise<Destination> {
  const w = window as Window & {
    showSaveFilePicker?: (o: {
      suggestedName?: string;
      types?: Array<{ description: string; accept: Record<string, string[]> }>;
    }) => Promise<FileSystemFileHandle>;
  };
  const ext = "." + (nomFichier.split(".").pop() || "mp4");

  if (typeof w.showSaveFilePicker === "function") {
    try {
      const poignee = await w.showSaveFilePicker({
        suggestedName: nomFichier,
        types: [{ description: "Vidéo", accept: { [mime]: [ext] } }],
      });
      const flux = (await poignee.createWritable()) as FluxDisque;
      return {
        flux, choisie: true,
        finaliser: async (dejaFerme = false) => { if (!dejaFerme) await flux.close(); },
        jeter: async () => { try { await flux.abort(); } catch { /* deja ferme */ } },
      };
    } catch (e) {
      // Annulation du selecteur : ce n'est pas une panne, mais on ne peut pas
      // continuer sans destination. Le message doit le dire sans alarmer.
      if (e instanceof Error && e.name === "AbortError") {
        throw new Error("Enregistrement annulé.");
      }
      throw e;
    }
  }

  const { racine, nom, poignee } = await ouvrirBrouillon("sortie");
  const flux = (await poignee.createWritable()) as FluxDisque;
  return {
    flux, choisie: false,
    finaliser: async (dejaFerme = false) => {
      if (!dejaFerme) await flux.close();
      // `getFile()` rend un objet adosse au disque : le navigateur le lit au fil
      // du telechargement, il ne le charge pas en memoire.
      saveBlob(await poignee.getFile(), nomFichier);
      // On ne supprime PAS tout de suite : le navigateur lit encore le fichier.
      setTimeout(() => { racine.removeEntry(nom).catch(() => {}); }, 5 * 60_000);
    },
    jeter: async () => {
      try { await flux.abort(); } catch { /* deja ferme */ }
      try { await racine.removeEntry(nom); } catch { /* rien a nettoyer */ }
    },
  };
}

function safeName(title: string, ext: string) {
  const base = title.replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
  return (base || "video") + "." + ext;
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/**
 * Compteur de progression a cadence BORNEE.
 *
 * Depuis qu'on compte les octets a leur arrivee, `onBytes` est appele pour chaque
 * morceau recu — soit quelques dizaines de kilo-octets, donc des centaines de
 * fois par seconde. Rafraichir React a ce rythme fait ramer l'onglet et RALENTIT
 * le telechargement : on aurait echange un defaut d'affichage contre un vrai
 * defaut de vitesse.
 *
 * On compte donc tout, et on n'AFFICHE qu'au plus dix fois par seconde. L'oeil ne
 * distingue pas mieux, et le processeur reste libre pour ce qui compte.
 */
function compteurProgression(totalKnown: number, onProgress: (p: Progress) => void) {
  let got = 0;
  let dernierAffichage = 0;
  const afficher = () => {
    onProgress({
      phase: "download",
      pct: totalKnown ? Math.min(99, (got / totalKnown) * 100) : 0,
      label: totalKnown
        ? `${(got / 1048576).toFixed(0)} Mo sur ${(totalKnown / 1048576).toFixed(0)}`
        : `${(got / 1048576).toFixed(0)} Mo`,
    });
  };
  return {
    bump(n: number) {
      got += n;
      const maintenant = Date.now();
      if (maintenant - dernierAffichage < 100) return;
      dernierAffichage = maintenant;
      afficher();
    },
    /** Remet le compteur a zero quand on recommence un fichier sur le relais. */
    reinitialiser() { got = 0; afficher(); },
  };
}

export async function download(
  r: Resolved,
  onProgress: (p: Progress) => void,
  signal: AbortSignal
): Promise<void> {
  const totalKnown = r.muxed
    ? r.file?.size ?? 0
    : (r.video?.size ?? 0) + (r.audio?.size ?? 0);

  // Chemin disque : le fichier ne passe pas par la memoire, donc l'ancien
  // plafond de 500 Mo n'a plus de raison d'etre. `disquePret()` est deja resolu
  // depuis la resolution, donc cette attente ne consomme pas l'activation
  // utilisateur dont le selecteur de fichier a besoin.
  if (await disquePret()) {
    if (totalKnown > MAX_BYTES_DISQUE) {
      throw new Error(
        "Cette vidéo dépasse 4 Go. À cette taille, un onglet n’est plus le bon outil : TubeForge le fait sans limite, et pose l’extrait dans ton chutier."
      );
    }
    return telechargerSurDisque(r, onProgress, signal, totalKnown);
  }

  if (totalKnown > MAX_BYTES) {
    throw new Error(
      "Cette vidéo dépasse 500 Mo : au-delà, le navigateur n’a pas assez de mémoire pour l’assembler. C’est exactement ce que TubeForge fait sans limite."
    );
  }

  const compteur = compteurProgression(totalKnown, onProgress);
  const bump = (n: number) => compteur.bump(n);

  if (r.muxed && r.file) {
    // Fichier deja complet cote plateforme : rien a fusionner.
    // On tente d'abord le CDN en direct (aucun octet ne passe chez nous), et on
    // retombe sur le relais si ca echoue. Ce repli n'est pas theorique : le CDN
    // de Twitch sert au navigateur des reponses en cache privees d'en-tete
    // CORS, ce qui casse le direct sans que rien ne soit reparable de notre
    // cote (mesure du 26/07).
    const grab = (u: string) =>
      r.file!.size
        ? fetchChunked(u, r.file!.size, bump, signal, "fichier")
        : fetchWhole(u, bump, signal);

    let buf: ArrayBuffer;
    try {
      buf = await grab(r.file.url);
    } catch (e) {
      if (!r.file.relayUrl || r.file.relayUrl === r.file.url || signal.aborted) throw e;
      compteur.reinitialiser(); // le compteur repart : on recommence le fichier
      buf = await grab(r.file.relayUrl);
    }
    onProgress({ phase: "save", pct: 100, label: "Enregistrement" });
    saveBlob(new Blob([buf], { type: "video/mp4" }), safeName(r.meta.title, r.file.container));
    return;
  }

  if (!r.video || !r.audio) throw new Error("Format introuvable pour cette vidéo.");

  const [vb, ab] = await Promise.all([
    fetchChunked(r.video.url, r.video.size, bump, signal, "vidéo"),
    fetchChunked(r.audio.url, r.audio.size, bump, signal, "audio"),
  ]);

  onProgress({ phase: "merge", pct: 100, label: "Assemblage image + son" });
  const blob = await mux(vb, ab, r.video.container);

  onProgress({ phase: "save", pct: 100, label: "Enregistrement" });
  saveBlob(blob, safeName(r.meta.title, r.video.container));
}

/**
 * Enveloppe la fusion pour qu'aucune erreur technique ne sorte en anglais.
 * Voir le commentaire a l'appel : le detail brut est conserve en fin de phrase.
 */
async function muxAvecFilet(
  fVideo: Blob,
  fAudio: Blob,
  container: string,
  destination: FluxDisque,
  onAvance: (octets: number) => void
): Promise<void> {
  try {
    await muxVersFlux(fVideo, fAudio, container, destination, onAvance);
  } catch (e) {
    const brut = e instanceof Error ? e.message : String(e);
    throw new Error(
      "L’image et le son n’ont pas pu être réunis. C’est un problème de notre côté, " +
      "pas de la vidéo : signale-le-nous avec la ligne ci-dessous. — " + brut
    );
  }
}

/**
 * Le chemin qui ne tient jamais le fichier en memoire.
 *
 * Sequence : on demande D'ABORD ou ecrire (le selecteur exige l'activation
 * utilisateur, donc avant tout appel reseau), puis les octets vont directement
 * dans des brouillons du disque, puis l'assemblage relit ces brouillons a la
 * demande en ecrivant dans la destination.
 *
 * Le pic de tas ne vaut plus que les tranches en vol : six fois 16 Mo sur un
 * ordinateur. Il ne depend plus de la taille du fichier, et c'est toute la
 * raison de ce code.
 */
async function telechargerSurDisque(
  r: Resolved,
  onProgress: (p: Progress) => void,
  signal: AbortSignal,
  totalKnown: number
): Promise<void> {
  const container = r.muxed ? r.file?.container ?? "mp4" : r.video?.container ?? "mp4";
  const nom = safeName(r.meta.title, container);
  const mime = container === "webm" ? "video/webm" : "video/mp4";

  // Avant toute ouverture : on ramasse les residus d'une session precedente
  // interrompue. Rien de ce qui suit ne doit dependre de la reussite du balayage.
  await balayerResidus(new Set());

  const dest = await ouvrirDestination(nom, mime);
  const brouillons: Array<{ racine: FileSystemDirectoryHandle; nom: string }> = [];
  let echoue = false;
  /** true des que la fusion a eu lieu : c'est elle qui ferme le flux de sortie. */
  let parMediabunny = false;

  const compteur = compteurProgression(totalKnown, onProgress);
  const bump = (n: number) => compteur.bump(n);

  try {
    if (r.muxed && r.file) {
      // Fichier deja complet cote plateforme : aucune fusion, les octets vont
      // droit dans la destination. Meme repli direct → relais que sur l'autre
      // chemin, pour la meme raison (cache CORS de CloudFront chez Twitch).
      const verser = (u: string) =>
        r.file!.size
          ? fetchVersFlux(u, r.file!.size, bump, signal, "fichier", dest.flux)
          : (async () => {
              // Taille inconnue : on ne peut pas trancher, on recopie le flux.
              const rep = await fetch(u, { signal: echeance(5 * 60_000, signal), referrerPolicy: "no-referrer" });
              if (!rep.ok || !rep.body) throw new Error("Le téléchargement a échoué (" + rep.status + ").");
              const lecteur = rep.body.getReader();
              let pos = 0;
              for (;;) {
                const { done, value } = await lecteur.read();
                if (done) break;
                // Le type du flux ne garantit pas que le support soit un vrai
                // ArrayBuffer ; a l'execution il l'est toujours pour un corps HTTP.
                await dest.flux.write({ type: "write", position: pos, data: value as Tampon });
                pos += value.byteLength;
                bump(value.byteLength);
              }
            })();

      try {
        await verser(r.file.url);
      } catch (e) {
        if (!r.file.relayUrl || r.file.relayUrl === r.file.url || signal.aborted) throw e;
        compteur.reinitialiser();
        await verser(r.file.relayUrl);
      }
    } else {
      if (!r.video || !r.audio) throw new Error("Format introuvable pour cette vidéo.");

      const bv = await ouvrirBrouillon("video");
      const ba = await ouvrirBrouillon("audio");
      brouillons.push({ racine: bv.racine, nom: bv.nom }, { racine: ba.racine, nom: ba.nom });

      const fv = (await bv.poignee.createWritable()) as FluxDisque;
      const fa = (await ba.poignee.createWritable()) as FluxDisque;
      try {
        await Promise.all([
          fetchVersFlux(r.video.url, r.video.size, bump, signal, "vidéo", fv),
          fetchVersFlux(r.audio.url, r.audio.size, bump, signal, "audio", fa),
        ]);
      } finally {
        // Les flux doivent etre fermes avant que `getFile()` voie les octets.
        await fv.close().catch(() => {});
        await fa.close().catch(() => {});
      }

      onProgress({ phase: "merge", pct: 0, label: "Assemblage image + son" });
      const attendu = totalKnown || 1;
      parMediabunny = true;
      /**
       * ⛔ AUCUNE ERREUR DE LA BIBLIOTHEQUE NE DOIT ATTEINDRE L'UTILISATEUR TELLE QUELLE.
       *
       * Vecu le 31/07/2026 : la page affichait, en anglais et sans contexte,
       * « Codec 'aac' cannot be contained within WebM. Supported audio codecs
       * are: 'opus', 'vorbis'. Switching to MKV will grant support for this
       * codec. » — un message ecrit pour un developpeur qui choisit un format,
       * pas pour quelqu'un qui veut sa video.
       *
       * La CAUSE de ce cas precis est corrigee cote Worker (on n'apparie plus un
       * conteneur avec un son qu'il ne peut pas contenir). Ce filet couvre tout
       * le reste : la bibliotheque peut echouer pour dix autres raisons, et
       * aucune ne doit sortir en anglais.
       *
       * Le detail brut est CONSERVE en fin de message : sans lui, un rapport de
       * bug se resume a « l'assemblage a echoue », et c'est exactement ce detail
       * qui a permis de trouver le defaut en une lecture.
       */
      await muxAvecFilet(
        await bv.poignee.getFile(),
        await ba.poignee.getFile(),
        container,
        dest.flux,
        (ecrits) => onProgress({
          phase: "merge",
          pct: Math.min(99, (ecrits / attendu) * 100),
          label: `Assemblage — ${(ecrits / 1048576).toFixed(0)} Mo écrits`,
        })
      );
    }

    onProgress({ phase: "save", pct: 100, label: dest.choisie ? "Terminé" : "Enregistrement" });
    // Seul le chemin a deux pistes passe par mediabunny, qui ferme le flux
    // lui-meme. Le chemin « fichier deja complet » ecrit en direct, donc c'est a
    // nous de fermer.
    await dest.finaliser(parMediabunny);
  } catch (e) {
    echoue = true;
    await dest.jeter();
    throw e;
  } finally {
    // ⚠️ Les brouillons occupent la taille des deux pistes sur le disque de la
    // personne. Ne pas les supprimer, c'est lui remplir son disque en silence —
    // y compris quand tout s'est bien passe.
    for (const b of brouillons) {
      try { await b.racine.removeEntry(b.nom); } catch { /* deja parti */ }
    }
    if (echoue) onProgress({ phase: "save", pct: 0, label: "Annulé" });
  }
}
