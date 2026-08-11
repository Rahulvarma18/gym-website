import express from 'express';
import { body } from 'express-validator';
import {
    signup,
    login,
    googleAuth,
    getCurrentUser,
    updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post(
    '/signup',
    [
        body('firstName').trim().notEmpty().withMessage('First name is required'),
        body('lastName').trim().notEmpty().withMessage('Last name is required'),
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('phone')
            .matches(/^[0-9]{10,}$/)
            .withMessage('Please provide a valid phone number'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    ],
    signup
);

// @route   POST /api/auth/login
// @desc    Login user
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    login
);

// @route   POST /api/auth/google
// @desc    Google OAuth login/signup
router.post(
    '/google',
    [body('token').notEmpty().withMessage('Google token is required')],
    googleAuth
);

// @route   GET /api/auth/me
// @desc    Get current logged in user
router.get('/me', protect, getCurrentUser);

// @route   PUT /api/auth/profile
// @desc    Update user profile
router.put(
    '/profile',
    protect,
    [
        body('firstName').trim().notEmpty().withMessage('First name is required'),
        body('lastName').trim().notEmpty().withMessage('Last name is required'),
        body('phone')
            .matches(/^[0-9]{10,}$/)
            .withMessage('Please provide a valid phone number'),
    ],
    updateProfile
);

export default router;