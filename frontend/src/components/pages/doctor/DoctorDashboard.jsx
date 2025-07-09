import React, { useState, useEffect } from 'react';
import { authFetch } from '../../auth/authFetch';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import Spinner from '../../atoms/Spinner/Spinner';
import styles from './DoctorDashboard.module.css';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (user?.entity_id) {
      fetchAppointments();
    }
  }, [user]);

  const fetchUserInfo = async () => {
    try {
      const res = await authFetch('/api/auth/me');
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      }
    } catch (err) {
      setError('Error al obtener información del usuario');
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await authFetch(`/api/appointments/doctor/${user.entity_id}`);
      if (!res.ok) throw new Error('Error al cargar citas');
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      const res = await authFetch(`/api/appointments/${appointmentId}/confirm`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!res.ok) throw new Error('Error al confirmar cita');
      
      // Recargar citas
      fetchAppointments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRejectAppointment = async (appointmentId) => {
    try {
      const res = await authFetch(`/api/appointments/${appointmentId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!res.ok) throw new Error('Error al rechazar cita');
      
      // Recargar citas
      fetchAppointments();
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pendiente': { class: 'pending', text: 'Pendiente' },
      'confirmada': { class: 'confirmed', text: 'Confirmada' },
      'completada': { class: 'completed', text: 'Completada' },
      'cancelada': { class: 'cancelled', text: 'Cancelada' },
      'pendiente_confirmacion': { class: 'pending-confirmation', text: 'Pendiente Confirmación' }
    };
    
    const config = statusConfig[status] || { class: 'default', text: status };
    
    return (
      <span className={`${styles.statusBadge} ${styles[config.class]}`}>
        {config.text}
      </span>
    );
  };

  const pendingConfirmationAppointments = appointments.filter(apt => apt.status === 'pendiente_confirmacion');
  const otherAppointments = appointments.filter(apt => apt.status !== 'pendiente_confirmacion');

  if (loading) {
    return (
      <div className={styles.container}>
        <h2>Panel del Doctor</h2>
        <div className={styles.loadingContainer}>
          <Spinner size={32} color="primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h2>Panel del Doctor</h2>
        <Alert type="error">{error}</Alert>
        <Button onClick={fetchAppointments}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Panel del Doctor</h2>
      
      {/* Citas pendientes de confirmación */}
      {pendingConfirmationAppointments.length > 0 && (
        <div className={styles.section}>
          <h3>Citas Pendientes de Confirmación (Fuera de Horario)</h3>
          <div className={styles.appointmentsGrid}>
            {pendingConfirmationAppointments.map((appointment) => (
              <div key={appointment.appointment_id} className={styles.appointmentCard}>
                <div className={styles.appointmentHeader}>
                  <h4>{appointment.patient_name}</h4>
                  {getStatusBadge(appointment.status)}
                </div>
                <div className={styles.appointmentDetails}>
                  <p><strong>Fecha:</strong> {new Date(appointment.date).toLocaleDateString('es-ES')}</p>
                  <p><strong>Hora:</strong> {appointment.time}</p>
                  <p><strong>Motivo:</strong> {appointment.reason}</p>
                  <p><strong>Tipo:</strong> {appointment.type}</p>
                </div>
                <div className={styles.appointmentActions}>
                  <Button 
                    onClick={() => handleConfirmAppointment(appointment.appointment_id)}
                    variant="success"
                    size="small"
                  >
                    Confirmar
                  </Button>
                  <Button 
                    onClick={() => handleRejectAppointment(appointment.appointment_id)}
                    variant="error"
                    size="small"
                  >
                    Rechazar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Otras citas */}
      <div className={styles.section}>
        <h3>Todas las Citas</h3>
        <div className={styles.appointmentsGrid}>
          {otherAppointments.map((appointment) => (
            <div key={appointment.appointment_id} className={styles.appointmentCard}>
              <div className={styles.appointmentHeader}>
                <h4>{appointment.patient_name}</h4>
                {getStatusBadge(appointment.status)}
              </div>
              <div className={styles.appointmentDetails}>
                <p><strong>Fecha:</strong> {new Date(appointment.date).toLocaleDateString('es-ES')}</p>
                <p><strong>Hora:</strong> {appointment.time}</p>
                <p><strong>Motivo:</strong> {appointment.reason}</p>
                <p><strong>Tipo:</strong> {appointment.type}</p>
              </div>
            </div>
          ))}
        </div>
        
        {otherAppointments.length === 0 && (
          <p className={styles.noAppointments}>No hay citas programadas.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard; 