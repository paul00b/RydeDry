import { Trip } from '../../types';
import { MapPin, Clock, Calendar, Edit2, Trash2 } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
  isActive?: boolean;
  onEdit?: (trip: Trip) => void;
  onDelete?: (trip: Trip) => void;
}

export function TripCard({ trip, isActive = false, onEdit, onDelete }: TripCardProps) {
  const dayLabels = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  
  return (
    <div className={`bg-[var(--color-card)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-5 transition-all hover:shadow-[var(--shadow-card-hover)] ${
      isActive ? 'ring-2 ring-[var(--color-primary)]/20' : ''
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-[var(--color-text)] mb-1">{trip.name}</h4>
          {isActive && (
            <span className="inline-block px-2 py-0.5 text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full">
              Actif aujourd'hui
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(trip)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Modifier"
            >
              <Edit2 className="w-4 h-4 text-[var(--color-text-light)]" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(trip)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Supprimer"
            >
              <Trash2 className="w-4 h-4 text-[var(--color-danger)]" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-light)]">
          <MapPin className="w-4 h-4" />
          <span>{trip.location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-[var(--color-text-light)]">
          <Clock className="w-4 h-4" />
          <span>
            {trip.mode === 'departure' ? 'Départ' : 'Arrivée'} : {trip.timeWindowStart} – {trip.timeWindowEnd}
          </span>
          <span className="text-[var(--color-text-lighter)]">·</span>
          <span>{trip.durationMinutes} min</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-[var(--color-text-light)]">
          <Calendar className="w-4 h-4" />
          <div className="flex gap-1">
            {([0, 1, 2, 3, 4, 5, 6] as const).map(day => {
              const isActiveDay = trip.activeDays.includes(day);
              return (
                <span
                  key={day}
                  className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${
                    isActiveDay
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-gray-100 text-[var(--color-text-lighter)]'
                  }`}
                >
                  {dayLabels[day]}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}