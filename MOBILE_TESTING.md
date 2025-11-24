# 📱 Guide de test mobile - RideDry

## Symptômes possibles sur mobile

### 🔴 Écran blanc
**Causes possibles** :
- Erreur JavaScript non capturée
- Composant React qui crash
- Problème de chargement de ressource (CSS, JS)
- Leaflet qui ne se charge pas

**Solution** : ErrorBoundary installé + logs dans la console

### 🔴 App qui ne se charge pas
**Causes possibles** :
- Service Worker bloque le chargement
- localStorage désactivé dans le navigateur
- CORS / Mixed Content (HTTP vs HTTPS)

**Solution** : Diagnostics automatiques au démarrage

### 🔴 Carte qui ne s'affiche pas
**Causes possibles** :
- Leaflet CSS manquant
- Touch events mal configurés
- API RainViewer bloquée

**Solution** : Leaflet CSS importé + touch events activés + gestion d'erreur

---

## 🧪 Tests à effectuer

### Test 1 : Chargement initial
1. Ouvre l'app sur mobile
2. **Attendu** : Page d'accueil qui se charge en ~2-3 secondes
3. **Si erreur** : Tu devrais voir l'ErrorBoundary avec le message d'erreur

### Test 2 : Navigation
1. Clique sur "Trajets" dans la barre du bas
2. Clique sur "Réglages"
3. Retourne sur "Accueil"
4. **Attendu** : Navigation fluide sans rechargement

### Test 3 : Carte Leaflet
1. Va sur la page d'accueil
2. Scroll jusqu'au radar météo
3. Essaie de bouger la carte (drag)
4. Essaie de zoomer (pinch)
5. **Attendu** : La carte est interactive et répond au touch

### Test 4 : Console logs
1. Ouvre la console de débogage mobile (voir section "Debug")
2. Recharge l'app
3. **Attendu** : Tu devrais voir :
   ```
   📱 Device Info: {...}
   🔌 APIs Availability: {...}
   📋 Diagnostic Report: {...}
   ```

### Test 5 : localStorage
1. Va dans "Réglages"
2. Change le thème (clair/sombre)
3. Recharge la page
4. **Attendu** : Le thème est conservé

### Test 6 : Service Worker
1. Charge l'app une première fois (online)
2. Active le mode avion
3. Recharge l'app
4. **Attendu** : L'app devrait se charger (mode offline)

---

## 🔍 Débogage mobile

### Sur iPhone (iOS Safari)

#### Méthode 1 : Console Safari (nécessite un Mac)
1. **Sur iPhone** : Réglages → Safari → Avancé → Activer "Inspecteur web"
2. **Connecte l'iPhone au Mac** avec un câble
3. **Sur Mac** : Ouvre Safari → Développement → [Ton iPhone] → [ridedry]
4. **Tu as maintenant** : Console, Network, Elements, etc.

#### Méthode 2 : Alert debugging (sans Mac)
Ajoute temporairement dans `src/main.tsx` :
```typescript
window.addEventListener('error', (event) => {
  alert('Error: ' + event.error.message);
});
```

#### Méthode 3 : Eruda (console mobile dans la page)
Ajoute dans `index.html` avant `</body>` :
```html
<script src="https://cdn.jsdelivr.net/npm/eruda"></script>
<script>eruda.init();</script>
```
Ensuite, un bouton flottant apparaît pour ouvrir la console.

### Sur Android (Chrome)

#### Méthode 1 : Chrome Remote Debugging
1. **Sur Android** : Activer "Débogage USB" dans les options développeur
2. **Connecte au PC** avec un câble USB
3. **Sur Chrome Desktop** : Va sur `chrome://inspect`
4. **Clique sur** "Inspect" à côté de ton appareil
5. **Tu as maintenant** : DevTools complet

#### Méthode 2 : Console Logcat (avancé)
```bash
adb logcat chromium:I *:S
```

---

## 🛠️ Correctifs appliqués

