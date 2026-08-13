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
export const AFFILIATION_CONDITIONS_VERSION = "2026-08-11";

export type Clause = { titre: string; corps: string };

export const AFFILIATION_CONDITIONS: Clause[] = [
    {
        titre: "Ce qui est versé",
        corps:
            "43 % du montant hors taxes effectivement encaissé sur chaque achat unique TubeForge attribué à votre code, versé une seule fois par vente. Le taux et le prix peuvent changer pour les ventes à venir ; une vente déjà réalisée garde le taux en vigueur au moment où elle a eu lieu.",
    },
    {
        titre: "Comment une vente vous est attribuée",
        corps:
            "Une vente compte si l'acheteur est arrivé par votre lien et a payé dans les 30 jours qui suivent. Si plusieurs liens de partenaires différents ont été suivis, c'est le dernier qui compte. Une commande annulée, remboursée ou contestée n'ouvre droit à aucune commission, et une commission déjà versée sur une telle commande peut être reprise.",
    },
    {
        titre: "Quand vous êtes payé",
        corps:
            "Les commissions sont versées via Stripe Connect, sur le compte que vous aurez configuré. Un délai de 30 jours après la vente couvre la période de rétractation et de litige. Sans compte Stripe Connect valide, les commissions restent en attente jusqu'à ce qu'il le soit.",
    },
    {
        titre: "Ce que vous ne pouvez pas faire",
        corps:
            "Pas de spam, ni par e-mail ni en commentaires. Pas d'achat de mots-clés publicitaires sur la marque Expédition ou TubeForge, ni sur leurs variantes. Pas de promesse de gain, de résultat ou de revenu au nom d'Expédition. Pas de code de réduction inventé, ni d'affirmation sur le produit qui ne figure pas sur le site. Pas d'auto-parrainage : votre propre achat, ou celui d'un compte que vous contrôlez, n'ouvre droit à rien.",
    },
    {
        titre: "Vous parlez en votre nom",
        corps:
            "Vous êtes un partenaire indépendant, pas un salarié, pas un mandataire, et vous ne représentez pas Expédition. Vos publications doivent indiquer clairement qu'elles contiennent un lien affilié, comme la loi française l'impose depuis 2023 aux communications commerciales des créateurs.",
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
            "Sont conservés : votre compte, votre code, les ventes qui vous sont attribuées et la date à laquelle vous avez accepté ces conditions. Vous ne voyez jamais l'identité des personnes qui achètent par votre lien, seulement leur nombre. Vous pouvez demander la suppression de votre compte partenaire ; les écritures comptables liées aux versements sont conservées le temps que la loi impose.",
    },
    {
        titre: "Si le texte change",
        corps:
            "Une nouvelle version vous sera présentée avant de continuer à utiliser le programme. Ce que vous avez accepté aujourd'hui reste rattaché à la version datée du " +
            AFFILIATION_CONDITIONS_VERSION +
            ".",
    },
];
