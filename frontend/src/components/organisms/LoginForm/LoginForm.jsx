import React, { useState } from 'react';
import FormGroup from '../../molecules/FormGroup/FormGroup';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import styles from './LoginForm.module.css';

const LoginForm = ({ onSubmit, isLoading, serverError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!username) errors.username = 'El nombre de usuario es obligatorio';
    if (!password) errors.password = 'La contraseña es obligatoria';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) {
      onSubmit({ username, password });
    }
  };

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
          onChange={(e) => setUsername(e.target.value)}
          required
          error={fieldErrors.username}
        />
        <FormField
          label='Contraseña'
          id='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          error={fieldErrors.password}
        />
      </FormGroup>
      {serverError && <Alert type='error'>{serverError}</Alert>}
      <Button type='submit' loading={isLoading} style={{ width: '100%' }} disabled={isLoading || Object.keys(fieldErrors).length > 0 || !username || !password}>
        Iniciar sesión
      </Button>
      <div className={styles.forgotPassword}>
        <a href='#' className={styles.forgotPasswordLink}>¿Olvidaste tu contraseña?</a>
      </div>
    </form>
  );
};

export default LoginForm;
