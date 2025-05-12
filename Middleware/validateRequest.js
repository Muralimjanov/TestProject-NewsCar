export const validateRequest = (schemasByRole) => {
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
