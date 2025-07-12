import { useCallback } from 'react';
import { validate } from '../utils/validation';

/**
 * Hook personalizado para validación específica de formularios de citas
 * @param {Object} formData - Datos del formulario
 * @param {string|number} selectedDoctorId - ID del doctor seleccionado
 * @returns {Object} - Funciones de validación
 */
export const useAppointmentValidation = (formData, selectedDoctorId) => {
  const validateAppointmentForm = useCallback(() => {
    // Crear un esquema de validación dinámico basado en el contexto
    const validationSchema = {
      patient_id: ['required'],
      date: ['required', 'date'],
      time: ['required', 'time'],
      reason: ['required', { type: 'maxLength', params: [255] }],
      type: [], // Opcional
      status: [], // Opcional
      service_type: [{ type: 'maxLength', params: [100] }], // Opcional
      amount: [{ type: 'minValue', params: [0.01] }], // Opcional
      payment_method: [], // Opcional
      notes: [{ type: 'maxLength', params: [500] }] // Opcional
    };

    // Solo validar doctor_id si no hay un doctor seleccionado en el contexto
    if (!selectedDoctorId) {
      validationSchema.doctor_id = ['required'];
    }

    // Validar el formulario
    const errors = validate(formData, validationSchema);
    
    return errors;
  }, [formData, selectedDoctorId]);

  return {
    validateAppointmentForm
  };
}; 