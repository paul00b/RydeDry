import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import * as L from 'leaflet';

interface WeatherRadarProps {
  location: string;
  lat?: number;
  lon?: number;
}

interface RadarFrame {
  path: string;
  time: number;
}

export function WeatherRadar({ location, lat = 48.8566, lon = 2.3522 }: WeatherRadarProps) {
  const [radarFrames, setRadarFrames] = useState<RadarFrame[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([lat, lon]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mettre à jour le centre de la carte quand les coordonnées changent
  useEffect(() => {
    if (lat && lon) {
      setMapCenter([lat, lon]);
    }
  }, [lat, lon]);

  // Charger les données RainViewer
  useEffect(() => {
    const fetchRadarData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        const data = await response.json();
        
        // Combiner les frames passées et futures
        const frames: RadarFrame[] = [
          ...data.radar.past.map((frame: any) => ({
            path: frame.path,
            time: frame.time
          })),
          ...data.radar.nowcast.map((frame: any) => ({
            path: frame.path,
            time: frame.time
          }))
        ];
        
        setRadarFrames(frames);
        // Positionner sur "maintenant" (dernière frame du passé)
        setCurrentFrameIndex(data.radar.past.length - 1);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement du radar:', error);
        setLoading(false);
      }
    };

    fetchRadarData();
    // Actualiser toutes les 10 minutes
    const refreshInterval = setInterval(fetchRadarData, 10 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Animation automatique
  useEffect(() => {
    if (isPlaying && radarFrames.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentFrameIndex((prev) => {
          if (prev >= radarFrames.length - 1) {
            return 0; // Boucle
          }
          return prev + 1;
        });
      }, 500); // Change de frame toutes les 500ms
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, radarFrames.length]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPlaying(false);
    setCurrentFrameIndex(parseInt(e.target.value));
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const goToStart = () => {
    setIsPlaying(false);
    setCurrentFrameIndex(0);
  };

  const goToEnd = () => {
    setIsPlaying(false);
    setCurrentFrameIndex(radarFrames.length - 1);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const getCurrentTimeLabel = () => {
    if (radarFrames.length === 0) return '';
    const currentTime = radarFrames[currentFrameIndex]?.time;
    if (!currentTime) return '';
    
    const now = Date.now() / 1000;
    const diff = Math.round((currentTime - now) / 60); // Différence en minutes
    
    if (diff === 0 || Math.abs(diff) < 3) return 'Maintenant';
    if (diff < 0) return `Il y a ${Math.abs(diff)} min`;
    return `Dans ${diff} min`;
  };

  return (
    <div className="bg-[var(--color-card)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6">
      {/* Titre et localisation */}
      <div className="mb-4">
        <h3 className="text-[var(--color-text)] mb-1">Radar pluie</h3>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[var(--color-text-light)]" />
          <span className="text-sm text-[var(--color-text-light)]">{location}</span>
        </div>
      </div>

      {/* Carte avec légende en overlay */}
      <div className="relative h-[200px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[var(--color-text-light)]">Chargement du radar...</div>
          </div>
        ) : (
          <>
            <MapContainer
              center={mapCenter}
              zoom={9}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MapUpdater center={mapCenter} />
              
              {radarFrames.length > 0 && radarFrames[currentFrameIndex] && (
                <RadarLayer
                  path={radarFrames[currentFrameIndex].path}
                />
              )}
            </MapContainer>
            
            {/* Légende en overlay transparente */}
            <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(66, 135, 245, 0.3)' }}></div>
                  <span className="text-[var(--color-text-lighter)]">Faible</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(66, 135, 245, 0.6)' }}></div>
                  <span className="text-[var(--color-text-lighter)]">Mod.</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(66, 135, 245, 0.9)' }}></div>
                  <span className="text-[var(--color-text-lighter)]">Forte</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Contrôles de timeline - Seulement le slider */}
      {!loading && radarFrames.length > 0 && (
        <div className="space-y-2">
          {/* Temps actuel */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text)]">
              {formatTime(radarFrames[currentFrameIndex].time)}
            </span>
            <span className="text-sm text-[var(--color-primary)]">
              {getCurrentTimeLabel()}
            </span>
          </div>

          {/* Slider */}
          <div className="relative">
            <input
              type="range"
              min="0"
              max={radarFrames.length - 1}
              value={currentFrameIndex}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
              style={{
                background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${(currentFrameIndex / (radarFrames.length - 1)) * 100}%, #e5e7eb ${(currentFrameIndex / (radarFrames.length - 1)) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between mt-1 text-xs text-[var(--color-text-lighter)]">
              <span>-2h</span>
              <span>Maintenant</span>
              <span>+30min</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Composant pour afficher la couche radar
function RadarLayer({ path }: { path: string }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !path) return;

    // Créer une nouvelle couche TileLayer pour RainViewer
    const radarLayer = new L.TileLayer(
      `https://tilecache.rainviewer.com${path}/256/{z}/{x}/{y}/2/1_1.png`,
      {
        tileSize: 256,
        opacity: 0.6,
        zIndex: 10,
      }
    );

    radarLayer.addTo(map);

    return () => {
      map.removeLayer(radarLayer);
    };
  }, [map, path]);

  return null;
}

// Composant pour mettre à jour la carte
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    map.setView(center, 9);
  }, [map, center]);

  return null;
}