/**
 * Punto central para todos los esquemas de validación de Joi del backend.
 * Importa y re-exporta los esquemas definidos en el directorio `backend/filters/joi/`.
 * Esto permite un acceso unificado a todas las validaciones desde otras partes de la aplicación,
 * facilitando la gestión y el uso de los esquemas de validación.
 */

// Importaciones de los esquemas de validación existentes
const appointmentFiltersSchema = require('../filters/joi/appointmentFiltersSchema');
const healthInsuranceFiltersSchema = require('../filters/joi/healthInsuranceFiltersSchema');
const medicalHistoryFiltersSchema = require('../filters/joi/medicalHistoryFiltersSchema');
const patientFiltersSchema = require('../filters/joi/patientFiltersSchema');
const prescriptionFiltersSchema = require('../filters/joi/prescriptionFiltersSchema');
const {
  createReferencePersonSchema,
  updateReferencePersonSchema,
  listReferencePersonsSchema
} = require('../filters/joi/referencePersonFiltersSchema');
const secretaryActivityFiltersSchema = require('../filters/joi/secretaryActivityFiltersSchema');

// Podríamos añadir aquí esquemas de validación para el BODY de las peticiones POST/PUT si es necesario,
// por ahora, nos centramos en los filtros y los esquemas ya existentes.

// Exportaciones
module.exports = {
  // Filtros
  appointmentFiltersSchema,
  healthInsuranceFiltersSchema,
  medicalHistoryFiltersSchema,
  patientFiltersSchema,
  prescriptionFiltersSchema,
  listReferencePersonsSchema, // Específico para listar personas de referencia (query params)
  secretaryActivityFiltersSchema,

  // Validación de datos (ejemplos de referencePerson)
  createReferencePersonSchema,
  updateReferencePersonSchema,

  // Aquí se podrían añadir más esquemas a medida que se centralicen.
  // Por ejemplo, si movemos las validaciones de body de los controladores aquí.
};
