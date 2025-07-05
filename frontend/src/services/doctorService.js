import { authFetch } from '../auth/authFetch';

const API_BASE_URL = 'http://localhost:3001/api';

export const doctorService = {
  // Obtener todos los doctores
  async getAll() {
    try {
      const response = await authFetch(`${API_BASE_URL}/doctors`);
      if (!response.ok) {
        throw new Error('Error al obtener doctores');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en doctorService.getAll:', error);
      throw error;
    }
  },

  // Obtener un doctor por ID
  async getById(id) {
    try {
      const response = await authFetch(`${API_BASE_URL}/doctors/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener doctor');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en doctorService.getById:', error);
      throw error;
    }
  },

  // Crear un nuevo doctor
  async create(doctorData) {
    try {
      const response = await authFetch(`${API_BASE_URL}/doctors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear doctor');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en doctorService.create:', error);
      throw error;
    }
  },

  // Actualizar un doctor
  async update(id, doctorData) {
    try {
      const response = await authFetch(`${API_BASE_URL}/doctors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar doctor');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en doctorService.update:', error);
      throw error;
    }
  },

  // Eliminar un doctor
  async delete(id) {
    try {
      const response = await authFetch(`${API_BASE_URL}/doctors/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar doctor');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en doctorService.delete:', error);
      throw error;
    }
  },

  // Obtener doctores con conteo de pacientes
  async getWithPatientCount() {
    try {
      const response = await authFetch(`${API_BASE_URL}/doctors/with-patient-count`);
      if (!response.ok) {
        throw new Error('Error al obtener doctores con conteo de pacientes');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en doctorService.getWithPatientCount:', error);
      throw error;
    }
  }
}; 