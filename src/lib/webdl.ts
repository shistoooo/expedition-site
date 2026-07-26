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

import { getPoToken, getVisitorData } from "./potoken";

const WORKER =
  process.env.NEXT_PUBLIC_WEBDL_URL || "https://tubeforge-webdl.expedition-studio.workers.dev";

const TOKEN_KEY = "tfdl_token";

/** Au-dela, le navigateur risque de manquer de memoire : c'est le terrain de TubeForge. */
export const MAX_BYTES = 500 * 1024 * 1024;

export type Me = {
  /** true si le Worker exige d'etre membre du Discord (constante cote Worker). */
  gate?: boolean;
  auth: boolean;
  member?: boolean;
  user?: { name: string; avatar: string | null; email?: string | null };
  quota?: { used: number; limit: number };
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
  quota: { used: number; limit: number };
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

async function api<T>(path: string, params?: Record<string, string>): Promise<T> {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  const token = getToken();
  const r = await fetch(WORKER + path + qs, {
    headers: token ? { Authorization: "Bearer " + token } : {},
  });
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
export async function resolve(url: string): Promise<ResolveResult> {
  const params: Record<string, string> = { url };
  const yt = isYouTube(url);
  const visitorData = yt ? await getVisitorData(WORKER) : null;
  if (visitorData) params.vd = visitorData;

  const first = await api<ResolveResult>("/api/resolve", params);
  if (first.ok || !yt || !visitorData) return first;
  if (!("kind" in first) || first.kind !== "bot") return first;

  const poToken = await getPoToken(visitorData);
  if (!poToken) return first;
  return api<ResolveResult>("/api/resolve", { ...params, pot: poToken });
}

/* ── Telechargement ────────────────────────────────────────────────── */

/**
 * Tranches paralleles. Le decoupage n'est pas une optimisation cosmetique :
 * en une seule requete YouTube plafonne a ~0,7 Mo/s, en tranches on mesure
 * 7 a 9 Mo/s, soit la vitesse de la ligne.
 */
async function fetchChunked(
  url: string,
  size: number,
  onBytes: (n: number) => void,
  signal: AbortSignal,
  concurrency = 6,
  chunkSize = 6_000_000
): Promise<ArrayBuffer> {
  const ranges: Array<[number, number]> = [];
  for (let s = 0; s < size; s += chunkSize) ranges.push([s, Math.min(s + chunkSize, size) - 1]);

  const out = new Uint8Array(size);
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
      let buf: Uint8Array | null = null;
      let lastStatus = 0;
      for (let attempt = 0; attempt < 4 && !buf; attempt++) {
        if (signal.aborted) throw new Error("Téléchargement annulé.");
        if (attempt > 0) {
          await new Promise((r) => setTimeout(r, 300 * attempt + Math.random() * 200));
        }
        const r = await fetch(`${url}${sep}start=${s}&end=${e}`, { signal, referrerPolicy: "no-referrer" });
        if (r.ok) buf = new Uint8Array(await r.arrayBuffer());
        else lastStatus = r.status;
      }
      if (!buf) {
        throw new Error(
          `Le téléchargement a échoué (tranche ${k + 1} sur ${ranges.length}, code ${lastStatus}). ` +
          "Réessaie : YouTube refuse parfois des morceaux au hasard."
        );
      }
      out.set(buf, s);
      onBytes(buf.byteLength);
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, ranges.length) }, worker));
  return out.buffer;
}

async function fetchWhole(
  url: string,
  onBytes: (n: number) => void,
  signal: AbortSignal
): Promise<ArrayBuffer> {
  const r = await fetch(url, { signal, referrerPolicy: "no-referrer" });
  if (!r.ok) throw new Error("Le téléchargement a échoué (" + r.status + ").");
  if (!r.body) return r.arrayBuffer();
  const parts: Uint8Array[] = [];
  const reader = r.body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    parts.push(value);
    onBytes(value.byteLength);
  }
  const total = parts.reduce((n, p) => n + p.byteLength, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const p of parts) { out.set(p, off); off += p.byteLength; }
  return out.buffer;
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

export async function download(
  r: Resolved,
  onProgress: (p: Progress) => void,
  signal: AbortSignal
): Promise<void> {
  const totalKnown = r.muxed
    ? r.file?.size ?? 0
    : (r.video?.size ?? 0) + (r.audio?.size ?? 0);

  if (totalKnown > MAX_BYTES) {
    throw new Error(
      "Cette vidéo dépasse 500 Mo : au-delà, le navigateur n’a pas assez de mémoire pour l’assembler. C’est exactement ce que TubeForge fait sans limite."
    );
  }

  let got = 0;
  const bump = (n: number) => {
    got += n;
    onProgress({
      phase: "download",
      pct: totalKnown ? Math.min(99, (got / totalKnown) * 100) : 0,
      label: totalKnown
        ? `${(got / 1048576).toFixed(0)} Mo sur ${(totalKnown / 1048576).toFixed(0)}`
        : `${(got / 1048576).toFixed(0)} Mo`,
    });
  };

  if (r.muxed && r.file) {
    // Fichier deja complet cote plateforme : rien a fusionner.
    // On tente d'abord le CDN en direct (aucun octet ne passe chez nous), et on
    // retombe sur le relais si ca echoue. Ce repli n'est pas theorique : le CDN
    // de Twitch sert au navigateur des reponses en cache privees d'en-tete
    // CORS, ce qui casse le direct sans que rien ne soit reparable de notre
    // cote (mesure du 26/07).
    const grab = (u: string) =>
      r.file!.size
        ? fetchChunked(u, r.file!.size, bump, signal)
        : fetchWhole(u, bump, signal);

    let buf: ArrayBuffer;
    try {
      buf = await grab(r.file.url);
    } catch (e) {
      if (!r.file.relayUrl || r.file.relayUrl === r.file.url || signal.aborted) throw e;
      got = 0; // le compteur repart : on recommence le fichier
      buf = await grab(r.file.relayUrl);
    }
    onProgress({ phase: "save", pct: 100, label: "Enregistrement" });
    saveBlob(new Blob([buf], { type: "video/mp4" }), safeName(r.meta.title, r.file.container));
    return;
  }

  if (!r.video || !r.audio) throw new Error("Format introuvable pour cette vidéo.");

  const [vb, ab] = await Promise.all([
    fetchChunked(r.video.url, r.video.size, bump, signal),
    fetchChunked(r.audio.url, r.audio.size, bump, signal),
  ]);

  onProgress({ phase: "merge", pct: 100, label: "Assemblage image + son" });
  const blob = await mux(vb, ab, r.video.container);

  onProgress({ phase: "save", pct: 100, label: "Enregistrement" });
  saveBlob(blob, safeName(r.meta.title, r.video.container));
}
