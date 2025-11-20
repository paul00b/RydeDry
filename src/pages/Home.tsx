import { useEffect, useState } from 'react';
import { Settings as SettingsType, Trip, OptimalTimeResult } from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { WeatherCarousel } from '../components/weather/WeatherCarousel';
import { WeatherRadar } from '../components/weather/WeatherRadar';
import { NextTripCard } from '../components/trip/NextTripCard';
import { TripCard } from '../components/trip/TripCard';
import { useWeather } from '../hooks/useWeather';
import { calculateOptimalDepartureTime } from '../utils/optimalTime';
import { Plus } from 'lucide-react';

interface HomeProps {
  settings: SettingsType;
  tripsHook: any;
  onNavigate: (page: 'home' | 'trips' | 'settings') => void;
  onThemeToggle: () => void;
}

export function Home({ settings, tripsHook, onNavigate, onThemeToggle }: HomeProps) {
  const location = settings.defaultLocation;
  const { weather, getCurrentWeather, getUpcomingHours, coordinates } = useWeather(
    location,
    settings.apiKey
  );
  const { trips, getNextActiveTrip, getActiveTripsToday } = tripsHook;
  
  const [nextTrip, setNextTrip] = useState<Trip | null>(null);
  const [optimalTime, setOptimalTime] = useState<OptimalTimeResult | null>(null);

  // Calculer le prochain trajet et son heure optimale
  useEffect(() => {
    const next = getNextActiveTrip();
    setNextTrip(next);

    if (next && weather.length > 0) {
      const result = calculateOptimalDepartureTime(next, weather);
      setOptimalTime(result);
    }
  }, [trips, weather]);

  const currentWeather = getCurrentWeather();
  const upcomingHours = getUpcomingHours(12);
  const activeTripsToday = getActiveTripsToday();

  // Obtenir l'heure actuelle pour le message d'accueil
  const now = new Date();
  const hour = now.getHours();
  
  // Messages adaptés à la période de la journée
  let greeting = '';
  if (hour >= 5 && hour < 12) {
    greeting = 'Passez une bonne journée';
  } else if (hour >= 12 && hour < 18) {
    greeting = 'Bon après-midi';
  } else if (hour >= 18 && hour < 22) {
    greeting = 'Bonne soirée';
  } else {
    greeting = 'Bonne nuit';
  }

  return (
    <div className="min-h-screen">
      <PageHeader 
        subtitle={greeting} 
        theme={settings.theme} 
        onThemeToggle={onThemeToggle} 
        showTime={true}
      />

      <main className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* Alerte si pas de clé API - DÉSACTIVÉ car clé en dur
        {settings.apiKey === 'YOUR_API_KEY_HERE' && (
          <div className="bg-amber-50 border border-amber-200 rounded-[var(--radius-card)] p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-900">
                <strong>Mode démo :</strong> Configurez votre clé API OpenWeather dans les réglages pour avoir des données météo réelles.
              </p>
            </div>
          </div>
        )}
        */}

        {/* Carousel Météo + Prochaines heures */}
        <section>
          <WeatherCarousel 
            weather={currentWeather}
            upcomingSlots={upcomingHours}
            loading={weather.length === 0}
            error={null}
            location={location}
          />
        </section>

        {/* Radar météo */}
        <section>
          <WeatherRadar 
            location={location}
            lat={coordinates?.lat}
            lon={coordinates?.lon}
          />
        </section>

        {/* Prochain trajet */}
        {nextTrip && (
          <section>
            <NextTripCard trip={nextTrip} optimalTime={optimalTime} />
          </section>
        )}

        {/* Mes trajets */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[var(--color-text)]">Mes trajets</h2>
            <button 
              onClick={() => onNavigate('trips')}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              aria-label="Ajouter un trajet"
            >
              <Plus className="w-5 h-5 text-[var(--color-primary)]" />
            </button>
          </div>

          {trips.length === 0 ? (
            <div className="bg-[var(--color-card)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-[var(--color-text-lighter)]" />
              </div>
              <p className="text-[var(--color-text-light)] mb-4">
                Aucun trajet configuré
              </p>
              <p className="text-sm text-[var(--color-text-lighter)]">
                Allez dans l'onglet "Trajets" pour créer votre premier trajet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {trips.slice(0, 3).map((trip: Trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  isActive={activeTripsToday.some((t: Trip) => t.id === trip.id)}
                />
              ))}
              
              {trips.length > 3 && (
                <p className="text-center text-sm text-[var(--color-text-light)] py-2">
                  Et {trips.length - 3} autre{trips.length - 3 > 1 ? 's' : ''} trajet{trips.length - 3 > 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}