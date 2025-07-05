import { useContext } from 'react';
import DoctorContext from '../components/context/DoctorContext';

/**
 * Hook personalizado para usar el contexto de doctor
 * @returns {Object} - Contexto del doctor
 */
export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error('useDoctor debe ser usado dentro de un DoctorProvider');
  }
  return context;
}; 