import { Trip, WeatherSlot, OptimalTimeResult } from '../types';

/**
 * Calcule l'heure de départ optimale pour un trajet donné
 * en fonction des prévisions météo
 * 
 * Algorithme:
 * 1. Générer tous les créneaux de départ possibles (tous les 5 min)
 * 2. Pour chaque créneau, calculer la fenêtre du trajet
 * 3. Récupérer les données météo sur cette fenêtre
 * 4. Calculer un score de pluie
 * 5. Choisir le créneau avec le score le plus faible
 */
export function calculateOptimalDepartureTime(
  trip: Trip,
  weatherSlots: WeatherSlot[],
  targetDate: Date = new Date()
): OptimalTimeResult | null {
  if (weatherSlots.length === 0) {
    return null;
  }

  // 1. Générer les créneaux de départ possibles
  const possibleSlots = generatePossibleTimeSlots(trip, targetDate);
  
  if (possibleSlots.length === 0) {
    return null;
  }

  // 2. Évaluer chaque créneau
  const evaluatedSlots = possibleSlots.map(departureTime => {
    const arrivalTime = new Date(departureTime.getTime() + trip.durationMinutes * 60 * 1000);
    
    // Récupérer les données météo pendant le trajet
    const weatherDuringTrip = getWeatherDuringTrip(
      departureTime,
      arrivalTime,
      weatherSlots
    );

    // Calculer le score de pluie
    const score = calculateRainScore(weatherDuringTrip);
    const maxPrecipProb = Math.max(...weatherDuringTrip.map(w => w.precipitationProbability), 0);
    const avgPrecipProb = weatherDuringTrip.length > 0
      ? weatherDuringTrip.reduce((sum, w) => sum + w.precipitationProbability, 0) / weatherDuringTrip.length
      : 0;

    return {
      departureTime,
      arrivalTime,
      score,
      maxPrecipProb,
      avgPrecipProb,
      weatherDuringTrip,
      recommendation: '',
    };
  });

  // 3. Trouver le meilleur créneau (score le plus faible)
  const bestSlot = evaluatedSlots.reduce((best, current) => {
    return current.score < best.score ? current : best;
  });

  // 4. Générer la recommandation
  bestSlot.recommendation = generateRecommendation(bestSlot, evaluatedSlots);

  return bestSlot;
}

/**
 * Génère tous les créneaux de départ possibles dans la fenêtre définie
 * avec un pas de 5 minutes
 */
function generatePossibleTimeSlots(trip: Trip, targetDate: Date): Date[] {
  const slots: Date[] = [];
  
  // Parser les heures de début et fin
  const [startHour, startMin] = trip.timeWindowStart.split(':').map(Number);
  const [endHour, endMin] = trip.timeWindowEnd.split(':').map(Number);
  
  const startTime = new Date(targetDate);
  startTime.setHours(startHour, startMin, 0, 0);
  
  const endTime = new Date(targetDate);
  endTime.setHours(endHour, endMin, 0, 0);
  
  // Si mode "arrivée", ajuster les horaires de départ
  if (trip.mode === 'arrival') {
    // On doit arriver entre startTime et endTime
    // Donc on peut partir entre (startTime - durée) et (endTime - durée)
    startTime.setMinutes(startTime.getMinutes() - trip.durationMinutes);
    endTime.setMinutes(endTime.getMinutes() - trip.durationMinutes);
  }
  
  // Générer des créneaux toutes les 5 minutes
  const current = new Date(startTime);
  const stepMinutes = 5;
  
  while (current <= endTime) {
    // Vérifier que c'est dans le futur (au moins maintenant)
    if (current >= new Date()) {
      slots.push(new Date(current));
    }
    current.setMinutes(current.getMinutes() + stepMinutes);
  }
  
  return slots;
}

/**
 * Récupère les créneaux météo qui correspondent à la période du trajet
 */
function getWeatherDuringTrip(
  departureTime: Date,
  arrivalTime: Date,
  weatherSlots: WeatherSlot[]
): WeatherSlot[] {
  return weatherSlots.filter(slot => {
    return slot.datetime >= departureTime && slot.datetime <= arrivalTime;
  });
}

/**
 * Calcule un score de pluie pour une série de créneaux météo
 * Score = moyenne pondérée de la probabilité de pluie
 * Plus le score est élevé, plus il y a de risque de pluie
 */
function calculateRainScore(weatherSlots: WeatherSlot[]): number {
  if (weatherSlots.length === 0) {
    return 0;
  }

  // On utilise le max de la probabilité de pluie comme score principal
  // Car même un moment de forte pluie gâche tout le trajet
  const maxProb = Math.max(...weatherSlots.map(w => w.precipitationProbability));
  
  // On ajoute aussi la moyenne pour départager les ex-aequo
  const avgProb = weatherSlots.reduce((sum, w) => sum + w.precipitationProbability, 0) / weatherSlots.length;
  
  // Score final: 70% du max + 30% de la moyenne
  return maxProb * 0.7 + avgProb * 0.3;
}

/**
 * Génère une recommandation textuelle basée sur le résultat optimal
 */
function generateRecommendation(
  bestSlot: OptimalTimeResult,
  allSlots: OptimalTimeResult[]
): string {
  const { maxPrecipProb } = bestSlot;
  
  // Cas 1: Aucune pluie dans toute la fenêtre
  if (allSlots.every(slot => slot.maxPrecipProb < 10)) {
    return "Aucune pluie prévue sur votre créneau. Partez quand vous voulez ! 🎉";
  }
  
  // Cas 2: Il pleut tout le temps (tous les créneaux ont >60% de pluie)
  if (allSlots.every(slot => slot.maxPrecipProb > 60)) {
    if (maxPrecipProb > 80) {
      return "Il pleuvra fortement tout le temps. Prenez votre équipement de pluie ! ☔";
    }
    return "Il pleuvra dans tout votre créneau, mais c'est le meilleur moment (pluie modérée).";
  }
  
  // Cas 3: Meilleur créneau trouvé
  if (maxPrecipProb < 20) {
    return "Créneau idéal ! Très peu de risque de pluie. 😊";
  }
  
  if (maxPrecipProb < 40) {
    return "Bon créneau. Risque de pluie faible à modéré.";
  }
  
  if (maxPrecipProb < 60) {
    return "Attention, risque de pluie modéré sur ce créneau. Prévoyez une veste !";
  }
  
  return "Risque de pluie élevé, mais c'est le meilleur créneau disponible. ☔";
}

/**
 * Formate une heure pour l'affichage (ex: "18:07")
 */
export function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Formate une date pour l'affichage (ex: "Aujourd'hui", "Demain", "Lundi 23")
 */
export function formatDate(date: Date): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Normaliser les dates (minuit)
  const dateNormalized = new Date(date);
  dateNormalized.setHours(0, 0, 0, 0);
  
  const todayNormalized = new Date(today);
  todayNormalized.setHours(0, 0, 0, 0);
  
  const tomorrowNormalized = new Date(tomorrow);
  tomorrowNormalized.setHours(0, 0, 0, 0);
  
  if (dateNormalized.getTime() === todayNormalized.getTime()) {
    return "Aujourd'hui";
  }
  
  if (dateNormalized.getTime() === tomorrowNormalized.getTime()) {
    return "Demain";
  }
  
  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const day = dayNames[date.getDay()];
  const dayNum = date.getDate();
  
  return `${day} ${dayNum}`;
}