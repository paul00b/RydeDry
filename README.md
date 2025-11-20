# 🚴‍♂️ RideDry - Évitez la pluie à vélo

Web-app mobile-first pour planifier vos trajets à vélo en fonction de la météo.

## 🎯 Fonctionnalités

- **Météo heure par heure** : Consultez les prévisions pour les prochaines heures
- **Calcul intelligent** : L'app calcule l'heure de départ optimale pour éviter la pluie
- **Trajets personnalisés** : Configurez vos trajets quotidiens (maison ↔ boulot, etc.)
- **Notifications** : Recevez des alertes avant vos trajets (lorsque la page est ouverte)
- **Mobile-first** : Interface optimisée pour smartphone, inspirée de Monday.com

## 🚀 Installation

### 1. Prérequis
- Node.js 16+ et npm

### 2. Installation des dépendances
```bash
npm install
```

### 3. Configuration de la clé API météo

L'application utilise l'API OpenWeatherMap pour récupérer les prévisions météo.

**Obtenir une clé API gratuite :**

1. Créez un compte sur [OpenWeatherMap](https://openweathermap.org/api)
2. Allez dans "API keys" dans votre profil
3. Copiez votre clé API

**Configurer la clé dans l'app :**

- Lancez l'application (voir ci-dessous)
- Allez dans l'onglet "Réglages" (icône engrenage)
- Collez votre clé API dans le champ prévu
- Cliquez sur "Enregistrer"

> **Mode démo :** Sans clé API, l'app utilise des données météo mockées pour la démonstration.

### 4. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### 5. Build pour production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`.

## 📦 Déploiement

### Netlify

1. Connectez votre repo GitHub à Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Déployez !

### Vercel

1. Importez votre projet dans Vercel
2. Le framework sera détecté automatiquement (Vite)
3. Déployez !

Aucune variable d'environnement n'est requise côté serveur (la clé API est stockée côté client dans localStorage).

## 🛠️ Stack technique

- **React 18** + TypeScript
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS v4** - Styling avec design system custom
- **OpenWeatherMap API** - Données météo
- **LocalStorage** - Persistance locale (trajets, réglages)
- **Lucide React** - Icônes modernes

## 📱 Structure de l'application

### Pages

1. **Accueil (Home)**
   - Météo actuelle et timeline horaire
   - Prochain trajet avec heure de départ recommandée
   - Liste des trajets configurés

2. **Trajets**
   - Gestion complète des trajets
   - Ajout/modification/suppression
   - Configuration détaillée (horaires, jours actifs, notifications)

3. **Réglages**
   - Clé API OpenWeather
   - Localisation par défaut
   - Sensibilité à la pluie
   - Gestion des notifications

### Logique métier

**Calcul de l'heure optimale** (`src/utils/optimalTime.ts`)

L'algorithme :
1. Génère tous les créneaux de départ possibles (pas de 5 min) dans la fenêtre définie
2. Pour chaque créneau, récupère les prévisions météo pendant le trajet
3. Calcule un score de pluie (70% du max + 30% de la moyenne)
4. Choisit le créneau avec le score le plus faible
5. Génère une recommandation textuelle

**Gestion météo** (`src/utils/weather.ts`)

- Appel à l'API OpenWeather (forecast 5 jours / 3h)
- Fallback sur données mockées si erreur ou pas de clé API
- Interpolation des données horaires

## ⚠️ Limitations du MVP

### Ce qui est implémenté :

✅ Interface mobile-first responsive  
✅ Calcul intelligent de l'heure optimale  
✅ Persistance locale (localStorage)  
✅ Notifications navigateur (basiques)  
✅ Prévisions météo réelles (via API)  
✅ Gestion multi-trajets  
✅ Design inspiré Monday.com  

### Ce qui n'est PAS implémenté (hors scope MVP) :

❌ **Notifications persistantes** : Les notifications ne fonctionnent que quand l'onglet est ouvert. Pour des notifications push réelles, il faudrait :
  - Un service worker
  - Un backend pour déclencher les notifications
  - Une intégration Push API

❌ **Géolocalisation automatique** : Le champ localisation est en texte libre (nom de ville). La géolocalisation GPS pourrait être ajoutée avec l'API Geolocation du navigateur.

❌ **Synchronisation cloud** : Les données sont stockées localement. Elles ne sont pas synchronisées entre appareils.

❌ **Données météo sub-horaires** : L'API gratuite OpenWeather donne des prévisions toutes les 3h. Pour du horaire précis, il faudrait l'API One Call (payante).

❌ **Authentification** : Pas de comptes utilisateurs.

## 🎨 Design system

Le design s'inspire de Monday.com :

- **Couleurs** : Palette violet/bleu douce
- **Cartes** : Très arrondies (16px), ombres subtiles
- **Typographie** : Hiérarchie claire, espacements généreux
- **Layout** : Mobile-first, bottom navigation
- **Interactions** : Transitions fluides, hover states

Variables CSS custom dans `src/styles/globals.css`.

## 📝 License

Ce projet est un MVP de démonstration. Libre d'utilisation et de modification.

---

**Bon vent ! 🚴‍♂️☀️**
