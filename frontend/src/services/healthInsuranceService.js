import { authFetch } from '../auth/authFetch';

const API_BASE_URL = 'http://localhost:3001/api';

export const healthInsuranceService = {
  // Obtener todas las obras sociales
  async getAll() {
    try {
      const response = await authFetch(`${API_BASE_URL}/health-insurances`);
      if (!response.ok) {
        throw new Error('Error al obtener obras sociales');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en healthInsuranceService.getAll:', error);
      throw error;
    }
  },

  // Obtener una obra social por ID
  async getById(id) {
    try {
      const response = await authFetch(`${API_BASE_URL}/health-insurances/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener obra social');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en healthInsuranceService.getById:', error);
      throw error;
    }
  },

  // Crear una nueva obra social
  async create(insuranceData) {
    try {
      const response = await authFetch(`${API_BASE_URL}/health-insurances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(insuranceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear obra social');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en healthInsuranceService.create:', error);
      throw error;
    }
  },

  // Actualizar una obra social
  async update(id, insuranceData) {
    try {
      const response = await authFetch(`${API_BASE_URL}/health-insurances/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(insuranceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar obra social');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en healthInsuranceService.update:', error);
      throw error;
    }
  },

  // Eliminar una obra social
  async delete(id) {
    try {
      const response = await authFetch(`${API_BASE_URL}/health-insurances/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar obra social');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en healthInsuranceService.delete:', error);
      throw error;
    }
  },

  // Obtener obras sociales con filtros
  async getWithFilters(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await authFetch(`${API_BASE_URL}/health-insurances/filtros?${queryParams}`);
      if (!response.ok) {
        throw new Error('Error al obtener obras sociales con filtros');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en healthInsuranceService.getWithFilters:', error);
      throw error;
    }
  }
}; 