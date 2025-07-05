import { authFetch } from '../auth/authFetch';

const API_BASE_URL = 'http://localhost:3001/api';

export const patientService = {
  // Obtener todos los pacientes
  async getAll() {
    try {
      const response = await authFetch(`${API_BASE_URL}/patients`);
      if (!response.ok) {
        throw new Error('Error al obtener pacientes');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en patientService.getAll:', error);
      throw error;
    }
  },

  // Crear un nuevo paciente
  async create(patientData) {
    try {
      const response = await authFetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear paciente');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en patientService.create:', error);
      throw error;
    }
  },

  // Actualizar un paciente
  async update(id, patientData) {
    try {
      const response = await authFetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar paciente');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en patientService.update:', error);
      throw error;
    }
  },

  // Obtener un paciente por ID
  async getById(id) {
    try {
      const response = await authFetch(`${API_BASE_URL}/patients/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener paciente');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en patientService.getById:', error);
      throw error;
    }
  },

  // Eliminar un paciente
  async delete(id) {
    try {
      const response = await authFetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar paciente');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en patientService.delete:', error);
      throw error;
    }
  },

  // Obtener pacientes con filtros
  async getWithFilters(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await authFetch(`${API_BASE_URL}/patients/filtros?${queryParams}`);
      if (!response.ok) {
        throw new Error('Error al obtener pacientes con filtros');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en patientService.getWithFilters:', error);
      throw error;
    }
  },

  // Actualizar doctores de un paciente
  async updateDoctors(patientId, doctorIds) {
    try {
      const response = await authFetch(`${API_BASE_URL}/patients/${patientId}/doctors`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doctor_ids: doctorIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar doctores del paciente');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en patientService.updateDoctors:', error);
      throw error;
    }
  },

  // Obtener estadísticas del dashboard
  async getDashboardStats() {
    try {
      const response = await authFetch(`${API_BASE_URL}/patients/dashboard-stats`);
      if (!response.ok) {
        throw new Error('Error al obtener estadísticas');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en patientService.getDashboardStats:', error);
      throw error;
    }
  }
}; 