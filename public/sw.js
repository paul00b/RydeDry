// Service Worker pour PWA avec support des notifications
const CACHE_NAME = 'ridedry-v1';
const urlsToCache = [
  '/',
  '/index.html',
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  // Force l'activation immédiate
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Prend le contrôle immédiatement
  return self.clients.claim();
});

// Gestion du cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'Nouvelle notification RideDry',
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/icon-192.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: data.actions || [],
    tag: data.tag || 'ridedry-notification',
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'RideDry', options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Si l'app est déjà ouverte, la focus
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Sinon, ouvrir l'app
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// Gestion des messages depuis l'app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    
    self.registration.showNotification(title, {
      ...options,
      icon: options.icon || '/icon-192.png',
      badge: options.badge || '/icon-192.png',
      vibrate: [200, 100, 200],
    });
  }
});