/**
 * LES DEUX VIDÉOS DE DÉMONSTRATION — UNE SEULE SOURCE.
 *
 * Elles apparaissent à des endroits qui n'ont rien à voir : page de vente
 * (avant le prix) et page d'après-achat. Écrire un identifiant deux fois, c'est
 * la garantie qu'un jour l'un des deux pointera vers une ancienne version — le
 * même défaut que les trois prix écrits à la main qui affichaient 149 € pendant
 * que Stripe facturait 39,99 €.
 *
 * ⚠️ POURQUOI CES VIDÉOS COMPTENT PLUS QU'UNE DÉMO ORDINAIRE.
 * L'essai de 14 jours a été fermé le 2026-08-08, le téléchargeur web gratuit
 * coupé le 09. Depuis, RIEN ne permet de voir TubeForge avant de payer 39,99 €.
 * C'est le seul élément de preuve qui reste avant l'achat.
 */

export type VideoDemo = {
  /** Identifiant YouTube : la partie après `?v=` ou après `youtu.be/`. */
  id: string;
  /** Titre accessible de l'iframe (lecteurs d'écran). */
  titre: string;
  /** Durée affichée sur l'affiche, pour que personne ne clique en aveugle. */
  duree: string;
};

/**
 * La courte — celle qu'on met en avant AVANT l'achat.
 *
 * 2 min 51 s, un extrait des fonctions. Devant quelqu'un qui hésite encore,
 * trois minutes se regardent ; dix-neuf, non.
 */
export const VIDEO_COURTE: VideoDemo = {
  id: "n6Vh7zgBnAE",
  titre: "TubeForge en trois minutes",
  duree: "3 min",
};

/** La complète — après l'achat, et en lien depuis la courte. */
export const VIDEO_COMPLETE: VideoDemo = {
  id: "Eeo6DdR62LE",
  titre: "TubeForge — présentation complète",
  duree: "19 min",
};

/** Vrai quand la vidéo est configurée et peut être affichée. */
export const videoDisponible = (v: VideoDemo): boolean => v.id.trim().length > 0;

/** Page YouTube, pour ouvrir la version longue dans un onglet. */
export const videoLien = (v: VideoDemo): string => `https://youtu.be/${v.id}`;

/**
 * Les affiches, de la meilleure à la moins bonne.
 *
 * ⛔ AUCUNE N'EST GARANTIE. Mesuré le 2026-08-16 sur la vidéo courte, publiée
 * le matin même : les CINQ formats rendaient 404, YouTube ne les avait pas
 * encore générées. Un repli à deux niveaux ne suffisait donc pas — il faut
 * pouvoir n'afficher AUCUNE image et rester présentable, sinon la page montre
 * une icône d'image cassée à l'endroit précis où l'on demande 39,99 €.
 */
export const videoAffiches = (v: VideoDemo): string[] => [
  `https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`,
  `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
  `https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`,
];
