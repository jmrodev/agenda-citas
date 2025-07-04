import React, { createContext, useState } from 'react';
import { authFetch } from '../../auth/authFetch';

export const DoctorContext = createContext();

const defaultDoctor = { id: 1, name: 'Dr. Juan Pérez' };

export const DoctorProvider = ({ children }) => {
  const [doctor, setDoctor] = useState(null);

  const setDoctorById = async (id) => {
    try {
      const res = await authFetch(`/api/doctors/${id}`);
      if (!res || !res.ok) throw new Error('No se pudo obtener el doctor');
      const data = await res.json();
      setDoctor(data);
    } catch {
      setDoctor(defaultDoctor);
    }
  };

  return (
    <DoctorContext.Provider value={{ doctor, setDoctor, setDoctorById }}>
      {children}
    </DoctorContext.Provider>
  );
}; 