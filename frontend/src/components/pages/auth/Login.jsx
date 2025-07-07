import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../organisms/LoginForm/LoginForm';
import { login, getToken, getRole, isTokenValid, clearSession } from '../../../auth';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirección automática si ya hay sesión válida
  useEffect(() => {
    const token = getToken();
    const role = getRole();
    
    // Solo redirigir si hay token y rol válidos
    if (token && role && isTokenValid(token)) {
      navigate('/app', { replace: true });
      return;
    }
    
    // Si hay token o rol pero no son válidos, limpiar
    if (token || role) {
      clearSession();
    }
  }, [navigate]);

  const handleLoginSubmit = useCallback(async (formData) => {
    setError('');
    setLoading(true);
    try {
      await login(formData);
      navigate('/app', { replace: true });
    } catch (err) {
      setError(err.message || 'Error de red o servidor.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--app-bg, #f9fafb)' }}>
      <div style={{ minWidth: 320, maxWidth: 360, width: '100%', background: 'var(--surface, #fff)', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '2.5rem 2rem' }}>
        <LoginForm
          onSubmit={handleLoginSubmit}
          isLoading={loading}
          serverError={error}
        />
      </div>
    </div>
  );
};

export default Login; 