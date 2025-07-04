import React, { createContext, useContext, useState, useEffect } from 'react';

const DoctorContext = createContext();

const defaultDoctor = { id: 1, name: 'Dr. Juan Pérez' };

export const useDoctor = () => useContext(DoctorContext);

export const DoctorProvider = ({ children }) => {
  const [doctor, setDoctor] = useState(null);

  const setDoctorById = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/doctors/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('No se pudo obtener el doctor');
      const data = await res.json();
      setDoctor(data);
    } catch (err) {
      setDoctor(defaultDoctor);
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/doctors', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data && data.length > 0) {
          const firstDoctor = data[0];
          setDoctor(firstDoctor);
        } else {
          setDoctor(defaultDoctor);
        }
      } catch (err) {
        setDoctor(defaultDoctor);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <DoctorContext.Provider value={{ doctor, setDoctor, setDoctorById }}>
      {children}
    </DoctorContext.Provider>
  );
}; 