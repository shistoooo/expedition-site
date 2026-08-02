import { NextResponse, type NextRequest } from "next/server";

/**
 * SONDE TEMPORAIRE — quel hôte le serveur voit-il réellement ?
 *
 * Posée le 2026-08-02 : sur `tubeforge.explauncheur.space`, le middleware ne
 * redirige pas les pages de la suite, alors que le même déploiement sert les
 * deux domaines (empreintes de build identiques). L'hypothèse « l'en-tête `host`
 * ne porte pas l'hôte public » est plausible mais NON VÉRIFIÉE — et bâtir un
 * correctif sur une hypothèse est exactement ce qui a fait perdre du temps ici.
 *
 * Cette route ne rend que des noms d'hôtes, aucune donnée personnelle. À RETIRER
 * une fois la cause établie.
 */
export const dynamic = "force-dynamic";

export function GET(req: NextRequest) {
  return NextResponse.json({
    host: req.headers.get("host"),
    forwardedHost: req.headers.get("x-forwarded-host"),
    urlHostname: req.nextUrl.hostname,
    // Pas de champ « vu par le middleware » ici : le matcher exclut `/api`,
    // donc il vaudrait TOUJOURS faux — une sonde qui ment est pire que pas de
    // sonde du tout.
  });
}
