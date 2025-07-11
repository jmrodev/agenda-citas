import React from 'react';
import styles from './CalendarDay.module.css';
import CalendarDot from '../CalendarDot/CalendarDot'; // Import CalendarDot atom

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
      <span className={styles.dayNumber}>{day}</span>
      {hasEvent && <CalendarDot className={styles.eventDotPosition} />}
      {/* Added className for positioning if needed, CalendarDot handles its own base style */}
    </button>
  );
};

export default CalendarDay; 