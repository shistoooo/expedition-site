# 📦 Suivi des Versions - Expedition Apps

**Dernière mise à jour:** 29 Janvier 2026, 21h05

---

## 🎯 VERSIONS STABLES ACTUELLES - SOLUTION DENO BUNDLÉ

### TubeForge v2.0.12 🚀 NOUVEAU
**Date:** 29 Janvier 2026, 21h00  
**Status:** ✅ STABLE - DÉPLOYÉ R2 (Mac + Windows)  
**Build Mac:** 198 MB | **Build Windows:** 204 MB  
**URLs R2:**
- Mac: https://pub-a36a12c960fe437a9b884e6b7db5b56c.r2.dev/TubeForge.app.zip
- Windows: https://pub-a36a12c960fe437a9b884e6b7db5b56c.r2.dev/TubeForge-Windows-Installer.zip

**🎯 CHANGEMENT MAJEUR: Deno v2.1.4 Bundled**
1. ✅ Deno bundlé dans l'app (106 MB Mac, 111 MB Windows)
2. ✅ Solution standalone complète - zéro dépendances externes
3. ✅ Script `download_deno.py` télécharge Deno avant build
4. ✅ PyInstaller inclut Deno automatiquement
5. ✅ Code détecte Deno bundlé en priorité, fallback système
6. ✅ Compatible yt-dlp latest avec JS challenges YouTube
7. ✅ Fonctionne sans Homebrew (Mac) ou Node.js (Windows)

**Fichiers modifiés:**
- `backend/app/services/binaries.py` - `_get_bundled_deno_path()`, `_setup_env_with_deno()`
- `backend/tubeforge_backend.spec` - Ajout Deno dans `datas_list`
- `backend/download_deno.py` - Script téléchargement Deno
- `backend/.gitignore` - Exclusion `bundled_binaries/`
- `.github/workflows/build-windows.yml` - Step download Deno
- `electron/package.json` - Version 2.0.12

**Architecture:**
- Deno path bundlé: `_internal/bundled_binaries/deno_mac` ou `deno_windows.exe`
- Détection: PyInstaller frozen → `sys._MEIPASS`, Dev → `backend/bundled_binaries/`
- PATH setup: Deno bundlé ajouté en priorité via `_setup_env_with_deno()`

**Commits:**
- b620948: Bundle Deno (download script)
- 1a1eda9: Fix emojis Windows compatibility

---

### ClipForge v1.0.21 🚀 NOUVEAU
**Date:** 29 Janvier 2026, 21h00  
**Status:** ✅ STABLE - DÉPLOYÉ R2 (Mac + Windows)  
**Build Mac:** 560 MB | **Build Windows:** 416 MB  
**URLs R2:**
- Mac: https://pub-a36a12c960fe437a9b884e6b7db5b56c.r2.dev/ClipForge.app.zip
- Windows: https://pub-a36a12c960fe437a9b884e6b7db5b56c.r2.dev/ClipForge-Windows-Installer.zip

**🎯 CHANGEMENT MAJEUR: Deno v2.1.4 Bundled**
- Identique à TubeForge v2.0.12
- Solution standalone complète
- Deno bundlé (106 MB Mac, 111 MB Windows)
- Pipeline IA + téléchargement YouTube fonctionnels

**Fichiers modifiés:**
- `backend/app/services/binaries.py` - Détection Deno bundlé
- `backend/clipforge_backend.spec` - Ajout Deno dans `datas_list`
- `backend/download_deno.py` - Script téléchargement Deno
- `backend/.gitignore` - Exclusion `bundled_binaries/`
- `.github/workflows/build-windows.yml` - Step download Deno
- `electron/package.json` - Version 1.0.21

**Commits:**
- 22ac0de: Bundle Deno (download script)
- 64056e1: Fix emojis Windows compatibility
- Backend PyInstaller embedé dans .app

**Archive vérifiée:**
- ✅ TubeForge.app.zip intégrité OK (unzip -t)
- ✅ Upload R2 réussi (370 MB sur R2)
- ✅ URL accessible publiquement

---

## 📊 Historique R2 (Production)

### ✅ DÉPLOYÉ SUR R2 - 29 Janvier 2026, 14h27:
```
ClipForge: v1.0.18 (29 jan) - ✅ STABLE - 867 MB
TubeForge: v2.0.9 (29 jan) - ✅ STABLE - 370 MB
Launcher: v0.1.8 (24 jan) - ✅ STABLE (pas modifié)
```

**URLs vérifiées:**
- https://pub-a36a12c960fe437a9b884e6b7db5b56c.r2.dev/ClipForge.app.zip ✅
- https://pub-a36a12c960fe437a9b884e6b7db5b56c.r2.dev/TubeForge.app.zip ✅
- https://pub-a36a12c960fe437a9b884e6b7db5b56c.r2.dev/version.json ✅

---

## 🚫 RÈGLES CRITIQUES

