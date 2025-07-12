// ===== EXPORTACIÓN CENTRALIZADA DE ESQUEMAS DE VALIDACIÓN =====

// Esquemas base y constantes
const baseSchemas = require('./baseSchemas');
const constants = require('./constants');

// Esquemas principales
const appointmentSchema = require('./appointmentSchema');
const patientSchema = require('./patientSchema');
const doctorSchema = require('./doctorSchema');
const secretarySchema = require('./secretarySchema');
const authSchema = require('./authSchema');
const healthInsuranceSchema = require('./healthInsuranceSchema');
const medicalHistorySchema = require('./medicalHistorySchema');
const prescriptionSchema = require('./prescriptionSchema');

// Esquemas de relaciones
const patientDoctorSchema = require('./patientDoctorSchema');
const patientHealthInsuranceSchema = require('./patientHealthInsuranceSchema');
const doctorConsultationHourSchema = require('./doctorConsultationHourSchema');

// Esquemas de filtros
const appointmentFiltersSchema = require('./appointmentFiltersSchema');
const patientFiltersSchema = require('./patientFiltersSchema');
const doctorFiltersSchema = require('./doctorFiltersSchema');
const healthInsuranceFiltersSchema = require('./healthInsuranceFiltersSchema');
const medicalHistoryFiltersSchema = require('./medicalHistoryFiltersSchema');
const prescriptionFiltersSchema = require('./prescriptionFiltersSchema');
const secretaryActivityFiltersSchema = require('./secretaryActivityFiltersSchema');

// Esquemas adicionales
const referencePersonFiltersSchema = require('./referencePersonFiltersSchema');
const secretaryActivitySchema = require('./secretaryActivitySchema');
const facilityPaymentSchema = require('./facilityPaymentSchema');
const userConfigSchema = require('./userConfigSchema');

module.exports = {
    // Esquemas base y constantes
    ...baseSchemas,
    ...constants,
    
    // Esquemas principales
    ...appointmentSchema,
    ...patientSchema,
    ...doctorSchema,
    ...secretarySchema,
    ...authSchema,
    ...healthInsuranceSchema,
    ...medicalHistorySchema,
    ...prescriptionSchema,
    
    // Esquemas de relaciones
    ...patientDoctorSchema,
    ...patientHealthInsuranceSchema,
    ...doctorConsultationHourSchema,
    
    // Esquemas de filtros
    appointmentFiltersSchema,
    patientFiltersSchema,
    doctorFiltersSchema,
    healthInsuranceFiltersSchema,
    medicalHistoryFiltersSchema,
    prescriptionFiltersSchema,
    secretaryActivityFiltersSchema,
    
    // Esquemas adicionales
    ...referencePersonFiltersSchema,
    ...secretaryActivitySchema,
    ...facilityPaymentSchema,
    ...userConfigSchema
}; 