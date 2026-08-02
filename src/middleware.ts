import { NextResponse, type NextRequest } from "next/server";
import { ACCUEIL_TUBEFORGE, cheminDeLaSuite, domaineTubeForge } from "@/lib/tubeforgeOnly";

/**
 * ISOLE LE DOMAINE TUBEFORGE DU SITE DE LA SUITE.
 *
 * Filtrer les liens ne suffit pas : il reste l'URL tapée à la main, le lien
 * partagé, le résultat de recherche, le favori. Tant qu'une adresse répond, elle
 * fait sortir le visiteur du produit qu'on lui vend. La décision doit donc se
 * prendre à l'entrée, pas dans les composants.
 *
 * Deux règles, et deux seulement :
 *   1. `/` sert la page TubeForge — par RÉÉCRITURE, pas par redirection : le
 *      visiteur reste sur `tubeforge.explauncheur.space/`, qui est l'adresse
 *      qu'il retiendra et partagera. Une redirection lui montrerait `/tubeforge`
 *      dans la barre, ce qui trahit qu'il est sur une sous-partie d'autre chose.
 *   2. Les pages de la suite renvoient vers TubeForge — par REDIRECTION cette
 *      fois, et temporaire (307) : le jour où le site de base est coupé pour de
 *      bon, ces adresses changeront de sort, et une 301 aurait été mise en cache
 *      par les navigateurs de façon irréversible.
 *
 * ⚠️ Ce qui n'est PAS touché, et c'est délibéré : `/account`, `/cgv`,
 * `/confidentialite`, `/mentions-legales`, `/checkout`, `/tubeforge/*`. Un
 * client TubeForge a besoin de son compte, de ses factures et des mentions
 * légales — les couper ferait de l'isolement une prison.
 */
/**
 * En-tête transmis à la page. C'est lui qui permet au PREMIER HTML d'être déjà
 * le bon — voir `TubeForgeOnlyProvider` pour ce que coûtait la décision prise
 * dans le navigateur.
 */
export const EN_TETE_TUBEFORGE = "x-tubeforge-seul";

export function middleware(req: NextRequest) {
  /**
   * ⚠️ `host` N'EST PAS TOUJOURS L'HÔTE PUBLIC.
   *
   * Derrière un proxy ou un alias de plateforme, `host` peut porter le nom
   * interne pendant que l'hôte demandé par le visiteur voyage dans
   * `x-forwarded-host`. Ne lire que le premier fait échouer la comparaison en
   * silence : le middleware laisse alors tout passer, et l'isolement du domaine
   * n'existe plus — sans la moindre erreur pour le signaler.
   */
  const hote = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!domaineTubeForge(hote)) return NextResponse.next();

  const { pathname } = req.nextUrl;

  // Toute réponse servie sur ce domaine porte la marque, y compris les pages
  // qu'on ne réécrit ni ne redirige (/account, /cgv, /tubeforge/*).
  const entetes = new Headers(req.headers);
  entetes.set(EN_TETE_TUBEFORGE, "1");
  const suivant = () => NextResponse.next({ request: { headers: entetes } });

  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = ACCUEIL_TUBEFORGE;
    return NextResponse.rewrite(url, { request: { headers: entetes } });
  }

  if (cheminDeLaSuite(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = ACCUEIL_TUBEFORGE;
    url.search = "";
    return NextResponse.redirect(url, 307);
  }

  return suivant();
}

/**
 * On n'inspecte que les pages.
 *
 * Faire passer les fichiers statiques, les images et les routes d'API par ce
 * middleware coûterait un appel par ressource pour un résultat toujours
 * identique — et le moindre défaut ici casserait le site entier, pas seulement
 * sa navigation.
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
