import React, { useState, useEffect } from 'react';
import ModalContainer from '../ModalContainer/ModalContainer';
import ModalHeader from '../ModalHeader/ModalHeader';
import ModalFooter from '../ModalFooter/ModalFooter';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import { authFetch } from '../../../auth/authFetch';
import styles from './HealthInsuranceDeleteModal.module.css';

const HealthInsuranceDeleteModal = ({ isOpen, onClose, insurance, onConfirmDelete }) => {
  const [references, setReferences] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAction, setSelectedAction] = useState('delete'); // 'delete', 'reassign', 'orphan'

  useEffect(() => {
    if (isOpen && insurance) {
      fetchReferences();
    }
  }, [isOpen, insurance]);

  const fetchReferences = async () => {
    try {
      setLoading(true);
      const res = await authFetch(`/api/health-insurances/references/${insurance.insurance_id}`);
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      setReferences(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    onConfirmDelete(insurance.insurance_id, selectedAction);
    onClose();
  };

  const hasReferences = references && (references.patients.length > 0 || references.doctors.length > 0);

  if (!isOpen) return null;

  return (
    <ModalContainer onClose={onClose}>
      <ModalHeader
        title={`Eliminar Obra Social: ${insurance?.name}`}
        onClose={onClose}
      />
      
      <div className={styles.content}>
        {error && (
          <Alert type="error" className={styles.alert}>
            {error}
          </Alert>
        )}

        {loading ? (
          <div className={styles.loading}>
            <p>Cargando referencias...</p>
          </div>
        ) : hasReferences ? (
          <div className={styles.referencesWarning}>
            <Alert type="warning" className={styles.alert}>
              <strong>¡Atención!</strong> Esta obra social tiene referencias activas:
            </Alert>

            {references.patients.length > 0 && (
              <div className={styles.referenceSection}>
                <h4>Pacientes ({references.patients.length})</h4>
                <div className={styles.referenceList}>
                  {references.patients.map(patient => (
                    <div key={patient.patient_id} className={styles.referenceItem}>
                      <strong>{patient.first_name} {patient.last_name}</strong>
                      {patient.email && <span className={styles.email}> - {patient.email}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {references.doctors.length > 0 && (
              <div className={styles.referenceSection}>
                <h4>Doctores ({references.doctors.length})</h4>
                <div className={styles.referenceList}>
                  {references.doctors.map(doctor => (
                    <div key={doctor.doctor_id} className={styles.referenceItem}>
                      <strong>Dr. {doctor.first_name} {doctor.last_name}</strong>
                      {doctor.email && <span className={styles.email}> - {doctor.email}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.actionSelection}>
              <h4>Selecciona una acción:</h4>
              
              <div className={styles.radioGroup}>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="action"
                    value="delete"
                    checked={selectedAction === 'delete'}
                    onChange={(e) => setSelectedAction(e.target.value)}
                  />
                  <span className={styles.radioLabel}>
                    <strong>Eliminar y quitar referencias</strong>
                    <small>Los pacientes y doctores quedarán sin obra social asignada</small>
                  </span>
                </label>

                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="action"
                    value="orphan"
                    checked={selectedAction === 'orphan'}
                    onChange={(e) => setSelectedAction(e.target.value)}
                  />
                  <span className={styles.radioLabel}>
                    <strong>Marcar como "Sin Obra Social"</strong>
                    <small>Se creará una entrada especial para casos sin cobertura</small>
                  </span>
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.noReferences}>
            <p>Esta obra social no tiene referencias activas y puede ser eliminada sin problemas.</p>
          </div>
        )}
      </div>

      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          variant="danger" 
          onClick={handleConfirm}
          disabled={loading}
        >
          {hasReferences ? 'Confirmar Acción' : 'Eliminar'}
        </Button>
      </ModalFooter>
    </ModalContainer>
  );
};

export default HealthInsuranceDeleteModal; 