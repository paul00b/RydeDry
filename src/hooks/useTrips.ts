import { useState, useEffect } from 'react';
import { Trip, DayOfWeek } from '../types';

const STORAGE_KEY = 'ridedry_trips';

/**
 * Hook pour gérer les trajets
 * Stockés dans localStorage
 */
export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Charger les trajets au montage
  useEffect(() => {
    const savedTrips = localStorage.getItem(STORAGE_KEY);
    if (savedTrips) {
      try {
        const parsed = JSON.parse(savedTrips);
        setTrips(parsed);
      } catch (error) {
        console.error('Erreur lors du chargement des trajets:', error);
      }
    }
    setLoaded(true);
  }, []);

  // Sauvegarder les trajets à chaque modification
  const saveTrips = (newTrips: Trip[]) => {
    setTrips(newTrips);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTrips));
  };

  // Ajouter un trajet
  const addTrip = (trip: Omit<Trip, 'id'>) => {
    const newTrip: Trip = {
      ...trip,
      id: `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    saveTrips([...trips, newTrip]);
    return newTrip;
  };

  // Modifier un trajet
  const updateTrip = (id: string, updates: Partial<Trip>) => {
    const updatedTrips = trips.map(trip =>
      trip.id === id ? { ...trip, ...updates } : trip
    );
    saveTrips(updatedTrips);
  };

  // Supprimer un trajet
  const deleteTrip = (id: string) => {
    const filteredTrips = trips.filter(trip => trip.id !== id);
    saveTrips(filteredTrips);
  };

  // Récupérer les trajets actifs aujourd'hui
  const getActiveTripsToday = (): Trip[] => {
    const today = new Date().getDay() as DayOfWeek;
    return trips.filter(trip => trip.activeDays.includes(today));
  };

  // Récupérer le prochain trajet actif
  const getNextActiveTrip = (): Trip | null => {
    const activeToday = getActiveTripsToday();
    if (activeToday.length === 0) return null;

    const now = new Date();
    const currentTimeInMin = now.getHours() * 60 + now.getMinutes();

    // Trier les trajets par proximité avec l'heure actuelle
    const tripsWithTime = activeToday.map(trip => {
      const [startHour, startMin] = trip.timeWindowStart.split(':').map(Number);
      const [endHour, endMin] = trip.timeWindowEnd.split(':').map(Number);
      
      // Calculer le milieu de la fenêtre horaire
      const startTimeInMin = startHour * 60 + startMin;
      const endTimeInMin = endHour * 60 + endMin;
      const middleTimeInMin = (startTimeInMin + endTimeInMin) / 2;
      
      // Si mode arrivée, ajuster pour le départ
      let targetTimeInMin = middleTimeInMin;
      if (trip.mode === 'arrival') {
        targetTimeInMin = middleTimeInMin - trip.durationMinutes;
      }
      
      // Calculer la différence avec l'heure actuelle
      let diff = targetTimeInMin - currentTimeInMin;
      
      // Si le trajet est déjà passé aujourd'hui, le mettre à la fin
      if (diff < -60) { // Plus d'1h dans le passé
        diff = 10000; // Grande valeur pour le mettre en dernier
      }
      
      return {
        trip,
        targetTimeInMin,
        diff: Math.abs(diff),
        isPast: diff < -60,
      };
    });

    // Trier par proximité temporelle (le plus proche en premier)
    tripsWithTime.sort((a, b) => {
      // Les trajets passés vont à la fin
      if (a.isPast && !b.isPast) return 1;
      if (!a.isPast && b.isPast) return -1;
      // Sinon trier par différence de temps
      return a.diff - b.diff;
    });

    return tripsWithTime[0]?.trip || null;
  };

  return {
    trips,
    loaded,
    addTrip,
    updateTrip,
    deleteTrip,
    getActiveTripsToday,
    getNextActiveTrip,
  };
}