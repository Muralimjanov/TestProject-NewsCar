import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        message: 'Слишком много попыток входа. Попробуйте позже.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
