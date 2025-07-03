import React, { useEffect, useState } from 'react';
import Button from '../atoms/Button/Button';
import Header from '../organisms/Header/Header.jsx';

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
      <div style={{ maxWidth: 400, margin: '2rem auto', background: 'var(--surface, #fff)', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '2rem' }}>
        <h2>Configuración</h2>
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor='timeout'>Tiempo de cierre de sesión por inactividad (minutos):</label>
            <input
              id='timeout'
              type='number'
              min={1}
              value={timeout}
              onChange={e => setTimeoutValue(Number(e.target.value))}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
              required
            />
          </div>
          <Button type='submit' disabled={loading}>Guardar</Button>
          {success && <div style={{ color: 'green', marginTop: 8 }}>Guardado correctamente</div>}
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </form>
      </div>
    </>
  );
};

export default Settings; 