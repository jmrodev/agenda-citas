import { useContext } from 'react';
import ViewModeContext from '../components/context/ViewModeContext';

/**
 * Hook personalizado para usar el contexto de modo de vista
 * @returns {Object} - Contexto del modo de vista
 */
export const useViewMode = () => {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode debe ser usado dentro de un ViewModeProvider');
  }
  return context;
}; 