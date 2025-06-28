import React from 'react';

const PatientsDashboard = ({ estadisticas, onAddPatient }) => {
  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{
          color: '#2c3e50',
          fontSize: '2rem',
          fontWeight: '700',
          margin: 0
        }}>
          👥 Gestión de Pacientes
        </h1>
        <button
          onClick={onAddPatient}
          style={{
            background: '#2196f3',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          ➕ Agregar Paciente
        </button>
      </div>

      {/* Estadísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: '#e3f2fd',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>Total</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{estadisticas.total}</p>
        </div>
        <div style={{
          background: '#e8f5e8',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#388e3c' }}>Activos</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{estadisticas.activos}</p>
        </div>
        <div style={{
          background: '#fff3e0',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#f57c00' }}>Inactivos</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{estadisticas.inactivos}</p>
        </div>
        <div style={{
          background: '#ffebee',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#d32f2f' }}>Asistencia Tardía</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{estadisticas.asistenciaTardia}</p>
        </div>
      </div>
    </div>
  );
};

export default PatientsDashboard; 