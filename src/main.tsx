import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import 'leaflet/dist/leaflet.css'

// Enregistrer le Service Worker pour PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker enregistré:', registration.scope);
      })
      .catch((error) => {
        console.error('Erreur d\'enregistrement du Service Worker:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)