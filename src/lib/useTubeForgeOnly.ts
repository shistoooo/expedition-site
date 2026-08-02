"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { domaineTubeForge } from "./tubeforgeOnly";

/**
 * « Sommes-nous dans le monde TubeForge ? », côté navigateur.
 *
 * Deux déclencheurs, la même règle que le middleware :
 *   - le DOMAINE, qui rend l'isolement étanche ;
 *   - le CHEMIN `/tubeforge/*`, pour que le tunnel de conversion reste dédié
 *     même quand on l'atteint depuis le site de la suite.
 *
 * ⚠️ LE DOMAINE NE PEUT PAS ÊTRE LU AU PREMIER RENDU. Le HTML est fabriqué sur
 * le serveur, où `window` n'existe pas ; s'en servir directement produirait un
 * HTML différent de celui que React attend, donc une erreur d'hydratation.
 *
 * `useSyncExternalStore` est fait exactement pour ça : il prend une valeur pour
 * le serveur et une pour le navigateur, et React gère la transition lui-même.
 * La première version posait un `useState` dans un `useEffect` — ça marchait,
 * mais c'est le motif que la règle `react-hooks/set-state-in-effect` interdit,
 * et à raison : il provoque un second rendu que celui-ci évite.
 *
 * `subscribe` ne fait rien, et ce n'est pas un oubli : le domaine d'une page ne
 * change jamais de son vivant. Il n'y a donc rien à écouter.
 */
const neRienEcouter = () => () => {};
const domaineCourant = () => domaineTubeForge(window.location.host);
const cotServeur = () => false;

export function useTubeForgeOnly(): boolean {
  const pathname = usePathname();
  const surLeDomaine = useSyncExternalStore(neRienEcouter, domaineCourant, cotServeur);
  return surLeDomaine || !!pathname?.startsWith("/tubeforge");
}
