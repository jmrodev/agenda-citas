import React from 'react';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import styles from './CalendarFilters.module.css';

const CalendarFilters = ({ filters, onChange }) => (
  <div className={styles.filters}>
    <Checkbox
      label='Citas'
      checked={filters.cita}
      onChange={() => onChange({ ...filters, cita: !filters.cita })}
    />
    <Checkbox
      label='Disponibilidad'
      checked={filters.disponibilidad}
      onChange={() => onChange({ ...filters, disponibilidad: !filters.disponibilidad })}
    />
    <Checkbox
      label='Actividades'
      checked={filters.actividad}
      onChange={() => onChange({ ...filters, actividad: !filters.actividad })}
    />
  </div>
);

export default CalendarFilters; 