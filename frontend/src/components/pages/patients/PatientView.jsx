import React from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import styles from './PatientView.module.css';

const PatientView = React.memo(() => {
  const { id } = useParams();

  // Aquí iría la lógica para cargar los datos del paciente
  const patient = {
    id,
    first_name: 'Juan',
    last_name: 'Pérez',
    email: 'juan.perez@email.com',
    phone: '(123) 456-7890',
    dni: '12345678',
    date_of_birth: '1990-01-01',
    address: 'Calle Principal 123',
    notes: 'Paciente con antecedentes...'
  };

  return (
    <div className={styles.patientView}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Paciente: {patient.first_name} {patient.last_name}
        </h2>
        <div className={styles.actions}>
          <Button variant="secondary" size="medium">
            Editar
          </Button>
          <Button variant="primary" size="medium">
            Nueva Cita
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Información Personal</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Nombre:</span>
              <span className={styles.value}>{patient.first_name} {patient.last_name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{patient.email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Teléfono:</span>
              <span className={styles.value}>{patient.phone}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>DNI:</span>
              <span className={styles.value}>{patient.dni}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Fecha de Nacimiento:</span>
              <span className={styles.value}>{patient.date_of_birth}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Dirección:</span>
              <span className={styles.value}>{patient.address}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Notas</h3>
          <p className={styles.notes}>{patient.notes}</p>
        </div>
      </div>
    </div>
  );
});

PatientView.displayName = 'PatientView';

export default PatientView; 