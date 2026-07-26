/**
 * Session YouTube et attestation BotGuard.
 *
 * ⚠️ Ce qui leve le blocage « Connectez-vous pour confirmer que vous n'etes pas
 * un robot », c'est le **visitorData**, PAS le PoToken. Variable isolee le
 * 26/07/2026 sur le client android_vr : sans visitorData, 2 videos sur 4 sont
 * refusees ; avec le visitorData SEUL et aucun jeton, 4 sur 4 passent. Un test
 * apparie visitorData seul contre visitorData + vrai PoToken donne 4/6 contre
 * 3/6 — du bruit. Ma premiere conclusion attribuait le merite au jeton parce
 * que je les envoyais toujours ENSEMBLE : la variable n'etait pas isolee.
 *
 * Consequence de conception : le visitorData ne doit JAMAIS dependre de
 * BotGuard. Le Worker sait desormais s'en procurer un tout seul, et les deux
 * fonctions ci-dessous sont separees pour qu'un echec de frappe n'emporte
 * jamais la session avec lui.
 *
 * Le jeton reste en place, mais en SECOURS a la demande : il n'est frappe que
 * si une resolution est refusee pour motif anti-robot. Sa valeur reelle n'est
 * pas prouvee ; il coute ~1,2 s et exige `'unsafe-eval'` (CSP scopee a cette
 * seule page), donc on ne le paie plus a chaque visite.
 *
 * L'API BotGuard (`jnn-pa.googleapis.com`) renvoie notre origine dans
 * Access-Control-Allow-Origin : tout se fait dans le navigateur, sans relais.
 */

const WAA = "https://jnn-pa.googleapis.com/$rpc/google.internal.waa.v1.Waa";
const REQUEST_KEY = "O43z0dpjhgX20SCx4KAo";
const WAA_HEADERS = {
  "content-type": "application/json+protobuf",
  "x-goog-api-key": "AIzaSyDyT5W0Jh49F30Pqqtyfdf7pDLFKLJoAnw",
  "x-user-agent": "grpc-web-javascript/0.1",
};

const CACHE_KEY = "tfdl_pot";
/** Les jetons vivent plusieurs heures ; on reste large sous cette limite. */
const CACHE_TTL_MS = 3 * 3600 * 1000;

export type Attestation = { visitorData: string; poToken: string };

/**
 * Etat de la derniere tentative, expose sur `window`. Sans ca, une attestation
 * qui echoue est totalement muette (on continue sans, par conception) et un
 * rapport de bug se resume a « c'est lent » : c'est le seul moyen de savoir,
 * depuis la console d'un utilisateur, si BotGuard a marche et sinon pourquoi.
 */
declare global {
  interface Window {
    __tfdlAttestation?: { ok: boolean; err?: string; ms?: number; tokenLength?: number };
  }
}

type Cached = Attestation & { ts: number };

function readCache(visitorData: string): string | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Cached;
    // Un jeton est lie a UN visitorData : si la session a tourne, il est mort.
    if (c.visitorData !== visitorData) return null;
    if (Date.now() - c.ts > CACHE_TTL_MS) return null;
    return c.poToken;
  } catch {
    return null;
  }
}

function writeCache(a: Attestation) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...a, ts: Date.now() }));
  } catch {
    /* mode navigation privee : on regenerera, sans casser */
  }
}

