import type { WeatherSlot } from '../../types';
import { getWeatherEmoji } from '../../utils/weather';
import { Thermometer, Wind, Droplets, CloudSun } from 'lucide-react';

interface WeatherCardProps {
  weather: WeatherSlot | null;
  loading: boolean;
  error: string | null;
  location?: string;
}

export function WeatherCard({ weather, loading, error, location = 'Localisation' }: WeatherCardProps) {
  if (loading || !weather) {
    return (
      <div className="bg-[var(--color-card)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-5 min-h-[220px] flex items-center justify-center">
        <p className="text-[var(--color-text-light)]">Chargement de la météo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--color-card)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-5 min-h-[220px] flex items-center justify-center">
        <p className="text-[var(--color-text-light)]">{error}</p>
      </div>
    );
  }

  const emoji = getWeatherEmoji(weather.conditionMain, weather.precipitationProbability);

  return (
    <div className="bg-[var(--color-card)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-5 min-h-[220px] flex flex-col">
      {/* Titre avec icône */}
      <div className="flex items-center gap-2 mb-3">
        <CloudSun className="w-4 h-4 text-[var(--color-text-lighter)]" />
        <span className="text-sm text-[var(--color-text-lighter)]">Météo actuelle - {location}</span>
      </div>

      <div className="flex items-center justify-between flex-1">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-6xl">{emoji}</span>
            <div>
              <div className="text-3xl text-[var(--color-text)]">
                {weather.temperature}°
              </div>
              <div className="text-sm text-[var(--color-text-light)] capitalize">
                {weather.conditionDescription}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className="text-xs text-[var(--color-text-light)]">Ressenti</span>
            <Thermometer className="w-4 h-4 text-[var(--color-text-lighter)]" />
            <span className="text-sm">{weather.feelsLike}°</span>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <span className="text-xs text-[var(--color-text-light)]">Vent</span>
            <Wind className="w-4 h-4 text-[var(--color-text-lighter)]" />
            <span className="text-sm">{Math.round(weather.windSpeed * 3.6)} km/h</span>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <span className="text-xs text-[var(--color-text-light)]">Pluie</span>
            <Droplets className="w-4 h-4 text-[var(--color-text-lighter)]" />
            <span 
              className="text-sm" 
              style={{ 
                color: weather.precipitationProbability > 50 
                  ? 'var(--color-danger)' 
                  : 'var(--color-success)' 
              }}
            >
              {weather.precipitationProbability}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}