import { WeatherSlot } from '../../types';
import { getWeatherEmoji } from '../../utils/weather';
import { MapPin, Thermometer, Wind } from 'lucide-react';

interface CurrentWeatherProps {
  weather: WeatherSlot | null;
  location: string;
}

export function CurrentWeather({ weather, location }: CurrentWeatherProps) {
  if (!weather) {
    return (
      <div className="bg-[var(--color-card)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6">
        <p className="text-[var(--color-text-light)]">Chargement de la météo...</p>
      </div>
    );
  }

  const emoji = getWeatherEmoji(weather.conditionMain, weather.precipitationProbability);

  return (
    <div className="bg-[var(--color-card)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4 text-[var(--color-text-light)]" />
        <span className="text-sm text-[var(--color-text-light)]">{location}</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl">{emoji}</span>
            <div>
              <div className="text-4xl text-[var(--color-text)]">
                {weather.temperature}°
              </div>
              <div className="text-sm text-[var(--color-text-light)] capitalize">
                {weather.conditionDescription}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className="text-sm text-[var(--color-text-light)]">Ressenti</span>
            <Thermometer className="w-4 h-4 text-[var(--color-text-lighter)]" />
            <span className="text-sm">{weather.feelsLike}°</span>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <span className="text-sm text-[var(--color-text-light)]">Vent</span>
            <Wind className="w-4 h-4 text-[var(--color-text-lighter)]" />
            <span className="text-sm">{Math.round(weather.windSpeed * 3.6)} km/h</span>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <span className="text-sm text-[var(--color-text-light)]">Pluie</span>
            <span className="text-sm font-semibold" style={{ color: weather.precipitationProbability > 50 ? 'var(--color-danger)' : 'var(--color-success)' }}>
              {weather.precipitationProbability}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}