"use client";

import { useEffect, useState } from "react";
import { capturerParrainage, lireParrainage, lienAvecParrainage } from "@/lib/parrainage";

/**
 * Le code de parrainage courant, lu APRÈS le montage.
 *
 * Il ne peut pas être lu au rendu serveur — `localStorage` n'y existe pas — et
 * le lire pendant le premier rendu client provoquerait une divergence
 * d'hydratation. On part donc sans code, et on l'ajoute dès qu'on le connaît :
 * personne ne clique dans les quelques millisecondes qui séparent les deux.
 */
export function useParrainage(): string | null {
  const [code, setCode] = useState<string | null>(null);
  useEffect(() => {
    capturerParrainage();
    setCode(lireParrainage());
  }, []);
  return code;
}

/** `href` enrichi du code, ou `href` tel quel s'il n'y en a pas. */
export function useLienParrainage(href: string): string {
  const code = useParrainage();
  return lienAvecParrainage(href, code);
}
