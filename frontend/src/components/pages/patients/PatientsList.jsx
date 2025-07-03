import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../templates/DashboardLayout/DashboardLayout.jsx';
import Button from '../../atoms/Button/Button';
import Input from '../../atoms/Input/Input';
import Alert from '../../atoms/Alert/Alert';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PatientFormModal from '../../organisms/PatientFormModal/PatientFormModal';

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/patients', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Error al cargar pacientes');
      
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (patientId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este paciente?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/patients/${patientId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Error al eliminar paciente');
      
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PeopleIcon style={{ color: 'var(--primary-color)' }} />
          <h2 style={{ margin: 0 }}>Pacientes ({filteredPatients.length})</h2>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <SearchIcon style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#666'
            }} />
            <Input
              type="text"
              placeholder="Buscar pacientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <AddIcon />
            Nuevo Paciente
          </Button>
        </div>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {/* Lista de pacientes */}
      <div style={{ 
        background: 'var(--surface)', 
        borderRadius: '8px', 
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
          gap: '1rem',
          padding: '1rem',
          background: 'var(--surface-secondary)',
          fontWeight: 'bold',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div>Nombre</div>
          <div>Email</div>
          <div>Teléfono</div>
          <div>Fecha de Nacimiento</div>
          <div>Acciones</div>
        </div>

        {filteredPatients.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            {searchTerm ? 'No se encontraron pacientes con esa búsqueda' : 'No hay pacientes registrados'}
          </div>
        ) : (
          filteredPatients.map(patient => (
            <div key={patient.patient_id} style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
              gap: '1rem',
              padding: '1rem',
              borderBottom: '1px solid var(--border-color)',
              alignItems: 'center'
            }}>
              <div>
                <strong>{patient.first_name} {patient.last_name}</strong>
              </div>
              <div>{patient.email || '-'}</div>
              <div>{patient.phone || '-'}</div>
              <div>{patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString('es-AR') : '-'}</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button 
                  size="small"
                  onClick={() => {
                    setEditingPatient(patient);
                    setShowForm(true);
                  }}
                  style={{ padding: '0.25rem 0.5rem' }}
                >
                  <EditIcon fontSize="small" />
                </Button>
                <Button 
                  size="small"
                  variant="danger"
                  onClick={() => handleDelete(patient.patient_id)}
                  style={{ padding: '0.25rem 0.5rem' }}
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
        onClose={() => {
          setShowForm(false);
          setEditingPatient(null);
        }}
        onSave={() => {
          fetchPatients();
          setShowForm(false);
          setEditingPatient(null);
        }}
      />
    </DashboardLayout>
  );
};

export default PatientsList; 