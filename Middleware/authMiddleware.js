import jwt from 'jsonwebtoken';
import { User } from '../Models/UserModels.js';
import config from 'config';

export const checkAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Токен не предоставлен' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.get("JWT_SECRET"));
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Пользователь не найден' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Неверный токен' });
    }
};

export const role = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ message: 'Доступ запрещён' });
        }
        next();
    };
};
