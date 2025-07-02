import React from 'react';
import styles from './CalendarHeader.module.css';
import IconButton from '../../atoms/IconButton/IconButton';

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const CalendarHeader = ({
  month,
  year,
  onPrev,
  onNext,
  onMonthChange,
  onYearChange,
  showSelectors = false,
  className = '',
  style = {},
  ...rest
}) => {
  return (
    <div className={[styles.calendarHeader, className].join(' ').trim()} style={style} {...rest}>
      <IconButton aria-label='Mes anterior' onClick={onPrev} className={styles.navBtn}>
        <span role='img' aria-label='prev'>◀️</span>
      </IconButton>
      {showSelectors ? (
        <>
          <select
            value={month}
            onChange={e => onMonthChange && onMonthChange(Number(e.target.value))}
            className={styles.select}
          >
            {months.map((m, i) => (
              <option value={i} key={m}>{m}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={e => onYearChange && onYearChange(Number(e.target.value))}
            className={styles.select}
          >
            {Array.from({ length: 11 }, (_, i) => year - 5 + i).map(y => (
              <option value={y} key={y}>{y}</option>
            ))}
          </select>
        </>
      ) : (
        <span className={styles.title}>{months[month]} {year}</span>
      )}
      <IconButton aria-label='Mes siguiente' onClick={onNext} className={styles.navBtn}>
        <span role='img' aria-label='next'>▶️</span>
      </IconButton>
    </div>
  );
};

export default CalendarHeader; 