### ❌ NE PAS TOUCHER
- **Version Windows** - Corrections nécessaires dans CORRECTIONS_WINDOWS.md avant tout rebuild
- **Launcher 0.1.8** - Stable, pas de modifications nécessaires
- **Code stable Mac** - ClipForge 1.0.18 et TubeForge fonctionnent, ne plus modifier

### ✅ À FAIRE
1. Identifier build réel TubeForge v2.0.9
2. Créer .zip depuis .app builds
3. Upload sur R2
4. Mettre à jour version.json R2
5. Vérifier URLs accessibles

---

## 📝 Notes Importantes

**Pourquoi ClipForge 1.0.18 et pas 1.0.17?**
- v1.0.17 sur R2 n'a PAS la migration emotion_score complète
- v1.0.18 buildée aujourd'hui a tous les fixes + tests validés
- App installée en local fonctionne parfaitement

**Backend Source vs PyInstaller:**
- Backend Python source (run_server.py) ne doit JAMAIS tourner en production
- App doit utiliser backend PyInstaller embarqué uniquement
- Build 1.0.18 vérifié : backend embarqué se lance automatiquement

**Signature App:**
- Icône blanche = signature corrompue/invalide
- Fix appliqué : codesign --force --deep --sign -
- Cache LaunchServices réinitialisé
- App reconnue par macOS

---

## 🔄 Prochaines Actions (en ordre)

1. [ ] Identifier build TubeForge réel (chercher par date modif + taille)
2. [ ] Créer ClipForge.app.zip depuis /Applications/ClipForge.app
3. [ ] Créer TubeForge.app.zip (une fois build trouvé)
4. [ ] Préparer version.json avec versions correctes
5. [ ] Upload sur R2 (boto3 + credentials existants)
6. [ ] Test download URLs R2
7. [ ] Créer mémoire permanente avec ce tracking

---

## 🔄 Correction Windows PATH - 29 Janvier 2026, 14h47

**Status:** ✅ CODE MODIFIÉ + TESTÉ MAC - Prêt pour build Windows

### Modifications Appliquées

**Fichiers modifiés:**
- `tubeforge/backend/app/services/binaries.py` (lignes 272-313)
- `clipforge/backend/app/services/binaries.py` (lignes 272-313)

**Changement:** PATH hardcodé macOS → Détection multi-plateforme (Windows/macOS/Linux)

**Git commits:**
- TubeForge: `fix(windows): multi-platform PATH detection for Deno/Node.js`
- ClipForge: Commit `5bf4a61` - Même correction

### Tests Effectués

**Mac (Darwin):**
- ✅ Backend TubeForge démarre (Python source)
- ✅ Téléchargement YouTube réussi (521 KB, 19s vidéo)
- ✅ Backend ClipForge démarre
- ✅ Comportement identique à avant (même PATH détecté)

**Windows:**
- ⏳ Build nécessaire (PyInstaller sur machine Windows)
- ⏳ Tests téléchargement JS challenges à effectuer

### Versions Actuelles (Inchangées)

**Mac - Stables et déployées R2:**
- ClipForge 1.0.18 ✅ (29 jan 14h27)
- TubeForge 2.0.9 ✅ (29 jan 14h27)
- Launcher 0.1.8 ✅ (24 jan)

**Pas de rebuild Mac nécessaire** - Correction pour Windows uniquement.

### ✅ Déploiement Windows Complété - 29 Janvier 2026, 15h02

**Status:** ✅ BUILDS TERMINÉS + DÉPLOYÉS R2

**GitHub Actions Builds:**
- TubeForge Windows: Run ID 21480738224 - Success (3m40s)
- ClipForge Windows: Run ID 21480738605 - Success (6m30s)

**Versions Déployées R2:**
- TubeForge v2.0.10 Windows (171 MB) ✅
- ClipForge v1.0.19 Windows (393 MB) ✅

**URLs R2 Vérifiées:**
- https://pub-a36a12c960fe437a9b884e6b7db5b56c.r2.dev/TubeForge-Windows-Installer.zip ✅
- https://pub-a36a12c960fe437a9b884e6b7db5b56c.r2.dev/ClipForge-Windows-Installer.zip ✅

**version.json R2 mis à jour:**
```json
{
  "tubeforge": {
    "version": "2.0.9",  // Mac
    "windows_version": "2.0.10",  // Windows avec fix PATH
    "windows_message": "Fix Windows: Détection PATH multi-plateforme"
  },
  "clipforge": {
    "version": "1.0.18",  // Mac
    "windows_version": "1.0.19",  // Windows avec fix PATH
    "windows_message": "Fix Windows: Détection PATH multi-plateforme"
  }
}
```

**Contenu Validé:**
- Backend PyInstaller avec nouveau code PATH multi-plateforme ✅
- FFmpeg inclus (99 MB) ✅
- Frontend Next.js bundlé ✅
- Electron Windows configuré ✅

**⚠️ Versions Mac stables INCHANGÉES - Toujours déployées et fonctionnelles**

---

**⚠️ Ce document doit être mis à jour à CHAQUE changement de version**
