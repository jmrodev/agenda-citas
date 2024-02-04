// CalendarComponent.js
import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import CitaModal from './CitaModal'; // Ajusta la ruta según tu estructura de carpetas

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleDateClick = (event) => {
    setSelectedDate(event.start);
    setSelectedSlot(null); // Limpiar el intervalo de tiempo seleccionado
    setModalOpen(true);
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
  };

  const handleGuardarCita = (cita) => {
    // Aquí puedes realizar la lógica para guardar la cita en la lista de eventos
    console.log('Cita guardada:', cita);
    // Actualiza el estado de las citas en tu aplicación
    onRequestClose();
  };
  function onRequestClose() {
    // Aquí va tu código
    console.log('La función onRequestClose ha sido llamada');
  }
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={[
          {
            start: new Date('2024-02-10T10:00:00'),
            end: new Date('2024-02-10T12:00:00'),
            title: 'Cita 1',
          },
          // Otros eventos...
        ]}
        startAccessor="start"
        endAccessor="end"
        selectable={true}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleDateClick}
      />
      <CitaModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        onGuardarCita={handleGuardarCita}
        selectedSlot={selectedSlot}
      />
    </div>
  );
};

export default MyCalendar;
