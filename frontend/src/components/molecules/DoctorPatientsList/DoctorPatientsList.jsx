import React, { useState, useEffect } from 'react';
import Button from '../../atoms/Button/Button';
import Badge from '../../atoms/Badge/Badge';
import Alert from '../../atoms/Alert/Alert';
import Spinner from '../../atoms/Spinner/Spinner';
import { authFetch } from '../../../auth/authFetch';
import styles from './DoctorPatientsList.module.css';

const DoctorPatientsList = ({ doctorId, onUpdate }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingPatient, setRemovingPatient] = useState(null);

  useEffect(() => {
    if (doctorId) {
      fetchPatients();
    }
  }, [doctorId]);

  const fetchPatients = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await authFetch(`/api/patient-doctors/doctor/${doctorId}/patients`);
      if (!response.ok) {
        throw new Error('Error al cargar pacientes');
      }
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePatient = async (patientId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este paciente del doctor?')) {
      return;
    }

    setRemovingPatient(patientId);
    try {
      const response = await authFetch(`/api/patient-doctors/doctor/${doctorId}/patients/${patientId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar paciente');
      }

      // Actualizar lista local
      setPatients(prev => prev.filter(p => p.patient_id !== patientId));
      
      // Notificar al componente padre
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setRemovingPatient(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h3>Pacientes Asignados</h3>
        <div className={styles.loading}>
          <Spinner size={24} />
          <span>Cargando pacientes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Pacientes Asignados</h3>
        <Badge variant="info">{patients.length} paciente{patients.length !== 1 ? 's' : ''}</Badge>
      </div>

      {error && (
        <Alert type="error" className={styles.error}>
          {error}
        </Alert>
      )}

      {patients.length === 0 ? (
        <div className={styles.empty}>
          <p>No hay pacientes asignados a este doctor</p>
        </div>
      ) : (
        <div className={styles.patientsList}>
          {patients.map(patient => (
            <div key={patient.patient_id} className={styles.patientItem}>
              <div className={styles.patientInfo}>
                <div className={styles.patientName}>
                  {patient.first_name} {patient.last_name}
                </div>
                <div className={styles.patientDetails}>
                  {patient.dni && (
                    <span className={styles.dni}>DNI: {patient.dni}</span>
                  )}
                  {patient.email && (
                    <span className={styles.email}>{patient.email}</span>
                  )}
                  {patient.phone && (
                    <span className={styles.phone}>{patient.phone}</span>
                  )}
                  {patient.date_of_birth && (
                    <span className={styles.birthDate}>
                      Nac: {formatDate(patient.date_of_birth)}
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.actions}>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleRemovePatient(patient.patient_id)}
                  disabled={removingPatient === patient.patient_id}
                  loading={removingPatient === patient.patient_id}
                >
                  {removingPatient === patient.patient_id ? 'Eliminando...' : 'Eliminar'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorPatientsList; 