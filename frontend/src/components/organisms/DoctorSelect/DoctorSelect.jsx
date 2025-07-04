import React, { useEffect, useState } from 'react';
import { useDoctor } from '../../../hooks/useDoctor';
import { authFetch } from '../../auth/authFetch';
import DoctorSelector from '../../molecules/DoctorSelector/DoctorSelector';

const DoctorSelect = () => {
  const { doctor, setDoctor } = useDoctor();
  const [doctors, setDoctors] = useState([]);
  const [showSelector, setShowSelector] = useState(false);

  // useEffect(() => {
  //   const fetchDoctors = async () => { ... };
  //   fetchDoctors();
  // }, []);

  return (
    <>
      <button
        onClick={() => setShowSelector(true)}
        style={{
          background: 'none',
          border: '1px solid var(--primary-color, #1976d2)',
          color: 'var(--primary-color, #1976d2)',
          cursor: 'pointer',
          fontSize: 16,
          padding: '6px 16px',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginLeft: 16,
          minWidth: 120
        }}
        title="Cambiar doctor"
      >
        <span>{doctor?.name || `Dr. ${doctor?.first_name || ''} ${doctor?.last_name || ''}` || 'Seleccionar doctor'}</span>
      </button>
      {showSelector && (
        <DoctorSelector
          variant='dropdown'
          doctors={doctors.map(d => ({ ...d, name: d.name || `Dr. ${d.first_name} ${d.last_name}` }))}
          selectedDoctor={doctor}
          onSelect={id => {
            const selected = doctors.find(d => (d.id || d.doctor_id) === id);
            setDoctor(selected);
            setShowSelector(false);
          }}
          onClose={() => setShowSelector(false)}
        />
      )}
    </>
  );
};

export default DoctorSelect; 