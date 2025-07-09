import React from 'react';
import styles from './TimeSlot.module.css';
import Button from '../../atoms/Button/Button';
import Icon from '../../atoms/Icon/Icon';

const TimeSlot = ({
  time,
  appointment = null,
  isInSchedule = true,
  isAvailable = true,
  onTimeClick,
  onOutOfScheduleConfirm,
  className = ''
}) => {
  const getSlotStatus = () => {
    if (appointment) {
      return 'booked';
    }
    if (!isInSchedule) {
      return 'out-of-schedule';
    }
    if (isAvailable) {
      return 'available';
    }
    return 'unavailable';
  };

  const getStatusText = () => {
    switch (getSlotStatus()) {
      case 'booked':
        return 'Ocupado';
      case 'out-of-schedule':
        return 'Fuera de horario';
      case 'available':
        return 'Disponible';
      case 'unavailable':
        return 'No disponible';
      default:
        return 'Disponible';
    }
  };

  const getStatusIcon = () => {
    switch (getSlotStatus()) {
      case 'booked':
        return 'user';
      case 'out-of-schedule':
        return 'clock';
      case 'available':
        return 'check';
      case 'unavailable':
        return 'close';
      default:
        return 'check';
    }
  };

  const handleClick = () => {
    if (getSlotStatus() === 'out-of-schedule') {
      // Mostrar confirmación para horario fuera de horario
      if (onOutOfScheduleConfirm) {
        onOutOfScheduleConfirm(time);
      }
    } else {
      // Comportamiento normal
      if (onTimeClick) {
        onTimeClick(time, appointment);
      }
    }
  };

  const isClickable = getSlotStatus() !== 'unavailable';

  return (
    <div 
      className={`
        ${styles.timeSlot} 
        ${styles[getSlotStatus()]} 
        ${isClickable ? styles.clickable : ''} 
        ${className}
      `}
      onClick={isClickable ? handleClick : undefined}
    >
      <div className={styles.timeHeader}>
        <span className={styles.time}>{time}</span>
        <Icon 
          name={getStatusIcon()} 
          size={16} 
          className={styles.statusIcon}
        />
      </div>
      
      <div className={styles.slotContent}>
        {appointment ? (
          <div className={styles.appointmentInfo}>
            <span className={styles.patientName}>
              {appointment.patient_name || 'Paciente'}
            </span>
            <span className={styles.doctorName}>
              Dr. {appointment.doctor_name || 'Doctor'}
            </span>
          </div>
        ) : (
          <span className={styles.statusText}>{getStatusText()}</span>
        )}
      </div>

      {getSlotStatus() === 'out-of-schedule' && (
        <div className={styles.outOfScheduleNote}>
          <small>Click para confirmar fuera de horario</small>
        </div>
      )}
    </div>
  );
};

export default TimeSlot; 