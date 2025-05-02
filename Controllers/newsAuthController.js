import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from 'config';
import { User } from '../Models/newsUserModel.js';
import { fetchCompanyInfoByInn } from '../services/innService.js';
import {
    registerUserSchema,
    registerCompanySchema,
    registerAdminSchema,
    loginSchema
} from '../Validations/newsAuthValidation.js';
import { validateInn } from '../utils/validateInn.js';
import nodemailer from 'nodemailer';

const JWT_SECRET = config.get("JWT_SECRET");

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.get("EMAIL_USER"),
        pass: config.get("EMAIL_PASS")
    }
});

const sendVerificationEmail = async (email, token) => {
    const mailOptions = {
        to: email,
        subject: 'Подтверждение Email',
        text: `Ваш код подтверждения: ${token}`
    };

    await transporter.sendMail(mailOptions);
};


export const register = async (req, res) => {
    try {
        const { role, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Пароли не совпадают' });
        }

        let validated;

        if (role === 'user') {
            validated = await registerUserSchema.validateAsync(req.body);
            if (!validated.termsAccepted) {
                return res.status(400).json({ message: 'Вы должны согласиться с условиями пользовательского соглашения' });
            }
        } else if (role === 'company') {
            validated = await registerCompanySchema.validateAsync(req.body);
            if (!validated.authorizedRepresentative || !validated.termsAccepted) {
                return res.status(400).json({ message: 'Подтвердите, что вы представитель и согласны с условиями' });
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
        } else if (role === 'admin') {
            validated = await registerAdminSchema.validateAsync(req.body);
        } else {
            return res.status(400).json({ message: 'Недопустимая роль' });
        }

        const existingUser = await User.findOne({ email: validated.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email уже зарегистрирован' });
        }

        const hashedPassword = await bcrypt.hash(validated.password, 10);
        const emailVerificationToken = crypto.randomBytes(20).toString('hex');

        const user = new User({
            ...validated,
            password: hashedPassword,
            emailVerified: false,
            emailVerificationToken
        });

        await user.save();

        const mailOptions = {
            to: user.email,
            subject: 'Подтверждение Email',
            text: `Ваш код подтверждения: ${emailVerificationToken}`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Регистрация успешна. Проверьте вашу почту для подтверждения.' });
    } catch (err) {
        res.status(400).json({ message: err.details?.[0]?.message || err.message });
        console.error(err);
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({ emailVerificationToken: token });
        if (!user) {
            return res.status(400).json({ message: 'Неверный или просроченный токен' });
        }

        user.emailVerified = true;
        user.emailVerificationToken = undefined;
        await user.save();

        res.json({ message: 'Email подтверждён успешно' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера при подтверждении email' });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password, role } = await loginSchema.validateAsync(req.body);

        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        if (!user.emailVerified) {
            return res.status(401).json({ message: 'Подтвердите вашу почту перед входом' });
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

export const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        if (user.emailVerified) {
            return res.status(400).json({ message: 'Email уже подтверждён' });
        }

        const newToken = crypto.randomBytes(20).toString('hex');
        user.emailVerificationToken = newToken;
        await user.save();

        await sendVerificationEmail(user.email, newToken);

        res.json({ message: 'Письмо для подтверждения повторно отправлено' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера при повторной отправке email' });
    }
};
