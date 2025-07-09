import { authFetch } from '../auth/authFetch';

const API_BASE_URL = 'http://localhost:3001/api';

export const doctorScheduleService = {
  /**
   * Obtiene los horarios de consulta de un doctor para un día específico
   * @param {number} doctorId - ID del doctor
   * @param {string} dayOfWeek - Día de la semana en español (lunes, martes, etc.)
   * @returns {Promise<Array>} Array de horarios de consulta
   */
  async getDoctorSchedule(doctorId, dayOfWeek) {
    try {
      const res = await authFetch(`${API_BASE_URL}/doctors/${doctorId}/schedule?day=${dayOfWeek}`);
      if (!res.ok) {
        throw new Error('Error al obtener horarios del doctor');
      }
      return await res.json();
    } catch (error) {
      console.error('Error fetching doctor schedule:', error);
      return [];
    }
  },

  /**
   * Obtiene los horarios de consulta de todos los doctores para un día específico
   * @param {string} dayOfWeek - Día de la semana en español
   * @returns {Promise<Object>} Objeto con doctor_id como key y horarios como value
   */
  async getAllDoctorsSchedule(dayOfWeek) {
    try {
      const res = await authFetch(`${API_BASE_URL}/doctors/schedule?day=${dayOfWeek}`);
      if (!res.ok) {
        throw new Error('Error al obtener horarios de doctores');
      }
      return await res.json();
    } catch (error) {
      console.error('Error fetching all doctors schedule:', error);
      return {};
    }
  },

  /**
   * Verifica si un horario está dentro del horario de consulta de un doctor
   * @param {string} time - Hora en formato HH:MM
   * @param {Array} schedule - Array de horarios de consulta del doctor
   * @returns {boolean} true si está disponible, false si no
   */
  isTimeInSchedule(time, schedule) {
    if (!schedule || schedule.length === 0) {
      return false; // Si no hay horarios definidos, no está disponible
    }

    const timeMinutes = this.timeToMinutes(time);
    
    return schedule.some(period => {
      const startMinutes = this.timeToMinutes(period.start_time);
      const endMinutes = this.timeToMinutes(period.end_time);
      return timeMinutes >= startMinutes && timeMinutes < endMinutes;
    });
  },

  /**
   * Convierte una hora en formato HH:MM a minutos
   * @param {string} time - Hora en formato HH:MM
   * @returns {number} Minutos desde medianoche
   */
  timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  },

  /**
   * Obtiene el día de la semana en español
   * @param {Date} date - Fecha
   * @returns {string} Día de la semana en español
   */
  getDayOfWeek(date) {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return days[date.getDay()];
  }
}; 