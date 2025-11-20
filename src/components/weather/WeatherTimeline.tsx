import { WeatherSlot } from '../../types';
import { getRainColor, getWeatherEmoji } from '../../utils/weather';
import { formatTime } from '../../utils/optimalTime';
import { MapPin } from 'lucide-react';

interface WeatherTimelineProps {
  slots: WeatherSlot[];
  title?: string;
  location?: string;
}

export function WeatherTimeline({ slots, title = 'Prévision', location = 'Localisation' }: WeatherTimelineProps) {
  if (slots.length === 0) {
    return (
      <div className="bg-[var(--color-card)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-5 min-h-[220px] flex items-center justify-center">
        <p className="text-[var(--color-text-light)]">Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-card)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-5 min-h-[220px] flex flex-col">
      {/* Titre et localisation */}
      <div className="mb-3">
        <h3 className="text-[var(--color-text)] mb-1">{title}</h3>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[var(--color-text-light)]" />
          <span className="text-sm text-[var(--color-text-light)]">{location}</span>
        </div>
      </div>
      
      <div className="overflow-x-auto -mx-2 px-2 flex-1">
        <div className="flex gap-3 min-w-max pb-2">
          {slots.map((slot, index) => {
            const emoji = getWeatherEmoji(slot.conditionMain, slot.precipitationProbability);
            const rainColor = getRainColor(slot.precipitationProbability);
            
            return (
              <div
                key={index}
                className="flex flex-col items-center gap-1.5 min-w-[60px] p-2.5 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
              >
                <span className="text-xs text-[var(--color-text-light)]">
                  {formatTime(slot.datetime)}
                </span>
                
                <span className="text-2xl">{emoji}</span>
                
                <span className="text-sm">{slot.temperature}°</span>
                
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-8 h-1.5 rounded-full"
                    style={{ backgroundColor: rainColor }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: rainColor }}
                  >
                    {slot.precipitationProbability}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}