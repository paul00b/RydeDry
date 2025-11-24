import { Bell, X } from 'lucide-react';
import { Button } from '../ui/button';

interface NotificationPromptModalProps {
  onEnable: () => void;
  onDismiss: () => void;
}

export function NotificationPromptModal({ onEnable, onDismiss }: NotificationPromptModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
        {/* Icône et titre */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl">Ne manquez plus la météo !</h2>
            </div>
          </div>
          <button 
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <div className="mb-6 space-y-3 text-gray-600 dark:text-gray-300">
          <p>
            🎉 Super ! Vous venez d'ajouter votre premier trajet.
          </p>
          <p>
            Activez les notifications pour recevoir une alerte avant votre départ si la pluie arrive. 
            Vous pourrez ainsi adapter votre timing et rester au sec ! ☀️
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-sm">
            💡 <span className="font-medium">Astuce :</span> Vous recevrez uniquement des alertes pertinentes 
            pour vos trajets planifiés.
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onEnable}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            <Bell className="w-4 h-4 mr-2" />
            Activer les notifications
          </Button>
          <Button
            onClick={onDismiss}
            variant="outline"
            className="flex-1"
          >
            Plus tard
          </Button>
        </div>
      </div>
    </div>
  );
}
