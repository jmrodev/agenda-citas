import React, { createContext, useContext, useState, useCallback } from 'react';

// Contexto separado
const DoctorContext = createContext();

// Provider component
export const DoctorProvider = ({ children }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectDoctor = useCallback((doctor) => {
    setSelectedDoctor(doctor);
  }, []);

  const updateDoctors = useCallback((newDoctors) => {
    setDoctors(newDoctors);
  }, []);

  const setLoadingState = useCallback((isLoading) => {
    setLoading(isLoading);
  }, []);

  const value = {
    selectedDoctor,
    doctors,
    loading,
    selectDoctor,
    updateDoctors,
    setLoadingState
  };

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
};

export default DoctorContext; 