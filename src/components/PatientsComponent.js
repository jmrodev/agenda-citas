// PatientsComponent.js
import React, { useState, useEffect } from 'react';
import { 
  cargarPacientesDesdeBackend, 
  guardarPacientesEnBackend,
  agregarPacienteAlBackend,
  actualizarPacienteEnBackend,
  eliminarPacienteDelBackend,
  extraerPacientesDeCitas
} from '../services/patientsService';

const PatientsComponent = ({ citas }) => {
  const [patients, setPatients] = useState([]);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [edadCalculada, setEdadCalculada] = useState(null);

  // Función para calcular la edad
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return edad;
  };

  // Función para calcular días sin asistir
  const calcularDiasSinAsistir = (appointments) => {
    if (!appointments || appointments.length === 0) return null;
    
    const hoy = new Date();
    const citasPasadas = appointments
      .map(apt => new Date(apt.start))
      .filter(fecha => fecha < hoy)
      .sort((a, b) => b - a);
    
    if (citasPasadas.length === 0) return null;
    
    const ultimaCita = citasPasadas[0];
    return Math.floor((hoy - ultimaCita) / (1000 * 60 * 60 * 24));
  };

  // Función para obtener nivel de alerta de asistencia
  const obtenerNivelAlerta = (diasSinAsistir) => {
    if (!diasSinAsistir) return null;
    
    // Cargar configuración
    const savedConfig = localStorage.getItem('appConfig');
    const config = savedConfig ? JSON.parse(savedConfig) : {
      periodoAlertaAsistencia: 30,
      periodoCriticoAsistencia: 60
    };
    
    if (diasSinAsistir >= config.periodoCriticoAsistencia) {
      return 'critico';
    } else if (diasSinAsistir >= config.periodoAlertaAsistencia) {
      return 'alerta';
    }
    
    return null;
  };

  useEffect(() => {
    console.log('PatientsComponent: Citas recibidas:', citas);
    console.log('PatientsComponent: Tipo de citas:', typeof citas);
    console.log('PatientsComponent: Longitud de citas:', citas ? citas.length : 'null/undefined');
    
    // Intentar cargar pacientes desde backend primero
    const savedPatients = cargarPacientesDesdeBackend();
    if (savedPatients && savedPatients.length > 0) {
      console.log('PatientsComponent: Pacientes cargados desde backend:', savedPatients);
      setPatients(savedPatients);
    } else {
      // Si no hay pacientes guardados, extraer de las citas
      const patientsArray = extraerPacientesDeCitas(citas);
      console.log('PatientsComponent: Pacientes extraídos de citas:', patientsArray);
      console.log('PatientsComponent: Número de pacientes:', patientsArray.length);
      setPatients(patientsArray);
      // Guardar en backend
      guardarPacientesEnBackend(patientsArray);
    }
  }, [citas]);

  // Guardar pacientes en backend cuando cambien
  useEffect(() => {
    if (patients.length > 0) {
      guardarPacientesEnBackend(patients);
      console.log('PatientsComponent: Pacientes guardados en backend:', patients);
    }
  }, [patients]);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = () => {
    setShowAddPatient(true);
    setEditingPatient(null);
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setShowAddPatient(true);
  };

  const handleSavePatient = (patientData) => {
    if (editingPatient) {
      // Actualizar paciente existente usando el servicio
      const pacienteActualizado = actualizarPacienteEnBackend(editingPatient.id, patientData);
      if (pacienteActualizado) {
        setPatients(patients.map(p => 
          p.id === editingPatient.id ? pacienteActualizado : p
        ));
      }
    } else {
      // Agregar nuevo paciente usando el servicio
      const nuevoPaciente = agregarPacienteAlBackend(patientData);
      if (nuevoPaciente) {
        setPatients([...patients, nuevoPaciente]);
      }
    }
    setShowAddPatient(false);
    setEditingPatient(null);
  };

  const handleDeletePatient = (patientId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este paciente?')) {
      const eliminado = eliminarPacienteDelBackend(patientId);
      if (eliminado) {
        setPatients(patients.filter(p => p.id !== patientId));
        setShowPatientDetails(false);
        setSelectedPatient(null);
      }
    }
  };

  const handleViewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  const handleCloseDetails = () => {
    setShowPatientDetails(false);
    setSelectedPatient(null);
  };

  const handlePhoneClick = (phone) => {
    setSelectedPhone(phone);
    setShowPhoneModal(true);
  };

  const handleAddressClick = (address) => {
    setSelectedAddress(address);
    setShowMapModal(true);
  };

  const handleEmailClick = (email) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const handleClosePhoneModal = () => {
    setShowPhoneModal(false);
    setSelectedPhone('');
  };

  const handleCloseMapModal = () => {
    setShowMapModal(false);
    setSelectedAddress('');
  };

  // Calcular estadísticas
  const totalPatients = patients.length;
  const totalAppointments = patients.reduce((total, patient) => total + patient.totalVisits, 0);
  const averageVisits = totalPatients > 0 ? (totalAppointments / totalPatients).toFixed(1) : 0;
  
  // Calcular edad promedio
  const edades = patients
    .map(patient => {
      const fechaNac = patient.appointments?.[0]?.patientInfo?.fechaNacimiento;
      return fechaNac ? calcularEdad(fechaNac) : null;
    })
    .filter(edad => edad !== null);
  
  const edadPromedio = edades.length > 0 
    ? Math.round(edades.reduce((sum, edad) => sum + edad, 0) / edades.length)
    : null;

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {console.log('PatientsComponent: Renderizando componente con', patients.length, 'pacientes')}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
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
            onClick={handleAddPatient}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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

        {/* Buscador y Filtros */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="🔍 Buscar paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: '250px',
              padding: '0.75rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
          
          <button
            onClick={() => setSearchTerm('')}
            style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            🔄 Limpiar
          </button>
        </div>

        {/* Filtros de Asistencia */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setSearchTerm('')}
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
            👥 Todos los Pacientes
          </button>
          
          <button
            onClick={() => {
              const pacientesCriticos = patients.filter(patient => {
                const diasSinAsistir = calcularDiasSinAsistir(patient.appointments);
                const nivelAlerta = obtenerNivelAlerta(diasSinAsistir);
                return nivelAlerta === 'critico';
              });
              // Filtrar solo pacientes críticos
              setSearchTerm(''); // Limpiar búsqueda actual
              // Aquí podrías implementar un estado para mostrar solo críticos
              console.log('Pacientes críticos:', pacientesCriticos);
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
            🔴 Críticos ({patients.filter(p => {
              const dias = calcularDiasSinAsistir(p.appointments);
              return obtenerNivelAlerta(dias) === 'critico';
            }).length})
          </button>
          
          <button
            onClick={() => {
              const pacientesAlerta = patients.filter(patient => {
                const diasSinAsistir = calcularDiasSinAsistir(patient.appointments);
                const nivelAlerta = obtenerNivelAlerta(diasSinAsistir);
                return nivelAlerta === 'alerta';
              });
              // Filtrar solo pacientes con alerta
              setSearchTerm(''); // Limpiar búsqueda actual
              // Aquí podrías implementar un estado para mostrar solo alertas
              console.log('Pacientes con alerta:', pacientesAlerta);
            }}
            style={{
              background: '#ffc107',
              color: '#212529',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            🟡 Con Alerta ({patients.filter(p => {
              const dias = calcularDiasSinAsistir(p.appointments);
              return obtenerNivelAlerta(dias) === 'alerta';
            }).length})
          </button>
        </div>

        {/* Lista de pacientes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredPatients.map(patient => (
            <div 
              key={patient.id} 
              onClick={() => handleViewPatientDetails(patient)}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e9ecef',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{
                marginBottom: '1rem'
              }}>
                <h3 style={{
                  margin: 0,
                  color: '#2c3e50',
                  fontSize: '1.2rem',
                  fontWeight: '600'
                }}>
                  {patient.nombre} {patient.segundoNombre} {patient.apellido}
                </h3>
                <p style={{
                  margin: '0.5rem 0',
                  color: '#7f8c8d',
                  fontSize: '0.9rem'
                }}>
                  {patient.appointments?.[0]?.patientInfo?.fechaNacimiento 
                    ? `${calcularEdad(patient.appointments[0].patientInfo.fechaNacimiento)} años`
                    : 'Sin fecha de nacimiento'}
                </p>

                {/* Alerta de Asistencia */}
                {(() => {
                  const diasSinAsistir = calcularDiasSinAsistir(patient.appointments);
                  const nivelAlerta = obtenerNivelAlerta(diasSinAsistir);
                  
                  if (nivelAlerta) {
                    const backgroundColor = nivelAlerta === 'critico' ? '#f8d7da' : '#fff3cd';
                    const borderColor = nivelAlerta === 'critico' ? '#f5c6cb' : '#ffeaa7';
                    const textColor = nivelAlerta === 'critico' ? '#721c24' : '#856404';
                    const icon = nivelAlerta === 'critico' ? '🔴' : '🟡';
                    
                    return (
                      <div style={{
                        background: backgroundColor,
                        border: `1px solid ${borderColor}`,
                        borderRadius: '4px',
                        padding: '0.5rem',
                        marginTop: '0.5rem',
                        fontSize: '0.8rem'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          color: textColor,
                          fontWeight: '600'
                        }}>
                          {icon} {diasSinAsistir} días sin asistir
                        </div>
                        <div style={{
                          color: textColor,
                          fontSize: '0.75rem',
                          marginTop: '0.25rem'
                        }}>
                          {nivelAlerta === 'critico' ? 'Requiere atención urgente' : 'Necesita seguimiento'}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  textAlign: 'center',
                  padding: '0.8rem',
                  background: '#f8f9fa',
                  borderRadius: '6px'
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#667eea'
                  }}>
                    {patient.totalVisits}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#6c757d'
                  }}>
                    Visitas
                  </div>
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: '0.8rem',
                  background: '#f8f9fa',
                  borderRadius: '6px'
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#28a745'
                  }}>
                    {patient.appointments.filter(apt => new Date(apt.start) > new Date()).length}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#6c757d'
                  }}>
                    Próximas
                  </div>
                </div>
              </div>

              {patient.lastVisit && (
                <div style={{
                  fontSize: '0.8rem',
                  color: '#6c757d',
                  marginTop: '0.5rem'
                }}>
                  <strong>Última visita:</strong> {new Date(patient.lastVisit).toLocaleDateString('es-ES')}
                </div>
              )}

              <div style={{
                fontSize: '0.7rem',
                color: '#6c757d',
                marginTop: '0.5rem',
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                👆 Haz clic para ver detalles
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#6c757d'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
            <h3>No se encontraron pacientes</h3>
            <p>Intenta con otro término de búsqueda o agrega un nuevo paciente.</p>
          </div>
        )}
      </div>

      {/* Modal de detalles del paciente */}
      {showPatientDetails && selectedPatient && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            width: '90%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                margin: 0,
                color: '#2c3e50',
                fontSize: '1.5rem',
                fontWeight: '600'
              }}>
                👤 {selectedPatient.name}
              </h2>
              <button
                onClick={handleCloseDetails}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6c757d'
                }}
              >
                ✕
              </button>
            </div>

            {/* Información del paciente */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                color: 'white',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{totalPatients}</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Total Pacientes</p>
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                color: 'white',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{totalAppointments}</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Total Citas</p>
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                color: 'white',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{averageVisits}</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Promedio Citas/Paciente</p>
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                color: 'white',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
                  {edadPromedio ? `${edadPromedio} años` : 'N/A'}
                </h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Edad Promedio (Calculada)</p>
              </div>
            </div>

            {/* Información personal del paciente */}
            <div style={{
              background: '#e3f2fd',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <h4 style={{
                margin: '0 0 1rem 0',
                color: '#1976d2',
                fontSize: '1.1rem'
              }}>
                📋 Información Personal
              </h4>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <strong style={{ color: '#1976d2' }}>Nombre Completo:</strong>
                  <p style={{ margin: '0.25rem 0', color: '#2c3e50' }}>
                    {selectedPatient.nombre} {selectedPatient.segundoNombre} {selectedPatient.apellido}
                  </p>
                </div>
                
                <div>
                  <strong style={{ color: '#1976d2' }}>Nombre:</strong>
                  <p style={{ margin: '0.25rem 0', color: '#2c3e50' }}>
                    {selectedPatient.nombre || 'No registrado'}
                  </p>
                </div>
                
                <div>
                  <strong style={{ color: '#1976d2' }}>Segundo Nombre:</strong>
                  <p style={{ margin: '0.25rem 0', color: '#2c3e50' }}>
                    {selectedPatient.segundoNombre || 'No registrado'}
                  </p>
                </div>
                
                <div>
                  <strong style={{ color: '#1976d2' }}>Apellido:</strong>
                  <p style={{ margin: '0.25rem 0', color: '#2c3e50' }}>
                    {selectedPatient.apellido || 'No registrado'}
                  </p>
                </div>
                
                <div>
                  <strong style={{ color: '#1976d2' }}>DNI:</strong>
                  <p style={{ margin: '0.25rem 0', color: '#2c3e50' }}>
                    {selectedPatient.appointments[0]?.patientInfo?.dni || 'No registrado'}
                  </p>
                </div>
                
                <div>
                  <strong style={{ color: '#1976d2' }}>Fecha de Nacimiento:</strong>
                  <p style={{ margin: '0.25rem 0', color: '#2c3e50' }}>
                    {selectedPatient.appointments?.[0]?.patientInfo?.fechaNacimiento 
                      ? new Date(selectedPatient.appointments[0].patientInfo.fechaNacimiento).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'No registrada'}
                  </p>
                </div>
                
                <div>
                  <strong style={{ color: '#1976d2' }}>Edad:</strong>
                  <p style={{ margin: '0.25rem 0', color: '#2c3e50' }}>
                    {selectedPatient.appointments?.[0]?.patientInfo?.fechaNacimiento 
                      ? `${calcularEdad(selectedPatient.appointments[0].patientInfo.fechaNacimiento)} años (calculada automáticamente)`
                      : 'No calculable - falta fecha de nacimiento'}
                  </p>
                </div>
                
                <div>
                  <strong style={{ color: '#1976d2' }}>Teléfono:</strong>
                  <p 
                    style={{ 
                      margin: '0.25rem 0', 
                      color: '#2c3e50',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontWeight: '500'
                    }}
                    onClick={() => handlePhoneClick(selectedPatient.appointments[0]?.patientInfo?.telefono)}
                  >
                    📞 {selectedPatient.appointments[0]?.patientInfo?.telefono || 'No registrado'}
                  </p>
                </div>
                
                <div>
                  <strong style={{ color: '#1976d2' }}>Email:</strong>
                  <p 
                    style={{ 
                      margin: '0.25rem 0', 
                      color: '#2c3e50',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontWeight: '500'
                    }}
                    onClick={() => handleEmailClick(selectedPatient.appointments[0]?.patientInfo?.email)}
                  >
                    📧 {selectedPatient.appointments[0]?.patientInfo?.email || 'No registrado'}
                  </p>
                </div>
                
                <div>
                  <strong style={{ color: '#1976d2' }}>Dirección:</strong>
                  <p 
                    style={{ 
                      margin: '0.25rem 0', 
                      color: '#2c3e50',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontWeight: '500'
                    }}
                    onClick={() => handleAddressClick(selectedPatient.appointments[0]?.patientInfo?.direccion)}
                  >
                    🏠 {selectedPatient.appointments[0]?.patientInfo?.direccion || 'No registrada'}
                  </p>
                </div>
                
                <div>
                  <strong style={{ color: '#1976d2' }}>Obra Social:</strong>
                  <p style={{ margin: '0.25rem 0', color: '#2c3e50' }}>
                    🏥 {selectedPatient.appointments[0]?.patientInfo?.obraSocial || 'No registrada'}
                  </p>
                </div>
                
                <div>
                  <strong style={{ color: '#1976d2' }}>Número de Afiliado:</strong>
                  <p style={{ margin: '0.25rem 0', color: '#2c3e50' }}>
                    {selectedPatient.appointments[0]?.patientInfo?.numeroAfiliado || 'No registrado'}
                  </p>
                </div>
                
                <div>
                  <strong style={{ color: '#1976d2' }}>Estado:</strong>
                  <p style={{ margin: '0.25rem 0', color: '#2c3e50' }}>
                    {selectedPatient.appointments.filter(apt => new Date(apt.start) > new Date()).length > 0 
                      ? '🟢 Activo' 
                      : '🟡 Sin citas programadas'}
                  </p>
                </div>
                
                <div>
                  <strong style={{ color: '#1976d2' }}>Frecuencia de Visitas:</strong>
                  <p style={{ margin: '0.25rem 0', color: '#2c3e50' }}>
                    {selectedPatient.totalVisits > 5 ? '🟢 Frecuente' : 
                     selectedPatient.totalVisits > 2 ? '🟡 Regular' : '🔵 Ocasional'}
                  </p>
                </div>
              </div>
            </div>

            {/* Última visita */}
            {selectedPatient.lastVisit && (
              <div style={{
                background: '#e3f2fd',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '2rem'
              }}>
                <h4 style={{
                  margin: '0 0 0.5rem 0',
                  color: '#1976d2'
                }}>
                  📅 Última Visita
                </h4>
                <p style={{
                  margin: 0,
                  color: '#1976d2'
                }}>
                  {new Date(selectedPatient.lastVisit).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}

            {/* Historial de citas */}
            <div style={{
              marginBottom: '2rem'
            }}>
              <h4 style={{
                margin: '0 0 1rem 0',
                color: '#2c3e50'
              }}>
                📋 Historial de Citas
              </h4>
              <div style={{
                maxHeight: '250px',
                overflow: 'auto',
                border: '1px solid #e9ecef',
                borderRadius: '8px'
              }}>
                {selectedPatient.appointments.length > 0 ? (
                  selectedPatient.appointments
                    .sort((a, b) => new Date(b.start) - new Date(a.start))
                    .map((appointment, index) => (
                      <div key={appointment.id} style={{
                        padding: '1rem',
                        borderBottom: index < selectedPatient.appointments.length - 1 ? '1px solid #e9ecef' : 'none',
                        background: new Date(appointment.start) > new Date() ? '#d4edda' : '#f8f9fa'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '0.5rem'
                        }}>
                          <div style={{
                            fontWeight: '500',
                            color: '#2c3e50',
                            fontSize: '1rem'
                          }}>
                            {new Date(appointment.start).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div style={{
                            fontSize: '0.8rem',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            background: new Date(appointment.start) > new Date() ? '#28a745' : '#6c757d',
                            color: 'white',
                            fontWeight: '500'
                          }}>
                            {new Date(appointment.start) > new Date() ? 'Próxima' : 'Completada'}
                          </div>
                        </div>
                        
                        <div style={{
                          fontSize: '0.9rem',
                          color: '#6c757d',
                          marginBottom: '0.5rem'
                        }}>
                          <strong>Horario:</strong> {new Date(appointment.start).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })} - {new Date(appointment.end).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        
                        {appointment.notes && (
                          <div style={{
                            fontSize: '0.85rem',
                            color: '#495057',
                            fontStyle: 'italic',
                            background: 'rgba(255, 255, 255, 0.7)',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            marginTop: '0.5rem'
                          }}>
                            <strong>Notas:</strong> {appointment.notes}
                          </div>
                        )}
                        
                        {appointment.title && appointment.title !== selectedPatient.name && (
                          <div style={{
                            fontSize: '0.8rem',
                            color: '#6c757d',
                            marginTop: '0.25rem'
                          }}>
                            <strong>Tipo:</strong> {appointment.title.includes(' - ') 
                              ? appointment.title.split(' - ')[0] 
                              : appointment.title}
                          </div>
                        )}
                      </div>
                    ))
                ) : (
                  <div style={{
                    padding: '1rem',
                    textAlign: 'center',
                    color: '#6c757d'
                  }}>
                    No hay citas registradas
                  </div>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => {
                  handleEditPatient(selectedPatient);
                  setShowPatientDetails(false);
                }}
                style={{
                  background: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                ✏️ Editar Paciente
              </button>
              <button
                onClick={() => handleDeletePatient(selectedPatient.id)}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                🗑️ Eliminar Paciente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para teléfono */}
      {showPhoneModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1001
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            width: '90%',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              color: '#2c3e50',
              fontSize: '1.3rem'
            }}>
              📞 Teléfono del Paciente
            </h3>
            
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#667eea',
              marginBottom: '1.5rem',
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              border: '2px solid #e9ecef'
            }}>
              {selectedPhone}
            </div>
            
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => window.open(`tel:${selectedPhone}`, '_self')}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                📞 Llamar
              </button>
              
              <button
                onClick={handleClosePhoneModal}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                ✕ Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para mapa */}
      {showMapModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1001
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                margin: 0,
                color: '#2c3e50',
                fontSize: '1.3rem'
              }}>
                🏠 Dirección del Paciente
              </h3>
              <button
                onClick={handleCloseMapModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6c757d'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{
              background: '#f8f9fa',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: '1px solid #e9ecef'
            }}>
              <strong style={{ color: '#2c3e50' }}>Dirección:</strong>
              <p style={{ margin: '0.5rem 0 0 0', color: '#495057' }}>
                {selectedAddress}
              </p>
            </div>
            
            <div style={{
              background: '#e3f2fd',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <p style={{ margin: '0 0 1rem 0', color: '#1976d2' }}>
                Haz clic en el botón para abrir la ubicación en Google Maps
              </p>
              
              <button
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedAddress)}`, '_blank')}
                style={{
                  background: '#1976d2',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '0 auto'
                }}
              >
                🗺️ Abrir en Google Maps
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar/editar paciente */}
      {showAddPatient && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            width: '90%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{
              margin: '0 0 1.5rem 0',
              color: '#2c3e50'
            }}>
              {editingPatient ? '✏️ Editar Paciente' : '➕ Agregar Paciente'}
            </h2>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const nombre = formData.get('nombre');
              const segundoNombre = formData.get('segundoNombre');
              const apellido = formData.get('apellido');
              
              // Combinar los campos de nombre
              const nombreCompleto = [nombre, segundoNombre, apellido]
                .filter(part => part && part.trim())
                .join(' ');
              
              handleSavePatient({
                nombre: nombre,
                segundoNombre: segundoNombre,
                apellido: apellido,
                name: nombreCompleto, // Para compatibilidad
                dni: formData.get('dni'),
                fechaNacimiento: formData.get('fechaNacimiento'),
                telefono: formData.get('telefono'),
                email: formData.get('email'),
                direccion: formData.get('direccion'),
                obraSocial: formData.get('obraSocial'),
                numeroAfiliado: formData.get('numeroAfiliado')
              });
            }}>
              {/* Información básica */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#2c3e50', fontSize: '1.1rem' }}>
                  📋 Información Básica
                </h4>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr 1fr', 
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#2c3e50'
                    }}>
                      Nombre: *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      defaultValue={editingPatient?.nombre || editingPatient?.name?.split(' ')[0] || ''}
                      required
                      placeholder="Juan"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #e9ecef',
                        borderRadius: '6px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#2c3e50'
                    }}>
                      Segundo Nombre:
                    </label>
                    <input
                      type="text"
                      name="segundoNombre"
                      defaultValue={editingPatient?.segundoNombre || editingPatient?.name?.split(' ')[1] || ''}
                      placeholder="Carlos"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #e9ecef',
                        borderRadius: '6px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#2c3e50'
                    }}>
                      Apellido: *
                    </label>
                    <input
                      type="text"
                      name="apellido"
                      defaultValue={editingPatient?.apellido || editingPatient?.name?.split(' ').slice(-1)[0] || ''}
                      required
                      placeholder="García"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #e9ecef',
                        borderRadius: '6px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: '#2c3e50'
                  }}>
                    DNI:
                  </label>
                  <input
                    type="text"
                    name="dni"
                    defaultValue={editingPatient?.appointments?.[0]?.patientInfo?.dni || ''}
                    placeholder="12345678"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #e9ecef',
                      borderRadius: '6px',
                      fontSize: '1rem'
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
                    Fecha de Nacimiento:
                  </label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    defaultValue={editingPatient?.appointments?.[0]?.patientInfo?.fechaNacimiento || ''}
                    onChange={(e) => {
                      // Calcular edad en tiempo real cuando se selecciona fecha
                      if (e.target.value) {
                        const edad = calcularEdad(e.target.value);
                        setEdadCalculada(edad);
                      } else {
                        setEdadCalculada(null);
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #e9ecef',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                  {(edadCalculada !== null || editingPatient?.appointments?.[0]?.patientInfo?.fechaNacimiento) && (
                    <p style={{
                      margin: '0.25rem 0 0 0',
                      fontSize: '0.85rem',
                      color: '#27ae60',
                      fontStyle: 'italic'
                    }}>
                      Edad calculada: {edadCalculada || calcularEdad(editingPatient?.appointments?.[0]?.patientInfo?.fechaNacimiento)} años
                    </p>
                  )}
                </div>
              </div>
              
              {/* Información de contacto */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#2c3e50', fontSize: '1.1rem' }}>
                  📞 Información de Contacto
                </h4>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: '#2c3e50'
                  }}>
                    Teléfono:
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    defaultValue={editingPatient?.appointments?.[0]?.patientInfo?.telefono || ''}
                    placeholder="+54 11 1234-5678"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #e9ecef',
                      borderRadius: '6px',
                      fontSize: '1rem'
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
                    Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingPatient?.appointments?.[0]?.patientInfo?.email || ''}
                    placeholder="paciente@email.com"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #e9ecef',
                      borderRadius: '6px',
                      fontSize: '1rem'
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
                    Dirección:
                  </label>
                  <textarea
                    name="direccion"
                    defaultValue={editingPatient?.appointments?.[0]?.patientInfo?.direccion || ''}
                    placeholder="Av. Corrientes 1234, CABA, Buenos Aires"
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #e9ecef',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
              
              {/* Información médica */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#2c3e50', fontSize: '1.1rem' }}>
                  🏥 Información Médica
                </h4>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: '#2c3e50'
                  }}>
                    Obra Social:
                  </label>
                  <select
                    name="obraSocial"
                    defaultValue={editingPatient?.appointments?.[0]?.patientInfo?.obraSocial || ''}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #e9ecef',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">Seleccionar obra social</option>
                    <option value="OSDE">OSDE</option>
                    <option value="Swiss Medical">Swiss Medical</option>
                    <option value="Galeno">Galeno</option>
                    <option value="Medicus">Medicus</option>
                    <option value="Omint">Omint</option>
                    <option value="Particular">Particular</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: '#2c3e50'
                  }}>
                    Número de Afiliado:
                  </label>
                  <input
                    type="text"
                    name="numeroAfiliado"
                    defaultValue={editingPatient?.appointments?.[0]?.patientInfo?.numeroAfiliado || ''}
                    placeholder="123456789"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #e9ecef',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => setShowAddPatient(false)}
                  style={{
                    padding: '10px 20px',
                    border: '2px solid #e9ecef',
                    background: 'white',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}
                >
                  {editingPatient ? '✏️ Actualizar' : '➕ Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsComponent; 