async function mint(visitorData: string): Promise<string> {
  const { getChallenge, BotGuardClient } = await import("bgutils-js/botguard");
  const { WebPoMinter } = await import("bgutils-js/webpo");

  const challenge = await getChallenge({
    requestKey: REQUEST_KEY,
    fetchFunction: (entree: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) =>
      fetch(entree, { ...init, signal: AbortSignal.timeout(10_000) }),
  });
  if (!challenge) throw new Error("défi BotGuard vide");

  // L'interpreteur est du JavaScript a executer : il installe la VM sur
  // `window[globalName]`. C'est le seul moyen de la charger.
  const raw = challenge.interpreterJavascript as unknown;
  const js =
    typeof raw === "string"
      ? raw
      : (raw as { privateDoNotAccessOrElseSafeScriptWrappedValue?: string })
          ?.privateDoNotAccessOrElseSafeScriptWrappedValue;
  if (!js) throw new Error("interpréteur BotGuard absent");

  const el = document.createElement("script");
  el.textContent = js;
  document.head.appendChild(el);
  await new Promise((r) => setTimeout(r, 250));

  // `globalName` est le nom sous lequel l'interpreteur publie la VM. S'il
  // manque, rien ne peut fonctionner : autant le dire clairement.
  const globalName = challenge.globalName;
  if (!globalName) throw new Error("BotGuard n'a pas fourni de nom d'objet global");

  const bg = await BotGuardClient.create({
    program: challenge.program,
    globalName,
    globalObject: window,
  });

  const webPoSignalOutput: unknown[] = [];
  const botguardResponse = await bg.snapshot({ webPoSignalOutput } as never);
  if (!botguardResponse) throw new Error("attestation BotGuard vide");

  const itRes = await fetch(WAA + "/GenerateIT", {
    method: "POST",
    headers: WAA_HEADERS,
    body: JSON.stringify([REQUEST_KEY, botguardResponse]),
    signal: AbortSignal.timeout(10_000),
  });
  if (!itRes.ok) throw new Error("jeton d'intégrité refusé (" + itRes.status + ")");
  const itData = (await itRes.json()) as unknown[];
  if (!itData?.[0]) throw new Error("jeton d'intégrité vide");

  const minter = await WebPoMinter.create({ integrityToken: itData[0] } as never, webPoSignalOutput as never);
  const poToken = await minter.mintAsWebsafeString(visitorData);
  if (!poToken) throw new Error("PoToken vide");
  return poToken;
}

/**
 * Renvoie une attestation utilisable, depuis le cache si possible.
 * Ne jette JAMAIS : sans jeton le telechargeur fonctionne encore (la chaine de
 * clients passe souvent), il est juste plus fragile. Une attestation ratee ne
 * doit pas empecher un telechargement.
 */
let sessionCache: { visitorData: string; ts: number } | null = null;

/**
 * Le visitorData de la session, sans jamais toucher a BotGuard.
 * C'est la piece qui compte : elle doit rester disponible meme si tout le
 * reste tombe. Le Worker en a un de secours de son cote.
 */
export async function getVisitorData(workerUrl: string): Promise<string | null> {
  if (sessionCache && Date.now() - sessionCache.ts < CACHE_TTL_MS) return sessionCache.visitorData;
  try {
    // Echeance courte et volontairement stricte : cet appel est sur le chemin de
    // CHAQUE resolution YouTube, et sans borne il suffisait qu'il reste suspendu
    // pour que le bouton tourne sans fin. Le Worker sait se procurer un
    // visitorData de son cote, donc renoncer ici ne casse rien.
    const sess = await fetch(workerUrl + "/api/session", {
      signal: AbortSignal.timeout(8_000),
    }).then((r) => r.json());
    const visitorData: string | undefined = sess?.visitorData;
    if (!visitorData) return null;
    sessionCache = { visitorData, ts: Date.now() };
    return visitorData;
  } catch {
    return null;
  }
}

/** Frappe (ou relit) un PoToken lie a ce visitorData. Ne jette jamais. */
export async function getPoToken(visitorData: string): Promise<string | null> {
  const t0 = Date.now();
  try {
    const cached = readCache(visitorData);
    if (cached) {
      window.__tfdlAttestation = { ok: true, ms: Date.now() - t0, tokenLength: cached.length };
      return cached;
    }
    // Borne GLOBALE, en plus des echeances sur les deux appels reseau de `mint`.
    // L'essentiel du travail se passe dans une machine virtuelle JavaScript
    // fournie par Google (`bg.snapshot()`) : aucun signal d'annulation ne
    // l'interrompt, et rien ne garantit qu'elle rende la main. Une course contre
    // un minuteur est le seul moyen de reprendre la main — le jeton n'est qu'un
    // secours, donc y renoncer coute moins cher qu'un bouton qui tourne sans fin.
    const poToken = await Promise.race([
      mint(visitorData),
      new Promise<never>((_, rejeter) =>
        setTimeout(() => rejeter(new Error("BotGuard n’a pas répondu en 20 s")), 20_000)
      ),
    ]);
    writeCache({ visitorData, poToken });
    window.__tfdlAttestation = { ok: true, ms: Date.now() - t0, tokenLength: poToken.length };
    return poToken;
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    window.__tfdlAttestation = { ok: false, err, ms: Date.now() - t0 };
    console.warn("[tubeforge] attestation indisponible, on continue sans :", err);
    return null;
  }
}
