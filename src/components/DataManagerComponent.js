// DataManagerComponent.js
import React, { useState } from 'react';
import { exportarCitasAJSON, importarCitasDesdeJSON, cargarCitasDesdeLocalStorage } from '../services/citasService';

const DataManagerComponent = ({ onDataChange }) => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const success = await exportarCitasAJSON();
      if (success) {
        alert('Citas exportadas exitosamente a citas.json');
      } else {
        alert('Error al exportar las citas');
      }
    } catch (error) {
      console.error('Error en exportación:', error);
      alert('Error al exportar las citas');
    } finally {
      setExporting(false);
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImporting(true);
    importarCitasDesdeJSON(file)
      .then((citas) => {
        alert(`Citas importadas exitosamente: ${citas.length} citas`);
        if (onDataChange) {
          onDataChange(citas);
        }
      })
      .catch((error) => {
        console.error('Error en importación:', error);
        alert('Error al importar las citas: ' + error.message);
      })
      .finally(() => {
        setImporting(false);
        event.target.value = ''; // Limpiar el input
      });
  };

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que quieres resetear todas las citas? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('citas');
      alert('Citas reseteadas. La página se recargará.');
      window.location.reload();
    }
  };

  const getDataStatus = () => {
    try {
      const citas = cargarCitasDesdeLocalStorage();
      return {
        count: citas.length,
        lastModified: localStorage.getItem('citas_lastModified') || 'Nunca'
      };
    } catch (error) {
      return { count: 0, lastModified: 'Error' };
    }
  };

  const status = getDataStatus();

  return (
    <div className="data-manager" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <h3 style={{
        margin: '0 0 1rem 0',
        color: '#2c3e50',
        fontSize: '1.2rem',
        fontWeight: '600',
        textAlign: 'center'
      }}>
        💾 Gestión de Datos
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <div style={{
          padding: '1rem',
          background: '#e3f2fd',
          borderRadius: '8px',
          border: '1px solid #bbdefb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1976d2' }}>
            {status.count}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#424242' }}>
            Citas Guardadas
          </div>
        </div>
        
        <div style={{
          padding: '1rem',
          background: '#f3e5f5',
          borderRadius: '8px',
          border: '1px solid #e1bee7',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#7b1fa2' }}>
            Última Modificación
          </div>
          <div style={{ fontSize: '0.8rem', color: '#424242' }}>
            {status.lastModified}
          </div>
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button 
          onClick={handleExport}
          disabled={exporting}
          style={{
            padding: '10px 20px',
            background: exporting ? '#6c757d' : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: exporting ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
        >
          {exporting ? '⏳ Exportando...' : '📤 Exportar a JSON'}
        </button>
        
        <label style={{
          padding: '10px 20px',
          background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: importing ? 'not-allowed' : 'pointer',
          fontSize: '0.9rem',
          fontWeight: '500',
          transition: 'all 0.3s ease',
          display: 'inline-block'
        }}>
          {importing ? '⏳ Importando...' : '📥 Importar desde JSON'}
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            disabled={importing}
            style={{ display: 'none' }}
          />
        </label>
        
        <button 
          onClick={handleReset}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
        >
          🔄 Resetear Datos
        </button>
      </div>
      
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: '#fff3cd',
        borderRadius: '8px',
        border: '1px solid #ffeaa7',
        fontSize: '0.9rem',
        color: '#856404'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
          💡 Información sobre la Persistencia
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Los datos se guardan automáticamente en el navegador (localStorage)</li>
          <li>Puedes exportar tus citas a un archivo JSON</li>
          <li>Puedes importar citas desde un archivo JSON</li>
          <li>Los datos persisten entre sesiones del navegador</li>
        </ul>
      </div>
    </div>
  );
};

export default DataManagerComponent; 