// Types principaux de l'application

export type TripMode = 'departure' | 'arrival';

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Dimanche, 1 = Lundi, etc.

export interface Trip {
  id: string;
  name: string;
  location: string; // Ville ou coordonnées
  useCurrentLocation: boolean;
  durationMinutes: number;
  mode: TripMode; // 'departure' ou 'arrival'
  timeWindowStart: string; // Format HH:mm (ex: "08:00")
  timeWindowEnd: string; // Format HH:mm (ex: "09:30")
  activeDays: DayOfWeek[]; // Jours de la semaine où le trajet est actif
  notificationsEnabled: boolean;
  notifyOffsetMinutes: number; // Combien de minutes avant de notifier
}

export interface WeatherSlot {
  datetime: Date; // Date et heure du créneau
  timestamp: number; // Unix timestamp
  temperature: number; // Température en °C
  feelsLike: number; // Température ressentie
  precipitationProbability: number; // Probabilité de précipitations (0-100)
  precipitationAmount: number; // Quantité de pluie en mm
  conditionCode: number; // Code condition météo OpenWeather
  conditionMain: string; // Ex: "Rain", "Clear", "Clouds"
  conditionDescription: string; // Description détaillée
  icon: string; // Code icône OpenWeather
  windSpeed: number; // Vitesse du vent en m/s
}

export interface OptimalTimeResult {
  departureTime: Date;
  arrivalTime: Date;
  score: number; // Score de pluie (0 = aucune pluie, 100 = pluie garantie)
  maxPrecipProb: number; // Probabilité max de pluie sur le trajet
  avgPrecipProb: number; // Probabilité moyenne de pluie
  weatherDuringTrip: WeatherSlot[]; // Créneaux météo pendant le trajet
  recommendation: string; // Message à afficher à l'utilisateur
}

export interface Settings {
  apiKey: string;
  language: string;
  temperatureUnit: 'celsius' | 'fahrenheit';
  rainSensitivity: number; // Seuil de probabilité de pluie (0-100)
  notificationsEnabled: boolean;
  defaultLocation: string;
  theme: 'light' | 'dark'; // Mode d'affichage
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  city?: string;
}