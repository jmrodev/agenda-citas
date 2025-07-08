import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../../../auth/authFetch';
import CalendarView from '../../organisms/CalendarView/CalendarView';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import Spinner from '../../atoms/Spinner/Spinner';
import AppointmentFormModal from '../../organisms/AppointmentFormModal/AppointmentFormModal';
import styles from './CalendarPage.module.css';

const CalendarPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const navigate = useNavigate();

  // Obtener día actual en formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/appointments');
      if (!res.ok) throw new Error('Error al cargar citas');
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Convertir citas a formato de eventos para el calendario
  const events = appointments.reduce((acc, appointment) => {
    const dateKey = appointment.date.split('T')[0]; // Asegurar formato YYYY-MM-DD
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push({
      id: appointment.appointment_id,
      title: `${appointment.time} - ${appointment.patient_name || 'Paciente'}`,
      time: appointment.time,
      appointment: appointment
    });
    return acc;
  }, {});

  const handleDayClick = (dateKey) => {
    const [year, month, day] = dateKey.split('-').map(Number);
    setSelectedDate(new Date(year, month - 1, day));
    setSelectedTime(null);
  };

  const handleTimeClick = (time, appointment = null) => {
    console.log('handleTimeClick:', { time, appointment });
    setSelectedTime(time);
    setEditingAppointment(appointment);
    setShowAppointmentForm(true);
  };

  const handleAppointmentFormClose = () => {
    console.log('handleAppointmentFormClose - selectedTime antes:', selectedTime);
    setShowAppointmentForm(false);
    setEditingAppointment(null);
    // No limpiar selectedTime aquí, solo limpiar editingAppointment
  };

  const handleAppointmentFormSuccess = () => {
    fetchAppointments(); // Recargar citas
    handleAppointmentFormClose();
  };

  // Obtener citas del día seleccionado
  const selectedDateKey = selectedDate.toISOString().split('T')[0];
  const dayAppointments = events[selectedDateKey] || [];

  // Generar slots de tiempo disponibles (8:00 - 18:00, cada 30 minutos)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const appointment = dayAppointments.find(apt => apt.time === time);
        slots.push({
          time,
          appointment,
          isAvailable: !appointment
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
            <h3>{selectedDate.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</h3>
            <Button 
              onClick={() => {
                setSelectedTime(null);
                setEditingAppointment(null);
                setShowAppointmentForm(true);
              }}
              variant="primary"
              size="small"
            >
              Nueva Cita
            </Button>
          </div>

          <div className={styles.timeSlotsContainer}>
            <h4>Horarios disponibles</h4>
            <div className={styles.timeSlots}>
              {timeSlots.map((slot) => (
                <div 
                  key={slot.time}
                  className={`${styles.timeSlot} ${slot.isAvailable ? styles.available : styles.booked}`}
                  onClick={() => handleTimeClick(slot.time, slot.appointment?.appointment)}
                >
                  <span className={styles.time}>{slot.time}</span>
                  {slot.appointment ? (
                    <div className={styles.appointmentInfo}>
                      <span className={styles.patientName}>
                        {slot.appointment.appointment.patient_name || 'Paciente'}
                      </span>
                      <span className={styles.doctorName}>
                        Dr. {slot.appointment.appointment.doctor_name || 'Doctor'}
                      </span>
                    </div>
                  ) : (
                    <span className={styles.availableText}>Disponible</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de formulario de cita */}
      {showAppointmentForm && (
        <AppointmentFormModal
          isOpen={showAppointmentForm}
          onClose={handleAppointmentFormClose}
          onSuccess={handleAppointmentFormSuccess}
          selectedDateISO={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
          selectedTime={selectedTime}
          appointment={editingAppointment}
        />
      )}
    </div>
  );
};

export default CalendarPage; 