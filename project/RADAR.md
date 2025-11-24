# 🌧️ Radar Météo - RideDry

## Vue d'ensemble

Le radar météo interactif permet de visualiser les précipitations en temps réel et anticipées sur une carte interactive. Cette fonctionnalité est inspirée de Rain Today et intégrée directement dans l'application RideDry.

## Fonctionnalités

### 📍 Carte Interactive
- **Technologie** : Leaflet + OpenStreetMap
- **Centrage automatique** : Position détectée depuis les données météo
- **Zoom** : Contrôles de zoom intégrés
- **Niveau par défaut** : Zoom 9 (vue régionale)

### 🌧️ Overlay de Précipitations
- **Source** : API RainViewer (gratuite)
- **Données historiques** : 2 heures dans le passé
- **Prévisions** : 2 heures dans le futur
- **Opacité** : 60% pour voir la carte en dessous
- **Couleurs** : Bleu avec intensité variable

### ⏱️ Timeline Interactive

#### Slider
- **Navigation manuelle** : Glisser le curseur pour changer de frame
- **Indicateurs** : `-2h` → `Maintenant` → `+2h`
- **Visuel** : Barre de progression colorée

#### Contrôles
- **⏮️ Début** : Revenir à -2h
- **▶️ Play** : Animation automatique (500ms par frame)
- **⏸️ Pause** : Arrêter l'animation
- **⏭️ Fin** : Aller à +2h

#### Affichage du temps
- **Heure absolue** : Format `HH:mm`
- **Temps relatif** :
  - `Il y a X min` (passé)
  - `Maintenant` (présent)
  - `Dans X min` (futur)

### 🎨 Légende
Intensités de pluie :
- 🔵 **Faible** : Bruine légère
- 🔷 **Modérée** : Pluie
- 🔵 **Forte** : Pluie intense

## Architecture

### Composants créés

#### 1. `WeatherRadar.tsx`
Composant principal du radar météo.

```typescript
interface WeatherRadarProps {
  location: string;    // Nom de la ville
  lat?: number;       // Latitude (défaut: Paris)
  lon?: number;       // Longitude (défaut: Paris)
}
```

**Fonctionnalités** :
- Chargement des données RainViewer
- Gestion de la timeline
- Animation automatique
- Affichage de la carte Leaflet

#### 2. `WeatherCarousel.tsx`
Système de carousel pour alterner entre météo actuelle et radar.

```typescript
interface WeatherCarouselProps {
  weather: WeatherSlot | null;
  loading: boolean;
  error: string | null;
  location: string;
  lat?: number;
  lon?: number;
}
```

**Fonctionnalités** :
- 2 slides : "Météo actuelle" et "Radar pluie"
- Navigation par boutons
- Support du swipe tactile
- Indicateurs de position

#### 3. `WeatherCard.tsx`
Carte météo actuelle (réutilisée dans le carousel).

### API Utilisées

#### RainViewer API
**Endpoint** : `https://api.rainviewer.com/public/weather-maps.json`

**Réponse** :
```json
{
  "radar": {
    "past": [
      { "path": "/v2/radar/...", "time": 1234567890 }
    ],
    "nowcast": [
      { "path": "/v2/radar/...", "time": 1234567890 }
    ]
  }
}
```

**Tiles radar** :
```
https://tilecache.rainviewer.com{path}/256/{z}/{x}/{y}/2/1_1.png
```

Paramètres :
- `256` : Taille des tuiles
- `2` : Couleur scheme (bleu)
- `1_1` : Smooth + snow

#### OpenStreetMap
**Tiles** : `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`

### Dépendances ajoutées

```json
{
  "dependencies": {
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1"
  },
  "devDependencies": {
    "@types/leaflet": "^1.9.8"
  }
}
```

## Utilisation

### Navigation
1. **Page Home** → Section en haut
2. **Boutons** : "Météo actuelle" ou "Radar pluie"
3. **Swipe** : Glisser vers la gauche/droite sur mobile

### Lecture de l'animation
1. Cliquer sur **▶️ Play**
2. Observer le déplacement des précipitations
3. Pause avec **⏸️**

### Navigation manuelle
1. Glisser le **slider**
2. Ou utiliser **⏮️ Début** / **⏭️ Fin**

## Optimisations

### Performance
- ✅ Actualisation toutes les 10 minutes
- ✅ Nettoyage des layers Leaflet
- ✅ Debounce sur le slider (animation uniquement)

### UX
- ✅ Chargement progressif
- ✅ Messages d'état ("Chargement du radar...")
- ✅ Transitions fluides (300ms)
- ✅ Support dark/light mode

### Accessibilité
- ✅ Attributs `aria-label`
- ✅ Boutons avec `title`
- ✅ Texte alternatif pour la carte

## Limitations connues

1. **Couverture géographique** :
   - RainViewer couvre principalement l'Europe et l'Amérique du Nord
   - Données limitées pour certaines régions

2. **Précision** :
   - Prévisions jusqu'à 2h seulement
   - Basées sur le mouvement des nuages (nowcasting)

3. **Rafraîchissement** :
   - Données mises à jour toutes les 10 minutes
   - Peut avoir un léger décalage

## Évolutions futures

### À court terme
- [ ] Sélection de la position sur la carte
- [ ] Contrôle de l'opacité de l'overlay
- [ ] Vitesse d'animation ajustable

### À moyen terme
- [ ] Layers supplémentaires (nuages, température)
- [ ] Marqueur pour les trajets
- [ ] Trajet dessiné sur la carte

### À long terme
- [ ] Prévisions étendues (API payante)
- [ ] Alertes météo géolocalisées
- [ ] Partage de capture d'écran du radar

## Ressources

- **RainViewer API** : https://www.rainviewer.com/api.html
- **Leaflet** : https://leafletjs.com/
- **React Leaflet** : https://react-leaflet.js.org/

---

**Version** : 1.2.0  
**Date** : Novembre 2024  
**Status** : ✅ Production Ready
