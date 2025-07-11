const Joi = require('joi');

// Helper para validar fecha que puede ser string YYYY-MM-DD o objeto {day, month, year}
const dateOrDateObjectSchema = Joi.alternatives().try(
    Joi.string().isoDate().messages({
        'string.isoDate': 'El formato de fecha debe ser YYYY-MM-DD.'
    }),
    Joi.object({
        day: Joi.number().integer().min(1).max(31).required(),
        month: Joi.number().integer().min(1).max(12).required(),
        year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required()
    }).required()
).messages({
    'alternatives.types': 'La fecha debe ser una cadena YYYY-MM-DD o un objeto con propiedades day, month, year.'
});

const medicalHistoryBaseSchema = {
    patient_id: Joi.number().integer().positive().required().messages({
        'any.required': 'El ID del paciente es requerido.'
    }),
    doctor_id: Joi.number().integer().positive().required().messages({
        'any.required': 'El ID del doctor es requerido.'
    }),
    // El controlador espera 'date' en el body
    date: dateOrDateObjectSchema.required().messages({
        'any.required': 'La fecha del historial es requerida.'
    }),
    diagnosis: Joi.string().max(1000).required().messages({
        'string.empty': 'El diagnóstico es requerido.',
        'any.required': 'El diagnóstico es requerido.'
    }),
    treatment: Joi.string().max(2000).optional().allow(null, ''),
    notes: Joi.string().max(2000).optional().allow(null, '')
};

const createMedicalHistorySchema = Joi.object(medicalHistoryBaseSchema);

const updateMedicalHistorySchema = Joi.object({
    patient_id: Joi.number().integer().positive().optional(), // Generalmente no se cambia
    doctor_id: Joi.number().integer().positive().optional(),   // Generalmente no se cambia
    date: dateOrDateObjectSchema.optional(),
    diagnosis: Joi.string().max(1000).optional(),
    treatment: Joi.string().max(2000).optional().allow(null, ''),
    notes: Joi.string().max(2000).optional().allow(null, '')
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar el historial médico.'
});

// Esquema para medicamentos prescritos dentro de un historial médico
const prescribedMedicationSchema = Joi.object({
    // record_id se tomará del parámetro de la ruta, no del body
    medication_name: Joi.string().max(255).required().messages({
        'string.empty': 'El nombre del medicamento es requerido.',
        'any.required': 'El nombre del medicamento es requerido.'
    }),
    dose: Joi.string().max(100).optional().allow(null, ''),
    instructions: Joi.string().max(500).optional().allow(null, '')
});

const updatePrescribedMedicationSchema = Joi.object({
    medication_name: Joi.string().max(255).optional(),
    dose: Joi.string().max(100).optional().allow(null, ''),
    instructions: Joi.string().max(500).optional().allow(null, '')
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar el medicamento prescrito.'
});


module.exports = {
    createMedicalHistorySchema,
    updateMedicalHistorySchema,
    createPrescribedMedicationSchema: prescribedMedicationSchema, // Renombrado para claridad
    updatePrescribedMedicationSchema
};
