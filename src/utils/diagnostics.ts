/**
 * Utilitaires de diagnostic pour débogage mobile
 */

export function logDeviceInfo() {
  const info = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    online: navigator.onLine,
    cookiesEnabled: navigator.cookieEnabled,
    localStorageAvailable: isLocalStorageAvailable(),
    serviceWorkerSupported: 'serviceWorker' in navigator,
    notificationSupported: 'Notification' in window,
  };

  console.log('📱 Device Info:', info);
  return info;
}

export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

export function checkAPIsAvailability() {
  const apis = {
    fetch: typeof fetch !== 'undefined',
    Promise: typeof Promise !== 'undefined',
    Map: typeof Map !== 'undefined',
    Set: typeof Set !== 'undefined',
    localStorage: isLocalStorageAvailable(),
    sessionStorage: isSessionStorageAvailable(),
    geolocation: 'geolocation' in navigator,
    intersectionObserver: 'IntersectionObserver' in window,
  };

  console.log('🔌 APIs Availability:', apis);
  return apis;
}

function isSessionStorageAvailable(): boolean {
  try {
    const test = '__sessionStorage_test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

export function testNetworkConnectivity() {
  return new Promise((resolve) => {
    const img = new Image();
    const timeout = setTimeout(() => {
      resolve({ online: false, message: 'Timeout' });
    }, 5000);

    img.onload = () => {
      clearTimeout(timeout);
      resolve({ online: true, message: 'Connected' });
    };

    img.onerror = () => {
      clearTimeout(timeout);
      resolve({ online: false, message: 'Network error' });
    };

    img.src = 'https://www.google.com/favicon.ico?' + Date.now();
  });
}

export async function runDiagnostics() {
  console.log('🔍 Running diagnostics...');
  
  const device = logDeviceInfo();
  const apis = checkAPIsAvailability();
  const network = await testNetworkConnectivity();
  
  const report = {
    device,
    apis,
    network,
    timestamp: new Date().toISOString(),
  };
  
  console.log('📋 Diagnostic Report:', report);
  
  return report;
}
