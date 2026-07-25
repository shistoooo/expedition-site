"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// L'accès à vie est redevenu une carte publique de la section prix (56,49€) :
// cette ancienne « page cachée » redirige vers le checkout. URL conservée pour
// les liens déjà partagés.
export default function TubeForgeAVieRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/tubeforge/checkout?plan=lifetime");
  }, [router]);
  return null;
}
