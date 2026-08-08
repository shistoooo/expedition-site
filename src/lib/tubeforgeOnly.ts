/**
 * LE MODE « TUBEFORGE SEUL »
 *
 * TubeForge est vendu seul. Sur son domaine, un visiteur ne doit JAMAIS tomber
 * sur le site de la suite — ni par un lien, ni en tapant une URL, ni en cliquant
 * le logo. C'est un produit, pas une section d'un catalogue.
 *
 * ⛔ UNE SEULE SOURCE DE VERITE. Le mode se decide a deux endroits (le
 * middleware, cote serveur, et les composants, cote navigateur) : si chacun
 * portait sa propre regle, ils divergeraient au premier domaine ajoute. Tout
 * passe donc par ce fichier.
 *
 * Deux declencheurs, et c'est voulu :
 *   - le DOMAINE : tout ce qui est servi sur le domaine TubeForge est en mode
 *     TubeForge, quelle que soit la page. C'est ce qui rend l'isolement etanche.
 *   - le CHEMIN : sur le domaine de la suite, les pages `/tubeforge/*` restent
 *     un tunnel de conversion dedie — on n'y remet pas les liens vers les autres
 *     produits au milieu d'un achat.
 */

/**
 * Les domaines sur lesquels SEUL TubeForge existe.
 *
 * ⛔ BASCULE COMPLÈTE DU 2026-08-08 : le domaine PRINCIPAL a rejoint la liste.
 *
 * Décision produit : TubeForge est le produit qu'on vend aujourd'hui, donc c'est
 * lui que voit un visiteur qui arrive — pas un catalogue. Le site de la suite
 * n'est plus servi nulle part.
 *
 * ⚠️ CE QUE ÇA COUPE, et c'est assumé : sur `expeditionlauncher.store`, les
 * pages de `CHEMINS_SUITE` (/monteurs, /createurs, /pricing, /economie,
 * /launcher, /clipforge, /reviewforge, /tools, /ambassador…) ne répondent plus
 * — le middleware renvoie vers TubeForge. Elles répondaient toutes `200` avant
 * la bascule. ClipForge et ReviewForge disparaissent donc du web public.
 *
 * ⚠️ Ce que le code ne peut PAS annuler : Google mettra des semaines à oublier
 * ces pages, là où une ligne suffit à les rétablir ici. L'asymétrie est réelle.
 *
 * ↩️ POUR REVENIR EN ARRIÈRE : retirer la ligne `"expeditionlauncher.store"`
 * ci-dessous, et redéployer. Le site de la suite est INTACT dans le code — il
 * n'a jamais été supprimé, seulement cessé d'être servi sur ce domaine.
 */
export const DOMAINES_TUBEFORGE = [
  "tubeforge.explauncheur.space",
  "expeditionlauncher.store",
];

/** Vrai si cet hôte ne sert que TubeForge. */
export function domaineTubeForge(hote: string | null | undefined): boolean {
  if (!hote) return false;
  // Le port n'a rien à faire dans une comparaison de domaine (dev local, proxy).
  const propre = hote.split(":")[0].toLowerCase();
  return DOMAINES_TUBEFORGE.includes(propre);
}

/**
 * Les chemins qui n'existent PAS dans le monde TubeForge : les autres produits,
 * les pages de la suite, ses tarifs. Quelqu'un qui les tape est renvoyé vers
 * TubeForge plutôt que de découvrir un catalogue qu'on ne lui vend pas.
 *
 * ⚠️ Liste de ce qu'on REFUSE, pas de ce qu'on autorise. L'inverse serait un
 * piège : une page ajoutée demain serait bloquée sans que personne comprenne
 * pourquoi. Ici, une page ajoutée demain reste accessible — et si elle n'a rien
 * à faire là, on l'ajoute ici en connaissance de cause.
 */
export const CHEMINS_SUITE = [
  "/monteurs",
  "/createurs",
  "/pricing",
  "/economie",
  "/launcher",
  "/expedition",
  "/clipforge",
  "/reviewforge",
  "/swipeforge",
  "/tools",
  "/demo",
  "/ambassador",
  "/coin-green-screen",
  "/avatar-editor",
  "/banner",
];

/** Vrai si ce chemin appartient au site de la suite. */
export function cheminDeLaSuite(chemin: string): boolean {
  return CHEMINS_SUITE.some((c) => chemin === c || chemin.startsWith(c + "/"));
}

/**
 * Où mène le logo, et où l'on renvoie quelqu'un qui s'égare.
 * En mode TubeForge, l'accueil du monde EST la page TubeForge.
 */
export const ACCUEIL_TUBEFORGE = "/tubeforge";
