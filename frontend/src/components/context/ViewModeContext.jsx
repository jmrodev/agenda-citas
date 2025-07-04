import React, { createContext, useContext, useState } from 'react';

const ViewModeContext = createContext();
export const useViewMode = () => useContext(ViewModeContext);

export const ViewModeProvider = ({ children }) => {
  const [viewMode, setViewMode] = useState('tabla');
  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}; 