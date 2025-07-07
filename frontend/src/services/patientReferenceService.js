import { authFetch } from '../auth/authFetch'; // Asumiendo que authFetch maneja la URL base y la autenticación

const API_BASE_URL = 'http://localhost:3001/api'; // O obtener de una config

export const patientReferenceService = {
  /**
   * Crea una nueva persona de referencia para un paciente.
   * @param {number|string} patientId - El ID del paciente.
   * @param {object} referenceData - Datos de la persona de referencia (DNI, nombre, etc.).
   * @returns {Promise<object>} La persona de referencia creada.
   */
  async createReference(patientId, referenceData) {
    try {
      const response = await authFetch(`${API_BASE_URL}/patients/${patientId}/references`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(referenceData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error al crear persona de referencia' }));
        throw new Error(errorData.error || 'Error al crear persona de referencia');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en patientReferenceService.createReference:', error);
      throw error;
    }
  },

  /**
   * Obtiene todas las personas de referencia para un paciente específico.
   * (Nota: Esta función podría no ser necesaria si los datos de referencia ya vienen
   *  embebidos en la respuesta del paciente desde patientService.getById o getPatientWithReferences)
   * @param {number|string} patientId - El ID del paciente.
   * @returns {Promise<Array<object>>} Un array de personas de referencia.
   */
  async getReferencesForPatient(patientId) {
    try {
      const response = await authFetch(`${API_BASE_URL}/patients/${patientId}/references`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error al obtener referencias del paciente' }));
        throw new Error(errorData.error || 'Error al obtener referencias del paciente');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en patientReferenceService.getReferencesForPatient:', error);
      throw error;
    }
  },

  /**
   * Obtiene una persona de referencia específica por su ID.
   * @param {number|string} referenceId - El ID de la persona de referencia.
   * @returns {Promise<object>} La persona de referencia.
   */
  async getReferenceById(referenceId) {
    try {
      const response = await authFetch(`${API_BASE_URL}/patient-references/${referenceId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error al obtener persona de referencia' }));
        throw new Error(errorData.error || 'Error al obtener persona de referencia');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en patientReferenceService.getReferenceById:', error);
      throw error;
    }
  },

  /**
   * Actualiza una persona de referencia existente.
   * @param {number|string} referenceId - El ID de la persona de referencia a actualizar.
   * @param {object} referenceData - Datos actualizados de la persona de referencia.
   * @returns {Promise<object>} La persona de referencia actualizada.
   */
  async updateReference(referenceId, referenceData) {
    try {
      const response = await authFetch(`${API_BASE_URL}/patient-references/${referenceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(referenceData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error al actualizar persona de referencia' }));
        throw new Error(errorData.error || 'Error al actualizar persona de referencia');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en patientReferenceService.updateReference:', error);
      throw error;
    }
  },

  /**
   * Elimina una persona de referencia.
   * @param {number|string} referenceId - El ID de la persona de referencia a eliminar.
   * @returns {Promise<object>} Mensaje de confirmación.
   */
  async deleteReference(referenceId) {
    try {
      const response = await authFetch(`${API_BASE_URL}/patient-references/${referenceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error al eliminar persona de referencia' }));
        throw new Error(errorData.error || 'Error al eliminar persona de referencia');
      }
      return await response.json(); // Debería ser { message: "..." }
    } catch (error) {
      console.error('Error en patientReferenceService.deleteReference:', error);
      throw error;
    }
  }
};
