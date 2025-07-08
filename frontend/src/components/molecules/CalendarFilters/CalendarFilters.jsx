import React from 'react';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import styles from './CalendarFilters.module.css';

const CalendarFilters = ({ filters, onChange }) => (
  <div className={styles.filters}>
    <Checkbox
      aria-label='Citas' // Usar aria-label para que el input sea accesible por nombre
      checked={filters.cita}
      onChange={() => onChange({ ...filters, cita: !filters.cita })}
    />
    {/* Idealmente, habría un <label htmlFor="citas-cb">Citas</label> asociado al input con id="citas-cb" */}
    {/* Por ahora, el texto es solo visual y no está conectado. */}
    <span className={styles.label}>Citas</span>

    <Checkbox
      aria-label='Disponibilidad'
      checked={filters.disponibilidad}
      onChange={() => onChange({ ...filters, disponibilidad: !filters.disponibilidad })}
    />
    <span className={styles.label}>Disponibilidad</span>

    <Checkbox
      aria-label='Actividades'
      checked={filters.actividad}
      onChange={() => onChange({ ...filters, actividad: !filters.actividad })}
    />
  </div>
);

export default CalendarFilters; 