import React, { useState } from 'react';

const DataInfoComponent = () => {
  const [showDetails, setShowDetails] = useState(false);

  const getStorageInfo = () => {
    const citas = localStorage.getItem('citas');
    const pacientes = localStorage.getItem('patients');
    const config = localStorage.getItem('appConfig');
    const obrasSociales = localStorage.getItem('obrasSociales');

    return {
      citas: citas ? JSON.parse(citas).length : 0,
      pacientes: pacientes ? JSON.parse(pacientes).length : 0,
      config: config ? 'Configurado' : 'No configurado',
      obrasSociales: obrasSociales ? JSON.parse(obrasSociales).length : 0,
      totalSize: new Blob([
        citas || '',
        pacientes || '',
        config || '',
        obrasSociales || ''
      ]).size
    };
  };

  const storageInfo = getStorageInfo();

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        borderBottom: '2px solid #e9ecef',
        paddingBottom: '1rem'
      }}>
        <h2 style={{ margin: 0, color: '#2c3e50' }}>
          💾 Información de Almacenamiento
        </h2>
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          {showDetails ? '🔽 Ocultar Detalles' : '🔼 Ver Detalles'}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          background: '#f8f9fa',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#667eea',
            marginBottom: '0.5rem'
          }}>
            {storageInfo.citas}
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#6c757d',
            fontWeight: '500'
          }}>
            Citas Guardadas
          </div>
        </div>

        <div style={{
          background: '#f8f9fa',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#28a745',
            marginBottom: '0.5rem'
          }}>
            {storageInfo.pacientes}
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#6c757d',
            fontWeight: '500'
          }}>
            Pacientes Registrados
          </div>
        </div>

        <div style={{
          background: '#f8f9fa',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#ffc107',
            marginBottom: '0.5rem'
          }}>
            {storageInfo.obrasSociales}
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#6c757d',
            fontWeight: '500'
          }}>
            Obras Sociales
          </div>
        </div>

        <div style={{
          background: '#f8f9fa',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#6c757d',
            marginBottom: '0.5rem'
          }}>
            {(storageInfo.totalSize / 1024).toFixed(2)} KB
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#6c757d',
            fontWeight: '500'
          }}>
            Tamaño Total
          </div>
        </div>
      </div>

      {showDetails && (
        <div style={{
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            color: '#2c3e50',
            fontSize: '1.1rem'
          }}>
            📍 Ubicación de los Datos
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}>
            <div>
              <h4 style={{
                margin: '0 0 0.5rem 0',
                color: '#2c3e50',
                fontSize: '1rem'
              }}>
                🖥️ Frontend (localStorage)
              </h4>
              <ul style={{
                margin: 0,
                paddingLeft: '1.5rem',
                fontSize: '0.9rem',
                color: '#6c757d'
              }}>
                <li>Pacientes: <code>localStorage.getItem('patients')</code></li>
                <li>Configuración: <code>localStorage.getItem('appConfig')</code></li>
                <li>Obras Sociales: <code>localStorage.getItem('obrasSociales')</code></li>
                <li>Citas temporales: <code>localStorage.getItem('citas')</code></li>
              </ul>
            </div>

            <div>
              <h4 style={{
                margin: '0 0 0.5rem 0',
                color: '#2c3e50',
                fontSize: '1rem'
              }}>
                🖥️ Backend (JSON)
              </h4>
              <ul style={{
                margin: 0,
                paddingLeft: '1.5rem',
                fontSize: '0.9rem',
                color: '#6c757d'
              }}>
                <li>Citas: <code>/public/citas.json</code></li>
                <li>Servidor: <code>http://localhost:3001</code></li>
                <li>API: <code>/api/citas</code></li>
              </ul>
            </div>
          </div>

          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#e7f3ff',
            borderRadius: '6px',
            border: '1px solid #b3d9ff'
          }}>
            <h4 style={{
              margin: '0 0 0.5rem 0',
              color: '#0056b3',
              fontSize: '1rem'
            }}>
              ℹ️ Información Importante
            </h4>
            <ul style={{
              margin: 0,
              paddingLeft: '1.5rem',
              fontSize: '0.9rem',
              color: '#0056b3'
            }}>
              <li>Los <strong>pacientes</strong> se guardan en el navegador (localStorage)</li>
              <li>Las <strong>citas</strong> se guardan en el servidor backend</li>
              <li>La <strong>configuración</strong> se guarda en el navegador</li>
              <li>Los datos se mantienen entre sesiones del navegador</li>
              <li>Para respaldo, exporta los datos desde la página de Datos</li>
            </ul>
          </div>

          <div style={{
            marginTop: '1rem',
            display: 'flex',
            gap: '1rem'
          }}>
            <button
              onClick={() => {
                const data = {
                  pacientes: localStorage.getItem('patients'),
                  config: localStorage.getItem('appConfig'),
                  obrasSociales: localStorage.getItem('obrasSociales'),
                  citas: localStorage.getItem('citas')
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              💾 Exportar Datos
            </button>

            <button
              onClick={() => {
                if (window.confirm('¿Estás seguro de que quieres limpiar todos los datos? Esta acción no se puede deshacer.')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              style={{
                background: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              🗑️ Limpiar Datos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataInfoComponent; 