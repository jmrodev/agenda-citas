import React from 'react';
import styles from './CalendarDay.module.css';

const CalendarDay = ({
  day,
  isSelected,
  isToday,
  isDisabled,
  onClick,
  hasEvent,
  className = '',
  ...rest
}) => {
  return (
    <button
      type='button'
      className={[
        styles.calendarDay,
        isSelected ? styles.selected : '',
        isToday ? styles.today : '',
        isDisabled ? styles.disabled : '',
        className
      ].join(' ').trim()}
      onClick={onClick}
      disabled={isDisabled}
      {...rest}
    >
      {day}
      {hasEvent && <span className={styles['calendar-dot']} />}
    </button>
  );
};

export default CalendarDay; 