import { Router } from 'express';
import {
    login,
    register,
    forgotPassword,
    resetPassword
} from '../Controllers/newsAuthController.js';
import { loginLimiter } from '../Middleware/loginLimiter.js';

const router = Router();

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


export default router;
