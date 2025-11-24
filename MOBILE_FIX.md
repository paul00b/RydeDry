# 📱 Correctifs Mobile pour RideDry

## Problèmes résolus

### 1. ✅ Viewport corrigé (`index.html`)
**Avant** : 
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

**Après** :
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
```

**Pourquoi** : Améliore la compatibilité iOS et permet le zoom si nécessaire.

---

### 2. ✅ ErrorBoundary ajouté (`src/main.tsx`)
**Ajout** : Wrapper ErrorBoundary qui intercepte les erreurs React
- Affiche un message d'erreur clair au lieu d'un écran blanc
- Permet de recharger l'application
- Log les erreurs dans la console pour débogage

**Pourquoi** : Sur mobile, les erreurs JavaScript peuvent causer un écran blanc sans message. L'ErrorBoundary permet de voir ce qui ne va pas.

---

### 3. ✅ Gestion d'erreur globale (`src/main.tsx`)
**Ajout** :
```typescript
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
```

**Pourquoi** : Capture toutes les erreurs non gérées pour débogage.

---

### 4. ✅ WeatherRadar mobile-friendly (`src/components/weather/WeatherRadar.tsx`)

**Changements** :
- ✅ Ajout de gestion d'erreur avec état `error`
- ✅ Affichage d'un message d'erreur si le radar ne charge pas
- ✅ Touch events activés pour Leaflet :
  ```typescript
  touchZoom={true}
  scrollWheelZoom={false}
  dragging={true}
  tap={true}
  ```
- ✅ `pointer-events-none` sur la légende pour ne pas bloquer les interactions
- ✅ `touch-pan-y` sur le conteneur de la carte
- ✅ `window.setInterval` au lieu de `setInterval` (plus compatible)

**Pourquoi** : Leaflet peut crasher sur mobile si les touch events ne sont pas bien configurés.

---

### 5. ✅ Styles CSS mobile (`src/styles/globals.css`)

**Ajouts** :
```css
body {
  /* Empêcher le zoom sur iOS lors du focus */
  -webkit-text-size-adjust: 100%;
  /* Améliorer le scroll sur iOS */
  -webkit-overflow-scrolling: touch;
  /* Désactiver le tap highlight */
  -webkit-tap-highlight-color: transparent;
}
```

**Pourquoi** : 
- Évite le zoom non désiré sur iOS
- Améliore la fluidité du scroll
- Retire le highlight bleu sur tap (iOS)

---

## 🧪 Comment tester

### Sur un vrai appareil mobile :
1. Déploie l'app sur Vercel
2. Ouvre l'URL sur ton téléphone
3. Vérifie que :
   - ✅ L'app se charge
   - ✅ Tu peux naviguer entre les pages
   - ✅ La carte Leaflet s'affiche
   - ✅ Tu peux interagir avec la carte (zoom, pan)
   - ✅ Pas d'écran blanc

### Avec les DevTools Chrome :
1. Ouvre Chrome DevTools (F12)
2. Clique sur l'icône "Toggle device toolbar" (Ctrl+Shift+M)
3. Sélectionne un appareil mobile (iPhone, Android)
4. Teste l'application

### Voir les erreurs sur mobile :
Sur iOS Safari :
1. Réglages → Safari → Avancé → Activer "Inspecteur web"
2. Connecte ton iPhone à ton Mac
3. Ouvre Safari sur Mac → Développement → [Ton iPhone] → [Ton site]

Sur Android Chrome :
1. Active "Débogage USB" sur Android
2. Connecte à ton PC
3. Chrome Desktop → chrome://inspect → Inspecte ton appareil

---

## 🐛 Problèmes potentiels restants

### Si l'app ne se charge toujours pas :

#### 1. Problème de Service Worker
Le Service Worker peut causer des problèmes de cache. Pour tester sans :
- Commente le code du Service Worker dans `src/main.tsx`
- Ou ouvre en navigation privée

#### 2. Problème d'API
L'API OpenWeather ou RainViewer peut être bloquée :
- Vérifie que les URLs sont en HTTPS
- Vérifie la clé API OpenWeather dans les Réglages

#### 3. Problème de localStorage
Sur certains navigateurs mobiles, localStorage peut être désactivé :
- Ouvre la console et tape : `localStorage.setItem('test', '1')`
- Si erreur → localStorage est bloqué

#### 4. Problème de mémoire
Sur mobiles anciens, Leaflet + React peut être lourd :
- Réduis le nombre de frames du radar
- Simplifie les animations

---

## 📋 Checklist de débogage mobile

- [ ] L'app se charge sur desktop ?
- [ ] L'app se charge sur mobile ?
- [ ] La console mobile montre des erreurs ?
- [ ] Le réseau est OK (pas de 404, 500) ?
- [ ] La carte Leaflet s'affiche ?
- [ ] Le Service Worker s'enregistre ?
- [ ] localStorage fonctionne ?
- [ ] L'ErrorBoundary s'affiche en cas d'erreur ?

---

## 🚀 Prochaines étapes

Si les correctifs ne suffisent pas, il faudra :
1. Regarder les logs d'erreur dans la console mobile
2. Tester avec le Service Worker désactivé
3. Simplifier les composants lourds (Leaflet)
4. Ajouter plus de fallbacks/loading states
