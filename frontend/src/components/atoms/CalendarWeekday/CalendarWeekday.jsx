import React from 'react';
import styles from './CalendarWeekday.module.css';

const CalendarWeekday = ({ children, className = '', ...rest }) => {
  return <span className={[styles.calendarWeekday, className].join(' ').trim()} {...rest}>{children}</span>;
};

export default CalendarWeekday; 