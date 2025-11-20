# 📦 Installation du Radar Météo

## Étapes d'installation

### 1. Installer les dépendances

```bash
npm install
```

Les packages suivants seront installés :
- `leaflet@^1.9.4` - Librairie de cartographie
- `react-leaflet@^4.2.1` - Wrapper React pour Leaflet
- `@types/leaflet@^1.9.8` - Types TypeScript

### 2. Vérifier les fichiers

Les fichiers suivants ont été créés/modifiés :

**Nouveaux composants** :
- `/src/components/weather/WeatherRadar.tsx`
- `/src/components/weather/WeatherCarousel.tsx`
- `/src/components/weather/WeatherCard.tsx`

**Fichiers modifiés** :
- `/src/pages/Home.tsx` - Intégration du carousel
- `/src/main.tsx` - Import du CSS Leaflet
- `/package.json` - Dépendances ajoutées

**Documentation** :
- `/RADAR.md` - Documentation complète
- `/INSTALL_RADAR.md` - Ce fichier

### 3. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### 4. Tester le radar

1. Ouvrir l'application dans le navigateur
2. Sur la page **Home**, vous verrez deux boutons en haut :
   - "Météo actuelle"
   - "Radar pluie"
3. Cliquer sur **"Radar pluie"**
4. La carte devrait s'afficher avec :
   - Carte OpenStreetMap centrée sur votre position
   - Overlay de précipitations (si disponible)
   - Timeline avec slider
   - Boutons de contrôle (Play/Pause)

## Résolution de problèmes

### La carte ne s'affiche pas

**Symptôme** : Rectangle gris ou carte vide

**Solution** :
1. Vérifier que le CSS Leaflet est importé dans `/src/main.tsx` :
   ```typescript
   import 'leaflet/dist/leaflet.css'
   ```

2. Vérifier la console pour des erreurs réseau

3. Forcer le rafraîchissement du cache :
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

### Erreur TypeScript avec Leaflet

**Symptôme** : `Cannot find module 'leaflet'`

**Solution** :
```bash
npm install --save-dev @types/leaflet
```

### Aucune donnée radar

**Symptôme** : Message "Chargement du radar..." qui ne disparaît pas

**Solution** :
1. Vérifier la connexion Internet
2. Vérifier que l'API RainViewer est accessible :
   ```bash
   curl https://api.rainviewer.com/public/weather-maps.json
   ```
3. Regarder la console du navigateur pour des erreurs CORS

### Performance lente

**Symptôme** : Animation saccadée ou lente

**Solution** :
1. Réduire le niveau de zoom dans `WeatherRadar.tsx` :
   ```typescript
   zoom={8}  // au lieu de 9
   ```

2. Augmenter l'intervalle d'animation :
   ```typescript
   }, 800);  // au lieu de 500ms
   ```

### Tiles manquantes sur la carte

**Symptôme** : Certaines zones de la carte ne se chargent pas

**Solution** :
1. Attendre quelques secondes (chargement réseau)
2. Zoomer/dézoomer pour forcer le rechargement
3. Vérifier que OpenStreetMap est accessible

## Build pour production

```bash
npm run build
```

Le build sera créé dans le dossier `/dist`

### Vérifier le build

```bash
npm run preview
```

## Configuration avancée

### Changer la position par défaut

Dans `/src/components/weather/WeatherRadar.tsx` :

```typescript
export function WeatherRadar({ 
  location, 
  lat = 48.8566,  // Latitude de Paris
  lon = 2.3522    // Longitude de Paris
}: WeatherRadarProps) {
```

### Modifier le niveau de zoom

```typescript
<MapContainer
  center={[lat, lon]}
  zoom={10}  // Modifier cette valeur (1-18)
  // ...
>
```

### Ajuster l'opacité du radar

```typescript
const radarLayer = new L.TileLayer(
  `...`,
  {
    tileSize: 256,
    opacity: 0.8,  // 0.0 à 1.0
    zIndex: 10,
  }
);
```

### Changer la fréquence de rafraîchissement

```typescript
// Actualiser toutes les 5 minutes au lieu de 10
const refreshInterval = setInterval(fetchRadarData, 5 * 60 * 1000);
```

### Modifier la vitesse d'animation

```typescript
// Change de frame toutes les 300ms au lieu de 500ms
intervalRef.current = setInterval(() => {
  // ...
}, 300);
```

## Support

Pour toute question ou problème :
1. Consulter `/RADAR.md` pour la documentation complète
2. Vérifier les logs de la console navigateur
3. Vérifier les logs du serveur de développement

## Ressources

- **Leaflet** : https://leafletjs.com/reference.html
- **React Leaflet** : https://react-leaflet.js.org/docs/start-introduction
- **RainViewer API** : https://www.rainviewer.com/api.html
- **OpenStreetMap** : https://www.openstreetmap.org/

---

Bon développement ! 🚀
