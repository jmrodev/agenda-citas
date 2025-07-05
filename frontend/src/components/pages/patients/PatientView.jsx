import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import Spinner from '../../atoms/Spinner/Spinner';
import PatientDoctorsList from '../../molecules/PatientDoctorsList/PatientDoctorsList';
import AddDoctorToPatient from '../../molecules/AddDoctorToPatient/AddDoctorToPatient';
import { authFetch } from '../../../auth/authFetch';
import { getRole } from '../../../auth';
import styles from './PatientView.module.css';

const PatientView = React.memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddDoctor, setShowAddDoctor] = useState(false);

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await authFetch(`/api/patients/${id}`);
      if (!response.ok) {
        throw new Error('Error al cargar paciente');
      }
      const data = await response.json();
      setPatient(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/desktop/patients/edit/${id}`);
  };

  const handleNewAppointment = () => {
    navigate(`/desktop/calendar?patient_id=${id}`);
  };

  const handleDoctorUpdate = () => {
    fetchPatient(); // Recargar datos del paciente
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const userRole = getRole();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size={32} />
        <p>Cargando paciente...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Alert type="error">{error}</Alert>
        <Button onClick={() => navigate('/desktop/patients')}>
          Volver a la lista
        </Button>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className={styles.errorContainer}>
        <Alert type="error">Paciente no encontrado</Alert>
        <Button onClick={() => navigate('/desktop/patients')}>
          Volver a la lista
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.patientView}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>
            {patient.first_name} {patient.last_name}
          </h2>
          {patient.dni && (
            <span className={styles.dni}>DNI: {patient.dni}</span>
          )}
        </div>
        <div className={styles.actions}>
          <Button variant="outline" size="medium" onClick={() => navigate('/desktop/patients')}>
            Volver a la Lista
          </Button>
          {(userRole === 'admin' || userRole === 'secretary') && (
            <Button variant="secondary" size="medium" onClick={handleEdit}>
              Editar
            </Button>
          )}
          <Button variant="primary" size="medium" onClick={handleNewAppointment}>
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
              <span className={styles.value}>{patient.email || 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Teléfono:</span>
              <span className={styles.value}>{patient.phone || 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>DNI:</span>
              <span className={styles.value}>{patient.dni || 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Fecha de Nacimiento:</span>
              <span className={styles.value}>{formatDate(patient.date_of_birth)}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Dirección:</span>
              <span className={styles.value}>{patient.address || 'N/A'}</span>
            </div>
            {patient.preferred_payment_methods && (
              <div className={styles.infoItem}>
                <span className={styles.label}>Métodos de Pago:</span>
                <span className={styles.value}>{patient.preferred_payment_methods}</span>
              </div>
            )}
          </div>
        </div>

        {/* Sección de Doctores */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Doctores Asignados</h3>
            {(userRole === 'admin' || userRole === 'secretary') && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowAddDoctor(!showAddDoctor)}
              >
                {showAddDoctor ? 'Cancelar' : 'Agregar Doctor'}
              </Button>
            )}
          </div>

          {showAddDoctor && (userRole === 'admin' || userRole === 'secretary') && (
            <AddDoctorToPatient
              patientId={patient.patient_id}
              currentDoctors={patient.doctors || []}
              onDoctorAdded={handleDoctorUpdate}
            />
          )}

          <PatientDoctorsList
            patientId={patient.patient_id}
            onUpdate={handleDoctorUpdate}
          />
        </div>

        {/* Sección de Obra Social */}
        {patient.health_insurance_id && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Información de Obra Social</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Obra Social:</span>
                <span className={styles.value}>
                  {patient.health_insurance_name || `ID: ${patient.health_insurance_id}`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Sección de Persona de Referencia */}
        {patient.reference_person && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Persona de Referencia</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Nombre:</span>
                <span className={styles.value}>
                  {patient.reference_person.name} {patient.reference_person.last_name}
                </span>
              </div>
              {patient.reference_person.phone && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Teléfono:</span>
                  <span className={styles.value}>{patient.reference_person.phone}</span>
                </div>
              )}
              {patient.reference_person.relationship && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Relación:</span>
                  <span className={styles.value}>{patient.reference_person.relationship}</span>
                </div>
              )}
              {patient.reference_person.address && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Dirección:</span>
                  <span className={styles.value}>{patient.reference_person.address}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sección de Información Adicional */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Información Adicional</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>ID del Paciente:</span>
              <span className={styles.value}>{patient.patient_id}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Fecha de Creación:</span>
              <span className={styles.value}>{formatDate(patient.created_at)}</span>
            </div>
            {patient.updated_at && (
              <div className={styles.infoItem}>
                <span className={styles.label}>Última Actualización:</span>
                <span className={styles.value}>{formatDate(patient.updated_at)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

PatientView.displayName = 'PatientView';

export default PatientView; 