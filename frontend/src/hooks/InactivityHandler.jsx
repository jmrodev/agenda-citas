import React, { useEffect, useRef, useCallback } from 'react';

const INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 minutos

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

function InactivityHandler({ children }) {
  const timerRef = useRef();

  const resetTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    // Solo configurar el timer si hay un token
    const token = localStorage.getItem('token');
    if (token) {
      timerRef.current = setTimeout(() => {
        handleLogout();
      }, INACTIVITY_LIMIT_MS);
    }
  }, []);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'];
    
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();
    
    return () => {
      clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [resetTimer]);

  return children;
}

export default InactivityHandler; 