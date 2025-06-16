import Joi from 'joi';

export const salesmanValidations = Joi.object({
    companyName: Joi.string().required(),
    city: Joi.string().required(),
    contactPerson: Joi.string().required(),
    inn: Joi.string().pattern(/^\d{10,12}$/).required(),
    description: Joi.string().required(),
    documentsLink: Joi.string().uri().required(),
    phone: Joi.string().pattern(/^\+?\d{10,15}$/).required(),
});
