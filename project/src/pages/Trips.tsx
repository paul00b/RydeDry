import { useState, useEffect } from 'react';
import { Trip, DayOfWeek, Settings } from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { TripCard } from '../components/trip/TripCard';
import { NotificationPermissionDialog } from '../components/notifications/NotificationPermissionDialog';
import { Plus, X, Save } from 'lucide-react';
import { isNotificationGranted } from '../utils/notification';

interface TripsProps {
  tripsHook: any;
  onThemeToggle: () => void;
  settings?: Settings;
}

export function Trips({ tripsHook, onThemeToggle, settings }: TripsProps) {
  const { trips, addTrip, updateTrip, deleteTrip } = tripsHook;
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [showWelcomeNotifDialog, setShowWelcomeNotifDialog] = useState(false);

  // Vérifier les notifications au chargement de la page
  useEffect(() => {
    // Si les notifications ne sont pas activées, afficher la modale de bienvenue
    if (!isNotificationGranted()) {
      // Petit délai pour éviter que la modale apparaisse trop vite
      const timer = setTimeout(() => {
        setShowWelcomeNotifDialog(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setShowForm(true);
  };

  const handleDelete = (trip: Trip) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le trajet "${trip.name}" ?`)) {
      deleteTrip(trip.id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTrip(null);
  };

  const handleSaveTrip = (tripData: Omit<Trip, 'id'>) => {
    if (editingTrip) {
      updateTrip(editingTrip.id, tripData);
    } else {
      addTrip(tripData);
    }
    handleCloseForm();
  };

  return (
    <div className="min-h-screen">
      <PageHeader 
        title="Mes trajets" 
        subtitle="Gérez vos trajets quotidiens" 
        theme={settings?.theme} 
        onThemeToggle={onThemeToggle} 
      />

      <main className="max-w-2xl mx-auto px-6 py-6 pb-32">
        {!showForm ? (
          <>
            <div className="space-y-3">
              {trips.map((trip: Trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}

              {trips.length === 0 && (
                <div className="bg-[var(--color-card)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-8 text-center">
                  <p className="text-[var(--color-text-light)]">
                    Aucun trajet configuré. Créez votre premier trajet pour commencer !
                  </p>
                </div>
              )}
            </div>

            {/* Bouton flottant en bas */}
            <button
              onClick={() => setShowForm(true)}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 max-w-md w-[calc(100%-3rem)] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white rounded-[var(--radius-button)] py-4 px-6 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all z-30"
            >
              <Plus className="w-5 h-5" />
              Ajouter un trajet
            </button>
          </>
        ) : (
          <TripForm
            trip={editingTrip}
            onSave={handleSaveTrip}
            onCancel={handleCloseForm}
          />
        )}
      </main>

      {/* Modale de bienvenue pour activer les notifications */}
      {showWelcomeNotifDialog && (
        <NotificationPermissionDialog
          onClose={() => setShowWelcomeNotifDialog(false)}
          onPermissionGranted={() => setShowWelcomeNotifDialog(false)}
        />
      )}
    </div>
  );
}

interface TripFormProps {
  trip: Trip | null;
  onSave: (trip: Omit<Trip, 'id'>) => void;
  onCancel: () => void;
}

function TripForm({ trip, onSave, onCancel }: TripFormProps) {
  const [formData, setFormData] = useState<Omit<Trip, 'id'>>({
    name: trip?.name || '',
    location: trip?.location || 'Paris',
    useCurrentLocation: trip?.useCurrentLocation || false,
    durationMinutes: trip?.durationMinutes || 30,
    mode: trip?.mode || 'departure',
    timeWindowStart: trip?.timeWindowStart || '08:00',
    timeWindowEnd: trip?.timeWindowEnd || '09:00',
    activeDays: trip?.activeDays || [1, 2, 3, 4, 5], // Lun-Ven par défaut
    notificationsEnabled: trip?.notificationsEnabled || false,
    notifyOffsetMinutes: trip?.notifyOffsetMinutes || 15,
  });

  const [showNotifDialog, setShowNotifDialog] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.name.trim()) {
      alert('Veuillez donner un nom à votre trajet');
      return;
    }
    
    if (formData.durationMinutes < 1 || formData.durationMinutes > 300) {
      alert('La durée du trajet doit être entre 1 et 300 minutes');
      return;
    }
    
    if (formData.activeDays.length === 0) {
      alert('Veuillez sélectionner au moins un jour');
      return;
    }

    // Si les notifications sont activées mais pas autorisées, afficher le dialog
    if (formData.notificationsEnabled && !isNotificationGranted()) {
      setShowNotifDialog(true);
      return;
    }

    onSave(formData);
  };

  const handleNotificationToggle = (enabled: boolean) => {
    // Si on active les notifications et qu'elles ne sont pas autorisées
    if (enabled && !isNotificationGranted()) {
      setShowNotifDialog(true);
      return;
    }
    
    setFormData({ ...formData, notificationsEnabled: enabled });
  };

  const handleNotificationPermissionGranted = () => {
    setFormData({ ...formData, notificationsEnabled: true });
  };

  const toggleDay = (day: DayOfWeek) => {
    if (formData.activeDays.includes(day)) {
      setFormData({
        ...formData,
        activeDays: formData.activeDays.filter(d => d !== day),
      });
    } else {
      setFormData({
        ...formData,
        activeDays: [...formData.activeDays, day].sort(),
      });
    }
  };

  const dayLabels = [
    { value: 0, label: 'Dimanche', short: 'D' },
    { value: 1, label: 'Lundi', short: 'L' },
    { value: 2, label: 'Mardi', short: 'M' },
    { value: 3, label: 'Mercredi', short: 'M' },
    { value: 4, label: 'Jeudi', short: 'J' },
    { value: 5, label: 'Vendredi', short: 'V' },
    { value: 6, label: 'Samedi', short: 'S' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[var(--color-card)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[var(--color-text)]">
            {trip ? 'Modifier le trajet' : 'Nouveau trajet'}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--color-text-light)]" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Nom du trajet */}
          <div>
            <label className="block text-sm mb-2 text-[var(--color-text)]">
              Nom du trajet
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Maison → Boulot"
              className="w-full px-4 py-3 rounded-[var(--radius-button)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
            />
          </div>

          {/* Localisation */}
          <div>
            <label className="block text-sm mb-2 text-[var(--color-text)]">
              Localisation
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ex: Paris"
              className="w-full px-4 py-3 rounded-[var(--radius-button)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
            />
            <p className="text-xs text-[var(--color-text-lighter)] mt-1">
              Ville ou commune pour les prévisions météo
            </p>
          </div>

          {/* Durée du trajet */}
          <div>
            <label className="block text-sm mb-2 text-[var(--color-text)]">
              Durée du trajet (minutes)
            </label>
            <input
              type="number"
              value={formData.durationMinutes}
              onChange={e => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })}
              min="1"
              max="300"
              className="w-full px-4 py-3 rounded-[var(--radius-button)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
            />
          </div>

          {/* Mode */}
          <div>
            <label className="block text-sm mb-2 text-[var(--color-text)]">
              Mode de planification
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, mode: 'departure' })}
                className={`p-4 rounded-[var(--radius-button)] border-2 transition-all ${
                  formData.mode === 'departure'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/30'
                }`}
              >
                <p className="text-sm">Je pars entre</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, mode: 'arrival' })}
                className={`p-4 rounded-[var(--radius-button)] border-2 transition-all ${
                  formData.mode === 'arrival'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/30'
                }`}
              >
                <p className="text-sm">Je veux arriver entre</p>
              </button>
            </div>
          </div>

          {/* Fenêtre horaire */}
          <div>
            <label className="block text-sm mb-2 text-[var(--color-text)]">
              {formData.mode === 'departure' ? 'Fenêtre de départ' : "Fenêtre d'arrivée"}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={formData.timeWindowStart}
                onChange={e => setFormData({ ...formData, timeWindowStart: e.target.value })}
                className="flex-1 px-4 py-3 rounded-[var(--radius-button)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
              />
              <span className="text-[var(--color-text-light)]">à</span>
              <input
                type="time"
                value={formData.timeWindowEnd}
                onChange={e => setFormData({ ...formData, timeWindowEnd: e.target.value })}
                className="flex-1 px-4 py-3 rounded-[var(--radius-button)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
              />
            </div>
          </div>

          {/* Jours actifs */}
          <div>
            <label className="block text-sm mb-2 text-[var(--color-text)]">
              Jours actifs
            </label>
            <div className="flex gap-2">
              {dayLabels.map(day => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value as DayOfWeek)}
                  className={`flex-1 py-3 rounded-[var(--radius-button)] border-2 transition-all ${
                    formData.activeDays.includes(day.value as DayOfWeek)
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                      : 'border-[var(--color-border)] text-[var(--color-text-light)] hover:border-[var(--color-primary)]/30'
                  }`}
                  title={day.label}
                >
                  <span className="text-sm">{day.short}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notificationsEnabled}
                onChange={e => handleNotificationToggle(e.target.checked)}
                className="w-5 h-5 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span className="text-sm text-[var(--color-text)]">
                Activer les notifications pour ce trajet
              </span>
            </label>

            {formData.notificationsEnabled && (
              <div className="mt-3 ml-8">
                <label className="block text-sm mb-2 text-[var(--color-text-light)]">
                  Me prévenir (minutes avant le départ)
                </label>
                <input
                  type="number"
                  value={formData.notifyOffsetMinutes}
                  onChange={e => setFormData({ ...formData, notifyOffsetMinutes: parseInt(e.target.value) || 0 })}
                  min="0"
                  max="120"
                  className="w-full px-4 py-3 rounded-[var(--radius-button)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-4 rounded-[var(--radius-button)] border-2 border-[var(--color-border)] text-[var(--color-text)] hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white rounded-[var(--radius-button)] px-6 py-4 flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
        >
          <Save className="w-5 h-5" />
          Enregistrer
        </button>
      </div>

      {/* Dialog de permission de notification */}
      {showNotifDialog && (
        <NotificationPermissionDialog
          onClose={() => setShowNotifDialog(false)}
          onPermissionGranted={handleNotificationPermissionGranted}
        />
      )}
    </form>
  );
}