# RideDry 🚴‍♂️☀️

Application web progressive (PWA) pour planifier vos trajets à vélo en évitant la pluie.

## 🚀 Déploiement

```bash
npm install
npm run build
npm run preview
```

Sur Vercel/Netlify : build command `npm run build`, output directory `dist`.

## 🐛 Debug mobile

Ajoute `?debug` dans l'URL pour afficher le panneau de débogage.

## 🛠️ Stack

- React 18 + TypeScript + Vite
- Tailwind CSS v4
- OpenWeatherMap API + RainViewer API
- Leaflet (carte interactive)
- LocalStorage (persistance)