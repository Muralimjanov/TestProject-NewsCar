import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import config from "config";
import { User } from "../Models/UserModels.js";
import { loginSchema } from "../Validations/AuthValidation.js";
import nodemailer from "nodemailer";

const JWT_SECRET = config.get("JWT_SECRET");

const pendingUsers = new Map();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: config.get("EMAIL_USER"),
        pass: config.get("EMAIL_PASS"),
    },
});

const sendVerificationEmail = async (email, token) => {
    const mailOptions = {
        to: email,
        subject: "Подтверждение Email",
        text: `Ваш код подтверждения: ${token}`,
    };
    await transporter.sendMail(mailOptions);
};

const loadRoleHandlers = async () => {
    const {
        handleUserRegistration,
        handleCompanyRegistration,
        handleAdminRegistration,
    } = await import("../services/auth/registerHandlers.js");

    return {
        user: handleUserRegistration,
        company: handleCompanyRegistration,
        admin: handleAdminRegistration,
    };
};

export const register = async (req, res) => {
    try {
        const { role, password, confirmPassword } = req.body;

        const roleHandlers = await loadRoleHandlers();

        if (!roleHandlers[role]) {
            return res.status(400).json({ message: "Недопустимая роль" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Пароли не совпадают" });
        }

        const validated = await roleHandlers[role](req.body);

        const existingUser = await User.findOne({ email: validated.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email уже зарегистрирован" });
        }

        const verificationCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const hashedPassword = await bcrypt.hash(validated.password, 10);

        pendingUsers.set(validated.email, {
            ...validated,
            password: hashedPassword,
            verificationCode,
            expiresAt: Date.now() + 10 * 60 * 1000,
        });

        await sendVerificationEmail(validated.email, verificationCode);

        res.status(200).json({ message: "Код подтверждения отправлен на email" });
    } catch (err) {
        res.status(400).json({ message: err.details?.[0]?.message || err.message });
        console.error(err);
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        const temp = pendingUsers.get(email);
        if (!temp) {
            return res
                .status(400)
                .json({ message: "Код не найден. Зарегистрируйтесь снова" });
        }

        if (Date.now() > temp.expiresAt) {
            pendingUsers.delete(email);
            return res.status(400).json({ message: "Код истёк" });
        }

        if (temp.verificationCode !== code) {
            return res.status(400).json({ message: "Неверный код подтверждения" });
        }

        const { verificationCode, expiresAt, ...userData } = temp;

        userData.emailVerified = true;

        const user = new User(userData);

        await user.save();
        pendingUsers.delete(email);

        res.status(201).json({ message: "Email подтверждён. Пользователь создан" });
    } catch (err) {
        res.status(500).json({ message: "Ошибка при подтверждении email" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = await loginSchema.validateAsync(req.body);

        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        if (!user.emailVerified) {
            return res
                .status(401)
                .json({ message: "Подтвердите вашу почту перед входом" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Неверный пароль" });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        const { password: _, ...userData } = user.toObject();

        res.json({
            token,
            user: userData,
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
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        const token = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetTokenExpires = Date.now() + 1000 * 60 * 15;

        await user.save();

        res.json({ message: "Токен создан", token });
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Пароли не совпадают" });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res
                .status(400)
                .json({ message: "Токен недействителен или просрочен" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetTokenExpires = undefined;

        await user.save();

        res.json({ message: "Пароль успешно обновлён" });
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

export const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        if (user.emailVerified) {
            return res.status(400).json({ message: "Email уже подтверждён" });
        }

        const newToken = crypto.randomBytes(20).toString("hex");
        user.emailVerificationToken = newToken;
        await user.save();

        await sendVerificationEmail(user.email, newToken);

        res.json({ message: "Письмо для подтверждения повторно отправлено" });
    } catch (err) {
        res
            .status(500)
            .json({ message: "Ошибка сервера при повторной отправке email" });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
};