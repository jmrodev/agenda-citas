import React, { createContext, useState } from 'react';

export const ViewModeContext = createContext();

export const ViewModeProvider = ({ children }) => {
  const [viewMode, setViewMode] = useState('tabla');
  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}; 