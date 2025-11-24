import { Info, Smartphone, Zap, Bell } from 'lucide-react';

interface KeepAliveInfoProps {
  isActive: boolean;
}

export function KeepAliveInfo({ isActive }: KeepAliveInfoProps) {
  return (
    <div className="bg-[var(--color-card)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${isActive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
          <Zap className={`w-5 h-5 ${isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-[var(--color-text)] mb-1">
            Système Keep-Alive {isActive ? '✅' : '⚠️'}
          </h3>
          <p className="text-sm text-[var(--color-text-light)]">
            {isActive 
              ? 'Le système de notifications est actif et fonctionne en arrière-plan.'
              : 'Activez les notifications pour démarrer le système.'
            }
          </p>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] pt-4 space-y-3">
        <p className="text-sm text-[var(--color-text-light)]">
          <strong>💡 Comment ça marche ?</strong>
        </p>
        
        <div className="space-y-2 text-sm text-[var(--color-text-light)]">
          <div className="flex items-start gap-2">
            <Bell className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--color-primary)]" />
            <p>
              <strong>Onglet ouvert :</strong> Les notifications fonctionnent parfaitement, même si vous changez d'onglet.
            </p>
          </div>
          
          <div className="flex items-start gap-2">
            <Smartphone className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--color-primary)]" />
            <p>
              <strong>Mobile (PWA) :</strong> Installez l'app sur votre écran d'accueil pour des notifications encore plus fiables.
            </p>
          </div>
          
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
            <p>
              <strong>Navigateur fermé :</strong> Les notifications ne fonctionneront pas. Gardez l'onglet ouvert ou installez la PWA.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-900 dark:text-blue-200">
          <strong>📱 Astuce :</strong> Sur mobile, ajoutez RideDry à votre écran d'accueil (bouton "Ajouter à l'écran d'accueil" dans le menu du navigateur) pour une expérience optimale et des notifications plus fiables.
        </p>
      </div>
    </div>
  );
}
