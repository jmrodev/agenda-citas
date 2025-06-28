// SimplePatientsComponent.js
import React, { useState, useEffect } from 'react';
import { usePatients } from '../hooks/usePatients';
import { usePatientFilters } from '../hooks/usePatientFilters';
import PatientsDashboard from './patients/PatientsDashboard';
import PatientFilters from './patients/PatientFilters';
import PatientCard from './patients/PatientCard';
import PatientDetailsModal from './patients/PatientDetailsModal';
import PatientFormModal from './patients/PatientFormModal';

const SimplePatientsComponent = ({ citas }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  // Hooks personalizados
  const { pacientes, estadisticas } = usePatients(citas);
  const { pacientesFiltrados } = usePatientFilters(pacientes, searchTerm, filterStatus);

  // Debug logs
  useEffect(() => {
    console.log('SimplePatientsComponent - citas recibidas:', citas);
    console.log('SimplePatientsComponent - pacientes extraídos:', pacientes);
    console.log('SimplePatientsComponent - estadísticas:', estadisticas);
    console.log('SimplePatientsComponent - pacientes filtrados:', pacientesFiltrados);
  }, [citas, pacientes, estadisticas, pacientesFiltrados]);

  // Handlers
  const handlePatientClick = (paciente) => {
    console.log('Paciente clickeado:', paciente);
    setSelectedPatient(paciente);
  };

  const handleCloseDetails = () => {
    setSelectedPatient(null);
  };

  const handleAddPatient = () => {
    setShowAddForm(true);
    setEditingPatient(null);
  };

  const handleEditPatient = (paciente) => {
    setEditingPatient(paciente);
    setShowAddForm(true);
  };

  const handleDeletePatient = (pacienteId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este paciente?')) {
      // Aquí implementarías la lógica de eliminación
      console.log('Eliminando paciente:', pacienteId);
    }
  };

  const handleSavePatient = (formData) => {
    // Aquí implementarías la lógica de guardar
    console.log('Guardando paciente:', formData);
    setShowAddForm(false);
    setEditingPatient(null);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingPatient(null);
  };

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Debug info */}
      <div style={{
        background: '#f8f9fa',
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#666'
      }}>
        <p><strong>Debug Info:</strong></p>
        <p>Citas recibidas: {citas?.length || 0}</p>
        <p>Pacientes extraídos: {pacientes?.length || 0}</p>
        <p>Pacientes filtrados: {pacientesFiltrados?.length || 0}</p>
        <p>Búsqueda: "{searchTerm}" | Filtro: {filterStatus}</p>
      </div>

      {/* Dashboard */}
      <PatientsDashboard 
        estadisticas={estadisticas}
        onAddPatient={handleAddPatient}
      />

      {/* Filtros */}
      <PatientFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      {/* Lista de Pacientes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1rem'
      }}>
        {pacientesFiltrados.map((paciente) => (
          <PatientCard
            key={paciente.id}
            paciente={paciente}
            onPatientClick={handlePatientClick}
            onEditPatient={handleEditPatient}
            onDeletePatient={handleDeletePatient}
          />
        ))}
      </div>

      {pacientesFiltrados.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#666'
        }}>
          <p style={{ fontSize: '1.2rem', margin: 0 }}>
            {searchTerm ? 'No se encontraron pacientes con ese nombre.' : 'No hay pacientes registrados.'}
          </p>
        </div>
      )}

      {/* Modal de Detalles del Paciente */}
      <PatientDetailsModal
        paciente={selectedPatient}
        onClose={handleCloseDetails}
        onEditPatient={handleEditPatient}
      />

      {/* Modal de Formulario */}
      <PatientFormModal
        isOpen={showAddForm}
        editingPatient={editingPatient}
        onClose={handleCloseForm}
        onSave={handleSavePatient}
      />
    </div>
  );
};

export default SimplePatientsComponent; 