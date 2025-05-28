import Joi from 'joi';

export const dealSchema = Joi.object({
    auctionId: Joi.string().length(24).required().messages({
        'string.base': `"auctionId" должен быть строкой`,
        'string.length': `"auctionId" должен быть ObjectId (24 символа)`,
        'any.required': `"auctionId" обязателен`
    }),

    buyerId: Joi.string().length(24).required().messages({
        'string.base': `"buyerId" должен быть строкой`,
        'string.length': `"buyerId" должен быть ObjectId (24 символа)`,
        'any.required': `"buyerId" обязателен`
    }),

    finalPrice: Joi.number().positive().required().messages({
        'number.base': `"finalPrice" должен быть числом`,
        'number.positive': `"finalPrice" должен быть положительным`,
        'any.required': `"finalPrice" обязателен`
    }),

    status: Joi.string().valid('processing', 'unpaid', 'paid').default('processing').messages({
        'any.only': `"status" должен быть одним из: processing, unpaid, paid`
    }),

    documents: Joi.array().items(Joi.string().uri()).messages({
        'string.uri': `"documents" должен содержать корректные URL`
    }),

    role: Joi.string().valid('admin').optional()
});
