"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { domaineTubeForge } from "./tubeforgeOnly";

/**
 * « Sommes-nous dans le monde TubeForge ? », côté navigateur.
 *
 * Deux déclencheurs, la même règle que le middleware :
 *   - le DOMAINE, qui rend l'isolement étanche ;
 *   - le CHEMIN `/tubeforge/*`, pour que le tunnel de conversion reste dédié
 *     même quand on l'atteint depuis le site de la suite.
 *
 * ⚠️ LE DOMAINE NE PEUT PAS ÊTRE CONNU AU PREMIER RENDU. Le HTML est fabriqué
 * sur le serveur, où `window` n'existe pas ; s'en servir directement produirait
 * un HTML différent de celui que React attend et une erreur d'hydratation.
 * D'où l'état initialisé à `false` puis corrigé dans un effet.
 *
 * Conséquence à connaître : sur `tubeforge.explauncheur.space/`, le tout premier
 * rendu ignore le domaine. Le chemin réécrit étant `/tubeforge`, la seconde
 * condition prend le relais et le résultat est correct dès le départ — mais
 * quelqu'un qui ajouterait une page hors `/tubeforge` sur ce domaine verrait un
 * bref clignotement. C'est le prix de l'absence d'erreur d'hydratation.
 */
export function useTubeForgeOnly(): boolean {
  const pathname = usePathname();
  const [surLeDomaine, setSurLeDomaine] = useState(false);

  useEffect(() => {
    setSurLeDomaine(domaineTubeForge(window.location.host));
  }, []);

  return surLeDomaine || !!pathname?.startsWith("/tubeforge");
}
