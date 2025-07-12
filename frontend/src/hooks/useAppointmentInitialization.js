import { useCallback } from 'react';

/**
 * Hook personalizado para inicialización de formularios de citas
 * @param {Function} setValues - Función para establecer valores del formulario
 * @returns {Object} - Funciones de inicialización
 */
export const useAppointmentInitialization = (setValues) => {
  const initializeForEdit = useCallback((appointment) => {
    setValues({
      patient_id: appointment.patient_id ? String(appointment.patient_id) : '',
      doctor_id: appointment.doctor_id ? String(appointment.doctor_id) : '',
      date: appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : '',
      time: appointment.time || '',
      reason: appointment.reason || '',
      type: appointment.type || 'consulta',
      status: appointment.status || 'pendiente',
      service_type: appointment.service_type || '',
      amount: appointment.amount ? String(appointment.amount) : '',
      payment_method: appointment.payment_method || 'efectivo'
    });
  }, [setValues]);

  const initializeForCreate = useCallback((selectedDoctorId, selectedDateISO, selectedTime) => {
    console.log('🔍 [useAppointmentInitialization] initializeForCreate:', {
      selectedDoctorId,
      selectedDateISO,
      selectedTime
    });
    
    const formValues = {
      patient_id: '',
      doctor_id: selectedDoctorId ? String(selectedDoctorId) : '',
      date: selectedDateISO || '',
      time: selectedTime || '',
      reason: '',
      type: 'consulta',
      status: 'pendiente',
      service_type: '',
      amount: '',
      payment_method: 'efectivo'
    };
    
    console.log('🔍 [useAppointmentInitialization] Valores del formulario:', formValues);
    setValues(formValues);
  }, [setValues]);

  const resetForm = useCallback(() => {
    setValues({
      patient_id: '',
      doctor_id: '',
      date: '',
      time: '',
      reason: '',
      type: 'consulta',
      status: 'pendiente',
      service_type: '',
      amount: '',
      payment_method: 'efectivo'
    });
  }, [setValues]);

  return {
    initializeForEdit,
    initializeForCreate,
    resetForm
  };
}; 