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

const PAGES_PAR_DEFAUT = [
  'https://expeditionlauncher.store/',
  'https://expeditionlauncher.store/tubeforge',
  'https://expeditionlauncher.store/tubeforge/telecharger',
];

/** Mots trop courants pour qu'une suite qui en est faite signifie quoi que ce soit. */
const VIDES = new Set(
  ('de la le les des du et à a un une en tu ton ta tes pour sur que qui ce pas plus sans ' +
   'dans il elle on se ne au aux est tout toute avec par ou où son sa ses mais donc y')
    .split(' '),
);

const N_MIN = 4;
const N_MAX = 6;

function texteVisible(html) {
  const sansCode = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ');
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
  parPage.set(new URL(url).pathname || '/', lignes);
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
const croisees = [...phrases.values()].filter((p) => p.pages.size > 1);
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
