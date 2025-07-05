import React, { createContext, useState, useCallback } from 'react';

// Contexto separado
const ViewModeContext = createContext();

// Provider component
export const ViewModeProvider = ({ children }) => {
  const [viewMode, setViewMode] = useState('desktop');

  const changeViewMode = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  const value = {
    viewMode,
    changeViewMode
  };

  return (
    <ViewModeContext.Provider value={value}>
      {children}
    </ViewModeContext.Provider>
  );
};

export default ViewModeContext; 