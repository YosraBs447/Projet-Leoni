import express from 'express';
import { body } from 'express-validator';
import { sendVerificationCode, verifyCode } from '../controllers/passwordController.js';
import { resetPassword } from '../controllers/passwordController.js';


const router = express.Router();

router.post(
    '/forgot-password',
    [body('email').isEmail().withMessage('Email invalide.')], // Validation email
    sendVerificationCode
);

router.post(
    '/verify-code',
    [
        body('email').isEmail().withMessage('Email invalide.'),
        body('code').isLength({ min: 6, max: 6 }).withMessage('Le code doit être de 6 chiffres.')
    ],
    verifyCode
);

// Route pour la réinitialisation du mot de passe
router.post(
    '/reset-password',
    [
        body('email').isEmail().withMessage('Email invalide.'),
        body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.')
    ],
    resetPassword
);

export default router;
