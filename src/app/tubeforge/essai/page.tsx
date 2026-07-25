"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// L'essai TubeForge est passé de « 3 jours sans carte » à « 14 jours avec
// carte » : le parcours d'essai EST le checkout abonnement (0€ aujourd'hui,
// prélèvement après l'essai). Cette URL historique reste valide et redirige.
export default function TubeForgeEssaiRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/tubeforge/checkout?plan=sub&months=12");
  }, [router]);
  return null;
}
