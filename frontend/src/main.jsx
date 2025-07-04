import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './styles/abstracts/_variables.css';
import AppRouter from './components/pages/AppRouter.jsx';
import { authFetch } from './utils/authFetch';

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

const INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 minutos

function RequireAuth({ children, allowedRoles }) {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to='/login' replace />;
  }
  return children;
}

function InactivityHandler({ children }) {
  const timerRef = useRef();
  const [timeout, setTimeoutValue] = useState(15 * 60 * 1000); // valor por defecto

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await authFetch('/api/auth/user/config');
        if (!res) return;
        const data = await res.json();
        setTimeoutValue((data.session_timeout_minutes || 15) * 60 * 1000);
      } catch {}
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const resetTimer = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        handleLogout();
      }, timeout);
    };
    const events = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [timeout]);
  return children;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <InactivityHandler>
        <AppRouter />
      </InactivityHandler>
    </BrowserRouter>
  </React.StrictMode>
);
