"use client";

import { createContext, useContext } from "react";

/**
 * LE MODE « TUBEFORGE SEUL », DÉCIDÉ CÔTÉ SERVEUR.
 *
 * ⛔ POURQUOI CE CONTEXTE EXISTE.
 *
 * `useTubeForgeOnly()` lisait `window.location.host`, qui n'existe pas pendant
 * le rendu serveur : il rendait donc `false` au premier rendu, puis basculait
 * après hydratation. Conséquence mesurée le 2026-08-02 sur
 * `tubeforge.explauncheur.space/tubeforge/telecharger` — le HTML servi
 * contenait le pied de page de la SUITE :
 *
 *     href="/monteurs"  href="/createurs"  href="/pricing"
 *     href="/economie"  href="/launcher"
 *
 * Autrement dit : quelqu'un qui clique avant la fin de l'hydratation — sur un
 * téléphone, c'est la règle plus que l'exception — sortait du produit qu'on lui
 * vend. Le correctif ne pouvait pas être « masquer plus vite » : tant que la
 * décision se prend dans le navigateur, il existe un instant où le mauvais HTML
 * est cliquable.
 *
 * Le middleware, lui, connaît l'hôte avant même de fabriquer la page. Il pose
 * un en-tête, le layout le lit, et le premier octet envoyé est déjà le bon.
 */
const Contexte = createContext<boolean | null>(null);

export function TubeForgeOnlyProvider({
  valeur,
  children,
}: {
  valeur: boolean;
  children: React.ReactNode;
}) {
  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}

/**
 * @returns `null` hors du fournisseur — l'appelant retombe alors sur la
 * détection navigateur. On ne rend pas `false` par défaut : ce serait
 * indiscernable d'un « non, ce n'est pas TubeForge », et c'est exactement la
 * confusion qui a produit le défaut d'origine.
 */
export function useTubeForgeOnlyDuServeur(): boolean | null {
  return useContext(Contexte);
}
