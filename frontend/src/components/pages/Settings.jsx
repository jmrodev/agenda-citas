import React, { useState, useEffect } from 'react';
// import DashboardLayout from '../templates/DashboardLayout/DashboardLayout'; // Importar DashboardLayout
import { authFetch } from '../../auth/authFetch';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    theme: 'light',
    language: 'es'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Cargar configuración del usuario
    const loadSettings = async () => {
      try {
        const res = await authFetch('/api/auth/user/config');
        if (res.ok) {
          const data = await res.json();
          setSettings({
            notifications: data.notifications ?? true,
            theme: data.theme ?? 'light',
            language: data.language ?? 'es'
          });
        }
      } catch (error) {
        console.error('Error cargando configuración:', error);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/auth/user/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setMessage('Configuración guardada exitosamente');
      } else {
        setMessage('Error al guardar configuración');
      }
    } catch (error) {
      setMessage('Error al guardar configuración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Configuración</h2>
      {/* El título h2 ya no es necesario aquí si DashboardLayout lo provee o si el título de la página es suficiente */}
      
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3>Notificaciones</h3>
          <label>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
            />
            Recibir notificaciones
          </label>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3>Tema</h3>
          <select
            value={settings.theme}
            onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
          >
            <option value="light">Claro</option>
            <option value="dark">Oscuro</option>
          </select>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3>Idioma</h3>
          <select
            value={settings.language}
            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>

        {message && (
          <div style={{ 
            padding: '1rem', 
            marginBottom: '1rem', 
            borderRadius: '4px',
            backgroundColor: message.includes('Error') ? '#ffebee' : '#e8f5e8',
            color: message.includes('Error') ? '#c62828' : '#2e7d32'
          }}>
            {message}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary-color, #1976d2)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Guardando...' : 'Guardar configuración'}
        </button>
      </div>
    </div>
  );
};

export default Settings; 