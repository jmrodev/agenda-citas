// ===== CONSTANTES COMPARTIDAS PARA VALIDACIONES =====

// Estados de citas
const APPOINTMENT_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'ABSENT'];

// Estados de pago
const PAYMENT_STATUSES = ['PENDING', 'PAID', 'PARTIAL', 'WAIVED'];

// Roles de usuario
const USER_ROLES = ['admin', 'doctor', 'patient', 'secretary'];

// Turnos de secretaria
const SECRETARY_SHIFTS = ['MAÑANA', 'TARDE', 'NOCHE', 'COMPLETO'];

// Especialidades médicas comunes
const MEDICAL_SPECIALTIES = [
    'MEDICINA GENERAL',
    'CARDIOLOGÍA',
    'DERMATOLOGÍA',
    'ENDOCRINOLOGÍA',
    'GASTROENTEROLOGÍA',
    'GINECOLOGÍA',
    'NEUROLOGÍA',
    'OFTALMOLOGÍA',
    'ORTOPEDIA',
    'PEDIATRÍA',
    'PSIQUIATRÍA',
    'RADIOLOGÍA',
    'TRAUMATOLOGÍA',
    'UROLOGÍA'
];

// Tipos de cita
const APPOINTMENT_TYPES = [
    'CONSULTA',
    'CONTROL',
    'URGENCIA',
    'SEGUIMIENTO',
    'REVISIÓN',
    'CIRUGÍA',
    'EXAMEN'
];

// Métodos de pago preferidos
const PAYMENT_METHODS = [
    'EFECTIVO',
    'TARJETA DE CRÉDITO',
    'TARJETA DE DÉBITO',
    'TRANSFERENCIA',
    'CHEQUE',
    'PAGO MÓVIL'
];

// Relaciones de persona de referencia
const REFERENCE_RELATIONSHIPS = [
    'PADRE',
    'MADRE',
    'HERMANO',
    'HERMANA',
    'ESPOSO',
    'ESPOSA',
    'HIJO',
    'HIJA',
    'ABUELO',
    'ABUELA',
    'TÍO',
    'TÍA',
    'PRIMO',
    'PRIMA',
    'AMIGO',
    'AMIGA',
    'OTRO'
];

// Límites de caracteres
const CHAR_LIMITS = {
    NAME: 100,
    USERNAME: 30,
    EMAIL: 255,
    PHONE: 30,
    DNI: 20,
    ADDRESS: 255,
    NOTES: 1000,
    SPECIALTY: 100,
    LICENSE_NUMBER: 50,
    MEMBER_NUMBER: 50,
    PAYMENT_METHOD: 100,
    RELATIONSHIP: 50,
    ACTIVITY_TYPE: 100,
    ACTIVITY_DETAIL: 1000,
    TREATMENT: 2000,
    MEDICATION: 100,
    DOSE: 100,
    INSTRUCTIONS: 500,
    STATUS: 30
};

// Límites numéricos
const NUMERIC_LIMITS = {
    MIN_NAME_LENGTH: 2,
    MIN_USERNAME_LENGTH: 3,
    MIN_PASSWORD_LENGTH: 8,
    MIN_DNI_LENGTH: 7,
    MIN_YEAR: 1900,
    MAX_YEAR: 2100,
    MIN_DAY: 1,
    MAX_DAY: 31,
    MIN_MONTH: 1,
    MAX_MONTH: 12,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    MIN_SESSION_TIMEOUT: 5,
    MAX_SESSION_TIMEOUT: 1440
};

module.exports = {
    APPOINTMENT_STATUSES,
    PAYMENT_STATUSES,
    USER_ROLES,
    SECRETARY_SHIFTS,
    MEDICAL_SPECIALTIES,
    APPOINTMENT_TYPES,
    PAYMENT_METHODS,
    REFERENCE_RELATIONSHIPS,
    CHAR_LIMITS,
    NUMERIC_LIMITS
}; 