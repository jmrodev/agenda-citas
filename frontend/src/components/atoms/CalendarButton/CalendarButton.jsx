import React from 'react';
import Button from '../Button/Button'; // Import the main Button component
import styles from './CalendarButton.module.css';

const CalendarButton = ({ children, onClick, disabled, className = '', ...rest }) => {
  return (
    <Button
      className={[styles.calendarButton, className].join(' ').trim()}
      onClick={onClick}
      disabled={disabled}
      {...rest} // Pass other props like aria-label
    >
      {children}
    </Button>
  );
};

CalendarButton.displayName = 'CalendarButton';

export default CalendarButton; 