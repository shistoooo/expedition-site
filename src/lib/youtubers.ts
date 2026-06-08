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

export const youtubers: Youtuber[] = [
  { handle: "jal", url: "https://www.youtube.com/@jalbrax", avatar: "/youtubers/jalbrax.jpg" },
  { handle: "PetitShiny", url: "https://www.youtube.com/@PetitShiny", avatar: "/youtubers/petitshiny.jpg" },
  { handle: "Rezma91", url: "https://www.youtube.com/@Rezma91", avatar: "/youtubers/rezma91.jpg" },
  { handle: "Maxim-well", url: "https://www.youtube.com/@Maxim-well", avatar: "/youtubers/maxim-well.jpg" },
  { handle: "ChampLibre0", url: "https://www.youtube.com/@ChampLibre0", avatar: "/youtubers/champlibre0.jpg" },
  { handle: "Malcoclicot", url: "https://www.youtube.com/@Malcoclicot", avatar: "/youtubers/malcoclicot.jpg" },
  { handle: "Skyflooze", url: "https://www.youtube.com/@Skyflooze", avatar: "/youtubers/skyflooze.jpg" },
  { handle: "manji", url: "https://www.youtube.com/@manjirosayno", avatar: "/youtubers/manji.jpg" },
  { handle: "Donay", url: "https://www.youtube.com/@Donay", avatar: "/youtubers/donay.jpg" },
];
