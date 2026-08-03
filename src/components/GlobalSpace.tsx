"use client";

/**
 * LE FOND DU SITE — et la décision de ne PAS charger le moteur 3D.
 *
 * Ce fichier ne contient plus que la décision : quelle page, quel appareil. Le
 * décor lui-même vit dans `GlobalSpace3D`, chargé **à la demande**.
 *
 * ⛔ POURQUOI CE N'EST PAS UN SIMPLE `if`. Le garde-fou mobile existait déjà et
 * fonctionnait : sur téléphone, aucun canvas n'était rendu. Mais l'import était
 * STATIQUE — three.js, @react-three/fiber et drei partaient donc dans le paquet
 * de chaque page, pour tout le monde. Un `if` à l'exécution n'empêche rien : le
 * fichier est déjà téléchargé, décompressé et compilé quand la condition est
 * évaluée. Seul un import dynamique le retire vraiment.
 *
 * Mesure du 02/08/2026 — profil iPhone 11, processeur bridé 4× :
 *     1 671 Ko de JavaScript compressé
 *     champ utilisable après 3,9 s en 4G, 8,0 s en 4G lente, 15,5 s en 3G
 *
 * `ssr: false` parce qu'un canvas WebGL n'a aucun sens sur le serveur, et que
 * le rendre côté serveur ne ferait que retarder le premier affichage.
 */

import dynamic from "next/dynamic";
import { useTubeForgeOnly } from "@/lib/useTubeForgeOnly";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const GlobalSpace3D = dynamic(() => import("@/components/GlobalSpace3D"), { ssr: false });

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isDesktop;
}

/** Le fond léger : deux dégradés, aucun script. C'est ce que voient les
 *  téléphones, et ce que voit tout le monde pendant que le décor se charge. */
function FondLeger() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[1]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.05)_0%,transparent_50%)]" />
    </div>
  );
}

/**
 * Fond TubeForge : la même construction que `FondLeger`, mais en chaud.
 *
 * Pas d'étoiles, et c'est le point. Le ciel violet raconte « suite d'outils
 * spatiale » — une histoire qui n'est pas celle de TubeForge, et qui jurait
 * avec les boutons orange dès qu'on a corrigé la palette. Deux lueurs
 * suffisent à garder la profondeur sans raconter autre chose que le produit.
 */
function FondTubeForge() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[1]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,106,31,0.10)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(239,58,36,0.06)_0%,transparent_55%)]" />
    </div>
  );
}

export default function GlobalSpace() {
  const pathname = usePathname();
  const isDesktop = useIsDesktop();
  const seulTubeForge = useTubeForgeOnly();

  const EXCLUDED_ROUTES = ["/checkout", "/checkout/success", "/coin-green-screen", "/avatar-editor"];
  // /admin = panneau de données → fond uni, aucun décor spatial
  if (EXCLUDED_ROUTES.includes(pathname) || pathname?.startsWith("/admin")) return null;

  // Monde TubeForge : aucun ciel étoilé, sur téléphone comme sur ordinateur.
  // Le moteur 3D n'est même pas téléchargé — un décor qu'on ne montre pas n'a
  // aucune raison de coûter 700 Ko.
  if (seulTubeForge) return <FondTubeForge />;

  // Téléphone : fond statique, et surtout aucun moteur 3D téléchargé.
  if (!isDesktop) return <FondLeger />;

  // /swipeforge : mêmes étoiles animées, densité réduite (moins chargé qu'ailleurs)
  const isLowDensity = pathname === "/swipeforge";

  return (
    <>
      {/* Le décor arrive après coup : on ne laisse jamais un fond noir pendant
          son chargement, même sur une bonne connexion. */}
      <FondLeger />
      <GlobalSpace3D starsCount={isLowDensity ? 450 : 2000} sparklesCount={isLowDensity ? 35 : 200} />
    </>
  );
}
