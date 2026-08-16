#!/usr/bin/env node
/**
 * LE MÊME ARGUMENT, RÉPÉTÉ MOT POUR MOT, EST LA SIGNATURE D'UN TEXTE GÉNÉRÉ.
 *
 * Le 2026-08-08, le bloc de prix disait quatre fois la même chose : le titre
 * « une seule fois », le sous-titre « pas de renouvellement, pas de compteur »,
 * une pastille « pas de renouvellement, pas de compteur, rien à annuler », et la
 * carte « Une seule fois. Plus jamais de facture. » Deux répétitions mot pour
 * mot à trois lignes d'écart. Personne ne l'avait vu en relisant les fichiers un
 * par un : chaque bout venait d'un composant différent, et c'est seulement
 * assemblé dans le navigateur que ça saute aux yeux.
 *
 * D'où ce script : il lit la page RENDUE, pas les sources, et signale toute
 * suite de 4 mots ou plus qui revient. Il ne juge pas le style — il montre où
 * regarder.
 *
 *   node scripts/detecter-repetitions.mjs                    # la prod
 *   node scripts/detecter-repetitions.mjs http://localhost:3000/tubeforge
 *
 * Sort en code 1 s'il trouve quelque chose, pour servir de garde-fou en CI.
 */

/**
 * ⚠️ TROIS ADRESSES NE FONT PAS TROIS PAGES.
 *
 * Cette liste contenait `/`, `/tubeforge` et `/tubeforge/telecharger`. Or `/`
 * est une RÉÉCRITURE vers `/tubeforge`, et `/telecharger` REDIRIGE dessus
 * depuis la coupure du téléchargeur (09/08). Les trois servaient donc le même
 * HTML, et la comparaison entre pages a signalé seize phrases « partagées » :
 * la page se comparait à elle-même, trois fois.
 *
 * La liste est corrigée, et le script déduplique en plus par contenu — parce
 * qu'une future réécriture reproduira le problème sans prévenir.
 */
const PAGES_PAR_DEFAUT = [
  'https://expeditionlauncher.store/tubeforge',
  'https://expeditionlauncher.store/affiliation',
  // Le tunnel d'achat : son texte compte autant que celui de la page de vente,
  // et une troisième page permet à la règle « présent partout = décor » de
  // distinguer le pied de page d'une vraie répétition d'argument.
  'https://expeditionlauncher.store/tubeforge/checkout?plan=lifetime',
];
/**
 * ⚠️ NE PAS Y METTRE /cgv NI /affiliation/conditions.
 *
 * Un texte juridique cite le code de la consommation, donc il répète des
 * formules entières : 49 « répétitions » au premier passage, toutes légitimes.
 * Noyer les vrais défauts sous du bruit garanti, c'est la façon la plus sûre
 * de faire cesser de lire un outil. On peut toujours les passer à la main.
 */

/** Mots trop courants pour qu'une suite qui en est faite signifie quoi que ce soit. */
const VIDES = new Set(
  ('de la le les des du et à a un une en tu ton ta tes pour sur que qui ce pas plus sans ' +
   'dans il elle on se ne au aux est tout toute avec par ou où son sa ses mais donc y')
    .split(' '),
);

const N_MIN = 4;
const N_MAX = 6;

function texteVisible(html) {
  // `<title>` et `<noscript>` ne sont pas du texte de page : le titre remonte
  // sur chaque URL d'une même section et se faisait signaler comme « phrase
  // partagée », alors que c'est une métadonnée, pas un argument de vente.
  const sansCode = html.replace(
    /<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<title[\s\S]*?<\/title>|<noscript[\s\S]*?<\/noscript>/g,
    ' ',
  );
  return sansCode
    .replace(/<[^>]+>/g, '\n')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&(?:l|g)t;/g, ' ')
    .replace(/&eacute;/g, 'é').replace(/&egrave;/g, 'è').replace(/&agrave;/g, 'à')
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter((l) => l.length > 12);
}

function repetitions(lignes) {
  const mots = [...new Set(lignes)]
    .join(' ')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}'’ -]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const compte = new Map();
  for (let n = N_MIN; n <= N_MAX; n++) {
    for (let i = 0; i + n <= mots.length; i++) {
      const suite = mots.slice(i, i + n);
      // Une suite majoritairement faite de mots outils ne prouve rien.
      if (suite.filter((m) => VIDES.has(m)).length > Math.floor(n / 2)) continue;
      const cle = suite.join(' ');
      compte.set(cle, (compte.get(cle) || 0) + 1);
    }
  }

  // Un 6-gramme contient ses 4-grammes : on ne garde que la plus longue forme.
  const trouves = [...compte.entries()]
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[0].length - a[0].length || b[1] - a[1]);

  const gardes = [];
  for (const [suite, c] of trouves) {
    if (gardes.some(([g]) => g.includes(suite))) continue;
    gardes.push([suite, c]);
  }
  return gardes;
}

