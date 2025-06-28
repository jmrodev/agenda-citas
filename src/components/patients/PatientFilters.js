import React from 'react';

const PatientFilters = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap'
    }}>
      <input
        type="text"
        placeholder="🔍 Buscar paciente..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: '10px',
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          fontSize: '1rem',
          minWidth: '250px'
        }}
      />
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        style={{
          padding: '10px',
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          fontSize: '1rem',
          background: 'white'
        }}
      >
        <option value="all">Todos los pacientes</option>
        <option value="active">Pacientes activos</option>
        <option value="inactive">Pacientes inactivos</option>
        <option value="upcoming">Con citas próximas</option>
      </select>
    </div>
  );
};

export default PatientFilters; 