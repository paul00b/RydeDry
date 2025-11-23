// 🚴 RideDry - Service Worker Avancé avec Background Sync
// Ce SW gère les notifications même quand l'onglet est fermé (si PWA installée)

const CACHE_NAME = 'ridedry-v2';
const API_CACHE = 'ridedry-api-v2';

// Installation
self.addEventListener('install', (event) => {
  console.log('[SW] Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
      ]);
    })
  );
  self.skipWaiting();
});

// Activation
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE) {
            console.log('[SW] Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Gestion du cache réseau (Network-First pour API, Cache-First pour assets)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // API météo : Network-First avec cache fallback
  if (url.hostname.includes('openweathermap.org') || url.hostname.includes('rainviewer.com')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Mettre en cache la réponse
          const responseClone = response.clone();
          caches.open(API_CACHE).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback sur le cache si offline
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Assets : Cache-First
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// ========================================
// 🔔 SYSTÈME DE NOTIFICATIONS AVANCÉ
// ========================================

// Message depuis l'app pour afficher une notification
self.addEventListener('message', async (event) => {
  if (!event.data) return;
  
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SHOW_NOTIFICATION':
      await showNotification(payload.title, payload.options);
      break;
      
    case 'SCHEDULE_CHECK':
      // L'app demande de vérifier les trajets périodiquement
      console.log('[SW] Programmation des vérifications périodiques');
      break;
      
    case 'UPDATE_TRIPS':
      // Stocker les trajets dans IndexedDB pour consultation background
      await storeTripsData(payload.trips);
      break;
      
    case 'UPDATE_WEATHER':
      // Stocker la météo dans IndexedDB
      await storeWeatherData(payload.location, payload.weather);
      break;
  }
});

// Afficher une notification
async function showNotification(title, options) {
  const notificationOptions = {
    body: options.body || '',
    icon: options.icon || '/icon-192.png',
    badge: options.badge || '/icon-192.png',
    tag: options.tag || 'ridedry',
    requireInteraction: options.requireInteraction || false,
    vibrate: [200, 100, 200],
    data: options.data || {},
    actions: [
      {
        action: 'open',
        title: 'Ouvrir l\'app',
      },
      {
        action: 'dismiss',
        title: 'OK',
      }
    ],
  };
  
  try {
    await self.registration.showNotification(title, notificationOptions);
    console.log('[SW] Notification affichée:', title);
  } catch (error) {
    console.error('[SW] Erreur notification:', error);
  }
}

// Clic sur notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  // Ouvrir ou focus l'app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus sur un onglet existant
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      // Ouvrir un nouvel onglet
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// ========================================
// 📊 STOCKAGE INDEXEDDB (pour background sync)
// ========================================

// Ouvrir la DB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('RideDryDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Store pour les trajets
      if (!db.objectStoreNames.contains('trips')) {
        db.createObjectStore('trips', { keyPath: 'id' });
      }
      
      // Store pour la météo
      if (!db.objectStoreNames.contains('weather')) {
        db.createObjectStore('weather', { keyPath: 'location' });
      }
    };
  });
}

// Stocker les trajets
async function storeTripsData(trips) {
  try {
    const db = await openDB();
    const tx = db.transaction('trips', 'readwrite');
    const store = tx.objectStore('trips');
    
    // Vider et re-remplir
    await store.clear();
    for (const trip of trips) {
      await store.put(trip);
    }
    
    console.log('[SW] Trajets stockés:', trips.length);
  } catch (error) {
    console.error('[SW] Erreur stockage trajets:', error);
  }
}

// Stocker la météo
async function storeWeatherData(location, weather) {
  try {
    const db = await openDB();
    const tx = db.transaction('weather', 'readwrite');
    const store = tx.objectStore('weather');
    
    await store.put({
      location,
      weather,
      timestamp: Date.now(),
    });
    
    console.log('[SW] Météo stockée pour:', location);
  } catch (error) {
    console.error('[SW] Erreur stockage météo:', error);
  }
}

// ========================================
// 🔄 PERIODIC BACKGROUND SYNC (si disponible)
// ========================================

// Note: Periodic Background Sync nécessite que la PWA soit installée
// et fonctionne uniquement sur Chrome Android pour l'instant

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-trips') {
    event.waitUntil(checkTripsAndNotify());
  }
});

// Vérifier les trajets et notifier si nécessaire
async function checkTripsAndNotify() {
  console.log('[SW] Vérification périodique des trajets...');
  
  try {
    // Récupérer les trajets stockés
    const db = await openDB();
    const tripsTx = db.transaction('trips', 'readonly');
    const tripsStore = tripsTx.objectStore('trips');
    const trips = await tripsStore.getAll();
    
    if (!trips || trips.length === 0) {
      console.log('[SW] Aucun trajet à vérifier');
      return;
    }
    
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // Pour chaque trajet actif aujourd'hui
    for (const trip of trips) {
      if (!trip.notificationsEnabled) continue;
      
      const activeDays = JSON.parse(trip.activeDays || '[]');
      if (!activeDays.includes(currentDay)) continue;
      
      // Vérifier si c'est le moment de notifier
      // (cette logique devrait être améliorée avec les données météo réelles)
      const shouldNotify = await shouldNotifyForTrip(trip, currentTime);
      
      if (shouldNotify) {
        await showNotification(`🚴 RideDry - ${trip.name}`, {
          body: `C'est bientôt l'heure de partir ! Consultez l'app pour l'heure optimale.`,
          tag: `trip-${trip.id}`,
          data: { tripId: trip.id },
        });
      }
    }
  } catch (error) {
    console.error('[SW] Erreur vérification trajets:', error);
  }
}

// Déterminer si on doit notifier pour un trajet
async function shouldNotifyForTrip(trip, currentTime) {
  // Logique simplifiée : notifier 15 min avant la fenêtre de départ
  const [startHour, startMin] = trip.timeWindowStart.split(':').map(Number);
  const notifyTime = new Date();
  notifyTime.setHours(startHour, startMin - (trip.notifyOffsetMinutes || 15), 0, 0);
  
  const now = new Date();
  const diff = notifyTime - now;
  
  // Notifier si on est dans les 5 minutes avant l'heure de notification
  return diff > 0 && diff < 5 * 60 * 1000;
}

console.log('[SW] Service Worker RideDry chargé ✅');
