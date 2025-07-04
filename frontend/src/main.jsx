import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/abstracts/_variables.css';
import AppRouter from './components/pages/AppRouter.jsx';
import InactivityHandler from './hooks/InactivityHandler.jsx';
import ErrorBoundary from './components/atoms/ErrorBoundary/ErrorBoundary.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <InactivityHandler>
          <AppRouter />
        </InactivityHandler>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
