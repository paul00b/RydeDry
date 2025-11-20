import { useEffect, useRef } from 'react';
import { Trip, Settings, WeatherSlot } from '../types';
import { calculateOptimalDepartureTime, formatTime } from '../utils/optimalTime';

interface UseNotificationsProps {
  trips: Trip[];
  settings: Settings;
  weatherData: Map<string, WeatherSlot[]>;
}

interface ScheduledNotification {
  tripId: string;
  scheduledTime: Date;
  notified: boolean;
}

/**
 * Hook pour gérer l'envoi automatique de notifications
 * Vérifie périodiquement les trajets actifs et envoie des notifications
 * au moment opportun (notifyOffsetMinutes avant le départ optimal)
 */
export function useNotifications({ trips, settings, weatherData }: UseNotificationsProps) {
  const scheduledNotifications = useRef<Map<string, ScheduledNotification>>(new Map());
  const checkInterval = useRef<number | null>(null);

  useEffect(() => {
    // Ne rien faire si les notifications ne sont pas autorisées
    if (!settings.notificationsEnabled || Notification.permission !== 'granted') {
      return;
    }

    // Fonction qui vérifie les trajets et envoie les notifications
    const checkAndNotify = () => {
      const now = new Date();
      const currentDay = now.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
      const dayNames: Array<0 | 1 | 2 | 3 | 4 | 5 | 6> = [0, 1, 2, 3, 4, 5, 6];
      const todayDayOfWeek = dayNames[currentDay];

      trips.forEach(trip => {
        // Vérifier si le trajet est actif aujourd'hui et si les notifications sont activées
        if (!trip.activeDays.includes(todayDayOfWeek) || !trip.notificationsEnabled) {
          return;
        }

        // Récupérer les données météo pour la localisation du trajet
        const tripWeather = weatherData.get(trip.location);
        if (!tripWeather || tripWeather.length === 0) {
          return;
        }

        // Calculer l'heure optimale de départ
        const optimalTime = calculateOptimalDepartureTime(trip, tripWeather, now);
        if (!optimalTime) {
          return;
        }

        // Calculer l'heure à laquelle on doit notifier
        const notifyTime = new Date(
          optimalTime.departureTime.getTime() - trip.notifyOffsetMinutes * 60 * 1000
        );

        // Clé unique pour ce trajet aujourd'hui
        const notificationKey = `${trip.id}-${now.toDateString()}`;
        
        // Vérifier si on a déjà programmé/envoyé une notification pour ce trajet aujourd'hui
        const existingNotification = scheduledNotifications.current.get(notificationKey);
        
        if (existingNotification?.notified) {
          return; // Déjà notifié
        }

        // Vérifier si c'est le moment d'envoyer la notification
        // On envoie si : maintenant >= heure de notification ET on n'a pas encore notifié
        if (now >= notifyTime && !existingNotification?.notified) {
          sendTripNotification(trip, optimalTime.departureTime, optimalTime.maxPrecipProb);
          
          // Marquer comme notifié
          scheduledNotifications.current.set(notificationKey, {
            tripId: trip.id,
            scheduledTime: notifyTime,
            notified: true,
          });
        } else if (!existingNotification) {
          // Programmer la notification pour plus tard
          scheduledNotifications.current.set(notificationKey, {
            tripId: trip.id,
            scheduledTime: notifyTime,
            notified: false,
          });
        }
      });

      // Nettoyer les notifications anciennes (plus de 24h)
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      scheduledNotifications.current.forEach((notification, key) => {
        if (notification.scheduledTime < oneDayAgo) {
          scheduledNotifications.current.delete(key);
        }
      });
    };

    // Vérifier immédiatement
    checkAndNotify();

    // Puis vérifier toutes les minutes
    checkInterval.current = window.setInterval(checkAndNotify, 60 * 1000);

    return () => {
      if (checkInterval.current !== null) {
        clearInterval(checkInterval.current);
      }
    };
  }, [trips, settings, weatherData]);

  return null;
}

/**
 * Envoie une notification pour un trajet
 */
function sendTripNotification(trip: Trip, departureTime: Date, maxPrecipProb: number) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const timeStr = formatTime(departureTime);
  let emoji = '🚴';
  let message = '';

  // Adapter le message selon la probabilité de pluie
  if (maxPrecipProb < 20) {
    emoji = '🚴☀️';
    message = `C'est le moment de partir ! Aucune pluie prévue pour votre trajet "${trip.name}".`;
  } else if (maxPrecipProb < 40) {
    emoji = '🚴🌤️';
    message = `Départ optimal à ${timeStr} pour "${trip.name}". Faible risque de pluie (${Math.round(maxPrecipProb)}%).`;
  } else if (maxPrecipProb < 60) {
    emoji = '🚴☁️';
    message = `Départ à ${timeStr} pour "${trip.name}". Risque de pluie modéré (${Math.round(maxPrecipProb)}%). Prévoyez une veste !`;
  } else {
    emoji = '🚴☔';
    message = `Meilleur créneau à ${timeStr} pour "${trip.name}". Forte pluie prévue (${Math.round(maxPrecipProb)}%). Équipement conseillé !`;
  }

  new Notification(`${emoji} RideDry - ${trip.name}`, {
    body: message,
    icon: '/vite.svg',
    badge: '/vite.svg',
    tag: `trip-${trip.id}`, // Évite les doublons
    requireInteraction: false,
  });
}
