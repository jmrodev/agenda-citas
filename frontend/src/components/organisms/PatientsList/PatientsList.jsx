import React, { useState, useMemo, useCallback } from 'react';
import DashboardLayout from '../../templates/DashboardLayout/DashboardLayout.jsx';
import Button from '../../atoms/Button/Button';
import Input from '../../atoms/Input/Input';
import Alert from '../../atoms/Alert/Alert';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PatientFormModal from '../PatientFormModal/PatientFormModal';
import styles from './PatientsList.module.css';
import { parseAndValidateDate } from '../../../utils/date';
import { authFetch } from '../../../auth/authFetch';
import { createLogger } from '../../../utils/debug.js';

const PatientsList = React.memo(() => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const logger = createLogger('PatientsList');

  // Memoizar pacientes filtrados
  const filteredPatients = useMemo(() => {
    return patients.filter(patient =>
      patient.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

  // Callbacks para handlers
  const fetchPatients = useCallback(async () => {
    try {
      const response = await authFetch('/api/patients');
      if (!response || !response.ok) throw new Error('Error al cargar pacientes');
      const data = await response.json();
      setPatients(data);
      logger.log('Pacientes recibidos:', data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [logger]);

  const handleDelete = useCallback(async (patientId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este paciente?')) return;
    try {
      const response = await authFetch(`/api/patients/${patientId}`, {
        method: 'DELETE'
      });
      if (!response || !response.ok) throw new Error('Error al eliminar paciente');
      setPatients(prev => prev.filter(p => p.patient_id !== patientId));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleAddPatient = useCallback(() => {
    setShowForm(true);
  }, []);

  const handleEditPatient = useCallback((patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditingPatient(null);
  }, []);

  const handleSavePatient = useCallback(() => {
    fetchPatients();
    setShowForm(false);
    setEditingPatient(null);
  }, [fetchPatients]);

  if (loading) {
    return (
      <DashboardLayout title="Gestión de Pacientes">
        <div>Cargando pacientes...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Gestión de Pacientes">
      {/* Header con búsqueda y botón agregar */}
      <div className={styles.pageHeader}>
        <div className={styles.titleGroup}>
          <PeopleIcon className={styles.titleIcon} />
          <h2 className={styles.title}>Pacientes ({filteredPatients.length})</h2>
        </div>
        
        <div className={styles.actionsGroup}>
          <div className={styles.searchInputContainer}>
            <SearchIcon className={styles.searchIcon} />
            <Input
              type="text"
              placeholder="Buscar pacientes..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
          </div>
          <Button 
            onClick={handleAddPatient}
            className={styles.addButton}
          >
            <AddIcon />
            Nuevo Paciente
          </Button>
        </div>
      </div>

      {error && <Alert type="error" style={{ marginBottom: '1rem' }}>{error}</Alert>}

      {/* Lista de pacientes */}
      <div className={styles.listContainer}>
        <div className={`${styles.listGrid} ${styles.listHeader}`}>
          <div>Nombre</div>
          <div>Email</div>
          <div>Teléfono</div>
          <div>Fecha de Nacimiento</div>
          <div>Acciones</div>
        </div>

        {filteredPatients.length === 0 ? (
          <div className={styles.noPatientsMessage}>
            {searchTerm ? 'No se encontraron pacientes con esa búsqueda.' : 'No hay pacientes registrados.'}
          </div>
        ) : (
          filteredPatients.map(patient => (
            <div key={patient.patient_id} className={`${styles.listGrid} ${styles.listRow}`}>
              <div>
                <strong>{patient.first_name} {patient.last_name}</strong>
              </div>
              <div>{patient.email || '-'}</div>
              <div>{patient.phone || '-'}</div>
              <div>{patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString('es-AR') : '-'}</div>
              <div className={styles.actionsCell}>
                <Button 
                  size="sm"
                  onClick={() => handleEditPatient(patient)}
                >
                  <EditIcon fontSize="small" />
                </Button>
                <Button 
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(patient.patient_id)}
                >
                  <DeleteIcon fontSize="small" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de formulario */}
      <PatientFormModal
        open={showForm}
        patient={editingPatient}
        onClose={handleCloseForm}
        onSave={handleSavePatient}
      />
    </DashboardLayout>
  );
});

PatientsList.displayName = 'PatientsList';

export default PatientsList; 