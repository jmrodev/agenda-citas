import React from 'react';
import { useViewMode } from '../../context/ViewModeContext';

const ViewModeSelect = () => {
  const { viewMode, setViewMode } = useViewMode();
  return (
    <select
      value={viewMode}
      onChange={e => setViewMode(e.target.value)}
      style={{ marginLeft: 12, minWidth: 100 }}
    >
      <option value='tabla'>Tabla</option>
      <option value='lista'>Lista</option>
      <option value='tarjeta'>Tarjeta</option>
    </select>
  );
};

export default ViewModeSelect; 