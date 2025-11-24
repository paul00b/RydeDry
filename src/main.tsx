import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import 'leaflet/dist/leaflet.css'

// ==========================================
// SYSTÈME DE DEBUG MOBILE - CAPTURE TOUT
// ==========================================
const errorLog: string[] = [];
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

function showErrorOverlay(message: string, error?: any) {
  const overlay = document.createElement('div');
  overlay.id = 'mobile-error-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    z-index: 999999;
    padding: 20px;
    overflow: auto;
    font-family: system-ui, sans-serif;
  `;
  
  const errorDetails = error ? `
    <pre style="
      background: #fee;
      padding: 10px;
      border-radius: 8px;
      overflow: auto;
      font-size: 12px;
      margin-top: 10px;
    ">${error.stack || error.message || String(error)}</pre>
  ` : '';
  
  const logs = errorLog.length > 0 ? `
    <div style="margin-top: 20px;">
      <h3>Console logs:</h3>
      <pre style="
        background: #f5f5f5;
        padding: 10px;
        border-radius: 8px;
        overflow: auto;
        font-size: 11px;
      ">${errorLog.join('\n')}</pre>
    </div>
  ` : '';
  
  overlay.innerHTML = `
    <h1 style="color: #e11d48; margin-bottom: 10px;">❌ Erreur détectée</h1>
    <p style="color: #666;">${message}</p>
    ${errorDetails}
    ${logs}
    <button onclick="window.location.reload()" style="
      margin-top: 20px;
      padding: 12px 24px;
      background: #6161ff;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
    ">Recharger</button>
    <p style="margin-top: 20px; font-size: 12px; color: #999;">
      User Agent: ${navigator.userAgent}
    </p>
  `;
  
  document.body.appendChild(overlay);
}

// Capturer console.error et console.warn
console.error = (...args: any[]) => {
  errorLog.push(`ERROR: ${args.map(a => String(a)).join(' ')}`);
  originalConsoleError(...args);
};

console.warn = (...args: any[]) => {
  errorLog.push(`WARN: ${args.map(a => String(a)).join(' ')}`);
  originalConsoleWarn(...args);
};

// Capturer les erreurs globales
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  showErrorOverlay('Erreur JavaScript détectée', event.error);
  event.preventDefault();
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  showErrorOverlay('Promise non gérée', event.reason);
  event.preventDefault();
});

// Log de démarrage
console.log('🚀 RideDry starting...');
console.log('User Agent:', navigator.userAgent);
console.log('Screen size:', window.innerWidth, 'x', window.innerHeight);

// ==========================================
// LANCEMENT DE L'APP
// ==========================================

// Wrapper avec ErrorBoundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null; errorInfo: any }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React error caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          fontFamily: 'system-ui, sans-serif',
          maxWidth: '100vw',
          overflow: 'auto'
        }}>
          <h1 style={{ color: '#e11d48' }}>⚠️ Erreur React</h1>
          <p style={{ color: '#666', marginTop: '10px' }}>
            {this.state.error?.message || 'Erreur inconnue'}
          </p>
          <pre style={{
            background: '#fee',
            padding: '10px',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '12px',
            marginTop: '10px'
          }}>
            {this.state.error?.stack}
          </pre>
          {this.state.errorInfo && (
            <pre style={{
              background: '#fef3c7',
              padding: '10px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '11px',
              marginTop: '10px'
            }}>
              {JSON.stringify(this.state.errorInfo, null, 2)}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              background: '#6161ff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Recharger l'application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Tenter de monter l'app avec gestion d'erreur
try {
  console.log('📦 Mounting React app...');
  
  const root = document.getElementById('root');
  if (!root) {
    throw new Error('Element #root non trouvé dans le DOM');
  }
  
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );
  
  console.log('✅ React app mounted successfully');
} catch (error) {
  console.error('❌ Failed to mount React app:', error);
  showErrorOverlay('Impossible de démarrer React', error);
}
