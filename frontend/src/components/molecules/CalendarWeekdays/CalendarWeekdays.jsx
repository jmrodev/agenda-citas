import React from 'react';
import styles from './CalendarWeekdays.module.css';

const defaultDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const CalendarWeekdays = ({
  days = defaultDays,
  className = '',
  style = {},
  ...rest
}) => {
  return (
    <div className={[styles.calendarWeekdays, className].join(' ').trim()} style={style} {...rest}>
      {days.map((d, i) => (
        <span className={styles.day} key={i}>{d}</span>
      ))}
    </div>
  );
};

export default CalendarWeekdays; 