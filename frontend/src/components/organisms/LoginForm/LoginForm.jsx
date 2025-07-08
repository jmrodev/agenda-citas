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
      console.log('LoginForm.handleSubmit - Llamando onSubmit con:', { username });
      // Usar la función onSubmit que recibe como prop
      await onSubmit({ username, password });
      console.log('LoginForm.handleSubmit - onSubmit completado exitosamente');
    } catch (error) {
      console.error('LoginForm.handleSubmit - Error:', error.message);
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.loginForm}>
      <h2 className={styles.title}>Iniciar Sesión</h2>
      

      
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
