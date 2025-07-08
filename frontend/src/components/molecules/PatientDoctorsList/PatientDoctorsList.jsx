import React, { useState, useEffect } from 'react';
import Button from '../../atoms/Button/Button';
import Badge from '../../atoms/Badge/Badge';
import Alert from '../../atoms/Alert/Alert';
import Spinner from '../../atoms/Spinner/Spinner';
import { authFetch } from '../../../auth/authFetch';
import styles from './PatientDoctorsList.module.css';

const PatientDoctorsList = ({ patientId, onUpdate }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingDoctor, setRemovingDoctor] = useState(null);

  useEffect(() => {
    if (patientId) {
      fetchDoctors();
    }
  }, [patientId]);

  const fetchDoctors = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await authFetch(`/api/patient-doctors/patient/${patientId}/doctors`);
      if (!response.ok) {
        throw new Error('Error al cargar doctores');
      }
      const data = await response.json();
      setDoctors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDoctor = async (doctorId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este doctor del paciente?')) {
      return;
    }

    setRemovingDoctor(doctorId);
    try {
      const response = await authFetch(`/api/patient-doctors/patient/${patientId}/doctors/${doctorId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar doctor');
      }

      // Actualizar lista local
      setDoctors(prev => prev.filter(d => d.doctor_id !== doctorId));
      
      // Notificar al componente padre
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setRemovingDoctor(null);
    }
  };

  if (loading) {
    return (
      <section className={styles.container}>
        <header className={styles.header}>
          <h3>Doctores Asignados</h3>
        </header>
        <section className={styles.loading}>
          <Spinner size={24} />
          <span>Cargando doctores...</span>
        </section>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h3>Doctores Asignados</h3>
        <Badge variant="info">{doctors.length} doctor{doctors.length !== 1 ? 'es' : ''}</Badge>
      </header>

      {error && (
        <Alert type="error" className={styles.error}>
          {error}
        </Alert>
      )}

      {doctors.length === 0 ? (
        <section className={styles.empty}>
          <p>No hay doctores asignados a este paciente</p>
        </section>
      ) : (
        <ul className={styles.doctorsList}>
          {doctors.map(doctor => (
            <li key={doctor.doctor_id} className={styles.doctorItem}>
              <div className={styles.doctorInfo}>
                <div className={styles.doctorName}>
                  {doctor.first_name} {doctor.last_name} {/* No añadir "Dr." aquí, ya viene en los datos */}
                </div>
                <div className={styles.doctorDetails}>
                  {doctor.specialty && (
                    <span className={styles.specialty}>{doctor.specialty}</span>
                  )}
                  {doctor.email && (
                    <span className={styles.email}>{doctor.email}</span>
                  )}
                </div>
              </div>
              <footer className={styles.actions}>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleRemoveDoctor(doctor.doctor_id)}
                  disabled={removingDoctor === doctor.doctor_id}
                  loading={removingDoctor === doctor.doctor_id}
                >
                  {removingDoctor === doctor.doctor_id ? 'Eliminando...' : 'Eliminar'}
                </Button>
              </footer>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default PatientDoctorsList; 