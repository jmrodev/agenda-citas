import { authFetch } from '../auth/authFetch';

/**
 * Servicio para manejo de citas médicas
 */
export const appointmentService = {
  /**
   * Crear una nueva cita
   * @param {Object} appointmentData - Datos de la cita
   * @returns {Promise<Object>} - Cita creada
   */
  async create(appointmentData) {
    const res = await authFetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Error al crear la cita');
    }

    return res.json();
  },

  /**
   * Actualizar una cita existente
   * @param {number} appointmentId - ID de la cita
   * @param {Object} appointmentData - Datos actualizados de la cita
   * @returns {Promise<Object>} - Cita actualizada
   */
  async update(appointmentId, appointmentData) {
    const res = await authFetch(`/api/appointments/${appointmentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Error al actualizar la cita');
    }

    return res.json();
  },

  /**
   * Obtener una cita por ID
   * @param {number} appointmentId - ID de la cita
   * @returns {Promise<Object>} - Datos de la cita
   */
  async getById(appointmentId) {
    const res = await authFetch(`/api/appointments/${appointmentId}`);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Error al obtener la cita');
    }

    return res.json();
  },

  /**
   * Eliminar una cita
   * @param {number} appointmentId - ID de la cita
   * @returns {Promise<boolean>} - True si se eliminó correctamente
   */
  async delete(appointmentId) {
    const res = await authFetch(`/api/appointments/${appointmentId}`, {
      method: 'DELETE'
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Error al eliminar la cita');
    }

    return true;
  },

  /**
   * Preparar datos de cita para envío al backend
   * @param {Object} formData - Datos del formulario
   * @param {boolean} isOutOfSchedule - Si es fuera de horario
   * @returns {Object} - Datos preparados para el backend
   */
  prepareAppointmentData(formData, isOutOfSchedule = false) {
    // Convertir la fecha del formato YYYY-MM-DD a objeto { day, month, year }
    const dateParts = formData.date.split('-');
    const dateObject = {
      year: parseInt(dateParts[0]),
      month: parseInt(dateParts[1]),
      day: parseInt(dateParts[2])
    };

    return {
      ...formData,
      date: dateObject,
      amount: parseFloat(formData.amount) || 0,
      patient_id: parseInt(formData.patient_id),
      doctor_id: parseInt(formData.doctor_id),
      isOutOfSchedule
    };
  }
}; 