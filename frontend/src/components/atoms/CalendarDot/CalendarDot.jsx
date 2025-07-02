import React from 'react';
import styles from './CalendarDot.module.css';

const CalendarDot = ({ color = 'primary', className = '', ...rest }) => {
  return <span className={[styles.calendarDot, styles[color] || '', className].join(' ').trim()} {...rest} />;
};

export default CalendarDot; 