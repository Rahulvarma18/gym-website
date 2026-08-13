import express from 'express';
import { body } from 'express-validator';
import {
    registerForPlan,
    getUserPlans,
    getRegistrationDetails,
    renewRegistration,
    cancelRegistration,
    activateRegistration,
    rejectRegistration,
} from '../controllers/registrationController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/registrations
// @desc    Register user for a plan
router.post(
    '/',
    protect,
    [
        body('paymentMethod')
            .optional()
            .isIn(['credit_card', 'debit_card', 'upi', 'cash', 'online'])
            .withMessage('Invalid payment method'),
    ],
    registerForPlan
);

// @route   GET /api/registrations/my-plans
// @desc    Get user's registered plans
router.get('/my-plans', protect, getUserPlans);

// @route   GET /api/registrations/:id
// @desc    Get registration details
router.get('/:id', protect, getRegistrationDetails);

// @route   PUT /api/registrations/:id/renew
// @desc    Renew a plan registration
router.put('/:id/renew', protect, renewRegistration);

// @route   PUT /api/registrations/:id/cancel
// @desc    Cancel a plan registration
router.put('/:id/cancel', protect, cancelRegistration);

// @route   PUT /api/registrations/:id/activate
// @desc    Activate pending registration (Admin only)
router.put('/:id/activate', protect, isAdmin, activateRegistration);

// @route   DELETE /api/registrations/:id/reject
// @desc    Reject a pending plan request - permanently deletes it (Admin only)
router.delete('/:id/reject', protect, isAdmin, rejectRegistration);

export default router;