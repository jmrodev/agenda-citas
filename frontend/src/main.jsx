import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/pages/App.jsx';
// import { Analytics } from '@vercel/analytics/react';
import './styles/abstracts/_variables.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {/* <Analytics /> */}
  </React.StrictMode>
);
