/**
 * Índice central de modelos atomizados
 * Exporta todos los modelos organizados por categorías
 */

// Modelos base
const BaseModel = require('./base/BaseModel');

// Modelos de entidades principales (atomizados)
const UserModel = require('./entities/UserModel');
const DoctorModel = require('./entities/DoctorModel');
const PatientModel = require('./entities/PatientModel');
const AppointmentModel = require('./entities/AppointmentModel');
const HealthInsuranceModel = require('./entities/HealthInsuranceModel');
const SecretaryModel = require('./entities/SecretaryModel');
const MedicalHistoryModel = require('./entities/MedicalHistoryModel');
const PrescriptionModel = require('./entities/PrescriptionModel');
const PatientReferenceModel = require('./entities/PatientReferenceModel');
const DoctorConsultationHourModel = require('./entities/DoctorConsultationHourModel');
const FacilityPaymentModel = require('./entities/FacilityPaymentModel');
const SecretaryActivityModel = require('./entities/SecretaryActivityModel');

// Modelos de relaciones (atomizados)
const PatientDoctorModel = require('./relations/PatientDoctorModel');
const PatientHealthInsuranceModel = require('./relations/PatientHealthInsuranceModel');

// Modelos antiguos (para compatibilidad)
const oldSecretaryModel = require('./secretaryModel');
const oldMedicalHistoryModel = require('./medicalHistoryModel');
const oldPrescriptionModel = require('./prescriptionModel');
const oldPatientReferenceModel = require('./patientReferenceModel');
const oldSecretaryActivityModel = require('./secretaryActivityModel');
const oldPrescriptionMedicationModel = require('./prescriptionMedicationModel');
const oldDoctorConsultationHourModel = require('./doctorConsultationHourModel');
const oldFacilityPaymentModel = require('./facilityPaymentModel');
const oldMedicalRecordPrescribedMedModel = require('./medicalRecordPrescribedMedModel');
const oldPatientHealthInsuranceModel = require('./patientHealthInsuranceModel');

/**
 * Exportaciones organizadas por categorías
 */
module.exports = {
  // Modelos base
  BaseModel,

  // Modelos de entidades principales (atomizados)
  UserModel,
  DoctorModel,
  PatientModel,
  AppointmentModel,
  HealthInsuranceModel,
  SecretaryModel,
  MedicalHistoryModel,
  PrescriptionModel,
  PatientReferenceModel,
  DoctorConsultationHourModel,
  FacilityPaymentModel,
  SecretaryActivityModel,

  // Modelos de relaciones (atomizados)
  PatientDoctorModel,
  PatientHealthInsuranceModel,

  // Modelos antiguos (para compatibilidad)
  oldSecretaryModel,
  oldMedicalHistoryModel,
  oldPrescriptionModel,
  oldPatientReferenceModel,
  oldSecretaryActivityModel,
  oldPrescriptionMedicationModel,
  oldDoctorConsultationHourModel,
  oldFacilityPaymentModel,
  oldMedicalRecordPrescribedMedModel,
  oldPatientHealthInsuranceModel,

  // Exportaciones por compatibilidad con código existente
  // Estas mantienen la estructura anterior para no romper el código existente
  userModel: UserModel,
  doctorModel: DoctorModel,
  patientModel: PatientModel,
  appointmentModel: AppointmentModel,
  healthInsuranceModel: HealthInsuranceModel,
  patientDoctorModel: PatientDoctorModel,
  secretaryModel: SecretaryModel,
  medicalHistoryModel: MedicalHistoryModel,
  prescriptionModel: PrescriptionModel,
  patientReferenceModel: PatientReferenceModel,
  secretaryActivityModel: SecretaryActivityModel,
  doctorConsultationHourModel: DoctorConsultationHourModel,
  facilityPaymentModel: FacilityPaymentModel,
  patientHealthInsuranceModel: PatientHealthInsuranceModel,
}; 