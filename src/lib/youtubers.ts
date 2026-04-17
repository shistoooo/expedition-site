/**
 * YouTubeurs qui utilisent (et ont autorisé) la suite Expédition.
 * Source unique partagée par /pionnier (PionnierTestimonials) et la homepage
 * (HomeYoutuberShowcase). Pour retirer ou ajouter quelqu'un, modifie ici une
 * seule fois et les deux pages se mettent à jour.
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
  { handle: "jalbrax", url: "https://www.youtube.com/@jalbrax", avatar: "/youtubers/jalbrax.jpg" },
  { handle: "PetitShiny", url: "https://www.youtube.com/@PetitShiny", avatar: "/youtubers/petitshiny.jpg" },
  { handle: "Rezma91", url: "https://www.youtube.com/@Rezma91", avatar: "/youtubers/rezma91.jpg" },
  { handle: "Maxim-well", url: "https://www.youtube.com/@Maxim-well", avatar: "/youtubers/maxim-well.jpg" },
  { handle: "ChampLibre0", url: "https://www.youtube.com/@ChampLibre0", avatar: "/youtubers/champlibre0.jpg" },
];
