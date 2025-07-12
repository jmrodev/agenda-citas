const Joi = require('joi');
const {
    nameSchema,
    optionalNameSchema,
    dniSchema,
    optionalDniSchema,
    birthDateSchema,
    emailSchema,
    requiredEmailSchema,
    phoneSchema,
    addressSchema,
    optionalPositiveIdSchema,
    positiveIdsArraySchema,
    passwordSchema,
    createUpdateSchema,
    createRoleConditionalSchema
} = require('./baseSchemas');
const {
    CHAR_LIMITS,
    REFERENCE_RELATIONSHIPS,
    PAYMENT_METHODS
} = require('./constants');

// Esquema para la persona de referencia
const nestedReferencePersonSchema = Joi.object({
    name: optionalNameSchema,
    last_name: optionalNameSchema,
    phone: phoneSchema,
    relationship: Joi.string().valid(...REFERENCE_RELATIONSHIPS).max(CHAR_LIMITS.RELATIONSHIP).optional().allow(null, ''),
    address: addressSchema
});

// Esquema base para pacientes
const patientBaseSchemaFields = {
    first_name: nameSchema.messages({
        'string.empty': 'El nombre es requerido.',
        'any.required': 'El nombre es requerido.'
    }),
    last_name: nameSchema.messages({
        'string.empty': 'El apellido es requerido.',
        'any.required': 'El apellido es requerido.'
    }),
    dni: dniSchema,
    birth_date: birthDateSchema.required().messages({
        'any.required': 'La fecha de nacimiento es requerida.'
    }),
    email: emailSchema,
    phone: phoneSchema,
    address: addressSchema,
    health_insurance_id: optionalPositiveIdSchema,
    health_insurance_member_number: Joi.string().max(CHAR_LIMITS.MEMBER_NUMBER).optional().allow(null, ''),
    preferred_payment_methods: Joi.string().valid(...PAYMENT_METHODS).max(CHAR_LIMITS.PAYMENT_METHOD).optional().allow(null, ''),
    doctor_ids: positiveIdsArraySchema,
    reference_person: nestedReferencePersonSchema.optional().allow(null)
};

// Esquema para crear un paciente con validación condicional por rol
const createPatientSchema = createRoleConditionalSchema(patientBaseSchemaFields, {
    role: 'secretary',
    then: Joi.object({
        doctor_ids: positiveIdsArraySchema.min(1).required().messages({
            'array.min': 'Debe asignar al menos un doctor al paciente cuando crea como secretaria.',
            'any.required': 'La asignación de doctores es requerida para secretarias.'
        })
    })
});

// Esquema para actualizar un paciente
const updatePatientSchema = createUpdateSchema({
    first_name: optionalNameSchema,
    last_name: optionalNameSchema,
    dni: optionalDniSchema,
    birth_date: birthDateSchema.optional(),
    email: emailSchema,
    phone: phoneSchema,
    address: addressSchema,
    health_insurance_id: optionalPositiveIdSchema,
    health_insurance_member_number: Joi.string().max(CHAR_LIMITS.MEMBER_NUMBER).optional().allow(null, ''),
    preferred_payment_methods: Joi.string().valid(...PAYMENT_METHODS).max(CHAR_LIMITS.PAYMENT_METHOD).optional().allow(null, ''),
    doctor_ids: positiveIdsArraySchema,
    reference_person: nestedReferencePersonSchema.optional().allow(null)
});

// Esquema para registrar paciente con usuario
const registerPatientWithUserSchema = Joi.object({
    // Campos del paciente
    first_name: nameSchema,
    last_name: nameSchema,
    dni: dniSchema,
    birth_date: birthDateSchema.required(),
    email: requiredEmailSchema.messages({
        'string.empty': 'El email es requerido para la cuenta de usuario.',
        'any.required': 'El email es requerido para la cuenta de usuario.'
    }),
    phone: phoneSchema,
    address: addressSchema,
    // Campos del usuario
    password: passwordSchema,
    // Otros campos opcionales del paciente
    health_insurance_id: optionalPositiveIdSchema,
    health_insurance_member_number: Joi.string().max(CHAR_LIMITS.MEMBER_NUMBER).optional().allow(null, ''),
    preferred_payment_methods: Joi.string().valid(...PAYMENT_METHODS).max(CHAR_LIMITS.PAYMENT_METHOD).optional().allow(null, ''),
    doctor_ids: positiveIdsArraySchema,
});

// Esquema para actualizar datos del propio paciente
const updateMyPatientProfileSchema = updatePatientSchema;

// Esquema para actualizar los doctores de un paciente
const updatePatientDoctorsSchema = Joi.object({
    doctor_ids: positiveIdsArraySchema.min(1).required().messages({
        'array.min': 'Debe asignar al menos un doctor.',
        'any.required': 'La lista de IDs de doctores es requerida.'
    })
});

module.exports = {
    createPatientSchema,
    updatePatientSchema,
    registerPatientWithUserSchema,
    updateMyPatientProfileSchema,
    updatePatientDoctorsSchema
};
