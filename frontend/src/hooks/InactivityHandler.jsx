import React, { useEffect, useRef } from 'react';

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

const INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 minutos

function InactivityHandler({ children }) {
  const timerRef = useRef();

  useEffect(() => {
    const resetTimer = () => {
      clearTimeout(timerRef.current);
      // Solo configurar el timer si hay un token
      const token = localStorage.getItem('token');
      if (token) {
        timerRef.current = setTimeout(() => {
          handleLogout();
        }, INACTIVITY_LIMIT_MS);
      }
    };
    
    const events = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();
    
    return () => {
      clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, []);

  return children;
}

export default InactivityHandler; 