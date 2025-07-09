import React from 'react';
import ModalContainer from '../ModalContainer/ModalContainer';
import ModalHeader from '../ModalHeader/ModalHeader';
import ModalFooter from '../ModalFooter/ModalFooter';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import Icon from '../../atoms/Icon/Icon';
import styles from './OutOfScheduleModal.module.css';

const OutOfScheduleModal = ({
  isOpen,
  onClose,
  onConfirm,
  time,
  date,
  doctorName = 'el doctor'
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(time);
    onClose();
  };

  return (
    <ModalContainer onClose={onClose}>
      <ModalHeader
        title="Confirmar Cita Fuera de Horario"
        onClose={onClose}
      />
      
      <div className={styles.content}>
        <div className={styles.warningIcon}>
          <Icon name="clock" size={48} />
        </div>
        
        <Alert type="warning" className={styles.alert}>
          <strong>Horario fuera del horario de consulta regular</strong>
        </Alert>
        
        <div className={styles.details}>
          <p>
            Estás intentando agendar una cita para <strong>{time}</strong> el{' '}
            <strong>{date}</strong>, que está fuera del horario de consulta regular de {doctorName}.
          </p>
          
          <p>
            ¿Deseas continuar con la reserva? El doctor deberá confirmar si puede atenderte en este horario.
          </p>
        </div>
        
        <div className={styles.infoBox}>
          <h4>Información importante:</h4>
          <ul>
            <li>La cita quedará marcada como "pendiente de confirmación"</li>
            <li>El doctor recibirá una notificación para revisar la solicitud</li>
            <li>Podrás recibir una confirmación o cancelación en las próximas horas</li>
            <li>En caso de cancelación, se te notificará por los medios de contacto registrados</li>
          </ul>
        </div>
      </div>

      <ModalFooter>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button 
          type="button" 
          variant="warning" 
          onClick={handleConfirm}
        >
          Confirmar Cita Fuera de Horario
        </Button>
      </ModalFooter>
    </ModalContainer>
  );
};

export default OutOfScheduleModal; 