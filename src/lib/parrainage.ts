/**
 * ATTRIBUTION D'UN PARRAINAGE — capture à l'arrivée, relecture au paiement.
 *
 * Le problème résolu : le lien partenaire pointait droit sur `/tubeforge/checkout`,
 * parce que c'était la SEULE page qui lisait `?ref=`. Le filleul atterrissait donc
 * sur un formulaire de carte bancaire sans avoir vu le produit. Faire pointer le
 * lien vers la page produit aurait perdu la commission au clic suivant, puisque
 * le bouton d'achat de `/tubeforge` ne transporte pas le code.
 *
 * On sépare donc les deux moments :
 *   1. le code est CAPTURÉ sur n'importe quelle page qui reçoit `?ref=` ;
 *   2. il est RELU au checkout, même après plusieurs pages et un retour arrière.
 *
 * Stockage en `localStorage` : c'est une donnée fonctionnelle de première partie,
 * posée uniquement quand la personne arrive par un lien partenaire, et qui ne
 * sert qu'à attribuer une commission. Pas de traceur tiers, pas de profilage.
 *
 * Durée de vie : 30 jours. Une fenêtre bornée protège les deux côtés — le
 * partenaire, qui garde sa vente si l'achat n'est pas immédiat, et l'acheteur,
 * dont on n'attribue pas indéfiniment les décisions à un lien vieux d'un an.
 */

const CLE = 'expedition_parrainage';
const DUREE_MS = 30 * 24 * 60 * 60 * 1000;

type Parrainage = { code: string; poseLe: number };

/** Le format du code est celui du worker : 3 à 20 caractères, alphanumériques ou tirets. */
export function codeValide(code: string): boolean {
  return /^[A-Za-z0-9-]{3,20}$/.test(code);
}

/**
 * À appeler sur toute page publique. Ne fait rien s'il n'y a pas de `?ref=`,
 * et n'écrase un code existant que par un code plus récent — le dernier lien
 * cliqué gagne, ce qui est la convention du marché et la plus explicable.
 */
export function capturerParrainage(recherche?: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(recherche ?? window.location.search);
    const brut = (params.get('ref') || '').trim();
    if (!brut || !codeValide(brut)) return null;
    const valeur: Parrainage = { code: brut.toUpperCase(), poseLe: Date.now() };
    window.localStorage.setItem(CLE, JSON.stringify(valeur));
    return valeur.code;
  } catch {
    // Navigation privée, stockage plein, cookies bloqués : on n'attribue pas,
    // et surtout on ne casse pas la page. Le paramètre d'URL reste la voie
    // directe pour ceux qui arrivent tout droit sur le checkout.
    return null;
  }
}

/** Le code retenu, ou null s'il n'y en a pas ou s'il a expiré. */
export function lireParrainage(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const brut = window.localStorage.getItem(CLE);
    if (!brut) return null;
    const valeur = JSON.parse(brut) as Parrainage;
    if (!valeur?.code || !codeValide(valeur.code)) return null;
    if (Date.now() - valeur.poseLe > DUREE_MS) {
      window.localStorage.removeItem(CLE);
      return null;
    }
    return valeur.code;
  } catch {
    return null;
  }
}

export function oublierParrainage(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(CLE);
  } catch {
    /* rien à faire : l'absence de stockage n'est pas une erreur */
  }
}

/**
 * L'URL à partager par un partenaire. UN SEUL endroit la construit.
 *
 * Avant, l'écran du compte AFFICHAIT `expeditionlauncher.store/checkout?ref=CODE`
 * — l'ancienne page d'abonnement, fermée le 2026-08-08 — pendant que le bouton
 * « copier » écrivait une autre adresse dans le presse-papiers. Le partenaire
 * croyait partager ce qu'il lisait.
 */
export const SITE_PUBLIC = 'https://expeditionlauncher.store';

export function lienPartenaire(code: string): string {
  return `${SITE_PUBLIC}/tubeforge?ref=${encodeURIComponent(code)}`;
}

/**
 * ⛔ LA MÉMOIRE DU NAVIGATEUR NE SUFFIT PAS — ELLE EST LE POINT UNIQUE DE PANNE.
 *
 * Constaté le 2026-08-18, sur la première vraie vente : un affilié avait bien
 * amené l'acheteur, et la commission n'était nulle part. La chaîne de capture
 * fonctionnait pourtant — testée jusqu'au bundle servi.
 *
 * La cause est structurelle : les quatre boutons d'achat de `/tubeforge`
 * pointaient vers le tunnel SANS transporter le code. Tout reposait donc sur
 * `localStorage`, qui disparaît dans des situations parfaitement banales :
 *   · navigation privée, où l'écriture est refusée ou effacée à la fermeture ;
 *   · navigateur intégré à Discord, Instagram ou TikTok — là où un affilié
 *     partage justement son lien — dont le stockage est cloisonné ;
 *   · quelqu'un qui clique sur son téléphone et achète sur son ordinateur.
 *
 * Le code voyage désormais AUSSI dans l'adresse. Les deux mécanismes se
 * rattrapent l'un l'autre : l'adresse tient quand le stockage est refusé, le
 * stockage tient quand la personne s'éloigne et revient plus tard.
 */
export function lienAvecParrainage(href: string, code?: string | null): string {
  const ref = code ?? lireParrainage();
  if (!ref || !codeValide(ref)) return href;
  // `href` porte déjà des paramètres dans la plupart des cas (`?plan=lifetime`).
  return href + (href.includes('?') ? '&' : '?') + 'ref=' + encodeURIComponent(ref);
}
