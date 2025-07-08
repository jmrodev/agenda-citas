import React, { useState } from 'react';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import Chip from '../../atoms/Chip/Chip';
import Icon from '../../atoms/Icon/Icon';
import { authFetch } from '../../../auth/authFetch';
import styles from './PatientHealthInsurancesList.module.css';

const PatientHealthInsurancesList = ({ patientId, healthInsurances = [], onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSetPrimary = async (insuranceId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authFetch(`/api/patients/${patientId}/health-insurances/primary`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ insurance_id: insuranceId })
      });

      if (!response.ok) {
        throw new Error('Error al establecer obra social principal');
      }

      onUpdate();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveInsurance = async (patientInsuranceId) => {
    if (!confirm('¿Estás seguro de que quieres remover esta obra social?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authFetch(`/api/patients/${patientId}/health-insurances/${patientInsuranceId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al remover obra social');
      }

      onUpdate();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (healthInsurances.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Este paciente no tiene obras sociales asociadas.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {error && (
        <Alert type="error" className={styles.alert}>
          {error}
        </Alert>
      )}

      <div className={styles.insurancesList}>
        {healthInsurances.map((insurance) => (
          <div key={insurance.patient_insurance_id} className={styles.insuranceItem}>
            <div className={styles.insuranceInfo}>
              <div className={styles.insuranceHeader}>
                <h4 className={styles.insuranceName}>{insurance.insurance_name}</h4>
                <div className={styles.insuranceBadges}>
                  {insurance.is_primary && (
                    <Chip variant="primary" size="sm">
                      Principal
                    </Chip>
                  )}
                  <Chip variant="secondary" size="sm">
                    {insurance.is_active ? 'Activa' : 'Inactiva'}
                  </Chip>
                </div>
              </div>
              
              {insurance.member_number && (
                <p className={styles.memberNumber}>
                  <strong>Número de Socio:</strong> {insurance.member_number}
                </p>
              )}
              
              <div className={styles.insuranceDetails}>
                {insurance.insurance_address && (
                  <p><strong>Dirección:</strong> {insurance.insurance_address}</p>
                )}
                {insurance.insurance_phone && (
                  <p><strong>Teléfono:</strong> {insurance.insurance_phone}</p>
                )}
                {insurance.insurance_email && (
                  <p><strong>Email:</strong> {insurance.insurance_email}</p>
                )}
              </div>
            </div>

            <div className={styles.insuranceActions}>
              {!insurance.is_primary && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleSetPrimary(insurance.insurance_id)}
                  disabled={loading}
                >
                  Establecer como Principal
                </Button>
              )}
              
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleRemoveInsurance(insurance.patient_insurance_id)}
                disabled={loading}
              >
                <Icon name="trash" size={16} />
                Remover
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientHealthInsurancesList; 