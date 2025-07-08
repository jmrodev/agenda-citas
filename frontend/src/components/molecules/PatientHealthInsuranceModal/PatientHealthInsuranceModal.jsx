import React, { useState, useEffect } from 'react';
import ModalContainer from '../ModalContainer/ModalContainer';
import ModalHeader from '../ModalHeader/ModalHeader';
import ModalFooter from '../ModalFooter/ModalFooter';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import Input from '../../atoms/Input/Input';
import Select from '../../atoms/Select/Select';
import { authFetch } from '../../../auth/authFetch';
import styles from './PatientHealthInsuranceModal.module.css';

const PatientHealthInsuranceModal = ({ isOpen, onClose, patient, onSuccess }) => {
  const [mode, setMode] = useState('select'); // 'select', 'existing', 'create'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [healthInsurances, setHealthInsurances] = useState([]);
  const [selectedInsurance, setSelectedInsurance] = useState('');
  const [memberNumber, setMemberNumber] = useState('');
  
  // Campos para crear nueva obra social
  const [newInsurance, setNewInsurance] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadHealthInsurances();
      if (patient?.health_insurance_id) {
        setSelectedInsurance(patient.health_insurance_id.toString());
        setMemberNumber(patient.health_insurance_member_number || '');
      }
    }
  }, [isOpen, patient]);

  const loadHealthInsurances = async () => {
    try {
      const response = await authFetch('/api/health-insurances');
      
      if (response.ok) {
        const data = await response.json();
        setHealthInsurances(data);
      } else {
        const errorText = await response.text();
        throw new Error(`Error al cargar obras sociales: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setError('Error al cargar obras sociales: ' + error.message);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      let insuranceId = selectedInsurance;

      // Si estamos creando una nueva obra social
      if (mode === 'create') {
        const createResponse = await authFetch('/api/health-insurances', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newInsurance)
        });

        if (!createResponse.ok) {
          throw new Error('Error al crear obra social');
        }

        const createdInsurance = await createResponse.json();
        insuranceId = createdInsurance.insurance_id;
      }

      // Agregar la obra social al paciente usando la nueva API
      const addResponse = await authFetch(`/api/patients/${patient.patient_id}/health-insurances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insurance_id: insuranceId,
          member_number: memberNumber,
          is_primary: false // Por defecto no es principal
        })
      });

      if (!addResponse.ok) {
        throw new Error('Error al agregar obra social al paciente');
      }

      onSuccess();
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveInsurance = async () => {
    setLoading(true);
    setError(null);

    try {
      // Obtener todas las obras sociales del paciente
      const insurancesResponse = await authFetch(`/api/patients/${patient.patient_id}/health-insurances`);
      if (!insurancesResponse.ok) {
        throw new Error('Error al obtener obras sociales del paciente');
      }
      
      const insurances = await insurancesResponse.json();
      
      // Remover todas las obras sociales activas
      for (const insurance of insurances) {
        if (insurance.is_active) {
          const response = await authFetch(`/api/patients/${patient.patient_id}/health-insurances/${insurance.patient_insurance_id}`, {
            method: 'DELETE'
          });

          if (!response.ok) {
            throw new Error('Error al remover obra social');
          }
        }
      }

      onSuccess();
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalContainer onClose={onClose}>
      <ModalHeader
        title="Gestionar Obra Social"
        onClose={onClose}
      />
      
      <div className={styles.content}>
        {error && (
          <Alert type="error" className={styles.alert}>
            {error}
          </Alert>
        )}

        {mode === 'select' && (
          <div className={styles.modeSelection}>
            <h4>¿Qué deseas hacer?</h4>
            <div className={styles.modeButtons}>
              <Button
                variant="secondary"
                onClick={() => setMode('existing')}
                className={styles.modeButton}
              >
                Asociar Obra Social Existente
              </Button>
              <Button
                variant="secondary"
                onClick={() => setMode('create')}
                className={styles.modeButton}
              >
                Crear Nueva Obra Social
              </Button>
              {patient?.health_insurance_id && (
                <Button
                  variant="danger"
                  onClick={handleRemoveInsurance}
                  disabled={loading}
                  className={styles.modeButton}
                >
                  Remover Obra Social Actual
                </Button>
              )}
            </div>
          </div>
        )}

        {mode === 'existing' && (
          <div className={styles.existingForm}>
            <h4>Asociar Obra Social Existente</h4>
            
            <div className={styles.formGroup}>
              <label>Seleccionar Obra Social:</label>
              <Select
                value={selectedInsurance}
                onChange={(e) => setSelectedInsurance(e.target.value)}
                options={[
                  { value: '', label: 'Selecciona una obra social' },
                  ...healthInsurances.map(insurance => ({
                    value: insurance.insurance_id.toString(),
                    label: insurance.name
                  }))
                ]}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Número de Socio (opcional):</label>
              <Input
                type="text"
                value={memberNumber}
                onChange={(e) => setMemberNumber(e.target.value)}
                placeholder="Número de socio"
              />
            </div>
          </div>
        )}

        {mode === 'create' && (
          <div className={styles.createForm}>
            <h4>Crear Nueva Obra Social</h4>
            
            <div className={styles.formGroup}>
              <label>Nombre de la Obra Social:</label>
              <Input
                type="text"
                value={newInsurance.name}
                onChange={(e) => setNewInsurance({...newInsurance, name: e.target.value})}
                placeholder="Nombre de la obra social"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Dirección:</label>
              <Input
                type="text"
                value={newInsurance.address}
                onChange={(e) => setNewInsurance({...newInsurance, address: e.target.value})}
                placeholder="Dirección"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Teléfono:</label>
              <Input
                type="tel"
                value={newInsurance.phone}
                onChange={(e) => setNewInsurance({...newInsurance, phone: e.target.value})}
                placeholder="Teléfono"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Email:</label>
              <Input
                type="email"
                value={newInsurance.email}
                onChange={(e) => setNewInsurance({...newInsurance, email: e.target.value})}
                placeholder="Email"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Número de Socio (opcional):</label>
              <Input
                type="text"
                value={memberNumber}
                onChange={(e) => setMemberNumber(e.target.value)}
                placeholder="Número de socio"
              />
            </div>
          </div>
        )}
      </div>

      <ModalFooter>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        {mode !== 'select' && (
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={loading || (mode === 'existing' && !selectedInsurance) || (mode === 'create' && !newInsurance.name)}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        )}
      </ModalFooter>
    </ModalContainer>
  );
};

export default PatientHealthInsuranceModal; 