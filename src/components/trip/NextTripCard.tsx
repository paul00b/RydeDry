import { Trip, OptimalTimeResult } from '../../types';
import { Clock, Droplet, TrendingUp } from 'lucide-react';
import { formatTime } from '../../utils/optimalTime';
import { getRainColor } from '../../utils/weather';

interface NextTripCardProps {
  trip: Trip;
  optimalTime: OptimalTimeResult | null;
}

export function NextTripCard({ trip, optimalTime }: NextTripCardProps) {
  if (!optimalTime) {
    return (
      <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-[var(--radius-card)] shadow-[var(--shadow-card-hover)] p-6 text-white">
        <h3 className="mb-2">Prochain trajet</h3>
        <p className="text-lg mb-2">{trip.name}</p>
        <p className="text-white/80 text-sm">Calcul de l'heure optimale...</p>
      </div>
    );
  }

  const rainColor = getRainColor(optimalTime.maxPrecipProb);
  
  return (
    <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-[var(--radius-card)] shadow-[var(--shadow-card-hover)] p-6 text-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="mb-1">Prochain trajet</h3>
          <p className="text-xl">{trip.name}</p>
        </div>
        <Clock className="w-6 h-6 opacity-80" />
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
        <p className="text-white/80 text-sm mb-2">Heure de départ recommandée</p>
        <p className="text-4xl mb-1">{formatTime(optimalTime.departureTime)}</p>
        <p className="text-white/80 text-sm">
          Arrivée prévue : {formatTime(optimalTime.arrivalTime)}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Droplet className="w-4 h-4" />
            <span className="text-sm">Risque de pluie</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: rainColor }}
            />
            <span className="font-semibold">{Math.round(optimalTime.maxPrecipProb)}%</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-white/90">
              {optimalTime.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
