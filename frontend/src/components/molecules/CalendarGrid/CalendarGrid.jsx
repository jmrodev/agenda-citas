import React from 'react';
import styles from './CalendarGrid.module.css';
import CalendarDayInfo from '../CalendarDayInfo/CalendarDayInfo';

const CalendarGrid = ({
  days = [],
  renderDay,
  className = '',
  style = {},
  ...rest
}) => {
  return (
    <div className={[styles.calendarGrid, className].join(' ').trim()} style={style} {...rest}>
      {days.map((dayProps, i) =>
        renderDay ? renderDay(dayProps, i) : <CalendarDayInfo key={i} {...dayProps} />
      )}
    </div>
  );
};

export default CalendarGrid; 