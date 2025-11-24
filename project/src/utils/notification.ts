/**
 * Utilitaire pour envoyer des notifications de manière compatible PWA
 * Utilise le Service Worker si disponible pour les notifications persistantes sur mobile
 */

export interface NotificationOptions {
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  data?: any;
}

// Type étendu pour Service Worker (supporte plus d'options)
interface ServiceWorkerNotificationOptions extends NotificationOptions {
  vibrate?: number[];
  actions?: Array<{ action: string; title: string; icon?: string }>;
  silent?: boolean;
  renotify?: boolean;
  timestamp?: number;
}

/**
 * Vérifie si les notifications sont supportées
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

/**
 * Vérifie si les notifications sont autorisées
 */
export function isNotificationGranted(): boolean {
  return isNotificationSupported() && Notification.permission === 'granted';
}

/**
 * Demande la permission pour les notifications
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

/**
 * Envoie une notification de manière optimale :
 * - Via Service Worker si disponible (PWA mobile)
 * - Via Notification API sinon (desktop/onglet ouvert)
 */
export async function sendNotification(
  title: string,
  options: NotificationOptions
): Promise<void> {
  if (!isNotificationGranted()) {
    console.warn('Notifications non autorisées');
    return;
  }

  try {
    // Vérifier si un Service Worker est disponible
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Utiliser le Service Worker pour une notification persistante
      const registration = await navigator.serviceWorker.ready;
      
      // Options étendues pour Service Worker
      const swOptions: ServiceWorkerNotificationOptions = {
        body: options.body,
        icon: options.icon || '/icon-192.png',
        badge: options.badge || '/icon-192.png',
        tag: options.tag || 'ridedry-notification',
        requireInteraction: options.requireInteraction || false,
        data: options.data,
        vibrate: [200, 100, 200],
      };
      
      await registration.showNotification(title, swOptions as any);
    } else {
      // Fallback : notification classique (fonctionne uniquement si l'app est ouverte)
      new Notification(title, {
        body: options.body,
        icon: options.icon || '/vite.svg',
        badge: options.badge || '/vite.svg',
        tag: options.tag,
        requireInteraction: options.requireInteraction,
        data: options.data,
      });
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
    
    // Fallback en cas d'erreur
    try {
      new Notification(title, {
        body: options.body,
        icon: options.icon || '/vite.svg',
      });
    } catch (fallbackError) {
      console.error('Erreur du fallback notification:', fallbackError);
    }
  }
}

/**
 * Envoie une notification de test
 */
export async function sendTestNotification(): Promise<void> {
  await sendNotification('🚴 RideDry - Test', {
    body: 'C\'est le moment de partir ! Aucune pluie prévue pendant votre trajet 🌤️',
    tag: 'test-notification',
  });
}