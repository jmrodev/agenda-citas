const Joi = require('joi');
const {
    nameSchema,
    phoneSchema,
    emailSchema,
    addressSchema,
    createUpdateSchema
} = require('./baseSchemas');
const {
    CHAR_LIMITS
} = require('./constants');

const healthInsuranceBaseSchema = {
    name: Joi.string().max(CHAR_LIMITS.NAME).required().messages({
        'string.empty': 'El nombre de la obra social es requerido.',
        'any.required': 'El nombre de la obra social es requerido.'
    }),
    code: Joi.string().max(CHAR_LIMITS.LICENSE_NUMBER).optional().allow(null, ''),
    address: addressSchema,
    phone: phoneSchema,
    email: emailSchema,
    status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE').optional()
};

const createHealthInsuranceSchema = Joi.object(healthInsuranceBaseSchema);

const updateHealthInsuranceSchema = createUpdateSchema({
    name: Joi.string().max(CHAR_LIMITS.NAME).optional(),
    code: Joi.string().max(CHAR_LIMITS.LICENSE_NUMBER).optional().allow(null, ''),
    address: addressSchema,
    phone: phoneSchema,
    email: emailSchema,
    status: Joi.string().valid('ACTIVE', 'INACTIVE').optional()
});

module.exports = {
    createHealthInsuranceSchema,
    updateHealthInsuranceSchema
};
