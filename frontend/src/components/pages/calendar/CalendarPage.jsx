import React, { useEffect, useState } from 'react';
import CalendarFilters from '../../molecules/CalendarFilters/CalendarFilters';
import CalendarView from '../../organisms/CalendarView/CalendarView';
import DoctorSelector from '../../molecules/DoctorSelector/DoctorSelector';
import Alert from '../../atoms/Alert/Alert';
import DashboardLayout from '../../templates/DashboardLayout/DashboardLayout';
import ModalContainer from '../../molecules/ModalContainer/ModalContainer';
import ModalHeader from '../../molecules/ModalHeader/ModalHeader';
import ModalFooter from '../../molecules/ModalFooter/ModalFooter';
import Button from '../../atoms/Button/Button';
import Input from '../../atoms/Input/Input';
import { parseAndValidateDate } from '../../../utils/date';
import { authFetch } from '../../../auth/authFetch';

const initialFilters = {
  cita: true,
  disponibilidad: true,
  actividad: true
};

const eventTypeLegend = [
  { type: 'cita', color: '#43a047', label: 'Cita' },
  { type: 'disponibilidad', color: '#1976d2', label: 'Disponibilidad' },
  { type: 'actividad', color: '#ffb300', label: 'Actividad' }
];

const CalendarPage = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [events, setEvents] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  // Filtrar eventos según los filtros activos y el doctor seleccionado
  const filteredEvents = events.filter(ev => {
    if (!filters[ev.type]) return false;
    if (ev.type === 'disponibilidad' || ev.type === 'cita') {
      return ev.doctor_id?.toString() === selectedDoctorId;
    }
    return true; // actividades pueden no estar asociadas a doctor
  });

  // Adaptar a formato esperado por CalendarView (por fecha)
  const eventsByDate = filteredEvents.reduce((acc, ev) => {
    const dateKey = ev.date;
    if (!dateKey) return acc;
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(ev);
    return acc;
  }, {});

  const hasEvents = Object.keys(eventsByDate).length > 0;

  // Abrir modal al hacer click en un día
  const handleDayClick = (date) => {
    setSelectedDate(date);
    setModalOpen(true);
    setSelectedHour('');
    setCreateError('');
    setCreateSuccess('');
  };

  // Crear cita (turno)
  const handleCreateAppointment = async () => {
    setCreating(true);
    setCreateError('');
    setCreateSuccess('');
    try {
      const [year, month, day] = selectedDate.split('-').map(Number);
      const dateObj = { day, month, year };
      const dateError = parseAndValidateDate(dateObj, 'date', true);
      if (dateError) {
        setCreateError(dateError);
        setCreating(false);
        return;
      }
      const token = localStorage.getItem('token');
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          doctor_id: Number(selectedDoctorId),
          date: dateObj,
          time: selectedHour
        })
      });
      if (!res.ok) throw new Error('Error al crear cita');
      setCreateSuccess('Cita creada correctamente');
      setTimeout(() => {
        setModalOpen(false);
        setCreateSuccess('');
      }, 1000);
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  // Horas disponibles (mock: cada 30 min de 8 a 18)
  const hours = Array.from({ length: 20 }, (_, i) => {
    const h = 8 + Math.floor(i / 2);
    const m = i % 2 === 0 ? '00' : '30';
    return `${h.toString().padStart(2, '0')}:${m}`;
  });

  return (
    <DashboardLayout title="Calendario">
      <DoctorSelector
        variant='inline'
        doctors={doctors.map(d => ({ ...d, name: d.name || `Dr. ${d.first_name} ${d.last_name}` }))}
        selectedDoctor={{ doctor_id: selectedDoctorId }}
        onSelect={id => setSelectedDoctorId(id.toString())}
        onClose={() => {}}
      />
      <CalendarFilters filters={filters} onChange={setFilters} />
      {/* Leyenda de tipos de evento */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1rem' }}>
        {eventTypeLegend.map(ev => (
          <div key={ev.type} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 16, height: 16, borderRadius: 4, background: ev.color, display: 'inline-block' }} />
            <span style={{ color: 'var(--text-color-secondary)' }}>{ev.label}</span>
          </div>
        ))}
      </div>
      {error && <Alert type='error'>{error}</Alert>}
      {!loading && !hasEvents && (
        <Alert type="info">No hay eventos para mostrar en el calendario.</Alert>
      )}
      <CalendarView events={eventsByDate} onDayClick={handleDayClick} />
      {loading && <Alert type="info">Cargando eventos...</Alert>}

      {/* Modal para crear cita */}
      {modalOpen && (
        <ModalContainer onClose={() => setModalOpen(false)}>
          <ModalHeader title={`Nuevo turno para el ${selectedDate}`} onClose={() => setModalOpen(false)} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 300 }}>
            <label>Hora:</label>
            <select value={selectedHour} onChange={e => setSelectedHour(e.target.value)}>
              <option value=''>Seleccionar hora</option>
              {hours.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            {/* Aquí puedes agregar selección de paciente si lo necesitas */}
            {createError && <Alert type='error'>{createError}</Alert>}
            {createSuccess && <Alert type='success'>{createSuccess}</Alert>}
          </div>
          <ModalFooter>
            <Button type='button' variant='outline' onClick={() => setModalOpen(false)} disabled={creating}>
              Cancelar
            </Button>
            <Button type='button' variant='primary' onClick={handleCreateAppointment} disabled={creating || !selectedHour}>
              Crear turno
            </Button>
          </ModalFooter>
        </ModalContainer>
      )}
    </DashboardLayout>
  );
};

export default CalendarPage; 