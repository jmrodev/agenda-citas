import React, { useEffect, useState } from 'react';
import CalendarFilters from '../../molecules/CalendarFilters/CalendarFilters';
import CalendarView from '../../organisms/CalendarView/CalendarView';
import Alert from '../../atoms/Alert/Alert';

const initialFilters = {
  cita: true,
  disponibilidad: true,
  actividad: true
};

const CalendarPage = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/calendar/events', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al obtener eventos');
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Filtrar eventos según los filtros activos
  const filteredEvents = events.filter(ev => filters[ev.type]);

  // Adaptar a formato esperado por CalendarView (por fecha)
  const eventsByDate = filteredEvents.reduce((acc, ev) => {
    const dateKey = ev.date;
    if (!dateKey) return acc;
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(ev);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <h1>Calendario</h1>
      <CalendarFilters filters={filters} onChange={setFilters} />
      {error && <Alert type='error'>{error}</Alert>}
      <CalendarView events={eventsByDate} />
      {loading && <div>Cargando eventos...</div>}
    </div>
  );
};

export default CalendarPage; 