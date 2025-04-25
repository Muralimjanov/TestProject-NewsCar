import Joi from 'joi';

export const registerUserSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.valid(Joi.ref('password')).required().messages({
        'any.only': 'Пароли не совпадают',
    }),
    termsAccepted: Joi.boolean().valid(true).required(),
    role: Joi.string().valid('user').required()
});

export const registerCompanySchema = Joi.object({
    inn: Joi.string().pattern(/^\d{10,12}$/).required(),
    organizationName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    representativeFullName: Joi.string().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.valid(Joi.ref('password')).required().messages({
        'any.only': 'Пароли не совпадают',
    }),
    authorizedRepresentative: Joi.boolean().valid(true).required(),
    termsAccepted: Joi.boolean().valid(true).required(),
    role: Joi.string().valid('company').required()
});

export const loginSchema = Joi.object({
    role: Joi.string().valid('user', 'company', 'admin').required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
});
