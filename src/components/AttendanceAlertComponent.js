import React, { useState, useEffect, useCallback } from 'react';

const AttendanceAlertComponent = ({ citas }) => {
  const [config, setConfig] = useState({
    periodoAlertaAsistencia: 30,
    periodoCriticoAsistencia: 60
  });
  const [pacientesConAlerta, setPacientesConAlerta] = useState([]);

  useEffect(() => {
    // Cargar configuración
    const savedConfig = localStorage.getItem('appConfig');
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      setConfig({
        periodoAlertaAsistencia: parsedConfig.periodoAlertaAsistencia || 30,
        periodoCriticoAsistencia: parsedConfig.periodoCriticoAsistencia || 60
      });
    }
  }, []);

  const calcularAlertasAsistencia = useCallback(() => {
    const hoy = new Date();
    const pacientesMap = new Map();

    // Agrupar citas por paciente
    citas.forEach(cita => {
      const pacienteId = cita.patient || cita.title;
      if (!pacientesMap.has(pacienteId)) {
        pacientesMap.set(pacienteId, {
          id: pacienteId,
          nombre: pacienteId,
          citas: []
        });
      }
      pacientesMap.get(pacienteId).citas.push(cita);
    });

    const alertas = [];

    pacientesMap.forEach(paciente => {
      // Ordenar citas por fecha (más reciente primero)
      const citasOrdenadas = paciente.citas
        .map(cita => ({
          ...cita,
          start: new Date(cita.start)
        }))
        .sort((a, b) => b.start - a.start);

      if (citasOrdenadas.length > 0) {
        const ultimaCita = citasOrdenadas[0];
        const diasSinAsistir = Math.floor((hoy - ultimaCita.start) / (1000 * 60 * 60 * 24));

        let nivelAlerta = null;
        if (diasSinAsistir >= config.periodoCriticoAsistencia) {
          nivelAlerta = 'critico';
        } else if (diasSinAsistir >= config.periodoAlertaAsistencia) {
          nivelAlerta = 'alerta';
        }

        if (nivelAlerta) {
          alertas.push({
            ...paciente,
            ultimaCita: ultimaCita,
            diasSinAsistir: diasSinAsistir,
            nivelAlerta: nivelAlerta
          });
        }
      }
    });

    // Ordenar por días sin asistir (más críticos primero)
    alertas.sort((a, b) => b.diasSinAsistir - a.diasSinAsistir);
    setPacientesConAlerta(alertas);
  }, [citas, config]);

  useEffect(() => {
    if (citas && citas.length > 0) {
      calcularAlertasAsistencia();
    }
  }, [citas, config, calcularAlertasAsistencia]);

  if (pacientesConAlerta.length === 0) {
    return null;
  }

  const pacientesCriticos = pacientesConAlerta.filter(p => p.nivelAlerta === 'critico');
  const pacientesAlerta = pacientesConAlerta.filter(p => p.nivelAlerta === 'alerta');

  return (
    <div style={{
      background: '#fff3cd',
      border: '1px solid #ffeaa7',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1.5rem'
    }}>
      <h4 style={{
        margin: '0 0 1rem 0',
        fontSize: '0.9rem',
        color: '#856404',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        ⚠️ Alertas de Asistencia
      </h4>

      {pacientesCriticos.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <h5 style={{
            margin: '0 0 0.5rem 0',
            fontSize: '0.8rem',
            color: '#721c24',
            fontWeight: '600'
          }}>
            🔴 Crítico ({pacientesCriticos.length})
          </h5>
          {pacientesCriticos.slice(0, 3).map(paciente => (
            <div key={paciente.id} style={{
              background: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '4px',
              padding: '0.5rem',
              marginBottom: '0.5rem',
              fontSize: '0.8rem'
            }}>
              <div style={{ fontWeight: '600', color: '#721c24' }}>
                {paciente.nombre}
              </div>
              <div style={{ color: '#721c24', fontSize: '0.75rem' }}>
                {paciente.diasSinAsistir} días sin asistir
              </div>
              <div style={{ color: '#721c24', fontSize: '0.7rem' }}>
                Última: {paciente.ultimaCita.start.toLocaleDateString('es-ES')}
              </div>
            </div>
          ))}
          {pacientesCriticos.length > 3 && (
            <div style={{
              fontSize: '0.75rem',
              color: '#721c24',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              +{pacientesCriticos.length - 3} más...
            </div>
          )}
        </div>
      )}

      {pacientesAlerta.length > 0 && (
        <div>
          <h5 style={{
            margin: '0 0 0.5rem 0',
            fontSize: '0.8rem',
            color: '#856404',
            fontWeight: '600'
          }}>
            🟡 Alerta ({pacientesAlerta.length})
          </h5>
          {pacientesAlerta.slice(0, 2).map(paciente => (
            <div key={paciente.id} style={{
              background: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '4px',
              padding: '0.5rem',
              marginBottom: '0.5rem',
              fontSize: '0.8rem'
            }}>
              <div style={{ fontWeight: '600', color: '#856404' }}>
                {paciente.nombre}
              </div>
              <div style={{ color: '#856404', fontSize: '0.75rem' }}>
                {paciente.diasSinAsistir} días sin asistir
              </div>
            </div>
          ))}
          {pacientesAlerta.length > 2 && (
            <div style={{
              fontSize: '0.75rem',
              color: '#856404',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              +{pacientesAlerta.length - 2} más...
            </div>
          )}
        </div>
      )}

      <div style={{
        marginTop: '1rem',
        paddingTop: '0.5rem',
        borderTop: '1px solid #ffeaa7',
        textAlign: 'center'
      }}>
        <button
          onClick={() => window.location.href = '#patients'}
          style={{
            background: '#856404',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: '500'
          }}
        >
          📋 Ver Todos los Pacientes
        </button>
      </div>
    </div>
  );
};

export default AttendanceAlertComponent; 