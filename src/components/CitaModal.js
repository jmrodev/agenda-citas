// CitaModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import moment from 'moment';

const CitaModal = (props) => {
  const [nombre, setNombre] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [notas, setNotas] = useState('');
  const [mostrarOpcionesAvanzadas, setMostrarOpcionesAvanzadas] = useState(false);

  // Limpiar el formulario cuando se abra el modal
  useEffect(() => {
    if (props.isOpen) {
      if (props.editingCita) {
        setNombre(props.editingCita.title || '');
        setNuevaFecha(moment(props.editingCita.start).format('YYYY-MM-DDTHH:mm'));
        setNotas(props.editingCita.notes || '');
      } else {
        setNombre('');
        setNuevaFecha('');
        setNotas('');
      }
      setMostrarOpcionesAvanzadas(false);
    }
  }, [props.isOpen, props.editingCita]);

  const handleGuardarCita = () => {
    if (!nombre.trim()) {
      alert('Por favor ingresa un nombre para la cita');
      return;
    }

    const cita = {
      nombre: nombre.trim(),
      fecha: props.editingCita && nuevaFecha ? new Date(nuevaFecha) : (props.selectedSlot ? props.selectedSlot.start : null),
      notas: notas.trim()
    };
    
    props.onGuardarCita(cita);
  };

  const handleEliminarCita = () => {
    if (props.editingCita && props.onEliminarCita) {
      if (window.confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
        props.onEliminarCita(props.editingCita.id);
        props.onRequestClose();
      }
    }
  };

  const handleMoverCita = () => {
    if (props.editingCita && nuevaFecha && props.onMoverCita) {
      const fechaSeleccionada = new Date(nuevaFecha);
      props.onMoverCita(props.editingCita.id, fechaSeleccionada);
      props.onRequestClose();
    }
  };

  // Formatear la fecha para mostrar
  const formatDate = (date) => {
    if (!date) return '';
    return moment(date).format('DD/MM/YYYY HH:mm');
  };

  const esModoEdicion = props.editingCita !== null;

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onRequestClose}
      contentLabel={esModoEdicion ? "Editar Cita" : "Crear Cita"}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding: '0',
          borderRadius: '16px',
          border: 'none',
          background: 'white',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          maxWidth: '500px',
          width: '90%',
          overflow: 'hidden'
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(5px)'
        }
      }}
    >
      <div className="modal-header" style={{
        background: esModoEdicion 
          ? 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1.5rem',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
          {esModoEdicion ? '✏️ Editar Cita' : '📅 Crear Nueva Cita'}
        </h2>
      </div>
      
      <div className="modal-body" style={{ padding: '2rem' }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label htmlFor="nombre" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#2c3e50',
              fontSize: '0.9rem'
            }}>
              Nombre de la Cita:
            </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              placeholder="Ej: Reunión con cliente"
              autoFocus
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          {esModoEdicion && (
            <div className="form-group">
              <label htmlFor="nuevaFecha" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#2c3e50',
                fontSize: '0.9rem'
              }}>
                Nueva Fecha y Hora:
              </label>
              <input
                type="datetime-local"
                id="nuevaFecha"
                value={nuevaFecha}
                onChange={(e) => setNuevaFecha(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="notas" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#2c3e50',
              fontSize: '0.9rem'
            }}>
              Notas:
            </label>
            <textarea
              id="notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows="3"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
              placeholder="Agregar notas sobre la cita..."
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="fecha" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#2c3e50',
              fontSize: '0.9rem'
            }}>
              {esModoEdicion ? 'Fecha Actual:' : 'Fecha y Hora:'}
            </label>
            <input
              type="text"
              id="fecha"
              value={formatDate(props.selectedSlot ? props.selectedSlot.start : null)}
              disabled
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#f8f9fa',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '1rem',
                color: '#495057',
                cursor: 'not-allowed'
              }}
            />
          </div>

          {/* Información adicional de la cita */}
          {esModoEdicion && props.editingCita && (
            <div style={{
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef',
              marginBottom: '1rem'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50', fontSize: '1rem' }}>
                📋 Información de la Cita
              </h4>
              <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                <div><strong>ID:</strong> {props.editingCita.id}</div>
                <div><strong>Paciente:</strong> {props.editingCita.patient || 'No especificado'}</div>
                <div><strong>Duración:</strong> {moment(props.editingCita.end).diff(moment(props.editingCita.start), 'minutes')} minutos</div>
                {props.editingCita.createdAt && (
                  <div><strong>Creada:</strong> {moment(props.editingCita.createdAt).format('DD/MM/YYYY HH:mm')}</div>
                )}
              </div>
            </div>
          )}
          
          {esModoEdicion && (
            <div style={{
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50', fontSize: '1rem' }}>
                ⚙️ Opciones Avanzadas
              </h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button 
                  type="button"
                  onClick={() => setMostrarOpcionesAvanzadas(!mostrarOpcionesAvanzadas)}
                  style={{
                    padding: '8px 16px',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  {mostrarOpcionesAvanzadas ? 'Ocultar' : 'Mostrar'} Opciones
                </button>
              </div>
              
              {mostrarOpcionesAvanzadas && (
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button 
                    type="button"
                    onClick={handleMoverCita}
                    disabled={!nuevaFecha}
                    style={{
                      padding: '8px 16px',
                      background: nuevaFecha ? '#28a745' : '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: nuevaFecha ? 'pointer' : 'not-allowed',
                      fontSize: '0.9rem'
                    }}
                  >
                    📅 Mover Cita
                  </button>
                  <button 
                    type="button"
                    onClick={handleEliminarCita}
                    style={{
                      padding: '8px 16px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    🗑️ Eliminar Cita
                  </button>
                </div>
              )}
            </div>
          )}
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'flex-end', 
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e9ecef'
          }}>
            <button 
              type="button" 
              onClick={props.onRequestClose}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#5a6268';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#6c757d';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Cancelar
            </button>
            <button 
              type="button" 
              onClick={handleGuardarCita}
              style={{
                padding: '12px 24px',
                background: esModoEdicion 
                  ? 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
              }}
            >
              {esModoEdicion ? '💾 Actualizar Cita' : '✅ Guardar Cita'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CitaModal;
