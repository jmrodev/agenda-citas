import React from 'react';
import styles from './CalendarButton.module.css';

const CalendarButton = ({ children, onClick, disabled, className = '', ...rest }) => {
  return (
    <button type='button' className={[styles.calendarButton, className].join(' ').trim()} onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  );
};

export default CalendarButton; 