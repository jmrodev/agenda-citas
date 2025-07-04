import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/abstracts/_variables.css';
import AppRouter from './components/pages/AppRouter.jsx';
import InactivityHandler from './hooks/InactivityHandler.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <InactivityHandler>
        <AppRouter />
      </InactivityHandler>
    </BrowserRouter>
  </React.StrictMode>
);