const pages = process.argv.slice(2).length ? process.argv.slice(2) : PAGES_PAR_DEFAUT;
let total = 0;
/**
 * Ce que chaque page dit, pour comparer les pages ENTRE ELLES.
 *
 * ⛔ LA FAILLE QUI A LAISSÉ PASSER UNE RÉPÉTITION. Le 2026-08-16, la page de
 * vente et la page d'après-achat portaient la même phrase à un mot près
 * (« Toutes les fonctionnalités, montrées une par une »). Ce script était vert :
 * il lisait une page à la fois, et aucune des deux ne se répétait elle-même.
 * Un détecteur qui ne regarde jamais deux pages ensemble ne peut pas voir ça.
 */
const parPage = new Map();

for (const url of pages) {
  let html;
  try {
    const r = await fetch(url, { redirect: 'follow' });
    if (!r.ok) { console.log(`\n⚠️  ${url} → HTTP ${r.status}, page ignorée`); continue; }
    html = await r.text();
  } catch (e) {
    console.log(`\n⚠️  ${url} injoignable : ${e.message}`);
    continue;
  }

  const lignes = texteVisible(html);
  const chemin0 = new URL(url).pathname || '/';
  // Deux adresses qui rendent le MÊME texte sont une seule page : on garde la
  // première et on ignore les suivantes, sinon chaque phrase paraît partagée.
  const empreinte = lignes.join('\u0000');
  const jumelle = [...parPage.entries()].find(([, l]) => l.join('\u0000') === empreinte);
  if (jumelle) {
    console.log(`\n··· ${chemin0} sert le même contenu que ${jumelle[0]} — ignorée`);
    continue;
  }
  parPage.set(chemin0, lignes);
  const trouves = repetitions(lignes);
  total += trouves.length;
  const chemin = new URL(url).pathname || '/';
  if (!trouves.length) { console.log(`\n✅ ${chemin} — aucune répétition`); continue; }
  console.log(`\n⛔ ${chemin} — ${trouves.length} suite(s) répétée(s)`);
  for (const [suite, c] of trouves.slice(0, 15)) console.log(`   ×${c}  « ${suite} »`);
}

/* ── Les mêmes phrases d'une page à l'autre ─────────────────────────────── */
const phrases = new Map();       // phrase normalisée → pages où elle apparaît
for (const [chemin, lignes] of parPage) {
  for (const l of new Set(lignes)) {
    // Une phrase courte se répète légitimement (« Mon compte », un prix, un CTA).
    // Au-delà de six mots, deux pages qui disent pareil plaident deux fois.
    if (l.split(/\s+/).length < 7) continue;
    const cle = l.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim();
    if (!phrases.has(cle)) phrases.set(cle, { texte: l, pages: new Set() });
    phrases.get(cle).pages.add(chemin);
  }
}
/**
 * Une phrase présente sur TOUTES les pages est du décor : entête, pied de page,
 * bandeau de consentement. La signaler à chaque passage apprend à ignorer
 * l'outil. On ne garde que ce qui apparaît sur PLUSIEURS pages sans être
 * partout — c'est là que deux surfaces plaident la même chose par accident.
 *
 * La règle ne s'applique qu'à partir de trois pages : avec deux, « partout »
 * et « sur les deux » sont la même chose, et on ne détecterait plus rien.
 */
const croisees = [...phrases.values()].filter(
  (p) => p.pages.size > 1 && (parPage.size < 3 || p.pages.size < parPage.size),
);
if (croisees.length) {
  console.log(`\n⛔ ${croisees.length} phrase(s) partagée(s) entre plusieurs pages`);
  for (const { texte, pages } of croisees.slice(0, 10)) {
    console.log(`   « ${texte.slice(0, 88)} »`);
    console.log(`     → ${[...pages].join('  ')}`);
  }
  total += croisees.length;
} else if (parPage.size > 1) {
  console.log('\n✅ aucune phrase partagée entre les pages');
}

console.log(
  total
    ? `\n${total} répétition(s). Chacune est un endroit où deux surfaces plaident la même chose : ` +
      `garde la meilleure, fais dire autre chose à l'autre.\n`
    : '\nRien à signaler.\n',
);
process.exit(total ? 1 : 0);
