import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/abstracts/_variables.css';
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <InactivityHandler>
        <AppRouter />
      </InactivityHandler>
    </ErrorBoundary>
  </React.StrictMode>
);
