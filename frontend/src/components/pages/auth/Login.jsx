import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../organisms/LoginForm/LoginForm'; // Importar el nuevo organismo

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirección automática si ya hay sesión
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      // Usar solo la ruta raíz, HomePage se encargará de la redirección
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleLoginSubmit = async (formData) => {
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
      // Redirigir según rol (o a una página principal que maneje la redirección por rol)
      navigate('/'); // Simplificado, la página de inicio puede manejar la redirección basada en rol
    } catch (err) {
      setError('Error de red o servidor.');
    } finally {
      setLoading(false);
    }
  };

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