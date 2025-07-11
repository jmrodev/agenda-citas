import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.css'; // Updated import
import AppRouter from './components/pages/AppRouter.jsx';
import InactivityHandler from './hooks/InactivityHandler.jsx';
import ErrorBoundary from './components/atoms/ErrorBoundary/ErrorBoundary.jsx';
import { preloadCriticalComponents, preloadCommonRoutes } from './utils/codeSplitting';

// Preload de componentes críticos al iniciar la aplicación
preloadCriticalComponents();

// Preload de rutas comunes después de un breve delay
setTimeout(() => {
  preloadCommonRoutes();
}, 2000);

// Configuración para prevenir bloqueos en desarrollo
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Limitar el número de re-renderizados
  let renderCount = 0;
  const maxRenders = 1000;
  
  const originalRender = ReactDOM.render;
  ReactDOM.render = function(element, container, callback) {
    renderCount++;
    if (renderCount > maxRenders) {
      console.error('Demasiados re-renderizados detectados. Posible bucle infinito.');
      return;
    }
    return originalRender.call(this, element, container, callback);
  };
  
  // Configurar console para pausar en errores
  const originalError = console.error;
  console.error = function(...args) {
    originalError.apply(console, args);
    // Pausar en errores críticos en desarrollo
    if (args[0] && typeof args[0] === 'string' && 
        (args[0].includes('Maximum update depth exceeded') || 
         args[0].includes('unrecognized in this browser'))) {
      debugger;
    }
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <InactivityHandler>
        <AppRouter />
      </InactivityHandler>
    </ErrorBoundary>
  </React.StrictMode>
);
