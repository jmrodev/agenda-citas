import React, { useState, useCallback, useMemo } from 'react';
import FormGroup from '../../molecules/FormGroup/FormGroup';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import styles from './LoginForm.module.css';

const LoginForm = React.memo(({ onSubmit, isLoading, serverError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Memoizar validación
  const validate = useCallback(() => {
    const errors = {};
    if (!username) errors.username = 'El nombre de usuario es obligatorio';
    if (!password) errors.password = 'La contraseña es obligatoria';
    return errors;
  }, [username, password]);

  // Memoizar si el formulario es válido
  const isFormValid = useMemo(() => {
    const errors = validate();
    return Object.keys(errors).length === 0 && username && password;
  }, [validate, username, password]);

  // Callbacks para handlers
  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value);
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (fieldErrors.username) {
      setFieldErrors(prev => ({ ...prev, username: '' }));
    }
  }, [fieldErrors.username]);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (fieldErrors.password) {
      setFieldErrors(prev => ({ ...prev, password: '' }));
    }
  }, [fieldErrors.password]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) {
      onSubmit({ username, password });
    }
  }, [validate, onSubmit, username, password]);

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <div className={styles.titleContainer}>
        <span className={styles.title}>Agenda de Citas</span>
      </div>
      <h2 className={styles.subtitle}>Iniciar sesión</h2>
      <FormGroup>
        <FormField
          label='Nombre de usuario'
          id='username'
          value={username}
          onChange={handleUsernameChange}
          required
          error={fieldErrors.username}
        />
        <FormField
          label='Contraseña'
          id='password'
          type='password'
          value={password}
          onChange={handlePasswordChange}
          required
          error={fieldErrors.password}
        />
      </FormGroup>
      {serverError && <Alert type='error'>{serverError}</Alert>}
      <Button 
        type='submit' 
        loading={isLoading} 
        style={{ width: '100%' }} 
        disabled={isLoading || !isFormValid}
      >
        Iniciar sesión
      </Button>
      <div className={styles.forgotPassword}>
        <a href='#' className={styles.forgotPasswordLink}>¿Olvidaste tu contraseña?</a>
      </div>
    </form>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;
