import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import styles from './LoginForm.module.css';

const LoginForm = React.memo(({ onSubmit, isLoading, serverError }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      console.log('Intentando login con:', { username, password });
      
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      console.log('Respuesta del servidor:', res.status);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Credenciales incorrectas');
      }

      const data = await res.json();
      console.log('Login exitoso:', data);

      // Guardar token y rol
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);

      // Redirigir según el rol del usuario
      const { role } = data.user;
      
      switch (role) {
        case 'admin':
          navigate('/dashboard/admin');
          break;
        case 'secretary':
          navigate('/dashboard/secretary');
          break;
        case 'doctor':
          navigate('/dashboard/doctor');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.loginForm}>
      <h2 className={styles.title}>Iniciar Sesión</h2>
      
      {/* Input de prueba temporal */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h4>Input de prueba:</h4>
        <input 
          type="text" 
          placeholder="Escribe aquí para probar"
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <p>Si puedes escribir aquí, el problema está en el sistema de formularios</p>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>
            Usuario *
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ingrese su usuario"
            required
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
            Contraseña *
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
            required
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="large"
          disabled={!username || !password || isSubmitting || isLoading}
          loading={isSubmitting || isLoading}
          className={styles.submitButton}
        >
          {isSubmitting || isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </form>

      {(error || serverError) && (
        <Alert type="error" className={styles.errorAlert}>
          {error || serverError}
        </Alert>
      )}
    </div>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;
