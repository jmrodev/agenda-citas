// ===== CONSTANTES COMPARTIDAS PARA FILTROS SQL =====

// Nombres de tablas
const TABLES = {
  APPOINTMENTS: 'appointments',
  PATIENTS: 'patients',
  DOCTORS: 'doctors',
  HEALTH_INSURANCES: 'health_insurances',
  MEDICAL_HISTORIES: 'medical_histories',
  PRESCRIPTIONS: 'prescriptions',
  PATIENT_REFERENCES: 'patient_references',
  SECRETARY_ACTIVITIES: 'secretary_activities',
  PATIENT_DOCTORS: 'patient_doctors',
  PRESCRIPTION_MEDICATIONS: 'prescription_medications',
  MEDICAL_RECORD_PRESCRIBED_MED: 'medical_record_prescribed_med'
};

// Nombres de campos (unificados en inglés)
const FIELDS = {
  // Campos comunes
  ID: 'id',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
  
  // Campos de citas
  PATIENT_ID: 'patient_id',
  DOCTOR_ID: 'doctor_id',
  DATE: 'date',
  TIME: 'time',
  STATUS: 'status',
  APPOINTMENT_TYPE: 'appointment_type',
  NOTES: 'notes',
  PAYMENT_STATUS: 'payment_status',
  PAYMENT_AMOUNT: 'payment_amount',
  PAYMENT_DATE: 'payment_date',
  OUT_OF_SCHEDULE: 'out_of_schedule',
  
  // Campos de pacientes
  FIRST_NAME: 'first_name',
  LAST_NAME: 'last_name',
  DNI: 'dni',
  DATE_OF_BIRTH: 'date_of_birth',
  EMAIL: 'email',
  PHONE: 'phone',
  ADDRESS: 'address',
  HEALTH_INSURANCE_ID: 'health_insurance_id',
  HEALTH_INSURANCE_MEMBER_NUMBER: 'health_insurance_member_number',
  PREFERRED_PAYMENT_METHODS: 'preferred_payment_methods',
  ASSIGNED_DOCTOR_ID: 'assigned_doctor_id',
  
  // Campos de obras sociales
  NAME: 'name',
  CODE: 'code',
  
  // Campos de historial médico
  DIAGNOSIS: 'diagnosis',
  TREATMENT: 'treatment',
  
  // Campos de prescripciones
  PRESCRIPTION_ID: 'prescription_id',
  MEDICATION_NAME: 'medication_name',
  DOSE: 'dose',
  INSTRUCTIONS: 'instructions',
  
  // Campos de personas de referencia
  REFERENCE_ID: 'reference_id',
  RELATIONSHIP: 'relationship',
  
  // Campos de actividades de secretaria
  SECRETARY_ID: 'secretary_id',
  ACTIVITY_TYPE: 'activity_type',
  ACTIVITY_ID: 'activity_id',
  DETAILS: 'details'
};

// Operadores SQL comunes
const OPERATORS = {
  EQUALS: '=',
  NOT_EQUALS: '!=',
  GREATER_THAN: '>',
  GREATER_EQUAL: '>=',
  LESS_THAN: '<',
  LESS_EQUAL: '<=',
  LIKE: 'LIKE',
  IN: 'IN',
  BETWEEN: 'BETWEEN'
};

// Patrones de búsqueda comunes
const SEARCH_PATTERNS = {
  CONTAINS: (value) => `%${value}%`,
  STARTS_WITH: (value) => `${value}%`,
  ENDS_WITH: (value) => `%${value}`,
  EXACT: (value) => value
};

module.exports = {
  TABLES,
  FIELDS,
  OPERATORS,
  SEARCH_PATTERNS
}; 