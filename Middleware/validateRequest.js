export const validateRequest = (...schemas) => {
    return (req, res, next) => {
        const role = req.body.role;

        if (!role) {
            return res.status(400).json({ message: 'Роль обязательна' });
        }

        const schema = schemas.find(s => {
            try {
                const roleSchema = s.extract('role');
                const { value } = roleSchema.validate(role);
                return !value.error;
            } catch (err) {
                return false;
            }
        });

        if (!schema) {
            return res.status(400).json({ message: 'Неверная роль или схема не найдена' });
        }

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        next();
    };
};
