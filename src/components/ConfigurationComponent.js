import React, { useState, useEffect } from 'react';

const ConfigurationComponent = () => {
  const [config, setConfig] = useState({
    duracionCita: 60, // minutos
    horarioInicio: '08:00',
    horarioFin: '18:00',
    intervaloCitas: 0, // minutos entre citas (permite 0)
    diasLaborables: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'],
    recordatorioCita: 24, // horas antes
    maxCitasPorDia: 20,
    tiempoDescanso: 0, // minutos (permite 0)
    mostrarNotas: true,
    confirmarEliminacion: true,
    // Nuevas configuraciones de control de asistencia
    periodoAlertaAsistencia: 30, // días sin asistir para generar alerta
    periodoCriticoAsistencia: 60, // días sin asistir para alerta crítica
    permitirSobreturno: true, // permite exceder máximo de citas por día
    maxSobreturnos: 5 // máximo de sobreturnos permitidos por día
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempConfig, setTempConfig] = useState({});

  useEffect(() => {
    // Cargar configuración desde localStorage
    const savedConfig = localStorage.getItem('appConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleSave = () => {
    setConfig(tempConfig);
    localStorage.setItem('appConfig', JSON.stringify(tempConfig));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempConfig(config);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setTempConfig({ ...config });
    setIsEditing(true);
  };

  const diasSemana = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miércoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sábado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          borderBottom: '2px solid #e9ecef',
          paddingBottom: '1rem'
        }}>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>
            ⚙️ Configuración del Sistema
          </h1>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              ✏️ Editar Configuración
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleSave}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                💾 Guardar
              </button>
              <button
                onClick={handleCancel}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                ❌ Cancelar
              </button>
            </div>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem'
        }}>
          {/* Configuración de Citas */}
          <div style={{
            background: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>
              📅 Configuración de Citas
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#2c3e50'
              }}>
                Duración de Cita (minutos):
              </label>
              <input
                type="number"
                value={isEditing ? tempConfig.duracionCita : config.duracionCita}
                onChange={(e) => isEditing && setTempConfig({
                  ...tempConfig,
                  duracionCita: parseInt(e.target.value) || 60
                })}
                disabled={!isEditing}
                min="15"
                max="180"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  backgroundColor: isEditing ? 'white' : '#f8f9fa'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#2c3e50'
              }}>
                Intervalo entre Citas (minutos):
              </label>
              <input
                type="number"
                value={isEditing ? tempConfig.intervaloCitas : config.intervaloCitas}
                onChange={(e) => isEditing && setTempConfig({
                  ...tempConfig,
                  intervaloCitas: parseInt(e.target.value) || 0
                })}
                disabled={!isEditing}
                min="0"
                max="60"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  backgroundColor: isEditing ? 'white' : '#f8f9fa'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#2c3e50'
              }}>
                Máximo de Citas por Día:
              </label>
              <input
                type="number"
                value={isEditing ? tempConfig.maxCitasPorDia : config.maxCitasPorDia}
                onChange={(e) => isEditing && setTempConfig({
                  ...tempConfig,
                  maxCitasPorDia: parseInt(e.target.value) || 20
                })}
                disabled={!isEditing}
                min="1"
                max="50"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  backgroundColor: isEditing ? 'white' : '#f8f9fa'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                cursor: isEditing ? 'pointer' : 'default'
              }}>
                <input
                  type="checkbox"
                  checked={isEditing ? tempConfig.permitirSobreturno : config.permitirSobreturno}
                  onChange={(e) => isEditing && setTempConfig({
                    ...tempConfig,
                    permitirSobreturno: e.target.checked
                  })}
                  disabled={!isEditing}
                  style={{
                    marginRight: '0.5rem',
                    transform: 'scale(1.2)'
                  }}
                />
                <span style={{ color: '#2c3e50' }}>Permitir sobreturnos</span>
              </label>
            </div>

            {config.permitirSobreturno && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#2c3e50'
                }}>
                  Máximo de Sobreturnos por Día:
                </label>
                <input
                  type="number"
                  value={isEditing ? tempConfig.maxSobreturnos : config.maxSobreturnos}
                  onChange={(e) => isEditing && setTempConfig({
                    ...tempConfig,
                    maxSobreturnos: parseInt(e.target.value) || 5
                  })}
                  disabled={!isEditing}
                  min="1"
                  max="20"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e9ecef',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    backgroundColor: isEditing ? 'white' : '#f8f9fa'
                  }}
                />
              </div>
            )}
          </div>

          {/* Horarios */}
          <div style={{
            background: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>
              🕐 Horarios de Atención
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#2c3e50'
              }}>
                Hora de Inicio:
              </label>
              <input
                type="time"
                value={isEditing ? tempConfig.horarioInicio : config.horarioInicio}
                onChange={(e) => isEditing && setTempConfig({
                  ...tempConfig,
                  horarioInicio: e.target.value
                })}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  backgroundColor: isEditing ? 'white' : '#f8f9fa'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#2c3e50'
              }}>
                Hora de Fin:
              </label>
              <input
                type="time"
                value={isEditing ? tempConfig.horarioFin : config.horarioFin}
                onChange={(e) => isEditing && setTempConfig({
                  ...tempConfig,
                  horarioFin: e.target.value
                })}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  backgroundColor: isEditing ? 'white' : '#f8f9fa'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#2c3e50'
              }}>
                Tiempo de Descanso (minutos):
              </label>
              <input
                type="number"
                value={isEditing ? tempConfig.tiempoDescanso : config.tiempoDescanso}
                onChange={(e) => isEditing && setTempConfig({
                  ...tempConfig,
                  tiempoDescanso: parseInt(e.target.value) || 0
                })}
                disabled={!isEditing}
                min="0"
                max="120"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  backgroundColor: isEditing ? 'white' : '#f8f9fa'
                }}
              />
            </div>
          </div>

          {/* Días Laborables */}
          <div style={{
            background: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>
              📅 Días Laborables
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {diasSemana.map(dia => (
                <label key={dia.key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: isEditing ? 'pointer' : 'default'
                }}>
                  <input
                    type="checkbox"
                    checked={isEditing 
                      ? tempConfig.diasLaborables.includes(dia.key)
                      : config.diasLaborables.includes(dia.key)
                    }
                    onChange={(e) => {
                      if (isEditing) {
                        const newDias = e.target.checked
                          ? [...tempConfig.diasLaborables, dia.key]
                          : tempConfig.diasLaborables.filter(d => d !== dia.key);
                        setTempConfig({
                          ...tempConfig,
                          diasLaborables: newDias
                        });
                      }
                    }}
                    disabled={!isEditing}
                    style={{
                      marginRight: '0.5rem',
                      transform: 'scale(1.2)'
                    }}
                  />
                  <span style={{ color: '#2c3e50' }}>{dia.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Configuración de Notificaciones */}
          <div style={{
            background: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>
              🔔 Notificaciones
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#2c3e50'
              }}>
                Recordatorio de Cita (horas antes):
              </label>
              <input
                type="number"
                value={isEditing ? tempConfig.recordatorioCita : config.recordatorioCita}
                onChange={(e) => isEditing && setTempConfig({
                  ...tempConfig,
                  recordatorioCita: parseInt(e.target.value) || 24
                })}
                disabled={!isEditing}
                min="1"
                max="168"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  backgroundColor: isEditing ? 'white' : '#f8f9fa'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                cursor: isEditing ? 'pointer' : 'default'
              }}>
                <input
                  type="checkbox"
                  checked={isEditing ? tempConfig.mostrarNotas : config.mostrarNotas}
                  onChange={(e) => isEditing && setTempConfig({
                    ...tempConfig,
                    mostrarNotas: e.target.checked
                  })}
                  disabled={!isEditing}
                  style={{
                    marginRight: '0.5rem',
                    transform: 'scale(1.2)'
                  }}
                />
                <span style={{ color: '#2c3e50' }}>Mostrar notas en citas</span>
              </label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                cursor: isEditing ? 'pointer' : 'default'
              }}>
                <input
                  type="checkbox"
                  checked={isEditing ? tempConfig.confirmarEliminacion : config.confirmarEliminacion}
                  onChange={(e) => isEditing && setTempConfig({
                    ...tempConfig,
                    confirmarEliminacion: e.target.checked
                  })}
                  disabled={!isEditing}
                  style={{
                    marginRight: '0.5rem',
                    transform: 'scale(1.2)'
                  }}
                />
                <span style={{ color: '#2c3e50' }}>Confirmar eliminación de citas</span>
              </label>
            </div>
          </div>

          {/* Control de Asistencia */}
          <div style={{
            background: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>
              📋 Control de Asistencia
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#2c3e50'
              }}>
                Período de Alerta (días sin asistir):
              </label>
              <input
                type="number"
                value={isEditing ? tempConfig.periodoAlertaAsistencia : config.periodoAlertaAsistencia}
                onChange={(e) => isEditing && setTempConfig({
                  ...tempConfig,
                  periodoAlertaAsistencia: parseInt(e.target.value) || 30
                })}
                disabled={!isEditing}
                min="7"
                max="365"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  backgroundColor: isEditing ? 'white' : '#f8f9fa'
                }}
              />
              <small style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                Después de este período se mostrará una alerta amarilla
              </small>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#2c3e50'
              }}>
                Período Crítico (días sin asistir):
              </label>
              <input
                type="number"
                value={isEditing ? tempConfig.periodoCriticoAsistencia : config.periodoCriticoAsistencia}
                onChange={(e) => isEditing && setTempConfig({
                  ...tempConfig,
                  periodoCriticoAsistencia: parseInt(e.target.value) || 60
                })}
                disabled={!isEditing}
                min="15"
                max="365"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  backgroundColor: isEditing ? 'white' : '#f8f9fa'
                }}
              />
              <small style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                Después de este período se mostrará una alerta roja
              </small>
            </div>
          </div>
        </div>

        {/* Resumen de Configuración */}
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '8px',
          color: 'white'
        }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>📊 Resumen de Configuración</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div>
              <strong>Duración de Cita:</strong> {config.duracionCita} minutos
            </div>
            <div>
              <strong>Horario:</strong> {config.horarioInicio} - {config.horarioFin}
            </div>
            <div>
              <strong>Días Laborables:</strong> {config.diasLaborables.length} días
            </div>
            <div>
              <strong>Máximo Citas/Día:</strong> {config.maxCitasPorDia}
            </div>
            <div>
              <strong>Sobreturnos:</strong> {config.permitirSobreturno ? 'Permitidos' : 'No permitidos'}
            </div>
            <div>
              <strong>Alerta Asistencia:</strong> {config.periodoAlertaAsistencia} días
            </div>
            <div>
              <strong>Crítico Asistencia:</strong> {config.periodoCriticoAsistencia} días
            </div>
            <div>
              <strong>Intervalo Citas:</strong> {config.intervaloCitas} minutos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationComponent; 