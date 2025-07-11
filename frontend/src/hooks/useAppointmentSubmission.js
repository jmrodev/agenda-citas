import { useCallback } from 'react';
import { appointmentService } from '../services/appointmentService';

/**
 * Hook ultra-específico para envío de citas
 * @param {boolean} isEditing - Si está en modo edición
 * @param {boolean} isOutOfSchedule - Si es fuera de horario
 * @param {Function} onSuccess - Callback de éxito
 * @param {Function} onClose - Callback de cierre
 * @returns {Function} - Función de envío
 */
export const useAppointmentSubmission = (isEditing, isOutOfSchedule, onSuccess, onClose) => {
  return useCallback(async (data) => {
    try {
      const preparedData = appointmentService.prepareAppointmentData(data, isOutOfSchedule);
      
      if (isEditing) {
        await appointmentService.update(data.appointment_id, preparedData);
      } else {
        await appointmentService.create(preparedData);
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      throw error;
    }
  }, [isEditing, isOutOfSchedule, onSuccess, onClose]);
}; 