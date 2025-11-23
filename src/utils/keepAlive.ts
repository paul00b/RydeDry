/**
 * 🔋 Keep-Alive System pour RideDry
 * 
 * Système qui maintient l'app active en background pour permettre
 * les notifications même quand l'onglet n'est pas au premier plan.
 * 
 * Utilise plusieurs stratégies :
 * 1. Timers JavaScript (setInterval)
 * 2. Page Visibility API (détection quand l'onglet devient invisible)
 * 3. Wake Lock API (Android uniquement, garde l'écran éveillé)
 * 4. Periodic Background Sync (PWA installée uniquement)
 */

export class KeepAliveManager {
  private checkInterval: number | null = null;
  private wakeLock: any = null;
  private isActive = false;

  /**
   * Démarre le système keep-alive
   */
  async start(): Promise<void> {
    if (this.isActive) {
      console.log('[KeepAlive] Déjà actif');
      return;
    }

    console.log('[KeepAlive] Démarrage du système...');
    this.isActive = true;

    // 1. Enregistrer le Service Worker avancé
    await this.registerServiceWorker();

    // 2. Démarrer les vérifications périodiques
    this.startPeriodicChecks();

    // 3. Écouter les changements de visibilité
    this.setupVisibilityListener();

    // 4. Tenter d'acquérir le Wake Lock (mobile)
    await this.requestWakeLock();

    // 5. Enregistrer le Periodic Background Sync (si supporté)
    await this.registerPeriodicSync();

    console.log('[KeepAlive] ✅ Système actif');
  }

  /**
   * Arrête le système keep-alive
   */
  stop(): void {
    console.log('[KeepAlive] Arrêt du système...');
    
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    if (this.wakeLock) {
      this.wakeLock.release();
      this.wakeLock = null;
    }

    this.isActive = false;
    console.log('[KeepAlive] ✅ Système arrêté');
  }

  /**
   * Enregistre le Service Worker avancé
   */
  private async registerServiceWorker(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.warn('[KeepAlive] Service Worker non supporté');
      return;
    }

    try {
      // Tenter d'enregistrer le SW avancé en premier
      const registration = await navigator.serviceWorker.register('/sw-advanced.js');
      console.log('[KeepAlive] Service Worker enregistré:', registration);
      
      // Attendre que le SW soit actif
      await navigator.serviceWorker.ready;
      console.log('[KeepAlive] Service Worker prêt');
    } catch (error) {
      console.error('[KeepAlive] Erreur SW:', error);
      
      // Fallback sur le SW basique
      try {
        await navigator.serviceWorker.register('/sw.js');
        console.log('[KeepAlive] Fallback sur SW basique');
      } catch (fallbackError) {
        console.error('[KeepAlive] Erreur fallback SW:', fallbackError);
      }
    }
  }

  /**
   * Démarre les vérifications périodiques (toutes les minutes)
   */
  private startPeriodicChecks(): void {
    // Vérifier toutes les minutes
    this.checkInterval = window.setInterval(() => {
      console.log('[KeepAlive] Heartbeat - App active');
      
      // Envoyer un message au SW pour le garder éveillé
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'HEARTBEAT',
          timestamp: Date.now(),
        });
      }
    }, 60 * 1000); // 1 minute

    console.log('[KeepAlive] ✅ Vérifications périodiques démarrées (1 min)');
  }

  /**
   * Écoute les changements de visibilité de la page
   */
  private setupVisibilityListener(): void {
    document.addEventListener('visibilitychange', async () => {
      if (document.hidden) {
        console.log('[KeepAlive] 📱 Page cachée (background)');
        
        // Notifier le SW que l'app est en background
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'APP_HIDDEN',
            timestamp: Date.now(),
          });
        }
      } else {
        console.log('[KeepAlive] 📱 Page visible (foreground)');
        
        // Ré-acquérir le Wake Lock si nécessaire
        await this.requestWakeLock();
        
        // Notifier le SW que l'app est de retour au premier plan
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'APP_VISIBLE',
            timestamp: Date.now(),
          });
        }
      }
    });

    console.log('[KeepAlive] ✅ Listener visibilité configuré');
  }

  /**
   * Demande le Wake Lock (garde l'écran éveillé sur mobile)
   * Note: Nécessite une interaction utilisateur et fonctionne uniquement sur Android
   */
  private async requestWakeLock(): Promise<void> {
    // Wake Lock API n'est pas supporté partout
    if (!('wakeLock' in navigator)) {
      console.log('[KeepAlive] Wake Lock non supporté');
      return;
    }

    try {
      // @ts-ignore - Wake Lock API est expérimental
      this.wakeLock = await navigator.wakeLock.request('screen');
      console.log('[KeepAlive] ✅ Wake Lock acquis');

      this.wakeLock.addEventListener('release', () => {
        console.log('[KeepAlive] Wake Lock libéré');
      });
    } catch (error) {
      console.log('[KeepAlive] Wake Lock refusé:', error);
    }
  }

  /**
   * Enregistre le Periodic Background Sync
   * Fonctionne uniquement si la PWA est installée (Chrome Android)
   */
  private async registerPeriodicSync(): Promise<void> {
    if (!('serviceWorker' in navigator) || !('periodicSync' in navigator.serviceWorker)) {
      console.log('[KeepAlive] Periodic Sync non supporté');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // @ts-ignore - Periodic Sync est expérimental
      const status = await navigator.permissions.query({
        name: 'periodic-background-sync',
      });

      if (status.state === 'granted') {
        // @ts-ignore
        await registration.periodicSync.register('check-trips', {
          minInterval: 15 * 60 * 1000, // 15 minutes minimum
        });
        console.log('[KeepAlive] ✅ Periodic Sync enregistré');
      } else {
        console.log('[KeepAlive] Periodic Sync non autorisé');
      }
    } catch (error) {
      console.log('[KeepAlive] Periodic Sync échoué:', error);
    }
  }

  /**
   * Envoie les données au Service Worker pour consultation en background
   */
  async syncDataToServiceWorker(trips: any[], weatherData: Map<string, any[]>): Promise<void> {
    if (!navigator.serviceWorker.controller) {
      console.warn('[KeepAlive] Pas de Service Worker actif');
      return;
    }

    try {
      // Envoyer les trajets
      navigator.serviceWorker.controller.postMessage({
        type: 'UPDATE_TRIPS',
        payload: { trips },
      });

      // Envoyer la météo pour chaque localisation
      weatherData.forEach((weather, location) => {
        navigator.serviceWorker.controller?.postMessage({
          type: 'UPDATE_WEATHER',
          payload: { location, weather },
        });
      });

      console.log('[KeepAlive] ✅ Données synchronisées avec SW');
    } catch (error) {
      console.error('[KeepAlive] Erreur sync données:', error);
    }
  }

  /**
   * Vérifie si le système est actif
   */
  isRunning(): boolean {
    return this.isActive;
  }
}

// Instance singleton
export const keepAliveManager = new KeepAliveManager();
