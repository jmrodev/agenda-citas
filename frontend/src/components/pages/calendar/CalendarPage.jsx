import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../../../auth/authFetch';
import CalendarView from '../../organisms/CalendarView/CalendarView';
import TimeSlot from '../../molecules/TimeSlot/TimeSlot';
import OutOfScheduleModal from '../../molecules/OutOfScheduleModal/OutOfScheduleModal';
import DoctorSelector from '../../molecules/DoctorSelector/DoctorSelector';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import Spinner from '../../atoms/Spinner/Spinner';
import AppointmentFormModal from '../../organisms/AppointmentFormModal/AppointmentFormModal';
import { doctorScheduleService } from '../../../services/doctorScheduleService';
import styles from './CalendarPage.module.css';

const CalendarPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedDoctorName, setSelectedDoctorName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showOutOfScheduleModal, setShowOutOfScheduleModal] = useState(false);
  const [outOfScheduleTime, setOutOfScheduleTime] = useState(null);
  const [doctorsSchedule, setDoctorsSchedule] = useState({});
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const navigate = useNavigate();

  // Obtener día actual en formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Set initial selected date to today when component mounts
  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
  }, []);

  // Cargar horarios de doctores cuando cambie la fecha seleccionada o el doctor
  useEffect(() => {
    if (selectedDate && selectedDoctorId) {
      fetchDoctorsSchedule();
    }
  }, [selectedDate, selectedDoctorId]);

  const fetchDoctorsSchedule = async () => {
    try {
      setScheduleLoading(true);
      const dayOfWeek = doctorScheduleService.getDayOfWeek(selectedDate);
      const schedule = await doctorScheduleService.getAllDoctorsSchedule(dayOfWeek);
      setDoctorsSchedule(schedule);
    } catch (error) {
      console.error('Error fetching doctors schedule:', error);
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleDoctorChange = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setSelectedDoctorName('');
    setDoctorsSchedule({});
    setScheduleLoading(false);
    
    // Si se seleccionó un doctor, obtener su nombre
    if (doctorId) {
      fetchDoctorName(doctorId);
    }
  };

  const fetchDoctorName = async (doctorId) => {
    try {
      const res = await authFetch(`/api/doctors/${doctorId}`);
      if (res.ok) {
        const doctor = await res.json();
        setSelectedDoctorName(`Dr. ${doctor.first_name} ${doctor.last_name} - ${doctor.specialty}`);
      }
    } catch (err) {
      console.error('Error fetching doctor name:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/appointments');
      if (!res.ok) throw new Error('Error al cargar citas');
      const data = await res.json();
      console.log('🔍 [CalendarPage] Citas cargadas:', data);
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Convertir citas a formato de eventos para el calendario (filtrar por doctor si está seleccionado)
  const events = appointments.reduce((acc, appointment) => {
    // Si hay un doctor seleccionado, solo mostrar sus citas
    if (selectedDoctorId && appointment.doctor_id !== selectedDoctorId) {
      return acc;
    }
    
    // Normalizar la fecha para asegurar formato YYYY-MM-DD
    const dateKey = appointment.date.split('T')[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push({
      id: appointment.appointment_id,
      title: `${appointment.time.slice(0, 5)} - ${appointment.patient_name || 'Paciente'}`,
      time: appointment.time,
      appointment: appointment
    });
    return acc;
  }, {});

  const handleDayClick = (dateKey) => {
    const [year, month, day] = dateKey.split('-').map(Number);
    const newDate = new Date(year, month - 1, day);
    setSelectedDate(newDate);
    // Solo limpiar selectedTime si cambiamos de día
    if (selectedDate.toISOString().split('T')[0] !== dateKey) {
      setSelectedTime(null);
    }
  };

  const handleCalendarToday = (dateKey) => {
    const [year, month, day] = dateKey.split('-').map(Number);
    const newDate = new Date(year, month - 1, day);
    setSelectedDate(newDate);
    // Solo limpiar selectedTime si cambiamos de día
    if (selectedDate.toISOString().split('T')[0] !== dateKey) {
      setSelectedTime(null);
    }
  };

  const handleTimeClick = (time, appointment = null) => {
    console.log('handleTimeClick:', { time, appointment });
    setSelectedTime(time);
    setEditingAppointment(appointment);
    setShowAppointmentForm(true);
    
    // Mostrar mensaje de confirmación
    if (!appointment) {
      console.log(`✅ Cita programada para ${time} - Abriendo formulario...`);
    }
  };

  const handleOutOfScheduleConfirm = (time) => {
    setOutOfScheduleTime(time);
    setShowOutOfScheduleModal(true);
  };

  const handleOutOfScheduleModalConfirm = (time) => {
    setSelectedTime(time);
    setEditingAppointment(null);
    setIsOutOfScheduleAppointment(true);
    setShowAppointmentForm(true);
    setShowOutOfScheduleModal(false);
    setOutOfScheduleTime(null);
  };

  const [isOutOfScheduleAppointment, setIsOutOfScheduleAppointment] = useState(false);

  const handleAppointmentFormClose = () => {
    console.log('handleAppointmentFormClose - selectedTime antes:', selectedTime);
    setShowAppointmentForm(false);
    setEditingAppointment(null);
    setIsOutOfScheduleAppointment(false);
    // No limpiar selectedTime aquí, solo limpiar editingAppointment
  };

  const handleAppointmentFormSuccess = () => {
    fetchAppointments(); // Recargar citas
    handleAppointmentFormClose();
  };

  // Obtener citas del día seleccionado
  const selectedDateKey = selectedDate.toISOString().split('T')[0];
  const dayAppointments = events[selectedDateKey] || [];
  console.log('🔍 [CalendarPage] Citas del día', selectedDateKey, ':', dayAppointments);

  // Generar slots de tiempo disponibles (8:00 - 18:00, cada 30 minutos)
  const generateTimeSlots = () => {
    if (!selectedDoctorId) {
      return [];
    }

    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        // Normalizar la hora de la cita para comparar correctamente (quitar segundos)
        const appointment = dayAppointments.find(apt => apt.time.slice(0, 5) === time);
        
        // Debug: mostrar cuando encuentra una cita
        if (appointment) {
          console.log('🔍 [CalendarPage] Cita encontrada para slot', time, ':', appointment);
        }
        
        // Verificar si el doctor seleccionado está disponible en este horario
        const doctorSchedule = doctorsSchedule[selectedDoctorId];
        const isInSchedule = doctorSchedule ? 
          doctorScheduleService.isTimeInSchedule(time, doctorSchedule.schedule) : false;
        
        slots.push({
          time,
          appointment,
          isAvailable: !appointment && isInSchedule,
          isInSchedule: isInSchedule
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  if (loading) {
    return (
      <div className={styles.container}>
        <h2>Calendario</h2>
        <div className={styles.loadingContainer}>
          <Spinner size={32} color="primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h2>Calendario</h2>
        <Alert type="error">{error}</Alert>
        <Button onClick={fetchAppointments}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Calendario</h2>
      
      {/* Selector de doctor */}
      <DoctorSelector
        selectedDoctorId={selectedDoctorId}
        onDoctorChange={handleDoctorChange}
        className={styles.doctorSelector}
        placeholder="Selecciona un doctor para ver sus horarios..."
      />
      
      {!selectedDoctorId && (
        <div className={styles.noDoctorSelected}>
          <p>Por favor, selecciona un doctor para ver sus horarios y citas disponibles.</p>
        </div>
      )}
      
      {selectedDoctorId && (
        <div className={styles.calendarLayout}>
        {/* Panel izquierdo - Calendario compacto */}
        <div className={styles.calendarPanel}>
          <CalendarView 
            appointments={appointments}
            onDayClick={handleDayClick}
            className={styles.compactCalendar}
            initialMonth={selectedDate.getMonth()}
            initialYear={selectedDate.getFullYear()}
          />
        </div>

        {/* Panel derecho - Detalles del día */}
        <div className={styles.dayDetailsPanel}>
          <div className={styles.dayHeader}>
            <div className={styles.dayInfo}>
              <h3>{selectedDate.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</h3>
              {!selectedTime && (
                <p className={styles.dayHint}>
                  💡 Haz clic en cualquier horario disponible para crear una cita
                </p>
              )}
            </div>
            <Button 
              onClick={() => {
                setEditingAppointment(null);
                setShowAppointmentForm(true);
              }}
              variant="primary"
              size="small"
              disabled={!selectedDoctorId}
              title={!selectedDoctorId ? 'Debe seleccionar un doctor primero' : ''}
            >
              Nueva Cita
            </Button>
          </div>

          <div className={styles.timeSlotsContainer}>
            <h4>Horarios disponibles</h4>
            {scheduleLoading && (
              <div className={styles.scheduleLoading}>
                <Spinner size={24} color="primary" />
                <span>Cargando horarios de doctores...</span>
              </div>
            )}
            <div className={styles.timeSlots}>
              {timeSlots.map((slot) => (
                <TimeSlot
                  key={slot.time}
                  time={slot.time}
                  appointment={slot.appointment}
                  isInSchedule={slot.isInSchedule}
                  isAvailable={slot.isAvailable}
                  isSelected={selectedTime === slot.time}
                  onTimeClick={handleTimeClick}
                  onOutOfScheduleConfirm={handleOutOfScheduleConfirm}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Debug: Log de valores antes del modal */}
      {showAppointmentForm && console.log('🔍 [CalendarPage] Valores para el modal:', {
        selectedDateISO: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
        selectedTime,
        selectedDoctorId,
        selectedDoctorName,
        editingAppointment
      })}

      {/* Modal de formulario de cita */}
      {showAppointmentForm && (
        <AppointmentFormModal
          isOpen={showAppointmentForm}
          onClose={handleAppointmentFormClose}
          onSuccess={handleAppointmentFormSuccess}
          selectedDateISO={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
          selectedTime={selectedTime}
          appointment={editingAppointment}
          isOutOfSchedule={isOutOfScheduleAppointment}
          selectedDoctorId={selectedDoctorId}
          selectedDoctorName={selectedDoctorName}
        />
      )}

      {/* Modal de confirmación fuera de horario */}
      <OutOfScheduleModal
        isOpen={showOutOfScheduleModal}
        onClose={() => {
          setShowOutOfScheduleModal(false);
          setOutOfScheduleTime(null);
        }}
        onConfirm={handleOutOfScheduleModalConfirm}
        time={outOfScheduleTime}
        date={selectedDate ? selectedDate.toLocaleDateString('es-ES', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) : ''}
      />
    </div>
  );
};

export default CalendarPage; 