import React, { useEffect, useState } from 'react';
import Button from '../atoms/Button/Button';
import DashboardLayout from '../templates/DashboardLayout/DashboardLayout'; // Importar DashboardLayout
import FormField from '../molecules/FormField/FormField'; // Importar FormField
import Alert from '../atoms/Alert/Alert'; // Importar Alert
import styles from './Settings.module.css'; // Importar CSS Module

const Settings = () => {
  const [timeout, setTimeoutValue] = useState(15);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/auth/user/config', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setTimeoutValue(data.session_timeout_minutes || 15);
      } catch (err) {
        setError('Error al cargar configuración');
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/user/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ session_timeout_minutes: timeout })
      });
      if (!res.ok) throw new Error('Error al guardar');
      setSuccess(true);
    } catch (err) {
      setError('Error al guardar configuración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Configuración">
      <div className={styles.settingsContainer}>
        {/* El título h2 ya no es necesario aquí si DashboardLayout lo provee o si el título de la página es suficiente */}
        <form onSubmit={handleSave} className={styles.form}>
          <FormField
            label="Tiempo de cierre de sesión por inactividad (minutos):"
            id="timeout"
            type="number"
            min={1}
            value={timeout}
            onChange={e => setTimeoutValue(Number(e.target.value))}
            required
            // El estilo del input ahora debería ser manejado por el átomo Input y FormField
          />
          <Button type='submit' loading={loading} disabled={loading}>Guardar</Button> {/* Removido disabled duplicado */}
          {success && <Alert type="success">Guardado correctamente</Alert>}
          {error && <Alert type="error">{error}</Alert>}
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Settings; 