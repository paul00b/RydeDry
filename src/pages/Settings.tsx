import { useState } from 'react';
import { Settings as SettingsType } from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { NotificationPermissionDialog } from '../components/notifications/NotificationPermissionDialog';
import { KeepAliveInfo } from '../components/notifications/KeepAliveInfo';
import { Bell, MapPin, AlertTriangle, Save } from 'lucide-react';
import { sendTestNotification, isNotificationSupported, isNotificationGranted } from '../utils/notification';
import { keepAliveManager } from '../utils/keepAlive';

interface SettingsProps {
  settings: SettingsType;
  updateSettings: (updates: Partial<SettingsType>) => void;
  onThemeToggle: () => void;
}

export function Settings({ settings, updateSettings, onThemeToggle }: SettingsProps) {
  const [defaultLocation, setDefaultLocation] = useState(settings.defaultLocation);
  const [rainSensitivity, setRainSensitivity] = useState(settings.rainSensitivity);
  const [saved, setSaved] = useState(false);
  const [testPending, setTestPending] = useState(false);
  const [showNotifDialog, setShowNotifDialog] = useState(false);

  const handleSave = () => {
    updateSettings({
      defaultLocation,
      rainSensitivity,
    });
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRequestPermission = () => {
    // Afficher le dialog au lieu de demander directement
    setShowNotifDialog(true);
  };

  const handlePermissionGranted = () => {
    updateSettings({ notificationsEnabled: true });
  };

  const handleTestNotification = async () => {
    setTestPending(true);
    
    setTimeout(async () => {
      await sendTestNotification();
      setTestPending(false);
    }, 5000);
  };

  const notificationStatus = isNotificationSupported()
    ? Notification.permission
    : 'unsupported';

  return (
    <div className="min-h-screen">
      <PageHeader 
        title="Réglages" 
        subtitle="Configurez votre application" 
        theme={settings.theme} 
        onThemeToggle={onThemeToggle} 
      />

      <main className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* Localisation par défaut */}
        <section className="bg-[var(--color-card)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-[var(--color-text)]">Localisation par défaut</h3>
          </div>

          <input
            type="text"
            value={defaultLocation}
            onChange={e => setDefaultLocation(e.target.value)}
            placeholder="Ex: Paris"
            className="w-full px-4 py-3 rounded-[var(--radius-button)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
          />
          <p className="text-xs text-[var(--color-text-lighter)] mt-2">
            Utilisée pour afficher la météo sur la page d'accueil
          </p>
        </section>

        {/* Sensibilité à la pluie */}
        <section className="bg-[var(--color-card)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-[var(--color-text)]">Sensibilité à la pluie</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-light)]">
                Seuil d'alerte
              </span>
              <span className="text-sm font-semibold text-[var(--color-primary)]">
                {rainSensitivity}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={rainSensitivity}
              onChange={e => setRainSensitivity(parseInt(e.target.value))}
              className="w-full accent-[var(--color-primary)]"
            />
            <p className="text-xs text-[var(--color-text-lighter)]">
              Vous serez alerté si la probabilité de pluie dépasse {rainSensitivity}%
            </p>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-[var(--color-card)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-[var(--color-text)]">Notifications</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-text)]">
                  Statut des notifications
                </p>
                <p className="text-xs text-[var(--color-text-lighter)]">
                  {notificationStatus === 'granted' && 'Autorisées ✓'}
                  {notificationStatus === 'denied' && 'Bloquées'}
                  {notificationStatus === 'default' && 'Non configurées'}
                  {notificationStatus === 'unsupported' && 'Non supportées'}
                </p>
              </div>
              
              {notificationStatus !== 'granted' && notificationStatus !== 'unsupported' && (
                <button
                  onClick={handleRequestPermission}
                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-button)] text-sm hover:bg-[var(--color-primary-light)] transition-colors"
                >
                  Activer
                </button>
              )}
            </div>

            {/* Bouton de test */}
            {notificationStatus === 'granted' && (
              <button
                onClick={handleTestNotification}
                disabled={testPending}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-button)] text-sm text-[var(--color-text)] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {testPending ? 'Notification dans 5 secondes...' : 'Tester les notifications'}
              </button>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-xs text-amber-900">
                <strong>Note :</strong> Sur mobile (PWA), les notifications fonctionnent en arrière-plan grâce au Service Worker.
                Assurez-vous d'installer l'application sur votre écran d'accueil pour profiter de cette fonctionnalité.
              </p>
            </div>
          </div>
        </section>

        {/* Bouton Enregistrer */}
        <button
          onClick={handleSave}
          className={`w-full rounded-[var(--radius-button)] px-6 py-4 flex items-center justify-center gap-2 transition-all ${
            saved
              ? 'bg-[var(--color-success)] text-white'
              : 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white hover:shadow-lg'
          }`}
        >
          <Save className="w-5 h-5" />
          {saved ? 'Enregistré !' : 'Enregistrer les réglages'}
        </button>

        {/* Informations */}
        <section className="bg-white/50 rounded-[var(--radius-card)] p-6 border border-[var(--color-border)]">
          <h4 className="text-sm text-[var(--color-text)] mb-2">À propos</h4>
          <p className="text-xs text-[var(--color-text-lighter)] leading-relaxed">
            RideDry v1.0 - MVP web-app pour planifier vos trajets à vélo en évitant la pluie.
            Les données météo proviennent d'OpenWeatherMap. Cette application stocke vos données localement
            dans votre navigateur (localStorage).
          </p>
        </section>
      </main>

      {/* Dialog de permission de notification */}
      {showNotifDialog && (
        <NotificationPermissionDialog
          onClose={() => setShowNotifDialog(false)}
          onPermissionGranted={handlePermissionGranted}
        />
      )}

      {/* Informations sur la conservation de l'application en arrière-plan */}
      {isNotificationGranted() && (
        <div className="max-w-2xl mx-auto px-6 pb-6">
          <KeepAliveInfo isActive={keepAliveManager.isRunning()} />
        </div>
      )}
    </div>
  );
}