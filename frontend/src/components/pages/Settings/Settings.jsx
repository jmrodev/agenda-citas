import React, { useEffect, useState } from 'react';
import Button from '../../atoms/Button/Button'; // Adjusted path
import Header from '../../organisms/Header/Header.jsx'; // Adjusted path
import styles from './Settings.module.css'; // This path will be correct after move

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
    <>
      <Header />
      <div className={styles.container}>
        <h2>Configuración</h2>
        <form onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label htmlFor='timeout'>Tiempo de cierre de sesión por inactividad (minutos):</label>
            <input
              id='timeout'
              type='number'
              min={1}
              value={timeout}
              onChange={e => setTimeoutValue(Number(e.target.value))}
              className={styles.inputField}
              required
            />
          </div>
          <Button type='submit' disabled={loading}>Guardar</Button>
          {success && <div className={styles.successMessage}>Guardado correctamente</div>}
          {error && <div className={styles.errorMessage}>{error}</div>}
        </form>
      </div>
    </>
  );
};

export default Settings; 