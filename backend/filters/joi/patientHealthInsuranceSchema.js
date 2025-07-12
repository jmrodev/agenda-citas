const Joi = require('joi');
const {
    positiveIdSchema,
    createUpdateSchema
} = require('./baseSchemas');
const {
    CHAR_LIMITS
} = require('./constants');

const addPatientHealthInsuranceSchema = Joi.object({
    insurance_id: positiveIdSchema.messages({
        'any.required': 'El ID de la obra social es requerido.'
    }),
    member_number: Joi.string().max(CHAR_LIMITS.MEMBER_NUMBER).optional().allow(null, ''),
    is_primary: Joi.boolean().optional()
});

const updatePatientHealthInsuranceSchema = createUpdateSchema({
    member_number: Joi.string().max(CHAR_LIMITS.MEMBER_NUMBER).optional().allow(null, ''),
    is_primary: Joi.boolean().optional()
});

// Para la ruta de establecer como primaria
const setPrimaryPatientHealthInsuranceSchema = Joi.object({
    insurance_id: positiveIdSchema.messages({
        'any.required': 'El ID de la obra social (insurance_id) es requerido en el body.'
    })
});

module.exports = {
    addPatientHealthInsuranceSchema,
    updatePatientHealthInsuranceSchema,
    setPrimaryPatientHealthInsuranceSchema
};
