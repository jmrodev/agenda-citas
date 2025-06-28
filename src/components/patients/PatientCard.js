import React from 'react';
import { formatDate, getStatusColor } from '../../utils/patientUtils';

const PatientCard = ({ paciente, onPatientClick, onEditPatient, onDeletePatient }) => {
  return (
    <div
      onClick={() => onPatientClick(paciente)}
      style={{
        background: 'white',
        border: `2px solid ${getStatusColor(paciente)}`,
        borderRadius: '12px',
        padding: '1rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '0.5rem'
      }}>
        <h3 style={{
          margin: 0,
          color: '#2c3e50',
          fontSize: '1.1rem',
          fontWeight: '600'
        }}>
          {paciente.nombre}
        </h3>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: getStatusColor(paciente)
        }} />
      </div>
      
      <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
        <p style={{ margin: '0.25rem 0' }}>
          📅 Total citas: <strong>{paciente.totalCitas}</strong>
        </p>
        <p style={{ margin: '0.25rem 0' }}>
          🕒 Última visita: <strong>{formatDate(paciente.ultimaVisita)}</strong>
        </p>
        {paciente.proximaCita && (
          <p style={{ margin: '0.25rem 0' }}>
            ⏰ Próxima cita: <strong>{formatDate(paciente.proximaCita)}</strong>
          </p>
        )}
      </div>
      
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginTop: '0.5rem'
      }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEditPatient(paciente);
          }}
          style={{
            background: '#2196f3',
            color: 'white',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          ✏️ Editar
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeletePatient(paciente.id);
          }}
          style={{
            background: '#f44336',
            color: 'white',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
};

export default PatientCard; 