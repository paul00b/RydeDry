import { useState, useEffect } from 'react';
import { WeatherSlot, Trip } from '../types';
import { fetchWeatherForecast } from '../utils/weather';

/**
 * Hook pour gérer les données météo de plusieurs localisations
 * Utilisé pour les notifications : charge la météo de tous les trajets actifs
 */
export function useMultiLocationWeather(trips: Trip[], apiKey: string) {
  const [weatherData, setWeatherData] = useState<Map<string, WeatherSlot[]>>(new Map());
  const [loading, setLoading] = useState(false);

  // Récupérer toutes les localisations uniques des trajets
  const getUniqueLocations = (): string[] => {
    const locations = new Set<string>();
    trips.forEach(trip => {
      if (trip.location) {
        locations.add(trip.location);
      }
    });
    return Array.from(locations);
  };

  // Charger la météo pour toutes les localisations
  const loadAllWeather = async () => {
    const locations = getUniqueLocations();
    
    if (locations.length === 0) {
      setWeatherData(new Map());
      return;
    }

    setLoading(true);
    const newWeatherData = new Map<string, WeatherSlot[]>();

    try {
      // Charger la météo pour chaque localisation en parallèle
      const promises = locations.map(async (location) => {
        try {
          const { slots } = await fetchWeatherForecast(location, apiKey);
          return { location, slots };
        } catch (error) {
          console.error(`Erreur lors du chargement de la météo pour ${location}:`, error);
          return { location, slots: [] };
        }
      });

      const results = await Promise.all(promises);
      
      results.forEach(({ location, slots }) => {
        newWeatherData.set(location, slots);
      });

      setWeatherData(newWeatherData);
    } catch (error) {
      console.error('Erreur lors du chargement des données météo:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger au montage et quand les trajets changent
  useEffect(() => {
    loadAllWeather();
    
    // Rafraîchir toutes les 30 minutes
    const interval = setInterval(loadAllWeather, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [trips, apiKey]);

  return {
    weatherData,
    loading,
    loadAllWeather,
  };
}
