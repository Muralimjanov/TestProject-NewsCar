export const validateRequestByRole = (schemasByRole) => {
    return async (req, res, next) => {
        const role = req.body.role;
        const schema = schemasByRole[role];

        if (!schema) {
            console.error(`Недопустимая роль: ${role}`);
            return res.status(400).json({ message: 'Недопустимая роль для валидации' });
        }

        try {
            await schema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (err) {
            const errors = err.details?.map(detail => detail.message);
            console.error('Ошибки валидации:', errors);
            return res.status(400).json({
                message: 'Ошибка валидации',
                errors
            });
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

