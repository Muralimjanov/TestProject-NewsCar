import Joi from 'joi';

export const auctionSchema = Joi.object({
    carName: Joi.string().required(),
    lotNumber: Joi.string().optional(),
    carImageUrls: Joi.array().items(Joi.string().uri()),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()),
    mileage: Joi.number().min(0),
    steering: Joi.string().optional(),
    maxSpeed: Joi.number().optional(),
    cylinders: Joi.number().optional(),
    originCountry: Joi.string().optional(),
    horsepower: Joi.number().optional(),

    startPrice: Joi.number().required(),
    currentPrice: Joi.number().min(0).optional(),
    startTime: Joi.date().required(),
    endTime: Joi.date().greater(Joi.ref('startTime')).required(),
    status: Joi.string().valid('upcoming', 'active', 'ended').optional(),
    category: Joi.array().items(Joi.string()).optional()
});
