import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './DateRangeSelector.module.css';
import Button from '../../atoms/Button/Button'; // Asumiendo átomo Button
import Select from '../../atoms/Select/Select'; // Asumiendo átomo Select
// Podríamos necesitar un DatePicker atom si queremos rangos personalizados con calendario.
// Por ahora, usaré opciones predefinidas.

const PREDEFINED_RANGES = [
  { label: 'Hoy', value: 'today' },
  { label: 'Ayer', value: 'yesterday' },
  { label: 'Últimos 7 días', value: 'last7days' },
  { label: 'Esta semana', value: 'thisWeek' },
  { label: 'Semana pasada', value: 'lastWeek' },
  { label: 'Este mes', value: 'thisMonth' },
  { label: 'Mes pasado', value: 'lastMonth' },
  { label: 'Este año', value: 'thisYear' },
  { label: 'Año pasado', value: 'lastYear' },
  // { label: 'Personalizado', value: 'custom' } // Para futura implementación con DatePickers
];

const DateRangeSelector = ({ onRangeChange, initialRange = 'thisMonth' }) => {
  const [selectedRange, setSelectedRange] = useState(initialRange);
  // const [customStartDate, setCustomStartDate] = useState(null);
  // const [customEndDate, setCustomEndDate] = useState(null);

  const handleSelectChange = (event) => {
    const newRange = event.target.value;
    setSelectedRange(newRange);
    if (newRange !== 'custom') {
      onRangeChange(calculateDateRange(newRange));
    }
    // Si es 'custom', podríamos abrir los DatePickers
  };

  // Esta función calcularía las fechas de inicio y fin basadas en la selección
  // Es una simplificación. Una implementación real necesitaría una librería como date-fns o moment.
  const calculateDateRange = (rangeKey) => {
    const now = new Date();
    let startDate, endDate = new Date(now); // endDate suele ser 'hoy' o fin del período

    switch (rangeKey) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'yesterday':
        startDate = new Date(now.setDate(now.getDate() - 1));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'last7days':
        endDate = new Date(); // Hasta el final de hoy
        endDate.setHours(23,59,59,999);
        startDate = new Date(now.setDate(now.getDate() - 6)); // Hoy - 6 días = 7 días en total
        startDate.setHours(0,0,0,0);
        break;
      case 'thisWeek': // Asumiendo semana de Domingo a Sábado
        startDate = new Date(now.setDate(now.getDate() - now.getDay()));
        startDate.setHours(0,0,0,0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23,59,59,999);
        break;
      case 'lastWeek':
        endDate = new Date(now.setDate(now.getDate() - now.getDay() - 1)); // Fin del sábado pasado
        endDate.setHours(23,59,59,999);
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 6); // Inicio del domingo pasado
        startDate.setHours(0,0,0,0);
        break;
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Último día del mes actual
        endDate.setHours(23,59,59,999);
        break;
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0); // Último día del mes pasado
        endDate.setHours(23,59,59,999);
        break;
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1); // 1 de Enero
        endDate = new Date(now.getFullYear(), 11, 31); // 31 de Diciembre
        endDate.setHours(23,59,59,999);
        break;
      case 'lastYear':
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        endDate = new Date(now.getFullYear() - 1, 11, 31);
        endDate.setHours(23,59,59,999);
        break;
      default:
        // Por defecto, este mes
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endDate.setHours(23,59,59,999);
    }
    return {
      key: rangeKey,
      label: PREDEFINED_RANGES.find(r => r.value === rangeKey)?.label || rangeKey,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
  };

  // Emitir el rango inicial SOLO después del primer render
  useEffect(() => {
    onRangeChange(calculateDateRange(initialRange));
    // eslint-disable-next-line
  }, [initialRange]);

  return (
    <div className={styles.dateRangeSelector}>
      <Select
        label="Seleccionar Rango:"
        options={PREDEFINED_RANGES}
        value={selectedRange}
        onChange={handleSelectChange}
        className={styles.selectControl}
      />
      {/*
        // Espacio para DatePickers si selectedRange === 'custom'
        selectedRange === 'custom' && (
        <div className={styles.customRangeControls}>
          <Input type="date" label="Desde" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} />
          <Input type="date" label="Hasta" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} />
          <Button onClick={() => onRangeChange({ startDate: customStartDate, endDate: customEndDate, key:'custom', label:'Personalizado' })}>Aplicar</Button>
        </div>
      )*/}
    </div>
  );
};

DateRangeSelector.propTypes = {
  onRangeChange: PropTypes.func.isRequired,
  initialRange: PropTypes.oneOf(PREDEFINED_RANGES.map(r => r.value)),
};

export default DateRangeSelector;
