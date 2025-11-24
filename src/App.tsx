import { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { Trips } from './pages/Trips';
import { Settings } from './pages/Settings';
import { BottomNav } from './components/layout/BottomNav';
import { useSettings } from './hooks/useSettings';
import { useTrips } from './hooks/useTrips';
import { DebugPanel } from './components/dev/DebugPanel';

type Page = 'home' | 'trips' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { settings, updateSettings } = useSettings();
  const tripsHook = useTrips();
  const isDev = import.meta.env?.DEV || false;
  const isDebugMode = isDev || (typeof window !== 'undefined' && window.location.search.includes('debug'));

  // Appliquer le thème au body
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Toggle theme handler
  const handleThemeToggle = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  // Rendu de la page active
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home settings={settings} tripsHook={tripsHook} onNavigate={setCurrentPage} onThemeToggle={handleThemeToggle} />;
      case 'trips':
        return <Trips tripsHook={tripsHook} onThemeToggle={handleThemeToggle} settings={settings} />;
      case 'settings':
        return <Settings settings={settings} updateSettings={updateSettings} onThemeToggle={handleThemeToggle} />;
      default:
        return <Home settings={settings} tripsHook={tripsHook} onNavigate={setCurrentPage} onThemeToggle={handleThemeToggle} />;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {renderPage()}
      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
      
      {/* Debug panel - seulement en dev ou si ?debug dans l'URL */}
      {isDebugMode && <DebugPanel />}
    </div>
  );
}

export default App;