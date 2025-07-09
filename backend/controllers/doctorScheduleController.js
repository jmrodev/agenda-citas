const doctorConsultationHourService = require('../services/doctorConsultationHourService');

const doctorScheduleController = {
  /**
   * Obtiene los horarios de consulta de un doctor para un día específico
   */
  async getDoctorSchedule(req, res) {
    try {
      const { doctorId } = req.params;
      const { day } = req.query;

      if (!day) {
        return res.status(400).json({
          error: {
            message: 'El parámetro "day" es requerido',
            code: 'MISSING_DAY_PARAMETER'
          }
        });
      }

      const schedule = await doctorConsultationHourService.getDoctorScheduleByDay(doctorId, day);
      
      res.json(schedule);
    } catch (error) {
      console.error('Error in getDoctorSchedule:', error);
      res.status(500).json({
        error: {
          message: 'Error interno del servidor',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  },

  /**
   * Obtiene los horarios de consulta de todos los doctores para un día específico
   */
  async getAllDoctorsSchedule(req, res) {
    try {
      const { day } = req.query;
      console.log('getAllDoctorsSchedule called with day:', day);

      if (!day) {
        return res.status(400).json({
          error: {
            message: 'El parámetro "day" es requerido',
            code: 'MISSING_DAY_PARAMETER'
          }
        });
      }

      const schedule = await doctorConsultationHourService.getAllDoctorsScheduleByDay(day);
      console.log('Schedule result:', schedule);
      
      res.json(schedule);
    } catch (error) {
      console.error('Error in getAllDoctorsSchedule:', error);
      res.status(500).json({
        error: {
          message: 'Error interno del servidor',
          code: 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }
};

module.exports = doctorScheduleController; 