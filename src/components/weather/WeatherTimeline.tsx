import { WeatherSlot } from '../../types';
import { getRainColor, getWeatherEmoji } from '../../utils/weather';
import { formatTime } from '../../utils/optimalTime';

interface WeatherTimelineProps {
  slots: WeatherSlot[];
  title?: string;
}

export function WeatherTimeline({ slots, title = 'Prochaines heures' }: WeatherTimelineProps) {
  if (slots.length === 0) {
    return null;
  }

  return (
    <div className="bg-[var(--color-card)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6">
      <h3 className="mb-4 text-[var(--color-text)]">{title}</h3>
      
      <div className="overflow-x-auto -mx-2 px-2">
        <div className="flex gap-4 min-w-max pb-2">
          {slots.map((slot, index) => {
            const emoji = getWeatherEmoji(slot.conditionMain, slot.precipitationProbability);
            const rainColor = getRainColor(slot.precipitationProbability);
            
            return (
              <div
                key={index}
                className="flex flex-col items-center gap-2 min-w-[70px] p-3 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
              >
                <span className="text-xs text-[var(--color-text-light)]">
                  {formatTime(slot.datetime)}
                </span>
                
                <span className="text-2xl">{emoji}</span>
                
                <span className="text-sm">{slot.temperature}°</span>
                
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-10 h-1.5 rounded-full"
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