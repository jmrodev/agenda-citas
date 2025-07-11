import { useCallback } from 'react';

/**
 * Hook personalizado para validación específica de citas
 * @param {Object} formData - Datos del formulario
 * @param {string} selectedDoctorId - ID del doctor seleccionado
 * @returns {Object} - Funciones de validación
 */
export const useAppointmentValidation = (formData, selectedDoctorId) => {
  const validateAppointmentForm = useCallback(() => {
    const errors = {};

    // Validación de paciente
    if (!formData.patient_id) {
      errors.patient_id = 'Seleccione un paciente';
    }

    // Validación de doctor
    if (!selectedDoctorId) {
      errors.doctor_id = 'Debe seleccionar un doctor en el calendario';
    }

    // Validación de fecha
    if (!formData.date) {
      errors.date = 'Seleccione una fecha';
    }

    // Validación de hora
    if (!formData.time) {
      errors.time = 'Seleccione una hora';
    }

    // Validación de motivo
    if (!formData.reason?.trim()) {
      errors.reason = 'Ingrese el motivo de la consulta';
    }

    // Validación de monto
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Ingrese un monto válido';
    }

    return errors;
  }, [formData, selectedDoctorId]);

  const validateTimeSlot = useCallback((time, date) => {
    // Validación específica de horarios
    const hour = parseInt(time.split(':')[0]);
    if (hour < 8 || hour > 18) {
      return 'El horario debe estar entre 8:00 y 18:00';
    }
    return null;
  }, []);

  return {
    validateAppointmentForm,
    validateTimeSlot
  };
}; 