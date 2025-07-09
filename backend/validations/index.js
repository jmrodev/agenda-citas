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

  // Esquemas de Secretaria
  createSecretarySchema: require('../filters/joi/secretarySchema').createSecretarySchema,
  updateSecretarySchema: require('../filters/joi/secretarySchema').updateSecretarySchema,
  updateSecretaryWithDetailsSchema: require('../filters/joi/secretarySchema').updateSecretaryWithDetailsSchema,

  // Esquemas de Autenticación
  loginSchema: require('../filters/joi/authSchema').loginSchema,
  registerUserSchema: require('../filters/joi/authSchema').registerUserSchema,
  registerDoctorWithUserSchema: require('../filters/joi/authSchema').registerDoctorWithUserSchema,
  registerSecretaryWithUserSchema: require('../filters/joi/authSchema').registerSecretaryWithUserSchema,
  changePasswordSchema: require('../filters/joi/authSchema').changePasswordSchema,
  adminChangeUserPasswordSchema: require('../filters/joi/authSchema').adminChangeUserPasswordSchema,

  // Esquemas de Citas (Appointment Body)
  createAppointmentSchema: require('../filters/joi/appointmentSchema').createAppointmentSchema,
  updateAppointmentSchema: require('../filters/joi/appointmentSchema').updateAppointmentSchema,

  // Esquemas de Doctor (Doctor Body)
  createDoctorSchema: require('../filters/joi/doctorSchema').createDoctorSchema,
  updateDoctorSchema: require('../filters/joi/doctorSchema').updateDoctorSchema,

  // Esquemas de Paciente (Patient Body)
  createPatientSchema: require('../filters/joi/patientSchema').createPatientSchema,
  updatePatientSchema: require('../filters/joi/patientSchema').updatePatientSchema,
  registerPatientWithUserSchema: require('../filters/joi/patientSchema').registerPatientWithUserSchema,
  updateMyPatientProfileSchema: require('../filters/joi/patientSchema').updateMyPatientProfileSchema,
  updatePatientDoctorsSchema: require('../filters/joi/patientSchema').updatePatientDoctorsSchema,

  // Esquemas de Obra Social (HealthInsurance Body)
  createHealthInsuranceSchema: require('../filters/joi/healthInsuranceSchema').createHealthInsuranceSchema,
  updateHealthInsuranceSchema: require('../filters/joi/healthInsuranceSchema').updateHealthInsuranceSchema,

  // Esquemas de Historial Médico (MedicalHistory Body)
  createMedicalHistorySchema: require('../filters/joi/medicalHistorySchema').createMedicalHistorySchema,
  updateMedicalHistorySchema: require('../filters/joi/medicalHistorySchema').updateMedicalHistorySchema,
  createPrescribedMedicationSchema: require('../filters/joi/medicalHistorySchema').createPrescribedMedicationSchema,
  updatePrescribedMedicationSchema: require('../filters/joi/medicalHistorySchema').updatePrescribedMedicationSchema,

  // Esquemas de Prescripción (Prescription Body)
  createPrescriptionSchema: require('../filters/joi/prescriptionSchema').createPrescriptionSchema,
  updatePrescriptionSchema: require('../filters/joi/prescriptionSchema').updatePrescriptionSchema,
  updateMedicationInPrescriptionSchema: require('../filters/joi/prescriptionSchema').updateMedicationInPrescriptionSchema,

  // Esquemas de Horas de Consulta de Doctor (DoctorConsultationHour Body)
  createConsultationHourSchema: require('../filters/joi/doctorConsultationHourSchema').createConsultationHourSchema,
  updateConsultationHourSchema: require('../filters/joi/doctorConsultationHourSchema').updateConsultationHourSchema,
  bulkConsultationHoursSchema: require('../filters/joi/doctorConsultationHourSchema').bulkConsultationHoursSchema,

  // Esquemas de Pagos de Facilidad (FacilityPayment Body)
  createFacilityPaymentSchema: require('../filters/joi/facilityPaymentSchema').createFacilityPaymentSchema,
  updateFacilityPaymentSchema: require('../filters/joi/facilityPaymentSchema').updateFacilityPaymentSchema,

  // Esquemas de Paciente-ObraSocial (PatientHealthInsurance Body)
  addPatientHealthInsuranceSchema: require('../filters/joi/patientHealthInsuranceSchema').addPatientHealthInsuranceSchema,
  updatePatientHealthInsuranceSchema: require('../filters/joi/patientHealthInsuranceSchema').updatePatientHealthInsuranceSchema,
  setPrimaryPatientHealthInsuranceSchema: require('../filters/joi/patientHealthInsuranceSchema').setPrimaryPatientHealthInsuranceSchema,

  // Esquemas de Actividad de Secretaria (SecretaryActivity Body)
  createSecretaryActivitySchema: require('../filters/joi/secretaryActivitySchema').createSecretaryActivitySchema,

  // Esquemas de Configuración de Usuario (UserConfig Body)
  updateUserConfigSchema: require('../filters/joi/userConfigSchema').updateUserConfigSchema,

  // Esquemas para PatientDoctorController
  assignDoctorsToPatientSchema: require('../filters/joi/patientDoctorSchema').assignDoctorsToPatientSchema,
  assignPatientsToDoctorSchema: require('../filters/joi/patientDoctorSchema').assignPatientsToDoctorSchema,

  // Aquí se podrían añadir más esquemas a medida que se centralicen.
  // Por ejemplo, si movemos las validaciones de body de los controladores aquí.
};
