# 🚀 Guide de Déploiement RideDry

## ✅ Corrections TypeScript effectuées

Toutes les erreurs TypeScript ont été corrigées :

1. **TripCard.tsx** - Correction du type pour `activeDays.includes()` en utilisant `as const`
2. **Home.tsx** - Suppression des imports non utilisés (`AlertCircle`, `loading`, `error`)
3. **Settings.tsx** - Suppression des imports non utilisés (`Key`, `ExternalLink`, `setApiKey`)
4. **optimalTime.ts** - Suppression de la variable non utilisée `avgPrecipProb`
5. **weather.ts** - Suppression du paramètre non utilisé `conditionMain` de `getWeatherIcon()`

## 📦 Déploiement sur Vercel

### Option A : Via l'interface Vercel (Recommandé)

1. **Pousser sur GitHub** :
```bash
git add .
git commit -m "🐛 Fix TypeScript errors for deployment"
git push
```

2. **Importer sur Vercel** :
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez sur "Add New..." → "Project"
   - Importez votre repository GitHub
   - Vercel détectera automatiquement Vite
   - Cliquez sur "Deploy"

### Option B : Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

## 🌐 Déploiement sur hébergement classique (FTP)

### 1. Build local

```bash
npm run build
```

### 2. Upload des fichiers

Uploadez **tout le contenu** du dossier `dist/` vers votre hébergement :
- Via FileZilla (FTP)
- Via cPanel → Gestionnaire de fichiers
- Via SFTP/SSH

**Important** : Les fichiers doivent être à la racine de `public_html/` (pas dans un sous-dossier `dist/`)

### 3. Configuration serveur

Le fichier `.htaccess` est déjà configuré et sera copié automatiquement lors du build.

## 🎯 Vérification post-déploiement

- [ ] L'app se charge correctement
- [ ] La navigation entre pages fonctionne
- [ ] Les données météo s'affichent
- [ ] L'ajout de trajets fonctionne
- [ ] La PWA est installable sur mobile

## 🔧 En cas de problème

### Build échoue

```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Page blanche après déploiement

Vérifiez que :
1. Les fichiers sont bien à la racine (pas dans un sous-dossier)
2. Le fichier `.htaccess` est présent
3. `mod_rewrite` est activé sur votre serveur

### Erreurs TypeScript

```bash
# Vérifier les erreurs localement
npm run build
```

Toutes les erreurs ont été corrigées, le build devrait passer sans problème ! ✅
