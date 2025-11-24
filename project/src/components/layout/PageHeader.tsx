import { useState, useEffect } from 'react';
import { Bike } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  theme?: 'light' | 'dark';
  onThemeToggle?: () => void;
  showTime?: boolean;
}

export function PageHeader({ title, subtitle, theme, onThemeToggle, showTime = false }: PageHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mettre à jour l'heure chaque minute
  useEffect(() => {
    if (showTime) {
      // Mettre à jour immédiatement
      setCurrentTime(new Date());
      
      // Puis mettre à jour toutes les minutes
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 60000); // Mise à jour toutes les minutes

      return () => clearInterval(timer);
    }
  }, [showTime]);

  // Formater l'heure (HH:mm)
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <header className="bg-glass-light backdrop-blur-md border-b border-[var(--color-border)] sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] p-2.5 rounded-xl shadow-sm">
              <Bike className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl text-[var(--color-text)]">
                  {title || 'RideDry'}
                </h1>
                {showTime && (
                  <span className="text-sm text-[var(--color-text-lighter)] font-mono">
                    {formatTime(currentTime)}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-sm text-[var(--color-text-light)]">{subtitle}</p>
              )}
            </div>
          </div>
          
          {/* Theme Toggle */}
          {theme && onThemeToggle && (
            <ThemeToggle theme={theme} onToggle={onThemeToggle} />
          )}
        </div>
      </div>
    </header>
  );
}