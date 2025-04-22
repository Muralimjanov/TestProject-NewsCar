import Joi from 'joi';

export const validateNewsAdvice = Joi.object({
    title: Joi.string().required().messages({
        'string.base': `"title" должно быть строкой`,
        'string.empty': `"title" не может быть пустым`,
        'any.required': `"title" обязательно`
    }),
    mainText: Joi.string().required().messages({
        'string.base': `"mainText" должно быть строкой`,
        'string.empty': `"mainText" не может быть пустым`,
        'any.required': `"mainText" обязательно`
    }),
    article: Joi.string().required().messages({
        'string.base': `"article" должно быть строкой`,
        'string.empty': `"article" не может быть пустым`,
        'any.required': `"article" обязательно`
    })
});
