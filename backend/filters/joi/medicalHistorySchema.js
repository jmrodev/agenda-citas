const Joi = require('joi');
const {
    positiveIdSchema,
    optionalPositiveIdSchema,
    dateOrDateObjectSchema,
    notesSchema,
    createUpdateSchema
} = require('./baseSchemas');
const {
    CHAR_LIMITS
} = require('./constants');

const medicalHistoryBaseSchema = {
    patient_id: positiveIdSchema.messages({
        'any.required': 'El ID del paciente es requerido.'
    }),
    doctor_id: positiveIdSchema.messages({
        'any.required': 'El ID del doctor es requerido.'
    }),
    date: dateOrDateObjectSchema.required().messages({
        'any.required': 'La fecha del historial es requerida.'
    }),
    diagnosis: Joi.string().max(CHAR_LIMITS.NOTES).required().messages({
        'string.empty': 'El diagnóstico es requerido.',
        'any.required': 'El diagnóstico es requerido.'
    }),
    treatment: Joi.string().max(CHAR_LIMITS.TREATMENT).optional().allow(null, ''),
    notes: Joi.string().max(CHAR_LIMITS.TREATMENT).optional().allow(null, '')
};

const createMedicalHistorySchema = Joi.object(medicalHistoryBaseSchema);

const updateMedicalHistorySchema = createUpdateSchema({
    patient_id: optionalPositiveIdSchema,
    doctor_id: optionalPositiveIdSchema,
    date: dateOrDateObjectSchema.optional(),
    diagnosis: Joi.string().max(CHAR_LIMITS.NOTES).optional(),
    treatment: Joi.string().max(CHAR_LIMITS.TREATMENT).optional().allow(null, ''),
    notes: Joi.string().max(CHAR_LIMITS.TREATMENT).optional().allow(null, '')
});

// Esquema para medicamentos prescritos dentro de un historial médico
const prescribedMedicationSchema = Joi.object({
    medication_name: Joi.string().max(CHAR_LIMITS.MEDICATION).required().messages({
        'string.empty': 'El nombre del medicamento es requerido.',
        'any.required': 'El nombre del medicamento es requerido.'
    }),
    dose: Joi.string().max(CHAR_LIMITS.DOSE).optional().allow(null, ''),
    instructions: Joi.string().max(CHAR_LIMITS.INSTRUCTIONS).optional().allow(null, '')
});

const updatePrescribedMedicationSchema = createUpdateSchema({
    medication_name: Joi.string().max(CHAR_LIMITS.MEDICATION).optional(),
    dose: Joi.string().max(CHAR_LIMITS.DOSE).optional().allow(null, ''),
    instructions: Joi.string().max(CHAR_LIMITS.INSTRUCTIONS).optional().allow(null, '')
});

module.exports = {
    createMedicalHistorySchema,
    updateMedicalHistorySchema,
    createPrescribedMedicationSchema: prescribedMedicationSchema,
    updatePrescribedMedicationSchema
};
