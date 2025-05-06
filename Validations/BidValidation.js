import Joi from 'joi';

export const bidSchema = Joi.object({
    auctionId: Joi.string().required(),
    amount: Joi.number().positive().required(),
    isAutoBid: Joi.boolean().default(false),
    maxAutoBidAmount: Joi.number().positive().when('isAutoBid', {
        is: true,
        then: Joi.required(),
        otherwise: Joi.optional()
    })
});
