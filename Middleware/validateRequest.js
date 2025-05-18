export const validateRequestByRole = (schemasByRole) => {
    return async (req, res, next) => {
        const role = req.body.role;
        if (!schemasByRole[role]) {
            return res.status(400).json({ message: 'Недопустимая роль для валидации' });
        }

        try {
            await schemasByRole[role].validateAsync(req.body, { abortEarly: false });
            next();
        } catch (err) {
            const errorMessage = err.details?.[0]?.message || 'Ошибка валидации';
            return res.status(400).json({ message: errorMessage });
        }
    };
};

export const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (err) {
            return res.status(400).json({
                message: 'Ошибка валидации',
                errors: err.details?.map(detail => detail.message)
            });
        }
    };
};

