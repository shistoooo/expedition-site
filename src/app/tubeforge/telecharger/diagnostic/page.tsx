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
      const r = await sonder(s.url);
      setResultats((p) => ({ ...p, [s.cle]: r }));
    }
    setEnCours(false);
  }, []);

  useEffect(() => { lancer(); }, [lancer]);

  const fini = SONDES.every((s) => resultats[s.cle]);
  const notre = resultats["notre-worker"]?.etat;
  const cf = resultats["cloudflare-normal"]?.etat;

  /**
   * Le verdict, ecrit pour la personne qui lit — pas pour nous.
   *
   * C'est la seule partie qui compte : un tableau de croix rouges sans
   * interpretation obligerait a nous renvoyer une capture et attendre. La page
   * doit conclure elle-meme.
   */
  let verdict: { titre: string; texte: string; code: string } | null = null;
  if (fini) {
    if (notre === "joignable") {
      verdict = {
        titre: "Tout répond depuis ton réseau.",
        texte:
          "Le téléchargeur est joignable en ce moment. Si tu avais une erreur, elle était passagère : " +
          "retourne sur la page et réessaie.",
        code: "OK",
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
