import { WeatherSlot } from '../types';

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Récupère les prévisions météo horaires pour une ville donnée
 * Utilise l'API OpenWeatherMap (5 day / 3 hour forecast)
 * Note: Pour des données horaires plus précises, il faudrait utiliser l'API One Call (payante)
 */
export async function fetchWeatherForecast(
  location: string,
  apiKey: string
): Promise<{ slots: WeatherSlot[]; coords: { lat: number; lon: number } }> {
  // Mode démo si pas de clé API ou clé par défaut
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey.trim() === '') {
    console.log('🎭 Mode démo : utilisation de données météo simulées');
    return { slots: getMockWeatherData(), coords: { lat: 48.8566, lon: 2.3522 } }; // Paris par défaut
  }

  try {
    // 1. Récupérer les coordonnées de la ville
    const geoUrl = `${API_BASE_URL}/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric&lang=fr`;
    const geoResponse = await fetch(geoUrl);
    
    if (!geoResponse.ok) {
      if (geoResponse.status === 401) {
        console.warn('⚠️ Clé API invalide. Bascule en mode démo.');
        return { slots: getMockWeatherData(), coords: { lat: 48.8566, lon: 2.3522 } };
      }
      throw new Error('Impossible de trouver cette localisation');
    }
    
    const geoData = await geoResponse.json();
    const { lat, lon } = geoData.coord;

    // 2. Récupérer les prévisions (forecast API - données toutes les 3h)
    const forecastUrl = `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`;
    const forecastResponse = await fetch(forecastUrl);
    
    if (!forecastResponse.ok) {
      if (forecastResponse.status === 401) {
        console.warn('⚠️ Clé API invalide. Bascule en mode démo.');
        return { slots: getMockWeatherData(), coords: { lat, lon } };
      }
      throw new Error('Erreur lors de la récupération des prévisions météo');
    }
    
    const forecastData = await forecastResponse.json();

    // 3. Transformer les données en WeatherSlot
    const slots: WeatherSlot[] = forecastData.list.map((item: any) => ({
      datetime: new Date(item.dt * 1000),
      timestamp: item.dt,
      temperature: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      precipitationProbability: Math.round((item.pop || 0) * 100),
      precipitationAmount: item.rain?.['3h'] || 0,
      conditionCode: item.weather[0].id,
      conditionMain: item.weather[0].main,
      conditionDescription: item.weather[0].description,
      icon: item.weather[0].icon,
      windSpeed: item.wind.speed,
    }));

    return { slots, coords: { lat, lon } };
  } catch (error) {
    console.error('Erreur météo:', error);
    // En cas d'erreur, retourner des données mockées
    return { slots: getMockWeatherData(), coords: { lat: 48.8566, lon: 2.3522 } };
  }
}

/**
 * Données météo mockées pour le développement et les démos
 */
function getMockWeatherData(): WeatherSlot[] {
  const now = new Date();
  const slots: WeatherSlot[] = [];
  
  // Générer 40 créneaux de 3h (5 jours)
  for (let i = 0; i < 40; i++) {
    const datetime = new Date(now.getTime() + i * 3 * 60 * 60 * 1000);
    const hour = datetime.getHours();
    
    // Simuler des variations de pluie (plus de pluie en soirée)
    let precipProb = 0;
    if (hour >= 17 && hour <= 20) {
      precipProb = 40 + Math.random() * 40; // 40-80% de pluie
    } else if (hour >= 8 && hour <= 10) {
      precipProb = 10 + Math.random() * 20; // 10-30% de pluie
    } else {
      precipProb = Math.random() * 30; // 0-30% de pluie
    }
    
    const hasRain = precipProb > 50;
    
    slots.push({
      datetime,
      timestamp: Math.floor(datetime.getTime() / 1000),
      temperature: 12 + Math.round(Math.random() * 8),
      feelsLike: 10 + Math.round(Math.random() * 8),
      precipitationProbability: Math.round(precipProb),
      precipitationAmount: hasRain ? Math.random() * 2 : 0,
      conditionCode: hasRain ? 500 : (precipProb > 30 ? 803 : 800),
      conditionMain: hasRain ? 'Rain' : (precipProb > 30 ? 'Clouds' : 'Clear'),
      conditionDescription: hasRain ? 'pluie modérée' : (precipProb > 30 ? 'nuageux' : 'ciel dégagé'),
      icon: hasRain ? '10d' : (precipProb > 30 ? '03d' : '01d'),
      windSpeed: 3 + Math.random() * 5,
    });
  }
  
  return slots;
}

/**
 * Récupère l'icône météo en fonction du code
 */
export function getWeatherIcon(icon: string): string {
  // Retourner l'URL de l'icône OpenWeather
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

/**
 * Détermine la couleur en fonction de la probabilité de pluie
 */
export function getRainColor(probability: number): string {
  if (probability >= 70) return '#e44258'; // Rouge
  if (probability >= 40) return '#fdab3d'; // Orange
  if (probability >= 20) return '#ffc107'; // Jaune
  return '#00ca72'; // Vert
}

/**
 * Détermine l'emoji météo en fonction de la condition
 */
export function getWeatherEmoji(conditionMain: string, precipProb: number): string {
  if (precipProb > 60) return '🌧️';
  if (conditionMain === 'Rain') return '🌦️';
  if (conditionMain === 'Clouds') return '☁️';
  if (conditionMain === 'Clear') return '☀️';
  if (conditionMain === 'Snow') return '🌨️';
  return '🌤️';
}