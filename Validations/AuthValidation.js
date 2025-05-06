import Joi from 'joi';

export const registerUserSchema = Joi.object({
    role: Joi.string().valid('user').required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    termsAccepted: Joi.boolean().valid(true).required()
}).meta({ role: 'user' });

export const registerCompanySchema = Joi.object({
    role: Joi.string().valid('company').required(),
    inn: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    authorizedRepresentative: Joi.boolean().valid(true).required(),
    representativeFullName: Joi.string().required(),
    termsAccepted: Joi.boolean().valid(true).required()
}).meta({ role: 'company' });

export const registerAdminSchema = Joi.object({
    role: Joi.string().valid('admin').required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
}).meta({ role: 'admin' });

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('user', 'company', 'admin').required()
});

export const resendVerificationValidation = Joi.object({
    email: Joi.string().email().required()
});

export const forgotPasswordValidation = Joi.object({
    email: Joi.string().email().required()
});

export const resetPasswordValidation = Joi.object({
    password: Joi.string().min(6).required()
});