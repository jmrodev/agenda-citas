import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginForm } from '../../../hooks/useForm';
import { login } from '../../../auth/authService';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import styles from './LoginForm.module.css';

const LoginForm = React.memo(() => {
  const navigate = useNavigate();
  
  // Usar el hook de formulario con esquema de login
  const {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit
  } = useLoginForm({
    username: '',
    password: ''
  });

  // Manejar cambio de campo
  const handleFieldChange = useCallback((e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  }, [handleChange]);

  // Manejar pérdida de foco
  const handleFieldBlur = useCallback((e) => {
    const { name } = e.target;
    handleBlur(name);
  }, [handleBlur]);

  // Manejar envío del formulario
  const onSubmit = useCallback(async (formData) => {
    try {
      const response = await login(formData.username, formData.password);
      
      if (response.success) {
        // Redirigir según el rol del usuario
        const { role } = response.user;
        
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
        
        return true;
      } else {
        // El error se maneja en authService
        return false;
      }
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  }, [navigate]);

  // Manejar envío
  const handleFormSubmit = useCallback(async (e) => {
    e.preventDefault();
    await handleSubmit(onSubmit);
  }, [handleSubmit, onSubmit]);

  return (
    <div className={styles.loginForm}>
      <h2 className={styles.title}>Iniciar Sesión</h2>
      
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <FormField
          label="Usuario"
          name="username"
          type="text"
          value={values.username}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          error={touched.username && errors.username ? errors.username : ''}
          placeholder="Ingrese su usuario"
          required
          validationRules={['required']}
          sanitizeType="text"
        />

        <FormField
          label="Contraseña"
          name="password"
          type="password"
          value={values.password}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          error={touched.password && errors.password ? errors.password : ''}
          placeholder="Ingrese su contraseña"
          required
          validationRules={['required', 'minLength:6']}
          sanitizeType="text"
        />

        <Button
          type="submit"
          variant="primary"
          size="large"
          disabled={!isValid || isSubmitting}
          loading={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </form>

      {/* Mostrar errores generales si los hay */}
      {Object.keys(errors).length > 0 && (
        <Alert type="error" className={styles.errorAlert}>
          Por favor, corrija los errores en el formulario
        </Alert>
      )}
    </div>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;
