# 📝 Changelog - RideDry

## Version 1.2.0 - Radar Météo Interactif (Novembre 2024)

### ✨ Nouvelles fonctionnalités

#### 🌧️ Radar des précipitations
- **Carte interactive** avec Leaflet et OpenStreetMap
- **Overlay de pluie en temps réel** via RainViewer API (gratuit)
- **Timeline interactive** : -2h (historique) à +2h (prévisions)
- **Animation automatique** avec contrôles Play/Pause
- **Slider manuel** pour naviguer dans le temps
- **Légende** des intensités de pluie

#### 🎠 Système de Carousel
- **2 vues disponibles** : Météo actuelle et Radar pluie
- **Navigation** par boutons ou swipe tactile
- **Indicateurs visuels** de position (points)
- **Transitions fluides** (300ms)

### 🛠️ Composants créés

1. **WeatherRadar.tsx**
   - Carte Leaflet avec overlay RainViewer
   - Timeline avec slider et contrôles
   - Animation automatique (500ms par frame)
   - Actualisation automatique (10 min)

2. **WeatherCarousel.tsx**
   - Carousel horizontal 2 slides
   - Support swipe mobile
   - Navigation par boutons
   - Indicateurs de position

3. **WeatherCard.tsx**
   - Carte météo actuelle standalone
   - Réutilisable dans le carousel
   - Support dark/light mode

### 📦 Dépendances ajoutées

```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1",
  "@types/leaflet": "^1.9.8"
}
```

### 📄 Documentation ajoutée

- `/RADAR.md` - Documentation complète du radar
- `/INSTALL_RADAR.md` - Guide d'installation
- `/CHANGELOG.md` - Ce fichier

### 🔧 Fichiers modifiés

- `/src/pages/Home.tsx` - Intégration du carousel
- `/src/main.tsx` - Import CSS Leaflet
- `/package.json` - Nouvelles dépendances

---

## Version 1.1.0 - Améliorations UX (Novembre 2024)

### ✨ Nouvelles fonctionnalités

#### ⏰ Heure en temps réel
- **Affichage de l'heure** dans le header (format HH:mm)
- **Mise à jour automatique** toutes les minutes
- **Police monospace** pour meilleure lisibilité

#### 💬 Messages contextuels
- **4 périodes** : Matin, Après-midi, Soirée, Nuit
- **Messages adaptés** :
  - 5h-12h : "Passez une bonne journée"
  - 12h-18h : "Bon après-midi"
  - 18h-22h : "Bonne soirée"
  - 22h-5h : "Bonne nuit"
- **Sans émojis** pour un design épuré

#### 📍 Bouton flottant "Trajets"
- **Position fixe** en bas de page
- **Au-dessus de la navigation** (z-index)
- **Ombre portée** pour effet flottant
- **Responsive** avec max-width

### 🔧 Fichiers modifiés

- `/src/components/layout/PageHeader.tsx`
- `/src/pages/Home.tsx`
- `/src/pages/Trips.tsx`

---

## Version 1.0.0 - Version initiale (Novembre 2024)

### ✨ Fonctionnalités principales

#### 🌤️ Météo
- **API OpenWeatherMap** intégrée
- **Météo actuelle** avec détails
- **Timeline 12h** de prévisions
- **Probabilité de pluie** mise en avant

#### 🚴 Gestion des trajets
- **CRUD complet** des trajets
- **Planification** par départ ou arrivée
- **Fenêtre horaire** configurable
- **Jours actifs** sélectionnables
- **Notifications** optionnelles

#### 🧮 Calcul optimal
- **Algorithme de scoring** de la pluie
- **Recommandations** personnalisées
- **Affichage du prochain trajet**
- **Météo pendant le trajet**

#### 🎨 Design
- **Style neumorphique** inspiré de Monday.com
- **Cartes arrondies** avec ombres douces
- **Dégradés** subtils
- **Mobile-first** responsive

#### 🌓 Mode Dark/Light
- **Toggle** dans le header
- **Variables CSS** adaptatives
- **Sauvegarde** dans localStorage
- **Transitions fluides** (300ms)
- **Support complet** de tous les composants

#### ⚙️ Réglages
- **Clé API** configurable
- **Localisation** par défaut
- **Sensibilité pluie** ajustable
- **Thème** Light/Dark

### 🗄️ Persistance
- **localStorage** pour tous les états
- **Récupération** au chargement
- **Pas de backend** nécessaire

### 📱 PWA Ready
- **Manifest.json** configuré
- **Service Worker** basique
- **Installable** sur mobile

---

## 🚀 Prochaines versions prévues

### Version 1.3.0 (À venir)
- [ ] Marqueurs de trajet sur la carte radar
- [ ] Contrôle de l'opacité de l'overlay
- [ ] Vitesse d'animation ajustable
- [ ] Sélection de position interactive

### Version 1.4.0 (À venir)
- [ ] Layers supplémentaires (nuages, température, vent)
- [ ] Prévisions étendues (48h+)
- [ ] Alertes météo push
- [ ] Historique des trajets effectués

### Version 2.0.0 (Futur)
- [ ] Backend Supabase
- [ ] Authentification utilisateur
- [ ] Synchronisation multi-appareils
- [ ] Statistiques et analytics
- [ ] Partage de trajets

---

**Légende** :
- ✨ Nouvelle fonctionnalité
- 🛠️ Composant/Outil
- 🔧 Modification
- 🐛 Correction de bug
- 📦 Dépendance
- 📄 Documentation
- 🎨 Design/Style
- 🚀 Performance
