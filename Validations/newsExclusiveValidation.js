import Joi from 'joi';

export const validateNewsExclusive = Joi.object({
    name: Joi.string().required().messages({
        'string.base': `"name" должно быть строкой`,
        'string.empty': `"name" не может быть пустым`,
        'any.required': `"name" обязательно`
    }),
    brand: Joi.string().required().messages({
        'string.base': `"brand" должно быть строкой`,
        'string.empty': `"brand" не может быть пустым`,
        'any.required': `"brand" обязательно`
    }),
    price: Joi.number().required().messages({
        'number.base': `"price" должно быть числом`,
        'any.required': `"price" обязательно`
    }),
    specifications: Joi.object().required().messages({
        'object.base': `"specifications" должен быть объектом`,
        'any.required': `"specifications" обязательно`
    }),
    advantages: Joi.array().items(
        Joi.object({
            image: Joi.string().required().messages({
                'string.base': `"image" должно быть строкой`,
                'any.required': `"image" обязательно`
            }),
            title: Joi.string().required().messages({
                'string.base': `"title" должно быть строкой`,
                'any.required': `"title" обязательно`
            }),
            text: Joi.string().required().messages({
                'string.base': `"text" должно быть строкой`,
                'any.required': `"text" обязательно`
            })
        })
    ).required().messages({
        'array.base': `"advantages" должен быть массивом`,
        'any.required': `"advantages" обязательно`
    })
});
