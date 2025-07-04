import { Router } from "express";
import {
    login,
    register,
    forgotPassword,
    resetPassword,
    resendVerificationEmail,
    verifyEmail,
    getUserById
} from "../Controllers/AuthControllers.js";

import { loginLimiter } from "../Middleware/loginLimiter.js";
import {
    validateRequestByRole,
    validateRequest,
} from "../Middleware/validateRequest.js";

import {
    registerUserSchema,
    registerAdminSchema,
    registerCompanySchema,
    loginSchema,
    forgotPasswordValidation,
    resetPasswordValidation,
    resendVerificationValidation,
} from "../Validations/AuthValidation.js";

const router = Router();

router.post("/verify-email/", verifyEmail);
router.post(
    "/register",
    validateRequestByRole({
        user: registerUserSchema,
        company: registerCompanySchema,
        admin: registerAdminSchema,
    }),
    register
);

router.post("/login", validateRequest(loginSchema), login);
router.post(
    "/forgot-password",
    validateRequest(forgotPasswordValidation),
    forgotPassword
);
router.post(
    "/reset-password/:token",
    validateRequest(resetPasswordValidation),
    resetPassword
);
router.post(
    "/resend-verification",
    validateRequest(resendVerificationValidation),
    resendVerificationEmail
);
router.get(
    "/user/:userId",
    getUserById
)

export default router;
