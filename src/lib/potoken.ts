/**
 * PoToken : l'attestation « un vrai navigateur, une vraie personne ».
 *
 * Le probleme qu'il resout : notre Worker interroge YouTube depuis les IP de
 * Cloudflare, et au-dela d'un certain volume YouTube repond « Connectez-vous
 * pour confirmer que vous n'etes pas un robot ». Le jeton contourne ca non pas
 * en cachant l'IP, mais en prouvant qu'un vrai navigateur est derriere : c'est
 * BotGuard, la machine virtuelle de Google, qui tourne ICI, dans la page du
 * visiteur, et signe une attestation liee a la session (`visitorData`).
 *
 * Mesure du 26/07/2026, meme video au meme instant depuis l'edge Cloudflare :
 *   client android_vr — sans jeton : LOGIN_REQUIRED / « ...pas un robot »
 *                       avec jeton : OK, 23 formats, 1080p
 *   client ios        — sans jeton : HTTP 403
 *                       avec jeton : OK, 28 formats, 1080p
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
    fetchFunction: (...args: Parameters<typeof fetch>) => fetch(...args),
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
export async function getAttestation(workerUrl: string): Promise<Attestation | null> {
  const t0 = Date.now();
  try {
    const sess = await fetch(workerUrl + "/api/session").then((r) => r.json());
    const visitorData: string | undefined = sess?.visitorData;
    if (!visitorData) throw new Error("session YouTube indisponible");

    const cached = readCache(visitorData);
    if (cached) {
      window.__tfdlAttestation = { ok: true, ms: Date.now() - t0, tokenLength: cached.length };
      return { visitorData, poToken: cached };
    }

    const poToken = await mint(visitorData);
    const att = { visitorData, poToken };
    writeCache(att);
    window.__tfdlAttestation = { ok: true, ms: Date.now() - t0, tokenLength: poToken.length };
    return att;
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e);
    window.__tfdlAttestation = { ok: false, err, ms: Date.now() - t0 };
    console.warn("[tubeforge] attestation indisponible, on continue sans :", err);
    return null;
  }
}
