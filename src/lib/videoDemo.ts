/**
 * LA VIDÉO EXPLICATIVE DE TUBEFORGE — UNE SEULE SOURCE.
 *
 * Elle apparaît à deux endroits qui n'ont rien à voir : sur la page de vente
 * (avant le prix) et juste après l'achat (page de remerciement). Écrire son
 * identifiant deux fois, c'est la garantie qu'un jour l'un des deux pointera
 * vers une ancienne version — le même défaut que les trois prix écrits à la
 * main qui affichaient 149 € pendant que Stripe facturait 39,99 €.
 *
 * ⚠️ POURQUOI CETTE VIDÉO COMPTE PLUS QU'UNE DÉMO ORDINAIRE.
 * L'essai de 14 jours a été fermé le 2026-08-08, le téléchargeur web gratuit
 * coupé le 09. Depuis, RIEN ne permet de voir TubeForge avant de payer 39,99 €.
 * Cette vidéo est le seul élément de preuve qui reste avant l'achat.
 */

/**
 * Identifiant YouTube de la vidéo (la partie après `?v=`).
 *
 * Vide = les blocs vidéo ne s'affichent nulle part. C'est volontaire : mieux
 * vaut aucune section qu'un lecteur noir ou un « Video unavailable » au milieu
 * d'une page de vente. Renseigner cette ligne suffit à tout allumer.
 */
export const VIDEO_TUBEFORGE_ID = "Eeo6DdR62LE";

/** Durée annoncée à côté du bouton. Sert à ce que personne ne clique en aveugle. */
export const VIDEO_TUBEFORGE_DUREE = "19 min";

export const VIDEO_TUBEFORGE_TITRE =
  "TubeForge — présentation complète";

/** Vrai quand la vidéo est configurée et peut être affichée. */
export const videoDemoDisponible = (): boolean => VIDEO_TUBEFORGE_ID.trim().length > 0;

/**
 * L'image d'accroche servie par YouTube. `maxresdefault` n'existe pas pour
 * toutes les vidéos ; `hqdefault` existe toujours, on garde donc celle-là comme
 * repli plutôt que d'afficher un cadre vide.
 */
export const videoDemoAffiche = (): string =>
  `https://i.ytimg.com/vi/${VIDEO_TUBEFORGE_ID}/maxresdefault.jpg`;

export const videoDemoAfficheRepli = (): string =>
  `https://i.ytimg.com/vi/${VIDEO_TUBEFORGE_ID}/hqdefault.jpg`;
