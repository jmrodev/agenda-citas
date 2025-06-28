import React from 'react';
import { formatDate } from '../../utils/patientUtils';

const PatientDetailsModal = ({ paciente, onClose, onEditPatient }) => {
  if (!paciente) return null;

  // Fallbacks seguros
  const totalCitas = paciente.totalCitas ?? (paciente.citas ? paciente.citas.length : 0);
  const ultimaVisita = paciente.ultimaVisita ? formatDate(paciente.ultimaVisita) : 'Nunca';
  const proximaCita = paciente.proximaCita ? formatDate(paciente.proximaCita) : 'Nunca';
  const citas = Array.isArray(paciente.citas) ? paciente.citas : [];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '800px',
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ✕
        </button>
        
        <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          📋 Detalles de {paciente.nombre || 'Paciente'}
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h3>📊 Información General</h3>
            <p><strong>Total de citas:</strong> {totalCitas}</p>
            <p><strong>Última visita:</strong> {ultimaVisita}</p>
            <p><strong>Próxima cita:</strong> {proximaCita}</p>
          </div>
          
          <div>
            <h3>📅 Historial de Citas</h3>
            <div style={{
              maxHeight: '200px',
              overflow: 'auto',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '0.5rem'
            }}>
              {citas.length === 0 ? (
                <div style={{ color: '#888', textAlign: 'center', padding: '1rem' }}>
                  No hay citas registradas para este paciente.
                </div>
              ) : (
                citas
                  .sort((a, b) => new Date(b.start) - new Date(a.start))
                  .slice(0, 10)
                  .map((cita, index) => (
                    <div key={index} style={{
                      padding: '0.5rem',
                      borderBottom: index < Math.min(citas.length - 1, 9) ? '1px solid #f0f0f0' : 'none',
                      fontSize: '0.9rem'
                    }}>
                      <strong>{formatDate(cita.start)}</strong> - {cita.title || 'Sin título'}
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => onEditPatient(paciente)}
            style={{
              background: '#2196f3',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            ✏️ Editar Paciente
          </button>
          <button
            onClick={onClose}
            style={{
              background: '#666',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsModal; 