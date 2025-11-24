# 🚴‍♂️ RideDry - Évitez la pluie à vélo

Web-app mobile-first pour planifier vos trajets à vélo en fonction de la météo.

## 🎯 Fonctionnalités

- **Météo heure par heure** : Consultez les prévisions pour les prochaines heures
- **🌧️ Radar de pluie interactif** : Visualisez les précipitations en temps réel et anticipées avec timeline (±2h)
- **Calcul intelligent** : L'app calcule l'heure de départ optimale pour éviter la pluie
- **Trajets personnalisés** : Configurez vos trajets quotidiens (maison ↔ boulot, etc.)
- **🔔 Notifications Keep-Alive** : Système avancé de notifications même en arrière-plan (onglet ouvert)
- **📱 PWA optimisée** : Installable sur mobile avec Service Worker avancé
- **Mode Dark/Light** : Thème adaptatif avec sauvegarde de préférence
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
- **RainViewer API** - Radar de précipitations (gratuit)
- **Leaflet** + **React Leaflet** - Cartographie interactive
- **LocalStorage** - Persistance locale (trajets, réglages)
- **Lucide React** - Icônes modernes

## 📱 Structure de l'application

### Pages

1. **Accueil (Home)**
   - **Carousel météo** : Swipe entre météo actuelle et radar pluie
   - **Radar interactif** : Carte Leaflet avec timeline ±2h et animation
   - Timeline horaire des prévisions
   - Prochain trajet avec heure de départ recommandée
   - Liste des trajets configurés

2. **Trajets**
   - Gestion complète des trajets
   - Ajout/modification/suppression
   - Configuration détaillée (horaires, jours actifs, notifications)
   - Bouton flottant "Ajouter un trajet"

3. **Réglages**
   - Clé API OpenWeather
   - Localisation par défaut
   - Sensibilité à la pluie
   - Thème Dark/Light
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

**Radar de précipitations** (`src/components/weather/WeatherRadar.tsx`)

- API RainViewer pour données radar gratuites
- Historique -2h et prévisions +2h (nowcasting)
- Animation automatique avec contrôles Play/Pause
- Timeline interactive avec slider
- Voir [RADAR.md](./RADAR.md) pour documentation complète

## ⚠️ Limitations du MVP

### Ce qui est implémenté :

✅ Interface mobile-first responsive  
✅ Radar de pluie interactif avec timeline  
✅ Calcul intelligent de l'heure optimale  
✅ Persistance locale (localStorage)  
✅ **Notifications Keep-Alive** (fonctionnent onglet ouvert, même en arrière-plan) ✨  
✅ **Service Worker avancé** avec IndexedDB ✨  
✅ **PWA installable** sur mobile ✨  
✅ Prévisions météo réelles (via API)  
✅ Gestion multi-trajets  
✅ Design inspiré Monday.com  
✅ Mode Dark/Light complet  

### Ce qui n'est PAS implémenté (hors scope MVP) :

❌ **Notifications app fermée** : Les notifications ne fonctionnent que quand le navigateur est ouvert (même en arrière-plan OK). Pour des notifications avec navigateur fermé, il faudrait :
  - Un backend avec Web Push API
  - Serveur pour déclencher les notifications
  - VAPID keys et gestion des subscriptions
  - **Alternative disponible :** Prompt complet pour app Android native dans `ANDROID-NATIVE-PROMPT.md`

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
- **Thème** : Dark/Light avec variables CSS adaptatives

Variables CSS custom dans `src/styles/globals.css`.

## 📚 Documentation

### Principales
- **[NOTIFICATIONS-QUICK-START.md](./NOTIFICATIONS-QUICK-START.md)** - 🔔 Guide rapide du système de notifications Keep-Alive
- **[NOTIFICATIONS-SOLUTION.md](./NOTIFICATIONS-SOLUTION.md)** - 🔧 Explication technique détaillée du système
- [RADAR.md](./RADAR.md) - Documentation complète du radar météo
- [THEME.md](./THEME.md) - Documentation du système de thème Dark/Light

### Techniques
- [INSTALL_RADAR.md](./INSTALL_RADAR.md) - Guide d'installation du radar
- [DEPLOY.md](./DEPLOY.md) - Guide de déploiement
- [CHANGELOG.md](./CHANGELOG.md) - Historique des versions
- [MIGRATION-NOTIFICATIONS.md](./MIGRATION-NOTIFICATIONS.md) - Migration système notifications

### Alternative Android
- **[ANDROID-NATIVE-PROMPT.md](./ANDROID-NATIVE-PROMPT.md)** - 📱 Prompt complet pour créer une app Android native avec notifications garanties
- **[ANDROID-QUICK-BRIEF.md](./ANDROID-QUICK-BRIEF.md)** - Version courte du prompt Android

## 📝 License

Ce projet est un MVP de démonstration. Libre d'utilisation et de modification.

---

**Bon vent ! 🚴‍♂️☀️**