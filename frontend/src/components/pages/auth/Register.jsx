import React, { useState } from 'react';
import FormGroup from '../../molecules/FormGroup/FormGroup';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

const RegisterAdmin = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!nombre || nombre.trim().length < 2) errors.nombre = 'El nombre es obligatorio (mínimo 2 caracteres)';
    if (!email) errors.email = 'El email es obligatorio';
    else if (!validateEmail(email)) errors.email = 'Email no válido';
    if (!password) errors.password = 'La contraseña es obligatoria';
    else if (!validatePassword(password)) errors.password = 'Mínimo 8 caracteres, una mayúscula, una minúscula y un número';
    if (!confirm) errors.confirm = 'Confirma la contraseña';
    else if (password !== confirm) errors.confirm = 'Las contraseñas no coinciden';
    return errors;
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('Registro exitoso');
    }, 1200);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--app-bg, #f9fafb)' }}>
      <form onSubmit={handleSubmit} style={{ minWidth: 320, maxWidth: 360, width: '100%', background: 'var(--surface, #fff)', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} noValidate>
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: 700, fontSize: '1.3rem', color: 'var(--primary, #2563eb)' }}>Agenda de Citas</span>
        </div>
        <h2 style={{ textAlign: 'center', fontWeight: 600, fontSize: '1.1rem', margin: 0 }}>Registrar administrador</h2>
        <FormGroup>
          <FormField
            label='Nombre'
            id='nombre'
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            error={fieldErrors.nombre}
          />
          <FormField
            label='Email'
            id='email'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            error={fieldErrors.email}
          />
          <FormField
            label='Contraseña'
            id='password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            error={fieldErrors.password}
            helperText='Mínimo 8 caracteres, una mayúscula, una minúscula y un número.'
          />
          <FormField
            label='Confirmar contraseña'
            id='confirm'
            type='password'
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            error={fieldErrors.confirm}
          />
        </FormGroup>
        {error && <Alert type='error'>{error}</Alert>}
        {success && <Alert type='success'>{success}</Alert>}
        <Button type='submit' loading={loading} style={{ width: '100%' }} disabled={loading || Object.keys(fieldErrors).length > 0 || !nombre || !email || !password || !confirm}>
          Registrar
        </Button>
      </form>
    </div>
  );
};

export default RegisterAdmin; 