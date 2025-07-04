import React, { useState, useEffect } from 'react';
import Button from '../../atoms/Button/Button';
import Input from '../../atoms/Input/Input';
import Alert from '../../atoms/Alert/Alert';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PatientFormModal from '../../organisms/PatientFormModal/PatientFormModal';
import PatientDetailsModal from './PatientDetailsModal';
import styles from './PatientsList.module.css';
import { authFetch } from '../../../utils/authFetch';

const PatientsTablePanel = ({ doctor, crudMode }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [detailsPatient, setDetailsPatient] = useState(null);

  useEffect(() => {
    if (doctor) fetchPatients();
    // eslint-disable-next-line
  }, [doctor]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await authFetch(`/api/patients?doctor_id=${doctor?.doctor_id || doctor?.id || ''}`);
      if (!response || !response.ok) throw new Error('Error al cargar pacientes');
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (patientId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este paciente?')) return;
    try {
      const response = await authFetch(`/api/patients/${patientId}`, {
        method: 'DELETE'
      });
      if (!response || !response.ok) throw new Error('Error al eliminar paciente');
      setPatients(patients.filter(p => p.patient_id !== patientId));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className={styles.pageHeader} style={{ marginBottom: 16 }}>
        <h2 className={styles.title} style={{ margin: 0, fontSize: 22 }}>
          Pacientes ({filteredPatients.length})
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className={styles.searchInputContainer}>
            <SearchIcon className={styles.searchIcon} />
            <Input
              type="text"
              placeholder="Buscar pacientes..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <Button onClick={() => setShowForm(true)} className={styles.addButton}>
            <AddIcon /> Nuevo Paciente
          </Button>
        </div>
      </div>
      {error && <Alert type="error" style={{ marginBottom: '1rem' }}>{error}</Alert>}
      <div className={styles.listContainer}>
        <div className={`${styles.listGrid} ${styles.listHeader}`}>
          <div>Nombre</div>
          <div>Email</div>
          <div>Teléfono</div>
          <div>Fecha de Nacimiento</div>
          {crudMode && <div>Acciones</div>}
        </div>
        {loading ? (
          <div style={{ padding: 16 }}>Cargando pacientes...</div>
        ) : filteredPatients.length === 0 ? (
          <div className={styles.noPatientsMessage}>
            {searchTerm ? 'No se encontraron pacientes con esa búsqueda.' : 'No hay pacientes registrados.'}
          </div>
        ) : (
          filteredPatients.map(patient => (
            <div
              key={patient.patient_id}
              className={`${styles.listGrid} ${styles.listRow}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setDetailsPatient(patient)}
            >
              <div>
                <strong>{patient.first_name} {patient.last_name}</strong>
              </div>
              <div>{patient.email || '-'}</div>
              <div>{patient.phone || '-'}</div>
              <div>{patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString('es-AR') : '-'}</div>
              {crudMode && (
                <div className={styles.actionsCell} onClick={e => e.stopPropagation()}>
                  <Button size="sm" onClick={() => { setEditingPatient(patient); setShowForm(true); }}>
                    <EditIcon fontSize="small" />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(patient.patient_id)}>
                    <DeleteIcon fontSize="small" />
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <PatientFormModal
        open={showForm}
        patient={editingPatient}
        onClose={() => { setShowForm(false); setEditingPatient(null); }}
        onSave={() => { fetchPatients(); setShowForm(false); setEditingPatient(null); }}
      />
      <PatientDetailsModal
        open={!!detailsPatient}
        patient={detailsPatient}
        onClose={() => setDetailsPatient(null)}
      />
    </div>
  );
};

export default PatientsTablePanel; 