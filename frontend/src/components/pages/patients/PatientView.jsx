import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import Spinner from '../../atoms/Spinner/Spinner';
import PatientDoctorsList from '../../molecules/PatientDoctorsList/PatientDoctorsList';
import AddDoctorToPatient from '../../molecules/AddDoctorToPatient/AddDoctorToPatient';
// import { authFetch } from '../../../auth/authFetch'; // No longer directly used
import { patientService } from '../../../services/patientService'; // Import patientService
import { getRole } from '../../../auth';
import styles from './PatientView.module.css';

// Importar los nuevos componentes
import PatientReferencesList from '../../molecules/PatientReferencesList/PatientReferencesList';
// Descomentar la importación del modal
import ReferencePersonFormModal from '../../organisms/ReferencePersonFormModal/ReferencePersonFormModal';
// patientReferenceService no se usa directamente aquí si el modal lo maneja todo.


const PatientView = React.memo(() => {
  const { id: patientId } = useParams(); // Renombrar id a patientId para claridad
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddDoctor, setShowAddDoctor] = useState(false);

  // Estado para el modal de agregar persona de referencia
  const [showReferenceFormModal, setShowReferenceFormModal] = useState(false);
  // Estado para pasar una referencia a editar (null si es para crear)
  const [editingReference, setEditingReference] = useState(null);


  const loadPatientData = async () => {
    setLoading(true);
    setError('');
    try {
      // patientService.getById ahora debería devolver `reference_persons` como un array
      const data = await patientService.getById(patientId);
      setPatient(data);
    } catch (err) {
      setError(err.message || 'Error al cargar paciente');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      loadPatientData();
    }
  }, [patientId]);

  const handleEdit = () => {
    navigate(`/desktop/patients/edit/${patientId}`);
  };

  const handleNewAppointment = () => {
    navigate(`/desktop/calendar?patient_id=${patientId}`);
  };

  // Esta función se llamará cuando se actualicen doctores o referencias
  const handleDataUpdate = () => {
    loadPatientData(); // Recargar todos los datos del paciente
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

  const canManageReferences = userRole === 'admin' || userRole === 'secretary';

  // Se elimina hasValidReferencePerson ya que ahora mostraremos una lista o un mensaje.
  // const hasValidReferencePerson = ...;

  return (
    <div className={styles.patientView}>
      {/* Header del paciente: Título y Acciones */}
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
        {/* Sección Información Personal */}
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

        {/* Sección de Doctores Asignados */}
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
              onDoctorAdded={handleDataUpdate} // Cambiado a handleDataUpdate
            />
          )}
          <PatientDoctorsList
            patientId={patient.patient_id}
            onUpdate={handleDataUpdate} // Cambiado a handleDataUpdate
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
              {patient.health_insurance?.address && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Dirección:</span>
                  <span className={styles.value}>{patient.health_insurance.address}</span>
                </div>
              )}
              {patient.health_insurance?.phone && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Teléfono:</span>
                  <span className={styles.value}>{patient.health_insurance.phone}</span>
                </div>
              )}
              {patient.health_insurance?.email && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Email:</span>
                  <span className={styles.value}>{patient.health_insurance.email}</span>
                </div>
              )}
              {patient.health_insurance_member_number && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Número de Socio:</span>
                  <span className={styles.value}>{patient.health_insurance_member_number}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sección de Personas de Referencia MODIFICADA */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Personas de Referencia</h3>
            {canManageReferences && (
              <Button
                size="sm"
                variant="primary" // Cambiado a primary para destacar
                onClick={() => {
                  setEditingReference(null); // Asegurar que es para crear una nueva referencia
                  setShowReferenceFormModal(true);
                }}
              >
                Agregar Referencia
              </Button>
            )}
          </div>

          {/* Integrar PatientReferencesList */}
          <PatientReferencesList
               references={patient.reference_persons || []}
               patientId={patient.patient_id} // Asegurarse que patient.patient_id exista
               onUpdate={handleDataUpdate}
               onEditRequest={(reference) => { // Cambiado onEdit a onEditRequest para claridad
                 setEditingReference(reference);
                 setShowReferenceFormModal(true);
               }}
          />
          {/* Eliminar el placeholder anterior */}
        </div>

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

      {/* Modal para agregar/editar persona de referencia */}
      {/* Descomentar y activar el modal */}
      {showReferenceFormModal && patient && ( // Asegurar que patient no sea null para pasar patient.patient_id
        <ReferencePersonFormModal
          isOpen={showReferenceFormModal}
          onClose={() => {
            setShowReferenceFormModal(false);
            setEditingReference(null); // Limpiar referencia en edición al cerrar
          }}
          patientId={patient.patient_id} // Pasar el ID del paciente actual
          referenceToEdit={editingReference} // Pasar la referencia a editar (null si es nueva)
          onSuccess={() => {
            setShowReferenceFormModal(false);
            setEditingReference(null); // Limpiar
            handleDataUpdate(); // Recargar datos del paciente para ver la nueva/referencia actualizada
          }}
        />
      )}
    </div>
  );
});

PatientView.displayName = 'PatientView';

export default PatientView; 