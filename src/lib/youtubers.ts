/**
 * YouTubeurs qui utilisent (et ont autorisé) la suite Expédition.
 * Source unique partagée par la homepage (HomeYoutuberShowcase) et les landings
 * personas. Pour retirer ou ajouter quelqu'un, modifie ici une seule fois.
 *
 * ⚠️ Avant d'ajouter une entrée : vérifier que la personne a explicitement
 * donné son accord pour l'usage de son avatar comme social proof.
 */
export type Youtuber = {
  handle: string;
  url: string;
  avatar: string;
};

// Ordre = nombre d'abonnés décroissant (relevé sur les chaînes le 2026-07-25 :
// manji 84k · ChampLibre0 23,5k · Donay 23,4k · Skyflooze 9,7k · Maxim-well
// 6,7k · Malcoclicot 3k · PetitShiny 2,9k · Rezma91 1,1k · jal 112).
export const youtubers: Youtuber[] = [
  { handle: "manji", url: "https://www.youtube.com/@manjirosayno", avatar: "/youtubers/manji.jpg" },
  { handle: "ChampLibre0", url: "https://www.youtube.com/@ChampLibre0", avatar: "/youtubers/champlibre0.jpg" },
  { handle: "Donay", url: "https://www.youtube.com/@DONAYNUPHAR", avatar: "/youtubers/donay.jpg" },
  { handle: "Skyflooze", url: "https://www.youtube.com/@Skyflooze", avatar: "/youtubers/skyflooze.jpg" },
  { handle: "Maxim-well", url: "https://www.youtube.com/@Maxim-well", avatar: "/youtubers/maxim-well.jpg" },
  { handle: "Malcoclicot", url: "https://www.youtube.com/@Malcoclicot", avatar: "/youtubers/malcoclicot.jpg" },
  { handle: "PetitShiny", url: "https://www.youtube.com/@PetitShiny", avatar: "/youtubers/petitshiny.jpg" },
  { handle: "Rezma91", url: "https://www.youtube.com/@Rezma91", avatar: "/youtubers/rezma91.jpg" },
  { handle: "jal", url: "https://www.youtube.com/@jalbrax", avatar: "/youtubers/jalbrax.jpg" },
];
