#!/bin/bash

# 🧪 Script de test du build RideDry

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 Test du build RideDry avec Keep-Alive"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm non installé"
    exit 1
fi

echo "✅ npm installé : $(npm --version)"
echo ""

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation"
    exit 1
fi

echo "✅ Dépendances installées"
echo ""

# Build
echo "🔨 Build de l'application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

echo "✅ Build réussi !"
echo ""

# Vérifier que les fichiers sont présents
echo "🔍 Vérification des fichiers..."

if [ -f "dist/index.html" ]; then
    echo "✅ index.html présent"
else
    echo "❌ index.html manquant"
    exit 1
fi

if [ -f "dist/manifest.json" ]; then
    echo "✅ manifest.json présent"
else
    echo "❌ manifest.json manquant"
    exit 1
fi

if [ -f "dist/sw-advanced.js" ]; then
    echo "✅ sw-advanced.js présent"
else
    echo "⚠️  sw-advanced.js manquant (sera copié au déploiement)"
fi

if [ -f "dist/sw.js" ]; then
    echo "✅ sw.js présent"
else
    echo "⚠️  sw.js manquant (sera copié au déploiement)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ TOUS LES TESTS SONT PASSÉS !"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Prochaines étapes :"
echo ""
echo "1. Lancer en dev :"
echo "   npm run dev"
echo ""
echo "2. Déployer :"
echo "   vercel --prod"
echo ""
echo "3. Tester la PWA :"
echo "   - Ouvrir l'app"
echo "   - Activer les notifications dans Réglages"
echo "   - Vérifier 'Système Keep-Alive ✅'"
echo "   - Installer sur écran d'accueil (mobile)"
echo ""
echo "🚴 Bon trajet sans pluie ! ☀️"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
