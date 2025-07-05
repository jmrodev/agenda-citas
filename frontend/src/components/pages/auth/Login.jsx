import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../organisms/LoginForm/LoginForm'; // Importar el nuevo organismo

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirección automática si ya hay sesión válida
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    // Solo redirigir si hay token y rol válidos
    if (token && role) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Verificar que el token no esté expirado
        if (!payload.exp || (payload.exp * 1000) > Date.now()) {
          // Token válido, redirigir a la página principal
          navigate('/', { replace: true });
          return;
        }
      } catch (e) {
        // Token malformado, continuar con el login
      }
    }
    
    // Si hay token o rol pero no son válidos, limpiar
    if (token || role) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
  }, []); // Removido navigate de las dependencias

  const handleLoginSubmit = useCallback(async (formData) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData) // Usar formData del LoginForm
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Credenciales incorrectas');
        setLoading(false);
        return;
      }
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role); // Guardar rol del usuario
      // Redirigir a la página principal que manejará la redirección por rol
      navigate('/', { replace: true });
    } catch (err) {
      setError('Error de red o servidor.');
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