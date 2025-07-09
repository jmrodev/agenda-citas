const Joi = require('joi');

const healthInsuranceBaseSchema = {
    name: Joi.string().max(100).required().messages({
        'string.empty': 'El nombre de la obra social es requerido.',
        'any.required': 'El nombre de la obra social es requerido.'
    }),
    code: Joi.string().max(50).optional().allow(null, ''),
    address: Joi.string().max(255).optional().allow(null, ''),
    phone: Joi.string().pattern(/^[0-9+\-\s()]*$/).max(30).optional().allow(null, ''),
    email: Joi.string().email().optional().allow(null, ''),
    status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE').optional()
};

const createHealthInsuranceSchema = Joi.object(healthInsuranceBaseSchema);

const updateHealthInsuranceSchema = Joi.object({
    name: Joi.string().max(100).optional(),
    code: Joi.string().max(50).optional().allow(null, ''),
    address: Joi.string().max(255).optional().allow(null, ''),
    phone: Joi.string().pattern(/^[0-9+\-\s()]*$/).max(30).optional().allow(null, ''),
    email: Joi.string().email().optional().allow(null, ''),
    status: Joi.string().valid('ACTIVE', 'INACTIVE').optional()
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar la obra social.'
});

module.exports = {
    createHealthInsuranceSchema,
    updateHealthInsuranceSchema
};
