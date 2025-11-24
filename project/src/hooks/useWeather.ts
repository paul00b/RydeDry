import { useState, useEffect } from 'react';
import { WeatherSlot } from '../types';
import { fetchWeatherForecast } from '../utils/weather';

/**
 * Hook pour gérer les données météo
 */
export function useWeather(location: string, apiKey: string) {
  const [weather, setWeather] = useState<WeatherSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);

  // Charger les données météo
  const loadWeather = async () => {
    if (!location) return;

    setLoading(true);
    setError(null);

    try {
      const { slots, coords } = await fetchWeatherForecast(location, apiKey);
      setWeather(slots);
      setCoordinates(coords);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Charger au montage et quand la localisation change
  useEffect(() => {
    loadWeather();
    
    // Rafraîchir toutes les 30 minutes
    const interval = setInterval(loadWeather, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [location, apiKey]);

  // Récupérer les prévisions pour les prochaines heures
  const getUpcomingHours = (hours: number = 12): WeatherSlot[] => {
    const now = new Date();
    const limitTime = new Date(now.getTime() + hours * 60 * 60 * 1000);
    
    return weather.filter(slot => {
      return slot.datetime >= now && slot.datetime <= limitTime;
    });
  };

  // Récupérer la météo actuelle (le créneau le plus proche)
  const getCurrentWeather = (): WeatherSlot | null => {
    if (weather.length === 0) return null;
    
    const now = new Date();
    let closest = weather[0];
    let minDiff = Math.abs(weather[0].datetime.getTime() - now.getTime());
    
    for (const slot of weather) {
      const diff = Math.abs(slot.datetime.getTime() - now.getTime());
      if (diff < minDiff) {
        minDiff = diff;
        closest = slot;
      }
    }
    
    return closest;
  };

  return {
    weather,
    loading,
    error,
    lastUpdate,
    loadWeather,
    getUpcomingHours,
    getCurrentWeather,
    coordinates,
  };
}