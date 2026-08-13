/**
 * CONDITIONS DU PROGRAMME D'AFFILIATION.
 *
 * ⚠️ BROUILLON À FAIRE RELIRE. Ce texte a été rédigé par un assistant, pas par
 * un juriste. Il engage la responsabilité d'Expédition autant que celle du
 * partenaire : faire valider avant de le considérer comme opposable.
 *
 * La version DOIT rester identique à `AFFILIATION_CONDITIONS_VERSION` côté
 * worker (`licensing/src/config-offre.ts`). C'est cette chaîne qui est stockée
 * en base au moment de l'acceptation : deux textes différents portant la même
 * version rendraient la trace inutilisable.
 */
export const AFFILIATION_CONDITIONS_VERSION = "2026-08-13.2";

export type Clause = { titre: string; corps: string };

export const AFFILIATION_CONDITIONS: Clause[] = [
    {
        titre: "Ce qui est versé",
        corps:
            "Expédition s'engage à vous rémunérer selon les règles de ce document : 43 % du montant hors taxes encaissé sur chaque achat unique TubeForge attribué à votre code, versé une seule fois par vente. Le taux et le prix peuvent changer pour les ventes à venir ; une vente déjà réalisée garde le taux en vigueur au moment où elle a eu lieu.",
    },
    {
        titre: "Comment une vente vous est attribuée",
        corps:
            "Une vente compte si l'acheteur est arrivé par votre lien et a payé dans les 30 jours qui suivent. Si l'acheteur a suivi plusieurs liens de partenaires, le dernier l'emporte. Une commande annulée, remboursée ou contestée n'ouvre droit à aucune commission, et une commission déjà versée sur une telle commande peut être reprise.",
    },
    {
        titre: "Quand vous êtes payé",
        corps:
            "Expédition verse les commissions par Stripe Connect, sur le compte que vous configurez. Le versement intervient 30 jours après la vente, le temps de couvrir rétractation et litige. Tant que votre compte Stripe Connect n'est pas valide, vos commissions vous attendent.",
    },
    {
        titre: "Ce que vous ne pouvez pas faire",
        corps:
            "Pas de spam, ni par e-mail ni en commentaires. N'achetez pas de mots-clés publicitaires sur la marque Expédition ou TubeForge, ni sur leurs variantes. Ne promettez aucun gain ni aucun revenu au nom d'Expédition, et n'affirmez sur le produit que ce qui figure sur le site. Les codes de réduction que vous inventez n'engagent que vous. Enfin, l'auto-parrainage ne rapporte rien : ni votre propre achat, ni celui d'un compte que vous contrôlez.",
    },
    {
        titre: "Vous parlez en votre nom",
        corps:
            "Vous êtes un partenaire indépendant : ni salarié, ni mandataire, et vous ne représentez pas Expédition. Vos publications doivent dire qu'elles contiennent un lien affilié, comme la loi française l'impose depuis 2023 aux créateurs qui font de la communication commerciale.",
    },
    {
        titre: "Vos impôts sont les vôtres",
        corps:
            "Les sommes versées sont des revenus que vous déclarez vous-même, selon votre statut et votre pays. Expédition ne retient ni ne déclare rien à votre place, et vous transmet un récapitulatif des versements sur demande.",
    },
    {
        titre: "Arrêter, des deux côtés",
        corps:
            "Vous pouvez quitter le programme quand vous voulez. Expédition peut suspendre ou fermer un compte partenaire en cas de manquement aux règles ci-dessus, et retenir les commissions liées aux ventes concernées. Hors manquement, les commissions déjà acquises restent dues.",
    },
    {
        titre: "Vos données",
        corps:
            "Expédition conserve votre compte, votre code, les ventes qui vous sont attribuées et la date à laquelle vous avez accepté ces conditions. Vous ne voyez jamais l'identité des personnes qui achètent par votre lien, seulement leur nombre. Vous pouvez demander la suppression de votre compte partenaire ; les écritures comptables liées aux versements sont conservées le temps que la loi impose.",
    },
    {
        titre: "Si le texte change",
        corps:
            "Expédition vous présentera la nouvelle version avant que vous continuiez. Ce que vous avez accepté aujourd'hui reste rattaché à la version datée du " +
            AFFILIATION_CONDITIONS_VERSION +
            ".",
    },
];
