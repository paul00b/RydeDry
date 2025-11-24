import { useState, useEffect } from 'react';

interface DebugInfo {
  viewport: { width: number; height: number };
  screen: { width: number; height: number };
  localStorage: boolean;
  online: boolean;
  userAgent: string;
}

export function DebugPanel() {
  const [show, setShow] = useState(false);
  const [info, setInfo] = useState<DebugInfo | null>(null);

  useEffect(() => {
    const updateInfo = () => {
      setInfo({
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        screen: {
          width: window.screen.width,
          height: window.screen.height
        },
        localStorage: testLocalStorage(),
        online: navigator.onLine,
        userAgent: navigator.userAgent
      });
    };

    updateInfo();
    window.addEventListener('resize', updateInfo);
    window.addEventListener('online', updateInfo);
    window.addEventListener('offline', updateInfo);

    return () => {
      window.removeEventListener('resize', updateInfo);
      window.removeEventListener('online', updateInfo);
      window.removeEventListener('offline', updateInfo);
    };
  }, []);

  const testLocalStorage = () => {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch {
      return false;
    }
  };

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="fixed bottom-20 right-4 w-12 h-12 bg-red-500 text-white rounded-full shadow-lg flex items-center justify-center z-50 text-xs font-bold"
        aria-label="Debug"
      >
        🐛
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 overflow-auto p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Debug Panel</h2>
          <button
            onClick={() => setShow(false)}
            className="w-8 h-8 bg-red-500 text-white rounded-full"
          >
            ✕
          </button>
        </div>

        {info && (
          <div className="space-y-4 text-sm font-mono">
            <div>
              <h3 className="font-bold mb-2">Viewport</h3>
              <p>Width: {info.viewport.width}px</p>
              <p>Height: {info.viewport.height}px</p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Screen</h3>
              <p>Width: {info.screen.width}px</p>
              <p>Height: {info.screen.height}px</p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Status</h3>
              <p>
                localStorage: {' '}
                <span className={info.localStorage ? 'text-green-500' : 'text-red-500'}>
                  {info.localStorage ? '✓ OK' : '✗ KO'}
                </span>
              </p>
              <p>
                Network: {' '}
                <span className={info.online ? 'text-green-500' : 'text-red-500'}>
                  {info.online ? '✓ Online' : '✗ Offline'}
                </span>
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">User Agent</h3>
              <p className="break-all text-xs">{info.userAgent}</p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Actions</h3>
              <button
                onClick={() => {
                  localStorage.clear();
                  alert('localStorage cleared!');
                }}
                className="bg-orange-500 text-white px-4 py-2 rounded mr-2"
              >
                Clear localStorage
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Reload
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
