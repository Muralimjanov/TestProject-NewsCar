import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from 'config';
import { User } from '../Models/newsUserModel.js';
import { fetchCompanyInfoByInn } from '../services/innService.js';
import {
    registerUserSchema,
    registerCompanySchema,
    loginSchema
} from '../Validations/newsAuthValidation.js';
import { validateInn } from '../utils/validateInn.js';

const JWT_SECRET = config.get("JWT_SECRET");

export const register = async (req, res) => {
    try {
        const { role, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Пароли не совпадают' });
        }

        const validated = role === 'user'
            ? await registerUserSchema.validateAsync(req.body)
            : await registerCompanySchema.validateAsync(req.body);

        if (!validated.termsAccepted) {
            return res.status(400).json({ message: 'Вы должны согласиться с условиями пользовательского соглашения' });
        }

        if (role === 'company') {
            if (!validated.authorizedRepresentative) {
                return res.status(400).json({ message: 'Подтвердите, что вы представитель организации' });
            }

            if (!validateInn(validated.inn)) {
                return res.status(400).json({ message: 'Некорректный ИНН' });
            }

            const innCheck = await fetchCompanyInfoByInn(validated.inn);
            if (!innCheck.success) {
                return res.status(400).json({ message: innCheck.message });
            }

            validated.organizationName = innCheck.name;

            const existingInn = await User.findOne({ inn: validated.inn });
            if (existingInn) {
                return res.status(400).json({ message: 'Компания с таким ИНН уже зарегистрирована' });
            }
        }

        const existingUser = await User.findOne({ email: validated.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email уже зарегистрирован' });
        }

        const hashedPassword = await bcrypt.hash(validated.password, 10);

        const user = new User({
            ...validated,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({ message: 'Регистрация успешна. Теперь войдите в систему.' });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            message: err.details?.[0]?.message || err.message || 'Ошибка регистрации'
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password, role } = await loginSchema.validateAsync(req.body);

        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Неверный пароль' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(400).json({ message: err.details?.[0]?.message || err.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetTokenExpires = Date.now() + 1000 * 60 * 15;

        await user.save();

        res.json({ message: 'Токен создан', token });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Пароли не совпадают' });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Токен недействителен или просрочен' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetTokenExpires = undefined;

        await user.save();

        res.json({ message: 'Пароль успешно обновлён' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
