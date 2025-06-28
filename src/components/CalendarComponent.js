// CalendarComponent.js
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import CitaModal from './CitaModal';
import { cargarCitas, agregarCita, eliminarCita, actualizarCita, cargarCitasDesdeLocalStorage } from '../services/citasService';

const MyCalendar = (props) => {
  const { onCitasChange, onDayClick } = props;

  const [citas, setCitas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [editingCita, setEditingCita] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const localizer = momentLocalizer(moment);

  // Cargar citas solo una vez al montar el componente
  useEffect(() => {
    const cargarCitasIniciales = async () => {
      try {
        setLoading(true);
        console.log('Cargando citas desde el backend...');
        
        // Intentar cargar desde la API del backend primero
        let citasCargadas = await cargarCitas();
        console.log('Citas cargadas desde backend:', citasCargadas);
        
        // Si no hay citas en el backend, cargar desde localStorage como fallback
        if (!citasCargadas || citasCargadas.length === 0) {
          console.log('No hay citas en el backend, cargando desde localStorage...');
          citasCargadas = cargarCitasDesdeLocalStorage();
        }
        
        // Convertir las fechas de string a Date objects
        const citasConFechas = citasCargadas.map(cita => ({
          ...cita,
          start: new Date(cita.start),
          end: new Date(cita.end)
        }));
        
        console.log('Citas procesadas para el calendario:', citasConFechas);
        setCitas(citasConFechas);
        
        // Notificar al componente padre sobre el cambio de citas
        if (onCitasChange) {
          onCitasChange(citasConFechas);
        }
      } catch (error) {
        console.error('Error al cargar citas iniciales:', error);
        // Cargar desde localStorage como fallback
        const citasLocalStorage = cargarCitasDesdeLocalStorage();
        const citasConFechas = citasLocalStorage.map(cita => ({
          ...cita,
          start: new Date(cita.start),
          end: new Date(cita.end)
        }));
        setCitas(citasConFechas);
        
        if (onCitasChange) {
          onCitasChange(citasConFechas);
        }
      } finally {
        setLoading(false);
      }
    };

    cargarCitasIniciales();
  }, [onCitasChange]); // Agregar onCitasChange como dependencia

  const handleSelectSlot = (slotInfo) => {
    // En vista de mes, esto debería abrir la vista diaria
    if (view === 'month') {
      setSelectedDate(slotInfo.start);
      setView('day');
      
      // Notificar al componente padre sobre el clic en el día
      if (onDayClick) {
        onDayClick(slotInfo.start);
      }
    } else {
      // En vista de día, abrir modal para crear nueva cita
    setSelectedSlot(slotInfo);
      setEditingCita(null);
      setModalOpen(true);
    }
  };

  const handleDayClick = (date) => {
    // Esta función se llama cuando se hace clic en un día del mes
    setSelectedDate(date);
    setView('day');
    
    // Notificar al componente padre sobre el clic en el día
    if (onDayClick) {
      onDayClick(date);
    }
  };

  const handleEventClick = (event) => {
    // Esta función se llama cuando se hace clic en un evento existente
    if (view === 'day') {
      // En vista de día, abrir modal para editar
      setEditingCita(event);
      setSelectedSlot({
        start: event.start,
        end: event.end,
        slots: [event.start]
      });
      setModalOpen(true);
    }
  };

  const handleGuardarCita = async (cita) => {
    if (cita.nombre && cita.fecha) {
      try {
        if (editingCita) {
          // Actualizar cita existente
          const citaActualizada = {
            ...editingCita,
            title: cita.nombre,
            start: cita.fecha,
            end: new Date(new Date(cita.fecha).getTime() + 60 * 60 * 1000),
            notes: cita.notas || editingCita.notes || ''
          };
          
          const actualizado = await actualizarCita(editingCita.id, citaActualizada);
          if (actualizado) {
            const citasActualizadas = citas.map(c => 
              c.id === editingCita.id ? citaActualizada : c
            );
            setCitas(citasActualizadas);
            if (onCitasChange) {
              onCitasChange(citasActualizadas);
            }
            console.log('Cita actualizada exitosamente');
          }
        } else {
          // Agregar nueva cita
          const nuevaCita = await agregarCita(cita);
          const citaParaCalendario = {
            ...nuevaCita,
            start: new Date(nuevaCita.start),
            end: new Date(nuevaCita.end),
            notes: cita.notas || ''
          };
          
          const citasActualizadas = [...citas, citaParaCalendario];
          setCitas(citasActualizadas);
          if (onCitasChange) {
            onCitasChange(citasActualizadas);
          }
          console.log('Cita guardada exitosamente:', nuevaCita);
        }
      } catch (error) {
        console.error('Error al guardar la cita:', error);
        alert('Error al guardar la cita. Por favor, intenta de nuevo.');
      }
    }
    closeModal();
  };

  const handleEliminarCita = async (citaId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
      try {
        const eliminado = await eliminarCita(citaId);
        if (eliminado) {
          const citasActualizadas = citas.filter(cita => cita.id !== citaId);
          setCitas(citasActualizadas);
          if (onCitasChange) {
            onCitasChange(citasActualizadas);
          }
          console.log('Cita eliminada exitosamente');
        }
      } catch (error) {
        console.error('Error al eliminar la cita:', error);
        alert('Error al eliminar la cita. Por favor, intenta de nuevo.');
      }
    }
  };

  const handleMoverCita = async (citaId, nuevaFecha) => {
    try {
      const citaAMover = citas.find(c => c.id === citaId);
      if (citaAMover) {
        const duracion = citaAMover.end - citaAMover.start;
        const nuevaCita = {
          ...citaAMover,
          start: nuevaFecha,
          end: new Date(nuevaFecha.getTime() + duracion)
        };
        
        const actualizado = await actualizarCita(citaId, nuevaCita);
        if (actualizado) {
          const citasActualizadas = citas.map(c => 
            c.id === citaId ? nuevaCita : c
          );
          setCitas(citasActualizadas);
          if (onCitasChange) {
            onCitasChange(citasActualizadas);
          }
          console.log('Cita movida exitosamente');
        }
      }
    } catch (error) {
      console.error('Error al mover la cita:', error);
      alert('Error al mover la cita. Por favor, intenta de nuevo.');
  }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCita(null);
  };

  if (loading) {
    return (
      <div className="loading-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '300px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Cargando citas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-container" style={{
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <div className="calendar-content">
      <Calendar
        localizer={localizer}
          events={citas}
        startAccessor="start"
        endAccessor="end"
        selectable={true}
        onSelectSlot={handleSelectSlot}
          onSelectEvent={handleEventClick}
          style={{ height: '450px' }}
          view={view}
          onView={(newView) => setView(newView)}
          date={selectedDate}
          onNavigate={(newDate) => setSelectedDate(newDate)}
          step={60}
          timeslots={1}
          min={moment().startOf('day').add(8, 'hours').toDate()}
          max={moment().startOf('day').add(20, 'hours').toDate()}
          popup={false}
          onDrillDown={handleDayClick}
      />
      </div>
      
      <CitaModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        onGuardarCita={handleGuardarCita}
        selectedSlot={selectedSlot}
        editingCita={editingCita}
        onEliminarCita={handleEliminarCita}
        onMoverCita={handleMoverCita}
      />
    </div>
  );
};

export default MyCalendar;
