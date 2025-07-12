// ===== EXPORTACIÓN CENTRALIZADA DE FILTROS SQL =====

// Constantes y helpers
const constants = require('./constants');
const helpers = require('./helpers');

// Filtros principales
const appointmentFilters = require('./appointmentFilters');
const personFilters = require('./personFilters');
const healthInsuranceFilters = require('./healthInsuranceFilters');
const medicalHistoryFilters = require('./medicalHistoryFilters');
const prescriptionFilters = require('./prescriptionFilters');
const referencePersonFilters = require('./referencePersonFilters');
const secretaryActivityFilters = require('./secretaryActivityFilters');

module.exports = {
  // Constantes y helpers
  ...constants,
  ...helpers,
  
  // Filtros principales
  ...appointmentFilters,
  ...personFilters,
  ...healthInsuranceFilters,
  ...medicalHistoryFilters,
  ...prescriptionFilters,
  ...referencePersonFilters,
  ...secretaryActivityFilters
}; 