// CitaModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';

const CitaModal = (props) => {
  const [nombre, setNombre] = useState('');

  const handleGuardarCita = () => {
    const cita = {
      nombre,
      fecha: props.selectedSlot ? props.selectedSlot.start : null,
    };
    console.log('Cita guardada:', cita);
    props.onGuardarCita(cita);
    props.onRequestClose();
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onRequestClose}
      contentLabel="Crear Cita"
    >
      <h2>Crear Cita</h2>
      <form>
        <label htmlFor="nombre">
          Nombre:
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </label>
        <label htmlFor="fecha">
          Fecha:
          <input
            type="text"
            id="fecha"
            value={props.selectedSlot ? props.selectedSlot.start : ''}
            disabled
          />
        </label>
        <button type="button" onClick={handleGuardarCita}>
          Guardar Cita
        </button>
      </form>
    </Modal>
  );
};

export default CitaModal;