### ✅ Viewport mobile-friendly
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
```

### ✅ ErrorBoundary React
Intercepte les erreurs et affiche un écran avec :
- Message d'erreur
- Bouton "Recharger"

### ✅ Gestion d'erreur globale
```typescript
window.addEventListener('error', ...)
window.addEventListener('unhandledrejection', ...)
```

### ✅ Diagnostics automatiques
Au démarrage (en dev), affiche :
- Info appareil (OS, taille écran, etc.)
- APIs disponibles (localStorage, fetch, etc.)
- Connectivité réseau

### ✅ Leaflet optimisé pour mobile
```typescript
touchZoom={true}
scrollWheelZoom={false}
dragging={true}
tap={true}
```

### ✅ CSS mobile
```css
-webkit-text-size-adjust: 100%;
-webkit-overflow-scrolling: touch;
-webkit-tap-highlight-color: transparent;
```

---

## 🐛 Problèmes connus et solutions

### Problème : "Module not found" sur mobile mais pas desktop
**Cause** : Casse de fichier (iOS est case-sensitive)
**Solution** : Vérifie que les imports respectent la casse exacte des fichiers

### Problème : Leaflet ne s'affiche pas
**Cause** : CSS Leaflet non chargé
**Solution** : Vérifie que `import 'leaflet/dist/leaflet.css'` est dans `main.tsx`

### Problème : localStorage ne fonctionne pas
**Cause** : Mode privé / cookies désactivés
**Solution** : Affiche un message à l'utilisateur pour activer les cookies

### Problème : Service Worker fait écran blanc
**Cause** : Cache corrompu du SW
**Solution** : 
1. Désinstalle le SW dans DevTools → Application → Service Workers
2. Ou commente le code d'enregistrement du SW temporairement

### Problème : API météo ne marche pas
**Cause** : CORS / clé API invalide
**Solution** : Mode démo activé automatiquement en fallback

---

## 📊 Rapport de diagnostic

Une fois l'app chargée, ouvre la console et tu verras :

```javascript
📱 Device Info: {
  userAgent: "...",
  platform: "...",
  screenWidth: 375,
  screenHeight: 667,
  localStorageAvailable: true,
  serviceWorkerSupported: true,
  notificationSupported: true
}

🔌 APIs Availability: {
  fetch: true,
  Promise: true,
  localStorage: true,
  geolocation: true,
  intersectionObserver: true
}

📋 Diagnostic Report: {
  device: {...},
  apis: {...},
  network: { online: true, message: "Connected" }
}
```

Si quelque chose est `false`, c'est probablement la cause du problème !

---

## 🚀 Déploiement et test

### 1. Build local
```bash
npm run build
npm run preview
```
Teste sur `http://localhost:4173` depuis ton mobile (même réseau WiFi)

### 2. Deploy sur Vercel
```bash
vercel --prod
```
Ou push vers GitHub et laisse Vercel auto-déployer

### 3. Test sur mobile réel
- Ouvre l'URL Vercel sur ton téléphone
- Vérifie les 6 tests ci-dessus
- Ouvre la console mobile pour voir les diagnostics

---

## 💡 Astuces de débogage

### Afficher des infos à l'écran (sans console)
Ajoute temporairement dans `Home.tsx` :
```typescript
<div className="fixed top-0 left-0 bg-red-500 text-white p-2 z-50 text-xs">
  Screen: {window.innerWidth}x{window.innerHeight}<br/>
  localStorage: {localStorage ? 'OK' : 'KO'}
</div>
```

### Forcer le mode démo (sans API)
Dans `src/hooks/useSettings.ts`, force :
```typescript
apiKey: 'YOUR_API_KEY_HERE'
```

### Désactiver le Service Worker temporairement
Dans `src/main.tsx`, commente :
```typescript
// if ('serviceWorker' in navigator) { ... }
```

---

## ✅ Checklist finale

Avant de déclarer "ça marche sur mobile" :

- [ ] App se charge (pas d'écran blanc)
- [ ] Navigation fonctionne (3 pages)
- [ ] Carte Leaflet s'affiche et est interactive
- [ ] Thème clair/sombre fonctionne
- [ ] Données météo s'affichent (ou mode démo OK)
- [ ] Pas d'erreur dans la console
- [ ] localStorage fonctionne
- [ ] Scroll fluide
- [ ] Responsive (portrait + paysage)
- [ ] Performance acceptable (<3s chargement)

Si tous les points sont cochés : 🎉 C'est bon !
