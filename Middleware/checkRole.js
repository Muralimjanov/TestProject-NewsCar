// export const checkRole = (role) => {
//     return (req, res, next) => {
//         if (!req.user || req.user.role !== role) {
//             return res.status(403).json({ message: 'Доступ запрещен' });
//         }
//         next();
//     };
// };


export const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(500).json({ message: 'Ошибка сервера: пользователь не определён' });
        }

        const rolesToCheck = Array.isArray(allowedRoles) 
            ? allowedRoles 
            : [allowedRoles];

        if (!rolesToCheck.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Доступ запрещён. Требуемые роли: ${rolesToCheck.join(', ')}`,
                yourRole: req.user.role
            });
        }

        next();
    };
};