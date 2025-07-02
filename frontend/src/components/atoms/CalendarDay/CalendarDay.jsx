import React from 'react';
import styles from './CalendarDay.module.css';

const CalendarDay = ({ date, selected, today, disabled, onClick, hasEvent, className = '', ...rest }) => {
  return (
    <button
      type='button'
      className={[
        styles.calendarDay,
        selected ? styles.selected : '',
        today ? styles.today : '',
        disabled ? styles.disabled : '',
        className
      ].join(' ').trim()}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {date}
      {hasEvent && <span className={styles['calendar-dot']} />}
    </button>
  );
};

export default CalendarDay; 