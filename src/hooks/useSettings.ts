import { useState, useEffect } from 'react';
import { Settings } from '../types';

const STORAGE_KEY = 'ridedry_settings';

const DEFAULT_SETTINGS: Settings = {
  apiKey: 'a41ffac2fa45e32ca275b8b19e6207cd',
  language: 'fr',
  temperatureUnit: 'celsius',
  rainSensitivity: 30,
  notificationsEnabled: false,
  defaultLocation: 'Paris',
  theme: 'light',
};

/**
 * Hook pour gérer les réglages de l'application
 * Stockés dans localStorage
 */
export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  // Charger les réglages au montage
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error('Erreur lors du chargement des réglages:', error);
      }
    }
    setLoaded(true);
  }, []);

  // Sauvegarder les réglages à chaque modification
  const updateSettings = (updates: Partial<Settings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  };

  return {
    settings,
    updateSettings,
    loaded,
  };
}