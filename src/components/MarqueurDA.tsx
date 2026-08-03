"use client";

import { useEffect } from "react";
import { useTubeForgeOnly } from "@/lib/useTubeForgeOnly";

/**
 * Pose `da-tubeforge` sur le <body> depuis le NAVIGATEUR.
 *
 * ⛔ POURQUOI CE COMPOSANT DOUBLE LE MARQUAGE SERVEUR.
 *
 * Le layout pose déjà la classe quand le middleware a signalé le domaine par
 * un en-tête. Mesure du 2026-08-03 en production : cet en-tête n'arrive pas —
 * la classe était absente du HTML servi (0 occurrence), alors même que le logo
 * affichait « TUBEFORGE ». Les deux ne viennent pas de la même source : le logo
 * lit `window.location.host`, la classe lisait l'en-tête.
 *
 * Tant que la cause côté plateforme n'est pas réglée, s'appuyer sur le seul
 * en-tête revient à ne rien poser du tout. Ce composant utilise donc la
 * détection qui, elle, marche — au prix d'un bref instant en violet avant
 * l'hydratation, ce qui reste très au-dessus de « jamais orange ».
 *
 * Les deux chemins coexistent volontairement : le jour où l'en-tête arrive, la
 * classe est déjà dans le premier HTML et ce composant ne fait plus que
 * confirmer. `toggle` avec un second argument est idempotent.
 */
export default function MarqueurDA() {
  const seulTubeForge = useTubeForgeOnly();

  useEffect(() => {
    document.body.classList.toggle("da-tubeforge", seulTubeForge);
  }, [seulTubeForge]);

  return null;
}
