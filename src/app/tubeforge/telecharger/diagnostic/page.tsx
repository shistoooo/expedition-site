"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Page de diagnostic reseau, a envoyer a quelqu'un dont le telechargeur ne
 * fonctionne pas.
 *
 * POURQUOI ELLE EXISTE : des visiteurs en Algerie voyaient la page se charger
 * mais tout appel au worker echouer. Impossible de trancher a distance entre
 * deux causes qui demandent des reparations opposees :
 *   - un filtrage par NOM DE DOMAINE (`workers.dev` est massivement sur liste
 *     noire, c'est un vecteur de hameconnage connu) → reparable gratuitement en
 *     donnant un nom propre au worker ;
 *   - un blocage des ADRESSES de Cloudflare → un nom propre n'y changerait rien.
 *
 * LE MECANISME QUI REND LA MESURE POSSIBLE : un `fetch` en mode `no-cors`
 * RESOUT si la requete a atteint le serveur (la reponse est opaque, illisible,
 * mais elle existe) et REJETTE avec un TypeError si elle a ete bloquee avant.
 * On peut donc sonder n'importe quel hote tiers sans avoir besoin de son
 * autorisation CORS — ce qui serait impossible autrement.
 *
 * Aucune route serveur ici : tout se passe dans le navigateur du visiteur. Le
 * site est deja a douze fonctions serverless, soit le plafond du plan.
 */

const ROUGE = "#ef3a24";

type Etat = "attente" | "joignable" | "bloque";

type Sonde = {
  cle: string;
  /** Ce que la sonde etablit, en francais, pour la personne qui lit. */
  libelle: string;
  url: string;
  /** Ce que ce resultat prouve, selon qu'il passe ou non. */
  role: string;
};

const SONDES: Sonde[] = [
  {
    cle: "notre-worker",
    libelle: "Notre téléchargeur",
    url: "https://tubeforge-webdl.expedition-studio.workers.dev/health",
    role: "C’est lui qui ne marche pas chez toi. On part de là.",
  },
  {
    cle: "cloudflare-normal",
    libelle: "Un gros site du même hébergeur",
    // cloudflare.com : 104.16.132/133.229. Encore une autre plage.
    url: "https://cloudflare.com/cdn-cgi/trace",
    role: "S’il passe, l’hébergeur n’est pas bloqué en entier.",
  },
  {
    cle: "notre-site",
    libelle: "Le site que tu es en train de lire",
    url: "/tubeforge/telecharger",
    role: "Témoin : il doit forcément passer, puisque cette page s’affiche.",
  },
  {
    cle: "octets",
    libelle: "Le téléchargement lui-même",
    // URL vide : cette sonde a sa propre fonction, elle ne passe pas par `sonder`.
    url: "",
    role: "Le seul test qui reproduit ce qui échoue vraiment. Il analyse une vidéo de 19 secondes et demande un octet.",
  },
];

/**
 * Une sonde. `no-cors` est indispensable : sans lui, un refus CORS serait
 * indistinguable d'un blocage reseau, et c'est precisement la confusion qu'on
 * cherche a lever.
 */
async function sonder(url: string): Promise<{ etat: Etat; ms: number; detail: string }> {
  const t0 = performance.now();
  try {
    await fetch(url, {
      mode: "no-cors",
      cache: "no-store",
      /**
       * `follow` est OBLIGATOIRE, ce n'est pas un choix.
       *
       * La specification Fetch rejette toute requete `no-cors` dont `redirect`
       * n'est pas `follow` — avec un TypeError immediat, indistinguable d'un
       * blocage reseau. J'ai essaye `manual` pour sonder un hote qui redirige :
       * les TROIS sondes sont passees a « bloque » en 0 ms, y compris notre
       * worker qui fonctionne parfaitement. Meme famille de verrou que les
       * reponses opaques.
       *
       * Consequence : on ne peut pas sonder un hote qui repond par une
       * redirection. C'est pour ca qu'il n'y a plus de temoin sur `workers.dev`.
       */
      redirect: "follow",
      signal: AbortSignal.timeout(12_000),
    });
    return { etat: "joignable", ms: Math.round(performance.now() - t0), detail: "réponse reçue" };
  } catch (e) {
    const ms = Math.round(performance.now() - t0);
    const nom = e instanceof Error ? e.name : "erreur";
    return {
      etat: "bloque",
      ms,
      // Un delai depasse et un refus immediat ne racontent pas la meme histoire :
      // le premier evoque un paquet jete en silence, le second un DNS qui refuse.
      detail: nom === "TimeoutError" ? "aucune réponse en 12 s" : "refusé immédiatement (" + nom + ")",
    };
  }
}

/**
 * LA SONDE QUI MANQUAIT : les octets circulent-ils VRAIMENT ?
 *
 * Les trois sondes ci-dessus verifient qu'un hote REPOND. C'est insuffisant, et
 * ca s'est vu le 30/07/2026 : le diagnostic annoncait « OK » sur trois sondes
 * pendant qu'un utilisateur echouait avec « code 403 » des la premiere tranche.
 * Le worker repondait, et YouTube refusait de livrer les octets a NOTRE serveur
 * pour cette personne-la.
 *
 * Celle-ci fait donc le chemin complet : une resolution reelle sur une video
 * minuscule (19 secondes, 1 Mo — la premiere video de YouTube), puis UN octet
 * demande par le relais. Si cette sonde passe et que les telechargements
 * echouent quand meme, la cause est ailleurs. Si elle echoue, on a la preuve.
 *
 * Elle coute une unite de quota a la personne qui la lance. C'est le prix d'un
 * diagnostic qui ne mente pas.
 */
const WORKER_DIAG = "https://tubeforge-webdl.expedition-studio.workers.dev";
const VIDEO_TEMOIN = "https://www.youtube.com/watch?v=jNQXAC9IVRw";

async function sonderOctets(): Promise<{ etat: Etat; ms: number; detail: string }> {
  const t0 = performance.now();
  const ms = () => Math.round(performance.now() - t0);
  try {
    const r = await fetch(
      `${WORKER_DIAG}/api/resolve?url=${encodeURIComponent(VIDEO_TEMOIN)}&max=524288000`,
      { signal: AbortSignal.timeout(45_000) }
    );
    const d = await r.json();
    if (!d?.ok) return { etat: "bloque", ms: ms(), detail: "analyse refusée : " + String(d?.kind || r.status) };
    const cible = d.audio?.url || d.video?.url || d.file?.url;
    if (!cible) return { etat: "bloque", ms: ms(), detail: "aucune piste à tester" };

    const o = await fetch(`${cible}&start=0&end=0`, {
      referrerPolicy: "no-referrer",
      signal: AbortSignal.timeout(30_000),
    });
    if (!o.ok && o.status !== 206) {
      return { etat: "bloque", ms: ms(), detail: `YouTube a refusé les octets (code ${o.status})` };
    }
    return { etat: "joignable", ms: ms(), detail: "octets reçus" };
  } catch (e) {
    const nom = e instanceof Error ? e.name : "erreur";
    return {
      etat: "bloque",
      ms: ms(),
      detail: nom === "TimeoutError" ? "aucune réponse à temps" : "requête bloquée (" + nom + ")",
    };
  }
}

export default function DiagnosticPage() {
  const [resultats, setResultats] = useState<Record<string, { etat: Etat; ms: number; detail: string }>>({});
  const [enCours, setEnCours] = useState(false);
  const [copie, setCopie] = useState(false);

  const lancer = useCallback(async () => {
    setEnCours(true);
    setCopie(false);
    setResultats({});
    // En serie, pas en parallele : sur une connexion filtree, plusieurs sondes
    // simultanees se genent et produisent de faux delais depasses.
    for (const s of SONDES) {
      const r = s.cle === "octets" ? await sonderOctets() : await sonder(s.url);
      setResultats((p) => ({ ...p, [s.cle]: r }));
    }
    setEnCours(false);
  }, []);

  useEffect(() => { lancer(); }, [lancer]);

  const fini = SONDES.every((s) => resultats[s.cle]);
  const notre = resultats["notre-worker"]?.etat;
  const cf = resultats["cloudflare-normal"]?.etat;
  /**
   * Combien de temps le refus a-t-il pris. C'est LA mesure qui separe deux causes
   * que rien d'autre ne distingue.
   *
   * Lecon du 30/07/2026, payee deux fois : un refus en 0 a 1 ms ne peut PAS venir
   * du reseau — il n'y a pas le temps d'un aller-retour. C'est la signature d'un
   * refus LOCAL : politique de securite de la page, extension de navigateur,
   * antivirus, ou pare-feu de la machine. Un blocage par le fournisseur d'acces,
   * lui, coute au moins quelques dizaines de millisecondes (resolution DNS
   * refusee, connexion reinitialisee) ou finit en delai depasse.
   *
   * Sans cette distinction, la page accusait le fournisseur d'acces d'un blocage
   * installe sur l'ordinateur — et envoyait chercher la reparation au mauvais
   * endroit.
   */
  const msNotre = resultats["notre-worker"]?.ms ?? null;
  const refusLocal = notre === "bloque" && msNotre !== null && msNotre < 15;

  /**
   * Le verdict, ecrit pour la personne qui lit — pas pour nous.
   *
   * C'est la seule partie qui compte : un tableau de croix rouges sans
   * interpretation obligerait a nous renvoyer une capture et attendre. La page
   * doit conclure elle-meme.
   */
  const octets = resultats["octets"]?.etat;

  let verdict: { titre: string; texte: string; code: string } | null = null;
  if (fini) {
    /**
     * ORDRE IMPORTANT : la sonde des octets passe AVANT « tout repond ».
     *
     * Sans ca, le diagnostic annoncait « tout repond » sur trois sondes vertes
     * pendant que le telechargement echouait a la premiere tranche — exactement
     * ce qui est arrive le 30/07/2026. Repondre n'est pas livrer.
     */
    if (notre === "joignable" && octets === "bloque") {
      verdict = {
        titre: "Notre serveur répond, mais YouTube refuse de lui livrer la vidéo.",
        texte:
          "C’est le cas le plus vicieux : tout a l’air normal, et le téléchargement échoue quand même. " +
          "YouTube refuse de servir les fichiers à notre serveur depuis ton point d’accès à Internet — " +
          "pas depuis d’autres. Ça arrive par vagues et ça se débloque souvent tout seul. " +
          "Ce n’est ni ta connexion, ni ton ordinateur : on a besoin de ce résultat pour le corriger.",
        code: "OCTETS-REFUSES",
      };
    } else if (notre === "joignable") {
      verdict = {
        titre: "Tout répond depuis ton réseau, téléchargement compris.",
        texte:
          "Le téléchargeur est joignable et les octets circulent. Si tu avais une erreur, elle était " +
          "passagère : retourne sur la page et réessaie.",
        code: "OK",
      };
    } else if (refusLocal) {
      verdict = {
        titre: "Le blocage vient de ton ordinateur, pas de ton réseau.",
        texte:
          "La demande a été refusée en moins d’un centième de seconde : c’est trop rapide pour venir " +
          "d’Internet. Une extension de navigateur (bloqueur de publicité, extension de sécurité), un " +
          "antivirus ou un pare-feu installé sur la machine intercepte l’adresse. Essaie en navigation " +
          "privée, ou désactive tes extensions le temps d’un test.",
        code: "BLOCAGE-LOCAL",
      };
    } else if (cf === "joignable") {
      /**
       * LE CAS QUI COMPTE. Notre telechargeur est bloque mais un gros site du
       * meme hebergeur passe : le blocage vise donc notre nom ou notre groupe
       * d'adresses, pas l'hebergeur. Dans les deux cas, lui donner un nom propre
       * le deplace sur d'autres adresses — c'est reparable.
       */
      verdict = {
        titre: "C’est notre adresse technique qui est filtrée, pas l’hébergeur.",
        texte:
          "Ton réseau laisse passer les autres sites du même hébergeur, mais bloque l’adresse " +
          "particulière que le téléchargeur utilise. C’est le cas le plus simple à réparer de notre " +
          "côté — et c’est une bonne nouvelle.",
        code: "NOTRE-ADRESSE",
      };
    } else {
      verdict = {
        titre: "Ton réseau bloque tout l’hébergeur.",
        texte:
          "Ce n’est pas seulement notre adresse : les autres sites du même hébergeur sont " +
          "inaccessibles aussi. La réparation est plus lourde de notre côté, mais on sait " +
          "maintenant quoi faire.",
        code: "HEBERGEUR-ENTIER",
      };
    }
  }

  const rapport = [
    "DIAGNOSTIC TÉLÉCHARGEUR — " + (verdict?.code ?? "incomplet"),
    // Le temps de chaque sonde figure deja ligne par ligne ci-dessous : c'est
    // volontaire, il permet de reconstituer le raisonnement a distance.
    ...SONDES.map((s) => {
      const r = resultats[s.cle];
      return "- " + s.libelle + " : " + (r ? (r.etat === "joignable" ? "OK" : "BLOQUÉ") + " (" + r.detail + ", " + r.ms + " ms)" : "…");
    }),
    "navigateur : " + (typeof navigator !== "undefined" ? navigator.userAgent : "?"),
  ].join("\n");

  return (
    <div className="min-h-screen text-white px-5 py-14" style={{ background: "#07060f" }}>
      <div className="max-w-lg mx-auto">
        <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "rgba(255,106,31,0.7)" }}>
          Diagnostic réseau
        </p>
        <h1 className="text-3xl font-black tracking-[-0.02em] mb-3">
          Pourquoi le téléchargeur ne marche pas chez toi<span style={{ color: ROUGE }}>.</span>
        </h1>
        <p className="text-white/55 leading-relaxed mb-9">
          Cette page teste quelques adresses depuis ta connexion. Rien n’est envoyé, rien n’est
          installé, et ça prend une quinzaine de secondes.
        </p>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] divide-y divide-white/[0.07]">
          {SONDES.map((s) => {
            const r = resultats[s.cle];
            return (
              <div key={s.cle} className="p-4 flex items-start gap-3.5">
                <span
                  className="mt-[3px] w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    background: !r ? "rgba(255,255,255,0.18)" : r.etat === "joignable" ? "#22c55e" : ROUGE,
                  }}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-[15px] leading-snug">
                    {s.libelle}
                    {r && (
                      <span className="text-white/35 font-mono text-[12px]"> — {r.etat === "joignable" ? "répond" : "bloqué"}</span>
                    )}
                  </p>
                  <p className="text-[13px] text-white/40 leading-relaxed mt-1">{s.role}</p>
                  {r && (
                    <p className="text-[12px] font-mono text-white/25 mt-1.5">{r.detail} · {r.ms} ms</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {verdict && (
          <div
            className="mt-7 rounded-2xl border p-5"
            style={{ borderColor: "rgba(239,58,36,0.32)", background: "rgba(239,58,36,0.055)" }}
          >
            <p className="font-bold mb-1.5">{verdict.titre}</p>
            <p className="text-sm text-white/60 leading-relaxed">{verdict.texte}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5 mt-7">
          <button
            onClick={lancer}
            disabled={enCours}
            className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/80 font-semibold hover:bg-white/10 transition-colors disabled:opacity-40"
          >
            {enCours ? "Test en cours…" : "Refaire le test"}
          </button>
          {fini && (
            <button
              onClick={() => {
                navigator.clipboard?.writeText(rapport).then(
                  () => setCopie(true),
                  () => setCopie(false)
                );
              }}
              className="px-6 py-3.5 rounded-xl font-bold text-black transition-transform duration-200 hover:translate-y-[-1px]"
              style={{ background: "linear-gradient(118deg, #ff6a1f 0%, #ef3a24 58%, #8b3dff 155%)" }}
            >
              {copie ? "Copié" : "Copier le résultat"}
            </button>
          )}
        </div>

        {fini && (
          <>
            <p className="text-[13px] text-white/40 mt-4 leading-relaxed">
              Envoie le résultat copié à la personne qui t’a donné ce lien. C’est ce qui permet de
              réparer.
            </p>
            {/* Le rapport brut reste visible : sur mobile le presse-papiers echoue
                parfois en silence, et une capture d'ecran doit suffire. */}
            <pre className="mt-4 p-4 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono text-white/45 whitespace-pre-wrap break-words">
              {rapport}
            </pre>
          </>
        )}
      </div>
    </div>
  );
}
