import { Bell, Smartphone, AlertCircle } from 'lucide-react';
import { isIOS, isAndroid } from '../../utils/platform';
import { requestNotificationPermission } from '../../utils/notification';

interface NotificationPermissionDialogProps {
  onClose: () => void;
  onPermissionGranted?: () => void;
}

export function NotificationPermissionDialog({ 
  onClose, 
  onPermissionGranted 
}: NotificationPermissionDialogProps) {
  // Détection sécurisée de la plateforme
  let platform: 'ios' | 'android' | 'desktop' = 'desktop';
  
  try {
    platform = isIOS() ? 'ios' : isAndroid() ? 'android' : 'desktop';
  } catch (error) {
    console.error('Erreur détection plateforme:', error);
  }

  const handleRequestPermission = async () => {
    try {
      const granted = await requestNotificationPermission();
      
      if (granted) {
        onPermissionGranted?.();
        onClose();
      }
    } catch (error) {
      console.error('Erreur permission notification:', error);
      alert('Impossible d\'activer les notifications. Veuillez vérifier les paramètres de votre navigateur.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header avec icône */}
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-white/20 rounded-full">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-lg">Notifications RideDry</h3>
          </div>
          <p className="text-sm text-white/90">
            Soyez prévenu au meilleur moment pour partir à vélo
          </p>
        </div>

        {/* Contenu selon la plateforme */}
        <div className="p-6 space-y-4">
          {platform === 'ios' ? (
            <>
              {/* Message spécifique iOS */}
              <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900">
                  <p className="font-semibold mb-1">⚠️ Limitation iOS</p>
                  <p>
                    Sur iOS, les notifications ne fonctionnent que lorsque l'application est <strong>ouverte</strong>.
                    Apple ne supporte pas encore les notifications en arrière-plan pour les PWA.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  <strong>Pour recevoir des notifications :</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Gardez l'application ouverte en arrière-plan</li>
                  <li>• Vous recevrez des alertes au moment optimal</li>
                  <li>• Votre téléphone peut être verrouillé</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-900">
                  💡 <strong>Astuce :</strong> Installez RideDry sur votre écran d'accueil et lancez-la avant votre créneau de départ !
                </p>
              </div>
            </>
          ) : platform === 'android' ? (
            <>
              {/* Message spécifique Android */}
              <div className="flex gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Smartphone className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-900">
                  <p className="font-semibold mb-1">✅ Notifications complètes</p>
                  <p>
                    Sur Android, RideDry peut vous envoyer des notifications même quand l'app est fermée !
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  <strong>Vous recevrez des notifications pour :</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• L'heure optimale de départ</li>
                  <li>• Les alertes pluie importantes</li>
                  <li>• Les changements météo</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-900">
                  💡 <strong>Conseil :</strong> Installez l'app sur votre écran d'accueil pour une meilleure expérience !
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Message pour desktop */}
              <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">🖥️ Notifications desktop</p>
                  <p>
                    Les notifications fonctionnent lorsque l'onglet est ouvert dans votre navigateur.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Vous recevrez une alerte quand c'est le moment de partir pour éviter la pluie.
                </p>
              </div>
            </>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Plus tard
            </button>
            <button
              onClick={handleRequestPermission}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] text-white rounded-lg hover:shadow-lg transition-all"
            >
              {platform === 'ios' ? 'J\'ai compris' : 'Activer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}