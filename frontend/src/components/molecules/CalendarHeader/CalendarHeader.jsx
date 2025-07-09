import React from 'react';
import styles from './CalendarHeader.module.css';

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const CalendarHeader = ({
  month,
  year,
  onPrev,
  onNext,
  onToday,
  onMonthChange,
  onYearChange,
  showSelectors = false,
  className = '',
  style = {},
  ...rest
}) => {
  return (
    <div className={[styles.calendarHeader, className].join(' ').trim()} style={style} {...rest}>
      <button 
        type="button"
        aria-label='Mes anterior' 
        onClick={onPrev} 
        className={styles.navBtn}
      >
        ◀️
      </button>
      {showSelectors ? (
        <>
          <select
            value={month}
            onChange={e => onMonthChange && onMonthChange(Number(e.target.value))}
            className={styles.select}
            aria-label="Seleccionar mes"
          >
            {months.map((m, i) => (
              <option value={i} key={m}>{m}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={e => onYearChange && onYearChange(Number(e.target.value))}
            className={styles.select}
            aria-label="Seleccionar año"
          >
            {Array.from({ length: 11 }, (_, i) => year - 5 + i).map(y => (
              <option value={y} key={y}>{y}</option>
            ))}
          </select>
        </>
      ) : (
        <span className={styles.title}>{months[month]} {year}</span>
      )}
      <button 
        type="button"
        aria-label='Ir a hoy' 
        onClick={onToday} 
        className={styles.todayBtn}
      >
        Hoy
      </button>
      <button 
        type="button"
        aria-label='Mes siguiente' 
        onClick={onNext} 
        className={styles.navBtn}
      >
        ▶️
      </button>
    </div>
  );
};

export default CalendarHeader; 