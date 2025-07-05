import React from 'react';
import ModalContainer from '../../molecules/ModalContainer/ModalContainer';
import ModalHeader from '../../molecules/ModalHeader/ModalHeader';
import ModalFooter from '../../molecules/ModalFooter/ModalFooter';
import PatientForm from '../../pages/patients/PatientForm';
import Button from '../../atoms/Button/Button';
import styles from './PatientFormModal.module.css';

const PatientFormModal = React.memo(({ isOpen, onClose, onSuccess }) => {
  const handleClose = () => {
    onClose();
  };

  const handleSuccess = (patientData) => {
    if (onSuccess) {
      onSuccess(patientData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalContainer isOpen={isOpen} onClose={handleClose}>
      <ModalHeader title="Nuevo Paciente" onClose={handleClose} />
      
      <div className={styles.modalContent}>
        <PatientForm onSuccess={handleSuccess} />
      </div>
      
      <ModalFooter>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
      </ModalFooter>
    </ModalContainer>
  );
});

PatientFormModal.displayName = 'PatientFormModal';

export default PatientFormModal; 