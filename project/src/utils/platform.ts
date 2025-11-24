/**
 * Détection de la plateforme (iOS, Android, Desktop)
 */

export type Platform = 'ios' | 'android' | 'desktop';

/**
 * Détecte la plateforme de l'utilisateur
 */
export function detectPlatform(): Platform {
  try {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';

    // Détection iOS (iPhone, iPad, iPod)
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      return 'ios';
    }

    // Détection Android
    if (/android/i.test(userAgent)) {
      return 'android';
    }

    // Par défaut : desktop
    return 'desktop';
  } catch (error) {
    console.error('Erreur détection plateforme:', error);
    return 'desktop';
  }
}

/**
 * Vérifie si l'utilisateur est sur iOS
 */
export function isIOS(): boolean {
  try {
    return detectPlatform() === 'ios';
  } catch {
    return false;
  }
}

/**
 * Vérifie si l'utilisateur est sur Android
 */
export function isAndroid(): boolean {
  try {
    return detectPlatform() === 'android';
  } catch {
    return false;
  }
}

/**
 * Vérifie si l'utilisateur est sur mobile (iOS ou Android)
 */
export function isMobile(): boolean {
  try {
    return isIOS() || isAndroid();
  } catch {
    return false;
  }
}

/**
 * Vérifie si l'app est lancée en mode PWA (standalone)
 */
export function isPWA(): boolean {
  try {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    );
  } catch {
    return false;
  }
}