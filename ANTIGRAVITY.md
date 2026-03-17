# Expedition Site — Notes

## Stack
- Next.js 16 (App Router) avec Turbopack
- Déployé sur Vercel (expedition-two.vercel.app)
- Stripe pour les paiements
- Cloudflare Workers pour le licensing (expedition-licensing.expedition-studio.workers.dev)
- Cloudflare R2 pour les assets (expedition-apps bucket)

## Variables d'environnement (Turbopack)

Turbopack (bundler par défaut de Next.js 16) ne remplace PAS `process.env.NEXT_PUBLIC_*` dans les composants client.
Les valeurs publiques (WORKER_URL, Stripe publishable key, R2 URL) ont des fallbacks hardcodés avec `|| "valeur"`.
Ce ne sont PAS des failles de sécurité — ce sont des URLs publiques par design.

## Déploiement des apps via R2

Quand on déploie une nouvelle version de ClipForge ou TubeForge :

1. **Bumper `electron/package.json`** dans le repo de l'app AVANT le build
2. **Build :**
   - **Mac** : build en local avec `./build-mac-app.sh` (build complet + upload R2 automatique via wrangler)
   - **Windows** : push sur main → GitHub Actions `build-windows.yml` (workflow_dispatch) → upload R2 automatique
3. Mettre à jour `version.json` (dans ce repo) avec **exactement la même version** que dans le package.json
4. Uploader `version.json` sur R2

**Si version.json a une version supérieure à celle dans le zip, le launcher tourne en boucle "Mettre à jour" à l'infini.**

### Commandes de déploiement :
```bash
# Mac — build local + upload R2
cd <app-repo>  # tubeforge/ ou clipforge/
./build-mac-app.sh

# Windows — déclencher via GitHub Actions
gh workflow run build-windows.yml --repo shistoooo/<app> --ref main

# Mettre à jour version.json sur R2
npx wrangler r2 object put expedition-apps/version.json --file version.json --content-type "application/json" --remote
```
