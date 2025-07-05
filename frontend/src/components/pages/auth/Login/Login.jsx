import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormGroup from '../../../molecules/FormGroup/FormGroup'; // Adjusted path
import FormField from '../../../molecules/FormField/FormField'; // Adjusted path
import Button from '../../../atoms/Button/Button'; // Adjusted path
import Alert from '../../../atoms/Alert/Alert'; // Adjusted path

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
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

  const validate = () => {
    const errors = {};
    if (!username) errors.username = 'El nombre de usuario es obligatorio';
    if (!password) errors.password = 'La contraseña es obligatoria';
    return errors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Credenciales incorrectas');
        setLoading(false);
        return;
      }
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      // Redirigir según rol
      if (data.user.role === 'admin') navigate('/');
      else if (data.user.role === 'doctor') navigate('/');
      else if (data.user.role === 'secretary') navigate('/');
      else if (data.user.role === 'patient') navigate('/');
      else navigate('/');
    } catch (err) {
      setError('Error de red o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--app-bg, #f9fafb)' }}>
      <form onSubmit={handleSubmit} style={{ minWidth: 320, maxWidth: 360, width: '100%', background: 'var(--surface, #fff)', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} noValidate>
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: 700, fontSize: '1.3rem', color: 'var(--primary, #2563eb)' }}>Agenda de Citas</span>
        </div>
        <h2 style={{ textAlign: 'center', fontWeight: 600, fontSize: '1.1rem', margin: 0 }}>Iniciar sesión</h2>
        <FormGroup>
          <FormField
            label='Nombre de usuario'
            id='username'
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            error={fieldErrors.username}
          />
          <FormField
            label='Contraseña'
            id='password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            error={fieldErrors.password}
          />
        </FormGroup>
        {error && <Alert type='error'>{error}</Alert>}
        <Button type='submit' loading={loading} style={{ width: '100%' }} disabled={loading || Object.keys(fieldErrors).length > 0 || !username || !password}>
          Iniciar sesión
        </Button>
        <div style={{ textAlign: 'center', fontSize: '0.97em', marginTop: '0.5rem' }}>
          <a href='#' style={{ color: 'var(--primary, #2563eb)', textDecoration: 'underline' }}>¿Olvidaste tu contraseña?</a>
        </div>
      </form>
    </div>
  );
};

export default Login; 