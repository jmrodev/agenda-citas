import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../../../auth/authFetch';
import CalendarView from '../../organisms/CalendarView/CalendarView';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import Spinner from '../../atoms/Spinner/Spinner';

const CalendarPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div>
        <h2>Calendario</h2>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <Spinner size={32} color="primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Calendario</h2>
        <Alert type="error">{error}</Alert>
        <Button onClick={fetchAppointments}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div>
      <h2>Calendario</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <Button 
          onClick={() => navigate('/app/calendar/new')}
        >
          Nueva Cita
        </Button>
      </div>

      <CalendarView 
        appointments={appointments}
        onAppointmentClick={(appointment) => {
          navigate(`/app/appointments/${appointment.appointment_id}`);
        }}
      />
    </div>
  );
};

export default CalendarPage; 